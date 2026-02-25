from pydantic import BaseModel


class Course(BaseModel):
    uuid: str
    title: str
    description: str
    image: str
