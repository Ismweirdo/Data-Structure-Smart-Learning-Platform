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
