# HealthTech Application

## Project Structure

This project consists of two main components:

1.  **web_app**: A Next.js 14+ application using the App Router.
2.  **ai_engine**: A Python FastAPI service for ML model inference.

## Prerequisites

- Node.js & npm
- Python 3.8+

## How to Run

### 1. Web Application (Next.js)

The web application is located in the `web_app` directory.

```bash
cd web_app
npm install  # If dependencies are not installed
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000).

### 2. AI Engine (FastAPI)

The AI engine is located in the `ai_engine` directory.

```bash
cd ai_engine
# Create and activate virtual environment if not already done
# python -m venv venv
# source venv/bin/activate (Linux/Mac) or venv\Scripts\activate (Windows)
pip install fastapi uvicorn
uvicorn main:app --reload
```

The API will start at [http://localhost:8000](http://localhost:8000).
