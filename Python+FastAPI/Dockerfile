# Use the official Python image from the Docker Hub based on Alpine Linux
FROM python:3.9-slim

# Set environment variables to prevent Python from writing pyc files to disc and enable output buffering
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container at /app
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container at /app
COPY . .

# Make port 80 available to the world outside this container
EXPOSE 80

# Define environment variables
ENV GITHUB_TOKEN=${GITHUB_TOKEN}

# Run the application with Uvicorn in production mode
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--workers", "1", "--log-level", "info"]
