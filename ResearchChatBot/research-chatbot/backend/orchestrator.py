# # orchestrator.py

# import requests
# import os
# from dotenv import load_dotenv

# # ✅ Load environment variables from .env
# load_dotenv()

# OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
# MODEL_NAME = os.getenv("MODEL_NAME")

# def generate_answer(prompt: str):
#     headers = {
#         "Authorization": f"Bearer {OPENROUTER_API_KEY}",
#         "Content-Type": "application/json"
#     }
#     payload = {
#         "model": MODEL_NAME,
#         "messages": [{"role": "user", "content": prompt}]
#     }

#     try:
#         response = requests.post(
#             "https://openrouter.ai/api/v1/chat/completions",
#             json=payload,
#             headers=headers,
#             timeout=30
#         )
#         response.raise_for_status()
#         data = response.json()

#         return data["choices"][0]["message"]["content"]

#     except requests.exceptions.RequestException as e:
#         return f"Request error: {str(e)}"

#     except (KeyError, IndexError) as e:
#         return f"Unexpected response format: {str(e)}"
# orchestrator.py

import requests
import os
from dotenv import load_dotenv

# ✅ Load environment variables from .env
load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME")

def generate_answer(prompt: str):
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": MODEL_NAME,
        "messages": [{"role": "user", "content": prompt}]
    }

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            json=payload,
            headers=headers,
            timeout=30
        )
        response.raise_for_status()
        data = response.json()

        return data["choices"][0]["message"]["content"]

    except requests.exceptions.RequestException as e:
        return f"Request error: {str(e)}"

    except (KeyError, IndexError) as e:
        return f"Unexpected response format: {str(e)}"
