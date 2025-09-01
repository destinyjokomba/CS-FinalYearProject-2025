# app.py (root-level entrypoint for Render)

from app import app
  # import your Flask app from backend/app.py

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)
