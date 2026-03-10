import pytest
import sys
import os
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

# Add backend to sys.path so we can import app modules
# Assuming this file is in backend/tests/
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.database import get_session
from app.models import User
from app.auth import get_password_hash

# Use StaticPool to share the same in-memory database across threads/requests within a session
# This ensures that if the app is multi-threaded or tests run async, they see the same DB.
sqlite_url = "sqlite:///:memory:"
engine = create_engine(
    sqlite_url,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)

@pytest.fixture(name="session")
def session_fixture():
    # Re-create the database for each test to ensure isolation
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

@pytest.fixture(name="auth_headers")
def auth_headers_fixture(client, session):
    """Creates a user, logs in, and returns the Authorization header."""
    user = User(username="testuser", hashed_password=get_password_hash("testpassword"))
    session.add(user)
    session.commit()

    response = client.post("/token", data={"username": "testuser", "password": "testpassword"})
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
