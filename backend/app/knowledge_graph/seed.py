"""
Seed script to initialize the knowledge graph with core data structure concepts.

Run via: python -m app.knowledge_graph.seed
"""

import asyncio

from neo4j import AsyncGraphDatabase

from app.core.config import settings

SEED_DATA = [
    # (node_id, name, description, difficulty, category)
    ("kp_001", "线性表", "具有相同数据类型的 n 个数据元素的有限序列", 1, "linear"),
    ("kp_002", "顺序表", "用一组地址连续的存储单元依次存储线性表的数据元素", 2, "linear"),
    ("kp_003", "链表", "通过指针链接的节点组成的线性表", 2, "linear"),
    ("kp_004", "单链表", "每个节点只有一个指向后继的指针", 2, "linear"),
    ("kp_005", "双向链表", "节点同时有前驱指针和后继指针", 3, "linear"),
    ("kp_006", "栈", "只能在表尾进行插入和删除的线性表（LIFO）", 2, "linear"),
    ("kp_007", "队列", "只能在表尾插入、表头删除的线性表（FIFO）", 2, "linear"),
    ("kp_008", "二叉树", "每个节点最多有两个子树的树形结构", 2, "tree"),
    ("kp_009", "二叉树的遍历", "按某种顺序访问二叉树的所有节点（前序、中序、后序、层序）", 3, "tree"),
    ("kp_010", "二叉搜索树", "左子树 < 根 < 右子树的二叉树（BST）", 3, "tree"),
    ("kp_011", "平衡二叉树", "左右子树高度差不超过 1 的二叉搜索树（AVL）", 4, "tree"),
    ("kp_012", "堆", "一种特殊的完全二叉树（大顶堆/小顶堆）", 3, "tree"),
    ("kp_013", "哈夫曼树", "带权路径长度最短的二叉树", 4, "tree"),
    ("kp_014", "图的基本概念", "图 G=(V,E) 的定义、分类和基本术语", 2, "graph"),
    ("kp_015", "图的存储结构", "邻接矩阵、邻接表、十字链表等存储方式", 3, "graph"),
    ("kp_016", "图的遍历", "深度优先搜索(DFS)和广度优先搜索(BFS)", 3, "graph"),
    ("kp_017", "最小生成树", "连通网的最小代价生成树（Prim 和 Kruskal 算法）", 4, "graph"),
    ("kp_018", "最短路径", "单源最短路径(Dijkstra)和多源最短路径(Floyd)", 4, "graph"),
    ("kp_019", "拓扑排序", "AOV-网的顶点线性序列", 3, "graph"),
    ("kp_020", "排序算法", "将无序序列变为有序序列的算法", 2, "sort"),
    ("kp_021", "冒泡排序", "依次比较相邻元素并交换", 1, "sort"),
    ("kp_022", "快速排序", "基于分治的交换排序，平均 O(n log n)", 3, "sort"),
    ("kp_023", "归并排序", "基于分治的归并操作排序", 3, "sort"),
    ("kp_024", "堆排序", "利用堆数据结构进行排序", 4, "sort"),
    ("kp_025", "查找算法", "在数据集合中查找特定元素的算法", 2, "search"),
    ("kp_026", "顺序查找", "从一端向另一端逐个查找", 1, "search"),
    ("kp_027", "二分查找", "在有序表中折半查找，O(log n)", 2, "search"),
    ("kp_028", "哈希表", "通过哈希函数建立键值映射的查找结构", 4, "search"),
    ("kp_029", "算法复杂度", "时间复杂度与空间复杂度的分析方法（大 O 表示法）", 1, "other"),
    ("kp_030", "递归", "函数直接或间接调用自身的编程技巧", 2, "other"),
]

