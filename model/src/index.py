import os
from dotenv import load_dotenv
from app import app
from db.connect_db import connect_db

import uvicorn

# Load environment variables
load_dotenv(dotenv_path=".env")

if __name__ == "__main__":
    try:
        connect_db()
        port = int(os.getenv("PORT", 8000))
        uvicorn.run(app, host="0.0.0.0", port=port)
    except Exception as e:
        print("Failed to start app:", e)
