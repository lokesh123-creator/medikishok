import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

uri = os.getenv("MONGODB_URI")

print("URI loaded:", bool(uri))

if not uri:
    raise Exception("MONGODB_URI not found in .env")

client = MongoClient(
    uri,
    tls=True,
    tlsCAFile=certifi.where(),
    serverSelectionTimeoutMS=10000,
)

try:
    print("\nTesting MongoDB connection...")
    result = client.admin.command("ping")
    print("PING:", result)

    print("\nServer information:")
    print(client.server_info()["version"])

    print("\nMongoDB connection successful ✅")

except Exception as e:
    print("\nMongoDB connection failed ❌")
    print(type(e).__name__)
    print(e)

finally:
    client.close()