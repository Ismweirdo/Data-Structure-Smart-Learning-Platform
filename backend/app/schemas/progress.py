import uuid
from datetime import datetime

from pydantic import BaseModel


class KnowledgeMasteryResponse(BaseModel):
    knowledge_point_id: uuid.UUID
    knowledge_point_name: str
    mastery_score: float
    total_attempts: int
    correct_attempts: int
    last_practiced_at: datetime | None = None

    model_config = {"from_attributes": True}


class LearningStatsResponse(BaseModel):
    total_study_time_minutes: int
    total_exercises_completed: int
    total_correct: int
    weekly_activity: list[int]  # 最近7天每天的练习次数
    category_mastery: dict[str, float]  # 各分类掌握度
