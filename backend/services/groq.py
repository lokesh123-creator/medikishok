import json
import os
import re

from dotenv import load_dotenv
from groq import Groq

from services.question_engine import (
    build_question_engine_context,
    merge_extracted_information,
    validate_question,
)


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is missing from .env")

client = Groq(api_key=GROQ_API_KEY)


# ============================================================
# DEFAULT EXTRACTION STRUCTURE
# ============================================================

def empty_extracted():
    return {
        "chief_complaint": None,
        "duration": None,
        "symptoms": [],
        "severity": None,
        "onset": None,
        "aggravating_factors": [],
        "relieving_factors": [],
        "appetite": None,
        "bowel_habits": None,
        "sleep": None,

        "prakriti": None,
        "vikriti": None,
        "agni": None,
        "koshtha": None,
        "ahara": None,
        "vihara": None,
        "nidra": None,
        "dashavidha_pariksha": {},
    }


# ============================================================
# SYSTEM PROMPT — LATEST ANSWER EXTRACTION
# ============================================================

EXTRACTION_SYSTEM_PROMPT = """
You are MediKiosk AI, an AI-assisted patient
clinical history extraction system.

You are NOT a doctor.

Your ONLY task is to extract information from
THE LATEST PATIENT ANSWER.

==================================================
CRITICAL RULE
==================================================

You MUST extract information ONLY from the
LATEST PATIENT ANSWER.

The current question is provided only to understand
WHAT the patient's answer refers to.

DO NOT use previous patient answers.

DO NOT copy information from previous turns.

DO NOT assume that information from the current
question is true.

DO NOT treat information mentioned in the question
as information provided by the patient.

DO NOT fill fields using medical knowledge.

DO NOT infer symptoms that the patient did not say.

DO NOT infer severity that the patient did not say.

DO NOT infer onset that the patient did not say.

DO NOT copy the chief complaint into symptoms unless
the patient explicitly describes it as a symptom.

==================================================
VERY IMPORTANT
==================================================

If the patient says:

"నాకు మూడు రోజుల నుంచి ఉంది"

and the current question is:

"ఈ సమస్య మీకు ఎన్ని రోజులుగా ఉంది?"

then:

duration = "3 days"

Do NOT set:

symptoms = ["fever"]

severity = "increased"

onset = "3 days ago"

unless the patient explicitly provides those details.

--------------------------------------------------

If the current question is:

"ఈ సమస్య ఎప్పుడు ప్రారంభమైంది?"

and the patient says:

"మూడు రోజుల క్రితం"

then:

onset = "3 days ago"

Do NOT automatically set:

duration = "3 days"

unless the patient explicitly states duration.

==================================================
EXTRACTION PRINCIPLE
==================================================

QUESTION = context

ANSWER = source of truth

Only information explicitly supported by ANSWER
may be extracted.

==================================================
EXAMPLES
==================================================

Example 1:

Question:
"ఈ సమస్య మీకు ఎన్ని రోజులుగా ఉంది?"

Answer:
"త్రీ డేస్ నుంచి"

Correct:

{
  "duration": "3 days"
}

Incorrect:

{
  "symptoms": ["fever"],
  "severity": "increased"
}

--------------------------------------------------

Example 2:

Question:
"ఈ సమస్య ఎప్పుడు ప్రారంభమైంది?"

Answer:
"మూడు రోజుల క్రితం"

Correct:

{
  "onset": "3 days ago"
}

--------------------------------------------------

Example 3:

Question:
"ఇంకా ఏమైనా లక్షణాలు ఉన్నాయా?"

Answer:
"తలనొప్పి మరియు ఒళ్ళు నొప్పులు ఉన్నాయి"

Correct:

{
  "symptoms": [
    "headache",
    "body pain"
  ]
}

--------------------------------------------------

Example 4:

Question:
"ఈ సమస్య ఎంత తీవ్రంగా ఉంది?"

Answer:
"చాలా ఎక్కువగా ఉంది"

Correct:

{
  "severity": "severe"
}

--------------------------------------------------

Example 5:

Question:
"మీకు ఆకలి ఎలా ఉంది?"

Answer:
"ఆకలి తగ్గింది"

Correct:

{
  "appetite": "reduced"
}

--------------------------------------------------

Example 6:

Question:
"ఏదైనా ఇతర లక్షణాలు ఉన్నాయా?"

Answer:
"లేదు"

Correct:

{
  "symptoms": []
}

Do NOT invent symptoms.

==================================================
UNKNOWN VALUES
==================================================

If information is NOT explicitly present in the
latest answer, return:

null

[]

{}

depending on the field type.

==================================================
CLINICAL FIELDS
==================================================

chief_complaint
duration
symptoms
severity
onset
aggravating_factors
relieving_factors
appetite
bowel_habits
sleep

==================================================
AYURVEDIC FIELDS
==================================================

prakriti
vikriti
agni
koshtha
ahara
vihara
nidra
dashavidha_pariksha

Only extract Ayurvedic information when the
patient explicitly provides it.

==================================================
NO DIAGNOSIS
==================================================

Never diagnose the patient.

Never prescribe medicine.

Never recommend treatment.

Never invent medical information.

==================================================
RED FLAG
==================================================

Set red_flag=true ONLY if the LATEST PATIENT ANSWER
itself reports a potentially serious warning sign.

Examples:

- severe difficulty breathing
- severe chest pain
- loss of consciousness
- severe uncontrolled bleeding
- sudden severe neurological symptoms
- extremely severe symptoms
- rapidly worsening serious symptoms

Do NOT mark a red flag simply because a previous
answer contained one.

Only evaluate the latest answer.

==================================================
OUTPUT
==================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "extracted": {
    "chief_complaint": null,
    "duration": null,
    "symptoms": [],
    "severity": null,
    "onset": null,
    "aggravating_factors": [],
    "relieving_factors": [],
    "appetite": null,
    "bowel_habits": null,
    "sleep": null,

    "prakriti": null,
    "vikriti": null,
    "agni": null,
    "koshtha": null,
    "ahara": null,
    "vihara": null,
    "nidra": null,
    "dashavidha_pariksha": {}
  },

  "red_flag": false
}
"""


