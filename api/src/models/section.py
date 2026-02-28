from typing import TYPE_CHECKING, List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel

from models.lesson import LessonRead, LessonDb

if TYPE_CHECKING:
    from .course import CourseDb


class SectionBase(SQLModel):
    uuid: UUID = Field(index=True, unique=True, default_factory=uuid4)
    title: str
    order: int


class SectionDb(SectionBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    course_uuid: Optional[UUID] = Field(default=None, foreign_key="coursedb.uuid")
    course: "CourseDb" = Relationship(back_populates="sections")
    lessons: List[LessonDb] = Relationship(back_populates="section")


class SectionRead(SectionBase):
    lessons: List[LessonRead] = []


class SectionCreate(BaseModel):
    title: str
    order: int
    course_uuid: UUID


class SectionCreateBatch(BaseModel):
    course_uuid: UUID
    sections: List[SectionCreate]
