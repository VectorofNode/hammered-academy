from typing import List

from fastapi import APIRouter, HTTPException
from sqlmodel import select

from api.services.postgres import SessionDep
from models import LessonCreate, LessonCreateBatch, LessonDb, LessonRead, SectionDb


router = APIRouter(prefix="/lessons", tags=["Lessons"])


@router.post("", response_model=LessonRead)
async def create_lesson(lesson: LessonCreate, session: SessionDep):
    section_uuid = lesson.section_uuid
    if not section_uuid:
        raise HTTPException(400, "")
    db_section = session.exec(
        select(SectionDb).where(SectionDb.uuid == section_uuid)
    ).first()

    if not db_section:
        raise HTTPException(404, "Section not found.")

    db_lesson = LessonDb.model_validate(lesson)
    session.add(db_lesson)
    session.commit()
    session.refresh(db_lesson)

    return db_lesson


@router.post("/batch", response_model=List[LessonRead])
async def create_lesson_batch(data: LessonCreateBatch, session: SessionDep):
    db_section = session.exec(
        select(SectionDb).where(SectionDb.uuid == data.section_uuid)
    ).first()
    if not db_section:
        raise HTTPException(404, "Section not found.")

    db_lessons = []
    for lesson_data in data.lessons:
        new_lesson = LessonDb.model_validate(lesson_data)
        new_lesson.section_uuid = data.section_uuid
        session.add(new_lesson)
        db_lessons.append(new_lesson)

    session.commit()

    for lesson in db_lessons:
        session.refresh(lesson)

    return db_lessons
