from fastapi import APIRouter

from models.course import Course


router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("/")
async def get_all_courses() -> list[Course]:
    return []


@router.post("/")
async def create_new_course(course: Course) -> Course:
    return course


@router.delete("/{uuid}", status_code=204)
async def delete_course(uuid: str):
    return


@router.put("/{uuid}")
async def update_course(uuid: str):
    return
