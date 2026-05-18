import uuid

from fastapi import APIRouter, HTTPException

from app.api.deps import DbDep
from app.schemas.exercise import (
    ExerciseResponse,
    ExerciseSubmitRequest,
    ExerciseSubmitResponse,
)
from app.services.exercise_service import (
    get_exercises,
    get_exercise_by_id,
    submit_answer,
)

router = APIRouter(prefix="/exercises", tags=["练习"])


@router.get("", response_model=list[ExerciseResponse])
async def list_exercises(db: DbDep, knowledge_point_id: uuid.UUID | None = None):
    """获取题目列表 — 支持按知识点筛选"""
    exercises = await get_exercises(db, knowledge_point_id)
    return exercises


@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(exercise_id: uuid.UUID, db: DbDep):
    """获取题目详情"""
    exercise = await get_exercise_by_id(db, exercise_id)
    if not exercise:
        raise HTTPException(status_code=404, detail="题目不存在")
    return exercise


@router.post("/{exercise_id}/submit", response_model=ExerciseSubmitResponse)
async def submit(
    exercise_id: uuid.UUID, data: ExerciseSubmitRequest, db: DbDep
):
    """提交答案并批改"""
    try:
        result = await submit_answer(
            db=db,
            user_id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
            exercise_id=exercise_id,
            answer=data.answer,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/adaptive/{user_id}")
async def adaptive(user_id: uuid.UUID, db: DbDep, limit: int = 5):
    """自适应推荐题目 — 调用 recommendation.get_adaptive_exercises"""
    from fastapi import HTTPException

    raise HTTPException(
        status_code=501, detail="自适应推荐接口待实现 — G"
    )
