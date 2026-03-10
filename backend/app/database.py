import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.orm import sessionmaker

load_dotenv()

# 1. Get the absolute path of the folder where this file (database.py) lives
#    This will be .../backend/app
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 2. Go up one level to the 'backend' folder
BACKEND_ROOT = os.path.dirname(BASE_DIR)

# 3. Database Setup
sqlite_file_name = os.path.join(BACKEND_ROOT, "biocore.db")
database_url = os.getenv("DATABASE_URL")

connect_args = {}

if database_url:
    # Use the environment variable
    engine_url = database_url
    print(f"--- DATABASE URL: Using configured DATABASE_URL ---")
else:
    # Default to SQLite
    engine_url = f"sqlite:///{sqlite_file_name}"
    connect_args["check_same_thread"] = False
    print(f"--- DATABASE PATH: {sqlite_file_name} ---")

# --- DEBUG BLOCK ---
print(f"\n========================================")
print(f"📍 DATABASE GPS: Using connection string: {engine_url}")
if "sqlite" in engine_url and "biocore.db" in engine_url:
     print(f"Does this file exist? {os.path.exists(sqlite_file_name)}")
print(f"========================================\n")
# -------------------

engine = create_engine(engine_url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session