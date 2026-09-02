import io
import os
import time
import zipfile
import json

import httpx
from dotenv import load_dotenv
from sarvamai import SarvamAI


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    raise RuntimeError(
        "SARVAM_API_KEY is missing from .env"
    )


# =========================================================
# SARVAM CLIENT
# =========================================================

client = SarvamAI(
    api_subscription_key=SARVAM_API_KEY
)


# =========================================================
# TERMINAL JOB STATES
# =========================================================

TERMINAL_STATES = {
    "completed",
    "partially_completed",
    "failed",
    "rejected",
}


# =========================================================
# DOWNLOAD AND EXTRACT OCR OUTPUT
# =========================================================

def _download_ocr_output(download_url: str) -> str:
    """
    Download Sarvam's OCR output ZIP file
    and extract the Markdown/text content.
    """

    print()
    print("📥 Downloading Sarvam OCR output...")

    response = httpx.get(
        download_url,
        timeout=60.0,
    )

    response.raise_for_status()

    zip_bytes = response.content

    print(
        f"📦 Downloaded OCR ZIP: "
        f"{len(zip_bytes) / 1024:.2f} KB"
    )

    # -----------------------------------------------------
    # Open ZIP directly from memory
    # -----------------------------------------------------

    with zipfile.ZipFile(
        io.BytesIO(zip_bytes)
    ) as archive:

        files = archive.namelist()

        print()
        print("📂 Files inside OCR ZIP:")

        for name in files:
            print(f"   - {name}")

        # -------------------------------------------------
        # Prefer Markdown files
        # -------------------------------------------------

        markdown_files = [
            name
            for name in files
            if name.lower().endswith(".md")
        ]

        if markdown_files:

            selected_file = markdown_files[0]

            print()
            print(
                f"📄 Reading OCR Markdown: "
                f"{selected_file}"
            )

            content = archive.read(
                selected_file
            ).decode(
                "utf-8",
                errors="replace",
            )

            return content

        # -------------------------------------------------
        # Fallback to TXT files
        # -------------------------------------------------

        text_files = [
            name
            for name in files
            if name.lower().endswith(".txt")
        ]

        if text_files:

            selected_file = text_files[0]

            print()
            print(
                f"📄 Reading OCR text: "
                f"{selected_file}"
            )

            content = archive.read(
                selected_file
            ).decode(
                "utf-8",
                errors="replace",
            )

            return content

        # -------------------------------------------------
        # No readable OCR file found
        # -------------------------------------------------

        raise RuntimeError(
            "Sarvam OCR completed, but no "
            "Markdown or text output was found "
            "inside the ZIP."
        )


# =========================================================
# DIGITISE DOCUMENT
# =========================================================

