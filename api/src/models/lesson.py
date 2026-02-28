from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .section import SectionDb


class LessonBase(SQLModel):
    uuid: UUID = Field(default_factory=uuid4, index=True)
    title: str
    content_type: str
    order: int
    section_uuid: Optional[UUID] = None
    content_url: Optional[str] = None


class LessonDb(LessonBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    section_uuid: Optional[UUID] = Field(default=None, foreign_key="sectiondb.uuid")
    section: "SectionDb" = Relationship(back_populates="lessons")


class LessonRead(LessonBase):
    content_url: Optional[str] = None


class LessonCreate(BaseModel):
    title: str
    content_type: str
    order: int
    content_url: Optional[str] = None
    section_uuid: Optional[UUID] = None


class LessonCreateBatch(BaseModel):
    section_uuid: UUID
    lessons: List[LessonCreate]
