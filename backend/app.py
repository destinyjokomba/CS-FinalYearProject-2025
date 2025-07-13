import os
import json
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

import joblib
import numpy as np

from config import Config
from models.models import db, migrate, User, Survey, Prediction
from schemas import RegisterSchema, SurveySchema, PredictSchema

# ───────────────────────────────
# App Setup
# ───────────────────────────────
load_dotenv()  # make sure .env is loaded
app = Flask(__name__)
app.config.from_object(Config)

# enable CORS
CORS(
    app,
    resources={r"/*": {"origins": app.config["CORS_ORIGINS"]}},
    supports_credentials=True
)

# Init DB/migrations/JWT
db.init_app(app)
migrate.init_app(app, db)
jwt = JWTManager(app)


# ───────────────────────────────
# Model Loading
# ───────────────────────────────
model_dir = os.path.join(os.path.dirname(__file__), "models")
scaler   = joblib.load(os.path.join(model_dir, "standard_scaler.joblib"))
encoder  = joblib.load(os.path.join(model_dir, "label_encoder.joblib"))
rf_model = joblib.load(os.path.join(model_dir, "random_forest_model.joblib"))
lr_model = joblib.load(os.path.join(model_dir, "logistic_regression_model.joblib"))
FIELDS = list(rf_model.feature_names_in_)

FALLBACK = {
    0: "Conservative", 1: "Green", 2: "Labour", 3: "Liberal Democrat",
    4: "Plaid Cymru", 5: "SNP", 6: "Reform UK", 7: "UKIP",
    8: "Sinn Féin", 9: "DUP", 10: "SDLP", 11: "Alliance",
    12: "UUP", 13: "Speaker", 14: "Independent"
}


# ───────────────────────────────
# Middleware & Healthcheck
# ───────────────────────────────
@app.before_request
def allow_options():
    if request.method == "OPTIONS":
        return "", 200

@app.route("/", methods=["GET"])
def health():
    return jsonify(status="ok"), 200


# ───────────────────────────────
# Auth Endpoints
# ───────────────────────────────
@app.route("/auth/register", methods=["POST"])
def register():
    try:
        data = RegisterSchema().load(request.get_json(force=True))
    except ValidationError as e:
        return jsonify(error=e.messages), 400

    if User.query.filter_by(username=data["username"]).first():
        return jsonify(error="Username exists"), 409
    if User.query.filter_by(email=data["email"]).first():
        return jsonify(error="Email exists"), 409

    user = User(
        username   = data["username"],
        first_name = data["first_name"],
        surname    = data["surname"],
        email      = data["email"],
        pw_hash    = generate_password_hash(data["password"])
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(message="Registered"), 201

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True) or {}
    username = data.get("username")
    password = data.get("password")
    if not username or not password:
        return jsonify(error="Missing username or password"), 400

    user = User.query.filter(
        (User.username == username) | (User.email == username)
    ).first()
    if not user or not check_password_hash(user.pw_hash, password):
        return jsonify(error="Invalid credentials"), 401

    token = create_access_token(identity=user.username)
    return jsonify(access_token=token), 200


# ───────────────────────────────
# Protected Resource: Features
# ───────────────────────────────
@app.route("/features", methods=["GET"])
@jwt_required()
def get_features():
    excluded = {"Unnamed", "2024 Winner", "2024 Runner-up",
                "Constituency name", "2024 Electorate"}
    filtered = [f for f in FIELDS if f not in excluded]
    return jsonify(features=filtered), 200


# ───────────────────────────────
# Save Survey
# ───────────────────────────────
@app.route("/survey", methods=["POST"])
@jwt_required()
def save_survey():
    try:
        data = SurveySchema().load(request.get_json(force=True))
    except ValidationError as e:
        return jsonify(error=e.messages), 400

    user = User.query.filter_by(username=get_jwt_identity()).first()
    record = Survey(user_id=user.id, data=data["responses"])
    db.session.add(record)
    db.session.commit()
    return jsonify(message="Saved"), 200


# ───────────────────────────────
# Prediction Logic
# ───────────────────────────────
def run_prediction(data, model, user, mtype):
    try:
        input_vec = np.array([float(data.get(f, 0)) for f in FIELDS]).reshape(1, -1)
        scaled    = scaler.transform(input_vec)
        code      = int(model.predict(scaled)[0])

        try:
            party = encoder.inverse_transform([code])[0]
        except Exception:
            party = FALLBACK.get(code, "Unknown")

        pred = Prediction(
            user_id    = user.id,
            model_type = mtype,
            input_data = json.dumps(data),
            prediction = party,
            timestamp  = datetime.utcnow()
        )
        db.session.add(pred)
        db.session.commit()
        return jsonify(predicted_party=party), 200

    except ValidationError as e:
        return jsonify(error=e.messages), 400
    except SQLAlchemyError:
        db.session.rollback()
        return jsonify(error="DB save error"), 500
    except Exception as e:
        return jsonify(error=str(e)), 500


# ───────────────────────────────
# Prediction Endpoints
# ───────────────────────────────
@app.route("/predict", methods=["POST"])
@jwt_required()
def predict_rf():
    data = PredictSchema().load(request.get_json(force=True))
    user = User.query.filter_by(username=get_jwt_identity()).first()
    return run_prediction(data, rf_model, user, "Random Forest")

@app.route("/predict-lr", methods=["POST"])
@jwt_required()
def predict_lr():
    data = PredictSchema().load(request.get_json(force=True))
    user = User.query.filter_by(username=get_jwt_identity()).first()
    return run_prediction(data, lr_model, user, "Logistic Regression")


# ───────────────────────────────
# History Endpoint
# ───────────────────────────────
@app.route("/history", methods=["GET"])
@jwt_required()
def history():
    user = User.query.filter_by(username=get_jwt_identity()).first_or_404()
    preds = Prediction.query.filter_by(user_id=user.id).order_by(Prediction.timestamp.desc())
    return jsonify(history=[
        {
            "model": p.model_type,
            "input": json.loads(p.input_data),
            "prediction": p.prediction,
            "time": p.timestamp.isoformat()
        }
        for p in preds
    ]), 200


# ───────────────────────────────
# Error Handlers
# ───────────────────────────────
@app.errorhandler(ValidationError)
def handle_validation(e):
    return jsonify(error=e.messages), 400

# JWT errors
from flask_jwt_extended.exceptions import NoAuthorizationError
from werkzeug.exceptions import Unauthorized

@app.errorhandler(NoAuthorizationError)
def missing_token(e):
    return jsonify(error="Missing or invalid token"), 401

@app.errorhandler(Unauthorized)
def unauthorized(e):
    return jsonify(error="Unauthorized"), 401


# ───────────────────────────────
# Run Server
# ───────────────────────────────
if __name__ == "__main__":
    app.run(port=5001, debug=True)
