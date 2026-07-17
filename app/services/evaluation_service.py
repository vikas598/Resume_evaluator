import time

from fastapi import UploadFile, HTTPException

from app.services.text_extractor import file_extractor
from app.services.jd_parser import get_jd
from app.services.resume_parser import resume_parser
from app.services.match_result import score_generator


CURRENT_JD = None


def upload_jd_service(file: UploadFile):
    global CURRENT_JD

    raw_jd = file_extractor(file)

    if not raw_jd:
        raise HTTPException(status_code=400, detail="Failed to extract text from the Job Description.")
    CURRENT_JD = get_jd(raw_jd)
    return {
        "filename": file.filename,
        "message": "Job Description uploaded successfully."
    }

def upload_resume_service(files: list[UploadFile]):
    global CURRENT_JD
    if CURRENT_JD is None:
        raise HTTPException(status_code=400, detail="Please upload a Job Description first.")

    all_results = []
    for file in files:
        raw_resume = file_extractor(file)
        if not raw_resume:
            continue
        resume = resume_parser(raw_resume)
        result = score_generator(CURRENT_JD, resume)
        all_results.append(
            {
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