from flask import (
    Flask, request, jsonify, send_from_directory, make_response,
    current_app
)
from flask_cors import CORS, cross_origin
from functools import wraps
import os, time, traceback
import jwt
import datetime as dt
import bcrypt
import joblib
import pandas as pd
from typing import Dict, Any
from collections import Counter
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.errors import UniqueViolation
from werkzeug.utils import secure_filename

from backend.db import get_db_connection, get_cursor

# ─── Load env ────────────────────────────────────────────────────────────────
load_dotenv()

# ─── App setup ───────────────────────────────────────────────────────────────
app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "supersecretkey")
app.config["CORS_SUPPORTS_CREDENTIALS"] = True

# CORS origins
_env_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "").split(",") if o.strip()]
allowed_origins = _env_origins or [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://election-predictor-frontend.onrender.com",
]

CORS(
    app,
    resources={r"/*": {"origins": allowed_origins}},
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    max_age=86400,
)

# ─── Paths ───────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PIPELINE_PATH = os.path.join(BASE_DIR, "models", "final_model.pkl")
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# ─── Error handlers ─────────────────────────────────────────────────────────
@app.errorhandler(404)
def _404(_):
    return jsonify({"error": "Not found"}), 404

@app.errorhandler(500)
def _500(e):
    current_app.logger.exception("Unhandled 500 error")
    return jsonify({"error": str(e)}), 500

# ─── Health check ───────────────────────────────────────────────────────────
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.get("/__routes")
def list_routes():
    routes = [{"rule": r.rule, "methods": sorted(list(r.methods))} for r in app.url_map.iter_rules()]
    routes.sort(key=lambda x: x["rule"])
    return jsonify(routes)

# ─── DB helper ───────────────────────────────────────────────────────────────
def get_db_connection():
    url = os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("DATABASE_URL not set")
    return psycopg2.connect(url, cursor_factory=RealDictCursor)


# ─── Example Route (testing db connection) ────────────────────────────────
@app.route("/users")
def list_users():
    try:
        with get_cursor() as cur:
            cur.execute("SELECT id, username, email FROM users")
            users = cur.fetchall()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Preflight convenience (in addition to Flask-CORS) ───────────────────────
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

# ─── JWT auth ────────────────────────────────────────────────────────────────
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
            current_user = {"id": decoded.get("user_id"), "username": decoded.get("username")}
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token invalid"}), 401
        return f(current_user, *args, **kwargs)
    return decorated


# ─── Model pipeline ──────────────────────────────────────────────────────────
pipeline = None
if os.path.exists(PIPELINE_PATH):
    try:
        pipeline = joblib.load(PIPELINE_PATH)
        print(f"✅ Pipeline model loaded from {PIPELINE_PATH}")
    except Exception as e:
        print(f"❌ Failed to load pipeline: {e}")
else:
    print(f"⚠️ Pipeline not found at {PIPELINE_PATH}")


inverse_mapping = {0: "lab", 1: "con", 2: "ld", 3: "green", 4: "reform", 5: "snp", 6: "other"}
PARTIES = ["lab", "con", "ld", "green", "reform", "snp", "other"]

# ─── Auth: register & login ──────────────────────────────────────────────────
@app.route("/auth/register", methods=["POST"])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def register():
    data = request.get_json() or {}
    username, email, password = data.get("username"), data.get("email"), data.get("password")
    if not username or not email or not password:
        return jsonify({"message": "Missing required fields"}), 400

    pw_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (username, email, pw_hash) VALUES (%s,%s,%s) RETURNING id",
            (username, email.lower(), pw_hash),
        )
        user = cur.fetchone()
        conn.commit()
        return jsonify({
            "message": "User registered",
            "id": user["id"],
            "user": {"id": user["id"], "username": username, "email": email.lower(),
                     "profilePicUrl": None, "chosen_alignment": None}
        }), 201
    except UniqueViolation:
        conn.rollback()
        return jsonify({"message": "User already exists"}), 409
    finally:
        cur.close(); conn.close()

