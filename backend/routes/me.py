# backend/routes/me.py
import os
from flask import Blueprint, request, jsonify, current_app, url_for
from werkzeug.utils import secure_filename
from backend.auth import token_required

me = Blueprint("me", __name__)

ALLOWED_EXTS = {"png", "jpg", "jpeg", "gif", "webp"}

def allowed(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTS
@me.route("/me/upload-profile-pic", methods=["POST"])
@token_required
def upload_profile_pic(current_user):
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        f = request.files["file"]
        if not f or f.filename == "":
            return jsonify({"error": "No file selected"}), 400
        if not allowed(f.filename):
            return jsonify({"error": "Unsupported file type"}), 415

        os.makedirs(current_app.config.get("UPLOAD_FOLDER", "uploads"), exist_ok=True)
        filename = secure_filename(f.filename)
        filepath = os.path.join(current_app.config.get("UPLOAD_FOLDER", "uploads"), filename)

        f.save(filepath)

        # 👇 Debug line for your pytest run
        print(f"✅ Saved file to: {filepath}")

        return jsonify({"profilePicUrl": url_for("static", filename=filename, _external=True)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



