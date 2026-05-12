// ============================================================
// Data Structure Smart Learning Platform — Neo4j Seed Data
// Run: cypher-shell -u neo4j -p password -f neo4j_init.cypher
// ============================================================

// --- Clear existing data ---
MATCH (n) DETACH DELETE n;

// --- Constraints ---
CREATE CONSTRAINT knowledge_node_id IF NOT EXISTS FOR (n:KnowledgeNode) REQUIRE n.id IS UNIQUE;
CREATE CONSTRAINT user_id IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;

// --- Indexes ---
CREATE INDEX knowledge_name IF NOT EXISTS FOR (n:KnowledgeNode) ON (n.name);
CREATE INDEX knowledge_category IF NOT EXISTS FOR (n:KnowledgeNode) ON (n.category);
CREATE INDEX knowledge_difficulty IF NOT EXISTS FOR (n:KnowledgeNode) ON (n.difficulty);

// ============================================================
// Knowledge Nodes (30 core data structure concepts)
// ============================================================

// -- Category: linear (线性结构) --
CREATE (kp001:KnowledgeNode {id: 'kp_001', name: '线性表', description: '具有相同数据类型的 n 个数据元素的有限序列', difficulty: 1, category: 'linear'});
CREATE (kp002:KnowledgeNode {id: 'kp_002', name: '顺序表', description: '用一组地址连续的存储单元依次存储线性表的数据元素', difficulty: 2, category: 'linear'});
CREATE (kp003:KnowledgeNode {id: 'kp_003', name: '链表', description: '通过指针链接的节点组成的线性表', difficulty: 2, category: 'linear'});
CREATE (kp004:KnowledgeNode {id: 'kp_004', name: '单链表', description: '每个节点只有一个指向后继的指针', difficulty: 2, category: 'linear'});
CREATE (kp005:KnowledgeNode {id: 'kp_005', name: '双向链表', description: '节点同时有前驱指针和后继指针', difficulty: 3, category: 'linear'});
CREATE (kp006:KnowledgeNode {id: 'kp_006', name: '栈', description: '只能在表尾进行插入和删除的线性表（LIFO）', difficulty: 2, category: 'linear'});
CREATE (kp007:KnowledgeNode {id: 'kp_007', name: '队列', description: '只能在表尾插入、表头删除的线性表（FIFO）', difficulty: 2, category: 'linear'});

// -- Category: tree (树形结构) --
CREATE (kp008:KnowledgeNode {id: 'kp_008', name: '二叉树', description: '每个节点最多有两个子树的树形结构', difficulty: 2, category: 'tree'});
CREATE (kp009:KnowledgeNode {id: 'kp_009', name: '二叉树的遍历', description: '按某种顺序访问所有节点（前序、中序、后序、层序）', difficulty: 3, category: 'tree'});
CREATE (kp010:KnowledgeNode {id: 'kp_010', name: '二叉搜索树', description: '左子树 < 根 < 右子树的二叉树（BST）', difficulty: 3, category: 'tree'});
CREATE (kp011:KnowledgeNode {id: 'kp_011', name: '平衡二叉树', description: '左右子树高度差不超过 1 的 BST（AVL）', difficulty: 4, category: 'tree'});
CREATE (kp012:KnowledgeNode {id: 'kp_012', name: '堆', description: '一种特殊的完全二叉树（大顶堆/小顶堆）', difficulty: 3, category: 'tree'});
CREATE (kp013:KnowledgeNode {id: 'kp_013', name: '哈夫曼树', description: '带权路径长度最短的二叉树', difficulty: 4, category: 'tree'});

// -- Category: graph (图形结构) --
CREATE (kp014:KnowledgeNode {id: 'kp_014', name: '图的基本概念', description: '图 G=(V,E) 的定义、分类和基本术语', difficulty: 2, category: 'graph'});
CREATE (kp015:KnowledgeNode {id: 'kp_015', name: '图的存储结构', description: '邻接矩阵、邻接表、十字链表等', difficulty: 3, category: 'graph'});
CREATE (kp016:KnowledgeNode {id: 'kp_016', name: '图的遍历', description: '深度优先搜索(DFS)和广度优先搜索(BFS)', difficulty: 3, category: 'graph'});
CREATE (kp017:KnowledgeNode {id: 'kp_017', name: '最小生成树', description: '连通网的最小代价生成树（Prim、Kruskal）', difficulty: 4, category: 'graph'});
CREATE (kp018:KnowledgeNode {id: 'kp_018', name: '最短路径', description: '单源最短路径(Dijkstra)和多源最短路径(Floyd)', difficulty: 4, category: 'graph'});
CREATE (kp019:KnowledgeNode {id: 'kp_019', name: '拓扑排序', description: 'AOV-网的顶点线性序列', difficulty: 3, category: 'graph'});

// -- Category: sort (排序算法) --
CREATE (kp020:KnowledgeNode {id: 'kp_020', name: '排序算法概述', description: '将无序序列变为有序序列的算法总览', difficulty: 2, category: 'sort'});
CREATE (kp021:KnowledgeNode {id: 'kp_021', name: '冒泡排序', description: '依次比较相邻元素并交换，O(n²)', difficulty: 1, category: 'sort'});
CREATE (kp022:KnowledgeNode {id: 'kp_022', name: '快速排序', description: '基于分治的交换排序，平均 O(n log n)', difficulty: 3, category: 'sort'});
CREATE (kp023:KnowledgeNode {id: 'kp_023', name: '归并排序', description: '基于分治的归并操作排序，O(n log n)', difficulty: 3, category: 'sort'});
CREATE (kp024:KnowledgeNode {id: 'kp_024', name: '堆排序', description: '利用堆数据结构进行排序', difficulty: 4, category: 'sort'});

