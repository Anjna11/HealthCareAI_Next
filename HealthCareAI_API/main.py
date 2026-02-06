from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
import json
from ai import get_compilation
from bson.objectid import ObjectId, InvalidId
from fastapi import HTTPException

app = FastAPI()

origins = ["http://localhost:3000", "http://127.0.0.1:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = MongoClient("mongodb://admin:admin123@localhost:27017/?authSource=admin")
db = client["Healthcare_db"]
users_collection = db["Users"]
patients_collection = db["PatientRecords"]
appointments_collection = db["Appointment"]
doctors_collection = db["Doctors"]

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
            "age": p.get("age"),
            "gender": p.get("gender")
        })

    return{"patients": patients_list}

@app.get("/appointments")
def get_appointments():
    appointments_list = []

    for a in appointments_collection.find():
        
        patient_id_str = a.get("patient_id")
        patient = None

        try:
            patient_obj_id = ObjectId(patient_id_str)
            patient = patients_collection.find_one({"_id": patient_obj_id})
        except (InvalidId, TypeError):
            patient = None 

        doctor_id_str = a.get("doctor_id")
        doctor = None

        try:
            doctor_obj_id = ObjectId(doctor_id_str)
            doctor = doctors_collection.find_one({"_id": doctor_obj_id})
        except (InvalidId, TypeError):
            doctor = None

        appointments_list.append({
            "id": str(a["_id"]),
            "patient_id": patient_id_str,
            "patient_name": f"{patient['name']['fname']} {patient['name']['lname']}" if patient else "Unknown",
            "date": a.get("date"),
            "type": a.get("type"),
            "age": patient.get("age") if patient else None,
            "gender": patient.get("gender") if patient else None,
            "doctor_name": doctor["name"] if doctor else "Unknown",
            "doctor_specialization": doctor["specialization"] if doctor else "Unknown"
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

conversation_state = {}
@app.post("/message")
def message(msg: Message):

    session_id = "default" 

    # ---- HANDLE DOCTOR SELECTION FIRST ----
    if session_id in conversation_state:
        if msg.text.isdigit():
            doctor_index = int(msg.text) - 1
            doctors = list(doctors_collection.find())
            if doctor_index < 0 or doctor_index >= len(doctors):
                return {
                    "message": "Invalid doctor number. Please select a valid number from the list.",
                    "reasoning": ""
                }

            doctor = doctors[doctor_index]
            appointment_data = conversation_state.pop(session_id)

            # Save appointment with selected doctor
            appointments_collection.insert_one({
                "patient_id": appointment_data["patient_id"],
                "doctor_id": str(doctor["_id"]),
                "date": appointment_data["date"],
                "type": appointment_data["type"]
            })

            return {
                "message": f"Appointment booked with {doctor['name']} on {appointment_data['date']} for {appointment_data['type']}.",
                "reasoning": "Appointment successfully created."
            }
        else:
            return {"message": "Please enter a valid doctor number from the list."}


    try:
        patient_info = get_compilation(msg.text)
        print("patient_info=", patient_info)

        action = patient_info.get("action")
        pid = patient_info.get("pid")
        fname = patient_info.get("name", {}).get("fname")
        lname = patient_info.get("name", {}).get("lname", "")
        age = patient_info.get("age")
        gender = patient_info.get("gender")
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
                    "message": "Age is required to add a patient. Please specify age.",
                    "reasoning": reasoning
                }

            new_patient = {
                "name": {"fname": fname, "lname": lname},
                "age": age,
                "gender": gender
            }
            patients_collection.insert_one(new_patient)

            return {
                "message": "Patient added successfully.",
                "patient": {"fname": fname, "lname": lname, "age": age, "gender": gender},
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

            return {"message": "Patient updated successfully.", "reasoning": reasoning}

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
            patient_id = None

            if pid:
                try:
                    patient_id = ObjectId(pid)
                except:
                    patient_id = get_patient_id_from_number(pid)

                if not patient_id:
                    return {"message": "Invalid patient number or ID.", "reasoning": reasoning}
            else:
                if not fname or age is None:
                    return {
                        "message": "To create a new patient for appointment, name and age are required.",
                        "reasoning": reasoning
                    }

                new_patient = {"name": {"fname": fname, "lname": lname}, "age": age}
                inserted = patients_collection.insert_one(new_patient)
                patient_id = inserted.inserted_id

            # Save partial appointment in conversation_state
            session_id = "default"
            conversation_state[session_id] = {
                "patient_id": str(patient_id),
                "date": appointment["date"],
                "type": appointment["type"]
            }

            # Return doctor list
            doctors = list(doctors_collection.find())
            if not doctors:
                return {"message": "No doctors found.", "reasoning": "Please try again later."}

            doctor_list_str = "\n".join([f"{i+1}. {doc['name']} ({doc['specialization']})" 
                                         for i, doc in enumerate(doctors)])
            return {
                "message": f"Please choose a doctor by number:\n{doctor_list_str}",
                "reasoning": "Select a doctor for your appointment."
            }

        # ---- HANDLE DOCTOR SELECTION ----
        if msg.text.isdigit():
            session_id = "default"
            if session_id in conversation_state:
                doctor_index = int(msg.text) - 1
                doctors = list(doctors_collection.find())
                if doctor_index < 0 or doctor_index >= len(doctors):
                    return {"message": "Invalid doctor number. Please select a valid number from the list.", 
                            "reasoning": ""}

                doctor = doctors[doctor_index]
                appointment_data = conversation_state.pop(session_id)

                # Save appointment with selected doctor
                appointments_collection.insert_one({
                    "patient_id": appointment_data["patient_id"],
                    "doctor_id": str(doctor["_id"]),
                    "date": appointment_data["date"],
                    "type": appointment_data["type"]
                })

                return {
                    "message": f"Appointment booked with {doctor['name']} on {appointment_data['date']} for {appointment_data['type']}.",
                    "reasoning": "Appointment successfully created."
                }


        # Default fallback
        return {"message": f"Unrecognized action: {action}", "reasoning": reasoning}

    except Exception as e:
        return {"error": str(e), "reasoning": "Error occurred during processing."}



@app.get("/get_allAppointments/{appointment_id}")
def get_allAppointments(appointment_id: str):
    try:
        app_obj_id = ObjectId(appointment_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid appointment ID")

    # Step 1: find the appointment to get the patient_id
    appointment = appointments_collection.find_one({"_id": app_obj_id})
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    patient_id = appointment.get("patient_id")
    if not patient_id:
        raise HTTPException(status_code=404, detail="Patient ID not found in appointment")

    # Step 2: fetch all appointments for that patient
    allAppointments_list = []
    for a in appointments_collection.find({"patient_id": patient_id}):
        allAppointments_list.append({
            "date": a.get("date"),
            "startTime": a.get("startTime"),
            "endTime": a.get("endTime"),
            "notes": a.get("notes"),
            "medication": a.get("medication"),
            "reports": a.get("reports")
        })

    return {"allAppointments_list": allAppointments_list}




