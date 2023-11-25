import logging
import time
from pathlib import Path

from tqdm import tqdm

from app.config import CONSUMER_SLEEP_TIME, LLM_CONFIG
from app.entities import Storage
from app.llm import LLMExecutor
from app.utils import FileLock, dump_json, load_json

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

STORAGE = Storage()
EXECUTOR = LLMExecutor(**load_json(LLM_CONFIG))


def main() -> None:
    while True:
        transcribations_paths = STORAGE.scan_transcribation()
        logger.info(
            "Found %s transcribations files for extract glosary. transcribations: %s",
            len(transcribations_paths),
            transcribations_paths,
        )
        if not transcribations_paths:
            logger.info("Sleep...")
            time.sleep(CONSUMER_SLEEP_TIME)
            continue
        for transcribation_path in tqdm(transcribations_paths):
            extract_glosary(transcribation_path=transcribation_path)


def extract_glosary(transcribation_path: Path) -> None:  # pylint: disable=inconsistent-return-statements
    glosary_path = STORAGE.glosary_path(task_id=transcribation_path.stem)
    qa_path = STORAGE.qa_path(task_id=transcribation_path.stem)
    glosary_lock_file = STORAGE.filelock_path(file=glosary_path)
    qa_path = STORAGE.filelock_path(file=qa_path)
    with FileLock(lock_file=glosary_lock_file), FileLock(lock_file=qa_path):
        try:
            glosary, q_a = EXECUTOR.generate_glosary(load_json(transcribation_path))
        except Exception as exc:  # pylint: disable=broad-exception-caught
            logger.warning("Can't open file: %s", exc)
            return None
        dump_json(file=glosary_path, data=glosary)
        dump_json(file=qa_path, data=q_a)
    logger.info("Glosary for transcription %s saved in %s path", transcribation_path, glosary_path)
    logger.info(
        "Questions and answers from transcription and glosary %s %s saved in %s path",
        transcribation_path,
        glosary_path,
        qa_path,
    )


if __name__ == "__main__":
    main()
