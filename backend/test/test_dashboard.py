import pytest
from backend import app

@pytest.fixture
def client():
    return app.app.test_client()

def test_dashboard_requires_auth(client):
    r = client.get("/me/dashboard")
    assert r.status_code == 401

def test_dashboard_with_token(client, make_token, monkeypatch):
    class DummyCursor:
        def execute(self, *a, **k): pass
        def fetchone(self):            return {
                "id": 1,
                "username": "pytestuser",
                "party": "lab",
                "confidence": 0.9
            }
        def fetchall(self):
            return [{"party": "lab", "confidence": 0.9}]
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass

    class DummyContext:
        def __enter__(self): return DummyCursor()
        def __exit__(self, *a): pass

    # Patch both get_db_connection and get_cursor
    monkeypatch.setattr("backend.app.get_db_connection", lambda: DummyConn())
    monkeypatch.setattr("backend.app.get_cursor", lambda: DummyContext())

    token = make_token()
    r = client.get("/me/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code in (200, 503)
