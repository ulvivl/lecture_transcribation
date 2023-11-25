import logging
import time
from pathlib import Path

from tqdm import tqdm

from app.config import CONSUMER_SLEEP_TIME, WHISPERX_CONFIG
from app.entities import Storage
from app.utils import FileLock, dump_json, load_json
from app.whisperx import WhisperXExecutor

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

STORAGE = Storage()
EXECUTOR = WhisperXExecutor(**load_json(WHISPERX_CONFIG))


def main() -> None:
    while True:
        audios_paths = STORAGE.scan_audios()
        logger.info("Found %s audios for transcribation. Audios: %s", len(audios_paths), audios_paths)
        if not audios_paths:
            logger.info("Sleep...")
            time.sleep(CONSUMER_SLEEP_TIME)
            continue
        for audio_path in tqdm(audios_paths):
            transcribe_audio(audio_path=audio_path)


def transcribe_audio(audio_path: Path) -> None:  # pylint: disable=inconsistent-return-statements
    transcription_path = STORAGE.transcription_path(task_id=audio_path.stem)
    lock_file = STORAGE.filelock_path(file=transcription_path)
    with FileLock(lock_file=lock_file):
        try:
            audio = EXECUTOR.load_audio(audio_path)
        except Exception:  # pylint: disable=broad-exception-caught
            logger.warning("Can't open file")
            return None
        logger.info("Transcribation audio")
        transcription = EXECUTOR.transcribe(audio)
        logger.info("Align audio segments")
        aligh_transcription = EXECUTOR.align(audio, transcription=transcription)
        # TODO: May be add diarization
        dump_json(file=transcription_path, data=aligh_transcription)
    logger.info("Transcribation for audio %s saved in %s path", audio_path, transcription_path)


if __name__ == "__main__":
    main()
