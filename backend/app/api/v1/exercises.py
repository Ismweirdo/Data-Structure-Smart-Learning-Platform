# TODO: A 练习系统模块 — 实现题目列表/详情/提交批改
# TODO: G 自适应推荐接口在此模块中

import uuid

from fastapi import APIRouter

from app.api.deps import DbDep
from app.schemas.exercise import ExerciseSubmitRequest

router = APIRouter(prefix="/exercises", tags=["练习"])


@router.get("")
async def list_exercises(db: DbDep, knowledge_point_id: uuid.UUID | None = None):
    """TODO: A 题目列表 — 支持按知识点筛选"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="题目列表接口待实现 — A")


@router.get("/{exercise_id}")
async def get_exercise(exercise_id: uuid.UUID, db: DbDep):
    """TODO: A 题目详情"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="题目详情接口待实现 — A")


@router.post("/{exercise_id}/submit")
async def submit(exercise_id: uuid.UUID, data: ExerciseSubmitRequest, db: DbDep):
    """TODO: A 提交答案并批改 — 调用 exercise_service.submit_answer"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="提交接口待实现 — A")


@router.get("/adaptive/{user_id}")
async def adaptive(user_id: uuid.UUID, db: DbDep, limit: int = 5):
    """TODO: G 自适应推荐题目 — 调用 recommendation.get_adaptive_exercises"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="自适应推荐接口待实现 — G")
