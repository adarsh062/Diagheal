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
with open("models/liver_model.pkl", "rb") as f:
    bundle = pickle.load(f)

pipe = bundle["pipeline"]
custom_threshold = bundle["threshold"]

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
        # 2. Convert Pydantic model to DataFrame
        # IMPORTANT: Ensure keys match the column names the pipeline was trained on
        input_df = pd.DataFrame([{
            'age': data.Age,
            'gender': data.Gender,
            'total_bilirubin': data.TB,
            'direct_bilirubin': data.DB,
            'alkaline_phosphotase': data.Alkphos,
            'alamine_aminotransferase': data.Sgpt,
            'aspartate_aminotransferase': data.Sgot,
            'total_protiens': data.TP,
            'albumin': data.ALB,
            'albumin_and_globulin_ratio': data.AG_Ratio
        }])

        # 3. Predict using the pipeline
        prob = pipe.predict_proba(input_df)[0][1]
        prediction = 1 if prob >= custom_threshold else 0

        return {
            "prediction": int(prediction),
            "confidence_score": round(float(prob) * 100, 2),
            "threshold_used": custom_threshold,
            "message": "High Risk: Please consult a doctor." if prediction else "Low Risk: Liver parameters are stable."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))