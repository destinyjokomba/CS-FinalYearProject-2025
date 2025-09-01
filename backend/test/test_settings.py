def test_update_settings(client, make_token, monkeypatch):
    from backend import app
    class DummyCursor:
        def execute(self, *a, **k): self.row = {"id": 1, "username": "pytest"}
        def fetchone(self): return self.row
        def fetchall(self): return []
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass
    class DummyConn: 
        def cursor(self, *a, **k): return DummyCursor()
        def commit(self): pass
        def close(self): pass
    monkeypatch.setattr(app, "get_db_connection", lambda: DummyConn())

    token = make_token()
    r = client.put("/me/settings", headers={"Authorization": f"Bearer {token}"}, json={"email": "pytest@example.com"})
    assert r.status_code in (200, 409, 503)
