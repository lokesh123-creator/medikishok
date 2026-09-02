from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config.database import users_collection
from models.user import create_user_document

router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"]
)


class PatientCreate(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None


@router.post("")
def create_patient(patient: PatientCreate):

    try:
        document = create_user_document(
            name=patient.name,
            phone=patient.phone,
            email=patient.email,
            role="patient",
        )

        result = users_collection.insert_one(document)

        return {
            "success": True,
            "message": "Patient created successfully",
            "patient_id": str(result.inserted_id),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )