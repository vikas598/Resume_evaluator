from app.main import client,MODEL
from app.models import Jd
import json

def get_jd(jd_text: str) -> Jd:
    schema = Jd.model_json_schema()

    system_prompt = f"""
You are an expert HR assistant specializing in analyzing job descriptions.

Your task is to extract all relevant information from the job description according to the provided schema.

Schema:
{json.dumps(schema, indent=2)}

Rules:
- Extract only explicitly stated information.
- Do not invent or assume any information.
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
            "content": jd_text
        }
    ]

    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        response_format={"type": "json_object"}
    )

    data = json.loads(response.choices[0].message.content)

    return Jd(**data)