# ============================================================
# SYSTEM PROMPT — QUESTION GENERATION
# ============================================================

QUESTION_SYSTEM_PROMPT = """
You are MediKiosk AI.

You are an AI-assisted patient history-taking assistant.

You are NOT a doctor.

Your task is ONLY to generate ONE simple
patient-friendly question.

The Question Engine has already decided
WHAT TOPIC must be asked.

You decide only HOW to phrase the question.

==================================================
RULES
==================================================

1. Generate exactly ONE question.

2. Use the selected patient language.

3. Keep the question short and natural.

4. Ask only about the selected topic.

5. Never combine two topics.

6. Never ask for information already known.

7. Never repeat a previous question.

8. Never diagnose.

9. Never recommend treatment.

10. Never invent patient information.

==================================================
BAD
==================================================

"How is your appetite and sleep?"

This contains two topics.

==================================================
GOOD
==================================================

"How has your appetite been?"

==================================================
LANGUAGE
==================================================

te = simple conversational Telugu

hi = simple conversational Hindi

en = simple conversational English

==================================================
OUTPUT
==================================================

Return ONLY valid JSON:

{
  "next_question": "ONE question"
}
"""


# ============================================================
# FALLBACK QUESTIONS
# ============================================================

FALLBACK_QUESTIONS = {

    "en": {
        "chief_complaint":
            "What is the main problem you are experiencing?",

        "duration":
            "How long have you had this problem?",

        "symptoms":
            "What other symptoms are you having?",

        "severity":
            "How severe is the problem?",

        "onset":
            "When did the problem start?",

        "aggravating_factors":
            "What makes the problem worse?",

        "relieving_factors":
            "What makes the problem feel better?",

        "appetite":
            "How has your appetite been?",

        "agni":
            "How has your digestion been?",

        "bowel_habits":
            "How have your bowel movements been?",

        "koshtha":
            "How would you describe your usual bowel pattern?",

        "sleep":
            "How has your sleep been?",

        "nidra":
            "How has your sleep been recently?",

        "ahara":
            "What is your usual diet like?",

        "vihara":
            "What is your usual daily lifestyle like?",

        "prakriti":
            "Is there anything about your usual body nature you would like to describe?",

        "vikriti":
            "Have you noticed any recent changes in your usual body condition?",

        "dashavidha_pariksha":
            "Is there anything else important about your general health that you would like to tell me?",
    },

    "te": {
        "chief_complaint":
            "మీకు ప్రస్తుతం ప్రధానంగా ఏ సమస్య ఉంది?",

        "duration":
            "ఈ సమస్య మీకు ఎన్ని రోజులుగా ఉంది?",

        "symptoms":
            "ఇంకా ఏమైనా లక్షణాలు ఉన్నాయా?",

        "severity":
            "ఈ సమస్య ఎంత తీవ్రంగా ఉంది?",

        "onset":
            "ఈ సమస్య ఎప్పుడు ప్రారంభమైంది?",

        "aggravating_factors":
            "ఏ సమయంలో లేదా దేనివల్ల ఈ సమస్య ఎక్కువ అవుతుంది?",

        "relieving_factors":
            "దేనివల్ల ఈ సమస్య తగ్గుతుంది?",

        "appetite":
            "మీకు ఆకలి ఎలా ఉంది?",

        "agni":
            "మీ జీర్ణశక్తి ఎలా ఉంది?",

        "bowel_habits":
            "మీ మల విసర్జన ఎలా ఉంది?",

        "koshtha":
            "మీ సాధారణ మల విసర్జన విధానం ఎలా ఉంటుంది?",

        "sleep":
            "మీ నిద్ర ఎలా ఉంది?",

        "nidra":
            "ఇటీవల మీ నిద్ర ఎలా ఉంది?",

        "ahara":
            "మీ సాధారణ ఆహారపు అలవాట్లు ఎలా ఉన్నాయి?",

        "vihara":
            "మీ సాధారణ రోజువారీ జీవనశైలి ఎలా ఉంటుంది?",

        "prakriti":
            "మీ సాధారణ శరీర స్వభావం గురించి ఏమైనా చెప్పగలరా?",

        "vikriti":
            "మీ సాధారణ శరీర పరిస్థితిలో ఇటీవల ఏమైనా మార్పులు గమనించారా?",

        "dashavidha_pariksha":
            "మీ ఆరోగ్యం గురించి ఇంకా ఏదైనా ముఖ్యమైన విషయం చెప్పాలనుకుంటున్నారా?",
    },

    "hi": {
        "chief_complaint":
            "आपको अभी मुख्य रूप से क्या समस्या है?",

        "duration":
            "यह समस्या आपको कितने दिनों से है?",

        "symptoms":
            "क्या आपको और कोई लक्षण हो रहे हैं?",

        "severity":
            "यह समस्या कितनी गंभीर है?",

        "onset":
            "यह समस्या कब शुरू हुई?",

        "aggravating_factors":
            "किस चीज़ से यह समस्या बढ़ जाती है?",

        "relieving_factors":
            "किस चीज़ से यह समस्या कम होती है?",

        "appetite":
            "आपकी भूख कैसी है?",

        "agni":
            "आपका पाचन कैसा है?",

        "bowel_habits":
            "आपका मल त्याग कैसा रहता है?",

        "koshtha":
            "आपकी सामान्य मल त्याग की आदत कैसी है?",

        "sleep":
            "आपकी नींद कैसी है?",

        "nidra":
            "हाल में आपकी नींद कैसी रही है?",

        "ahara":
            "आपका सामान्य भोजन कैसा रहता है?",

        "vihara":
            "आपकी सामान्य दैनिक जीवनशैली कैसी है?",

        "prakriti":
            "आप अपने सामान्य शरीर के स्वभाव के बारे में कुछ बता सकते हैं?",

        "vikriti":
            "क्या आपने अपनी सामान्य शारीरिक स्थिति में हाल में कोई बदलाव देखा है?",

        "dashavidha_pariksha":
            "क्या आप अपने स्वास्थ्य के बारे में कोई और महत्वपूर्ण बात बताना चाहेंगे?",
    },
}


