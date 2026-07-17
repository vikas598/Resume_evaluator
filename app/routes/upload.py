from fastapi import APIRouter, UploadFile, File

from app.schemas import upload_schema
from app.services.evaluation_service import (upload_jd_service, upload_resume_service,)

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/jd", response_model=upload_schema.JDOut)
async def upload_jd(file: UploadFile = File(...)):
    return upload_jd_service(file)


@router.post("/resume")
async def upload_resume(files: list[UploadFile] = File(...)):
    return upload_resume_service(files)