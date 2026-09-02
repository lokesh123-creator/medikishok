from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from config.database import (
    reports_collection,
    users_collection,
)

from services.sarvam_document import (
    digitise_document,
    extract_medical_information,
)


# =========================================================
# ROUTER
# =========================================================

router = APIRouter(
    prefix="/api/reports",
    tags=["Reports"],
)


# =========================================================
# LANGUAGE MAP
# =========================================================

LANGUAGE_MAP = {
    "en": "en-IN",
    "te": "te-IN",
    "hi": "hi-IN",
}


# =========================================================
# ALLOWED FILE TYPES
# =========================================================

ALLOWED_CONTENT_TYPES = {
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
}


# =========================================================
# MAX FILE SIZE
# =========================================================

MAX_FILE_SIZE = 10 * 1024 * 1024


# =========================================================
# UPLOAD MEDICAL REPORT
# =========================================================

@router.post("/upload")
async def upload_report(
    patient_id: str = Form(...),
    file: UploadFile = File(...),
    language: str = Form("en"),
):
    """
    Upload and process a medical report.

    Flow:

        Patient
           ↓
        Upload Report
           ↓
        Sarvam OCR
           ↓
        Medical Extraction
           ↓
        MongoDB
           ↓
        Return structured data
    """

    try:

        # =================================================
        # 1. VALIDATE PATIENT ID
        # =================================================

        if not ObjectId.is_valid(patient_id):

            raise HTTPException(
                status_code=400,
                detail="Invalid patient_id"
            )

        patient_object_id = ObjectId(patient_id)

        # =================================================
        # 2. CHECK PATIENT EXISTS
        # =================================================

        patient = users_collection.find_one(
            {
                "_id": patient_object_id
            }
        )

        if not patient:

            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

        # =================================================
        # 3. VALIDATE LANGUAGE
        # =================================================

        if language not in LANGUAGE_MAP:

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Unsupported language: {language}. "
                    f"Supported: {list(LANGUAGE_MAP.keys())}"
                ),
            )

        sarvam_language = LANGUAGE_MAP[language]

        # =================================================
        # 4. VALIDATE FILE NAME
        # =================================================

        if not file.filename:

            raise HTTPException(
                status_code=400,
                detail="File name is missing",
            )

        # =================================================
        # 5. VALIDATE FILE TYPE
        # =================================================

        if file.content_type not in ALLOWED_CONTENT_TYPES:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Unsupported file type. "
                    "Please upload PDF, JPG, JPEG or PNG."
                ),
            )

        # =================================================
        # 6. READ FILE
        # =================================================

        file_bytes = await file.read()

        if not file_bytes:

            raise HTTPException(
                status_code=400,
                detail="Uploaded file is empty",
            )

        # =================================================
        # 7. CHECK FILE SIZE
        # =================================================

        file_size = len(file_bytes)

        if file_size > MAX_FILE_SIZE:

            raise HTTPException(
                status_code=400,
                detail="File size must be less than 10 MB",
            )

        # =================================================
        # LOG
        # =================================================

        print()
        print("======================================")
        print("📄 MEDICAL REPORT UPLOAD")
        print("======================================")
        print(f"Patient ID : {patient_id}")
        print(f"Filename   : {file.filename}")
        print(f"Type       : {file.content_type}")
        print(f"Size       : {file_size / 1024:.2f} KB")
        print(f"Language   : {sarvam_language}")
        print("======================================")

        # =================================================
        # 8. SARVAM OCR
        # =================================================

        print()
        print("🔍 Starting Sarvam OCR...")

        ocr_result = digitise_document(
            file_bytes=file_bytes,
            filename=file.filename,
            content_type=file.content_type,
            language=sarvam_language,
        )

        print()
        print("✅ Sarvam OCR completed")

        print(
            f"Job ID : {ocr_result['job_id']}"
        )

        # =================================================
        # 9. MEDICAL INFORMATION EXTRACTION
        # =================================================

        print()
        print(
            "🧠 Starting medical information extraction..."
        )

        extraction_result = extract_medical_information(
            file_bytes=file_bytes,
            filename=file.filename,
            content_type=file.content_type,
            language=sarvam_language,
        )

        print()
        print(
            "✅ Medical information extraction completed"
        )

        print(
            f"Extraction Job ID : "
            f"{extraction_result['job_id']}"
        )

        # =================================================
        # 10. GET STRUCTURED DATA
        # =================================================

        extracted_data = extraction_result.get(
            "data",
            {},
        )

        # =================================================
        # 11. SAVE REPORT TO MONGODB
        # =================================================

        report_document = {

            "patientId": patient_object_id,

            "filename": file.filename,

            "contentType": file.content_type,

            "fileSize": file_size,

            "language": language,

            "languageCode": sarvam_language,

            "uploadedAt": datetime.now(
                timezone.utc
            ),

            # ---------------------------------------------
            # OCR
            # ---------------------------------------------

            "ocr": {

                "jobId":
                    ocr_result["job_id"],

                "status":
                    ocr_result["status"],

                "downloadUrl":
                    ocr_result["download_url"],

                "text":
                    ocr_result["ocr_text"],
            },

            # ---------------------------------------------
            # Extracted medical information
            # ---------------------------------------------

            "extractedData": {

                "jobId":
                    extraction_result["job_id"],

                "status":
                    extraction_result["status"],

                "data":
                    extracted_data,
            },
        }

        report_result = reports_collection.insert_one(
            report_document
        )

        report_id = str(
            report_result.inserted_id
        )

        print()
        print("💾 Medical report saved to MongoDB")
        print(f"Report ID : {report_id}")

        # =================================================
        # 12. RESPONSE
        # =================================================

        return {

            "success": True,

            "message":
                "Medical report processed and saved successfully",

            "report_id":
                report_id,

            "patient_id":
                patient_id,

            "filename":
                file.filename,

            "language":
                language,

            "language_code":
                sarvam_language,

            "ocr": {

                "job_id":
                    ocr_result["job_id"],

                "status":
                    ocr_result["status"],

                "download_url":
                    ocr_result["download_url"],

                "text":
                    ocr_result["ocr_text"],
            },

            "extracted_data": {

                "job_id":
                    extraction_result["job_id"],

                "status":
                    extraction_result["status"],

                "data":
                    extracted_data,
            },
        }

    except HTTPException:

        raise

    except Exception as e:

        print()
        print("❌ REPORT PROCESSING ERROR")
        print("======================================")
        print(str(e))
        print("======================================")
        print()

        raise HTTPException(
            status_code=500,
            detail=(
                "Medical report processing failed: "
                f"{str(e)}"
            ),
        )