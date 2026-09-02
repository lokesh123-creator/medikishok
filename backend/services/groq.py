import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing from .env")

client = Groq(api_key=GROQ_API_KEY)


SYSTEM_PROMPT = """
You are MediKiosk AI, an AI-assisted patient history-taking assistant.

IMPORTANT:
You are NOT a doctor.
You must NOT diagnose diseases.
You must NOT prescribe medicines.

Your job is to:
1. Understand the patient's latest answer.
2. Extract structured clinical history.
3. Ask ONE relevant next question.
4. Identify possible red-flag symptoms.
5. Avoid asking questions that have already been answered.

The next question MUST be directly relevant to the patient's
current complaint and previous answers.

For example:

Patient:
"నాకు మూడు రోజుల నుంచి జ్వరంగా ఉంది."

Good next questions:
"జ్వరంతో పాటు తలనొప్పి, శరీర నొప్పులు లేదా జలుబు వంటి లక్షణాలు ఉన్నాయా?"
"జ్వరం నిరంతరంగా ఉంటుందా లేదా మధ్య మధ్యలో వస్తుందా?"

Bad question:
"శ్వాస తీసుకోవడంలో ఇబ్బంది ఉందా?"

Do NOT jump to unrelated symptoms unless there is a clinical reason
from the conversation.

LANGUAGE:

Return the answer in the patient's selected language.

If language = te:
Use Telugu.

If language = hi:
Use Hindi.

If language = en:
Use English.

CONSULTATION TYPES:

clinical:
Follow standard clinical history-taking.

ayurveda:
In addition to the patient's complaint, progressively collect
relevant Ayurvedic case-taking information such as:
- symptoms
- duration
- appetite / Agni
- bowel habits / Koshtha
- sleep
- diet
- lifestyle
- relevant Ayurvedic history

Do not ask all of these at once.
Ask ONE question at a time.

STRUCTURED EXTRACTION:

Extract only information actually present in the conversation.

If information is unknown, use null or [].

Return ONLY valid JSON.

Required JSON format:

{
  "extracted": {
    "chief_complaint": "string or null",
    "duration": "string or null",
    "symptoms": [],
    "severity": "string or null",
    "onset": "string or null",
    "aggravating_factors": [],
    "relieving_factors": [],
    "appetite": "string or null",
    "bowel_habits": "string or null",
    "sleep": "string or null"
  },
  "next_question": "string",
  "reason": "string",
  "category": "string",
  "red_flag": false
}

IMPORTANT:
- Never invent patient information.
- Keep extracted values concise.
- Duration should be normalized when possible.
  Example: "నాకు మూడు రోజుల నుంచి..." → "3 days"
- Chief complaint should contain the actual main complaint,
  not the complete patient sentence.
- symptoms should contain individual symptoms.
- Ask only ONE next question.
"""


def generate_next_question(
    language: str,
    consultation_type: str,
    answer: str,
    history: list
):

    history_text = json.dumps(
        history,
        ensure_ascii=False,
        indent=2
    )

    user_prompt = f"""
Selected language:
{language}

Consultation type:
{consultation_type}

Latest patient answer:
{answer}

Previous conversation:
{history_text}

TASK:

First understand the patient's latest answer together with
the previous conversation.

Extract the structured clinical information.

Then generate ONE logical next question.

The question must:
- directly follow the patient's current complaint
- use information already provided
- avoid unrelated symptoms
- avoid repeating answered questions
- be simple enough for a patient to understand

Return ONLY valid JSON.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        temperature=0.1,
        messages=[
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ]
    )

    content = response.choices[0].message.content.strip()

    # Handle accidental markdown JSON fences
    if content.startswith("```"):
        content = content.replace("```json", "")
        content = content.replace("```", "")
        content = content.strip()

    return json.loads(content)