import pytest
from backend.app import normalize_user

def test_normalize_user_minimal():
    raw = {"id": 1, "username": "destiny", "email": "d@example.com"}
    norm = normalize_user(raw, "http://localhost:5000/")
    assert norm["id"] == 1
    assert norm["username"] == "destiny"
    assert norm["profileCompletion"] == 0

def test_normalize_user_with_all_fields():
    raw = {
        "id": 2, "username": "test", "email": "t@test.com",
        "display_name": "Tester", "constituency": "London",
        "chosen_alignment": "lab", "dashboard_party": "lab",
        "profile_pic_url": "pic.jpg", "streak": 5, "profile_completion": 1,
    }
    norm = normalize_user(raw, "http://localhost:5000/")
    assert norm["displayName"] == "Tester"
    assert norm["dashboardParty"] == "lab"
    assert norm["streak"] == 5
    assert norm["profileCompletion"] == 1
