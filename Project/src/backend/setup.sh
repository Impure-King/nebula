#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Backend..."

# 1. Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
else
    echo "✅ Virtual environment already exists."
fi

# 2. Activate virtual environment
echo "🔌 Activating virtual environment..."
source venv/bin/activate

# 3. Install dependencies
echo "⬇️ Installing dependencies..."
pip install -r requirements.txt

# 4. Setup .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Please update .env with your actual credentials!"
else
    echo "✅ .env file already exists."
fi

echo "✨ Backend setup complete!"
echo "👉 Run './run.sh' to start the server."
