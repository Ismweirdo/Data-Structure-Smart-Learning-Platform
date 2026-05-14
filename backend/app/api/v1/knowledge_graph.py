import uuid

from fastapi import APIRouter, HTTPException, Query

from app.api.deps import DbDep, Neo4jDep
from app.schemas.knowledge import (
    KnowledgeGraphResponse,
    KnowledgePointCreate,
    KnowledgePointResponse,
    KnowledgePointUpdate,
    LearningPathRequest,
    LearningPathResponse,
)
from app.services.kg_service import (
    create_knowledge_point,
    delete_knowledge_point,
    find_learning_path,
    get_full_graph,
    get_knowledge_point,
    get_knowledge_points,
    update_knowledge_point,
)

router = APIRouter(prefix="/knowledge-graph", tags=["知识图谱"])


@router.get("/nodes", response_model=list[KnowledgePointResponse])
async def list_nodes(
    db: DbDep,
    category: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
):
    """知识点列表查询 — 支持按分类筛选和分页"""
    points = await get_knowledge_points(db, category, page, page_size)
    return points


@router.get("/nodes/{node_id}", response_model=KnowledgePointResponse)
async def get_node(node_id: uuid.UUID, db: DbDep):
    """知识点详情查询"""
    point = await get_knowledge_point(db, node_id)
    if not point:
        raise HTTPException(status_code=404, detail="知识点不存在")
    return point


@router.get("/graph", response_model=KnowledgeGraphResponse)
async def get_graph(neo4j: Neo4jDep, db: DbDep, user_id: uuid.UUID | None = None):
    """获取完整知识图谱数据 — 调用 kg_service.get_full_graph"""
    graph = await get_full_graph(neo4j, db, user_id)
    return graph


@router.get("/recommend/{user_id}")
async def recommend(user_id: uuid.UUID, neo4j: Neo4jDep, db: DbDep):
    """推荐下一个学习知识点 — 调用 kg_service.recommend_next_nodes"""
    from app.services.kg_service import recommend_next_nodes
    nodes = await recommend_next_nodes(neo4j, db, user_id)
    return {"recommended_nodes": nodes}


@router.post("/path", response_model=LearningPathResponse)
async def learning_path(data: LearningPathRequest, neo4j: Neo4jDep):
    """两知识点间学习路径查询 — 使用 BFS 算法查找最短路径"""
    path = await find_learning_path(neo4j, data.source_node_id, data.target_node_id)
    if not path:
        raise HTTPException(status_code=404, detail="未找到从源知识点到目标知识点的学习路径")
    return path


@router.post("/nodes", status_code=201, response_model=KnowledgePointResponse)
async def create_node(data: KnowledgePointCreate, db: DbDep, neo4j: Neo4jDep):
    """创建知识点（管理员）"""
    point = await create_knowledge_point(db, neo4j, data)
    return point


@router.put("/nodes/{node_id}", response_model=KnowledgePointResponse)
async def update_node(node_id: uuid.UUID, data: KnowledgePointUpdate, db: DbDep, neo4j: Neo4jDep):
    """更新知识点（管理员）"""
    point = await update_knowledge_point(db, neo4j, node_id, data)
    if not point:
        raise HTTPException(status_code=404, detail="知识点不存在")
    return point


@router.delete("/nodes/{node_id}", status_code=204)
async def delete_node(node_id: uuid.UUID, db: DbDep, neo4j: Neo4jDep):
    """删除知识点（管理员）"""
    success = await delete_knowledge_point(db, neo4j, node_id)
    if not success:
        raise HTTPException(status_code=404, detail="知识点不存在")