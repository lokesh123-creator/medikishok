
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from bson import ObjectId

from services.groq import generate_clinical_summary

from config.database import (
    consultations_collection,
    users_collection,
    doctors_collection,
    reports_collection,
)


router = APIRouter(
    prefix="/api/consultations",
    tags=["Consultations"],
)


# =========================================================
# MONGODB SERIALIZER
# =========================================================
# Converts nested MongoDB ObjectId / datetime values into
# JSON-safe values.
#
# This is important because medical reports can contain
# nested ObjectIds inside OCR/extractedData structures.
# =========================================================

def serialize_mongo_document(value):
    if isinstance(value, ObjectId):
        return str(value)

    if isinstance(value, datetime):
        return value.isoformat()

    if isinstance(value, dict):
        return {
            key: serialize_mongo_document(val)
            for key, val in value.items()
        }

    if isinstance(value, list):
        return [
            serialize_mongo_document(item)
            for item in value
        ]

    if isinstance(value, tuple):
        return [
            serialize_mongo_document(item)
            for item in value
        ]

    return value


# =========================================================
# FETCH PREVIOUS MEDICAL REPORTS
# =========================================================
#
# This helper fetches the actual report documents linked to
# a consultation.
#
# It is used by:
#   1. GET consultation
#   2. GET patient consultations
#   3. COMPLETE consultation / AI summary
#
# =========================================================

def get_previous_reports(
    previous_report_ids,
    patient_id=None,
):
    if not previous_report_ids:
        return []

    valid_object_ids = []

    for report_id in previous_report_ids:

        # Already an ObjectId
        if isinstance(report_id, ObjectId):

            valid_object_ids.append(
                report_id
            )

        # String ObjectId
        elif (
            isinstance(report_id, str)
            and ObjectId.is_valid(report_id)
        ):

            valid_object_ids.append(
                ObjectId(report_id)
            )

    if not valid_object_ids:
        return []

    query = {
        "_id": {
            "$in": valid_object_ids
        }
    }

    # -----------------------------------------------------
    # Security:
    # only return reports belonging to the patient
    # -----------------------------------------------------

    if patient_id is not None:

        if isinstance(patient_id, str):

            if ObjectId.is_valid(patient_id):
                patient_id = ObjectId(patient_id)

        query["patientId"] = patient_id

    reports = list(
        reports_collection.find(query)
    )

    # -----------------------------------------------------
    # Preserve the same order as previousReportIds
    # -----------------------------------------------------

    report_map = {
        str(report["_id"]): report
        for report in reports
    }

    ordered_reports = []

    for report_id in previous_report_ids:

        report_id_string = str(report_id)

        report = report_map.get(
            report_id_string
        )

        if report:
            ordered_reports.append(report)

    return ordered_reports


# =========================================================
# CREATE CONSULTATION
# =========================================================


class ConsultationCreate(BaseModel):

    patient_id: str

    doctor_id: str | None = None

    language: str = "en"

    consultation_type: str = "clinical"

    # -----------------------------------------------------
    # Previous medical reports are optional
    # -----------------------------------------------------

    previous_report_ids: list[str] = Field(
        default_factory=list
    )


class ConsultationResponse(BaseModel):

    success: bool

    message: str

    consultation_id: str


