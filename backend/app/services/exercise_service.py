# TODO: A 练习系统模块 — 实现题目查询、答案批改、掌握度更新

import uuid

from sqlalchemy.ext.asyncio import AsyncSession


async def get_exercises_by_knowledge(db: AsyncSession, knowledge_point_id: uuid.UUID) -> list:
    """TODO: A 按知识点 ID 查询题目列表"""
    raise NotImplementedError("get_exercises_by_knowledge 待实现 — A 练习系统模块")


async def submit_answer(db: AsyncSession, user_id: uuid.UUID, exercise_id: uuid.UUID, answer: dict):
    """
    TODO: A 提交答案并批改
    1. 查询题目正确答案
    2. 调用 _check_answer 判断正误
    3. 写入 exercise_records 表
    4. 更新 knowledge_mastery 表（掌握度 = 正确数/总数）
    5. 返回批改结果
    """
    raise NotImplementedError("submit_answer 待实现 — A 练习系统模块")


def _check_answer(user_answer: dict, correct_answer: dict, question_type: str) -> bool:
    """TODO: A 按题型比对答案（choice/fill/code）"""
    raise NotImplementedError("_check_answer 待实现 — A 练习系统模块")
