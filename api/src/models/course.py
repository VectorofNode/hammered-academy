from sqlmodel import Field, SQLModel


class Course(SQLModel):
    uuid: str = Field(index=True, unique=True)
    title: str
    description: str
    image: str


class CourseDb(Course, table=True):
    id: int | None = Field(default=None, primary_key=True)
