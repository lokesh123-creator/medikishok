from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId

from config.database import (
    doctors_collection,
    consultations_collection,
    users_collection,
    medical_reports_collection,
)

from models.doctor import create_doctor_document


router = APIRouter(
    prefix="/api/doctors",
    tags=["Doctors"]
)


# =========================================================
# MONGODB SERIALIZER
# =========================================================
# Converts ALL ObjectId values recursively into strings.
#
# This handles ObjectIds inside:
# - _id
# - patientId
# - doctorId
# - verifiedBy
# - previousReportIds
# - answers
# - extracted
# - extractedData
# - nested dictionaries
# - nested lists
# =========================================================

def serialize_mongo_document(value):

    # ObjectId -> string
    if isinstance(value, ObjectId):
        return str(value)

    # Dictionary -> recursively serialize every value
    if isinstance(value, dict):
        return {
            key: serialize_mongo_document(val)
            for key, val in value.items()
        }

    # List -> recursively serialize every item
    if isinstance(value, list):
        return [
            serialize_mongo_document(item)
            for item in value
        ]

    # Tuple -> recursively serialize
    if isinstance(value, tuple):
        return [
            serialize_mongo_document(item)
            for item in value
        ]

    return value


# =========================================================
# PREVIOUS REPORT HELPERS
# =========================================================

def get_previous_reports_for_consultation(
    consultation,
    patient_id=None
):
    """
    Fetch previous medical reports linked to a consultation.

    Supports:
        previousReportIds
        previous_report_ids

    Also supports IDs stored as:
        ObjectId
        string

    Returns:
        list of serialized report documents
    """

    report_ids = (
        consultation.get("previousReportIds")
        or consultation.get("previous_report_ids")
        or []
    )

    if not isinstance(report_ids, list):
        report_ids = [report_ids]

    object_ids = []

    # -----------------------------------------------------
    # Convert all valid IDs to ObjectId
    # -----------------------------------------------------

    for report_id in report_ids:

        if isinstance(report_id, ObjectId):

            object_ids.append(report_id)

        elif isinstance(report_id, str):

            if ObjectId.is_valid(report_id):

                object_ids.append(
                    ObjectId(report_id)
                )

    # -----------------------------------------------------
    # If no linked reports, return empty list
    # -----------------------------------------------------

    if not object_ids:
        return []

    # -----------------------------------------------------
    # Build query
    # -----------------------------------------------------

    query = {
        "_id": {
            "$in": object_ids
        }
    }

    # -----------------------------------------------------
    # Safety:
    # Make sure reports belong to the patient
    # -----------------------------------------------------

    if patient_id:

        if isinstance(patient_id, str):

            if ObjectId.is_valid(patient_id):

                patient_id = ObjectId(patient_id)

        query["patientId"] = patient_id

    # -----------------------------------------------------
    # Fetch reports
    # -----------------------------------------------------

    reports = list(
        medical_reports_collection.find(
            query
        ).sort(
            "uploadedAt",
            -1
        )
    )

    # -----------------------------------------------------
    # Serialize all ObjectIds
    # -----------------------------------------------------

    reports = [
        serialize_mongo_document(report)
        for report in reports
    ]

    return reports


# =========================================================
# ATTACH PREVIOUS REPORTS
# =========================================================

def attach_previous_reports(
    consultation,
    patient_id=None
):
    """
    Adds previous medical report data to a consultation.

    Frontend can use either:
        consultation.previousReports
    or:
        consultation.previous_reports
    """

    reports = get_previous_reports_for_consultation(
        consultation=consultation,
        patient_id=patient_id
    )

    consultation["previousReports"] = reports

    # Compatibility with snake_case frontend/backend usage
    consultation["previous_reports"] = reports

    return consultation


# =========================================================
# DOCTOR CREATE
# =========================================================

class DoctorCreate(BaseModel):

    name: str

    phone: str | None = None

    email: str | None = None

    specialization: str | None = None