# ─── Login Route ───────────────────────────────────────────────────────────────
@app.route("/auth/login", methods=["POST"])
@cross_origin(origins=allowed_origins, supports_credentials=True)
def login():
    data = request.get_json() or {}
    login_id, password = data.get("username") or data.get("email"), data.get("password")

    if not login_id or not password:
        return jsonify({"message": "Username/email and password required"}), 400

    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)  
    cur.execute("""
        SELECT id, username, email, pw_hash, profile_pic_url, chosen_alignment, profile_completion
        FROM users
        WHERE username=%s OR email=%s
    """, (login_id, login_id))
    user = cur.fetchone()
    cur.close(); conn.close()

    if not user:
        return jsonify({"message": "User not found"}), 404

    pw_hash = user["pw_hash"].encode("utf-8") if isinstance(user["pw_hash"], str) else user["pw_hash"]
    if not bcrypt.checkpw(password.encode("utf-8"), pw_hash):
        return jsonify({"message": "Invalid credentials"}), 401

    # Generate JWT
    token = jwt.encode(
        {
            "user_id": user["id"],
            "username": user["username"],
            "exp": dt.datetime.now(dt.UTC) + dt.timedelta(hours=24)  # ✅ FIXED
        },
        app.config["SECRET_KEY"],
        algorithm="HS256"
    )
    if isinstance(token, bytes):
        token = token.decode("utf-8")

    profile_url = (
        f"{request.host_url}uploads/{user['profile_pic_url']}".rstrip("/")
        if user.get("profile_pic_url")
        else None
    )

    return jsonify({
        "token": token,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "profilePicUrl": profile_url,
            "chosenAlignment": user.get("chosen_alignment"),
            "profileCompletion": user.get("profile_completion", 0) 
        }
    }), 200

