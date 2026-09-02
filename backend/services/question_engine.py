import re


# ============================================================
# INTERVIEW TOPIC PRIORITIES
# ============================================================

CLINICAL_TOPICS = [
    "chief_complaint",
    "duration",
    "symptoms",
    "severity",
    "onset",
    "aggravating_factors",
    "relieving_factors",
    "appetite",
    "bowel_habits",
    "sleep",
]


AYURVEDA_TOPICS = [
    "chief_complaint",
    "duration",
    "symptoms",
    "severity",
    "onset",
    "aggravating_factors",
    "relieving_factors",
    "appetite",
    "agni",
    "bowel_habits",
    "koshtha",
    "sleep",
    "nidra",
    "ahara",
    "vihara",
    "prakriti",
    "vikriti",
    "dashavidha_pariksha",
]


# ============================================================
# TOPIC LABELS
# ============================================================

TOPIC_LABELS = {
    "chief_complaint": "chief complaint",
    "duration": "duration",
    "symptoms": "associated symptoms",
    "severity": "severity",
    "onset": "onset",
    "aggravating_factors": "aggravating factors",
    "relieving_factors": "relieving factors",
    "appetite": "appetite",
    "agni": "Agni / digestion",
    "bowel_habits": "bowel habits",
    "koshtha": "Koshtha / bowel pattern",
    "sleep": "sleep",
    "nidra": "Nidra / sleep",
    "ahara": "Ahara / diet",
    "vihara": "Vihara / lifestyle",
    "prakriti": "Prakriti",
    "vikriti": "Vikriti",
    "dashavidha_pariksha": "Dashavidha Pariksha",
}


# ============================================================
# CHECK WHETHER A VALUE IS ACTUALLY KNOWN
# ============================================================

def is_known(value):
    """
    Returns True when the extracted value contains
    meaningful information.
    """

    if value is None:
        return False

    if isinstance(value, str):
        return bool(value.strip())

    if isinstance(value, list):
        return len(value) > 0

    if isinstance(value, dict):
        return len(value) > 0

    return True


# ============================================================
# FIND COMPLETED TOPICS
# ============================================================

def get_completed_topics(extracted: dict):
    """
    Determine which interview topics already have
    meaningful patient information.
    """

    completed = []

    if not isinstance(extracted, dict):
        return completed

    for topic in TOPIC_LABELS:
        value = extracted.get(topic)

        if is_known(value):
            completed.append(topic)

    # --------------------------------------------------------
    # Sleep and Nidra overlap.
    # --------------------------------------------------------

    if is_known(extracted.get("sleep")):
        if "nidra" not in completed:
            completed.append("nidra")

    if is_known(extracted.get("nidra")):
        if "sleep" not in completed:
            completed.append("sleep")

    return completed


# ============================================================
# FIND NEXT UNANSWERED TOPIC
# ============================================================

def get_next_topic(
    extracted: dict,
    consultation_type: str,
):
    """
    Select the next unanswered topic according to
    consultation type.
    """

    consultation_type = (
        consultation_type or "clinical"
    ).lower().strip()

    if consultation_type == "ayurveda":
        topics = AYURVEDA_TOPICS
    else:
        topics = CLINICAL_TOPICS

    completed = get_completed_topics(extracted)

    for topic in topics:
        if topic not in completed:
            return topic

    return None


# ============================================================
# GET PREVIOUS QUESTIONS
# ============================================================

def get_previous_questions(history: list):
    """
    Extract all previously asked questions.
    """

    questions = []

    if not isinstance(history, list):
        return questions

    for item in history:

        if not isinstance(item, dict):
            continue

        question = item.get("question")

        if not isinstance(question, str):
            continue

        question = question.strip()

        if question:
            questions.append(question)

    return questions


# ============================================================
# GET PREVIOUS ANSWERS
# ============================================================

def get_previous_answers(history: list):
    """
    Extract all previous patient answers.
    """

    answers = []

    if not isinstance(history, list):
        return answers

    for item in history:

        if not isinstance(item, dict):
            continue

        answer = item.get("answer")

        if not isinstance(answer, str):
            continue

        answer = answer.strip()

        if answer:
            answers.append(answer)

    return answers


# ============================================================
# NORMALIZE QUESTION
# ============================================================

def normalize_question(question: str):
    """
    Normalize a question so punctuation/case differences
    do not bypass duplicate detection.
    """

    if not isinstance(question, str):
        return ""

    question = question.strip().lower()

    question = re.sub(
        r"[^\w\s\u0C00-\u0C7F\u0900-\u097F]",
        " ",
        question,
    )

    question = re.sub(
        r"\s+",
        " ",
        question,
    )

    return question.strip()


# ============================================================
# CHECK QUESTION SIMILARITY
# ============================================================

def questions_are_similar(
    question_a: str,
    question_b: str,
):
    """
    Conservative duplicate/similarity detection.
    """

    a = normalize_question(question_a)
    b = normalize_question(question_b)

    if not a or not b:
        return False

    if a == b:
        return True

    words_a = set(a.split())
    words_b = set(b.split())

    if not words_a or not words_b:
        return False

    intersection = words_a.intersection(words_b)
    union = words_a.union(words_b)

    similarity = len(intersection) / len(union)

    if similarity >= 0.75:
        return True

    return False