def digitise_document(
    file_bytes: bytes,
    filename: str,
    content_type: str,
    language: str = "en-IN",
):
    """
    Send a medical document to Sarvam Document AI.

    Flow:

        File
          ↓
        Sarvam Digitise
          ↓
        Job ID
          ↓
        Poll status
          ↓
        Download ZIP
          ↓
        Extract Markdown/Text
          ↓
        Return OCR text
    """

    # =====================================================
    # 1. VALIDATE FILE
    # =====================================================

    if not file_bytes:
        raise ValueError(
            "Document is empty"
        )

    if not filename:
        raise ValueError(
            "Filename is missing"
        )

    if not content_type:
        raise ValueError(
            "Content type is missing"
        )

    print()
    print("======================================")
    print("📄 SARVAM DOCUMENT AI")
    print("======================================")
    print(f"Filename : {filename}")
    print(f"Type     : {content_type}")
    print(f"Language : {language}")
    print(
        f"Size     : "
        f"{len(file_bytes) / 1024:.2f} KB"
    )
    print("======================================")

    # =====================================================
    # 2. PREPARE FILE
    # =====================================================

    file_tuple = (
        filename,
        file_bytes,
        content_type,
    )

    # =====================================================
    # 3. CREATE SARVAM DIGITISE JOB
    # =====================================================

    print()
    print("🚀 Sending document to Sarvam...")

    job = client.doc_ai.digitise(
        file=[file_tuple],
        language=language,
        output_format="md",
    )

    job_id = job.job_id

    print(
        f"📄 Sarvam OCR job created: "
        f"{job_id}"
    )

    # =====================================================
    # 4. POLL JOB STATUS
    # =====================================================

    while True:

        status = client.doc_ai.get_status(
            job_id=job_id
        )

        current_status = (
            status.status.lower()
        )

        print(
            f"📄 OCR status: "
            f"{current_status}"
        )

        if current_status in TERMINAL_STATES:
            break

        time.sleep(2)

    # =====================================================
    # 5. HANDLE FAILED JOB
    # =====================================================

    if current_status in {
        "failed",
        "rejected",
    }:

        raise RuntimeError(
            f"Sarvam OCR failed: "
            f"{current_status}"
        )

    # =====================================================
    # 6. GET DOWNLOAD URL
    # =====================================================

    print()
    print("🔗 Getting Sarvam output URL...")

    download = client.doc_ai.get_download_url(
        job_id=job_id
    )

    download_url = download.url

    # =====================================================
    # 7. DOWNLOAD AND EXTRACT OCR TEXT
    # =====================================================

    ocr_text = _download_ocr_output(
        download_url
    )

    # =====================================================
    # 8. VALIDATE OCR TEXT
    # =====================================================

    if not ocr_text.strip():

        raise RuntimeError(
            "Sarvam OCR returned empty text."
        )

    # =====================================================
    # 9. LOG OCR RESULT
    # =====================================================

    print()
    print("======================================")
    print("✅ OCR COMPLETED")
    print("======================================")

    print(
        f"📝 OCR characters: "
        f"{len(ocr_text)}"
    )

    print()
    print("----- OCR TEXT PREVIEW -----")

    print(
        ocr_text[:2000]
    )

    print("----------------------------")
    print()

    # =====================================================
    # 10. RETURN RESULT
    # =====================================================

    return {
        "job_id": job_id,
        "status": current_status,
        "download_url": download_url,
        "ocr_text": ocr_text,
    }


# =========================================================
# EXTRACT STRUCTURED MEDICAL INFORMATION
# =========================================================

