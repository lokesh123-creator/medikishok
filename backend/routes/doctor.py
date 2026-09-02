from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config.database import doctors_collection
from models.doctor import create_doctor_document

router = APIRouter(
    prefix="/api/doctors",
    tags=["Doctors"]
)


class DoctorCreate(BaseModel):
    name: str
    phone: str | None = None
    email: str | None = None
    specialization: str | None = None


@router.post("")
def create_doctor(doctor: DoctorCreate):

    try:
        document = create_doctor_document(
            name=doctor.name,
            phone=doctor.phone,
            email=doctor.email,
            specialization=doctor.specialization,
        )

        result = doctors_collection.insert_one(document)

        return {
            "success": True,
            "message": "Doctor created successfully",
            "doctor_id": str(result.inserted_id),
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )