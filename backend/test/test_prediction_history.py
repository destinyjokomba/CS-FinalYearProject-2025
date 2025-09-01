import datetime as dt

def test_prediction_history_get(client, make_token, monkeypatch):
    from backend import app
    class DummyCursor:
        def execute(self, *a, **k): pass
        def fetchall(self): return [{"party":"lab","region":"london","timestamp": dt.datetime.now()}]
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass
    class DummyConn: 
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass
    monkeypatch.setattr(app, "get_db_connection", lambda: DummyConn())

    token = make_token()
    r = client.get("/me/prediction", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code in (200, 503)

def test_prediction_history_delete(client, make_token, monkeypatch):
    from backend import app
    class DummyCursor:
        rowcount = 1
        def execute(self, *a, **k): pass
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
    r = client.delete("/me/prediction", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code in (200, 503)