def extract_medical_information(
    file_bytes: bytes,
    filename: str,
    content_type: str,
    language: str = "en-IN",
):
    """
    Extract structured medical information from a report
    using Sarvam Document AI Extract.

    Important:
    The extraction should only return information
    explicitly present in the uploaded document.
    It must not infer diagnosis, treatment, or symptoms.
    """

    # =====================================================
    # 1. VALIDATE FILE
    # =====================================================

    if not file_bytes:
        raise ValueError(
            "Document is empty"
        )

    if not filename:
        raise ValueError(
            "Filename is missing"
        )

    if not content_type:
        raise ValueError(
            "Content type is missing"
        )

    # =====================================================
    # 2. MEDICAL EXTRACTION SCHEMA
    # =====================================================

    schema = {
        "type": "object",

        "properties": {

            # -------------------------------------------------
            # PATIENT
            # -------------------------------------------------

            "patient": {
                "type": "object",
                "description": (
                    "Patient identification and demographic details"
                ),

                "properties": {

                    "name": {
                        "type": "string",
                        "description": (
                            "Patient full name if explicitly present"
                        ),
                    },

                    "patient_id": {
                        "type": "string",
                        "description": (
                            "Patient ID or hospital ID "
                            "if explicitly present"
                        ),
                    },

                    "age": {
                        "type": "string",
                        "description": (
                            "Patient age exactly as written "
                            "in the document"
                        ),
                    },

                    "sex": {
                        "type": "string",
                        "description": (
                            "Patient sex or gender "
                            "if explicitly present"
                        ),
                    },
                },
            },

            # -------------------------------------------------
            # REPORT
            # -------------------------------------------------

            "report": {
                "type": "object",
                "description": (
                    "Medical report metadata"
                ),

                "properties": {

                    "hospital": {
                        "type": "string",
                        "description": (
                            "Hospital, laboratory, or "
                            "healthcare facility name"
                        ),
                    },

                    "doctor": {
                        "type": "string",
                        "description": (
                            "Doctor name if explicitly present"
                        ),
                    },

                    "date": {
                        "type": "string",
                        "description": (
                            "Report date or examination date"
                        ),
                    },

                    "test_id": {
                        "type": "string",
                        "description": (
                            "Report, laboratory, accession, "
                            "or test ID"
                        ),
                    },
                },
            },

            # -------------------------------------------------
            # INVESTIGATIONS
            # -------------------------------------------------

            "investigations": {
                "type": "array",

                "description": (
                    "Laboratory tests, investigations, "
                    "measurements, and their results"
                ),

                "items": {

                    "type": "object",

                    "description": (
                        "A single laboratory test or "
                        "medical investigation with its "
                        "reported result and reference range"
                    ),

                    "properties": {

                        "test": {
                            "type": "string",
                            "description": (
                                "Name of the laboratory test "
                                "or investigation"
                            ),
                        },

                        "result": {
                            "type": "string",
                            "description": (
                                "Result value exactly as "
                                "shown in the report"
                            ),
                        },

                        "unit": {
                            "type": "string",
                            "description": (
                                "Measurement unit if present"
                            ),
                        },

                        "reference_range": {
                            "type": "string",
                            "description": (
                                "Reference or normal range "
                                "if present"
                            ),
                        },
                    },
                },
            },

            # -------------------------------------------------
            # MEDICATIONS
            # -------------------------------------------------

            "medications": {
                "type": "array",

                "description": (
                    "Medications explicitly mentioned "
                    "in the document"
                ),

                "items": {
                    "type": "string",

                    "description": (
                        "Name of a medication explicitly "
                        "mentioned in the document"
                    ),
                },
            },

            # -------------------------------------------------
            # DIAGNOSES
            # -------------------------------------------------

            "diagnoses": {
                "type": "array",

                "description": (
                    "Diagnoses explicitly written in the "
                    "document. Do not infer diagnoses."
                ),

                "items": {
                    "type": "string",

                    "description": (
                        "Diagnosis explicitly written "
                        "in the document"
                    ),
                },
            },

            # -------------------------------------------------
            # SYMPTOMS
            # -------------------------------------------------

            "symptoms": {
                "type": "array",

                "description": (
                    "Symptoms explicitly mentioned "
                    "in the document"
                ),

                "items": {
                    "type": "string",

                    "description": (
                        "Symptom explicitly mentioned "
                        "in the document"
                    ),
                },
            },

            # -------------------------------------------------
            # ALLERGIES
            # -------------------------------------------------

            "allergies": {
                "type": "array",

                "description": (
                    "Allergies explicitly mentioned "
                    "in the document"
                ),

                "items": {
                    "type": "string",

                    "description": (
                        "Allergy explicitly mentioned "
                        "in the document"
                    ),
                },
            },
        },
    }

    # =====================================================
    # 3. PREPARE FILE
    # =====================================================

    file_tuple = (
        filename,
        file_bytes,
        content_type,
    )

    # =====================================================
    # 4. LOG
    # =====================================================

    print()
    print("======================================")
    print("🧠 SARVAM MEDICAL EXTRACTION")
    print("======================================")

    # =====================================================
    # 5. CREATE EXTRACTION JOB
    # =====================================================

    print()
    print("🚀 Sending document for medical extraction...")

    job = client.doc_ai.extract(
        file=[file_tuple],
        schema=json.dumps(schema),
        language=language,
        output_format="json",
    )

    job_id = job.job_id

    print(
        f"🧠 Extraction job created: "
        f"{job_id}"
    )

    # =====================================================
    # 6. POLL EXTRACTION STATUS
    # =====================================================

    while True:

        status = client.doc_ai.get_status(
            job_id=job_id
        )

        current_status = (
            status.status.lower()
        )

        print(
            f"🧠 Extraction status: "
            f"{current_status}"
        )

        if current_status in TERMINAL_STATES:
            break

        time.sleep(2)

    # =====================================================
    # 7. HANDLE EXTRACTION FAILURE
    # =====================================================

    if current_status in {
        "failed",
        "rejected",
    }:

        raise RuntimeError(
            f"Sarvam medical extraction failed: "
            f"{current_status}"
        )

    # =====================================================
    # 8. GET STRUCTURED RESULT
    # =====================================================

    results = client.doc_ai.get_results(
        job_id=job_id
    )

    extracted_data = results.result

    # =====================================================
    # 9. LOG RESULT
    # =====================================================

    print()
    print("======================================")
    print("✅ MEDICAL EXTRACTION COMPLETED")
    print("======================================")

    print(
        json.dumps(
            extracted_data,
            indent=2,
            ensure_ascii=False,
        )
    )

    print("======================================")
    print()

    # =====================================================
    # 10. RETURN RESULT
    # =====================================================

    return {
        "job_id": job_id,
        "status": current_status,
        "data": extracted_data,
    }