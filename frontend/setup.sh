#!/bin/bash

# Exit on error
set -e

echo "🚀 Setting up Frontend..."

# 1. Install dependencies
echo "⬇️ Installing npm dependencies..."
npm install

# 2. Setup .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  IMPORTANT: Please update .env with your actual credentials!"
else
    echo "✅ .env file already exists."
fi

echo "✨ Frontend setup complete!"
echo "👉 Run './run.sh' to start the app."
