from datetime import datetime, timezone


def create_doctor_document(
    name: str,
    phone: str | None = None,
    email: str | None = None,
    specialization: str | None = None,
):
    return {
        "name": name,
        "phone": phone,
        "email": email,
        "specialization": specialization,
        "createdAt": datetime.now(timezone.utc),
    }