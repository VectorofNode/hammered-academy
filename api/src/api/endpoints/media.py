from io import BytesIO

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from api.services.s3 import S3Deps


router = APIRouter(prefix="/media", tags=["Media"])


@router.get("/image/{uuid}")
async def get_image_by_uuid(s3: S3Deps, uuid: str):
    if not s3.exists(f"s3://hammered-academy-image/{uuid}"):
        raise HTTPException(404, "file not found")

    with s3.open(f"s3://hammered-academy-image/{uuid}") as f:
        content = f.read()
        if isinstance(content, bytes):
            byte_io = BytesIO(content)
            byte_io.seek(0)
            return StreamingResponse(byte_io, media_type="image/*")
        else:
            raise HTTPException(500, "content type error")
