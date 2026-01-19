from openai import OpenAI
import json
from dotenv import load_dotenv
_ = load_dotenv("key.txt")

client = OpenAI()

def get_compilation(text: str):
    prompt = f"""
        From this input: "{text}", extract the following as JSON:
        - reasoning: explain what the user is asking.
        - action: 'add_patient', 'update_patient', 'delete_patient' or 'add_appointment'.
        - pid: patient id (only if update or appointment)
        - name: include 'fname' and 'lname'
        - If only one name is given, use it as 'fname' and leave 'lname' empty
        - age: integer ONLY if clearly mentioned. Otherwise return null.
        - gender: "male", "female", "other" or "prefer_not_to_say". 
            Only set if clearly mentioned (e.g., male/female/he/she). 
            If not mentioned, return null. Do not guess from the name. 
        - appointment: string (only if action is 'add_appointment')
    """

    response = client.chat.completions.create(
    model='gpt-4.1-mini',
    messages=[{"role": "user", "content": prompt}],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "PatientAction",
            "schema": {
                "type": "object",
                "properties": {
                    "reasoning": {"type": "string"},
                    "action": {"type": "string"},
                    "pid": {"type": "string"},
                    "name": {
                        "type": "object",
                        "properties": {
                            "fname": {"type": "string"},
                            "lname": {"type": "string"}
                        },
                        "required": ["fname"]
                    },
                    "age": {"type": "integer"},
                    "gender": {"type": "string"},
                    "appointment": {
                        "type": "object",
                        "properties": {
                            "date": {"type": "string"},  
                            "type": {"type": "string"}   
                        }
                    }
                },
                "required": ["action", "name"]
            }
        }
    }
)

    return json.loads(response.choices[0].message.content)
