import sys
import os
import pytest
from fastapi.testclient import TestClient

# Add backend to python path so we can import 'app'
# This path is relative to backend/tests/conftest.py
# We need to go up 1 level: tests -> backend
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.main import app

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
