import sys
import os

# Add the project root to sys.path so that 'app' can be imported by Vercel
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.main import app

# Export app for Vercel WSGI/ASGI handler
__all__ = ["app"]