# ─── Prediction ──────────────────────────────────────────────────────────────
@app.route("/predict", methods=["POST"])
@token_required
def predict(current_user):
    try:
        if pipeline is None:
            return jsonify({"error": "Model is not loaded on server. Please try again later."}), 503

        data = request.get_json(silent=True) or {}
        if not data:
            return jsonify({"error": "No input data provided"}), 400


        # ─── Feature engineering ─────────────────────────────
        def engineer_features(d: Dict[str, Any]) -> Dict[str, Any]:
            education_map = {
                "no qualification": 0, "gcse or equivalent": 1, "a-level or equivalent": 2,
                "bachelors degree": 3, "masters degree": 4, "phd or higher": 5, "other": 2
            }
            income_map = {
                "under £20,000": 0, "£20,000–£40,000": 1, "£40,000–£60,000": 2,
                "£60,000-£80,000": 3, "£80,000 +": 4
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
                "is_reform_minded": int(_get("concern_political_corruption") == "very concerned" and _get("immigration_policy_stance") in ["restrictive","very restrictive"]),
                "is_social_justice_focused": int(_get("importance_social_issues") == "very important" and _get("support_welfare_spending") == "yes"),
                "education_score": education_map.get(_get("education_level"), 2),
                "income_score": income_map.get(_get("household_income"), 2),
                "media_trust_score": trust_map.get(_get("trust_mainstream_media"), 2),
                "gov_satisfaction_score": satisfaction_map.get(_get("satisfaction_national_government"), 2),
            })
            return d

        raw_features = [
            "age_bracket","education_level","household_income","socioeconomic_class",
            "housing_status","constituency_leaning","vote_national","vote_local",
            "satisfaction_national_government","importance_economy","importance_social_issues",
            "support_welfare_spending","tax_on_wealthy","trust_mainstream_media",
            "concern_political_corruption","climate_priority","immigration_policy_stance",
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

        for col in raw_features:
            if col not in df.columns:
                df[col] = "unknown"

        encoded_df = pd.DataFrame(
            encoder.transform(df[raw_features]),
            columns=encoder.get_feature_names_out()
        )
        final_df = pd.concat([encoded_df, df[engineered_cols].reset_index(drop=True)], axis=1)

        for col in getattr(model, "feature_names_in_", []):
            if col not in final_df.columns:
                final_df[col] = 0
        if hasattr(model, "feature_names_in_"):
            final_df = final_df[model.feature_names_in_]

        # ─── Predictions ─────────────────────────────
        probs = model.predict_proba(final_df)[0]
        classes = model.classes_

        # Map probabilities for ALL parties
        probabilities = {
            inverse_mapping.get(int(cls), "other"): round(float(prob) * 100, 2)
            for cls, prob in zip(classes, probs)
        }

        # Top 3 parties
        top_predictions = [
            {"party": party, "confidence": prob}
            for party, prob in sorted(probabilities.items(), key=lambda x: x[1], reverse=True)[:3]
        ]

        winner = top_predictions[0]["party"]
        confidence = top_predictions[0]["confidence"]

        # ─── Save to DB ─────────────────────────────
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            """
            INSERT INTO predictions (user_id, party, region, confidence, runner_up, timestamp)
            VALUES (%s, %s, %s, %s, %s, NOW())
            """,
            (
                current_user["id"],
                winner,
                data.get("constituency_leaning") or data.get("region"),
                confidence,
                top_predictions[1]["party"] if len(top_predictions) > 1 else None,
            ),
        )

        # Update dashboard_party + mark survey complete
        cur.execute(
            """
            UPDATE users
            SET dashboard_party = %s,
                profile_completion = 1
            WHERE id = %s
            """,
            (winner, current_user["id"])
        )

        conn.commit()
        cur.close(); conn.close()

        # ─── Final Response ─────────────────────────────
        return jsonify({
            "winner": winner,
            "confidence": confidence,
            "top_predictions": top_predictions,
            "probabilities": probabilities,
            "profileCompletion": 1
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# ─── User predictions (history) ──────────────────────────────────────────────
@app.route("/me/prediction", methods=["GET"])
@token_required
def get_user_prediction(current_user):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute(
            "SELECT party, region, timestamp FROM predictions WHERE user_id = %s ORDER BY timestamp DESC",
            (current_user["id"],),
        )
        history = cur.fetchall()
        cur.close(); conn.close()

        # convert timestamps to ISO strings 
        for row in history:
            if row.get("timestamp"):
                row["timestamp"] = row["timestamp"].isoformat(timespec="seconds") + "Z"

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
        cur.close(); conn.close()
        return jsonify({"message": "Prediction history cleared."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── National aggregate ──────────────────────────────────────────────────────
@app.route("/national", methods=["GET"])
def national_prediction():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT party, region, timestamp FROM predictions")
        rows = cur.fetchall()
        cur.close(); conn.close()

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
            "generated_at": dt.datetime.now(dt.UTC).isoformat(timespec="seconds")+"Z"  # ✅ FIXED
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ─── Utilities ───────────────────────────────────────────────────────────────
def normalize_user(user: dict, host_url: str) -> dict:
    if not user:
        return {}

    return {
        "id": user.get("id"),
        "username": user.get("username"),
        "email": user.get("email"),
        "displayName": user.get("display_name") or "",
        "constituency": user.get("constituency") or "",
        "chosenAlignment": user.get("chosen_alignment") or "",
        "dashboardParty": user.get("dashboard_party") or "",
        "profilePicUrl": user.get("profile_pic_url") if user.get("profile_pic_url") else None,
        "streak": user.get("streak") or 0,
        "profileCompletion": user.get("profile_completion") or 0,
    }

# ─── Dashboard ───────────────────────────────────────────────────────────────
@app.route("/me/dashboard", methods=["GET"])
@token_required
def get_dashboard(current_user):
    try:
        print("🔑 Current user from JWT:", current_user)

        # Party label mapping (codes → full names)
        party_labels = {
            "lab": "Labour",
            "con": "Conservative",
            "ld": "Liberal Democrats",
            "green": "Green",
            "reform": "Reform UK",
            "snp": "SNP",
            "other": "Other",
        }

        # Fetch user info
        with get_cursor() as cur:
            cur.execute("""
                SELECT id, username, email, display_name, constituency, streak,
                       profile_completion, chosen_alignment, dashboard_party, profile_pic_url
                FROM users WHERE id=%s
            """, (current_user["id"],))
            user = cur.fetchone()

        if not user:
            return jsonify({"error": "User not found"}), 404

        user_normalized = normalize_user(user, request.host_url)

        # Last prediction from predictions table
        with get_cursor() as cur:
            cur.execute("""
                SELECT party, confidence, runner_up, timestamp
                FROM predictions
                WHERE user_id=%s
                ORDER BY timestamp DESC
                LIMIT 1
            """, (current_user["id"],))
            last_prediction = cur.fetchone()

        # ─── Fallback to dashboard_party if no prediction exists ───────────────
        if not last_prediction and user_normalized.get("dashboard_party"):
            last_prediction = {
                "party": user_normalized["dashboard_party"],
                "partyLabel": party_labels.get(
                    user_normalized["dashboard_party"],
                    user_normalized["dashboard_party"]
                ),
                "confidence": None,
                "runnerUpLabel": None,
                "timestamp": None,
            }

        # Attach labels + timestamp formatting
        if last_prediction:
            code = last_prediction["party"]
            last_prediction["partyLabel"] = party_labels.get(code, code)
            if last_prediction.get("runner_up"):
                last_prediction["runnerUpLabel"] = party_labels.get(
                    last_prediction["runner_up"], last_prediction["runner_up"]
                )
            if last_prediction.get("timestamp") and not isinstance(last_prediction["timestamp"], str):
                last_prediction["timestamp"] = (
                    last_prediction["timestamp"].isoformat(timespec="seconds") + "Z"
                )

        # Prediction history
        with get_cursor() as cur:
            cur.execute("""
                SELECT party, confidence, runner_up, timestamp
                FROM predictions
                WHERE user_id=%s
                ORDER BY timestamp DESC
                LIMIT 10
            """, (current_user["id"],))
            history = cur.fetchall()

        for row in history:
            code = row["party"]
            row["partyLabel"] = party_labels.get(code, code)
            if row.get("runner_up"):
                row["runnerUpLabel"] = party_labels.get(row["runner_up"], row["runner_up"])
            if row.get("timestamp"):
                row["timestamp"] = row["timestamp"].isoformat(timespec="seconds") + "Z"

        # Badges
        try:
            with get_cursor() as cur:
                cur.execute("""
                    SELECT name, unlocked, progress_current, progress_target
                    FROM badges
                    WHERE user_id=%s
                """, (current_user["id"],))
                badges = cur.fetchall()
        except Exception:
            badges = []

        # Regional comparison (fallback to 'unknown')
        region = user.get("constituency") or "unknown"
        with get_cursor() as cur:
            cur.execute("""
                SELECT party, COUNT(*)::int AS count
                FROM predictions
                WHERE COALESCE(region, 'unknown') = %s
                GROUP BY party
            """, (region,))
            region_counts = cur.fetchall()

        for r in region_counts:
            code = r["party"]
            r["partyLabel"] = party_labels.get(code, code)

        # Final response
        response = {
            "user": user_normalized,
            "lastPrediction": last_prediction or None,
            "history": history or [],
        }

        print("✅ Dashboard response payload:", response)
        return jsonify(response), 200

    except Exception as e:
        current_app.logger.exception("dashboard failed")
        return jsonify({"error": str(e)}), 500


# ─── Uploads ────────────────────────────────────────────────────────────────
@app.route("/me/upload-profile-pic", methods=["POST"])
@token_required
def upload_profile_pic(current_user):
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        f = request.files["file"]
        if not f or f.filename == "":
            return jsonify({"error": "No file selected"}), 400

        ALLOWED_EXTS = {"png", "jpg", "jpeg", "gif", "webp"}
        if "." not in f.filename or f.filename.rsplit(".", 1)[1].lower() not in ALLOWED_EXTS:
            return jsonify({"error": "Unsupported file type"}), 415

        filename = secure_filename(f"user_{current_user['id']}_{int(time.time())}_{f.filename}")
        path = os.path.join(app.config["UPLOAD_FOLDER"], filename)

        print(f"Saving upload to: {path}") 
        f.save(path)

        # build URL manually instead of url_for
        public_url = f"{request.host_url}uploads/{filename}"

        # update DB
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            "UPDATE users SET profile_pic_url=%s WHERE id=%s RETURNING profile_pic_url",
            (public_url, current_user["id"])
        )
        row = cur.fetchone()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"profilePicUrl": row["profile_pic_url"]}), 200

    except Exception as e:
        print("UPLOAD ERROR:", str(e))
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


# serve uploaded files
@app.route("/uploads/<path:filename>")
def serve_uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)




