from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.services.s3 import check_and_create_buckets
from models.passkey import UserPasskey

from .endpoints import (
    courses_router,
    sections_router,
    lessons_router,
    media_router,
    auth_router,
)
from api.services.postgres import create_db_and_tables
from models import CourseDb, SectionDb, LessonDb

CourseDb.model_rebuild()
SectionDb.model_rebuild()
LessonDb.model_rebuild()
UserPasskey.model_rebuild()


@asynccontextmanager
async def lifespam(app: FastAPI):
    create_db_and_tables()
    check_and_create_buckets()
    yield


app = FastAPI(lifespan=lifespam)

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(courses_router)
app.include_router(sections_router)
app.include_router(lessons_router)
app.include_router(media_router)
app.include_router(auth_router)
