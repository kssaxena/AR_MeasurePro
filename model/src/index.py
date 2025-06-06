import os
from dotenv import load_dotenv
from app import app
from db.connect_db import connect_db

# Load environment variables from .env file
load_dotenv(dotenv_path=".env")

if __name__ == "__main__":
    try:
        # Connect to database
        connect_db()

        # Read port from environment or default to 8000
        port = int(os.getenv("PORT", 8000))

        # Start Flask app
        app.run(host="0.0.0.0", port=port, debug=True)
    except Exception as e:
        print("❌ Failed to start Flask app:", e)
