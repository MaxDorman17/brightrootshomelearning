"""Spoken words for the spelling games, in one voice on every device.

Phones and computers each read words aloud in their own built-in voices, so the same word sounds different
on each. Here Azure Speech makes the sound once, it is kept on disk, and every device plays that same file.
When Azure isn't set up this answers 404 and the site falls back to the device's own voice.
"""
import hashlib
import logging
import os
import time
from collections import defaultdict
from xml.sax.saxutils import escape

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse

from auth import get_current_user
from config import settings
from models import User
from storage import upload_dir

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/speech", tags=["speech"])

MAX_LENGTH = 80
# Native voices for the languages page's starter packs. English uses AZURE_SPEECH_VOICE.
VOICES = {
    "fr-FR": "fr-FR-DeniseNeural",
    "es-ES": "es-ES-ElviraNeural",
    "de-DE": "de-DE-KatjaNeural",
    "it-IT": "it-IT-ElsaNeural",
    "pl-PL": "pl-PL-ZofiaNeural",
    "cy-GB": "cy-GB-NiaNeural",
}
NEW_WORDS_PER_DAY = 600  # per person; words already made are free and don't count
_made_today: dict[int, list[float]] = defaultdict(list)


def _tidy(text: str) -> str:
    return " ".join(text.split())


def _voice(lang: str) -> str:
    return VOICES.get(lang) or settings.AZURE_SPEECH_VOICE


def _path(text: str, voice: str) -> str:
    name = hashlib.sha256(f"{voice}|{text}".encode()).hexdigest()
    return os.path.join(upload_dir("speech"), f"{name}.mp3")


def _allowed_new_word(user_id: int) -> bool:
    now = time.time()
    recent = [t for t in _made_today[user_id] if now - t < 86400]
    _made_today[user_id] = recent
    if len(recent) >= NEW_WORDS_PER_DAY:
        return False
    recent.append(now)
    return True


def _make(text: str, voice: str) -> bytes | None:
    """The word as an MP3 from Azure, or None if Azure couldn't make it."""
    lang = "-".join(voice.split("-")[:2])
    ssml = (
        f"<speak version='1.0' xml:lang='{escape(lang)}'>"
        f"<voice name='{escape(voice)}'><prosody rate='-10%'>{escape(text)}</prosody></voice>"
        "</speak>"
    )
    try:
        response = httpx.post(
            f"https://{settings.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1",
            content=ssml.encode(),
            headers={
                "Ocp-Apim-Subscription-Key": settings.AZURE_SPEECH_KEY,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
                "User-Agent": "BrightRoots",
            },
            timeout=15,
        )
    except httpx.HTTPError as error:
        logger.warning("Azure Speech couldn't be reached: %s", error)
        return None
    if response.status_code != 200 or not response.content:
        logger.warning("Azure Speech answered %s", response.status_code)
        return None
    return response.content


@router.get("")
def speak(
    text: str = Query(..., min_length=1, max_length=MAX_LENGTH),
    lang: str = Query("en-GB", max_length=10),
    current_user: User = Depends(get_current_user),
):
    text = _tidy(text)
    if not text or not settings.AZURE_SPEECH_KEY or (lang != "en-GB" and lang not in VOICES):
        raise HTTPException(status_code=404, detail="Spoken words aren't available")
    voice = _voice(lang)
    path = _path(text, voice)
    if not os.path.exists(path):
        if not _allowed_new_word(current_user.id):
            raise HTTPException(status_code=429, detail="That's a lot of new words for one day")
        audio = _make(text, voice)
        if audio is None:
            raise HTTPException(status_code=503, detail="Spoken words aren't available right now")
        temporary = f"{path}.{os.getpid()}.part"
        with open(temporary, "wb") as file:
            file.write(audio)
        os.replace(temporary, path)
    return FileResponse(path, media_type="audio/mpeg", headers={"Cache-Control": "private, max-age=2592000"})
