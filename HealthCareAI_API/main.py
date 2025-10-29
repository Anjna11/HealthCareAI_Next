from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import json
from ai import get_compilation
from bson import ObjectId

app = FastAPI()

origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb+srv://doadmin:578032ZuyX9phjl6@db-mongodb-nyc3-95469-680cf585.mongo.ondigitalocean.com")
db = client["healthcare_db"]
users_collection = db["Users"]
patients_collection = db["Patients"]
appointments_collection = db["Appointment"]

@app.get("/")
def demo():
    return {"message": "Hello from FastAPI!"}

class LoginRequest(BaseModel):
    email: str
    password: str

  

@app.post("/login")
def login(user: LoginRequest):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user and existing_user["password"] == user.password:
        return {"success": True}
    return {"success": False} 

@app.get("/patients")
def get_patients():
    patients_cursor = patients_collection.find()
    patients_list = []

    for p in patients_cursor:
        patients_list.append({
            "id": str(p["_id"]),
            "fname": p["name"].get("fname"),
            "lname": p["name"].get("lname"),
            "age": p.get("age")
        })

    return{"patients": patients_list}

@app.get("/appointments")
def get_appointments():
    appointments_cursor = appointments_collection.find()
    appointments_list = []

    for a in appointments_cursor:
        patient = patients_collection.find_one({"_id": ObjectId(a["patient_id"])})
        
        appointments_list.append({
            "id": str(a["_id"]),
            "patient_id": a["patient_id"],
            "patient_name": f"{patient['name']['fname']} {patient['name']['lname']}" if patient else "Unknown",
            "date": a.get("date"),
            "type": a.get("type")
        })

    return {"appointments": appointments_list}


class Message(BaseModel):
    text: str 

def get_patient_id_from_number(num):
    patients = list(patients_collection.find())
    
    index = int(num) - 1  

    if index < 0 or index >= len(patients):
        return None
    
    return patients[index]["_id"]

@app.post("/message")
def message(msg: Message):
    try:
        patient_info = get_compilation(msg.text)
        print("patient_info=", patient_info)

        action = patient_info.get("action")
        pid = patient_info.get("pid")
        fname = patient_info.get("name", {}).get("fname")
        lname = patient_info.get("name", {}).get("lname", "")
        age = patient_info.get("age")
        appointment = patient_info.get("appointment")
        reasoning = patient_info.get("reasoning", "No reasoning provided.")

        # Default: if no recognizable action
        if not action or action == "none":
            return {
                "message": f"You said: {msg.text}",
                "reasoning": reasoning
            }

        # ---- ADD PATIENT ----
        if action == "add_patient":
            if not fname:
                return {"message": "First name is required.", "reasoning": reasoning}

            if age is None or age == "" or not isinstance(age, int):
                return {
                    "message": "❗ Age is required to add a patient. Please specify age.",
                    "reasoning": reasoning
                }

            new_patient = {
                "name": {"fname": fname, "lname": lname},
                "age": age
            }
            patients_collection.insert_one(new_patient)

            return {
                "message": "✅ Patient added successfully.",
                "patient": {"fname": fname, "lname": lname, "age": age},
                "reasoning": reasoning
            }

        # ---- UPDATE PATIENT ----
        if action == "update_patient":
            if not pid:
                return {"message": "Patient ID or number is required to update.", "reasoning": reasoning}

            try:
                real_id = ObjectId(pid)
            except:
                real_id = get_patient_id_from_number(pid)

            if not real_id:
                return {"message": "Invalid patient number or ID.", "reasoning": reasoning}

            update_data = {}
            if fname:
                update_data["name.fname"] = fname
            if lname:
                update_data["name.lname"] = lname
            if isinstance(age, int):
                update_data["age"] = age

            if not update_data:
                return {"message": "No valid update fields provided.", "reasoning": reasoning}

            result = patients_collection.update_one({"_id": real_id}, {"$set": update_data})

            if result.modified_count == 0:
                return {"message": "No changes made. Patient may not exist.", "reasoning": reasoning}

            return {"message": "✅ Patient updated successfully.", "reasoning": reasoning}

        # ---- DELETE PATIENT ----
        if action == "delete_patient":
            if pid:
                try:
                    real_id = ObjectId(pid)
                except:
                    real_id = get_patient_id_from_number(pid)
            else:
                return {"message": "Patient number or ID required.", "reasoning": reasoning}

            result = patients_collection.delete_one({"_id": real_id})

            if result.deleted_count == 1:
                return {"message": f"Patient {pid} deleted successfully.", "reasoning": reasoning}
            else:
                return {"message": f"No patient found with id {pid}.", "reasoning": reasoning}

        # ---- ADD APPOINTMENT ----
        if action == "add_appointment":
            if not appointment or not appointment.get("date") or not appointment.get("type"):
                return {"message": "Appointment must include date & type.", "reasoning": reasoning}

            pid = patient_info.get("pid")

            if pid:
                try:
                    patient_id = ObjectId(pid)
                except:
                    patient_id = get_patient_id_from_number(pid)

                if not patient_id:
                    return {"message": "Invalid patient number or ID.", "reasoning": reasoning}

                patient = patients_collection.find_one({"_id": patient_id})
                if not patient:
                    return {"message": "Patient not found.", "reasoning": reasoning}
            else:
                if not fname or age is None:
                    return {
                        "message": "To create a new patient for appointment, name and age are required.",
                        "reasoning": reasoning
                    }

                new_patient = {"name": {"fname": fname, "lname": lname}, "age": age}
                inserted = patients_collection.insert_one(new_patient)
                patient_id = inserted.inserted_id

            appointments_collection.insert_one({
                "patient_id": str(patient_id),
                "date": appointment["date"],
                "type": appointment["type"]
            })

            return {
                "message": "✅ Appointment added successfully.",
                "appointment": {
                    "patient_id": str(patient_id),
                    "date": appointment["date"],
                    "type": appointment["type"]
                },
                "reasoning": reasoning
            }

        # Default fallback
        return {"message": f"Unrecognized action: {action}", "reasoning": reasoning}

    except Exception as e:
        return {"error": str(e), "reasoning": "Error occurred during processing."}
