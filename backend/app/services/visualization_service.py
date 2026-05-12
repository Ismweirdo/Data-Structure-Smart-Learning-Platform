"""Visualization state service.

Generates initial-state and step-operation JSON for every supported
data-structure type.  All algorithm data comes from the C++ CLI via
`app.services.algorithm_runner`.
"""

from app.services.algorithm_runner import (
    init_array,
    init_linked_list,
    init_stack,
    init_queue,
    init_bst,
    init_graph,
    step_array_insert,
    step_array_delete,
    step_linked_list_insert,
    step_linked_list_delete,
    step_stack_push,
    step_stack_pop,
    step_queue_enqueue,
    step_queue_dequeue,
    step_bst_insert,
    AlgorithmError,
)

# ── default seed data per type ──────────────────────────────────────

_DEFAULT_DATA: dict[str, list[int]] = {
    "array":        [5, 3, 8, 1, 9],
    "linked-list":  [10, 20, 30],
    "stack":        [1, 2, 3],
    "queue":        [1, 2, 3],
    "binary-tree":  [8, 3, 10, 1, 6, 14],
    "bst":          [8, 3, 10, 1, 6, 14],
    "graph":        [],  # graph uses string nodes, handled separately
}

_DEFAULT_GRAPH_NODES = ["A", "B", "C", "D", "E"]
_DEFAULT_GRAPH_EDGES = [
    ("A", "B", 4), ("A", "C", 2), ("B", "C", 1),
    ("B", "D", 5), ("C", "D", 8), ("C", "E", 10), ("D", "E", 2),
]


# ── initial state ───────────────────────────────────────────────────


def get_initial_state(ds_type: str) -> dict:
    """Return the initial-state JSON for *ds_type*."""
    ds_type = ds_type.lower()

    if ds_type == "array":
        return init_array(_DEFAULT_DATA["array"])
    elif ds_type == "linked-list":
        return init_linked_list(_DEFAULT_DATA["linked-list"])
    elif ds_type == "stack":
        return init_stack(_DEFAULT_DATA["stack"])
    elif ds_type == "queue":
        return init_queue(_DEFAULT_DATA["queue"])
    elif ds_type in ("binary-tree", "bst"):
        # binary-tree uses BST insertion to build a tree shape
        state = init_bst(_DEFAULT_DATA["bst"])
        state["type"] = ds_type
        return state
    elif ds_type == "graph":
        return init_graph(_DEFAULT_GRAPH_NODES, _DEFAULT_GRAPH_EDGES)
    else:
        raise ValueError(f"不支持的数据结构类型: {ds_type}")


# ── step operations ─────────────────────────────────────────────────


def execute_step(ds_type: str, operation: dict) -> dict:
    """Execute one operation and return the resulting state + steps."""
    ds_type = ds_type.lower()
    action = operation.get("action", "")
    value = operation.get("value")
    position = operation.get("position")
    data = operation.get("data") or _DEFAULT_DATA.get(ds_type, [])

    try:
        if ds_type == "array":
            return _step_array(data, action, value, position)
        elif ds_type == "linked-list":
            return _step_linked_list(data, action, value, position)
        elif ds_type == "stack":
            return _step_stack(data, action, value)
        elif ds_type == "queue":
            return _step_queue(data, action, value)
        elif ds_type in ("binary-tree", "bst"):
            return _step_bst(data, action, value)
        elif ds_type == "graph":
            return _step_graph(operation, action)
        else:
            raise ValueError(f"不支持的数据结构类型: {ds_type}")
    except AlgorithmError as e:
        raise ValueError(f"操作执行失败: {e}")


def _step_array(data, action, value, position):
    if action == "insert":
        if position is None or value is None:
            raise ValueError("insert 操作需要 position 和 value")
        return step_array_insert(data, position, value)
    elif action == "delete":
        if position is None:
            raise ValueError("delete 操作需要 position")
        return step_array_delete(data, position)
    else:
        raise ValueError(f"array 不支持的操作: {action}")


def _step_linked_list(data, action, value, position):
    if action == "insert":
        if position is None or value is None:
            raise ValueError("insert 操作需要 position 和 value")
        return step_linked_list_insert(data, position, value)
    elif action == "delete":
        if position is None:
            raise ValueError("delete 操作需要 position")
        return step_linked_list_delete(data, position)
    else:
        raise ValueError(f"linked-list 不支持的操作: {action}")


def _step_stack(data, action, value):
    if action == "push":
        if value is None:
            raise ValueError("push 操作需要 value")
        return step_stack_push(data, value)
    elif action == "pop":
        return step_stack_pop(data)
    else:
        raise ValueError(f"stack 不支持的操作: {action}")


def _step_queue(data, action, value):
    if action == "enqueue":
        if value is None:
            raise ValueError("enqueue 操作需要 value")
        return step_queue_enqueue(data, value)
    elif action == "dequeue":
        return step_queue_dequeue(data)
    else:
        raise ValueError(f"queue 不支持的操作: {action}")


def _step_bst(data, action, value):
    if action == "insert":
        if value is None:
            raise ValueError("insert 操作需要 value")
        return step_bst_insert(data, value)
    else:
        raise ValueError(f"bst 不支持的操作: {action}")


def _step_graph(operation, action):
    raise ValueError("graph 步骤操作待实现 — 使用 /traverse 端点进行 BFS/DFS")
