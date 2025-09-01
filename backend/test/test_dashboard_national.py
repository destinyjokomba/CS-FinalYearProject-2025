import pytest
import jwt
import datetime as dt
from backend.app import app

SECRET = app.config["SECRET_KEY"]

@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()

def make_token(user_id=1, username="pytestuser"):
    return jwt.encode(
        {
            "user_id": user_id,
            "username": username,
            "exp": dt.datetime.now(dt.UTC) + dt.timedelta(hours=1)
        },
        SECRET,
        algorithm="HS256"
    )

# ─── Dashboard Tests ──────────────────────────────────────────────────────────
def test_dashboard_fallback_to_dashboard_party(client, monkeypatch):
    """Integration: dashboard uses dashboard_party when no predictions exist"""

    class DummyCursor:
        def execute(self, q, params=None):
            if "FROM users" in q:
                self.result = {
                    "id": 1,
                    "username": "pytestuser",
                    "email": "pytest@example.com",
                    "display_name": None,
                    "constituency": "London",
                    "streak": 0,
                    "profile_completion": 0,
                    "chosen_alignment": None,
                    "dashboard_party": "lab",
                    "profile_pic_url": None,
                }
            elif "FROM predictions" in q:
                self.result = None
            elif "FROM badges" in q:
                self.result = []
            else:
                self.result = []
        def fetchone(self): return self.result
        def fetchall(self): return []
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass

    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())
    monkeypatch.setattr("backend.app.get_cursor", lambda: DummyConn().cursor())

    token = make_token()
    resp = client.get("/me/dashboard", headers={"Authorization": f"Bearer {token}"})
    data = resp.get_json()

    assert resp.status_code == 200
    assert data["user"]["dashboardParty"] == "lab"
    # since no predictions exist, lastPrediction should be None
    assert data["lastPrediction"] is None


# ─── National Tests ──────────────────────────────────────────────────────────
def test_national_percentages_sum_to_100(client, monkeypatch):
    """Integration: national endpoint returns percentages ~100%"""

    class DummyCursor:
        def execute(self, q, params=None):
            self.result = [
                {"party": "lab", "region": "London", "timestamp": dt.datetime.now(dt.UTC)},
                {"party": "con", "region": "London", "timestamp": dt.datetime.now(dt.UTC)},
                {"party": "lab", "region": "London", "timestamp": dt.datetime.now(dt.UTC)},
            ]
        def fetchall(self): return self.result
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass

    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())

    resp = client.get("/national")
    data = resp.get_json()

    assert resp.status_code == 200
    total_percentage = sum(data["percentages"].values())
    assert 95 <= total_percentage <= 105  # allow rounding wiggle
    assert data["national_winner"] in ["lab", "con"]
