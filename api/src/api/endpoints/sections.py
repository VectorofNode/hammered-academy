from typing import List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from api.services.postgres import SessionDep
from models import (
    SectionBase,
    SectionCreate,
    SectionCreateBatch,
    SectionDb,
    SectionRead,
    CourseDb,
)


router = APIRouter(prefix="/sections", tags=["Sections"])


@router.post("", response_model=SectionBase)
async def create_section(section: SectionCreate, session: SessionDep):
    db_course = session.exec(
        select(CourseDb).where(CourseDb.uuid == section.course_uuid)
    ).first()
    if not db_course:
        raise HTTPException(404, "Course not found.")

    db_section = SectionDb.model_validate(section)
    session.add(db_section)
    session.commit()
    session.refresh(db_section)
    return db_section


@router.post("/batch", response_model=List[SectionRead])
async def create_section_batch(data: SectionCreateBatch, session: SessionDep):
    db_course = session.exec(
        select(CourseDb).where(CourseDb.uuid == data.course_uuid)
    ).first()
    if not db_course:
        raise HTTPException(404, "Course not found.")

    db_sections = []
    for s_data in data.sections:
        new_section = SectionDb.model_validate(s_data)
        new_section.course_uuid = data.course_uuid
        session.add(new_section)
        db_sections.append(new_section)

    session.commit()

    for s in db_sections:
        session.refresh(s)

    return db_sections
