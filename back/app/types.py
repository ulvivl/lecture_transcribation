from enum import Enum

from pydantic import BaseModel


class TaskStatus(Enum):
    NOT_STARTED = "NOT_STARTED"
    TRANCRIBATION = "TRANCRIBATION"
    TRANCRIBATION_DONE = "TRANCRIBATION_DONE"
    GLOSARY = "GLOSARY"
    GLOSARY_DONE = "GLOSARY_DONE"
    CONSPECT = "CONSPECT"
    CONSPECT_DONE = "CONSPECT_DONE"


class TaskItem(BaseModel):
    id: str
    status: str
    filename: str
