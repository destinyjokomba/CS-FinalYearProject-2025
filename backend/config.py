import os
from dotenv import load_dotenv

# pull in .env in case someone runs flask directly
load_dotenv()

class Config:
    # SQLAlchemy
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback-secret")  # set this in .env
    JWT_TOKEN_LOCATION = ("headers",)
    JWT_ACCESS_TOKEN_EXPIRES = False  # or timedelta(hours=1)

    # CORS (optional defaults)
    CORS_ORIGINS = "*"
