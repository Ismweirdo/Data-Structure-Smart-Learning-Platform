# TODO: D 知识图谱 API 模块 — 实现 Neo4j 图查询、节点管理、路径查找

import uuid

from neo4j import AsyncSession as Neo4jSession
from sqlalchemy.ext.asyncio import AsyncSession as PGAsyncSession


async def get_full_graph(neo4j: Neo4jSession, db: PGAsyncSession, user_id: uuid.UUID | None = None):
    """TODO: D 查询完整知识图谱（节点+边），可选叠加用户掌握度"""
    raise NotImplementedError("get_full_graph 待实现 — D 知识图谱 API 模块")


async def recommend_next_nodes(neo4j: Neo4jSession, db: PGAsyncSession, user_id: uuid.UUID) -> list[str]:
    """TODO: G 推荐下一个学习节点 — 基于已掌握前置知识的前沿节点"""
    raise NotImplementedError("recommend_next_nodes 待实现 — G 推荐引擎模块")


async def find_learning_path(neo4j: Neo4jSession, source_id: str, target_id: str):
    """TODO: D 查找两知识点之间的最短学习路径"""
    raise NotImplementedError("find_learning_path 待实现 — D 知识图谱 API 模块")
