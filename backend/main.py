from fastapi import FastAPI
from app.auth.routes import router as auth_router
from app.portal.routes import router as portal_router
from app.admin.routes import router as admin_router
from app.public.routes import router as public_router

app = FastAPI(title="WealthBridge Client Portal API")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(portal_router, prefix="/api/portal", tags=["portal"])
app.include_router(admin_router, prefix="/api/admin", tags=["admin"])
app.include_router(public_router, prefix="/api/public", tags=["public"])

@app.get("/")
def root():
    return {"message": "WealthBridge API is running"}
