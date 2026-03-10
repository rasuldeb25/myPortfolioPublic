from fastapi.testclient import TestClient

def test_empty_json_body(client: TestClient, auth_headers):
    """
    Send an empty JSON body {}.
    Should return 422 Validation Error.
    """
    response = client.post("/posts", json={}, headers=auth_headers)
    assert response.status_code == 422
    assert response.status_code != 500

def test_integer_title(client: TestClient, auth_headers):
    """
    Send a post with title as an integer.
    Pydantic might coerce this to string (200) or reject it (422).
    Both are acceptable. 500 is not.
    """
    post_data = {
        "title": 12345,
        "content": "Content"
    }
    response = client.post("/posts", json=post_data, headers=auth_headers)
    assert response.status_code in [200, 201, 422]
    assert response.status_code != 500

def test_missing_content_type_login(client: TestClient):
    """
    Send a login request with a missing Content-Type header.
    OAuth2PasswordRequestForm expects application/x-www-form-urlencoded.
    """
    # Send raw data without headers.
    # Note: TestClient/httpx might add Content-Type if we provide 'data' (form) or 'json'.
    # We use 'content' to send raw bytes.
    payload = "username=testuser&password=testpassword"
    response = client.post(
        "/token",
        content=payload,
        headers={} # Force no headers
    )

    # Should fail because it doesn't know how to parse the body without Content-Type
    # likely 422 (Validation Error) or 415 (Unsupported Media Type)
    assert response.status_code in [400, 422, 415]
    assert response.status_code != 500
