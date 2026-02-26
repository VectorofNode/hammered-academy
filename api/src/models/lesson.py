from typing import List, Optional
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel

from models.section import SectionDb


class LessonBase(SQLModel):
    uuid: UUID = Field(default_factory=uuid4, index=True)
    title: str
    content_type: str
    order: int


class LessonDb(LessonBase, table=True):
    id: Optional[int] = Field(primary_key=True)
    section_uuid: UUID = Field(foreign_key="section.uuid")
    sections: List[SectionDb] = Relationship(back_populates="lessons")


class LessonRead(LessonBase):
    content_url: Optional[str] = None
