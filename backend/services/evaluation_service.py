import os
import json
from openai import AsyncOpenAI
from dotenv import load_dotenv
from typing import List

from models.evaluation_models import EvaluationResponse

# It's good practice to load environment variables from a .env file for development
load_dotenv()

class EvaluationService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable not set.")
        self.client = AsyncOpenAI(api_key=self.api_key)

    def _construct_prompt(self, transcript: str, summary: str, params: List[str]) -> str:
        """
        Designs and engineers the core prompt for the LLM.
        """
        parameters_str = ", ".join(params)
        
        prompt = f"""
        **Role:** You are an expert AI teaching assistant specializing in evaluating student summaries of academic lectures.

        **Task:** Your task is to score a student's summary based on a provided lecture transcript. You must evaluate the summary against specific parameters and provide a single numerical score from 1 to 10, along with a concise explanation for your score.

        **Inputs:**
        1.  **Lecture Transcript:**
            """
            {transcript}
            """

        2.  **Student Summary:**
            """
            {summary}
            """

        3.  **Evaluation Parameters:** You must focus your evaluation on these key aspects: {parameters_str}

        **Instructions:**
        1.  Analyze the summary's performance on each of the provided **Evaluation Parameters**.
        2.  Consider how well the summary captures the key points, its clarity, and its accuracy in relation to the transcript.
        3.  Based on your holistic analysis, assign a single, overall integer score from 1 (very poor) to 10 (excellent).
        4.  Provide a brief explanation (2-4 sentences) justifying your score. Mention the summary's strengths and weaknesses with respect to the evaluation parameters.

        **Output Format:** You MUST respond ONLY with a valid JSON object in the following format. Do not include any other text, markdown, or explanations outside of this JSON structure.

        ```json
        {{
          "score": <an integer between 1 and 10>,
          "explanation": "<Your brief explanation here>"
        }}
        ```
        """
        return prompt

    async def evaluate(self, transcript: str, summary: str, params: List[str]) -> EvaluationResponse:
        """
        Sends the constructed prompt to the LLM and parses the response.
        """
        if not transcript or not summary or not params:
            raise ValueError("Transcript, summary, and parameters cannot be empty.")

        full_prompt = self._construct_prompt(transcript, summary, params)

        try:
            response = await self.client.chat.completions.create(
                model="gpt-3.5-turbo-1106", # Or another suitable model like gpt-4
                messages=[
                    {"role": "system", "content": "You are an expert evaluation assistant that only outputs JSON."},
                    {"role": "user", "content": full_prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.2,
            )
            
            content = response.choices[0].message.content
            if not content:
                raise ValueError("Received an empty response from the LLM.")

            # The model should return valid JSON, so we parse it directly.
            result_json = json.loads(content)
            
            return EvaluationResponse(**result_json)

        except json.JSONDecodeError:
            raise ValueError("Failed to decode JSON from LLM response.")
        except Exception as e:
            # Log the error in a real application
            print(f"An error occurred while communicating with the LLM: {e}")
            raise
