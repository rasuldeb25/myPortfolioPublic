from typing import Optional
from datetime import datetime, UTC
from sqlmodel import Field, SQLModel

# --- Existing User Model ---
class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str

# --- NEW: Blog Post Model ---

class BlogPostBase(SQLModel):
    # Basic Info
    title: str = Field(index=True)
    content: str # This will store the long Markdown text with image links
    
    # Metadata
    summary: Optional[str] = Field(default=None) # A short preview for the main page card
    tags: Optional[str] = Field(default=None)    # e.g. "GROMACS, Python, HPC"
    cover_image_url: Optional[str] = Field(default=None) # Optional main image for the top of the post
    banner_image_url: Optional[str] = Field(default=None) # Optional banner image for the post

class BlogPost(BlogPostBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    
    # Automatic Date
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: Optional[datetime] = Field(default_factory=lambda: datetime.now(UTC))

class BlogPostCreate(BlogPostBase):
    pass
