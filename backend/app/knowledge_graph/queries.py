"""
Cypher query templates for knowledge graph operations.
"""

# 获取某个知识点的所有前置依赖（递归）
PREREQUISITE_TREE = """
    MATCH path = (start:KnowledgeNode {id: $node_id})-[:PREREQUISITE_OF*]->(end:KnowledgeNode)
    RETURN end, length(path) as depth
    ORDER BY depth
"""

# 获取某个知识点的所有后继知识（递归）
SUCCESSOR_TREE = """
    MATCH path = (start:KnowledgeNode {id: $node_id})<-[:PREREQUISITE_OF*]-(end:KnowledgeNode)
    RETURN end, length(path) as depth
    ORDER BY depth
"""

# 知识盲区检测：用户未掌握但目标知识点的前置
KNOWLEDGE_GAP = """
    MATCH (kp:KnowledgeNode)-[:PREREQUISITE_OF*1..3]->(target:KnowledgeNode {id: $target_id})
    WHERE NOT EXISTS {
        MATCH (kp)-[:MASTERED_BY {score: > 0.7}]->(:User {id: $user_id})
    }
    RETURN kp.id, kp.name, kp.difficulty
    ORDER BY kp.difficulty
"""

# 最短学习路径
SHORTEST_LEARNING_PATH = """
    MATCH path = shortestPath(
        (start:KnowledgeNode {id: $source})-[:PREREQUISITE_OF*..10]->(end:KnowledgeNode {id: $target})
    )
    RETURN [node in nodes(path) | {id: node.id, name: node.name}] AS nodes,
           length(path) AS steps
"""

# 知识图谱全量数据（带关系类型）
FULL_GRAPH = """
    MATCH (n:KnowledgeNode)
    OPTIONAL MATCH (n)-[r:PREREQUISITE_OF|SUBTOPIC_OF|RELATED_TO]->(m:KnowledgeNode)
    RETURN n, type(r) as relation, m
    ORDER BY n.category, n.name
"""

# 推荐下一个学习节点（前沿节点）
RECOMMEND_FRONTIER = """
    MATCH (pre:KnowledgeNode)-[:PREREQUISITE_OF]->(next:KnowledgeNode)
    WHERE EXISTS {
        MATCH (pre)-[:MASTERED_BY {score: > 0.7}]->(:User {id: $user_id})
    }
    AND NOT EXISTS {
        MATCH (next)-[:MASTERED_BY {score: > 0.7}]->(:User {id: $user_id})
    }
    RETURN next.id, next.name, next.difficulty, next.category
    ORDER BY next.difficulty ASC
    LIMIT $limit
"""

# 某分类下的所有知识点
CATEGORY_NODES = """
    MATCH (n:KnowledgeNode {category: $category})
    RETURN n
    ORDER BY n.difficulty, n.name
"""

# 创建知识点节点
CREATE_NODE = """
    CREATE (n:KnowledgeNode {
        id: $id,
        name: $name,
        description: $description,
        difficulty: $difficulty,
        category: $category,
        order_index: $order_index,
        created_at: datetime()
    })
    RETURN n
"""

# 更新知识点节点
UPDATE_NODE = """
    MATCH (n:KnowledgeNode {id: $id})
    SET n += $props
    RETURN n
"""

# 删除知识点节点（级联删除相关关系）
DELETE_NODE = """
    MATCH (n:KnowledgeNode {id: $id})
    DETACH DELETE n
"""

# 查找学习路径（使用最短路径算法）
FIND_LEARNING_PATH = """
    MATCH path = shortestPath(
        (source:KnowledgeNode {id: $source_id})-[*..10]->(target:KnowledgeNode {id: $target_id})
    )
    RETURN [node in nodes(path) | node.id] AS path
"""

# 创建关系
CREATE_RELATION = """
    MATCH (a:KnowledgeNode {id: $source_id}), (b:KnowledgeNode {id: $target_id})
    MERGE (a)-[:%s]->(b)
    RETURN a, b
"""

# 查询某个知识点的直接前置依赖
DIRECT_PREREQUISITES = """
    MATCH (pre:KnowledgeNode)-[:PREREQUISITE_OF]->(target:KnowledgeNode {id: $target_id})
    RETURN pre
"""

# 查询某个知识点的直接后继知识
DIRECT_SUCCESSORS = """
    MATCH (source:KnowledgeNode {id: $source_id})-[:PREREQUISITE_OF]->(next:KnowledgeNode)
    RETURN next
"""

# 统计各分类知识点数量
CATEGORY_STATS = """
    MATCH (n:KnowledgeNode)
    RETURN n.category as category, count(n) as count
    ORDER BY count DESC
"""

# 按难度查询知识点
DIFFICULTY_NODES = """
    MATCH (n:KnowledgeNode)
    WHERE n.difficulty = $difficulty
    RETURN n
    ORDER BY n.category, n.name
"""