EDGES = [
    # (source_id, relation, target_id)
    # 线性结构层级
    ("kp_002", "SUBTOPIC_OF", "kp_001"),   # 顺序表 -> 线性表
    ("kp_003", "SUBTOPIC_OF", "kp_001"),   # 链表 -> 线性表
    ("kp_004", "SUBTOPIC_OF", "kp_003"),   # 单链表 -> 链表
    ("kp_005", "SUBTOPIC_OF", "kp_003"),   # 双向链表 -> 链表
    # 线性结构依赖
    ("kp_001", "PREREQUISITE_OF", "kp_006"),  # 线性表 -> 栈
    ("kp_001", "PREREQUISITE_OF", "kp_007"),  # 线性表 -> 队列
    # 树形结构层级
    ("kp_008", "PREREQUISITE_OF", "kp_009"),  # 二叉树 -> 二叉树遍历
    ("kp_008", "PREREQUISITE_OF", "kp_010"),  # 二叉树 -> BST
    ("kp_010", "PREREQUISITE_OF", "kp_011"),  # BST -> AVL
    ("kp_008", "PREREQUISITE_OF", "kp_012"),  # 二叉树 -> 堆
    ("kp_008", "PREREQUISITE_OF", "kp_013"),  # 二叉树 -> 哈夫曼树
    # 图结构层级
    ("kp_014", "PREREQUISITE_OF", "kp_015"),  # 图概念 -> 图存储
    ("kp_014", "PREREQUISITE_OF", "kp_016"),  # 图概念 -> 图遍历
    ("kp_015", "PREREQUISITE_OF", "kp_017"),  # 图存储 -> MST
    ("kp_016", "PREREQUISITE_OF", "kp_017"),  # 图遍历 -> MST
    ("kp_015", "PREREQUISITE_OF", "kp_018"),  # 图存储 -> 最短路径
    ("kp_014", "PREREQUISITE_OF", "kp_019"),  # 图概念 -> 拓扑排序
    # 算法依赖
    ("kp_029", "PREREQUISITE_OF", "kp_020"),  # 复杂度 -> 排序
    ("kp_029", "PREREQUISITE_OF", "kp_025"),  # 复杂度 -> 查找
    ("kp_020", "PREREQUISITE_OF", "kp_022"),  # 排序 -> 快排
    ("kp_020", "PREREQUISITE_OF", "kp_023"),  # 排序 -> 归并
    ("kp_030", "PREREQUISITE_OF", "kp_022"),  # 递归 -> 快排
    ("kp_030", "PREREQUISITE_OF", "kp_023"),  # 递归 -> 归并
    ("kp_025", "PREREQUISITE_OF", "kp_027"),  # 查找 -> 二分查找
    ("kp_025", "PREREQUISITE_OF", "kp_028"),  # 查找 -> 哈希表
    # 跨类别关联
    ("kp_012", "APPLIED_IN", "kp_024"),       # 堆 -> 堆排序
    ("kp_007", "APPLIED_IN", "kp_016"),       # 队列 -> BFS
    ("kp_006", "APPLIED_IN", "kp_016"),       # 栈 -> DFS
    ("kp_003", "APPLIED_IN", "kp_015"),       # 链表 -> 邻接表
    ("kp_002", "APPLIED_IN", "kp_015"),       # 顺序表 -> 邻接矩阵
]

CREATE_NODE = """
    CREATE (n:KnowledgeNode {id: $id, name: $name, description: $description,
                              difficulty: $difficulty, category: $category})
"""

CREATE_EDGE = """
    MATCH (a:KnowledgeNode {id: $source}), (b:KnowledgeNode {id: $target})
    MERGE (a)-[:%s]->(b)
"""


async def seed_knowledge_graph():
    driver = AsyncGraphDatabase.driver(
        settings.NEO4J_URI,
        auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD),
    )
    async with driver.session() as session:
        # Clear existing data
        await session.run("MATCH (n:KnowledgeNode) DETACH DELETE n")

        # Create nodes
        for node in SEED_DATA:
            await session.run(CREATE_NODE, id=node[0], name=node[1],
                              description=node[2], difficulty=node[3], category=node[4])

        # Create edges
        for edge in EDGES:
            query = CREATE_EDGE % edge[1]
            await session.run(query, source=edge[0], target=edge[2])

        print(f"Seeded {len(SEED_DATA)} knowledge nodes and {len(EDGES)} edges.")

    await driver.close()


if __name__ == "__main__":
    asyncio.run(seed_knowledge_graph())
