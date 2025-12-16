#!/bin/bash
set -e

# Configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/src/backend"
FRONTEND_DIR="$PROJECT_DIR/src/frontend"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Full Test Suite...${NC}"

# ==========================================
# Backend Tests
# ==========================================
echo -e "\n${GREEN}[Backend] Running Pytest...${NC}"

# Activate virtual environment
if [ -f "$BACKEND_DIR/venv/bin/activate" ]; then
    source "$BACKEND_DIR/venv/bin/activate"
else
    echo -e "${RED}Error: Backend venv not found at $BACKEND_DIR/venv${NC}"
    exit 1
fi

# Run tests from Project root
cd "$PROJECT_DIR"
export OPENAI_API_KEY=dummy
# Ensure src/backend is in python path if needed, though conftest handles it
export PYTHONPATH=$PYTHONPATH:$BACKEND_DIR

# Run pytest with coverage
# Using --cov=src/backend/app to be explicit
pytest --cov=src/backend/app tests/backend

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[Backend] Tests Passed!${NC}"
else
    echo -e "${RED}[Backend] Tests Failed!${NC}"
    exit 1
fi

# ==========================================
# Frontend Tests
# ==========================================
echo -e "\n${GREEN}[Frontend] Running Jest...${NC}"

cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Run Jest with coverage, non-interactive
npm test -- --coverage --watchAll=false

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[Frontend] Tests Passed!${NC}"
else
    echo -e "${RED}[Frontend] Tests Failed!${NC}"
    exit 1
fi

echo -e "\n${GREEN}=======================================${NC}"
echo -e "${GREEN}   ALL TESTS PASSED SUCCESSFULLY   ${NC}"
echo -e "${GREEN}=======================================${NC}"
