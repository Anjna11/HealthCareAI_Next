from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient

app = FastAPI()

origins = ["http://localhost:3001", "http://127.0.0.1:3000"]

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