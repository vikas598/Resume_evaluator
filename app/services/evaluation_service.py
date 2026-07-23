import time
from uuid import uuid4

from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session

from app.services.text_extractor import file_extractor
from app.services.jd_parser import get_jd
from app.services.resume_parser import resume_parser
from app.services.match_result import score_generator
from app.models import User, Thread


def upload_jd_service(file: UploadFile, db:Session, current_user:User):

    raw_jd = file_extractor(file)

    if not raw_jd:
        raise HTTPException(status_code=400, detail="Failed to extract text from the Job Description.")
    parsed_jd = get_jd(raw_jd)
    thread= Thread(
        thread_id = str(uuid4()),
        user_id = current_user.id,
        parsed_jd = parsed_jd.model_dump()
    )
    db.add(thread)
    db.commit()
    db.refresh(thread)

    return {
        "thread_id":thread.thread_id,
        "filename": file.filename,
        "message": "Job Description uploaded successfully."
    }

def upload_resume_service(files: list[UploadFile], db:Session, current_user:User):
    thread = db.query(Thread).filter(Thread.user_id == current_user.id).order_by(Thread.created_at.desc()).first()
    if thread.parsed_jd is None:
        raise HTTPException(status_code=400, detail="Please upload a Job Description first.")

    all_results = []
    for file in files:
        raw_resume = file_extractor(file)
        if not raw_resume:
            continue
        resume = resume_parser(raw_resume)
        thread.parsed_resume = resume.model_dump()
        db.commit()
        db.refresh(thread)
        result = score_generator(thread.parsed_jd , resume)
        thread.result = result.model_dump()
        db.commit()
        db.refresh(thread)
        all_results.append(
            {   
                "thread_id": thread.thread_id,
                "name": resume.name or file.filename,
                "score": result.score,
                "detail": result.detail,
            }
        )
        # Prevent hitting the LLM rate limit
        time.sleep(5)

    if not all_results:
        raise HTTPException(status_code=400, detail="No valid resumes found.")

    all_results.sort(
        key=lambda candidate: candidate["score"],
        reverse=True,
    )

    return all_results