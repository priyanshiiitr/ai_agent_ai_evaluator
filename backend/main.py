from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.evaluation_models import EvaluationRequest, EvaluationResponse
from services.evaluation_service import EvaluationService

app = FastAPI(
    title="Summary Evaluation API",
    description="An API to evaluate student summaries against lecture transcripts using an LLM.",
    version="1.0.0"
)

# Configure CORS
origins = [
    "http://localhost:3000", # React default dev port
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

evaluation_service = EvaluationService()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Summary Evaluation API"}

@app.post("/evaluate", response_model=EvaluationResponse)
async def evaluate_summary(request: EvaluationRequest):
    """
    Accepts a lecture transcript, a student summary, and evaluation parameters.
    Returns a score and an explanation for the summary's quality.
    """
    try:
        result = await evaluation_service.evaluate(
            transcript=request.transcript,
            summary=request.summary,
            params=request.params
        )
        return result
    except Exception as e:
        # In a real app, you'd have more specific error handling and logging
        raise HTTPException(status_code=500, detail=str(e))
