from datetime import timedelta
import os

from fastapi import APIRouter, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlmodel import select

from api.services.postgres import SessionDep
from api.utils.jwt import create_access_token
from models.access_token import AccessToken
from models.token_schema import TokenSchema
from models.user import UserDb


router = APIRouter(prefix="/auth")


@router.post("/google", response_model=AccessToken)
async def verify_google_account(data: TokenSchema, session: SessionDep):
    try:
        info = id_token.verify_oauth2_token(
            data.token, requests.Request(), os.getenv("GOOGLE_API_CLIENT_ID")
        )
        email = info.get("email", "")
        user = session.exec(select(UserDb).where(UserDb.email == email)).first()
        if not user:
            user = UserDb(email=email, full_name=info.get("name"))
            session.add(user)
            session.commit()
            session.refresh(user)

        api_token = create_access_token(user.uuid, timedelta(minutes=5))
        return AccessToken(access_token=api_token)
    except ValueError:
        raise HTTPException(401)
