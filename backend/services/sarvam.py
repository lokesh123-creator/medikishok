import os
import io
import base64
import httpx

from dotenv import load_dotenv
from sarvamai import SarvamAI


# ==================================================
# ENVIRONMENT
# ==================================================

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    raise RuntimeError(
        "SARVAM_API_KEY is missing from .env"
    )


# ==================================================
# SARVAM CLIENT
# ==================================================

client = SarvamAI(
    api_subscription_key=SARVAM_API_KEY
)


# ==================================================
# LANGUAGE CODES
# ==================================================

LANGUAGE_CODES = {
    "te": "te-IN",
    "hi": "hi-IN",
    "en": "en-IN",
}


# ==================================================
# SPEECH → TEXT
# SDK VERSION
# ==================================================

def transcribe_audio(audio_bytes, language):

    language_code = LANGUAGE_CODES.get(
        language,
        "en-IN"
    )

    response = client.speech_to_text.transcribe(
        file=io.BytesIO(audio_bytes),
        model="saaras:v3",
        language_code=language_code,
        mode="transcribe",
    )

    return {
        "transcript": response.transcript,
        "language_code": response.language_code,
    }


# ==================================================
# TEXT → SPEECH
# DIRECT SARVAM REST API
# ==================================================

def text_to_speech(text: str, language: str):

    language_code = LANGUAGE_CODES.get(
        language,
        "en-IN"
    )

    url = "https://api.sarvam.ai/text-to-speech"

    headers = {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    payload = {
        "text": text,
        "language_code": language_code,
        "speaker": "priya",
        "model": "bulbul:v3",
        "output_audio_codec": "wav",
    }

    response = httpx.post(
        url,
        headers=headers,
        json=payload,
        timeout=60.0,
    )

    if response.status_code != 200:
        raise RuntimeError(
            f"Sarvam TTS API error "
            f"{response.status_code}: "
            f"{response.text}"
        )

    data = response.json()

    if not data.get("audios"):
        raise RuntimeError(
            "Sarvam TTS returned no audio"
        )

    return data