@router.post(
    "",
    response_model=ConsultationResponse
)
def create_consultation(
    data: ConsultationCreate
):

    try:

        # =================================================
        # VALIDATE PATIENT ID
        # =================================================

        if not ObjectId.is_valid(
            data.patient_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid patient_id"
            )

        patient_object_id = ObjectId(
            data.patient_id
        )

        # =================================================
        # CHECK PATIENT EXISTS
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
        # VALIDATE DOCTOR ID
        # =================================================

        doctor_object_id = None

        if data.doctor_id:

            if not ObjectId.is_valid(
                data.doctor_id
            ):

                raise HTTPException(
                    status_code=400,
                    detail="Invalid doctor_id"
                )

            doctor_object_id = ObjectId(
                data.doctor_id
            )

            doctor = doctors_collection.find_one(
                {
                    "_id": doctor_object_id
                }
            )

            if not doctor:

                raise HTTPException(
                    status_code=404,
                    detail="Doctor not found"
                )

        # =================================================
        # VALIDATE PREVIOUS REPORT IDS
        # =================================================

        previous_report_object_ids = []

        if data.previous_report_ids:

            for report_id in data.previous_report_ids:

                if not ObjectId.is_valid(
                    report_id
                ):

                    raise HTTPException(
                        status_code=400,
                        detail=(
                            f"Invalid previous report ID: "
                            f"{report_id}"
                        )
                    )

                previous_report_object_ids.append(
                    ObjectId(report_id)
                )

            # -------------------------------------------------
            # Fetch reports
            # -------------------------------------------------

            reports = list(
                reports_collection.find(
                    {
                        "_id": {
                            "$in":
                                previous_report_object_ids
                        }
                    }
                )
            )

            # -------------------------------------------------
            # Check all requested reports exist
            # -------------------------------------------------

            if len(reports) != len(
                previous_report_object_ids
            ):

                raise HTTPException(
                    status_code=404,
                    detail=(
                        "One or more previous medical "
                        "reports were not found"
                    )
                )

            # -------------------------------------------------
            # IMPORTANT:
            # Make sure reports belong to this patient
            # -------------------------------------------------

            for report in reports:

                report_patient_id = report.get(
                    "patientId"
                )

                if (
                    not report_patient_id
                    or report_patient_id
                    != patient_object_id
                ):

                    raise HTTPException(
                        status_code=403,
                        detail=(
                            "A previous medical report "
                            "does not belong to this patient"
                        )
                    )

        # =================================================
        # CREATE CONSULTATION
        # =================================================

        consultation = {

            "patientId":
                patient_object_id,

            "doctorId":
                doctor_object_id,

            "language":
                data.language,

            "consultationType":
                data.consultation_type,

            "status":
                "active",

            "startedAt":
                datetime.now(
                    timezone.utc
                ),

            "completedAt":
                None,

            # =================================================
            # PREVIOUS MEDICAL REPORTS
            # =================================================

            "previousReportIds":
                previous_report_object_ids,

            # =================================================
            # DOCTOR VERIFICATION
            # =================================================

            "doctorVerified":
                False,

            "verifiedBy":
                None,

            "verifiedAt":
                None,

            "doctorNotes":
                None,

            # =================================================
            # AI SUMMARY
            # =================================================

            "aiSummary":
                None,

            # =================================================
            # CONVERSATION
            # =================================================

            "conversation":
                [],

            # =================================================
            # CLINICAL HISTORY
            # =================================================

            "clinicalHistory": {

                "chiefComplaint":
                    None,

                "duration":
                    None,

                "symptoms":
                    [],

                "severity":
                    None,

                "onset":
                    None,

                "aggravatingFactors":
                    [],

                "relievingFactors":
                    [],

                "appetite":
                    None,

                "bowelHabits":
                    None,

                "sleep":
                    None,
            },

            # =================================================
            # AYURVEDIC HISTORY
            # =================================================

            "ayurvedicHistory": {

                "prakriti":
                    None,

                "vikriti":
                    None,

                "agni":
                    None,

                "koshtha":
                    None,

                "ahara":
                    None,

                "vihara":
                    None,

                "nidra":
                    None,

                "dashavidhaPariksha":
                    {},
            },

            # =================================================
            # RED FLAGS
            # =================================================

            "redFlags":
                [],
        }

        # =================================================
        # SAVE CONSULTATION
        # =================================================

        result = consultations_collection.insert_one(
            consultation
        )

        return {

            "success":
                True,

            "message":
                "Consultation created successfully",

            "consultation_id":
                str(result.inserted_id),
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "❌ CREATE CONSULTATION ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET CONSULTATION
# =========================================================
#
# IMPORTANT UPDATE:
#
# This endpoint now returns:
#
# previousReportIds
# previousReports
#
# So ClinicalSummary.jsx can display the actual reports.
#
# =========================================================


@router.get(
    "/{consultation_id}"
)
def get_consultation(
    consultation_id: str
):

    try:

        # =================================================
        # VALIDATE CONSULTATION ID
        # =================================================

        if not ObjectId.is_valid(
            consultation_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid consultation_id"
            )

        consultation_object_id = ObjectId(
            consultation_id
        )

        # =================================================
        # FIND CONSULTATION
        # =================================================

        consultation = (
            consultations_collection.find_one(
                {
                    "_id":
                        consultation_object_id
                }
            )
        )

        if not consultation:

            raise HTTPException(
                status_code=404,
                detail="Consultation not found"
            )

        # =================================================
        # GET PATIENT ID BEFORE SERIALIZATION
        # =================================================

        patient_id = consultation.get(
            "patientId"
        )

        # =================================================
        # GET PREVIOUS REPORT IDS
        # =================================================

        previous_report_ids = consultation.get(
            "previousReportIds",
            []
        )

        # =================================================
        # FETCH ACTUAL PREVIOUS REPORTS
        # =================================================

        previous_reports = get_previous_reports(

            previous_report_ids=
                previous_report_ids,

            patient_id=
                patient_id,
        )

        print(
            "📄 Consultation:",
            consultation_id
        )

        print(
            "📄 Previous report IDs:",
            previous_report_ids
        )

        print(
            "📄 Previous reports returned:",
            len(previous_reports)
        )

        # =================================================
        # SERIALIZE CONSULTATION
        # =================================================

        consultation = serialize_mongo_document(
            consultation
        )

        # =================================================
        # SERIALIZE PREVIOUS REPORTS
        # =================================================

        previous_reports = (
            serialize_mongo_document(
                previous_reports
            )
        )

        # =================================================
        # EXPLICITLY ADD REPORT DATA
        # =================================================

        consultation[
            "previousReportIds"
        ] = [
            str(report_id)
            for report_id in previous_report_ids
        ]

        consultation[
            "previousReports"
        ] = previous_reports

        # =================================================
        # RETURN
        # =================================================

        return {

            "success":
                True,

            "consultation":
                consultation,
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "❌ GET CONSULTATION ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET PATIENT CONSULTATIONS
# =========================================================
#
# Also returns previousReports for every consultation.
#
# =========================================================


@router.get(
    "/patient/{patient_id}"
)
def get_patient_consultations(
    patient_id: str
):

    try:

        # =================================================
        # VALIDATE PATIENT ID
        # =================================================

        if not ObjectId.is_valid(
            patient_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid patient_id"
            )

        patient_object_id = ObjectId(
            patient_id
        )

        # =================================================
        # CHECK PATIENT EXISTS
        # =================================================

        patient = users_collection.find_one(
            {
                "_id":
                    patient_object_id
            }
        )

        if not patient:

            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

        # =================================================
        # GET CONSULTATIONS
        # =================================================

        consultations = list(
            consultations_collection.find(
                {
                    "patientId":
                        patient_object_id
                }
            ).sort(
                "startedAt",
                -1
            )
        )

        # =================================================
        # ADD PREVIOUS REPORTS
        # =================================================

        for consultation in consultations:

            previous_report_ids = (
                consultation.get(
                    "previousReportIds",
                    []
                )
            )

            previous_reports = (
                get_previous_reports(

                    previous_report_ids=
                        previous_report_ids,

                    patient_id=
                        patient_object_id,
                )
            )

            # -------------------------------------------------
            # Attach actual report documents
            # -------------------------------------------------

            consultation[
                "previousReports"
            ] = previous_reports

        # =================================================
        # SERIALIZE EVERYTHING
        # =================================================

        consultations = serialize_mongo_document(
            consultations
        )

        # =================================================
        # RETURN
        # =================================================

        return {

            "success":
                True,

            "patient_id":
                patient_id,

            "count":
                len(consultations),

            "consultations":
                consultations,
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "❌ GET PATIENT CONSULTATIONS ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# SAVE CONSULTATION ANSWER
# =========================================================


class ConsultationAnswer(BaseModel):

    question: str

    answer: str

    extracted: dict = Field(
        default_factory=dict
    )

    red_flag: bool = False


@router.post(
    "/{consultation_id}/answer"
)
def save_consultation_answer(

    consultation_id: str,

    data: ConsultationAnswer
):

    try:

        # =================================================
        # VALIDATE CONSULTATION ID
        # =================================================

        if not ObjectId.is_valid(
            consultation_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid consultation_id"
            )

        consultation_object_id = ObjectId(
            consultation_id
        )

        # =================================================
        # CHECK CONSULTATION
        # =================================================

        consultation = (
            consultations_collection.find_one(
                {
                    "_id":
                        consultation_object_id
                }
            )
        )

        if not consultation:

            raise HTTPException(
                status_code=404,
                detail="Consultation not found"
            )

        # =================================================
        # DON'T ALLOW ANSWERS AFTER COMPLETION
        # =================================================

        if consultation.get(
            "status"
        ) == "completed":

            raise HTTPException(
                status_code=400,
                detail=(
                    "Consultation is already completed"
                )
            )

        now = datetime.now(
            timezone.utc
        )

        # =================================================
        # SAVE CONVERSATION
        # =================================================

        conversation_item = {

            "question":
                data.question,

            "answer":
                data.answer,

            "timestamp":
                now,
        }

        consultations_collection.update_one(

            {
                "_id":
                    consultation_object_id
            },

            {
                "$push": {
                    "conversation":
                        conversation_item
                }
            }
        )

        # =================================================
        # EXTRACTED INFORMATION
        # =================================================

        extracted = data.extracted

        # =================================================
        # CLINICAL HISTORY MAPPING
        # =================================================

        clinical_update = {}

        clinical_mapping = {

            "chief_complaint":
                "clinicalHistory.chiefComplaint",

            "duration":
                "clinicalHistory.duration",

            "symptoms":
                "clinicalHistory.symptoms",

            "severity":
                "clinicalHistory.severity",

            "onset":
                "clinicalHistory.onset",

            "aggravating_factors":
                "clinicalHistory.aggravatingFactors",

            "relieving_factors":
                "clinicalHistory.relievingFactors",

            "appetite":
                "clinicalHistory.appetite",

            "bowel_habits":
                "clinicalHistory.bowelHabits",

            "sleep":
                "clinicalHistory.sleep",
        }

        for ai_key, mongo_key in (
            clinical_mapping.items()
        ):

            value = extracted.get(
                ai_key
            )

            if (
                value is not None
                and value != []
                and value != ""
            ):

                clinical_update[
                    mongo_key
                ] = value

        # =================================================
        # AYURVEDIC HISTORY MAPPING
        # =================================================

        ayurvedic_mapping = {

            "prakriti":
                "ayurvedicHistory.prakriti",

            "vikriti":
                "ayurvedicHistory.vikriti",

            "agni":
                "ayurvedicHistory.agni",

            "koshtha":
                "ayurvedicHistory.koshtha",

            "ahara":
                "ayurvedicHistory.ahara",

            "vihara":
                "ayurvedicHistory.vihara",

            "nidra":
                "ayurvedicHistory.nidra",

            "dashavidha_pariksha":
                "ayurvedicHistory.dashavidhaPariksha",
        }

        for ai_key, mongo_key in (
            ayurvedic_mapping.items()
        ):

            value = extracted.get(
                ai_key
            )

            if (
                value is not None
                and value != {}
                and value != ""
            ):

                clinical_update[
                    mongo_key
                ] = value

        # =================================================
        # BUILD UPDATE
        # =================================================

        update_data = {}

        # =================================================
        # CLINICAL / AYURVEDIC INFORMATION
        # =================================================

        if clinical_update:

            update_data[
                "$set"
            ] = clinical_update

        # =================================================
        # RED FLAG
        # =================================================

        if data.red_flag:

            update_data.setdefault(
                "$push",
                {}
            )

            update_data[
                "$push"
            ][
                "redFlags"
            ] = {

                "question":
                    data.question,

                "answer":
                    data.answer,

                "timestamp":
                    now,
            }

        # =================================================
        # APPLY UPDATE
        # =================================================

        if update_data:

            consultations_collection.update_one(

                {
                    "_id":
                        consultation_object_id
                },

                update_data
            )

        # =================================================
        # RESPONSE
        # =================================================

        return {

            "success":
                True,

            "message":
                "Consultation answer saved successfully",
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "❌ SAVE ANSWER ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# COMPLETE CONSULTATION + AI SUMMARY
# =========================================================


@router.post(
    "/{consultation_id}/complete"
)
def complete_consultation(
    consultation_id: str
):

    try:

        # =================================================
        # VALIDATE CONSULTATION ID
        # =================================================

        if not ObjectId.is_valid(
            consultation_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid consultation_id"
            )

        consultation_object_id = ObjectId(
            consultation_id
        )

        # =================================================
        # GET LATEST CONSULTATION
        # =================================================

        consultation = (
            consultations_collection.find_one(
                {
                    "_id":
                        consultation_object_id
                }
            )
        )

        if not consultation:

            raise HTTPException(
                status_code=404,
                detail="Consultation not found"
            )

        # =================================================
        # ALREADY COMPLETED
        # =================================================

        if consultation.get(
            "status"
        ) == "completed":

            return {

                "success":
                    True,

                "message":
                    "Consultation was already completed",

                "consultation_id":
                    consultation_id,

                "ai_summary":
                    consultation.get(
                        "aiSummary"
                    ),
            }

        # =================================================
        # GET CURRENT INTERVIEW DATA
        # =================================================

        language = consultation.get(
            "language",
            "en"
        )

        consultation_type = consultation.get(
            "consultationType",
            "clinical"
        )

        clinical_history = consultation.get(
            "clinicalHistory",
            {}
        )

        ayurvedic_history = consultation.get(
            "ayurvedicHistory",
            {}
        )

        conversation = consultation.get(
            "conversation",
            []
        )

        red_flags = consultation.get(
            "redFlags",
            []
        )

        # =================================================
        # GET PREVIOUS REPORT IDS
        # =================================================

        previous_report_ids = consultation.get(
            "previousReportIds",
            []
        )

        print(
            "📄 Previous report IDs:",
            previous_report_ids
        )

        # =================================================
        # FETCH PREVIOUS MEDICAL REPORTS
        # =================================================

        previous_reports = get_previous_reports(

            previous_report_ids=
                previous_report_ids,

            patient_id=
                consultation.get(
                    "patientId"
                ),
        )

        print(
            "📄 Previous reports found:",
            len(previous_reports)
        )

        # =================================================
        # GENERATE AI CLINICAL SUMMARY
        # =================================================

        ai_summary = None

        try:

            print(
                "🧠 Generating AI clinical summary..."
            )

            ai_summary = generate_clinical_summary(

                language=language,

                consultation_type=consultation_type,

                clinical_history=clinical_history,

                ayurvedic_history=ayurvedic_history,

                conversation=conversation,

                red_flags=red_flags,

                # -------------------------------------------------
                # Previous medical reports
                # -------------------------------------------------

                previous_reports=previous_reports,
            )

            print(
                "✅ AI clinical summary generated"
            )

        except Exception as summary_error:

            print(
                "⚠️ AI summary generation failed:",
                str(summary_error)
            )

            # =================================================
            # SAFE FALLBACK
            # =================================================

            ai_summary = {

                "summary":
                    (
                        "AI summary could not be generated. "
                        "Please review the collected history."
                    ),

                "key_findings":
                    [],

                "previous_report_findings":
                    [],

                "interview_findings":
                    [],

                "clinical_history":
                    clinical_history,

                "ayurvedic_history":
                    ayurvedic_history,

                "red_flags":
                    red_flags,

                "missing_information":
                    [],

                "generation_status":
                    "failed",
            }

        # =================================================
        # COMPLETE CONSULTATION
        # =================================================

        now = datetime.now(
            timezone.utc
        )

        result = consultations_collection.update_one(

            {
                "_id":
                    consultation_object_id,

                "status":
                    "active",
            },

            {
                "$set": {

                    "status":
                        "completed",

                    "completedAt":
                        now,

                    "aiSummary":
                        ai_summary,
                }
            }
        )

        # =================================================
        # CHECK UPDATE
        # =================================================

        if result.modified_count == 0:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Consultation could not be completed"
                )
            )

        # =================================================
        # RESPONSE
        # =================================================

        return {

            "success":
                True,

            "message":
                "Consultation completed successfully",

            "consultation_id":
                consultation_id,

            "ai_summary":
                ai_summary,
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "❌ COMPLETE CONSULTATION ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# DOCTOR VERIFY CONSULTATION
# =========================================================


class DoctorVerifyRequest(BaseModel):

    doctor_id: str

    doctor_notes: str | None = None

    clinical_history: dict | None = None

    ayurvedic_history: dict | None = None


@router.post(
    "/{consultation_id}/verify"
)
def verify_consultation(

    consultation_id: str,

    data: DoctorVerifyRequest
):

    try:

        # =================================================
        # VALIDATE CONSULTATION ID
        # =================================================

        if not ObjectId.is_valid(
            consultation_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid consultation_id"
            )

        # =================================================
        # VALIDATE DOCTOR ID
        # =================================================

        if not ObjectId.is_valid(
            data.doctor_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid doctor_id"
            )

        consultation_object_id = ObjectId(
            consultation_id
        )

        doctor_object_id = ObjectId(
            data.doctor_id
        )

        # =================================================
        # CHECK DOCTOR
        # =================================================

        doctor = doctors_collection.find_one(
            {
                "_id":
                    doctor_object_id
            }
        )

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found"
            )

        # =================================================
        # CHECK CONSULTATION
        # =================================================

        consultation = (
            consultations_collection.find_one(
                {
                    "_id":
                        consultation_object_id
                }
            )
        )

        if not consultation:

            raise HTTPException(
                status_code=404,
                detail="Consultation not found"
            )

        # =================================================
        # BUILD VERIFICATION UPDATE
        # =================================================

        update_fields = {

            "doctorVerified":
                True,

            "verifiedBy":
                doctor_object_id,

            "verifiedAt":
                datetime.now(
                    timezone.utc
                ),
        }

        # =================================================
        # DOCTOR NOTES
        # =================================================

        if data.doctor_notes is not None:

            update_fields[
                "doctorNotes"
            ] = data.doctor_notes

        # =================================================
        # DOCTOR-EDITED CLINICAL HISTORY
        # =================================================

        if data.clinical_history is not None:

            update_fields[
                "clinicalHistory"
            ] = data.clinical_history

        # =================================================
        # DOCTOR-EDITED AYURVEDIC HISTORY
        # =================================================

        if data.ayurvedic_history is not None:

            update_fields[
                "ayurvedicHistory"
            ] = data.ayurvedic_history

        # =================================================
        # SAVE VERIFICATION
        # =================================================

        consultations_collection.update_one(

            {
                "_id":
                    consultation_object_id
            },

            {
                "$set":
                    update_fields
            }
        )

        # =================================================
        # RESPONSE
        # =================================================

        return {

            "success":
                True,

            "message":
                "Consultation verified successfully",

            "consultation_id":
                consultation_id,

            "doctor_id":
                data.doctor_id,
        }

    except HTTPException:

        raise

    except Exception as e:

        print(
            "❌ VERIFY CONSULTATION ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

