from contextlib import asynccontextmanager

from fastapi import FastAPI

from .endpoints import courses_router, sections_router, lessons_router
from api.services.postgres import create_db_and_tables
from models import CourseDb, SectionDb, LessonDb

CourseDb.model_rebuild()
SectionDb.model_rebuild()
LessonDb.model_rebuild()


@asynccontextmanager
async def lifespam(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespam)

app.include_router(courses_router)
app.include_router(sections_router)
app.include_router(lessons_router)