# ============================================================
# JSON CLEANING
# ============================================================

def clean_json_content(content: str):
    """
    Remove markdown fences and surrounding text.
    """

    if not isinstance(content, str):
        return ""

    content = content.strip()

    if content.startswith("```"):

        content = re.sub(
            r"^```(?:json)?",
            "",
            content,
            flags=re.IGNORECASE,
        )

        content = re.sub(
            r"```$",
            "",
            content,
        )

        content = content.strip()

    # Try to isolate JSON object if model added text.
    if not content.startswith("{"):

        start = content.find("{")
        end = content.rfind("}")

        if start != -1 and end != -1 and end > start:
            content = content[start:end + 1]

    return content.strip()


# ============================================================
# SAFE JSON PARSER
# ============================================================

def parse_json(content: str):

    cleaned = clean_json_content(content)

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError as exc:

        print("❌ Groq invalid JSON:")
        print(cleaned)

        raise ValueError(
            f"Groq returned invalid JSON: {exc}"
        )


# ============================================================
# NORMALIZE EXTRACTION
# ============================================================

def normalize_extraction(extracted):
    """
    Make sure all expected fields exist.
    """

    result = empty_extracted()

    if not isinstance(extracted, dict):
        return result

    for key in result:

        value = extracted.get(key)

        if value is None:
            continue

        if key in [
            "symptoms",
            "aggravating_factors",
            "relieving_factors",
        ]:

            if isinstance(value, list):
                result[key] = value

        elif key == "dashavidha_pariksha":

            if isinstance(value, dict):
                result[key] = value

        else:

            result[key] = value

    return result


