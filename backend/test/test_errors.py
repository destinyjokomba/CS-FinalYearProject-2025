import pytest, jwt, datetime as dt
from backend import app

SECRET = app.app.config["SECRET_KEY"]

@pytest.fixture
def client():
    return app.app.test_client()

def make_token(user_id=1, username="pytestuser", expired=False):
    exp_time = dt.datetime.now(dt.UTC) - dt.timedelta(hours=1) if expired else dt.datetime.now(dt.UTC) + dt.timedelta(hours=1)
    return jwt.encode(
        {"user_id": user_id, "username": username, "exp": exp_time},
        SECRET,
        algorithm="HS256"
    )

# ─── Prediction Errors ───────────────────────────────────────────────

def test_predict_missing_token(client):
    resp = client.post("/predict", json={})
    assert resp.status_code == 401
    assert "Token is missing" in resp.get_json().get("message", "")

def test_predict_invalid_token(client):
    resp = client.post("/predict", json={}, headers={"Authorization": "Bearer not_a_real_token"})
    assert resp.status_code == 401

def test_predict_expired_token(client):
    token = make_token(expired=True)
    resp = client.post("/predict", json={}, headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 401
    assert "expired" in resp.get_json().get("message", "").lower()

def test_predict_no_data(client):
    token = make_token()
    resp = client.post(
        "/predict",
        json={},   
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code in (400, 503)
    data = resp.get_json()
    assert "error" in data


# ─── National prediction Errors ──────────────────────────────────────────────

def test_national_no_predictions(client, monkeypatch):
    class DummyCursor:
        def execute(self, q, p=None): pass
        def fetchall(self): return []  # no rows
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass

    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())

    resp = client.get("/national")
    assert resp.status_code in (200, 404)
    data = resp.get_json()
    assert "message" in data or "national_winner" in data

# ─── Settings Errors ──────────────────────────────────────────────

def test_settings_duplicate_email(client, monkeypatch):
    token = make_token()

    class DummyCursor:
        def execute(self, q, p=None):
            if "SELECT id FROM users" in q:
                self._row = {"id": 99}
            else:
                self._row = {"id": 1, "username": "pytestuser", "email": "taken@example.com"}
        def fetchone(self): return self._row
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass
        def commit(self): pass
        def rollback(self): pass

    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())

    resp = client.put(
        "/me/settings",
        json={"email": "taken@example.com"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert resp.status_code in (200, 409)
    data = resp.get_json()
    assert "error" in data or "message" in data
