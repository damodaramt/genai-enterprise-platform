import os
from dotenv import load_dotenv
from openai import OpenAI

# =========================
# LOAD ENV
# =========================
load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set in environment")

# =========================
# CREATE CLIENT (singleton)
# =========================
client = OpenAI(api_key=OPENAI_API_KEY)


# =========================
# LLM FUNCTION
# =========================
def generate_response(query: str) -> str:
    try:
        # ✅ Input validation
        if not query or not query.strip():
            return "Please enter a valid message."

        # ✅ OpenAI v2 API
        response = client.responses.create(
            model="gpt-4o-mini",
            input=query.strip(),
        )

        # ✅ Safe extraction (important)
        if not response.output:
            return "No response from AI."

        content_blocks = response.output[0].content

        if not content_blocks:
            return "Empty AI response."

        text = content_blocks[0].text

        return text.strip()

    except Exception as e:
        # 🔴 DEBUG (visible in terminal)
        print("LLM ERROR:", str(e))

        # 🔴 TEMP expose error (remove later)
        return f"LLM ERROR: {str(e)}"