# ============================================================
# EXTRACT EXISTING INFORMATION
# ============================================================

def extract_existing_information(history):
    """
    Merge all structured extraction already stored
    in interview history.
    """

    combined = empty_extracted()

    if not isinstance(history, list):
        return combined

    for item in history:

        if not isinstance(item, dict):
            continue

        extracted = item.get("extracted")

        if not isinstance(extracted, dict):
            continue

        normalized = normalize_extraction(extracted)

        combined = merge_extracted_information(
            combined,
            normalized,
        )

    return combined


# ============================================================
# EXTRACT LATEST ANSWER
# ============================================================

def extract_latest_answer(
    language: str,
    consultation_type: str,
    current_question: str,
    answer: str,
):
    """
    Groq #1.

    IMPORTANT:
    Groq receives ONLY the current question and
    latest patient answer.

    Previous history is intentionally NOT sent.

    This prevents the model from copying previous
    symptoms, severity, duration, etc.
    """

    prompt = f"""
Selected language:
{language}

Consultation type:
{consultation_type}

==================================================
CURRENT QUESTION
==================================================

{current_question}

==================================================
LATEST PATIENT ANSWER
==================================================

{answer}

==================================================
TASK
==================================================

Extract information ONLY from the latest patient
answer.

The current question is provided only to understand
which field the answer belongs to.

The latest answer is the ONLY source of patient
information.

Do NOT use previous conversation.

Do NOT assume previous information.

Do NOT copy information from previous turns.

Do NOT fill fields that are not explicitly supported
by the latest answer.

If the patient only says "three days", do not create
symptoms or severity.

If the current question is about duration, map
"three days" to duration.

If the current question is about onset, map
"three days ago" to onset.

If the patient does not explicitly provide a field,
return null for scalar fields, [] for listed fields,
or an empty object for object fields.

Also determine whether the LATEST ANSWER itself
contains a red flag.

Return ONLY valid JSON.
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        temperature=0.0,
        messages=[
            {
                "role": "system",
                "content": EXTRACTION_SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    content = (
        response
        .choices[0]
        .message
        .content
        .strip()
    )

    result = parse_json(content)

    latest_extracted = normalize_extraction(
        result.get("extracted", {})
    )

    red_flag = result.get("red_flag") is True

    return {
        "extracted": latest_extracted,
        "red_flag": red_flag,
    }


# ============================================================
# GENERATE QUESTION
# ============================================================

def generate_question_phrase(
    language: str,
    consultation_type: str,
    next_topic: str,
    next_topic_label: str,
    completed_topics: list,
    previous_questions: list,
    extracted: dict,
):
    """
    Groq #2.

    Question Engine decides the topic.
    Groq only phrases the question.
    """

    previous_questions_text = json.dumps(
        previous_questions,
        ensure_ascii=False,
        indent=2,
    )

    completed_topics_text = json.dumps(
        completed_topics,
        ensure_ascii=False,
    )

    extracted_text = json.dumps(
        extracted,
        ensure_ascii=False,
        indent=2,
    )

    prompt = f"""
