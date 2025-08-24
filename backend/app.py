# ─── Imports ─────────────────────────────────────────────────────────────
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from functools import wraps
import joblib
import pandas as pd
import traceback
import jwt
import datetime as dt
import os
import bcrypt
from collections import Counter
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
from psycopg2.errors import UniqueViolation

# ─── Load Environment ───────────────────────────────────────────────────
load_dotenv()

# ─── App Configuration ─────────────────────────────────────────────────
app = Flask(__name__)

# ─── CORS Config ───────────────────────────────────────────────────────
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

CORS(
    app,
    supports_credentials=True,
    resources={r"/*": {"origins": CORS_ORIGINS}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin in CORS_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    return response

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "supersecretkey")

# ─── File Paths ───────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
PIPELINE_PATH = os.path.join(BASE_DIR, "models", "final_model.pkl")

# ─── Load ML Pipeline ─────────────────────────────────────────────────
def log_installed_packages():
    try:
        import pkg_resources
        print("📦 Installed packages in Render:")
        for d in pkg_resources.working_set:
            print(f" - {d.project_name}=={d.version}")
    except Exception as e:
        print(f"⚠️ Could not list installed packages: {e}")

pipeline = None
if os.path.exists(PIPELINE_PATH):
    try:
        pipeline = joblib.load(PIPELINE_PATH)
        print(f"✅ Pipeline model loaded from {PIPELINE_PATH}")
    except Exception as e:
        print(f"❌ Failed to load pipeline at {PIPELINE_PATH}: {e}")
        log_installed_packages()
        pipeline = None
else:
    print(f"⚠️ Pipeline file not found at {PIPELINE_PATH}. Did you commit final_model.pkl?")

# ─── JWT Auth Middleware ──────────────────────────────────────────────
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            decoded = jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = {
                "id": decoded.get("user_id"),
                "username": decoded.get("username")
            }
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid"}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# ─── Label Mapping ────────────────────────────────────────────────────
inverse_mapping = {
    0: "lab", 1: "con", 2: "ld",
    3: "green", 4: "reform", 5: "snp", 6: "other"
}
PARTIES = ["lab", "con", "ld", "green", "reform", "snp", "other"]

# ─── Database Connection ──────────────────────────────────────────────
def get_db_connection():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        raise RuntimeError("❌ DATABASE_URL is not set in .env")
    return psycopg2.connect(db_url, cursor_factory=RealDictCursor)

# ─── REGISTER ──────────────────────────────────────────
@app.route("/auth/register", methods=["POST"])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def register():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not password or not email:
        return jsonify({"message": "Missing required fields"}), 400

    pw_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute(
            "INSERT INTO users (username, email, pw_hash) VALUES (%s, %s, %s) RETURNING id",
            (username, email, pw_hash),
        )
        user = cur.fetchone()
        conn.commit()
        return jsonify({"message": "User registered", "id": user["id"]}), 201

    except UniqueViolation as e:
        conn.rollback()
        error_msg = str(e).lower()
        print("⚠️ Unique violation:", e)

        if "username" in error_msg:
            return jsonify({"message": "Username already exists"}), 409
        elif "email" in error_msg:
            return jsonify({"message": "Email already exists"}), 409
        else:
            return jsonify({"message": "Duplicate entry"}), 409

    except Exception as e:
        conn.rollback()
        print("❌ Registration error:", e)
        return jsonify({"message": "Registration failed", "error": str(e)}), 500

    finally:
        cur.close()
        conn.close()

# ─── LOGIN ────────────────────────────────────────────
@app.route("/auth/login", methods=["POST"])
@cross_origin(origins=["http://localhost:5173"], supports_credentials=True)
def login():
    data = request.get_json()
    login_id = data.get("username") or data.get("email")
    password = data.get("password")

    if not login_id or not password:
        return jsonify({"message": "Username/email and password required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "SELECT id, username, email, pw_hash FROM users WHERE username=%s OR email=%s",
            (login_id, login_id),
        )
        user = cur.fetchone()
    finally:
        cur.close()
        conn.close()

    if not user:
        return jsonify({"message": "User not found"}), 404

    user_id = user["id"]
    username = user["username"]
    email = user["email"]
    pw_hash = user["pw_hash"]

    if isinstance(pw_hash, str):
        pw_hash = pw_hash.encode("utf-8")

    if not bcrypt.checkpw(password.encode("utf-8"), pw_hash):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({
        "user_id": user_id,
        "username": username,
        "exp": dt.datetime.utcnow() + dt.timedelta(hours=24)
    }, app.config["SECRET_KEY"], algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {"id": user_id, "username": username, "email": email}
    }), 200

# ─── Prediction Route ──────────────────────────────────────
@app.route("/predict", methods=["POST"])
@token_required
def predict(current_user):
    try:
        if pipeline is None:
            return jsonify({"error": "Model is not loaded on server. Please try again later."}), 503

        data = request.get_json() or {}
        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # Feature engineering
        def engineer_features(d: Dict[str, Any]) -> Dict[str, Any]:
            education_map = {
                "no qualification": 0, "gcse or equivalent": 1,
                "a-level or equivalent": 2, "bachelors degree": 3,
                "masters degree": 4, "phd or higher": 5, "other": 2
            }
            income_map = {
                "under £20,000": 0, "£20,000–£40,000": 1,
                "£40,000–£60,000": 2, "£60,000-£80,000": 3,
                "£80,000 +": 4
            }
            trust_map = {"very low": 0, "low": 1, "medium": 2, "high": 3, "very high": 4}
            satisfaction_map = {
                "very dissatisfied": 0, "dissatisfied": 1, "neutral": 2,
                "satisfied": 3, "very satisfied": 4
            }

            d = {(k or "").lower().strip(): (v.lower().strip() if isinstance(v, str) else v)
                 for k, v in d.items()}

            def _get(k, default="unknown"): return d.get(k, default)

            d.update({
                "is_climate_priority": int(_get("climate_priority") == "yes"),
                "is_fiscally_conservative": int(_get("support_welfare_spending") == "no" and _get("tax_on_wealthy") == "no"),
                "is_media_skeptic": int(_get("trust_mainstream_media") in ["low", "very low"]),
                "is_snp_region": int(_get("constituency_leaning") == "scotland"),
                "is_reform_minded": int(_get("concern_political_corruption") == "very concerned" and _get("immigration_policy_stance") == "tighten"),
                "is_social_justice_focused": int(_get("importance_social_issues") == "very important" and _get("support_welfare_spending") == "support"),
                "education_score": education_map.get(_get("education_level"), 2),
                "income_score": income_map.get(_get("household_income"), 2),
                "media_trust_score": trust_map.get(_get("trust_mainstream_media"), 2),
                "gov_satisfaction_score": satisfaction_map.get(_get("satisfaction_national_government"), 2),
            })
            return d

        # Raw + engineered features
        raw_features = [
            "age_bracket", "education_level", "household_income", "socioeconomic_class",
            "housing_status", "constituency_leaning", "vote_national", "vote_local",
            "satisfaction_national_government", "importance_economy", "importance_social_issues",
            "support_welfare_spending", "tax_on_wealthy", "trust_mainstream_media",
            "concern_political_corruption", "climate_priority", "immigration_policy_stance",
            "trust_public_institutions"
        ]
        engineered_cols = [
            "is_fiscally_conservative","is_climate_priority","is_media_skeptic",
            "is_snp_region","is_reform_minded","is_social_justice_focused",
            "education_score","income_score","media_trust_score","gov_satisfaction_score"
        ]

        df = pd.DataFrame([engineer_features(data)])
        encoder = pipeline.named_steps["encoder"]
        model = pipeline.named_steps["model"]

        # Encode categorical
        for col in raw_features:
            if col not in df.columns:
                df[col] = "unknown"

        encoded_df = pd.DataFrame(
            encoder.transform(df[raw_features]),
            columns=encoder.get_feature_names_out()
        )
        final_df = pd.concat([encoded_df, df[engineered_cols].reset_index(drop=True)], axis=1)

        # Align with model
        for col in getattr(model, "feature_names_in_", []):
            if col not in final_df.columns:
                final_df[col] = 0
        if hasattr(model, "feature_names_in_"):
            final_df = final_df[model.feature_names_in_]

        # Predictions
        probs = model.predict_proba(final_df)[0]
        classes = model.classes_
        top_predictions = [
            {"party": inverse_mapping.get(int(cls), "other"), "confidence": round(float(prob) * 100, 2)}
            for cls, prob in sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)[:3]
        ]

        # Save prediction
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO predictions (user_id, party, region) VALUES (%s, %s, %s)",
            (current_user["id"], top_predictions[0]["party"], data.get("constituency_leaning") or data.get("region"))
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"top_predictions": top_predictions}), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# ─── User Prediction Routes ────────────────────────────────
@app.route("/me/prediction", methods=["GET"])
@token_required
def get_user_prediction(current_user):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT party, region, timestamp 
            FROM predictions 
            WHERE user_id = %s
            ORDER BY timestamp DESC
        """, (current_user["id"],))
        history = cur.fetchall()
        cur.close()
        conn.close()

        if not history:
            return jsonify({"saved_prediction": None, "history": []}), 200

        return jsonify({
            "saved_prediction": history[0],  # most recent
            "history": history
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/me/prediction", methods=["DELETE"])
@token_required
def delete_user_prediction(current_user):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM predictions WHERE user_id = %s", (current_user["id"],))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"message": "Prediction history cleared."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── National Predictions ──────────────────────────────
@app.route("/national", methods=["GET"])
def national_prediction():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT party, region, timestamp FROM predictions")
        rows = cur.fetchall()
        cur.close()
        conn.close()

        if not rows:
            return jsonify({"message": "No predictions yet"}), 404

        raw_counts = Counter([row["party"] for row in rows])
        total = sum(raw_counts.values())
        percentages = {p: round((raw_counts.get(p, 0) / total) * 100, 1) for p in PARTIES}
        winner = max(percentages, key=percentages.get)

        return jsonify({
            "national_winner": winner,
            "percentages": percentages,
            "sample_size": total,
            "generated_at": dt.datetime.utcnow().isoformat(timespec="seconds") + "Z"
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── Start Server ─────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Backend running at http://0.0.0.0:5001")
    app.run(debug=True, host="0.0.0.0", port=5001)
