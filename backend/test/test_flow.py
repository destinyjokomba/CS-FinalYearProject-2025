import pytest
import jwt
import datetime as dt
from backend import app

SECRET = app.app.config["SECRET_KEY"]

@pytest.fixture
def client():
    return app.app.test_client()

def make_token(user_id=1, username="pytestuser"):
    return jwt.encode(
        {"user_id": user_id, "username": username,
         "exp": dt.datetime.now(dt.UTC) + dt.timedelta(hours=1)},
        SECRET, algorithm="HS256"
    )

def test_full_login_survey_prediction_flow(client, monkeypatch):
    """
    Integration test: Login → Survey submission → Prediction → Dashboard
    """

    # ─── Dummy cursor/connection ────────────────────────────────
    class DummyCursor:
        def __init__(self):
            self.last_query = ""

        def execute(self, q, p=None):
            self.last_query = q.lower()

        def fetchone(self):
            # create mock user
            if "from users" in self.last_query:
                return {
                    "id": 1,
                    "username": "pytestuser",
                    "email": "pytest@example.com",
                    "dashboard_party": "lab",
                    "profile_pic_url": None,
                    "display_name": "Py Test",
                    "constituency": "Midlands",
                    "streak": 0,
                    "profile_completion": 1,
                    "chosen_alignment": "lab"
                }
            # create mock predictions table
            elif "from predictions" in self.last_query:
                return {
                    "party": "lab",
                    "confidence": 0.85,
                    "runner_up": "con",
                    "timestamp": dt.datetime.now(dt.UTC)
                }
            return None

        def fetchall(self):
            if "from badges" in self.last_query:
                return []
            elif "from predictions" in self.last_query:
                return [
                    {
                        "party": "lab",
                        "confidence": 0.85,
                        "runner_up": "con",
                        "timestamp": dt.datetime.now(dt.UTC),
                    }
                ]
            return []

        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass
        def commit(self): pass
        def rollback(self): pass

    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())
    monkeypatch.setattr("backend.app.get_cursor", lambda: DummyCursor())

    # ─── Simulate login ────────────────────────────────
    token = make_token()

    # ─── Submit survey & predict ───────────────────────
    resp = client.post(
        "/predict",
        json={
            "age_bracket": "18-24",
            "education_level": "bachelors degree",
            "household_income": "£20,000–£40,000",
            "socioeconomic_class": "working_class",
            "housing_status": "rent",
            "constituency_leaning": "midlands",
            "vote_national": "remain",
            "vote_local": "labour",
            "satisfaction_national_government": "low",
            "importance_economy": "high",
            "importance_social_issues": "medium",
            "support_welfare_spending": "yes",
            "tax_on_wealthy": "yes",
            "trust_mainstream_media": "low",
            "concern_political_corruption": "high",
            "climate_priority": "yes",
            "immigration_policy_stance": "liberal",
            "trust_public_institutions": "medium",
        },
        headers={"Authorization": f"Bearer {token}"}
    )

    assert resp.status_code == 200
    data = resp.get_json()
    assert "winner" in data
    assert "probabilities" in data
    assert "top_predictions" in data

    # ─── Access dashboard ──────────────────────────────
    resp2 = client.get("/me/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert resp2.status_code == 200
    dashboard = resp2.get_json()
    assert "user" in dashboard
    assert "lastPrediction" in dashboard
