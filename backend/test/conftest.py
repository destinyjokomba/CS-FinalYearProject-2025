import pytest
import jwt
import datetime as dt
from backend.app import app   # ✅ import the Flask app instance directly

SECRET = app.config["SECRET_KEY"]

@pytest.fixture
def client():
    """Provides a Flask test client for all tests."""
    app.config["TESTING"] = True
    app.config["UPLOAD_FOLDER"] = "uploads"
    return app.test_client()

@pytest.fixture
def make_token():
    """Creates a valid JWT token for tests."""
    def _make(user_id=1, username="pytestuser"):
        return jwt.encode(
            {
                "id": user_id,            # ✅ must match your token_required structure
                "username": username,
                "exp": dt.datetime.now(dt.UTC) + dt.timedelta(hours=1),
            },
            SECRET,
            algorithm="HS256"
        )
    return _make
