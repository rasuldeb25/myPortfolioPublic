from datetime import timedelta
from contextlib import asynccontextmanager
from fastapi import FastAPI, UploadFile, File, Form, Depends, HTTPException, status, BackgroundTasks
from fastapi.responses import Response, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select
from typing import List
from .models import BlogPost, BlogPostCreate
from typing import List, Optional
from datetime import datetime, UTC
import os
import shutil
import tempfile
from dotenv import load_dotenv
from fastapi.staticfiles import StaticFiles

load_dotenv()

# Import our local modules
# MAKE SURE YOU HAVE CREATED THESE FILES: xvg_tools.py, database.py, models.py, auth.py
from .xvg_tools import parse_and_plot_xvg 
from .database import create_db_and_tables, get_session
from .models import User
from .auth import verify_password, create_access_token, get_password_hash, get_current_user

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Create the database and tables when the server starts."""
    create_db_and_tables()
    yield

app = FastAPI(title="BioCore Backend", lifespan=lifespan)

# --- 1. CORS (Allow Frontend to talk to Backend) ---
allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 0. FILE UPLOAD SETUP ---
UPLOAD_DIR = "static/uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# This tells FastAPI to serve any file in the /static folder at the /static URL
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.post("/upload")
async def upload_image(file: UploadFile = File(...), user: User = Depends(get_current_user)):
    """Saves an image to static/uploads and returns the URL."""
    # Sanitize filename: Replace spaces with underscores
    file.filename = file.filename.replace(" ", "_")
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Use dynamic BASE_URL from environment, fallback to localhost
    base_url = os.getenv("BASE_URL", "http://localhost:")

    # Return the URL that the frontend will use to display the image
    return {"url": f"{base_url}/static/uploads/{file.filename}"}

# --- 3. LOGIN ENDPOINT (DEBUG VERSION) ---
@app.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    session: Session = Depends(get_session)
):
    print(f"\n--- DEBUG LOGIN ATTEMPT ---")
    print(f"1. Trying to log in user: '{form_data.username}'")

    # 1. Find user in DB
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    
    if not user:
        print("3. RESULT: User NOT FOUND in database.")
        print("   (Did the database file location change?)")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"3. User found! ID: {user.id}")
    # 2. Check password
    is_valid = verify_password(form_data.password, user.hashed_password)
    print(f"5. Password Match Result: {is_valid}")

    if not is_valid:
        print("6. RESULT: Password does NOT match hash.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print("6. RESULT: Success! Generating token.")
    
    # 3. Generate Token
    access_token_expires = timedelta(minutes=60 * 24)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# --- 4. XVG ANALYSIS (Public Tool - No Login Required) ---
@app.post("/analyze/xvg")
async def analyze_xvg_endpoint(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    title: str = Form(None),
    xlabel: str = Form(None),
    ylabel: str = Form(None),
    dpi: int = Form(150),
    line_color: str = Form("#2c3e50"),
    legend_label: str = Form("Trajectory"),
    legend_loc: str = Form("best"),
    # Axis Limits
    x_min: float = Form(None),
    x_max: float = Form(None),
    y_min: float = Form(None),
    y_max: float = Form(None),
    # Appearance
    bg_color: str = Form("white"),
    show_grid: bool = Form(True),
    # Ticks Steps
    x_step: float = Form(None),
    y_step: float = Form(None)
):
    MAX_FILE_SIZE = 15 * 1024 * 1024  # 15MB
    temp_file_path = None
    
    # Create a temporary file to stream the upload
    try:
        # delete=False because we need to close it before reading (cross-platform safety)
        # and we want to pass the path to pandas.
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xvg") as tmp:
            temp_file_path = tmp.name
            size = 0
            CHUNK_SIZE = 1024 * 1024 # 1MB chunks

            while True:
                chunk = await file.read(CHUNK_SIZE)
                if not chunk:
                    break
                size += len(chunk)
                if size > MAX_FILE_SIZE:
                    # File too big - abort
                    tmp.close() # Ensure it's closed
                    os.remove(temp_file_path) # Delete it
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File too large (exceeds 15MB limit)"
                    )
                tmp.write(chunk)
    except HTTPException:
        raise
    except Exception as e:
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    # Process the file
    try:
        image_buffer = parse_and_plot_xvg(
            temp_file_path,
            filename=file.filename,
            title=title,
            xlabel=xlabel,
            ylabel=ylabel,
            dpi=dpi,
            line_color=line_color,
            legend_label=legend_label,
            legend_loc=legend_loc,
            x_min=x_min,
            x_max=x_max,
            y_min=y_min,
            y_max=y_max,
            bg_color=bg_color,
            show_grid=show_grid,
            x_step=x_step,
            y_step=y_step
        )

        # Schedule cleanup to run after response is sent
        background_tasks.add_task(os.remove, temp_file_path)

        # FIX: Return raw bytes to avoid AttributeError
        return Response(content=image_buffer.getvalue(), media_type="image/png", background=background_tasks)

    except Exception as e:
        # Cleanup immediately on error
        if temp_file_path and os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": str(e)}
        )

# --- BLOG ENDPOINTS ---

# 1. PUBLIC: Get All Posts (For the main Blog Page)
@app.get("/posts", response_model=List[BlogPost])
def get_posts(session: Session = Depends(get_session)):
    """Fetch all blog posts, ordered by newest first."""
    # FIX: Sort by created_at instead of .date to avoid AttributeError
    statement = select(BlogPost).order_by(BlogPost.created_at.desc())
    results = session.exec(statement).all()
    return results

# 2. PUBLIC: Get Single Post (For reading a specific article)
@app.get("/posts/{post_id}", response_model=BlogPost)
def get_post(post_id: int, session: Session = Depends(get_session)):
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# 3. ADMIN ONLY: Create a New Post
@app.post("/posts", response_model=BlogPost)
def create_post(
    post: BlogPostCreate,
    user: User = Depends(get_current_user), # <--- This locks the door!
    session: Session = Depends(get_session)
):
    """Only logged-in users (You) can create posts."""
    db_post = BlogPost.model_validate(post)
    db_post.created_at = datetime.now(UTC)
    db_post.updated_at = datetime.now(UTC)
    session.add(db_post)
    session.commit()
    session.refresh(db_post)
    return db_post

# 4. ADMIN ONLY: Update a Post
@app.put("/posts/{post_id}", response_model=BlogPost)
def update_post(
    post_id: int, 
    post_data: BlogPostCreate,
    user: User = Depends(get_current_user), # <--- Locked
    session: Session = Depends(get_session)
):
    existing_post = session.get(BlogPost, post_id)
    if not existing_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Update fields
    existing_post.title = post_data.title
    existing_post.content = post_data.content
    existing_post.summary = post_data.summary
    existing_post.tags = post_data.tags
    existing_post.cover_image_url = post_data.cover_image_url
    existing_post.banner_image_url = post_data.banner_image_url
    existing_post.updated_at = datetime.now(UTC)
    
    session.add(existing_post)
    session.commit()
    session.refresh(existing_post)
    return existing_post

# 5. ADMIN ONLY: Delete a Post
@app.delete("/posts/{post_id}")
def delete_post(
    post_id: int, 
    user: User = Depends(get_current_user), # <--- Locked
    session: Session = Depends(get_session)
):
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    session.delete(post)
    session.commit()
    return {"message": "Post deleted successfully"}