# ─── Badges ───────────────────────────────────────────────────────────────
@app.route("/me/unlock-badge", methods=["POST"])
@token_required
def unlock_badge(current_user):
    try:
        data = request.get_json() or {}
        badge_name = data.get("badge")
        if not badge_name:
            return jsonify({"error": "No badge name provided"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # Check if badge already exists
        cur.execute(
            "SELECT unlocked FROM badges WHERE user_id=%s AND name=%s",
            (current_user["id"], badge_name)
        )
        row = cur.fetchone()

        if row:
            # If already unlocked, return success
            if row[0]:
                cur.close(); conn.close()
                return jsonify({"message": "Badge already unlocked"}), 200
            else:
                cur.execute(
                    "UPDATE badges SET unlocked=true WHERE user_id=%s AND name=%s",
                    (current_user["id"], badge_name)
                )
        else:
            # Insert new badge entry
            cur.execute(
                "INSERT INTO badges (user_id, name, unlocked, progress_current, progress_target) VALUES (%s, %s, true, 1, 1)",
                (current_user["id"], badge_name)
            )

        conn.commit()
        cur.close(); conn.close()

        return jsonify({"message": f"Badge '{badge_name}' unlocked!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─── Settings ───────────────────────────────────────────────────────────────
@app.route("/me/settings", methods=["PUT"])
@token_required
def update_settings(current_user):
    try:
        data = request.get_json() or {}
        display_name = data.get("displayName")
        constituency = data.get("constituency")
        chosen_alignment = data.get("chosenAlignment")
        dashboard_party = data.get("dashboardParty")
        email = (data.get("email") or "").strip().lower()
        profile_pic_url = data.get("profilePicUrl") 

        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Prevent duplicate emails
        if email:
            cur.execute(
                "SELECT id FROM users WHERE email=%s AND id<>%s",
                (email, current_user["id"])
            )
            if cur.fetchone():
                cur.close(); conn.close()
                return jsonify({"error": "Email already in use"}), 409

        # Base query
        query = """
            UPDATE users
            SET display_name = COALESCE(%s, display_name),
                constituency = COALESCE(%s, constituency),
                chosen_alignment = COALESCE(%s, chosen_alignment),
                dashboard_party = COALESCE(%s, dashboard_party),
                email = COALESCE(NULLIF(%s,''), email)
        """
        params = [display_name, constituency, chosen_alignment, dashboard_party, email]

        # Only update profile picture if provided
        if profile_pic_url:
            query += ", profile_pic_url = %s"
            params.append(profile_pic_url)

        query += """
            WHERE id=%s
            RETURNING id, username, email, display_name, constituency,
                      chosen_alignment, dashboard_party, profile_pic_url
        """
        params.append(current_user["id"])

        cur.execute(query, tuple(params))
        row = cur.fetchone()
        conn.commit()
        cur.close(); conn.close()

        return jsonify({"message": "Settings updated", "user": row}), 200

    except Exception as e:
        current_app.logger.exception("update-settings failed")
        return jsonify({"error": str(e)}), 500


# ─── Main ────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print("Backend running at http://0.0.0.0:5001")
    app.run(debug=True, host="0.0.0.0", port=5001)