// -- Category: search (查找算法) --
CREATE (kp025:KnowledgeNode {id: 'kp_025', name: '查找算法概述', description: '在数据集合中查找特定元素的算法总览', difficulty: 2, category: 'search'});
CREATE (kp026:KnowledgeNode {id: 'kp_026', name: '顺序查找', description: '从一端向另一端逐个查找，O(n)', difficulty: 1, category: 'search'});
CREATE (kp027:KnowledgeNode {id: 'kp_027', name: '二分查找', description: '在有序表中折半查找，O(log n)', difficulty: 2, category: 'search'});
CREATE (kp028:KnowledgeNode {id: 'kp_028', name: '哈希表', description: '通过哈希函数建立键值映射的查找结构', difficulty: 4, category: 'search'});

// -- Category: other (基础概念) --
CREATE (kp029:KnowledgeNode {id: 'kp_029', name: '算法复杂度', description: '时间复杂度与空间复杂度分析（大 O 表示法）', difficulty: 1, category: 'other'});
CREATE (kp030:KnowledgeNode {id: 'kp_030', name: '递归', description: '函数直接或间接调用自身的编程技巧', difficulty: 2, category: 'other'});

// ============================================================
// Relationships
// ============================================================

// --- SUBTOPIC_OF (层级包含关系) ---
MATCH (a {id: 'kp_002'}), (b {id: 'kp_001'}) CREATE (a)-[:SUBTOPIC_OF]->(b);
MATCH (a {id: 'kp_003'}), (b {id: 'kp_001'}) CREATE (a)-[:SUBTOPIC_OF]->(b);
MATCH (a {id: 'kp_004'}), (b {id: 'kp_003'}) CREATE (a)-[:SUBTOPIC_OF]->(b);
MATCH (a {id: 'kp_005'}), (b {id: 'kp_003'}) CREATE (a)-[:SUBTOPIC_OF]->(b);

// --- PREREQUISITE_OF (前置依赖关系) ---
MATCH (a {id: 'kp_001'}), (b {id: 'kp_006'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_001'}), (b {id: 'kp_007'}) CREATE (a)-[:PREREQUISITE_OF]->(b);

MATCH (a {id: 'kp_008'}), (b {id: 'kp_009'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_008'}), (b {id: 'kp_010'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_010'}), (b {id: 'kp_011'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_008'}), (b {id: 'kp_012'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_008'}), (b {id: 'kp_013'}) CREATE (a)-[:PREREQUISITE_OF]->(b);

MATCH (a {id: 'kp_014'}), (b {id: 'kp_015'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_014'}), (b {id: 'kp_016'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_015'}), (b {id: 'kp_017'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_016'}), (b {id: 'kp_017'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_015'}), (b {id: 'kp_018'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_014'}), (b {id: 'kp_019'}) CREATE (a)-[:PREREQUISITE_OF]->(b);

MATCH (a {id: 'kp_029'}), (b {id: 'kp_020'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_029'}), (b {id: 'kp_025'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_020'}), (b {id: 'kp_022'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_020'}), (b {id: 'kp_023'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_030'}), (b {id: 'kp_022'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_030'}), (b {id: 'kp_023'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_025'}), (b {id: 'kp_027'}) CREATE (a)-[:PREREQUISITE_OF]->(b);
MATCH (a {id: 'kp_025'}), (b {id: 'kp_028'}) CREATE (a)-[:PREREQUISITE_OF]->(b);

// Sort subtopics
MATCH (a {id: 'kp_021'}), (b {id: 'kp_020'}) CREATE (a)-[:SUBTOPIC_OF]->(b);
MATCH (a {id: 'kp_022'}), (b {id: 'kp_020'}) CREATE (a)-[:SUBTOPIC_OF]->(b);
MATCH (a {id: 'kp_023'}), (b {id: 'kp_020'}) CREATE (a)-[:SUBTOPIC_OF]->(b);
MATCH (a {id: 'kp_024'}), (b {id: 'kp_020'}) CREATE (a)-[:SUBTOPIC_OF]->(b);

// Search subtopics
MATCH (a {id: 'kp_026'}), (b {id: 'kp_025'}) CREATE (a)-[:SUBTOPIC_OF]->(b);
MATCH (a {id: 'kp_027'}), (b {id: 'kp_025'}) CREATE (a)-[:SUBTOPIC_OF]->(b);
MATCH (a {id: 'kp_028'}), (b {id: 'kp_025'}) CREATE (a)-[:SUBTOPIC_OF]->(b);

// --- APPLIED_IN (跨类别应用关系) ---
MATCH (a {id: 'kp_012'}), (b {id: 'kp_024'}) CREATE (a)-[:APPLIED_IN {scenario: '堆排序的实现基础'}]->(b);
MATCH (a {id: 'kp_007'}), (b {id: 'kp_016'}) CREATE (a)-[:APPLIED_IN {scenario: 'BFS 使用队列管理遍历顺序'}]->(b);
MATCH (a {id: 'kp_006'}), (b {id: 'kp_016'}) CREATE (a)-[:APPLIED_IN {scenario: 'DFS 使用栈管理递归/回溯'}]->(b);
MATCH (a {id: 'kp_003'}), (b {id: 'kp_015'}) CREATE (a)-[:APPLIED_IN {scenario: '邻接表使用链表存储边'}]->(b);
MATCH (a {id: 'kp_002'}), (b {id: 'kp_015'}) CREATE (a)-[:APPLIED_IN {scenario: '邻接矩阵使用数组存储边'}]->(b);

// Return summary
MATCH (n:KnowledgeNode)
RETURN count(n) AS node_count;

MATCH ()-[r]->()
RETURN count(r) AS relationship_count;
