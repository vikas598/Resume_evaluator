from groq import Groq
from config import settings
import time
from pathlib import Path

from services.text_extractor import file_extractor
from services.jd_parser import get_jd
from services.resume_parser import resume_parser
from services.match_result import score_generator
from app.database import Base, engine
from app import models

Base.metadata.create_all(bind=engine)


API_KEY = settings.GROQ_API_KEY
MODEL = "llama-3.3-70b-versatile"

if not API_KEY:
    raise ValueError("API key not found")

client = Groq(api_key=API_KEY)


def main():

    all_results = []

    # -------------------------------
    # Read Job Description
    # -------------------------------

    jd_folder = Path("Job_description")
    raw_jd = None

    for file_path in jd_folder.iterdir():

        if not file_path.is_file():
            continue

        if file_path.suffix.lower() == ".txt":
            with open(file_path, "r", encoding="utf-8") as file:
                raw_jd = file.read()
        else:
            raw_jd = file_extractor(file_path)

        # Assume only one JD
        break

    if raw_jd is None:
        raise FileNotFoundError("No Job Description found.")

    jd = get_jd(raw_jd)

    # -------------------------------
    # Process Resumes
    # -------------------------------

    resume_folder = Path("resumes")

    for file_path in resume_folder.iterdir():

        if not file_path.is_file():
            continue

        raw_resume = file_extractor(file_path)

        resume = resume_parser(raw_resume)

        time.sleep(5)

        result = score_generator(jd, resume)

        time.sleep(5)

        print(f"{resume.name}: {result.score}%")

        all_results.append(
            {
                "name": resume.name or file_path.stem,
                "score": result.score,
                "detail": result.detail,
            }
        )

    if not all_results:
        print("No resumes found.")
        return

    # -------------------------------
    # Sort Candidates
    # -------------------------------

    all_results.sort(
        key=lambda candidate: candidate["score"],
        reverse=True,
    )

    top_candidate = all_results[0]
    lowest_candidate = all_results[-1]

    # -------------------------------
    # Display Results
    # -------------------------------

    print("\n" + "=" * 60)
    print("TOP CANDIDATE")
    print("=" * 60)
    print(f"Name : {top_candidate['name']}")
    print(f"Score: {top_candidate['score']}%")
    print("Details:")
    print(top_candidate["detail"])

    print("\n" + "=" * 60)
    print("LOWEST CANDIDATE")
    print("=" * 60)
    print(f"Name : {lowest_candidate['name']}")
    print(f"Score: {lowest_candidate['score']}%")
    print("Details:")
    print(lowest_candidate["detail"])

    print("\n" + "=" * 60)
    print("ALL CANDIDATES")
    print("=" * 60)

    for i, candidate in enumerate(all_results, start=1):
        print(f"{i}. {candidate['name']} - {candidate['score']}%")


if __name__ == "__main__":
    main()