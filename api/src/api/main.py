from contextlib import asynccontextmanager

from fastapi import FastAPI

from api.endpoints import courses
from api.services.postgres import create_db_and_tables


@asynccontextmanager
async def lifespam(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespam)
courses_router = courses.router

app.include_router(courses_router)
