"""可视化数据 API — 数据结构初始状态与操作步骤模拟。

数据由 C++ CLI (algorithms/dsa-cli) 提供，Python 层通过
algorithm_runner -> visualization_service 两级封装后在此暴露为 HTTP 端点。
"""

from fastapi import APIRouter, HTTPException

from app.services.visualization_service import (
    get_initial_state,
    execute_step,
)

router = APIRouter(prefix="/visualization", tags=["可视化"])

SUPPORTED_TYPES = ["array", "linked-list", "stack", "queue", "binary-tree", "bst", "graph"]


@router.get("/{ds_type}")
async def get_state(ds_type: str):
    """获取指定数据结构的初始状态数据。"""
    if ds_type not in SUPPORTED_TYPES:
        raise HTTPException(status_code=400, detail=f"不支持的类型: {ds_type}。可选: {SUPPORTED_TYPES}")
    try:
        return get_initial_state(ds_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"可视化状态生成失败: {e}")


@router.post("/{ds_type}/step")
async def do_step(ds_type: str, operation: dict):
    """执行一步操作，返回操作后的新状态。

    operation 格式: {"action": "insert", "value": 5, "position": 2, "data": [...]}
    """
    if ds_type not in SUPPORTED_TYPES:
        raise HTTPException(status_code=400, detail=f"不支持的类型: {ds_type}")
    try:
        return execute_step(ds_type, operation)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"操作执行失败: {e}")
