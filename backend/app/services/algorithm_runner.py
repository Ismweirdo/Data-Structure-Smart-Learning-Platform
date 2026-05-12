"""C++ CLI (dsa-cli) subprocess wrapper.

All data-structure state generation and algorithm step tracking
is delegated to the compiled C++ binary.  This module provides a
Pythonic interface that the rest of the backend consumes.
"""

import json
import os
import platform
import subprocess
from pathlib import Path

# Resolve once – the binary sits next to the C++ source in algorithms/
_BINARY_WIN = Path(__file__).resolve().parent.parent.parent.parent / "algorithms" / "dsa-cli"


class AlgorithmError(RuntimeError):
    """Raised when the CLI returns a non-OK status."""


def _win_to_wsl_path(p: Path) -> str:
    """Convert a Windows path (e.g. D:\\foo\\bar) to WSL path (/mnt/d/foo/bar)."""
    drive = p.drive[0].lower()
    rel = str(p).replace("\\", "/")[2:]  # strip "D:"
    return f"/mnt/{drive}{rel}"


def _run(*args: str) -> dict:
    """Invoke dsa-cli (via WSL if on Windows) and return parsed JSON."""
    is_win = platform.system() == "Windows"

    if is_win:
        wsl_bin = _win_to_wsl_path(_BINARY_WIN)
        cmd = ["wsl", wsl_bin, *args]
    else:
        cmd = [str(_BINARY_WIN), *args]

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=15,
            env={**os.environ, "WSL_UTF8": "1"},
        )
    except FileNotFoundError:
        raise AlgorithmError(
            f"dsa-cli binary not found at {_BINARY_WIN}.  "
            f"Compile with: g++ -std=c++17 algorithms/cli.cpp -o algorithms/dsa-cli"
        )
    except subprocess.TimeoutExpired:
        raise AlgorithmError(f"dsa-cli timed out: {' '.join(cmd)}")

    if proc.returncode != 0:
        raise AlgorithmError(f"dsa-cli exited {proc.returncode}: {proc.stderr.strip()}")

    data = json.loads(proc.stdout)
    if data.get("status") == "error":
        raise AlgorithmError(data.get("message", "unknown CLI error"))
    return data


# ─── init ───────────────────────────────────────────────────────────


def init_array(values: list[int]) -> dict:
    return _run("init", "array", _csv(values))["state"]


def init_linked_list(values: list[int]) -> dict:
    return _run("init", "linked-list", _csv(values))["state"]


def init_stack(values: list[int]) -> dict:
    return _run("init", "stack", _csv(values))["state"]


def init_queue(values: list[int]) -> dict:
    return _run("init", "queue", _csv(values))["state"]


def init_bst(values: list[int]) -> dict:
    return _run("init", "bst", _csv(values))["state"]


def init_graph(nodes: list[str], edges: list[tuple[str, str, int]] | None = None) -> dict:
    edge_str = ",".join(f"{s}-{t}:{w}" for s, t, w in (edges or []))
    return _run("init", "graph", ",".join(nodes), edge_str)["state"]


# ─── step ───────────────────────────────────────────────────────────


def step_array_insert(values: list[int], position: int, value: int) -> dict:
    return _run("step", "array", _csv(values), "insert", str(position), str(value))["result"]


def step_array_delete(values: list[int], position: int) -> dict:
    return _run("step", "array", _csv(values), "delete", str(position))["result"]


def step_linked_list_insert(values: list[int], position: int, value: int) -> dict:
    return _run("step", "linked-list", _csv(values), "insert", str(position), str(value))["result"]


def step_linked_list_delete(values: list[int], position: int) -> dict:
    return _run("step", "linked-list", _csv(values), "delete", str(position))["result"]


def step_stack_push(values: list[int], value: int) -> dict:
    return _run("step", "stack", _csv(values), "push", str(value))["result"]


def step_stack_pop(values: list[int]) -> dict:
    return _run("step", "stack", _csv(values), "pop")["result"]


def step_queue_enqueue(values: list[int], value: int) -> dict:
    return _run("step", "queue", _csv(values), "enqueue", str(value))["result"]


def step_queue_dequeue(values: list[int]) -> dict:
    return _run("step", "queue", _csv(values), "dequeue")["result"]


def step_bst_insert(values: list[int], value: int) -> dict:
    return _run("step", "bst", _csv(values), "insert", str(value))["result"]


# ─── sort ───────────────────────────────────────────────────────────


def sort_bubble(values: list[int]) -> dict:
    return _run("sort", "bubble", _csv(values))["result"]


def sort_selection(values: list[int]) -> dict:
    return _run("sort", "selection", _csv(values))["result"]


def sort_insertion(values: list[int]) -> dict:
    return _run("sort", "insertion", _csv(values))["result"]


def sort_quick(values: list[int]) -> dict:
    return _run("sort", "quick", _csv(values))["result"]


def sort_merge(values: list[int]) -> dict:
    return _run("sort", "merge", _csv(values))["result"]


def sort_heap(values: list[int]) -> dict:
    return _run("sort", "heap", _csv(values))["result"]


def sort_algorithm(algorithm: str, values: list[int]) -> dict:
    """Generic sort dispatcher.  *algorithm* must be one of the six supported names."""
    return _run("sort", algorithm, _csv(values))["result"]


# ─── search ─────────────────────────────────────────────────────────


def search_bst(values: list[int], target: int) -> dict:
    return _run("search", "bst", _csv(values), str(target))["result"]


# ─── traverse ───────────────────────────────────────────────────────


def traverse_graph_bfs(
    nodes: list[str],
    edges: list[tuple[str, str, int]],
    start: str,
) -> dict:
    edge_str = ",".join(f"{s}-{t}:{w}" for s, t, w in edges)
    return _run("traverse", "graph", ",".join(nodes), edge_str, "bfs", start)["result"]


def traverse_graph_dfs(
    nodes: list[str],
    edges: list[tuple[str, str, int]],
    start: str,
) -> dict:
    edge_str = ",".join(f"{s}-{t}:{w}" for s, t, w in edges)
    return _run("traverse", "graph", ",".join(nodes), edge_str, "dfs", start)["result"]


# ─── helpers ────────────────────────────────────────────────────────


def _csv(values: list[int]) -> str:
    return ",".join(str(v) for v in values)


def get_supported_types() -> dict:
    """Return the structures, algorithms, and traversals the CLI reports."""
    return _run("list")
