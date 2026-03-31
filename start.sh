#!/bin/bash

# Release Note Maker - Startup Script
# Usage: ./start.sh

# Get the directory where the script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Set environment variables from .env file if it exists
if [ -f "$SCRIPT_DIR/.env" ]; then
    echo "Loading environment from .env file..."
    set -a  # Automatically export all variables
    source "$SCRIPT_DIR/.env"
    set +a
fi

echo "Starting Release Note Maker..."

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  Warning: GEMINI_API_KEY not set. AI beautify feature will be disabled."
    echo "   To enable, create a .env file in the project root with:"
    echo "   GEMINI_API_KEY=your_key_here"
    echo ""
    echo "Get your API key from: https://aistudio.google.com/app/apikey"
fi

cd "$SCRIPT_DIR/backend"
mvn spring-boot:run
