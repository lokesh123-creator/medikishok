from datetime import datetime, timezone


def create_user_document(
    name: str,
    phone: str | None = None,
    email: str | None = None,
    role: str = "patient",
):
    return {
        "name": name,
        "phone": phone,
        "email": email,
        "role": role,
        "createdAt": datetime.now(timezone.utc),
    }