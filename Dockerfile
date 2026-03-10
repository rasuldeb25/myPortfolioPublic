# Use a lightweight Python version to save RAM (Slim version)
FROM python:3.13-slim

# Set working directory inside the container
WORKDIR /app

# Prevent Python from writing .pyc files to disc
ENV PYTHONDONTWRITEBYTECODE=1
# Prevent Python from buffering stdout/stderr (crucial for logs)
ENV PYTHONUNBUFFERED=1

# Install system dependencies (needed for some Python packages)
# We clean up apt lists immediately to keep the image small
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file first (for caching layers)
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app code
COPY . .

# Create the uploads directory inside the container to avoid permission errors
RUN mkdir -p static/uploads

# Expose the port the app runs on
EXPOSE 8000

# Command to run the app using Gunicorn (Production Server)
# We use 1 worker because you only have 1 CPU core/512MB RAM.
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]