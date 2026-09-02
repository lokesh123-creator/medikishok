from typing import Any, Dict, List
import base64
from routes.consultation import router as consultation_router
from services.groq import generate_next_question
from services.sarvam import transcribe_audio, text_to_speech

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field
from config.database import connect_to_mongodb
from routes.patient import router as patient_router
from routes.doctor import router as doctor_router


app = FastAPI(
    title="MediKiosk AI Clinical Assistant",
    version="1.0.0"
)


@app.on_event("startup")
def startup_db():
    connect_to_mongodb()

# ==================================================
# CORS
# ==================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patient_router)
app.include_router(doctor_router)
app.include_router(consultation_router)


# ==================================================
# BASIC ENDPOINTS
# ==================================================

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "MediKiosk AI Clinical Assistant"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==================================================
# SPEECH → TEXT
# Sarvam AI STT
# ==================================================

@app.post("/api/stt")
async def speech_to_text(
    audio: UploadFile = File(...),
    language: str = Form("en"),
):
    try:

        audio_bytes = await audio.read()

        if not audio_bytes:
            raise HTTPException(
                status_code=400,
                detail="Audio file is empty"
            )

        result = transcribe_audio(
            audio_bytes=audio_bytes,
            language=language,
        )

        return {
            "success": True,
            "transcript": result["transcript"],
            "language_code": result["language_code"],
        }

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==================================================
# TEXT → SPEECH
# Sarvam AI Bulbul TTS
# ==================================================

@app.post("/api/tts")
async def text_to_speech_api(
    text: str = Form(...),
    language: str = Form("en"),
):
    try:

        # ------------------------------------------
        # Validate text
        # ------------------------------------------

        if not text.strip():
            raise HTTPException(
                status_code=400,
                detail="Text is empty"
            )

        # ------------------------------------------
        # Call Sarvam TTS
        # ------------------------------------------

        result = text_to_speech(
            text=text,
            language=language,
        )

        # ------------------------------------------
        # Get base64 audio
        # ------------------------------------------

        if not result.get("audios"):
            raise HTTPException(
                status_code=500,
                detail="Sarvam TTS returned no audio"
            )

        audio_base64 = result["audios"][0]

        # ------------------------------------------
        # Decode base64 → bytes
        # ------------------------------------------

        audio_bytes = base64.b64decode(audio_base64)

        # ------------------------------------------
        # Return audio
        # ------------------------------------------

        return Response(
            content=audio_bytes,
            media_type="audio/wav",
            headers={
                "Content-Disposition": (
                    "inline; filename=medikiosk-question.wav"
                )
            }
        )

    except HTTPException:
        raise

    except Exception as e:

        print("TTS ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ==================================================
# INTERVIEW REQUEST MODEL
# ==================================================

class InterviewRequest(BaseModel):

    language: str

    consultation_type: str

    answer: str

    history: List[Dict[str, Any]] = Field(
        default_factory=list
    )


# ==================================================
# AI INTERVIEW
# Speech Answer → Groq → Next Question
# ==================================================

@app.post("/api/interview")
def interview(
    request: InterviewRequest
):

    try:

        result = generate_next_question(
            language=request.language,
            consultation_type=request.consultation_type,
            answer=request.answer,
            history=request.history,
        )

        return {
            "success": True,

            "language": request.language,

            "consultation_type": request.consultation_type,

            "patient_answer": request.answer,

            # Structured clinical information
            "extracted": result["extracted"],

            # Adaptive question
            "next_question": result["next_question"],

            # Why this question was selected
            "reason": result["reason"],

            # Clinical category
            "category": result["category"],

            # Red flag screening
            "red_flag": result["red_flag"],
        }

    except Exception as e:

        print("INTERVIEW ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )