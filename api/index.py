import sys
import os

# Add the project root to sys.path so that 'app' can be imported by Vercel
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from app.main import app as fastapi_app


class VercelPathMiddleware:
    """
    Middleware for Vercel serverless deployment.
    Restores the original request path from Vercel routing headers (x-matched-path or x-invoke-path)
    so that FastAPI router matches the actual client URL instead of the rewrite target.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            headers = dict(scope.get("headers", []))
            # Vercel sends original requested path in x-matched-path or x-invoke-path
            raw_path = headers.get(b"x-matched-path") or headers.get(b"x-invoke-path") or headers.get(b"x-forwarded-uri")
            if raw_path:
                original_path = raw_path.decode("utf-8")
                if "?" in original_path:
                    original_path = original_path.split("?")[0]
                scope["path"] = original_path

        await self.app(scope, receive, send)


app = VercelPathMiddleware(fastapi_app)

__all__ = ["app"]
