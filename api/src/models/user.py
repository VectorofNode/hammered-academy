from typing import Optional
from uuid import uuid4

from sqlmodel import UUID, Field, SQLModel


class UserBase(SQLModel):
    email: str = Field(unique=True, index=True, nullable=False)
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)


class UserDb(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uuid: UUID = Field(default_factory=uuid4, index=True, nullable=False)
    hashed_password: Optional[str] = Field(default=None)


class UserRead(UserBase):
    uuid: UUID
