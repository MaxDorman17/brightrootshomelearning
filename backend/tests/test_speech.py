"""Spoken words: made once by Azure, kept, and the same file played on every device. Azure is never called here."""
import routers.speech as speech
from config import settings
from conftest import new_client


def test_words_are_made_once_then_reused(family, monkeypatch):
    monkeypatch.setattr(settings, "AZURE_SPEECH_KEY", "test-key")
    made = []
    monkeypatch.setattr(speech, "_make", lambda text, voice: made.append(text) or b"ID3 fake mp3")

    first = family.parent.get("/api/speech", params={"text": "  because "})
    assert first.status_code == 200
    assert first.headers["content-type"] == "audio/mpeg"
    assert first.content == b"ID3 fake mp3"
    assert family.parent.get("/api/speech", params={"text": "because"}).status_code == 200
    assert made == ["because"]


def test_without_azure_the_device_voice_is_used(family, monkeypatch):
    monkeypatch.setattr(settings, "AZURE_SPEECH_KEY", "")
    assert family.parent.get("/api/speech", params={"text": "friend"}).status_code == 404


def test_azure_trouble_is_not_kept(family, monkeypatch):
    monkeypatch.setattr(settings, "AZURE_SPEECH_KEY", "test-key")
    monkeypatch.setattr(speech, "_make", lambda text, voice: None)
    assert family.parent.get("/api/speech", params={"text": "said"}).status_code == 503
    monkeypatch.setattr(speech, "_make", lambda text, voice: b"ID3 fake mp3")
    assert family.parent.get("/api/speech", params={"text": "said"}).status_code == 200


def test_children_can_hear_words_but_strangers_cannot(family, monkeypatch):
    monkeypatch.setattr(settings, "AZURE_SPEECH_KEY", "test-key")
    monkeypatch.setattr(speech, "_make", lambda text, voice: b"ID3 fake mp3")
    child = family.child_client(family.add_child("Oscar"))
    assert child.get("/api/speech", params={"text": "people"}).status_code == 200
    assert new_client().get("/api/speech", params={"text": "people"}).status_code == 401
    assert family.parent.get("/api/speech", params={"text": "x" * 81}).status_code == 422


def test_new_words_are_capped_each_day(family, monkeypatch):
    monkeypatch.setattr(settings, "AZURE_SPEECH_KEY", "test-key")
    monkeypatch.setattr(speech, "_make", lambda text, voice: b"ID3 fake mp3")
    monkeypatch.setattr(speech, "NEW_WORDS_PER_DAY", 2)
    assert family.parent.get("/api/speech", params={"text": "one"}).status_code == 200
    assert family.parent.get("/api/speech", params={"text": "two"}).status_code == 200
    assert family.parent.get("/api/speech", params={"text": "three"}).status_code == 429
    assert family.parent.get("/api/speech", params={"text": "one"}).status_code == 200


def test_starter_pack_words_use_a_native_voice(family, monkeypatch):
    monkeypatch.setattr(settings, "AZURE_SPEECH_KEY", "test-key")
    voices = []
    monkeypatch.setattr(speech, "_make", lambda text, voice: voices.append(voice) or b"ID3 fake mp3")
    assert family.parent.get("/api/speech", params={"text": "bonjour", "lang": "fr-FR"}).status_code == 200
    assert family.parent.get("/api/speech", params={"text": "bonjour"}).status_code == 200
    assert family.parent.get("/api/speech", params={"text": "bonjour", "lang": "xx-XX"}).status_code == 404
    assert voices == ["fr-FR-DeniseNeural", settings.AZURE_SPEECH_VOICE]
