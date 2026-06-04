from typing import TYPE_CHECKING, Any, Dict, Optional

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from models.user import UserDb


class UserPasskey(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True, index=True)
    user_id: int = Field(foreign_key="userdb.id", ondelete="CASCADE")

    credential_id: bytes = Field(unique=True, index=True)
    public_key: bytes
    sign_count: int = Field(default=0)

    device_name: Optional[str] = Field(default=None)
    user: "UserDb" = Relationship(back_populates="passkeys")


class PasskeyRegisterVerifyResponse(BaseModel):
    username: str
    credential_json: Dict[str, Any]
    device_name: str


class PasskeyLoginGrantOptionInfo(BaseModel):
    username: Optional[str]


class PasskeyLoginGrantOptionResponse(BaseModel):
    login_challange: str
    opts: Dict[str, Any]


class PasskeyLoginVerifyRequest(BaseModel):
    credential_json: Dict[str, Any]
    login_challange: str


class PasskeyLoginVerifyHeader(BaseModel):
    login_challange: str