Selected language:
{language}

Consultation type:
{consultation_type}

==================================================
QUESTION ENGINE DECISION
==================================================

Next topic:
{next_topic}

Topic description:
{next_topic_label}

==================================================
ALREADY COMPLETED TOPICS
==================================================

{completed_topics_text}

==================================================
CURRENT EXTRACTED INFORMATION
==================================================

{extracted_text}

==================================================
PREVIOUS QUESTIONS
==================================================

{previous_questions_text}

==================================================
TASK
==================================================

Generate ONE simple patient-friendly question
for the topic:

{next_topic}

The question MUST be written in:

{language}

Do not ask about another topic.

Do not repeat previous questions.

Do not ask for information already clearly known.

Return ONLY JSON:

{{
  "next_question": "ONE question"
}}
"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        temperature=0.1,
        messages=[
            {
                "role": "system",
                "content": QUESTION_SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    content = (
        response
        .choices[0]
        .message
        .content
        .strip()
    )

    result = parse_json(content)

    question = result.get(
        "next_question",
        "",
    )

    if not isinstance(question, str):
        question = ""

    return question.strip()


# ============================================================
# FALLBACK QUESTION
# ============================================================

def get_fallback_question(
    language: str,
    topic: str,
):
    language = (
        language
        if language in FALLBACK_QUESTIONS
        else "en"
    )

    return (
        FALLBACK_QUESTIONS
        .get(language, {})
        .get(topic, "")
    )


# ============================================================
# MAIN QUESTION GENERATION PIPELINE
# ============================================================

def generate_next_question(
    language: str,
    consultation_type: str,
    answer: str,
    history: list,
):
    """
    Complete MediKiosk interview pipeline.

    Pipeline:

        Previous History
              ↓
        Latest Question + Answer
              ↓
        Groq #1 Extraction
              ↓
        Merge Previous + Latest
              ↓
        Question Engine
              ↓
        Groq #2 Question Phrasing
              ↓
        Validation
              ↓
        Final Result
    """

    # ========================================================
    # SAFETY
    # ========================================================

    if not isinstance(history, list):
        history = []

    answer = (
        answer.strip()
        if isinstance(answer, str)
        else ""
    )

    if not answer:
        raise ValueError(
            "Patient answer is empty."
        )

    # ========================================================
    # IDENTIFY CURRENT TURN
    # ========================================================

    current_question = ""

    if history:

        last_item = history[-1]

        if isinstance(last_item, dict):

            last_answer = last_item.get(
                "answer",
                "",
            )

            if isinstance(
                last_item.get(
                    "question",
                    "",
                ),
                str,
            ):

                current_question = (
                    last_item.get(
                        "question",
                        "",
                    )
                )

            if (
                isinstance(last_answer, str)
                and last_answer.strip() == answer
            ):

                previous_history = history[:-1]

            else:

                previous_history = history

        else:

            previous_history = history

    else:

        previous_history = []

    # ========================================================
    # EXISTING INFORMATION
    # ========================================================

    previous_extracted = (
        extract_existing_information(
            previous_history
        )
    )

    # ========================================================
    # GROQ #1 — EXTRACT ONLY LATEST ANSWER
    # ========================================================

    extraction_result = extract_latest_answer(
        language=language,
        consultation_type=consultation_type,
        current_question=current_question,
        answer=answer,
    )

    latest_extracted = (
        extraction_result["extracted"]
    )

    latest_red_flag = (
        extraction_result["red_flag"]
    )

    # ========================================================
    # MERGE PREVIOUS + LATEST
    # ========================================================

    combined_extracted = (
        merge_extracted_information(
            previous_extracted,
            latest_extracted,
        )
    )

    # ========================================================
    # BUILD CURRENT TURN
    # ========================================================

    current_turn = {
        "question": current_question,
        "answer": answer,
        "extracted": latest_extracted,
        "red_flag": latest_red_flag,
    }

    history_for_engine = [
        *previous_history,
        current_turn,
    ]

    # ========================================================
    # QUESTION ENGINE
    # ========================================================

    engine_context = (
        build_question_engine_context(
            extracted=previous_extracted,
            consultation_type=consultation_type,
            history=history_for_engine,
            latest_extracted=latest_extracted,
        )
    )

    next_topic = engine_context.get(
        "next_topic"
    )

    next_topic_label = engine_context.get(
        "next_topic_label"
    )

    completed_topics = engine_context.get(
        "completed_topics",
        [],
    )

    previous_questions = engine_context.get(
        "previous_questions",
        [],
    )

    # ========================================================
    # INTERVIEW COMPLETE
    # ========================================================

    if not next_topic:

        return {
            "extracted": combined_extracted,
            "next_question": "",
            "reason": (
                "All required interview topics "
                "have been collected."
            ),
            "category": "completed",
            "red_flag": latest_red_flag,
            "completed": True,
        }

    # ========================================================
    # GROQ #2 — PHRASE QUESTION
    # ========================================================

    question = ""

    try:

        question = generate_question_phrase(
            language=language,
            consultation_type=consultation_type,
            next_topic=next_topic,
            next_topic_label=(
                next_topic_label or ""
            ),
            completed_topics=completed_topics,
            previous_questions=previous_questions,
            extracted=combined_extracted,
        )

    except Exception as exc:

        print(
            "⚠️ Groq question generation failed:",
            exc,
        )

    # ========================================================
    # VALIDATE QUESTION
    # ========================================================

    if not validate_question(
        question,
        history_for_engine,
    ):

        print(
            "⚠️ Groq generated duplicate/invalid question."
        )

        question = ""

    # ========================================================
    # FALLBACK
    # ========================================================

    if not question:

        question = get_fallback_question(
            language=language,
            topic=next_topic,
        )

    # ========================================================
    # FINAL VALIDATION
    # ========================================================

    if not question:

        raise ValueError(
            "Could not generate question for topic: "
            f"{next_topic}"
        )

    # ========================================================
    # FINAL RESULT
    # ========================================================

    return {
        "extracted": combined_extracted,

        "next_question": question,

        "reason": (
            f"Next unanswered topic: "
            f"{next_topic_label or next_topic}"
        ),

        "category": next_topic,

        "red_flag": latest_red_flag,

        "completed": False,
    }


# ============================================================
# AI CLINICAL SUMMARY
# ============================================================

CLINICAL_SUMMARY_SYSTEM_PROMPT = """
You are MediKiosk AI, an AI-assisted clinical history
summarization system.

You are NOT a doctor.

Your task is to prepare a factual, structured clinical
history for doctor review.

The supplied information can come from TWO sources:

1. PREVIOUS MEDICAL REPORTS
2. CURRENT PATIENT INTERVIEW

============================================================
CRITICAL SOURCE RULES
============================================================

1. Use ONLY information present in the supplied data.

2. NEVER invent information.

3. NEVER diagnose the patient.

4. NEVER suggest treatment.

5. NEVER prescribe medicines.

6. NEVER make unsupported clinical assumptions.

7. Keep previous-report information separate from
   current interview information.

8. Do NOT present information from a previous report
   as something the patient said during the current
   interview.

9. Do NOT present current interview information as if
   it came from an old report.

10. If previous reports are empty, do not create previous
    medical history.

11. If interview information is missing, do not invent it.

12. If a previous report contains information that is
    unclear, preserve it as provided rather than guessing.

13. The doctor remains responsible for final interpretation.

============================================================
PREVIOUS REPORTS
============================================================

Previous reports are historical documents supplied by
the patient.

They may contain:

- previous diagnoses
- laboratory results
- medications
- prescriptions
- symptoms
- observations
- investigations
- dates
- doctor notes
- other medical information

Treat this information as historical report information.

Do NOT automatically assume that every old diagnosis or
finding is currently active.

============================================================
CURRENT INTERVIEW
============================================================

Current interview information comes from the patient's
answers during this consultation.

This is the primary source for the current complaint
and current symptoms.

============================================================
CONFLICTS BETWEEN SOURCES
============================================================

If previous reports and current interview contain different
information:

- Preserve both.
- Do NOT choose one as medically correct.
- Clearly identify which source contains each fact.
- Do NOT attempt to resolve the conflict yourself.

============================================================
RED FLAGS
============================================================

Only include red flags explicitly supplied in redFlags.

Do not create new red flags from medical knowledge.

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "summary": "",
  "key_findings": [],

  "previous_report_findings": [],

  "interview_findings": [],

  "clinical_history": {
    "chief_complaint": null,
    "duration": null,
    "symptoms": [],
    "severity": null,
    "onset": null,
    "aggravating_factors": [],
    "relieving_factors": [],
    "appetite": null,
    "bowel_habits": null,
    "sleep": null
  },

  "ayurvedic_history": {
    "prakriti": null,
    "vikriti": null,
    "agni": null,
    "koshtha": null,
    "ahara": null,
    "vihara": null,
    "nidra": null,
    "dashavidha_pariksha": {}
  },

  "red_flags": [],

  "missing_information": []
}

============================================================
FIELD RULES
============================================================

summary:

Write a short factual overview of the current consultation.

key_findings:

Important facts from either source.

previous_report_findings:

Facts explicitly found in previous uploaded medical reports.

interview_findings:

Facts explicitly collected during the current interview.

clinical_history:

Use current interview information where available.

Do not copy an old report finding into current clinical
history unless the supplied current interview explicitly
confirms it.

ayurvedic_history:

Use only explicitly supplied Ayurvedic information.

red_flags:

Use only supplied red flag information.

missing_information:

Important history fields that remain missing.

============================================================
NO MEDICAL OPINION
============================================================

Do not write:

"patient likely has..."

"consistent with..."

"probably..."

"suggestive of..."

"requires..."

"should take..."

"recommend..."

Only state collected facts.
"""


def _safe_json(value):
    """
    Convert arbitrary MongoDB / Python data into
    JSON-safe text.
    """

    try:
        return json.dumps(
            value,
            ensure_ascii=False,
            indent=2,
            default=str,
        )

    except Exception:
        return str(value)


def _normalize_previous_reports(previous_reports):
    """
    Normalize previous medical report data.

    Expected input:

    [
        {
            "filename": "...",
            "ocr": {...},
            "extractedData": {...}
        }
    ]

    or directly the MongoDB report documents.

    The function intentionally preserves the original
    report data instead of guessing medical fields.
    """

    if not isinstance(previous_reports, list):
        return []

    normalized = []

    for report in previous_reports:

        if not isinstance(report, dict):
            continue

        normalized.append({
            "report_id": report.get(
                "_id",
                report.get("report_id"),
            ),

            "filename": report.get(
                "filename"
            ),

            "uploadedAt": report.get(
                "uploadedAt"
            ),

            "language": report.get(
                "language"
            ),

            "languageCode": report.get(
                "languageCode"
            ),

            "ocr": report.get(
                "ocr",
                {}
            ),

            "extractedData": report.get(
                "extractedData",
                {}
            ),
        })

    return normalized


def generate_clinical_summary(
    language: str,
    consultation_type: str,
    clinical_history: dict,
    ayurvedic_history: dict,
    conversation: list,
    red_flags: list,
    previous_reports: list | None = None,
):
    """
    Generate a structured AI clinical history summary.

    Sources:

        Previous Medical Reports
                  +
        Current Interview
                  +
        Red Flags

    Previous report information remains separate from
    current interview information.
    """

    # ========================================================
    # NORMALIZE INPUTS
    # ========================================================

    clinical_history = (
        clinical_history
        if isinstance(clinical_history, dict)
        else {}
    )

    ayurvedic_history = (
        ayurvedic_history
        if isinstance(ayurvedic_history, dict)
        else {}
    )

    conversation = (
        conversation
        if isinstance(conversation, list)
        else []
    )

    red_flags = (
        red_flags
        if isinstance(red_flags, list)
        else []
    )

    previous_reports = (
        _normalize_previous_reports(
            previous_reports
        )
        if isinstance(previous_reports, list)
        else []
    )

    # ========================================================
    # SERIALIZE INPUTS
    # ========================================================

    clinical_history_text = _safe_json(
        clinical_history
    )

    ayurvedic_history_text = _safe_json(
        ayurvedic_history
    )

    conversation_text = _safe_json(
        conversation
    )

    red_flags_text = _safe_json(
        red_flags
    )

    previous_reports_text = _safe_json(
        previous_reports
    )

    # ========================================================
    # BUILD PROMPT
    # ========================================================

    prompt = f"""
Selected patient language:
{language}

Consultation type:
{consultation_type}

==================================================
PREVIOUS MEDICAL REPORTS
==================================================

{previous_reports_text}

==================================================
CURRENT CLINICAL HISTORY
==================================================

{clinical_history_text}

==================================================
CURRENT AYURVEDIC HISTORY
==================================================

{ayurvedic_history_text}

==================================================
CURRENT PATIENT CONVERSATION
==================================================

{conversation_text}

==================================================
RED FLAGS
==================================================

{red_flags_text}

==================================================
TASK
==================================================

Create a concise factual clinical history summary.

The consultation may contain previous medical reports
and a current patient interview.

Use ONLY information supplied above.

IMPORTANT:

Previous medical reports are historical source data.

Current interview data is current consultation data.

Keep these sources separate.

Do not assume an old diagnosis is currently active.

Do not diagnose.

Do not recommend treatment.

Do not prescribe medicine.

Do not infer missing information.

Do not resolve conflicts between old reports and current
patient answers.

If previous reports are empty, previous_report_findings
must be [].

If there are no red flags, red_flags must be [].

Return ONLY valid JSON.
"""

    # ========================================================
    # GROQ REQUEST
    # ========================================================

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        temperature=0.0,
        messages=[
            {
                "role": "system",
                "content": CLINICAL_SUMMARY_SYSTEM_PROMPT,
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    # ========================================================
    # RESPONSE
    # ========================================================

    content = (
        response
        .choices[0]
        .message
        .content
        .strip()
    )

    result = parse_json(content)

    if not isinstance(result, dict):
        raise ValueError(
            "Groq clinical summary response is not an object."
        )

    # ========================================================
    # NORMALIZE RESULT
    # ========================================================

    summary = result.get("summary")

    if not isinstance(summary, str):
        summary = ""

    key_findings = result.get(
        "key_findings",
        [],
    )

    if not isinstance(
        key_findings,
        list,
    ):
        key_findings = []

    previous_report_findings = result.get(
        "previous_report_findings",
        [],
    )

    if not isinstance(
        previous_report_findings,
        list,
    ):
        previous_report_findings = []

    interview_findings = result.get(
        "interview_findings",
        [],
    )

    if not isinstance(
        interview_findings,
        list,
    ):
        interview_findings = []

    generated_clinical_history = result.get(
        "clinical_history",
        {},
    )

    if not isinstance(
        generated_clinical_history,
        dict,
    ):
        generated_clinical_history = {}

    generated_ayurvedic_history = result.get(
        "ayurvedic_history",
        {},
    )

    if not isinstance(
        generated_ayurvedic_history,
        dict,
    ):
        generated_ayurvedic_history = {}

    generated_red_flags = result.get(
        "red_flags",
        [],
    )

    if not isinstance(
        generated_red_flags,
        list,
    ):
        generated_red_flags = []

    missing_information = result.get(
        "missing_information",
        [],
    )

    if not isinstance(
        missing_information,
        list,
    ):
        missing_information = []

    # ========================================================
    # FINAL RETURN
    # ========================================================

    return {
        "summary": summary.strip(),

        "key_findings": key_findings,

        "previous_report_findings": (
            previous_report_findings
        ),

        "interview_findings": (
            interview_findings
        ),

        "clinical_history": (
            generated_clinical_history
        ),

        "ayurvedic_history": (
            generated_ayurvedic_history
        ),

        "red_flags": (
            generated_red_flags
        ),

        "missing_information": (
            missing_information
        ),
    }