import pytest, jwt, datetime as dt
from backend import app

SECRET = app.app.config["SECRET_KEY"]

@pytest.fixture
def client():
    return app.app.test_client()

@pytest.fixture
def make_token():
    def _make(user_id=1, username="pytestuser"):
        return jwt.encode(
            {
                "user_id": user_id,
                "username": username,
                "exp": dt.datetime.now(dt.UTC) + dt.timedelta(hours=1),
            },
            SECRET,
            algorithm="HS256"
        )
    return _make

def test_predict_requires_auth(client):
    r = client.post("/predict", json={})
    assert r.status_code in (401, 403)

def test_predict_with_token(client, make_token, monkeypatch):
    class DummyCursor:
        def execute(self, q, p=None): pass
        def fetchone(self): return {"party": "lab", "confidence": 0.95}
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def commit(self): pass
        def close(self): pass

    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())

    token = make_token()
    headers = {"Authorization": f"Bearer {token}"}
    r = client.post(
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
        headers=headers,
    )
    assert r.status_code in (200, 503)
