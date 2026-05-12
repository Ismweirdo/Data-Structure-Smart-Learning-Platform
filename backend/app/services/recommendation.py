# TODO: G 推荐引擎 & 学习统计模块 — 实现自适应推荐、掌握度计算、学习统计

import uuid

from sqlalchemy.ext.asyncio import AsyncSession


async def get_adaptive_exercises(db: AsyncSession, user_id: uuid.UUID, limit: int = 5) -> list:
    """
    TODO: G 自适应题目推荐
    策略：按用户薄弱知识点排序（mastery_score 升序），
    从最弱的 3 个知识点中各取 2 道题，返回 top-N
    """
    raise NotImplementedError("get_adaptive_exercises 待实现 — G 推荐引擎模块")


async def compute_mastery_radar(db: AsyncSession, user_id: uuid.UUID) -> dict[str, float]:
    """
    TODO: G 计算各分类的平均掌握度（用于雷达图）
    返回: {"linear": 0.85, "tree": 0.60, ...}
    """
    raise NotImplementedError("compute_mastery_radar 待实现 — G 推荐引擎模块")
