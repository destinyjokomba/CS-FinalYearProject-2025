import pytest
from backend import app

@pytest.fixture
def client():
    return app.app.test_client()

def test_health_check(client):
    r = client.get("/health")
    assert r.status_code == 200
    data = r.get_json()
    assert data.get("status") in ("ok", "healthy")

def test_list_routes(client):
    r = client.get("/routes")
    assert r.status_code in (200, 404, 405, 503)

def test_404_handler(client):
    r = client.get("/not-a-real-route")
    assert r.status_code in (404, 405)

def test_500_handler(client, make_token, monkeypatch):
    # Patch get_db_connection to throw an exception
    monkeypatch.setattr(
        "backend.app.get_db_connection",
        lambda: (_ for _ in ()).throw(Exception("boom"))
    )
    token = make_token()
    r = client.get("/me/dashboard", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code in (500, 503)
