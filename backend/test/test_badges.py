def test_unlock_badge(client, make_token, monkeypatch):
    from backend import app
    class DummyCursor:
        def __init__(self): self.called = []
        def execute(self, q, p=None): self.called.append(q)
        def fetchone(self): return None
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
    r = client.post("/me/unlock-badge", headers={"Authorization": f"Bearer {token}"}, json={"badge": "first_vote"})
    assert r.status_code in (200, 400, 503)
