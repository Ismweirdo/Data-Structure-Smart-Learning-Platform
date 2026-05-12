from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from neo4j import AsyncSession as Neo4jSession
from sqlalchemy.ext.asyncio import AsyncSession as PGAsyncSession

from app.core.database import get_db
from app.core.neo4j import get_neo4j

# Reusable dependency aliases
DbDep = Annotated[PGAsyncSession, Depends(get_db)]
Neo4jDep = Annotated[Neo4jSession, Depends(get_neo4j)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)
TokenDep = Annotated[str | None, Depends(oauth2_scheme)]


# TODO: C 实现 get_current_user — 从 Token 解析用户 ID，查询数据库返回 User 对象
async def get_current_user(token: TokenDep, db: DbDep):
    """
    Placeholder — 由 C 用户认证模块实现。
    1. 解析 JWT token 获取 user_id
    2. 从 PostgreSQL 查询 User
    3. 若 token 无效或用户不存在则 raise HTTPException(401)
    """
    if token is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="未提供认证令牌")
    # TODO: 实现 JWT 解析和用户查询
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="get_current_user 待实现")


CurrentUser = Annotated[None, Depends(get_current_user)]  # TODO: 替换 None 为 User 类型


# TODO: C 实现 get_current_admin — 检查用户 role == "admin"
async def get_current_admin(current_user: CurrentUser):
    raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="get_current_admin 待实现")


CurrentAdmin = Annotated[None, Depends(get_current_admin)]
