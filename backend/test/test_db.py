import sys, os, pytest
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend import db

class DummyCursor:
    def execute(self, *a, **k): pass
    def fetchone(self): return {"ok": True}
    def fetchall(self): return [{"ok": True}]
    def close(self): pass
    def __enter__(self): return self
    def __exit__(self, *a): pass

class DummyConn:
    def cursor(self, *a, **k): return DummyCursor()
    def commit(self): pass
    def rollback(self): pass
    def close(self): pass

@pytest.fixture(autouse=True)
def patch_db(monkeypatch):
    monkeypatch.setattr(db, "get_db_connection", lambda: DummyConn())
    yield

def test_db_imports():
    assert hasattr(db, "get_db_connection")

def test_get_db_connection_returns_dummy():
    conn = db.get_db_connection()
    assert isinstance(conn, DummyConn)

def test_cursor_execute_and_fetch():
    conn = db.get_db_connection()
    with conn.cursor() as cur:
        cur.execute("SELECT 1")
        assert cur.fetchone() == {"ok": True}
        assert cur.fetchall() == [{"ok": True}]
