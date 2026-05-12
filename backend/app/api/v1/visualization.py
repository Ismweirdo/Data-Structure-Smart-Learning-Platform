from fastapi import APIRouter

from app.schemas.knowledge import KnowledgeGraphResponse

router = APIRouter(prefix="/visualization", tags=["可视化"])


# In-memory store for visualization states (production: use Redis)
_vis_states: dict[str, dict] = {}


@router.get("/{ds_type}")
async def get_initial_state(ds_type: str):
    """Get initial visualization state for a data structure type."""
    initializers = {
        "array": lambda: {"nodes": [{"id": i, "value": v} for i, v in enumerate([5, 3, 8, 1, 9])]},
        "linked-list": lambda: {
            "nodes": [
                {"id": "n1", "value": 10, "next": "n2"},
                {"id": "n2", "value": 20, "next": "n3"},
                {"id": "n3", "value": 30, "next": None},
            ]
        },
        "stack": lambda: {"stack": [1, 2, 3], "top": 3},
        "queue": lambda: {"queue": [1, 2, 3], "front": 0, "rear": 2},
        "binary-tree": lambda: {
            "root": {
                "value": 8,
                "left": {"value": 3, "left": {"value": 1}, "right": {"value": 6}},
                "right": {"value": 10, "right": {"value": 14}},
            }
        },
        "bst": lambda: {
            "root": {
                "value": 10,
                "left": {"value": 5, "left": {"value": 2}, "right": {"value": 7}},
                "right": {"value": 15, "left": {"value": 12}, "right": {"value": 18}},
            }
        },
        "graph": lambda: {
            "nodes": [
                {"id": "A"}, {"id": "B"}, {"id": "C"}, {"id": "D"}, {"id": "E"}
            ],
            "edges": [
                {"source": "A", "target": "B", "weight": 4},
                {"source": "A", "target": "C", "weight": 2},
                {"source": "B", "target": "C", "weight": 1},
                {"source": "B", "target": "D", "weight": 5},
                {"source": "C", "target": "D", "weight": 8},
                {"source": "C", "target": "E", "weight": 10},
                {"source": "D", "target": "E", "weight": 2},
            ],
        },
    }

    init_fn = initializers.get(ds_type)
    if init_fn is None:
        return {"error": f"未知的数据结构类型: {ds_type}"}
    return init_fn()
