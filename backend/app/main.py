import json
from pathlib import Path
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .schemas.emergency import EmergencyReportRequest, EmergencyPlanResponse
from .agents.orchestrator import run_orchestrator

app = FastAPI(
    title="RESQ-AI Emergency Response API",
    description="Agentic AI Emergency Response & Disaster Coordination System Backend",
    version="1.0.0"
)

# Enable CORS for React Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "resources.json"

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "RESQ-AI Backend",
        "version": "1.0.0",
        "agents": [
            "Disaster Detection Agent",
            "Situation Analysis Agent",
            "Resource Coordination Agent",
            "Evacuation Agent",
            "Communication Agent",
            "Commander / Orchestrator"
        ]
    }

@app.get("/api/resources")
def get_resources():
    try:
        with open(DATA_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return {"resources": data, "count": len(data), "is_demo": True}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load emergency resource catalog: {str(e)}"
        )

@app.post("/api/emergency/analyze", response_model=EmergencyPlanResponse)
def analyze_emergency(report: EmergencyReportRequest):
    try:
        report_dict = report.model_dump()
        result = run_orchestrator(report_dict)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Agent workflow error: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
