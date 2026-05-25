from datetime import timedelta
import os

from fastapi import APIRouter, Body, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
from jose import JWTError, jwt
from sqlmodel import select

from api.services.postgres import SessionDep
from api.utils.jwt import create_access_token, create_refresh_token
from api.settings import settings
from models.access_token import AccessToken
from models.token_schema import TokenSchema
from models.user import UserDb


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/google", response_model=AccessToken)
async def verify_google_account(data: TokenSchema, session: SessionDep):
    try:
        info = id_token.verify_oauth2_token(
            data.token, requests.Request(), settings.GOOGLE_API_CLIENT_ID
        )
        email = info.get("email", "")
        user = session.exec(select(UserDb).where(UserDb.email == email)).first()
        if not user:
            user = UserDb(email=email, full_name=info.get("name"))
            session.add(user)
            session.commit()
            session.refresh(user)

        api_token = create_access_token(user.uuid, timedelta(minutes=5))
        refresh_token = create_refresh_token(user.uuid, timedelta(days=7))
        return AccessToken(access_token=api_token, refresh_token=refresh_token)
    except ValueError:
        raise HTTPException(401)


@router.post(
    "/refresh",
    response_model=AccessToken,
)
async def refresh_token(session: SessionDep, refresh_token: str = Body(...)):
    try:
        payload = jwt.decode(refresh_token, os.getenv("SECRET_KEY", ""), "HS256")
        if payload.get("type") != "refresh":
            raise HTTPException(401, "Invalid refresh token")

        user_id = payload.get("sub")
        new_access_token = create_access_token(user_id, timedelta(minutes=5))
        new_refresh_token = create_refresh_token(user_id, timedelta(days=7))

        return AccessToken(
            access_token=new_access_token, refresh_token=new_refresh_token
        )
    except JWTError:
        raise HTTPException(401, "Refresh token expired")
