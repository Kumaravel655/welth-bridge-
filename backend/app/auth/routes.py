from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import timedelta
from app.database import get_db
from app.models import User
from app.auth.schemas import UserCreate, UserLogin, UserResponse, Token
from app.auth.utils import get_password_hash, verify_password, create_access_token
from app.config import settings

router = APIRouter()

@router.post("/sign-up", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def sign_up(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    # Check existing user
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    hashed_pwd = get_password_hash(user_in.password)
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        phone=user_in.phone,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    # TODO: Send verification email
    
    return new_user

@router.post("/sign-in", response_model=Token)
async def sign_in(user_in: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_in.email))
    user = result.scalars().first()
    
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.role.value},
        expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        path="/"
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/sign-out")
async def sign_out(response: Response):
    response.delete_cookie(key="access_token", path="/", samesite="lax")
    return {"message": "Successfully logged out"}
