# backend/test/test_extra_coverage.py
import pytest
import jwt
import bcrypt
import datetime as dt
from backend.app import app, get_db_connection  
from backend import db

SECRET = app.config["SECRET_KEY"]   

@pytest.fixture
def client():
    app.config["TESTING"] = True
    return app.test_client()

@pytest.fixture
def make_token():
    """Creates a valid JWT token for tests."""
    def _make(user_id=1, username="pytestuser"):
        return jwt.encode(
            {
                "id": user_id,
                "username": username,
                "exp": dt.datetime.now(dt.UTC) + dt.timedelta(hours=1),
            },
            SECRET,
            algorithm="HS256",
        )
    return _make


# ─── AUTH TESTS ──────────────────────────────────────────────

def test_login_nonexistent_user(client, monkeypatch):
    class DummyCur:
        def execute(self, *a, **k): pass
        def fetchone(self): return None
        def close(self): pass
    class DummyConn:
        def cursor(self, *a, **k): return DummyCur()
        def close(self): pass
    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())

    resp = client.post("/auth/login", json={"username": "ghost", "password": "123"})
    assert resp.status_code == 404


def test_login_wrong_password(client, monkeypatch):
    hashed = bcrypt.hashpw(b"pytest123", bcrypt.gensalt())

    class DummyCur:
        def execute(self, *a, **k): pass
        def fetchone(self):
            return {
                "id": 1, "username": "pytestuser", "email": "x@y.com",
                "pw_hash": hashed,  
                "profile_pic_url": None, "chosen_alignment": None, "profile_completion": 0
            }
        def close(self): pass
    class DummyConn:
        def cursor(self, *a, **k): return DummyCur()
        def close(self): pass

    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())
    resp = client.post("/auth/login", json={"username": "pytestuser", "password": "wrong"})
    assert resp.status_code == 401


# ─── DB TESTS ────────────────────────────────────────────────

def test_get_db_connection_without_env(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "", prepend=False)
    with pytest.raises(RuntimeError):
        db.get_db_connection()


def test_cursor_context_manager(monkeypatch):
    called = {"closed": False}

    class DummyCur:
        def execute(self, *a, **k): return None
        def close(self): called["closed"] = True

    class DummyConn:
        def cursor(self, *a, **k): return DummyCur()
        def close(self): called["closed"] = True

    monkeypatch.setattr("backend.db.psycopg2.connect", lambda *a, **k: DummyConn())

    with db.get_cursor() as cur:
        cur.execute("SELECT 1")

    assert called["closed"] is True


# ─── PREDICT EDGE CASES ─────────────────────────────────────

def test_predict_pipeline_missing(client, monkeypatch, make_token):
    monkeypatch.setattr("backend.app.pipeline", None)
    token = make_token()

    resp = client.post(
        "/predict",
        json={"age_bracket": "18-24"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 503


def test_predict_empty_json(client, monkeypatch, make_token):
    monkeypatch.setattr("backend.app.pipeline", object())  
    token = make_token()

    resp = client.post(
        "/predict",
        json={},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 400


# ─── DASHBOARD EDGE CASES ───────────────────────────────────

def test_dashboard_user_not_found(client, monkeypatch, make_token):
    token = make_token()

    class DummyCur:
        def execute(self, *a, **k): pass
        def fetchone(self): return None
        def fetchall(self): return []
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCur()
        def close(self): pass

    monkeypatch.setattr("backend.db.psycopg2.connect", lambda *a, **k: DummyConn())

    resp = client.get("/me/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert resp.status_code == 404
