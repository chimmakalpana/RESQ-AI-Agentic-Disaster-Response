import os
import json
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger("resq_llm")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("AI_API_KEY", "")

def call_llm(prompt: str, system_instruction: str, expected_json: bool = True) -> Optional[Dict[str, Any]]:
    """
    Calls the configured LLM using Gemini API if key is available.
    Returns parsed JSON dict or None on error/missing key to trigger deterministic fallback.
    """
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("AI_API_KEY", "")
    if not api_key or api_key == "MY_GEMINI_API_KEY" or api_key.strip() == "":
        logger.info("No valid Gemini API key found, using deterministic fallback agent logic.")
        return None

    try:
        import urllib.request
        import urllib.error

        models = ["gemini-3.1-flash-lite", "gemini-3.8-flash"]
        for model in models:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                
                payload = {
                    "contents": [
                        {
                            "role": "user",
                            "parts": [{"text": prompt}]
                        }
                    ],
                    "systemInstruction": {
                        "parts": [{"text": system_instruction}]
                    },
                    "generationConfig": {
                        "temperature": 0.2,
                        "responseMimeType": "application/json" if expected_json else "text/plain"
                    }
                }

                data = json.dumps(payload).encode("utf-8")
                req = urllib.request.Request(
                    url,
                    data=data,
                    headers={"Content-Type": "application/json"}
                )

                with urllib.request.urlopen(req, timeout=15) as response:
                    result = json.loads(response.read().decode("utf-8"))
                    candidate = result.get("candidates", [{}])[0]
                    text = candidate.get("content", {}).get("parts", [{}])[0].get("text", "")
                    if expected_json:
                        clean_text = text.strip()
                        if clean_text.startswith("```json"):
                            clean_text = clean_text[7:]
                        if clean_text.endswith("```"):
                            clean_text = clean_text[:-3]
                        return json.loads(clean_text.strip())
                    return {"text": text}
            except Exception as model_err:
                logger.warning(f"Model {model} failed: {model_err}")
                continue
    except Exception as e:
        logger.warning(f"LLM call failed: {e}. Falling back to deterministic agent model.")
        return None
