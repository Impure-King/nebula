#!/bin/bash
# Activate virtual environment
source venv/bin/activate

# Run uvicorn bound to 0.0.0.0 to allow external connections (e.g. from mobile devices)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
