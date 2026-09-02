from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config.database import users_collection
from models.user import create_user_document

router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"]
)


# =========================
# REQUEST MODELS
# =========================

class PatientCreate(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None


class PatientLogin(BaseModel):
    phone: str | None = None
    email: str | None = None


# =========================
# CREATE PATIENT
# =========================

@router.post("")
def create_patient(patient: PatientCreate):

    try:
        # -------------------------
        # Basic validation
        # -------------------------

        if not patient.name.strip():
            raise HTTPException(
                status_code=400,
                detail="Patient name is required"
            )

        if not patient.phone and not patient.email:
            raise HTTPException(
                status_code=400,
                detail="Phone or email is required"
            )

        # -------------------------
        # Check duplicate phone
        # -------------------------

        if patient.phone:

            existing_patient = users_collection.find_one({
                "phone": patient.phone,
                "role": "patient"
            })

            if existing_patient:
                raise HTTPException(
                    status_code=409,
                    detail="Patient with this phone number already exists"
                )

        # -------------------------
        # Check duplicate email
        # -------------------------

        if patient.email:

            existing_patient = users_collection.find_one({
                "email": patient.email,
                "role": "patient"
            })

            if existing_patient:
                raise HTTPException(
                    status_code=409,
                    detail="Patient with this email already exists"
                )

        # -------------------------
        # Create document
        # -------------------------

        document = create_user_document(
            name=patient.name.strip(),
            phone=patient.phone,
            email=patient.email,
            role="patient",
        )

        result = users_collection.insert_one(document)

        return {
            "success": True,
            "message": "Patient created successfully",
            "patient_id": str(result.inserted_id),
            "patient": {
                "_id": str(result.inserted_id),
                "name": document["name"],
                "phone": document["phone"],
                "email": document["email"],
                "role": document["role"],
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        print("CREATE PATIENT ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to create patient"
        )


# =========================
# PATIENT LOGIN
# =========================

@router.post("/login")
def patient_login(patient: PatientLogin):

    try:

        # -------------------------
        # Require phone or email
        # -------------------------

        if not patient.phone and not patient.email:
            raise HTTPException(
                status_code=400,
                detail="Phone or email is required"
            )

        # -------------------------
        # Build login query
        # -------------------------

        query = {
            "role": "patient"
        }

        if patient.phone:
            query["phone"] = patient.phone

        elif patient.email:
            query["email"] = patient.email

        # -------------------------
        # Find patient
        # -------------------------

        existing_patient = users_collection.find_one(query)

        if not existing_patient:
            raise HTTPException(
                status_code=404,
                detail="Patient not found. Please register first."
            )

        # -------------------------
        # Return patient
        # -------------------------

        return {
            "success": True,
            "message": "Patient login successful",
            "patient": {
                "_id": str(existing_patient["_id"]),
                "name": existing_patient.get("name"),
                "phone": existing_patient.get("phone"),
                "email": existing_patient.get("email"),
                "role": existing_patient.get("role"),
                "createdAt": existing_patient.get("createdAt"),
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        print("PATIENT LOGIN ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Patient login failed"
        )


# =========================
# GET PATIENT
# =========================

@router.get("/{patient_id}")
def get_patient(patient_id: str):

    try:

        from bson import ObjectId

        if not ObjectId.is_valid(patient_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid patient ID"
            )

        patient = users_collection.find_one({
            "_id": ObjectId(patient_id),
            "role": "patient"
        })

        if not patient:
            raise HTTPException(
                status_code=404,
                detail="Patient not found"
            )

        return {
            "success": True,
            "patient": {
                "_id": str(patient["_id"]),
                "name": patient.get("name"),
                "phone": patient.get("phone"),
                "email": patient.get("email"),
                "role": patient.get("role"),
                "createdAt": patient.get("createdAt"),
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        print("GET PATIENT ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to get patient"
        )