from typing import Annotated
from fastapi import Depends
from minio import Minio, S3Error

from api.settings import S3Settings, settings

s3 = Minio(
    settings.S3_ENDPOINT,
    settings.S3_ACCESS_KEY,
    settings.S3_SECRECT_KEY,
    secure=False,
)


def check_and_create_buckets():
    if not s3.bucket_exists(settings.S3_IMAGE_BUCKET):
        s3.make_bucket(settings.S3_IMAGE_BUCKET)


def check_object_exists(mc: Minio, bucket_name: str, object_name: str):
    try:
        mc.stat_object(bucket_name, object_name)
    except S3Error as e:
        if e.code == "NoSuchKey":
            return False
        raise Exception(e)
    return True


def get_s3_client():
    try:
        yield s3
    finally:
        pass


S3Deps = Annotated[Minio, Depends(get_s3_client)]
