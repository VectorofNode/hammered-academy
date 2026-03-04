from typing import Annotated
from fastapi import Depends
from s3fs import S3FileSystem


def get_s3_client():
    s3 = S3FileSystem(
        endpoint_url="http://localhost:5000", key="test", secret="test", token="test"
    )
    try:
        yield s3
    finally:
        pass


S3Deps = Annotated[S3FileSystem, Depends(get_s3_client)]
