from pymongo import MongoClient
from dotenv import load_dotenv
import os
import sys

load_dotenv()  # Load .env variables

def connect_db():
    try:
        mongo_url = os.getenv("MONGODB_URL")
        db_name = os.getenv("DB_NAME")

        if not mongo_url or not db_name:
            raise ValueError("Missing MONGODB_URL or DB_NAME in .env")

        client = MongoClient(f"{mongo_url}/{db_name}")
        db = client[db_name]
        print(f"\n✅ MongoDB connected!! DB NAME: {db_name}")
        return db  # You can return this db instance to use in routes, etc.
    except Exception as e:
        print("❌ MongoDB connection FAILED:", e)
        sys.exit(1)
