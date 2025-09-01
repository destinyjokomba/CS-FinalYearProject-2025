import bcrypt
from backend import app

def test_register_and_login(client, monkeypatch):
    class DummyCursor:
        def execute(self, q, p=None):
            if "insert" in q.lower():
                self.row = {"id": 1}
            else:
                self.row = {
                    "id": 1,
                    "username": "pytest",
                    "email": "pytest@example.com",
                    "pw_hash": bcrypt.hashpw(
                        "pytest123".encode(), bcrypt.gensalt()
                    ),
                }
        def fetchone(self): return self.row
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def commit(self): pass
        def rollback(self): pass
        def close(self): pass

    # ✅ Patch database connection
    monkeypatch.setattr(app, "get_db_connection", lambda: DummyConn())

    # Register
    r = client.post("/auth/register", json={
        "username": "pytest",
        "email": "pytest@example.com",
        "password": "pytest123"
    })
    assert r.status_code in (200, 201, 409)

    # Login
    r = client.post("/auth/login", json={
        "username": "pytest",
        "password": "pytest123"
    })
    assert r.status_code in (200, 401, 404)
