from fastapi.testclient import TestClient

def test_rapid_post_creation(client: TestClient, auth_headers):
    """
    Loop 50 times rapidly creating posts.
    Ensures the DB handles the load and no locking errors occur.
    """
    for i in range(50):
        post_data = {
            "title": f"Concurrency Test Post {i}",
            "content": f"Content for post {i}"
        }
        response = client.post("/posts", json=post_data, headers=auth_headers)

        # Check for success
        assert response.status_code == 200, f"Failed at iteration {i}: {response.text}"

        # Explicitly check for SQLite locking error in response text (just in case 500 leaked)
        assert "Database is locked" not in response.text
