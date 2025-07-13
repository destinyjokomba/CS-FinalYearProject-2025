from flask import Flask  # Flask framework
from flask_sqlalchemy import SQLAlchemy  # SQLAlchemy extension for Flask
import os  # For accessing environment variables
from dotenv import load_dotenv  # To load variables from .env file
from pathlib import Path  # For building file paths
from sqlalchemy import text  # For raw SQL queries

# Define the path to the .env file (same directory as this script)
env_path = Path(__file__).resolve().parent / ".env"

# Debug info to verify .env loading
print("Looking for .env at:", env_path)
print("File exists:", env_path.exists())

# Load environment variables from the .env file
load_dotenv(dotenv_path=env_path)

# Fetch and print the database URL
database_url = os.getenv("DATABASE_URL")
print("Loaded DB URL:", database_url)

# Initialize the Flask app
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
db = SQLAlchemy(app)

# Try to connect to the database and run a test query
try:
    with app.app_context():
        db.session.execute(text("SELECT 1"))
        print("Connected to cloud PostgreSQL successfully.")
except Exception as e:
    print("Connection failed:", e)

# Display the raw .env file content (for verification)
with open(env_path) as f:
    print("Raw .env contents:")
    print(f.read())
