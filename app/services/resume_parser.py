from app.llm import client,MODEL
from app.schemas.schema import Resume
import json

def resume_parser(resume_text: str) -> Resume:
    schema = Resume.model_json_schema()

    system_prompt = f"""
You are an expert Resume Analyzer.

The user will provide a resume.

Extract all information according to the following schema.

Schema:
{json.dumps(schema, indent=2)}

Rules:
- Extract only information explicitly present in the resume.
- Do not invent or assume anything.
- If a scalar field is missing, return null.
- If a list field is missing, return an empty list ([]).
- Return ONLY valid JSON.
- Do not include markdown or explanations.
"""

    messages = [
        {
            "role": "system",
            "content": system_prompt
        },
        {
            "role": "user",
            "content": resume_text
        }
    ]

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        response_format={"type": "json_object"}
    )

    data = json.loads(response.choices[0].message.content)

    return Resume(**data)