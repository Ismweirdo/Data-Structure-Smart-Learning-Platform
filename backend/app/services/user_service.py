# TODO: C 用户认证模块 — 实现用户注册、登录认证、进度查询

import uuid

from sqlalchemy.ext.asyncio import AsyncSession


async def create_user(db: AsyncSession, data) -> None:
    """TODO: C 创建用户 — 校验唯一性、密码哈希、写入数据库"""
    raise NotImplementedError("create_user 待实现 — C 用户认证模块")


async def authenticate_user(db: AsyncSession, username: str, password: str):
    """TODO: C 用户认证 — 查询用户、验证密码、返回 User 或 None"""
    raise NotImplementedError("authenticate_user 待实现 — C 用户认证模块")


async def get_user_progress(db: AsyncSession, user_id: uuid.UUID):
    """TODO: G 学习统计 — 汇总用户的知识掌握度和练习统计"""
    raise NotImplementedError("get_user_progress 待实现 — G 推荐引擎模块")
