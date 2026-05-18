import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy import select, func, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.exercise import Exercise
from app.models.progress import ExerciseRecord, KnowledgeMastery
from app.models.knowledge import KnowledgePoint


async def get_exercises(db: AsyncSession, knowledge_point_id: Optional[uuid.UUID] = None) -> List[Exercise]:
    """查询题目列表，支持按知识点筛选"""
    query = select(Exercise)
    
    if knowledge_point_id:
        query = query.where(Exercise.knowledge_point_id == knowledge_point_id)
    
    result = await db.execute(query)
    return result.scalars().all()


async def get_exercise_by_id(db: AsyncSession, exercise_id: uuid.UUID) -> Optional[Exercise]:
    """按ID查询题目详情"""
    query = select(Exercise).where(Exercise.id == exercise_id)
    result = await db.execute(query)
    return result.scalar_one_or_none()


async def submit_answer(
    db: AsyncSession,
    user_id: uuid.UUID,
    exercise_id: uuid.UUID,
    answer: dict,
    time_spent: int = 0
) -> dict:
    """
    提交答案并批改
    1. 查询题目正确答案
    2. 调用 _check_answer 判断正误
    3. 写入 exercise_records 表
    4. 更新 knowledge_mastery 表（掌握度 = 正确数/总数）
    5. 返回批改结果
    """
    exercise = await get_exercise_by_id(db, exercise_id)
    if not exercise:
        raise ValueError("题目不存在")
    
    is_correct = _check_answer(answer, exercise.answer, exercise.type)
    
    exercise_record = ExerciseRecord(
        user_id=user_id,
        exercise_id=exercise_id,
        user_answer=answer,
        is_correct=is_correct,
        time_spent=time_spent,
        created_at=datetime.now()
    )
    db.add(exercise_record)
    
    await _update_mastery(db, user_id, exercise.knowledge_point_id, is_correct)
    
    await db.commit()
    
    return {
        "is_correct": is_correct,
        "correct_answer": exercise.answer,
        "explanation": exercise.explanation,
        "mastery_change": await _get_mastery_score(db, user_id, exercise.knowledge_point_id)
    }


async def _update_mastery(db: AsyncSession, user_id: uuid.UUID, knowledge_point_id: uuid.UUID, is_correct: bool):
    """更新用户的知识点掌握度"""
    query = select(KnowledgeMastery).where(
        KnowledgeMastery.user_id == user_id,
        KnowledgeMastery.knowledge_point_id == knowledge_point_id
    )
    result = await db.execute(query)
    mastery = result.scalar_one_or_none()
    
    if mastery:
        mastery.total_attempts += 1
        if is_correct:
            mastery.correct_attempts += 1
        mastery.mastery_score = mastery.correct_attempts / mastery.total_attempts
        mastery.last_practiced_at = datetime.now()
    else:
        new_mastery = KnowledgeMastery(
            user_id=user_id,
            knowledge_point_id=knowledge_point_id,
            total_attempts=1,
            correct_attempts=1 if is_correct else 0,
            mastery_score=1.0 if is_correct else 0.0,
            last_practiced_at=datetime.now()
        )
        db.add(new_mastery)


async def _get_mastery_score(db: AsyncSession, user_id: uuid.UUID, knowledge_point_id: uuid.UUID) -> float:
    """获取用户对某个知识点的掌握度"""
    query = select(KnowledgeMastery.mastery_score).where(
        KnowledgeMastery.user_id == user_id,
        KnowledgeMastery.knowledge_point_id == knowledge_point_id
    )
    result = await db.execute(query)
    score = result.scalar_one_or_none()
    return score or 0.0


def _check_answer(user_answer: dict, correct_answer: dict, question_type: str) -> bool:
    """按题型比对答案"""
    if question_type == "choice":
        return _check_choice_answer(user_answer, correct_answer)
    elif question_type == "fill":
        return _check_fill_answer(user_answer, correct_answer)
    elif question_type == "code":
        return _check_code_answer(user_answer, correct_answer)
    else:
        return False


def _check_choice_answer(user_answer: dict, correct_answer: dict) -> bool:
    """检查选择题答案"""
    user_choice = user_answer.get("choice")
    correct_choice = correct_answer.get("choice")
    return str(user_choice) == str(correct_choice)


def _check_fill_answer(user_answer: dict, correct_answer: dict) -> bool:
    """检查填空题答案"""
    user_blanks = user_answer.get("blanks", [])
    correct_blanks = correct_answer.get("blanks", [])
    
    if len(user_blanks) != len(correct_blanks):
        return False
    
    for user_val, correct_val in zip(user_blanks, correct_blanks):
        if str(user_val).strip().lower() != str(correct_val).strip().lower():
            return False
    
    return True


def _check_code_answer(user_answer: dict, correct_answer: dict) -> bool:
    """检查代码题答案（简化版）"""
    user_code = user_answer.get("code", "").strip()
    correct_code = correct_answer.get("code", "").strip()
    
    if not user_code or not correct_code:
        return False
    
    user_lines = [line.strip() for line in user_code.split('\n') if line.strip()]
    correct_lines = [line.strip() for line in correct_code.split('\n') if line.strip()]
    
    if len(user_lines) != len(correct_lines):
        return False
    
    for user_line, correct_line in zip(user_lines, correct_lines):
        if user_line != correct_line:
            return False
    
    return True
