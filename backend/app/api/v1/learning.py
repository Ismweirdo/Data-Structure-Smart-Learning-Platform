# TODO: G 推荐引擎 & 学习统计模块 — 实现进度查询、掌握度、统计 API

import uuid

from fastapi import APIRouter

from app.api.deps import DbDep

router = APIRouter(prefix="/progress", tags=["学习进度"])


@router.get("/{user_id}")
async def get_progress(user_id: uuid.UUID, db: DbDep):
    """TODO: G 学习进度总览 — 已掌握数/学习中数/正确率/平均掌握度"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="进度总览接口待实现 — G")


@router.get("/{user_id}/mastery")
async def get_mastery(user_id: uuid.UUID, db: DbDep):
    """TODO: G 知识掌握度列表 — 每个知识点的掌握度、练习次数"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="掌握度列表接口待实现 — G")


@router.get("/{user_id}/stats")
async def get_stats(user_id: uuid.UUID, db: DbDep):
    """TODO: G 学习统计数据 — 周活跃、总题数、正确数、分类掌握度"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="统计接口待实现 — G")
