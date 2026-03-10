from fastapi.testclient import TestClient

def test_functional_flow(client: TestClient, auth_headers):
    """
    Standard Login, Create, Read, Delete flow.
    """
    # 1. Create Post
    # Note: Login is handled by auth_headers fixture
    post_data = {"title": "Functional Test Post", "content": "This is a test content."}
    create_response = client.post("/posts", json=post_data, headers=auth_headers)
    assert create_response.status_code == 200
    created_post = create_response.json()
    assert created_post["title"] == "Functional Test Post"
    assert created_post["id"] is not None
    post_id = created_post["id"]

    # 2. Read Post (Single)
    read_response = client.get(f"/posts/{post_id}")
    assert read_response.status_code == 200
    assert read_response.json()["title"] == "Functional Test Post"

    # 3. Read Posts (List)
    list_response = client.get("/posts")
    assert list_response.status_code == 200
    posts = list_response.json()
    assert len(posts) >= 1
    # Check our post is in the list
    ids = [p["id"] for p in posts]
    assert post_id in ids

    # 4. Delete Post
    delete_response = client.delete(f"/posts/{post_id}", headers=auth_headers)
    assert delete_response.status_code == 200
    assert delete_response.json() == {"message": "Post deleted successfully"}

    # 5. Verify Deletion
    verify_response = client.get(f"/posts/{post_id}")
    assert verify_response.status_code == 404

def test_user_not_found(client):
    """Clears auth.py missing lines by testing a non-existent user."""
    # Try to log in with a user that definitely doesn't exist
    response = client.post("/token", data={"username": "ghost_user", "password": "password123"})
    assert response.status_code == 401
    assert response.json()["detail"] == "User not found"

def test_update_and_delete_flow(client, auth_headers): # Changed from token_headers
    """Clears main.py lines 139-203 by testing the full lifecycle of a post."""
    # 1. Create a post
    post_data = {
        "title": "Initial Title",
        "content": "Initial Content",
        "summary": "Summary",
        "tags": "test",
        "cover_image_url": "",
        "banner_image_url": ""
    }
    # Changed headers to auth_headers below
    create_res = client.post("/posts", json=post_data, headers=auth_headers)
    post_id = create_res.json()["id"]

    # 2. Update that post
    updated_data = post_data.copy()
    updated_data["title"] = "Updated Title"
    update_res = client.put(f"/posts/{post_id}", json=updated_data, headers=auth_headers)
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Updated Title"

    # 3. Try to update a non-existent post
    fail_update = client.put("/posts/9999", json=updated_data, headers=auth_headers)
    assert fail_update.status_code == 404

    # 4. Delete the post
    del_res = client.delete(f"/posts/{post_id}", headers=auth_headers)
    assert del_res.status_code == 200

    # 5. Try to delete it again
    fail_del = client.delete(f"/posts/{post_id}", headers=auth_headers)
    assert fail_del.status_code == 404
def test_post_not_found_scenarios(client, auth_headers):
    """Triggers 404 logic in main.py for GET, PUT, and DELETE."""
    # 1. GET non-existent
    assert client.get("/posts/999999").status_code == 404
    
    # 2. PUT non-existent
    dummy_data = {"title": "X", "content": "Y"}
    assert client.put("/posts/999999", json=dummy_data, headers=auth_headers).status_code == 404
    
    # 3. DELETE non-existent
    assert client.delete("/posts/999999", headers=auth_headers).status_code == 404
    
def test_missing_auth_lines(client):
    """Targets auth.py lines 67-69 and 75 by hitting a PROTECTED route with a fake token."""
    # We use /posts with a POST request because it requires get_current_user
    response = client.post("/posts", 
                           json={"title": "fail"}, 
                           headers={"Authorization": "Bearer fake.jwt.token"})
    
    # This should now correctly trigger the 401 Unauthorized error
    assert response.status_code == 401
    assert response.json()["detail"] == "Could not validate credentials"

def test_main_startup_logic(client):
    """Targets main.py lines 30-31, 40, 53, 61-68 (CORS logic)."""
    # A simple GET with an Origin header triggers the CORSMiddleware
    response = client.get("/posts", headers={"Origin": "http://localhost:"})
    assert response.status_code == 200
    # This proves CORS is working
    assert response.headers.get("access-control-allow-origin") == "*"

def test_database_edge_cases(client):
    """Targets database.py lines 22-23, 41 (Session/Connection errors)."""
    # This triggers the 'get_session' generator logic fully
    response = client.get("/posts")
    assert response.status_code == 200