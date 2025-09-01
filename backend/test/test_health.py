def test_health_check(client):
    resp = client.get("/health")
    assert resp.status_code in (200, 405)
