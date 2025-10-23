from openai import OpenAI

from dotenv import load_dotenv
_ = load_dotenv("key.txt")

client = OpenAI()

def get_compilation(text: str):
    text_template = f"Extract name, age, and disease from this text: {text}"
    response = client.chat.completions.create(
        model='gpt-4.1-mini',
        messages=[{"role": "user", "content":text_template}],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "PatientInfo",
                "schema": {
                    "type": "object",
                    "properties": {
                        "name":{
                        "fname": {"type": "string"},
                        "lname": {"type": "string"},
                        },
                        "age": {"type": "integer"},
                    },
                    "required": ["name", "age", ]
                }
            }
        }
    )
    patient_info = response.choices[0].message.content
    return patient_info