# ============================================================
# VALIDATE GENERATED QUESTION
# ============================================================

def validate_question(
    question: str,
    history: list,
):
    """
    Prevent:
    - empty questions
    - exact duplicates
    - highly similar questions
    """

    if not isinstance(question, str):
        return False

    question = question.strip()

    if not question:
        return False

    previous_questions = get_previous_questions(history)

    for previous in previous_questions:

        if questions_are_similar(
            question,
            previous,
        ):
            return False

    return True


# ============================================================
# GET PREVIOUS CATEGORIES
# ============================================================

def get_previous_categories(history: list):
    """
    Extract categories/topics previously generated.
    """

    categories = []

    if not isinstance(history, list):
        return categories

    for item in history:

        if not isinstance(item, dict):
            continue

        category = item.get("category")

        if not isinstance(category, str):
            continue

        category = category.strip()

        if category:
            categories.append(category)

    return categories


# ============================================================
# MERGE EXTRACTED INFORMATION
# ============================================================

def merge_extracted_information(
    previous,
    incoming,
):
    """
    Merge structured information without losing
    previously known values.
    """

    previous = (
        previous
        if isinstance(previous, dict)
        else {}
    )

    incoming = (
        incoming
        if isinstance(incoming, dict)
        else {}
    )

    result = {}

    keys = set(previous.keys()) | set(incoming.keys())

    for key in keys:

        old_value = previous.get(key)
        new_value = incoming.get(key)

        # ----------------------------------------------------
        # Lists
        # ----------------------------------------------------

        if isinstance(old_value, list) or isinstance(new_value, list):

            old_list = (
                old_value
                if isinstance(old_value, list)
                else []
            )

            new_list = (
                new_value
                if isinstance(new_value, list)
                else []
            )

            result[key] = list(
                dict.fromkeys(
                    old_list + new_list
                )
            )

        # ----------------------------------------------------
        # Dictionaries
        # ----------------------------------------------------

        elif isinstance(old_value, dict) or isinstance(new_value, dict):

            old_dict = (
                old_value
                if isinstance(old_value, dict)
                else {}
            )

            new_dict = (
                new_value
                if isinstance(new_value, dict)
                else {}
            )

            result[key] = {
                **old_dict,
                **new_dict,
            }

        # ----------------------------------------------------
        # Scalar
        # ----------------------------------------------------

        else:

            if new_value not in (None, ""):
                result[key] = new_value

            elif old_value not in (None, ""):
                result[key] = old_value

            else:
                result[key] = None

    return result


# ============================================================
# BUILD QUESTION ENGINE CONTEXT
# ============================================================

def build_question_engine_context(
    extracted: dict,
    consultation_type: str,
    history: list,
    latest_extracted: dict | None = None,
):
    """
    Build structured context.

    IMPORTANT:
    latest_extracted is merged BEFORE selecting the next topic.

    This means:

    Patient says:
    "I have fever for three days."

    latest extraction:
    duration = 3 days

    Question Engine immediately sees:
    duration = known

    Therefore it skips duration and moves forward.
    """

    combined_extracted = (
        extracted.copy()
        if isinstance(extracted, dict)
        else {}
    )

    if isinstance(latest_extracted, dict):
        combined_extracted = merge_extracted_information(
            combined_extracted,
            latest_extracted,
        )

    next_topic = get_next_topic(
        extracted=combined_extracted,
        consultation_type=consultation_type,
    )

    previous_questions = get_previous_questions(
        history
    )

    previous_answers = get_previous_answers(
        history
    )

    previous_categories = get_previous_categories(
        history
    )

    completed_topics = get_completed_topics(
        combined_extracted
    )

    return {
        "next_topic": next_topic,

        "next_topic_label": (
            TOPIC_LABELS.get(next_topic)
            if next_topic
            else None
        ),

        "completed_topics": completed_topics,

        "previous_questions": previous_questions,

        "previous_answers": previous_answers,

        "previous_categories": previous_categories,

        "extracted": combined_extracted,

        "completed": next_topic is None,
    }


# ============================================================
# QUESTION ENGINE SUMMARY
# ============================================================

def get_question_engine_summary(
    extracted: dict,
    consultation_type: str,
    history: list,
    latest_extracted: dict | None = None,
):
    """
    Useful for debugging.
    """

    context = build_question_engine_context(
        extracted=extracted,
        consultation_type=consultation_type,
        history=history,
        latest_extracted=latest_extracted,
    )

    return {
        "consultation_type": consultation_type,

        "completed_topics": (
            context["completed_topics"]
        ),

        "next_topic": (
            context["next_topic"]
        ),

        "next_topic_label": (
            context["next_topic_label"]
        ),

        "completed": (
            context["completed"]
        ),

        "previous_question_count": len(
            context["previous_questions"]
        ),

        "previous_category_count": len(
            context["previous_categories"]
        ),
    }