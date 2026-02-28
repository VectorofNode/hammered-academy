from uuid import UUID, uuid4

from pydantic import BaseModel
from sqlmodel import Field, Relationship, SQLModel
from typing import TYPE_CHECKING, List

from models.section import SectionCreate, SectionRead

if TYPE_CHECKING:
    from .section import SectionDb


class CourseBase(SQLModel):
    uuid: UUID = Field(index=True, unique=True, default_factory=uuid4)
    title: str
    description: str
    image: str


class CourseDb(CourseBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    sections: List["SectionDb"] = Relationship(back_populates="course")


class CourseRead(CourseBase):
    sections: List[SectionRead] = []


class CourseCreate(BaseModel):
    title: str
    description: str
    image: str


class CourseCreateWithSections(CourseCreate):
    sections: List[SectionCreate] = []
