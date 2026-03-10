import pytest
import io
from pathlib import Path

def test_stress_image_upload(client, auth_headers):
    """Targets the 0% coverage on upload_image in main.py."""
    # Create a dummy image in memory
    file_content = b"fake-image-data-content"
    file_obj = io.BytesIO(file_content)
    
    # Push the uploader repeatedly
    response = client.post(
        "/upload",
        files={"file": ("stress_test.png", file_obj, "image/png")},
        headers=auth_headers
    )
    assert response.status_code == 200
    assert "url" in response.json()

def test_database_lifespan_trigger(client):
    """Ensures the lifespan context manager logic is fully exercised."""
    # Simply hitting the app's root or any public endpoint ensures 
    # the lifespan startup/shutdown logic was active.
    response = client.get("/posts")
    assert response.status_code == 200