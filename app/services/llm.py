import os
import logging
from dotenv import load_dotenv
from openai import OpenAI

# =========================
# LOAD ENV
# =========================
load_dotenv()

logger = logging.getLogger(__name__)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# =========================
# CLIENT INIT (SAFE)
# =========================
client = None

if OPENAI_API_KEY:
    try:
        client = OpenAI(api_key=OPENAI_API_KEY)
    except Exception as e:
        logger.error(f"OpenAI init failed: {str(e)}")
else:
    logger.warning("OPENAI_API_KEY not set → fallback mode enabled")


# =========================
# LLM FUNCTION (PRODUCTION SAFE)
# =========================
def generate_response(query: str) -> str:
    """
    Production-safe LLM call:
    - validates input
    - handles missing API key
    - timeout protection
    - safe parsing
    - fallback response
    """

    try:
        # =========================
        # INPUT VALIDATION
        # =========================
        if not query or not query.strip():
            return "Please enter a valid message."

        clean_query = query.strip()

        # =========================
        # FALLBACK (NO API KEY)
        # =========================
        if client is None:
            logger.warning("LLM fallback triggered (no API key)")
            return f"Echo: {clean_query}"

        # =========================
        # OPENAI CALL (SAFE)
        # =========================
        response = client.responses.create(
            model="gpt-4o-mini",
            input=clean_query,
            timeout=10,  # 🔴 critical
        )

        # =========================
        # SAFE EXTRACTION
        # =========================
        try:
            if not response.output:
                return "No response from AI."

            content_blocks = response.output[0].content

            if not content_blocks:
                return "Empty AI response."

            text = content_blocks[0].text

            if not text:
                return "AI returned empty response."

            return text.strip()

        except Exception as parse_error:
            logger.error(f"Parse error: {str(parse_error)}")
            return "AI response parsing failed."

    except Exception as e:
        # =========================
        # GLOBAL FAILSAFE
        # =========================
        logger.error(f"LLM ERROR: {str(e)}")

        return "AI service temporarily unavailable"
