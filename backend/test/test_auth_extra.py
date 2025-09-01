def test_register_missing_fields(client):
    r = client.post("/auth/register", json={"email": "only@example.com"})
    assert r.status_code == 400

def test_login_missing_fields(client):
    r = client.post("/auth/login", json={"username": "pytest"})
    assert r.status_code == 400

def test_login_invalid_credentials(client, monkeypatch):
    from backend import app
    import bcrypt
    bad_hash = bcrypt.hashpw("otherpass".encode(), bcrypt.gensalt())

    class DummyCursor:
        def execute(self, *a, **k): pass
        def fetchone(self): return {"id": 1, "username": "pytest", "pw_hash": bad_hash}
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass
    class DummyConn: 
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass

    monkeypatch.setattr(app, "get_db_connection", lambda: DummyConn())
    r = client.post("/auth/login", json={"username": "pytest", "password": "wrong"})
    assert r.status_code in (401, 404)