@router.post("")
def create_doctor(
    doctor: DoctorCreate
):

    try:

        document = create_doctor_document(
            name=doctor.name,
            phone=doctor.phone,
            email=doctor.email,
            specialization=doctor.specialization,
        )

        result = doctors_collection.insert_one(
            document
        )

        return {
            "success": True,
            "message": "Doctor created successfully",
            "doctor_id": str(
                result.inserted_id
            ),
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET ALL COMPLETED CONSULTATIONS
# =========================================================
#
# GET /api/doctors/consultations/completed
#
# Used by Doctor Dashboard
# =========================================================

@router.get(
    "/consultations/completed"
)
def get_completed_consultations():

    try:

        consultations = list(
            consultations_collection.find(
                {
                    "status": "completed"
                }
            ).sort(
                "completedAt",
                -1
            )
        )

        result = []

        for consultation in consultations:

            patient_id = consultation.get(
                "patientId"
            )

            patient = None

            if patient_id:

                patient = users_collection.find_one(
                    {
                        "_id": patient_id
                    }
                )

            # -------------------------------------------------
            # Attach previous medical reports
            # -------------------------------------------------

            consultation = attach_previous_reports(
                consultation,
                patient_id=patient_id
            )

            # -------------------------------------------------
            # Serialize ALL nested ObjectIds
            # -------------------------------------------------

            consultation = serialize_mongo_document(
                consultation
            )

            if patient:

                patient = serialize_mongo_document(
                    patient
                )

            result.append(
                {
                    "consultation": consultation,
                    "patient": patient
                }
            )

        return {

            "success": True,

            "count": len(result),

            "consultations": result

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET ALL ACTIVE CONSULTATIONS
# =========================================================
#
# GET /api/doctors/consultations/active
# =========================================================

@router.get(
    "/consultations/active"
)
def get_active_consultations():

    try:

        consultations = list(
            consultations_collection.find(
                {
                    "status": "active"
                }
            ).sort(
                "startedAt",
                -1
            )
        )

        result = []

        for consultation in consultations:

            patient_id = consultation.get(
                "patientId"
            )

            patient = None

            if patient_id:

                patient = users_collection.find_one(
                    {
                        "_id": patient_id
                    }
                )

            # -------------------------------------------------
            # Attach previous reports
            # -------------------------------------------------

            consultation = attach_previous_reports(
                consultation,
                patient_id=patient_id
            )

            # -------------------------------------------------
            # Serialize ALL nested ObjectIds
            # -------------------------------------------------

            consultation = serialize_mongo_document(
                consultation
            )

            if patient:

                patient = serialize_mongo_document(
                    patient
                )

            result.append(
                {
                    "consultation": consultation,
                    "patient": patient
                }
            )

        return {

            "success": True,

            "count": len(result),

            "consultations": result

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET CONSULTATION DETAIL FOR DOCTOR
# =========================================================
#
# GET /api/doctors/consultations/{consultation_id}
#
# IMPORTANT:
# This endpoint now returns:
#
# consultation.previousReports
#
# AND
#
# consultation.previous_reports
#
# =========================================================

@router.get(
    "/consultations/{consultation_id}"
)
def get_doctor_consultation(
    consultation_id: str
):

    try:

        # -------------------------------------------------
        # Validate consultation ID
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Get consultation
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Get patient
        # -------------------------------------------------

        patient = None

        patient_id = consultation.get(
            "patientId"
        )

        if patient_id:

            patient = users_collection.find_one(
                {
                    "_id": patient_id
                }
            )

        # -------------------------------------------------
        # Get doctor
        # -------------------------------------------------

        doctor = None

        doctor_id = consultation.get(
            "doctorId"
        )

        if doctor_id:

            doctor = doctors_collection.find_one(
                {
                    "_id": doctor_id
                }
            )

        # -------------------------------------------------
        # GET PREVIOUS MEDICAL REPORTS
        # -------------------------------------------------
        #
        # This is the important fix.
        #
        # Consultation contains:
        #
        # previousReportIds: [
        #     ObjectId(...)
        # ]
        #
        # We now fetch the actual documents from:
        #
        # medical_reports
        #
        # and attach them to:
        #
        # consultation.previousReports
        # -------------------------------------------------

        consultation = attach_previous_reports(
            consultation,
            patient_id=patient_id
        )

        # -------------------------------------------------
        # Serialize EVERYTHING
        # -------------------------------------------------

        consultation = serialize_mongo_document(
            consultation
        )

        if patient:

            patient = serialize_mongo_document(
                patient
            )

        if doctor:

            doctor = serialize_mongo_document(
                doctor
            )

        # -------------------------------------------------
        # Return complete case
        # -------------------------------------------------

        return {

            "success": True,

            "patient": patient,

            "doctor": doctor,

            "consultation": consultation

        }

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET DOCTOR'S COMPLETED CONSULTATIONS
# =========================================================
#
# GET /api/doctors/{doctor_id}/consultations/completed
# =========================================================

@router.get(
    "/{doctor_id}/consultations/completed"
)
def get_doctor_completed_consultations(
    doctor_id: str
):

    try:

        # -------------------------------------------------
        # Validate doctor ID
        # -------------------------------------------------

        if not ObjectId.is_valid(
            doctor_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid doctor_id"
            )

        doctor_object_id = ObjectId(
            doctor_id
        )

        # -------------------------------------------------
        # Check doctor exists
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Find doctor's consultations
        # -------------------------------------------------

        consultations = list(
            consultations_collection.find(
                {
                    "doctorId":
                        doctor_object_id,

                    "status":
                        "completed"
                }
            ).sort(
                "completedAt",
                -1
            )
        )

        result = []

        for consultation in consultations:

            patient_id = consultation.get(
                "patientId"
            )

            patient = None

            if patient_id:

                patient = users_collection.find_one(
                    {
                        "_id": patient_id
                    }
                )

            # -------------------------------------------------
            # Attach previous reports
            # -------------------------------------------------

            consultation = attach_previous_reports(
                consultation,
                patient_id=patient_id
            )

            # -------------------------------------------------
            # Serialize EVERYTHING
            # -------------------------------------------------

            consultation = serialize_mongo_document(
                consultation
            )

            if patient:

                patient = serialize_mongo_document(
                    patient
                )

            result.append(
                {
                    "consultation": consultation,
                    "patient": patient
                }
            )

        return {

            "success": True,

            "doctor_id":
                doctor_id,

            "count":
                len(result),

            "consultations":
                result

        }

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET DOCTOR'S ACTIVE CONSULTATIONS
# =========================================================
#
# GET /api/doctors/{doctor_id}/consultations/active
# =========================================================

@router.get(
    "/{doctor_id}/consultations/active"
)
def get_doctor_active_consultations(
    doctor_id: str
):

    try:

        # -------------------------------------------------
        # Validate doctor ID
        # -------------------------------------------------

        if not ObjectId.is_valid(
            doctor_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid doctor_id"
            )

        doctor_object_id = ObjectId(
            doctor_id
        )

        # -------------------------------------------------
        # Check doctor
        # -------------------------------------------------

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

        # -------------------------------------------------
        # Get active consultations
        # -------------------------------------------------

        consultations = list(
            consultations_collection.find(
                {
                    "doctorId":
                        doctor_object_id,

                    "status":
                        "active"
                }
            ).sort(
                "startedAt",
                -1
            )
        )

        result = []

        for consultation in consultations:

            patient_id = consultation.get(
                "patientId"
            )

            patient = None

            if patient_id:

                patient = users_collection.find_one(
                    {
                        "_id": patient_id
                    }
                )

            # -------------------------------------------------
            # Attach previous reports
            # -------------------------------------------------

            consultation = attach_previous_reports(
                consultation,
                patient_id=patient_id
            )

            # -------------------------------------------------
            # Serialize EVERYTHING
            # -------------------------------------------------

            consultation = serialize_mongo_document(
                consultation
            )

            if patient:

                patient = serialize_mongo_document(
                    patient
                )

            result.append(
                {
                    "consultation": consultation,
                    "patient": patient
                }
            )

        return {

            "success": True,

            "doctor_id":
                doctor_id,

            "count":
                len(result),

            "consultations":
                result

        }

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================================================
# GET DOCTOR PROFILE
# =========================================================
#
# IMPORTANT:
# This route is intentionally LAST.
#
# GET /api/doctors/{doctor_id}
# =========================================================

@router.get(
    "/{doctor_id}"
)
def get_doctor(
    doctor_id: str
):

    try:

        # -------------------------------------------------
        # Validate doctor ID
        # -------------------------------------------------

        if not ObjectId.is_valid(
            doctor_id
        ):

            raise HTTPException(
                status_code=400,
                detail="Invalid doctor_id"
            )

        # -------------------------------------------------
        # Find doctor
        # -------------------------------------------------

        doctor = doctors_collection.find_one(
            {
                "_id":
                    ObjectId(
                        doctor_id
                    )
            }
        )

        if not doctor:

            raise HTTPException(
                status_code=404,
                detail="Doctor not found"
            )

        # -------------------------------------------------
        # Serialize EVERYTHING
        # -------------------------------------------------

        doctor = serialize_mongo_document(
            doctor
        )

        return {

            "success": True,

            "doctor":
                doctor

        }

    except HTTPException:

        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )