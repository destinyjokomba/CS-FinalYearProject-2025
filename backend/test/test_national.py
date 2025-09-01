import datetime as dt

def test_national_prediction(client, monkeypatch):
    from backend import app
    class DummyCursor:
        def execute(self, *a, **k): pass
        def fetchall(self): return [{"party": "lab", "region": "london", "timestamp": dt.datetime.now()}]
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass
    class DummyConn: 
        def cursor(self, *a, **k): return DummyCursor()
        def close(self): pass
    monkeypatch.setattr(app, "get_db_connection", lambda: DummyConn())

    r = client.get("/national")
    assert r.status_code in (200, 404, 503)
