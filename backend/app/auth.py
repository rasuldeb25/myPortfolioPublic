import os
from pathlib import Path
from datetime import datetime, timedelta, UTC
from typing import Union, Optional
from dotenv import load_dotenv
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select
from .database import get_session
from .models import User

# --- 📍 NUCLEAR PATH FIX ---
# This ensures Pytest can find the .env file even when running from the root folder
current_file = Path(__file__).resolve()
backend_root = current_file.parent.parent
env_path = backend_root / ".env"
load_dotenv(dotenv_path=env_path)

# --- CONFIGURATION ---
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 

if not SECRET_KEY:
    # Adding a debug print so you can see where it looked if it fails
    print(f"🔍 Debug: Looked for .env at {env_path}")
    raise ValueError("❌ CRITICAL ERROR: No SECRET_KEY found in .env file. Please create one!")

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- UTILITY FUNCTIONS ---

def verify_password(plain_password, hashed_password):
    """Checks if the typed password matches the stored hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Converts a plain password into a secure hash."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    """Generates the JWT token string."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- DEPENDENCY ---
async def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    statement = select(User).where(User.username == username)
    user = session.exec(statement).first()
    
    if user is None:
        raise credentials_exception
    return user