#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd "$DIR"

echo "=================================================="
echo "🛡️  Starting Kavach AI Shield Server"
echo "=================================================="

# Check if .venv exists, otherwise create it with uv or python
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    if command -v /home/keshavnarayan501/.local/bin/uv >/dev/null 2>&1; then
        /home/keshavnarayan501/.local/bin/uv venv .venv
        /home/keshavnarayan501/.local/bin/uv pip install -r requirements.txt
    else
        python3 -m venv .venv
        .venv/bin/pip install -r requirements.txt
    fi
fi

# Activate venv
source .venv/bin/activate

# Default port
PORT=${PORT:-8000}
HOST=${HOST:-0.0.0.0}

echo "Server running at: http://localhost:$PORT"
echo "Press Ctrl+C to stop."

exec uvicorn app.main:app --host "$HOST" --port "$PORT" --reload
