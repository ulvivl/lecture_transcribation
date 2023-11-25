import logging
from dataclasses import dataclass, field
from pathlib import Path
from typing import Dict, List, Set

from app.config import ALLOWED_EXTENSIONS, DIRECTORY
from app.types import TaskItem, TaskStatus
from app.utils import dump_json, load_json

logger = logging.getLogger(__name__)


@dataclass
class Storage:
    _directory: Path = DIRECTORY
    _download_dir: Path = field(init=False)
    _audio_dir: Path = field(init=False)
    _transcription_dir: Path = field(init=False)
    _glosary_dir: Path = field(init=False)
    _qa_dir: Path = field(init=False)
    _conspect_dir: Path = field(init=False)
    _conspect_doc: Path = field(init=False)
    _glosary_doc: Path = field(init=False)

    @staticmethod
    def create_dir(_directory: Path) -> Path:
        _directory.mkdir(parents=True, exist_ok=True)
        return _directory

    def __post_init__(self) -> None:
        self._directory = Path(self._directory)
        self._download_dir = self.create_dir(self._directory / "download")
        self._audio_dir = self.create_dir(self._directory / "audio")
        self._transcription_dir = self.create_dir(self._directory / "transcription")
        self._glosary_dir = self.create_dir(self._directory / "glosary")
        self._qa_dir = self.create_dir(self._directory / "qa")
        self._conspect_dir = self.create_dir(self._directory / "conspect")
        self._conspect_doc = self.create_dir(self._directory / "conspect_doc")
        self._glosary_doc = self.create_dir(self._directory / "glosary_doc")

    def download_path(self, filename: str) -> Path:
        return self._download_dir / filename

    def audio_path(self, task_id: str, extension: str) -> Path:
        return self._audio_dir / f"{task_id}.{extension}"

    @staticmethod
    def filelock_path(file: Path) -> Path:
        _directory = file.parent
        return _directory / (file.name + ".lock")

    def transcription_path(self, task_id: str) -> Path:
        return self._transcription_dir / f"{task_id}.json"

    def glosary_path(self, task_id: str) -> Path:
        return self._glosary_dir / f"{task_id}.json"

    def qa_path(self, task_id: str) -> Path:
        return self._qa_dir / f"{task_id}.json"

    def conspect_path(self, task_id: str) -> Path:
        return self._conspect_dir / f"{task_id}.json"

    def glosary_doc_path(self, task_id: str) -> Path:
        return self._glosary_doc / f"{task_id}.docx"

    def conspect_doc_path(self, task_id: str) -> Path:
        return self._conspect_doc / f"{task_id}.docx"

    def check_file_and_lock(self, file: Path) -> bool:
        filelock = self.filelock_path(file=file)
        return file.exists() and not filelock.exists()

    def scan_audios(self) -> List[Path]:
        audio_for_transcribation: List[Path] = []
        for audio_path in self._audio_dir.glob("*"):
            task_id = audio_path.stem
            extension = audio_path.suffix.strip(".")
            if not extension in ALLOWED_EXTENSIONS:
                continue
            if self.filelock_path(audio_path).exists():
                continue
            transcribation_path = self.transcription_path(task_id=task_id)
            if self.check_file_and_lock(file=transcribation_path):
                continue
            audio_for_transcribation.append(audio_path)
        return audio_for_transcribation

    def scan_transcribation(self) -> List[Path]:
        transcribations_for_glosart: List[Path] = []
        for transcribation_path in self._transcription_dir.glob("*.json"):
            task_id = transcribation_path.stem
            if self.filelock_path(transcribation_path).exists():
                continue
            glosary_path = self.glosary_path(task_id=task_id)
            if self.check_file_and_lock(file=glosary_path):
                continue
            transcribations_for_glosart.append(transcribation_path)
        return transcribations_for_glosart

    def scan_transcribation_conspect(self) -> List[Path]:
        transcribations_for_glosart: List[Path] = []
        for transcribation_path in self._transcription_dir.glob("*.json"):
            task_id = transcribation_path.stem
            if self.filelock_path(transcribation_path).exists():
                continue
            conspect_path = self.conspect_path(task_id=task_id)
            if self.check_file_and_lock(file=conspect_path):
                continue
            transcribations_for_glosart.append(transcribation_path)
        return transcribations_for_glosart


@dataclass
class Manager:
    storage: Storage
    task_ids: Set[str] = field(default_factory=set)
    id2filename: Dict[str, str] = field(default_factory=dict)
    id2status: Dict[str, str] = field(default_factory=dict)
    dump_path: Path = field(init=False)

    def __post_init__(self) -> None:
        self.dump_path = DIRECTORY / "tasks.json"
        self.dump_path.parent.mkdir(parents=True, exist_ok=True)

    def add_task(self, task_id: str, filename: str) -> None:
        self.task_ids.add(task_id)
        self.id2filename[task_id] = filename
        self.id2status[task_id] = TaskStatus.NOT_STARTED.value

    def get_tasks(self) -> List[TaskItem]:
        tasks: List[TaskItem] = []
        for task_id in sorted(self.task_ids):
            tasks.append(TaskItem(id=task_id, status=self.id2status[task_id], filename=self.id2filename[task_id]))
        logger.info("Return %s tasks: %s", len(tasks), tasks)
        return tasks

    def dump(self) -> None:
        data = [list(self.task_ids), self.id2filename, self.id2status]
        dump_json(self.dump_path, data=data)

    def load(self) -> None:  # pylint: disable=inconsistent-return-statements
        if not self.dump_path.exists():
            return None
        data = load_json(self.dump_path)
        assert len(data) == 3
        task_ids, id2filename, id2status = data
        assert isinstance(task_ids, list)
        logger.info("Loaded %s task_ids from dump_data")
        self.task_ids.update(task_ids)
        assert isinstance(id2filename, dict)
        logger.info("Loaded %s tasks from dump_data")
        id2filename.update(self.id2filename)
        self.id2filename = id2filename
        assert isinstance(id2status, dict)
        id2status.update(self.id2status)
        self.id2status = id2status
        logger.info("Loaded %s statuses from dump_data")

    def update(self) -> None:
        for task_id in self.task_ids:
            print(task_id)
            transcription_path = self.storage.transcription_path(task_id=task_id)
            glosary_path = self.storage.glosary_path(task_id=task_id)
            conspect_path = self.storage.conspect_path(task_id=task_id)

            status: TaskStatus
            if self.storage.check_file_and_lock(file=conspect_path):
                status = TaskStatus.CONSPECT_DONE
            elif self.storage.filelock_path(file=conspect_path).exists():
                status = TaskStatus.CONSPECT
            elif self.storage.check_file_and_lock(file=glosary_path):
                status = TaskStatus.GLOSARY_DONE
            elif self.storage.filelock_path(file=glosary_path).exists():
                status = TaskStatus.GLOSARY
            elif self.storage.check_file_and_lock(file=transcription_path):
                status = TaskStatus.TRANCRIBATION_DONE
            elif self.storage.filelock_path(file=transcription_path).exists():
                status = TaskStatus.TRANCRIBATION
            else:
                status = TaskStatus.NOT_STARTED
            self.id2status[task_id] = status.value
