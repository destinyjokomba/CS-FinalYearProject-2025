import io
import pytest
from backend.app import app
import backend.app as app_module   

@pytest.fixture
def client(monkeypatch):
    app.config["TESTING"] = True
    app.config["UPLOAD_FOLDER"] = "uploads"

    class DummyCursor:
        def execute(self, q, params=None):
            self.row = {"profile_pic_url": "http://test/uploads/fake.png"}
        def fetchone(self):
            return self.row
        def close(self): pass
        def __enter__(self): return self
        def __exit__(self, *a): pass

    class DummyConn:
        def cursor(self, *a, **k): return DummyCursor()
        def commit(self): pass
        def close(self): pass

    monkeypatch.setattr(app_module, "get_db_connection", lambda: DummyConn())

    with app.test_client() as client:
        yield client

def test_upload_valid_image(client, make_token):
    token = make_token()
    data = {"file": (io.BytesIO(b"fakeimgdata"), "test.png")}
    r = client.post(
        "/me/upload-profile-pic",
        data=data,
        content_type="multipart/form-data",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert r.status_code == 200
    assert "profilePicUrl" in r.get_json()

def test_upload_invalid_file_type(client, make_token):
    token = make_token()
    data = {"file": (io.BytesIO(b"bad"), "malware.exe")}
    r = client.post(
        "/me/upload-profile-pic",
        data=data,
        content_type="multipart/form-data",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert r.status_code == 415
