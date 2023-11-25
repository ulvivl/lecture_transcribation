import hashlib
import logging
from contextlib import asynccontextmanager
from typing import List

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import FileResponse

from app.config import ALLOWED_EXTENSIONS
from app.entities import Manager, Storage
from app.types import TaskItem
from app.utils import FileLock, format_docx, format_glosary, load_json

STORAGE = Storage()
MANAGER = Manager(storage=STORAGE)


@asynccontextmanager
async def lifespan(app: FastAPI):  # pylint: disable=redefined-outer-name,unused-argument
    MANAGER.load()
    yield
    MANAGER.dump()


logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)
app = FastAPI(lifespan=lifespan)


@app.get("/")
def transcribation() -> str:
    return "Transcribation Application"


@app.post("/v1/audio/upload")
async def upload_audio(file: UploadFile = File(...)) -> str:
    # Check input file
    if file.filename is None:
        raise HTTPException(status_code=400, detail="Upload file with filename")
    *_, extension = file.filename.rpartition(".")
    if extension.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only FLAC and MP3 files are allowed")

    # Upload and compute md5 hash and add to manager
    logger.info("Start uploading file: %s", file.filename)
    file_path = STORAGE.download_path(file.filename)
    hasher = hashlib.md5()
    with open(file_path, "wb") as audio_file:
        while content := await file.read(2048):
            hasher.update(content)
            audio_file.write(content)
    task_id = hasher.hexdigest()
    MANAGER.add_task(task_id=task_id, filename=file.filename)

    # Move from download dir to audio dire and rename to <task_id>.<ext>
    audio_file_path = STORAGE.audio_path(task_id=task_id, extension=extension)
    lock_file = STORAGE.filelock_path(audio_file_path)
    with FileLock(lock_file=lock_file):
        file_path.rename(audio_file_path)
    lock_file.unlink()
    logger.info("File saved into path: %s", audio_file_path)
    return task_id


@app.get("/v1/audio/transcription")
async def get_audio_transcription(task_id: str) -> dict:
    transcription_path = STORAGE.transcription_path(task_id=task_id)
    if STORAGE.check_file_and_lock(file=transcription_path):
        return load_json(transcription_path)
    raise HTTPException(status_code=400, detail=f"Not found transcription for task_id = {task_id}")


@app.get("/v1/task/list")
async def get_all_tasks() -> List[TaskItem]:
    MANAGER.update()
    return MANAGER.get_tasks()


@app.get("/v1/text/glosary")
async def get_lecture_glosary(task_id: str) -> dict:
    glosary_path = STORAGE.glosary_path(task_id=task_id)
    if STORAGE.check_file_and_lock(file=glosary_path):
        return load_json(glosary_path)
    raise HTTPException(status_code=400, detail=f"Not found glosary for task_id = {task_id}")


@app.get("/v1/text/conspect")
async def get_lecture_conspect(task_id: str) -> str:
    conspect_path = STORAGE.conspect_path(task_id=task_id)
    if STORAGE.check_file_and_lock(file=conspect_path):
        return conspect_path.read_text().strip()
    raise HTTPException(status_code=400, detail=f"Not found conspect for task_id = {task_id}")


@app.get("/v1/download/glosary")
async def download_lecture_glosary(task_id: str) -> FileResponse:
    glosary_path = STORAGE.glosary_path(task_id=task_id)
    glosary_doc_path = STORAGE.glosary_doc_path(task_id=task_id)
    if STORAGE.check_file_and_lock(file=glosary_path) or glosary_doc_path.exists():
        if not glosary_doc_path.exists():
            glosary = load_json(glosary_path)
            format_glosary(glosary).save(str(glosary_doc_path))
        return FileResponse(path=glosary_doc_path, filename=glosary_doc_path.name)
    raise HTTPException(status_code=400, detail=f"Not found glosary for task_id = {task_id}")


@app.get("/v1/download/conspect")
async def download_lecture_conspect(task_id: str) -> FileResponse:
    conspect_path = STORAGE.conspect_path(task_id=task_id)
    qa_path = STORAGE.qa_path(task_id=task_id)
    conspect_doc_path = STORAGE.conspect_doc_path(task_id=task_id)
    if STORAGE.check_file_and_lock(file=conspect_path) or conspect_doc_path.exists():
        if not conspect_doc_path.exists():
            tests = load_json(qa_path) if qa_path.exists() else {}
            intro, (themes, paragraphs), conclusion = load_json(conspect_path)
            format_docx(intro, (themes, paragraphs), conclusion, tests=tests).save(str(conspect_doc_path))
        return FileResponse(path=conspect_doc_path, filename=conspect_doc_path.name)
    raise HTTPException(status_code=400, detail=f"Not found conspect for task_id = {task_id}")
