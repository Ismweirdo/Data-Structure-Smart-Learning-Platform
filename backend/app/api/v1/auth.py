# TODO: C 用户认证模块 — 实现注册、登录、获取当前用户 API

from fastapi import APIRouter, status

from app.api.deps import DbDep
from app.schemas.user import UserLoginRequest, UserRegisterRequest

router = APIRouter(prefix="/auth", tags=["认证"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(data: UserRegisterRequest, db: DbDep):
    """
    TODO: C 用户注册
    1. 检查 username/email 是否已存在
    2. hash_password 后创建 User 记录
    3. 返回 UserResponse
    """
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="注册接口待实现 — C 用户认证模块")


@router.post("/login")
async def login(data: UserLoginRequest, db: DbDep):
    """
    TODO: C 用户登录
    1. 查询用户并验证密码
    2. 生成 access_token + refresh_token
    3. 返回 TokenResponse
    """
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="登录接口待实现 — C 用户认证模块")


@router.get("/me")
async def me():
    """TODO: C 获取当前登录用户信息 — 依赖 get_current_user"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="用户信息接口待实现 — C 用户认证模块")
