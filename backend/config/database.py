import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI is missing from .env")

client = MongoClient(MONGODB_URI)

db = client["medikiosk"]

users_collection = db["users"]
doctors_collection = db["doctors"]
consultations_collection = db["consultations"]
reports_collection = db["medical_reports"]
medical_reports_collection = db["medical_reports"]


def connect_to_mongodb():
    try:
        client.admin.command("ping")
        print("✅ MongoDB connected successfully")
        print("📦 Database: medikiosk")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)
        raise