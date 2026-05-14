import uuid
from typing import Any, Dict, List, Optional

from neo4j import AsyncSession as Neo4jSession
from sqlalchemy.ext.asyncio import AsyncSession as PGAsyncSession

from app.knowledge_graph.queries import (
    CREATE_NODE,
    DELETE_NODE,
    FIND_LEARNING_PATH,
    FULL_GRAPH,
    UPDATE_NODE,
)
from app.models.knowledge import KnowledgePoint
from app.schemas.knowledge import (
    KnowledgeGraphEdge,
    KnowledgeGraphNode,
    KnowledgeGraphResponse,
    KnowledgePointCreate,
    KnowledgePointUpdate,
    LearningPathResponse,
)


async def get_full_graph(
    neo4j: Neo4jSession, db: PGAsyncSession, user_id: Optional[uuid.UUID] = None
) -> KnowledgeGraphResponse:
    """查询完整知识图谱（节点+边），可选叠加用户掌握度"""
    result = await neo4j.run(FULL_GRAPH)
    records = await result.data()
    
    nodes: Dict[str, Dict[str, Any]] = {}
    edges: List[Dict[str, Any]] = []
    
    for record in records:
        node = record["n"]
        node_id = node["id"]
        if node_id not in nodes:
            nodes[node_id] = {
                "id": node_id,
                "name": node["name"],
                "category": node.get("category", ""),
                "difficulty": node.get("difficulty", 1),
                "user_mastery": None,
            }
        
        relation = record.get("r")
        target_node = record.get("m")
        if relation and target_node:
            edges.append({
                "source": node_id,
                "target": target_node["id"],
                "relation": relation.type,
            })
    
    return KnowledgeGraphResponse(
        nodes=[KnowledgeGraphNode(**node) for node in nodes.values()],
        edges=[KnowledgeGraphEdge(**edge) for edge in edges],
    )


async def get_knowledge_points(
    db: PGAsyncSession, category: Optional[str] = None, page: int = 1, page_size: int = 50
) -> List[KnowledgePoint]:
    """知识点列表查询 — 支持按分类筛选和分页"""
    query = KnowledgePoint.query
    if category:
        query = query.filter(KnowledgePoint.category == category)
    
    offset = (page - 1) * page_size
    return await query.offset(offset).limit(page_size).all()


async def get_knowledge_point(db: PGAsyncSession, node_id: uuid.UUID) -> Optional[KnowledgePoint]:
    """知识点详情查询"""
    return await KnowledgePoint.query.filter(KnowledgePoint.id == node_id).first()


async def create_knowledge_point(
    db: PGAsyncSession, neo4j: Neo4jSession, data: KnowledgePointCreate
) -> KnowledgePoint:
    """创建知识点（管理员）"""
    node_id = uuid.uuid4()
    
    await neo4j.run(
        CREATE_NODE,
        {
            "id": str(node_id),
            "name": data.name,
            "description": data.description,
            "difficulty": data.difficulty,
            "category": data.category,
            "order_index": data.order_index,
            "created_at": "now()",
        },
    )
    
    point = KnowledgePoint(
        id=node_id,
        neo4j_node_id=str(node_id),
        name=data.name,
        description=data.description,
        difficulty=data.difficulty,
        category=data.category,
        order_index=data.order_index,
    )
    
    db.add(point)
    await db.commit()
    await db.refresh(point)
    
    return point


async def update_knowledge_point(
    db: PGAsyncSession, neo4j: Neo4jSession, node_id: uuid.UUID, data: KnowledgePointUpdate
) -> Optional[KnowledgePoint]:
    """更新知识点（管理员）"""
    props = {k: v for k, v in data.dict(exclude_unset=True).items()}
    
    if props:
        await neo4j.run(UPDATE_NODE, {"id": str(node_id), "props": props})
    
    point = await get_knowledge_point(db, node_id)
    if not point:
        return None
    
    for key, value in props.items():
        setattr(point, key, value)
    
    await db.commit()
    await db.refresh(point)
    
    return point


async def delete_knowledge_point(db: PGAsyncSession, neo4j: Neo4jSession, node_id: uuid.UUID) -> bool:
    """删除知识点（管理员）"""
    await neo4j.run(DELETE_NODE, {"id": str(node_id)})
    
    point = await get_knowledge_point(db, node_id)
    if point:
        await db.delete(point)
        await db.commit()
        return True
    
    return False


async def find_learning_path(
    neo4j: Neo4jSession, source_id: str, target_id: str
) -> Optional[LearningPathResponse]:
    """查找两知识点之间的最短学习路径 — 使用 BFS 算法"""
    result = await neo4j.run(FIND_LEARNING_PATH, {"source_id": source_id, "target_id": target_id})
    record = await result.single()
    
    if not record or not record["path"]:
        return None
    
    path = record["path"]
    return LearningPathResponse(
        path=path,
        total_steps=len(path) - 1,
        estimated_hours=len(path) * 0.5,
    )