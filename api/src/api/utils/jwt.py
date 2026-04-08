from datetime import datetime, timedelta, timezone
import os
from typing import Annotated, Any, Optional, Union

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlmodel import select

from api.services.postgres import SessionDep, get_session
from models.user import UserDb

oauth2_scheme = OAuth2PasswordBearer("auth/token")


def create_access_token(subject: Union[str, Any], exp_delta: timedelta):
    expires = datetime.now(timezone.utc) + exp_delta
    to_encode = {"exp": expires, "sub": str(subject)}

    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY", ""), algorithm="HS256")

    return encoded_jwt


def create_refresh_token(subject: Union[str, Any], exp_delta: timedelta):
    expires = datetime.now(timezone.utc) + exp_delta
    to_encode = {"exp": expires, "sub": str(subject), "type": "refresh"}

    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY", ""), algorithm="HS256")

    return encoded_jwt


def get_currrent_user(session: SessionDep, token: str = Depends(oauth2_scheme)):
    try:
        print(token)
        payload = jwt.decode(token, os.getenv("SECRET_KEY", ""), "HS256")
        user_uuid = payload["sub"]
        if not user_uuid:
            raise HTTPException(401, "Invalid certificate")
    except JWTError:
        raise HTTPException(401, "Certificate overdue")

    user = session.exec(select(UserDb).where(UserDb.uuid == user_uuid)).first()

    if not user:
        raise HTTPException(404, "User not found")
    return user


UserDeps = Annotated[UserDb, Depends(get_currrent_user)]
