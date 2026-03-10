import pytest
from fastapi.testclient import TestClient

def test_sql_injection_login(client: TestClient):
    """
    Attempt SQL Injection in the login form.
    Should return 401 Unauthorized, NOT 500 Internal Server Error.
    """
    payload = {"username": "' OR '1'='1", "password": "password"}
    response = client.post("/token", data=payload)

    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    assert response.status_code != 500

def test_xss_blog_post(client: TestClient, auth_headers):
    """
    Attempt to store an XSS payload.
    The API should either sanitize it, reject it, or store it (handling it safely).
    Crucially, it should not crash.
    """
    xss_payload = "<script>alert('hacked')</script>"
    post_data = {
        "title": xss_payload,
        "content": "This is a test post with XSS in title."
    }

    response = client.post("/posts", json=post_data, headers=auth_headers)

    # Accept 200/201 (Stored) or 422 (Rejected/Sanitization failure)
    # But definitely not 500.
    assert response.status_code != 500

    if response.status_code in [200, 201]:
        data = response.json()
        # If stored, verify it matches or is sanitized
        # Here we just assert it didn't crash and returned valid JSON
        assert "title" in data
        assert data["title"] == xss_payload or "&lt;" in data["title"]

def test_payload_flooding(client: TestClient, auth_headers):
    """
    Send a large payload (10MB).
    Should return 200, 413, or 422. Never 500 or crash.
    """
    # 10MB string
    large_content = "a" * (10 * 1024 * 1024)
    post_data = {
        "title": "Large Post",
        "content": large_content
    }

    try:
        response = client.post("/posts", json=post_data, headers=auth_headers)
        assert response.status_code != 500
    except Exception as e:
        # If the client crashes due to memory, that's also a failure of the test env,
        # but we want to catch server errors.
        pytest.fail(f"Request failed: {e}")
