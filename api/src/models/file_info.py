from typing import Literal, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class FileInfoDb(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    uuid: UUID = Field(default_factory=uuid4, index=True)
    file_name: str
    file_path: str
    file_type: str
    owner_id: int = Field(foreign_key="userdb.id")


class FileUploadReturn(BaseModel):
    uuid: UUID
