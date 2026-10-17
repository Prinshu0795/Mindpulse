from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
from analyzer import analyze_user_data
from report_generator import generate_pdf_report

app = FastAPI(title="MindPulse Analytics")

class AnalyticsRequest(BaseModel):
    userId: str
    legacyAssessments: List[Dict[str, Any]]
    mentalAssessments: List[Dict[str, Any]]
    checkins: List[Dict[str, Any]]

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/internal/analyze")
def analyze_data(request: AnalyticsRequest):
    try:
        results = analyze_user_data(
            request.legacyAssessments,
            request.mentalAssessments,
            request.checkins
        )
        return results
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/internal/generate-report")
def generate_report(request: AnalyticsRequest):
    try:
        # First analyze data
        results = analyze_user_data(
            request.legacyAssessments,
            request.mentalAssessments,
            request.checkins
        )
        
        # Generate PDF
        pdf_buffer = generate_pdf_report(request.userId, results)
        
        return StreamingResponse(
            pdf_buffer, 
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=MindPulse_Analytics_{request.userId}.pdf"}
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

