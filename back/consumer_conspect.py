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
        transcribations_paths = STORAGE.scan_transcribation_conspect()
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
            extract_conspect(transcribation_path=transcribation_path)


def extract_conspect(transcribation_path: Path) -> None:  # pylint: disable=inconsistent-return-statements
    conspect_path = STORAGE.conspect_path(task_id=transcribation_path.stem)
    lock_file = STORAGE.filelock_path(file=conspect_path)
    with FileLock(lock_file=lock_file):
        try:
            conspect = EXECUTOR.generate_conspect(load_json(transcribation_path))
            print()
        except Exception as exc:  # pylint: disable=broad-exception-caught
            logger.warning("Can't open file")
            return None
        dump_json(file=conspect_path, data=conspect)
    logger.info("Conspect for transcription %s saved in %s path", transcribation_path, conspect_path)


if __name__ == "__main__":
    main()
