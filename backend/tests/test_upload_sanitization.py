import os

def test_upload_filename_sanitization(client, auth_headers):
    # Prepare a file with spaces in filename
    filename = "test file with spaces.png"
    file_content = b"fake image content"
    files = {"file": (filename, file_content, "image/png")}

    response = client.post("/upload", files=files, headers=auth_headers)

    assert response.status_code == 200
    data = response.json()

    # Check that spaces are replaced by underscores in the returned URL
    expected_filename = "test_file_with_spaces.png"
    assert expected_filename in data["url"]

    # Also verifying the base URL part
    # In my .env for test I didn't set BASE_URL, so it should be default http://localhost:8000
    assert "http://localhost:8000" in data["url"]

    # Clean up the created file in static/uploads
    upload_path = os.path.join("static/uploads", expected_filename)
    if os.path.exists(upload_path):
        os.remove(upload_path)
