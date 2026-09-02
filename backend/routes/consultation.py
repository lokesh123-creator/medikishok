from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from bson import ObjectId

from config.database import consultations_collection


router = APIRouter(
    prefix="/api/consultations",
    tags=["Consultations"]
)


class ConsultationCreate(BaseModel):
    patient_id: str
    language: str = "en"
    consultation_type: str = "clinical"


class ConsultationResponse(BaseModel):
    success: bool
    message: str
    consultation_id: str


@router.post("", response_model=ConsultationResponse)
def create_consultation(data: ConsultationCreate):
    try:
        if not ObjectId.is_valid(data.patient_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid patient_id"
            )

        consultation = {
            "patientId": ObjectId(data.patient_id),
            "language": data.language,
            "consultationType": data.consultation_type,
            "status": "active",
            "startedAt": datetime.now(timezone.utc),
            "completedAt": None,

            "conversation": [],

            "clinicalHistory": {
                "chiefComplaint": None,
                "duration": None,
                "symptoms": [],
                "severity": None,
                "onset": None,
                "aggravatingFactors": [],
                "relievingFactors": [],
                "appetite": None,
                "bowelHabits": None,
                "sleep": None
            },

            "ayurvedicHistory": {
                "prakriti": None,
                "vikriti": None,
                "agni": None,
                "koshtha": None,
                "ahara": None,
                "vihara": None,
                "nidra": None,
                "dashavidhaPariksha": {}
            },

            "redFlags": []
        }

        result = consultations_collection.insert_one(consultation)

        return {
            "success": True,
            "message": "Consultation created successfully",
            "consultation_id": str(result.inserted_id)
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


@router.get("/{consultation_id}")
def get_consultation(consultation_id: str):
    try:
        if not ObjectId.is_valid(consultation_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid consultation_id"
            )

        consultation = consultations_collection.find_one(
            {"_id": ObjectId(consultation_id)}
        )

        if not consultation:
            raise HTTPException(
                status_code=404,
                detail="Consultation not found"
            )

        consultation["_id"] = str(consultation["_id"])
        consultation["patientId"] = str(consultation["patientId"])

        return {
            "success": True,
            "consultation": consultation
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

class ConsultationAnswer(BaseModel):
    question: str
    answer: str
    extracted: dict = Field(default_factory=dict)
    red_flag: bool = False


@router.post("/{consultation_id}/answer")
def save_consultation_answer(
    consultation_id: str,
    data: ConsultationAnswer
):
    try:
        if not ObjectId.is_valid(consultation_id):
            raise HTTPException(
                status_code=400,
                detail="Invalid consultation_id"
            )

        consultation = consultations_collection.find_one(
            {"_id": ObjectId(consultation_id)}
        )

        if not consultation:
            raise HTTPException(
                status_code=404,
                detail="Consultation not found"
            )

        now = datetime.now(timezone.utc)

        # Save conversation
        conversation_item = {
            "question": data.question,
            "answer": data.answer,
            "timestamp": now
        }

        consultations_collection.update_one(
            {"_id": ObjectId(consultation_id)},
            {
                "$push": {
                    "conversation": conversation_item
                }
            }
        )

        extracted = data.extracted

        # Clinical history
        clinical_update = {}

        clinical_mapping = {
            "chief_complaint": "clinicalHistory.chiefComplaint",
            "duration": "clinicalHistory.duration",
            "symptoms": "clinicalHistory.symptoms",
            "severity": "clinicalHistory.severity",
            "onset": "clinicalHistory.onset",
            "aggravating_factors": "clinicalHistory.aggravatingFactors",
            "relieving_factors": "clinicalHistory.relievingFactors",
            "appetite": "clinicalHistory.appetite",
            "bowel_habits": "clinicalHistory.bowelHabits",
            "sleep": "clinicalHistory.sleep"
        }

        for ai_key, mongo_key in clinical_mapping.items():
            value = extracted.get(ai_key)

            if value is not None and value != [] and value != "":
                clinical_update[mongo_key] = value

        # Ayurvedic history
        ayurvedic_mapping = {
            "prakriti": "ayurvedicHistory.prakriti",
            "vikriti": "ayurvedicHistory.vikriti",
            "agni": "ayurvedicHistory.agni",
            "koshtha": "ayurvedicHistory.koshtha",
            "ahara": "ayurvedicHistory.ahara",
            "vihara": "ayurvedicHistory.vihara",
            "nidra": "ayurvedicHistory.nidra",
            "dashavidha_pariksha": (
                "ayurvedicHistory.dashavidhaPariksha"
            )
        }

        for ai_key, mongo_key in ayurvedic_mapping.items():
            value = extracted.get(ai_key)

            if value is not None and value != {} and value != "":
                clinical_update[mongo_key] = value

        update_data = {}

        if clinical_update:
            update_data["$set"] = clinical_update

        # Red flag
        if data.red_flag:
            update_data.setdefault("$push", {})
            update_data["$push"]["redFlags"] = {
                "question": data.question,
                "answer": data.answer,
                "timestamp": now
            }

        if update_data:
            consultations_collection.update_one(
                {"_id": ObjectId(consultation_id)},
                update_data
            )

        return {
            "success": True,
            "message": "Consultation answer saved successfully"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )