from pydantic import BaseModel, Field
from typing import List

class EvaluationRequest(BaseModel):
    transcript: str = Field(..., min_length=1, example="The lecture covered the mitosis process...")
    summary: str = Field(..., min_length=1, example="Mitosis is a cell division process...")
    params: List[str] = Field(..., min_items=1, example=["Clarity", "Accuracy", "Conciseness"])

class EvaluationResponse(BaseModel):
    score: int = Field(..., ge=1, le=10, description="The evaluation score from 1 to 10.")
    explanation: str = Field(..., description="The textual explanation for the score.")
