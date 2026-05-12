# TODO: D 知识图谱 API 模块 — 实现知识点 CRUD、图查询、路径查找

import uuid

from fastapi import APIRouter, Query

from app.api.deps import DbDep, Neo4jDep
from app.schemas.knowledge import (
    KnowledgePointCreate,
    KnowledgePointUpdate,
    LearningPathRequest,
)

router = APIRouter(prefix="/knowledge-graph", tags=["知识图谱"])


@router.get("/nodes")
async def list_nodes(
    db: DbDep,
    category: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """TODO: D 知识点列表查询 — 支持按分类筛选和分页"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="知识点列表接口待实现 — D")


@router.get("/nodes/{node_id}")
async def get_node(node_id: uuid.UUID, db: DbDep):
    """TODO: D 知识点详情查询"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="知识点详情接口待实现 — D")


@router.get("/graph")
async def get_graph(neo4j: Neo4jDep, db: DbDep, user_id: uuid.UUID | None = None):
    """TODO: D 获取完整知识图谱数据 — 调用 kg_service.get_full_graph"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="知识图谱接口待实现 — D")


@router.get("/recommend/{user_id}")
async def recommend(user_id: uuid.UUID, neo4j: Neo4jDep, db: DbDep):
    """TODO: G 推荐下一个学习知识点 — 调用 kg_service.recommend_next_nodes"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="推荐接口待实现 — G")


@router.post("/path")
async def learning_path(data: LearningPathRequest, neo4j: Neo4jDep):
    """TODO: D 两知识点间学习路径查询 — 调用 kg_service.find_learning_path"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="路径查询接口待实现 — D")


@router.post("/nodes", status_code=201)
async def create_node(data: KnowledgePointCreate, db: DbDep):
    """TODO: D 创建知识点（管理员）"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="创建知识点接口待实现 — D")


@router.put("/nodes/{node_id}")
async def update_node(node_id: uuid.UUID, data: KnowledgePointUpdate, db: DbDep):
    """TODO: D 更新知识点（管理员）"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="更新知识点接口待实现 — D")


@router.delete("/nodes/{node_id}", status_code=204)
async def delete_node(node_id: uuid.UUID, db: DbDep):
    """TODO: D 删除知识点（管理员）"""
    from fastapi import HTTPException
    raise HTTPException(status_code=501, detail="删除知识点接口待实现 — D")
