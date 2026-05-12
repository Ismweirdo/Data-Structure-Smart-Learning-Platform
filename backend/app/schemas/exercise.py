import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class ExerciseOption(BaseModel):
    key: str
    text: str


class ExerciseContent(BaseModel):
    question: str
    options: list[ExerciseOption] | None = None  # 选择题
    code_template: str | None = None              # 代码补全题
    blanks: list[str] | None = None               # 填空题空白答案


class ExerciseResponse(BaseModel):
    id: uuid.UUID
    knowledge_point_id: uuid.UUID
    type: str
    title: str
    content: dict
    difficulty: int
    explanation: str | None = None
    created_at: datetime

    model_config = {"from_attributes": True}


class ExerciseSubmitRequest(BaseModel):
    answer: dict


class ExerciseSubmitResponse(BaseModel):
    is_correct: bool
    correct_answer: dict
    explanation: str | None = None
    mastery_change: float = 0.0


class ExerciseRecordResponse(BaseModel):
    id: uuid.UUID
    exercise_id: uuid.UUID
    exercise_title: str
    is_correct: bool
    time_spent: int
    created_at: datetime
