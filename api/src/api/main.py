from fastapi import FastAPI

from api.endpoints import courses


app = FastAPI()
courses_router = courses.router

app.include_router(courses_router)
