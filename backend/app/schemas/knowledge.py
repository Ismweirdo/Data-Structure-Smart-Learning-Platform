import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class KnowledgePointCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    difficulty: int = Field(ge=1, le=5, default=1)
    category: str = Field(min_length=1, max_length=50)
    order_index: int = 0


class KnowledgePointUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    difficulty: int | None = Field(default=None, ge=1, le=5)
    category: str | None = None
    order_index: int | None = None


class KnowledgePointResponse(BaseModel):
    id: uuid.UUID
    neo4j_node_id: str
    name: str
    description: str | None = None
    difficulty: int
    category: str
    order_index: int
    created_at: datetime

    model_config = {"from_attributes": True}


class KnowledgeGraphNode(BaseModel):
    id: str
    name: str
    category: str
    difficulty: int
    user_mastery: float | None = None


class KnowledgeGraphEdge(BaseModel):
    source: str
    target: str
    relation: str


class KnowledgeGraphResponse(BaseModel):
    nodes: list[KnowledgeGraphNode]
    edges: list[KnowledgeGraphEdge]


class LearningPathRequest(BaseModel):
    source_node_id: str
    target_node_id: str
    strategy: str = "shortest"  # shortest | comprehensive | weak_fill


class LearningPathResponse(BaseModel):
    path: list[str]
    total_steps: int
    estimated_hours: float
