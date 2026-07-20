from app.llm import client,MODEL
from app.schemas.schema import Result
import json

def score_generator(jobd, resume):
    match_schema= Result.model_json_schema()
    prompt = f"""
    You are an experienced HR recruiter and ATS resume evaluator.

Compare the candidate's resume with the provided job description objectively.

Base every conclusion ONLY on the information present in the resume and the job description. Never assume or invent skills, experience, projects, certifications, or education.

Infer a skill only when it is directly demonstrated by a project or work experience.

Examples:
- "Built REST APIs using FastAPI" → infer: Python, FastAPI, REST API
- Do NOT infer: Docker, Kubernetes, AWS, Azure unless explicitly mentioned.

--------------------------------
SCORING RULES
--------------------------------

1. Required Skills (45 points)

Required Skill Score =
(Matched Required Skills / Total Required Skills) × 45

2. Preferred Skills (15 points)

Preferred Skill Score =
(Matched Preferred Skills / Total Preferred Skills) × 15

3. Experience (20 points)

- Meets or exceeds requirement → 20
- Within approximately 1 year → 15
- Relevant internships/projects only → 10
- Some unrelated experience → 5
- No relevant experience → 0

If no minimum experience is specified in the JD, award the full 20 points.

4. Projects (15 points)

Evaluate project relevance against:
- Job role
- Responsibilities
- Required skills

Scoring:
- Highly relevant → 15
- Mostly relevant → 10
- Somewhat relevant → 5
- Unrelated → 0

5. Certifications (5 points)

Scoring:
- Highly relevant → 5
- Somewhat relevant → 3
- None or unrelated → 0

--------------------------------
ATS VALIDATION
--------------------------------

Identify important technical ATS keywords from:
- role
- responsibility
- required_skills
- preferred_skills

Use ATS keyword matching only to validate the above scores.
Do not score ATS keywords separately or double-count skills already evaluated.

--------------------------------
FINAL SCORE
--------------------------------

Final Score =
Required Skills
+ Preferred Skills
+ Experience
+ Projects
+ Certifications

Round the final score to the nearest integer.

The final score must always be an integer between 0 and 100.

--------------------------------
VERDICT RULES
--------------------------------

If the score is 70 or above:
- Write a concise professional verdict summarizing the candidate's strengths.

If the score is below 70:
- Write a concise professional verdict.
- Then briefly explain the top 3–5 areas that should be improved to become a stronger match.
- Focus only on missing required skills, missing preferred skills, relevant project experience, certifications, ATS keyword alignment, or experience gaps.
- Do not recommend adding experience or skills the candidate does not actually possess.
- Suggest highlighting existing relevant work or projects when appropriate.
- Keep the verdict under 120 words.

The "final_verdict" field is REQUIRED.

It must always contain a non-empty string.

Never leave it blank or null.

Examples:
- "Excellent Match. The candidate meets nearly all technical requirements."
- "Moderate Match. Missing Docker and AWS experience."
- "Weak Match. The candidate lacks several required skills and relevant experience."
--------------------------------
INPUT
--------------------------------

JOB DESCRIPTION:
{jobd.model_dump_json(indent=2)}

CANDIDATE RESUME:
{resume.model_dump_json(indent=2)}

--------------------------------
OUTPUT
--------------------------------

Return ONLY valid JSON matching this schema:

{match_schema}

Include:
1. Candidate name
2. Matching skills
3. Missing important skills
4. Whether the experience requirement is met
5. Overall match percentage (0–100)
6. A concise professional final_verdict. If the score is below 70, include the most important improvement suggestions within the verdict.

Do not explain your calculations.
Do not output any text outside the JSON.
    """
    message={
        "role": "user",
        "content" : prompt
    }
    messages=[message]
    response_format={
        "type": "json_object"
    }
    response = client.chat.completions.create(model=MODEL, messages=messages, response_format=response_format)
    data = json.loads(response.choices[0].message.content)
    return Result(**data)