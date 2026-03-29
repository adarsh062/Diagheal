from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

# CORS (frontend connect)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & scaler
model = joblib.load("models/model.pkl")
scaler = joblib.load("models/scaler.pkl")

# Input schema
class PatientData(BaseModel):
    Age: int
    Gender: str
    TB: float
    DB: float
    Alkphos: float
    Sgpt: float
    Sgot: float
    TP: float
    ALB: float
    AG_Ratio: float

@app.get("/")
def home():
    return {"message": "DiagHeal API running"}

@app.post("/analyze-report")
def analyze_report(data: PatientData):

    gender_val = 1 if data.Gender.lower() == "male" else 0

    # Feature engineering (same as training)
    tb_db = data.DB / (data.TB + 1e-6)
    sgot_sgpt = data.Sgot / (data.Sgpt + 1e-6)
    tb_alb = data.TB / (data.ALB + 1e-6)

    features = np.array([[ 
        data.Age, gender_val, data.TB, data.DB, data.Alkphos,
        data.Sgpt, data.Sgot, data.TP, data.ALB, data.AG_Ratio,
        tb_db, sgot_sgpt, tb_alb
    ]])

    scaled_input = scaler.transform(features)
    prob = model.predict_proba(scaled_input)[0][1]

    prediction = 1 if prob >= 0.3 else 0

    return {
        "prediction": int(prediction),
        "confidence_score": round(float(prob) * 100, 2),
        "message": "High Risk: Please consult a doctor." if prediction else "Low Risk: Liver parameters are stable."
    }