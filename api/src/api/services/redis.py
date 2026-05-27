from typing import Annotated

from fastapi import Depends
from redis import Redis

from api.settings import settings


def get_session():
    with Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        decode_responses=True,
        username=settings.REDIS_USER,
        password=settings.REDIS_PASS,
    ) as session:
        yield session


RedisSessionDep = Annotated[Redis, Depends(get_session)]
