from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
with open("models/ilpd_model.pkl", "rb") as f:
    model, scaler, custom_threshold = pickle.load(f)

# Override the threshold value to 0.7 as requested
custom_threshold = 0.80

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
    return {"message": "DiagHeal API v2 (Pipeline) running"}

@app.post("/analyze-report")
def analyze_report(data: PatientData):
    try:
        gender_encoded = 1 if data.Gender.lower() == 'male' else 0

        TB_DB_ratio = data.TB / data.DB if data.DB != 0 else 0
        SGOT_SGPT_ratio = data.Sgot / data.Sgpt if data.Sgpt != 0 else 0
        TB_Alb_ratio = data.TB / data.ALB if data.ALB != 0 else 0
        DB_Alb_ratio = data.DB / data.ALB if data.ALB != 0 else 0

        sample = np.array([[
            data.Age,
            gender_encoded,
            data.TB,
            data.DB,
            data.Alkphos,
            data.Sgpt,
            data.Sgot,
            data.TP,
            data.ALB,
            data.AG_Ratio,
            TB_DB_ratio,
            SGOT_SGPT_ratio,
            TB_Alb_ratio,
            DB_Alb_ratio
        ]])

        sample_scaled = scaler.transform(sample)

        prob = model.predict_proba(sample_scaled)[0][1]
        prediction = 1 if prob >= custom_threshold else 0

        return {
            "prediction": int(prediction),
            "confidence_score": round(float(prob) * 100, 2),
            "threshold_used": custom_threshold,
            "message": "High Risk: Please consult a doctor." if prediction else "Low Risk: Liver parameters are stable."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))