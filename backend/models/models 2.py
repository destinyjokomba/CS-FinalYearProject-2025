from flask_sqlalchemy import SQLAlchemy
from flask_migrate    import Migrate
from datetime         import datetime

db      = SQLAlchemy()
migrate = Migrate()

class User(db.Model):
    __tablename__ = "users"

    id         = db.Column(db.Integer, primary_key=True)
    username   = db.Column(db.String(80), unique=True, nullable=False)
    
    # Make optional (nullable=True)
    first_name = db.Column(db.String(80), nullable=True)
    surname    = db.Column(db.String(80), nullable=True)
    email      = db.Column(db.String(120), unique=True, nullable=True)
    pw_hash = db.Column(db.Text, nullable=False)  # ← Safe for long hashes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    surveys     = db.relationship("Survey", back_populates="user", cascade="all, delete-orphan")
    predictions = db.relationship("Prediction", back_populates="user", cascade="all, delete-orphan")
class Survey(db.Model):
    __tablename__ = "surveys"
    id            = db.Column(db.Integer, primary_key=True)
    user_id       = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    data          = db.Column(db.JSON, nullable=False)
    submitted_at  = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="surveys")

class Prediction(db.Model):
    __tablename__ = "predictions"
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    model_type  = db.Column(db.String(50), nullable=False)
    input_data  = db.Column(db.JSON, nullable=False)
    prediction  = db.Column(db.String(50), nullable=False)
    timestamp   = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="predictions")
