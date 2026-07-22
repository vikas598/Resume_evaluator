from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app import oauth2, models
from app.schemas import upload_schema
from app.services.evaluation_service import (upload_jd_service, upload_resume_service,)

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


@router.post("/jd", response_model=upload_schema.JDOut)
async def upload_jd(file: UploadFile = File(...), current_user: models.User= Depends(oauth2.get_current_user), db: Session = Depends(get_db)):
    try:
        return upload_jd_service(file, db, current_user)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/resume")
async def upload_resume(files: list[UploadFile] = File(...),  current_user: models.User = Depends(oauth2.get_current_user),db: Session = Depends(get_db)):
    try:
        return upload_resume_service(files, db, current_user)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))