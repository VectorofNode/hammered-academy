from datetime import timedelta
import os

from fastapi import APIRouter, Body, HTTPException
from google.oauth2 import id_token
from google.auth.transport import requests
from jose import JWTError, jwt
from sqlmodel import select
from webauthn import (
    generate_authentication_options,
    generate_registration_options,
    options_to_json,
    verify_authentication_response,
    verify_registration_response,
)

from api.services.postgres import SessionDep
from api.services.redis import RedisSessionDep
from api.utils.jwt import create_access_token, create_refresh_token
from api.settings import settings
from models.access_token import AccessToken
from models.passkey import (
    PasskeyLoginGrantOptionInfo,
    PasskeyLoginVerifyRequest,
    PasskeyRegisterVerifyResponse,
    UserPasskey,
)
from models.token_schema import TokenSchema
from models.user import UserBase, UserDb
from webauthn.helpers.structs import (
    PublicKeyCredentialDescriptor,
    AttestationConveyancePreference,
    UserVerificationRequirement,
)
from webauthn.helpers import (
    parse_registration_options_json,
    parse_authentication_options_json,
)


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


@router.post("/register/passkey")
def register_passkey(
    reg: UserBase, session: SessionDep, redis_session: RedisSessionDep
) -> str:
    try:
        userdb = session.exec(select(UserDb).where(UserDb.email == reg.email)).first()
        if not userdb:
            user = UserDb(
                email=reg.email, full_name=reg.full_name, avatar_url=reg.avatar_url
            )
            session.add(user)
            session.commit()
            session.refresh(user)
            userdb = user
        exclude_credentials = []
        if not userdb.passkeys:
            for pk in userdb.passkeys:
                exclude_credentials.append(
                    PublicKeyCredentialDescriptor(pk.credential_id)
                )

        options = generate_registration_options(
            rp_id=settings.RP_ID,
            rp_name=settings.RP_NAME,
            user_id=userdb.email.encode("utf-8"),
            user_name=userdb.email,
            user_display_name=userdb.full_name,
            exclude_credentials=exclude_credentials,
            attestation=AttestationConveyancePreference.NONE,
        )
        option_json = options_to_json(options)
        redis_session.set(f"challange:registeration:{reg.email}", option_json, 300)
        return option_json
    except Exception:
        raise HTTPException(500, "Failed to register passkey.")


@router.post("/register/passkey/verification", status_code=204)
def verify_passkey(
    req: PasskeyRegisterVerifyResponse,
    session: SessionDep,
    redis_session: RedisSessionDep,
):
    try:
        user = session.exec(select(UserDb).where(UserDb.email == req.username)).first()
        if not user or not user.id:
            raise HTTPException(404, "User not found.")
        if not redis_session.exists(f"challange:{req.username}"):
            raise HTTPException(404, "User challange not found.")
        saved_opt_json = str(redis_session.get(f"challange:{req.username}"))
        saved_option = parse_registration_options_json(saved_opt_json)

        verification = verify_registration_response(
            credential=req.credential_json,
            expected_challenge=saved_option.challenge,
            expected_origin="",
            expected_rp_id=settings.RP_ID,
        )
        new_passkey = UserPasskey(
            user_id=user.id,
            credential_id=verification.credential_id,
            public_key=verification.credential_public_key,
            sign_count=verification.sign_count,
        )
        session.add(new_passkey)
        session.commit()
        session.refresh(new_passkey)

    except Exception:
        raise HTTPException(500, "Failed to verify passkey registeration")


@router.post("/login/passkey/options")
async def get_passkey_access_option(
    req: PasskeyLoginGrantOptionInfo,
    session: SessionDep,
    redis_session: RedisSessionDep,
):
    try:
        user = session.exec(select(UserDb).where(UserDb.email == req.username)).first()
        if not user or not user.passkeys:
            raise HTTPException(404, "User not found.")

        allowed_credentials = []
        for cred in user.passkeys:
            allowed_credentials.append(
                PublicKeyCredentialDescriptor(cred.credential_id)
            )

        opts = generate_authentication_options(
            rp_id=settings.RP_ID,
            allow_credentials=allowed_credentials,
            user_verification=UserVerificationRequirement.PREFERRED,
        )
        redis_session.set(f"challange:login:{req.username}", options_to_json(opts), 300)

        return options_to_json(opts)
    except Exception:
        raise HTTPException(500, "Failed to generate login options.")


@router.post("/login/passkey/verification")
async def verify_passkey_login_option(
    req: PasskeyLoginVerifyRequest, session: SessionDep, redis_session: RedisSessionDep
):
    try:
        user = session.exec(select(UserDb).where(UserDb.email == req.username)).first()
        if not user or not user.passkeys:
            raise HTTPException(404, "User not found.")

        saved_options_json = str(redis_session.get(f"challange:login:{req.username}"))
        saved_options = parse_authentication_options_json(saved_options_json)

        cred_id = req.credential_json.get("id")
        targeted_cred = None

        for pk in user.passkeys:
            if pk.credential_id.decode() == cred_id:
                targeted_cred = pk
                break

        if not targeted_cred:
            raise HTTPException(400, "Cannot find available passkeys.")

        verification = verify_authentication_response(
            credential=req.credential_json,
            expected_challenge=saved_options.challenge,
            expected_origin="",
            expected_rp_id=settings.RP_ID,
            credential_public_key=targeted_cred.public_key,
            credential_current_sign_count=targeted_cred.sign_count,
        )

        targeted_cred.sign_count = verification.new_sign_count
        session.add(user)
        session.commit()
        session.refresh(user)

        api_token = create_access_token(user.uuid, timedelta(minutes=5))
        refresh_token = create_refresh_token(user.uuid, timedelta(days=7))
        return AccessToken(access_token=api_token, refresh_token=refresh_token)
    except Exception:
        raise HTTPException(500)


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
