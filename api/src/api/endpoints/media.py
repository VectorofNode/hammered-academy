from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse

from api.services.postgres import SessionDep
from api.services.s3 import S3Deps, check_object_exists
from api.utils.jwt import UserDeps
from models.file_info import FileInfoDb, FileUploadReturn
from api.settings import settings


router = APIRouter(prefix="/media", tags=["Media"])


@router.get("/image/{uuid}")
async def get_image_by_uuid(s3: S3Deps, uuid: str):
    if not check_object_exists(s3, settings.S3_ENDPOINT, uuid):
        raise HTTPException(404, "file not found")

    with s3.get_object(settings.S3_ENDPOINT, uuid) as f:
        content = f.read()
        if isinstance(content, bytes):
            byte_io = BytesIO(content)
            byte_io.seek(0)
            return StreamingResponse(byte_io, media_type="image/*")
        else:
            raise HTTPException(500, "content type error")


@router.post("/image")
async def upload_image(
    session: SessionDep,
    s3: S3Deps,
    current_user: UserDeps,
    file: UploadFile = File(...),
):
    filename = file.filename
    if not filename:
        raise HTTPException(400, "File name cannot be empty")

    file_extension = Path(filename).suffix
    file_uuid = uuid4()
    file_name = f"{file_uuid}{file_extension}"
    content = await file.read()
    s3.put_object(settings.S3_ENDPOINT, str(file_uuid), BytesIO(content), len(content))

    user_id = current_user.id
    if not user_id:
        raise HTTPException(400, "Invalid user")

    file_db = FileInfoDb(
        uuid=file_uuid,
        file_name=file_name,
        file_path=f"s3://{settings.S3_ENDPOINT}/{file_name}",
        file_type="image",
        owner_id=user_id,
    )
    session.add(file_db)
    session.commit()

    return FileUploadReturn(uuid=file_uuid)
