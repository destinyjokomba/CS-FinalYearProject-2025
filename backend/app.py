# ─── Imports ─────────────────────────────────────────────────────────────
from flask import Flask, request, jsonify, send_from_directory
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
from routes.party_meta import party_meta_bp
from werkzeug.utils import secure_filename
from flask import make_response



# ─── Load Env ────────────────────────────────────────────────────────────
load_dotenv()

# ─── App Configuration ──────────────────────────────────────────────────
app = Flask(__name__)
app.register_blueprint(party_meta_bp)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "supersecretkey")
app.config["CORS_SUPPORTS_CREDENTIALS"] = True

# ─── CORS Config ────────────────────────────────────────────────────────
allowed_origins = [
    "http://localhost:5173",                      # dev FE
    "https://election-predictor-frontend.onrender.com",  # prod FE
]

CORS(
    app,
    resources={r"/*": {"origins": allowed_origins}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    max_age=86400,  # cache preflight for 24h
)
app.url_map.strict_slashes = False

@app.before_request
def global_preflight_handler():
    if request.method == "OPTIONS":
        resp = make_response("", 200)  # must be 2xx
        origin = request.headers.get("Origin")
        if origin in allowed_origins:
            resp.headers["Access-Control-Allow-Origin"] = origin
        resp.headers["Access-Control-Allow-Credentials"] = "true"

        # Echo what the browser asked for, or provide defaults
        acrm = request.headers.get("Access-Control-Request-Method", "POST")
        acrh = request.headers.get("Access-Control-Request-Headers", "Content-Type, Authorization")
        resp.headers["Access-Control-Allow-Methods"] = acrm
        resp.headers["Access-Control-Allow-Headers"] = acrh
        resp.headers["Access-Control-Max-Age"] = "86400"
        return resp

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Max-Age"] = "86400"
    return response

# ─── File Paths ────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(__file__)
PIPELINE_PATH = os.path.join(BASE_DIR, "models", "final_model.pkl")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# ─── Load ML Pipeline ─────────────────────────────────────────────────
pipeline = None
if os.path.exists(PIPELINE_PATH):
    try:
        pipeline = joblib.load(PIPELINE_PATH)
        print(f"✅ Pipeline model loaded from {PIPELINE_PATH}")
    except Exception as e:
        print(f"❌ Failed to load pipeline: {e}")
else:
    print(f"⚠️ Pipeline not found at {PIPELINE_PATH}")

# ─── JWT Auth Middleware ──────────────────────────────────────────────
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if request.method == "OPTIONS":
            return jsonify({"ok": True}), 200
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
            return jsonify({"message": "Token invalid"}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# ─── Label Mapping ────────────────────────────────────────────────────
inverse_mapping = {0: "lab", 1: "con", 2: "ld", 3: "green", 4: "reform", 5: "snp", 6: "other"}
PARTIES = ["lab", "con", "ld", "green", "reform", "snp", "other"]

# ─── Database Connection ──────────────────────────────────────────────
def get_db_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"), cursor_factory=RealDictCursor)

@app.get("/__health")
def health():
    return jsonify({"ok": True}), 200

@app.get("/__routes")
def list_routes():
    routes = [
        {"rule": r.rule, "methods": sorted(list(r.methods))}
        for r in app.url_map.iter_rules()
    ]
    routes.sort(key=lambda x: x["rule"])
    return jsonify(routes)


# ─── REGISTER ──────────────────────────────────────────
@app.route("/auth/register", methods=["POST"])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def register():
    data = request.get_json()
    username, email, password = data.get("username"), data.get("email"), data.get("password")
    if not username or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    pw_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    conn, cur = get_db_connection(), None
    try:
        cur = conn.cursor()
        cur.execute("INSERT INTO users (username, email, pw_hash) VALUES (%s,%s,%s) RETURNING id",
                    (username, email, pw_hash))
        user = cur.fetchone()
        conn.commit()
        return jsonify({
            "message": "User registered",
            "id": user["id"],
            "user": {"id": user["id"], "username": username, "email": email,
                     "profilePicUrl": None, "chosen_alignment": None}
        }), 201
    except UniqueViolation:
        conn.rollback()
        return jsonify({"message": "User already exists"}), 409
    finally:
        if cur: cur.close()
        conn.close()

# ─── LOGIN ────────────────────────────────────────────
@app.route("/auth/login", methods=["POST"])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def login():
    data = request.get_json()
    login_id, password = data.get("username") or data.get("email"), data.get("password")
    if not login_id or not password:
        return jsonify({"message": "Username/email and password required"}), 400

    conn, cur = get_db_connection(), None
    cur = conn.cursor()
    cur.execute("SELECT id, username, email, pw_hash, profile_pic, chosen_alignment FROM users "
                "WHERE username=%s OR email=%s", (login_id, login_id))
    user = cur.fetchone()
    cur.close()
    conn.close()
    if not user:
        return jsonify({"message": "User not found"}), 404

    pw_hash = user["pw_hash"].encode("utf-8") if isinstance(user["pw_hash"], str) else user["pw_hash"]
    if not bcrypt.checkpw(password.encode("utf-8"), pw_hash):
        return jsonify({"message": "Invalid credentials"}), 401

    token = jwt.encode({"user_id": user["id"], "username": user["username"],
                        "exp": dt.datetime.utcnow() + dt.timedelta(hours=24)},
                        app.config["SECRET_KEY"], algorithm="HS256")
    profile_url = f"{request.host_url}uploads/{user['profile_pic']}".rstrip("/") if user.get("profile_pic") else None
    return jsonify({"token": token,
                    "user": {"id": user["id"], "username": user["username"], "email": user["email"],
                             "profilePicUrl": profile_url, "chosen_alignment": user.get("chosen_alignment")}}), 200


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
            education_map = {"no qualification": 0, "gcse or equivalent": 1, "a-level or equivalent": 2,
                             "bachelors degree": 3, "masters degree": 4, "phd or higher": 5, "other": 2}
            income_map = {"under £20,000": 0, "£20,000–£40,000": 1, "£40,000–£60,000": 2,
                          "£60,000-£80,000": 3, "£80,000 +": 4}
            trust_map = {"very low": 0, "low": 1, "medium": 2, "high": 3, "very high": 4}
            satisfaction_map = {"very dissatisfied": 0, "dissatisfied": 1, "neutral": 2,
                                "satisfied": 3, "very satisfied": 4}

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
        raw_features = ["age_bracket", "education_level", "household_income", "socioeconomic_class",
                        "housing_status", "constituency_leaning", "vote_national", "vote_local",
                        "satisfaction_national_government", "importance_economy", "importance_social_issues",
                        "support_welfare_spending", "tax_on_wealthy", "trust_mainstream_media",
                        "concern_political_corruption", "climate_priority", "immigration_policy_stance",
                        "trust_public_institutions"]
        engineered_cols = ["is_fiscally_conservative","is_climate_priority","is_media_skeptic",
                           "is_snp_region","is_reform_minded","is_social_justice_focused",
                           "education_score","income_score","media_trust_score","gov_satisfaction_score"]

        df = pd.DataFrame([engineer_features(data)])
        encoder = pipeline.named_steps["encoder"]
        model = pipeline.named_steps["model"]

        for col in raw_features:
            if col not in df.columns:
                df[col] = "unknown"

        encoded_df = pd.DataFrame(encoder.transform(df[raw_features]), columns=encoder.get_feature_names_out())
        final_df = pd.concat([encoded_df, df[engineered_cols].reset_index(drop=True)], axis=1)

        for col in getattr(model, "feature_names_in_", []):
            if col not in final_df.columns:
                final_df[col] = 0
        if hasattr(model, "feature_names_in_"):
            final_df = final_df[model.feature_names_in_]

        probs = model.predict_proba(final_df)[0]
        classes = model.classes_
        top_predictions = [{"party": inverse_mapping.get(int(cls), "other"), "confidence": round(float(prob) * 100, 2)}
                           for cls, prob in sorted(zip(classes, probs), key=lambda x: x[1], reverse=True)[:3]]

        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO predictions (user_id, party, region, confidence, runner_up) VALUES (%s, %s, %s, %s, %s)",
                    (current_user["id"], top_predictions[0]["party"],
                     data.get("constituency_leaning") or data.get("region"),
                     top_predictions[0]["confidence"],
                     top_predictions[1]["party"] if len(top_predictions) > 1 else None))
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
        cur.execute("SELECT party, region, timestamp FROM predictions WHERE user_id = %s ORDER BY timestamp DESC",
                    (current_user["id"],))
        history = cur.fetchall()
        cur.close()
        conn.close()
        if not history:
            return jsonify({"saved_prediction": None, "history": []}), 200
        return jsonify({"saved_prediction": history[0], "history": history}), 200
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
        return jsonify({"national_winner": winner, "percentages": percentages,
                        "sample_size": total, "generated_at": dt.datetime.utcnow().isoformat(timespec="seconds")+"Z"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Put near your other route defs
def _cors_preflight_ok():
    resp = make_response("", 200)
    origin = request.headers.get("Origin")
    if origin in allowed_origins:
        resp.headers["Access-Control-Allow-Origin"] = origin
    resp.headers["Access-Control-Allow-Credentials"] = "true"
    resp.headers["Access-Control-Allow-Headers"] = request.headers.get(
        "Access-Control-Request-Headers", "Content-Type, Authorization"
    )
    resp.headers["Access-Control-Allow-Methods"] = request.headers.get(
        "Access-Control-Request-Method", "GET,POST,PUT,DELETE,OPTIONS"
    )
    resp.headers["Access-Control-Max-Age"] = "86400"
    return resp

@app.route("/", methods=["OPTIONS"])
def options_root():
    return _cors_preflight_ok()

@app.route("/<path:anypath>", methods=["OPTIONS"])
def options_any(anypath):
    return _cors_preflight_ok()


# ─── Dashboard ──────────────────────────────
@app.route("/me/dashboard", methods=["GET"])
@token_required
def get_dashboard(current_user):
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT id, username, email, display_name, constituency, streak, 
               profile_completion, chosen_alignment, dashboard_party, profile_pic
        FROM users WHERE id=%s
    """, (current_user["id"],))
    user = cur.fetchone()

    user_normalized = normalize_user(user, request.host_url)

    cur.execute("""
        SELECT party, confidence, runner_up, timestamp 
        FROM predictions 
        WHERE user_id=%s 
        ORDER BY timestamp DESC LIMIT 1
    """, (current_user["id"],))
    last_prediction = cur.fetchone()

    cur.execute("""
        SELECT party, confidence, runner_up, timestamp 
        FROM predictions 
        WHERE user_id=%s 
        ORDER BY timestamp DESC
    """, (current_user["id"],))
    history = cur.fetchall()

    cur.execute("""
        SELECT name, unlocked, progress_current, progress_target 
        FROM badges WHERE user_id=%s
    """, (current_user["id"],))
    badges = cur.fetchall()

    region = user.get("constituency") or "unknown"
    cur.execute("""
        SELECT party, COUNT(*)::int 
        FROM predictions 
        WHERE region=%s 
        GROUP BY party
    """, (region,))
    region_counts = cur.fetchall()

    cur.close()
    conn.close()

    return jsonify({
        "user": user_normalized,
        "lastPrediction": last_prediction,
        "history": history,
        "badges": badges,
        "comparison": {
            "region": region,
            "regionData": region_counts
        }
    }), 200


# ─── Profile Picture Upload (CORS preflight + POST) ─────────
@app.route("/me/upload-profile-pic", methods=["OPTIONS"])
@cross_origin(
    origins=allowed_origins,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
def upload_profile_pic_options():
    return ("", 200)

@app.route("/me/upload-profile-pic", methods=["POST"])
@cross_origin(
    origins=allowed_origins,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["POST", "OPTIONS"],
)
@token_required
def upload_profile_pic(current_user):
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]
    if not file.filename:
        return jsonify({"error": "Empty filename"}), 400

    # Preserve extension safely
    original = secure_filename(file.filename)
    _, ext = os.path.splitext(original)
    if not ext:
        ext = ".png"  # fallback
    filename = f"user_{current_user['id']}_{int(dt.datetime.utcnow().timestamp())}{ext}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE users SET profile_pic=%s WHERE id=%s RETURNING *",
        (filename, current_user["id"]),
    )
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "message": "Profile picture updated",
        "profilePicUrl": f"{request.host_url}uploads/{filename}",
        "user": normalize_user(user, request.host_url)
    }), 200


# ─── Serve Uploaded Files ───────────────────────────────
@app.route("/uploads/<path:filename>")
def serve_uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# ─── Normalize User Helper ───────────────────────────────
def normalize_user(user: dict, host_url: str) -> dict:
    return {
        "id": user.get("id"),
        "username": user.get("username"),
        "email": user.get("email"),
        "displayName": user.get("display_name"),
        "constituency": user.get("constituency"),
        "dashboardParty": user.get("dashboard_party"),
        "chosen_alignment": user.get("chosen_alignment"),
        "profilePicUrl": f"{host_url}uploads/{user['profile_pic']}".rstrip("/")
            if user.get("profile_pic") else None,
        "streak": user.get("streak"),
        "profileCompletion": user.get("profile_completion"),
    }


# ─── Settings (CORS preflight + PUT) ──────────────────────
@app.route("/me/settings", methods=["OPTIONS"])
@cross_origin(
    origins=allowed_origins,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["PUT", "OPTIONS"],
)
def settings_options():
    return ("", 200)

@app.route("/me/settings", methods=["PUT"])
@cross_origin(
    origins=allowed_origins,
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["PUT", "OPTIONS"],
)
@token_required
def update_settings(current_user):
    data = request.get_json() or {}
    display_name = data.get("displayName")
    constituency = data.get("constituency")
    dashboard_party = data.get("dashboardParty")

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        UPDATE users
        SET display_name = %s,
            constituency = %s,
            dashboard_party = %s
        WHERE id = %s
        RETURNING *
    """, (display_name, constituency, dashboard_party, current_user["id"]))
    user = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "message": "Settings updated successfully",
        "user": normalize_user(user, request.host_url)
    }), 200


# ─── Start Server ─────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Backend running at http://0.0.0.0:5001")
    app.run(debug=True, host="0.0.0.0", port=5001)
