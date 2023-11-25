from pathlib import Path

DIRECTORY = Path("/data/sporkhun/hack-2023-geekbrains/data/application")
ALLOWED_EXTENSIONS = {"flac", "mp3"}
WHISPERX_CONFIG = Path(__file__).parent.parent / "config" / "whisperx.json"
LLM_CONFIG = Path(__file__).parent.parent / "config" / "llm.json"

CONSUMER_SLEEP_TIME = 20

assert DIRECTORY.exists(), f"Not found directory: {DIRECTORY}"
assert WHISPERX_CONFIG.exists(), f"Not found config: {WHISPERX_CONFIG}"
assert LLM_CONFIG.exists(), f"Not found config: {LLM_CONFIG}"
