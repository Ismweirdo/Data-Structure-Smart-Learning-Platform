"""
Knowledge Graph Schema Definition.

Node Labels:
    - KnowledgeNode: 知识点
    - User: 用户（与 PostgreSQL users 表对应）

Relationship Types:
    - PREREQUISITE_OF: A 是 B 的前置知识
    - SUBTOPIC_OF: A 是 B 的子话题
    - RELATED_TO: A 与 B 相关
    - APPLIED_IN: A 知识点应用于某场景
    - MASTERED_BY: 用户对知识点的掌握程度
"""

# Relationship direction convention:
# (predecessor) -[:PREREQUISITE_OF]-> (successor)
# (child) -[:SUBTOPIC_OF]-> (parent)
# (A) -[:RELATED_TO]-> (B)
# (knowledge) -[:APPLIED_IN]-> (scenario description in relationship property)

KNOWLEDGE_CATEGORIES = [
    "linear",    # 线性结构: 顺序表、链表、栈、队列
    "tree",      # 树形结构: 二叉树、BST、AVL、堆、Huffman
    "graph",     # 图形结构: 图的存储、遍历、最短路径、MST、拓扑排序
    "sort",      # 排序算法: 冒泡、选择、插入、快速、归并、堆排序
    "search",    # 查找算法: 顺序查找、二分查找、哈希查找
    "other",     # 其他: 复杂度分析、递归、分治等
]

RELATION_TYPES = [
    "PREREQUISITE_OF",
    "SUBTOPIC_OF",
    "RELATED_TO",
    "APPLIED_IN",
    "MASTERED_BY",
]
