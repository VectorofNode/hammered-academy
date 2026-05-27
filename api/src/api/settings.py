from typing import Optional

from pydantic import Field, PostgresDsn
from pydantic_settings import BaseSettings, SettingsConfigDict


class PostgresSettings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="POSTGRES_", env_file=".env")

    HOST: str = "localhost"
    PORT: str = "5432"
    USER: str = "postgres"
    PASS: str = Field("")
    DB: str = "postgres"


class S3Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="S3_", env_file="../../.env")

    ENDPOINT: str = ""
    ACCESS_KEY: str = ""
    SECRECT_KEY: str = ""

    IMAGE_BUCKET: str = "hammered-academy-image"


class Settings(BaseSettings):
    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: str = "5432"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASS: str = Field("")
    POSTGRES_DB: str = "postgres"

    S3_ENDPOINT: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRECT_KEY: str = ""

    S3_IMAGE_BUCKET: str = "hammered-academy-image"

    GOOGLE_API_CLIENT_ID: str

    RP_ID: str
    RP_NAME: str

    REDIS_HOST: str
    REDIS_PORT: int
    REDIS_USER: Optional[str]
    REDIS_PASS: Optional[str]

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
