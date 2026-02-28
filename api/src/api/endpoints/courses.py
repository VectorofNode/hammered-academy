from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlmodel import select
from sqlalchemy.exc import IntegrityError

from api.services.postgres import SessionDep
from models import CourseBase, CourseCreate, CourseDb, CourseRead, Message


router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("", response_model=list[CourseBase])
async def get_all_courses(
    session: SessionDep, offset: int = 0, limit: Annotated[int, Query(le=100)] = 100
):
    courses = session.exec(select(CourseDb).offset(offset).limit(limit)).all()
    return courses


@router.get(
    "/{uuid}",
    response_model=CourseRead,
    responses={404: {"model": Message}},
)
async def get_course_by_uuid(uuid: str, session: SessionDep):
    course = session.exec(select(CourseDb).where(CourseDb.uuid == uuid)).first()
    if not course:
        raise HTTPException(404, f"The uuid: {uuid} is not found in the database.")
    return course


@router.post("", response_model=CourseBase)
async def create_new_course(course: CourseCreate, session: SessionDep):
    try:
        db_course = CourseDb.model_validate(course)
        session.add(db_course)
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(400, "Invalid uuid")
    session.refresh(db_course)
    return db_course


@router.delete(
    "/{uuid}",
    status_code=204,
    responses={status.HTTP_404_NOT_FOUND: {"model": Message}},
)
async def delete_course(uuid: str, session: SessionDep):
    course = session.exec(select(CourseDb).where(CourseDb.uuid == uuid)).first()
    if not course:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    session.delete(course)
    session.commit()
    return


@router.put(
    "/{uuid}",
    responses={
        status.HTTP_404_NOT_FOUND: {"model": Message},
        status.HTTP_400_BAD_REQUEST: {"model": Message},
    },
)
async def update_course(
    uuid: str, course: CourseBase, session: SessionDep
) -> CourseBase:
    course_db = session.exec(select(CourseDb).where(CourseDb.uuid == uuid)).first()
    if not course_db:
        raise HTTPException(status.HTTP_404_NOT_FOUND)
    if uuid != course.uuid:
        raise HTTPException(status.HTTP_400_BAD_REQUEST)
    course_db.sqlmodel_update(course)
    session.add(course_db)
    session.commit()
    session.refresh(course_db)
    return course
