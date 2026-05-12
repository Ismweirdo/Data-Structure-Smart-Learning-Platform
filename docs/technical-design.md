# 数据结构智能学习平台 — 技术设计文档

## 1. 技术选型

### 1.1 总体架构

采用**前后端分离**的 B/S 架构，后端提供 RESTful API 服务，前端为 SPA 单页应用。

| 层次 | 技术 | 选型理由 |
|------|------|---------|
| 前端框架 | React 18 + TypeScript | 组件化开发，生态丰富，适合复杂交互界面 |
| 状态管理 | Zustand | 轻量级，无样板代码，适合中等规模应用 |
| UI 组件库 | Ant Design 5 | 中文友好，组件齐全，适合后台和教学平台 |
| 可视化 | D3.js + Canvas API | 高性能图形渲染，适合数据结构和算法动画 |
| 代码编辑器 | Monaco Editor | VS Code 同款编辑器，支持代码高亮和补全 |
| 后端框架 | Python FastAPI | 高性能异步框架，AI/ML 生态完善，自动生成 API 文档 |
| ORM | SQLAlchemy 2.0 (async) | 成熟的 Python ORM，支持异步 |
| 关系数据库 | PostgreSQL 15 | 存储用户数据、练习记录、知识掌握状态 |
| 图数据库 | Neo4j 5 | 存储和查询知识图谱，支持 Cypher 图查询语言 |
| 缓存 | Redis 7 | 会话缓存、热点数据缓存、任务队列 |
| 认证 | JWT (python-jose) | 无状态认证，适合 RESTful API |
| 容器化 | Docker + Docker Compose | 一键部署，环境统一 |
| 反向代理 | Nginx | 静态资源服务、API 代理、负载均衡 |

### 1.2 为什么不选用其他方案

| 候选方案 | 不选择的原因 |
|---------|------------|
| Vue.js | React 的 D3.js 整合方案更成熟，Canvas 生态更好 |
| Django | 过于重量级，FastAPI 的异步性能更好，API 文档自动生成更便捷 |
| MongoDB | 知识图谱的节点关系需要图数据库才能高效查询；用户数据需要关系型数据库的事务保证 |
| 纯 D3.js 做动画 | D3 适合静态可视化，Canvas 更适合高频动画（算法执行过程） |

---

## 2. 系统架构

### 2.1 架构图

```
┌──────────────────────────────────────────────────────────────────┐
│                         客户端 (Browser)                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────────┐  │
│  │ 知识图谱  │  │可视化演示 │  │ 练习模块  │  │   个人中心      │  │
│  │ 浏览器   │  │ 播放器   │  │          │  │                │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───────┬────────┘  │
│       └──────────────┴─────────────┴───────────────┘            │
│                          │ HTTP/WebSocket                        │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                     Nginx (反向代理)                               │
│              ┌────────┴────────┐                                  │
│              │   静态资源       │    API (/api/*)                  │
└──────────────┼─────────────────┼──────────────────────────────────┘
               │                 │
       ┌───────┴───────┐  ┌─────┴──────────────────────────────┐
       │ React SPA     │  │        FastAPI 后端                  │
       │ (Nginx 托管)   │  │                                    │
       └───────────────┘  │  ┌──────────┐  ┌───────────────┐   │
                          │  │ API 路由层│  │  知识图谱服务  │   │
                          │  └────┬─────┘  └───────┬───────┘   │
                          │       │                 │           │
                          │  ┌────┴─────────────────┴──────┐    │
                          │  │         服务层                │    │
                          │  │  ┌────┐ ┌────┐ ┌────────┐   │    │
                          │  │  │用户│ │练习│ │学习推荐│   │    │
                          │  │  │服务│ │服务│ │引擎   │   │    │
                          │  │  └────┘ └────┘ └────────┘   │    │
                          │  └──────────┬───────────────────┘    │
                          │             │                        │
                          │  ┌──────────┴───────────────────┐    │
                          │  │         数据访问层             │    │
                          │  │  SQLAlchemy    Neo4j Driver   │    │
                          │  └──────┬──────────────┬─────────┘    │
                          └─────────┼──────────────┼──────────────┘
                                    │              │
                    ┌───────────────┼──────┐  ┌───┴──────────────┐
                    │ PostgreSQL 15 │Redis │  │    Neo4j 5       │
                    │ (用户/练习/   │ (缓存)│  │   (知识图谱)      │
                    │  进度数据)    │      │  │                  │
                    └───────────────┴──────┘  └──────────────────┘
```

### 2.2 后端分层设计

```
backend/
├── app/
│   ├── main.py                   # FastAPI 应用入口
│   ├── core/
│   │   ├── config.py             # 配置管理（环境变量）
│   │   ├── security.py           # JWT 认证、密码哈希
│   │   ├── database.py           # PostgreSQL 连接管理
│   │   └── neo4j.py              # Neo4j 连接管理
│   ├── api/
│   │   ├── v1/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # 注册、登录 API
│   │   │   ├── users.py          # 用户信息 API
│   │   │   ├── knowledge_graph.py # 知识图谱 API
│   │   │   ├── visualization.py   # 可视化数据 API
│   │   │   ├── exercises.py       # 练习题目 API
│   │   │   └── learning.py       # 学习推荐 API
│   │   └── deps.py               # 公共依赖（认证、DB Session）
│   ├── models/
│   │   ├── user.py               # 用户 ORM 模型
│   │   ├── knowledge.py          # 知识点 ORM 模型
│   │   ├── exercise.py           # 题目 ORM 模型
│   │   └── progress.py           # 学习进度 ORM 模型
│   ├── schemas/
│   │   ├── user.py               # Pydantic 请求/响应 Schema
│   │   ├── knowledge.py
│   │   ├── exercise.py
│   │   └── progress.py
│   ├── services/
│   │   ├── user_service.py       # 用户业务逻辑
│   │   ├── kg_service.py         # 知识图谱业务逻辑
│   │   ├── exercise_service.py   # 练习业务逻辑
│   │   └── recommendation.py     # 学习推荐引擎
│   └── knowledge_graph/
│       ├── schema.py             # 知识图谱 Schema 定义
│       ├── queries.py            # Cypher 查询模板
│       └── seed.py               # 初始化种子数据
└── requirements.txt
```

---

## 3. 数据库设计

### 3.1 PostgreSQL 关系型表设计

#### 3.1.1 用户表 (users)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 用户唯一标识 |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱 |
| password_hash | VARCHAR(255) | NOT NULL | bcrypt 密码哈希 |
| role | VARCHAR(20) | DEFAULT 'student' | student / admin |
| avatar_url | VARCHAR(500) | NULL | 头像 URL |
| created_at | TIMESTAMP | DEFAULT NOW() | 注册时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

#### 3.1.2 知识点表 (knowledge_points)

> 此表作为 Neo4j 中知识节点的镜像缓存，便于列表查询和关联

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 知识点唯一标识 |
| neo4j_node_id | VARCHAR(100) | UNIQUE | Neo4j 中对应节点 ID |
| name | VARCHAR(100) | UNIQUE, NOT NULL | 知识点名称 |
| description | TEXT | NULL | 知识点描述 |
| difficulty | INTEGER | CHECK(1~5) | 难度等级 |
| category | VARCHAR(50) | NOT NULL | 分类 |
| order_index | INTEGER | DEFAULT 0 | 排序序号 |

#### 3.1.3 练习题目表 (exercises)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 题目 ID |
| knowledge_point_id | UUID | FK → knowledge_points.id | 关联知识点 |
| type | VARCHAR(20) | NOT NULL | choice / fill / code / simulation |
| title | TEXT | NOT NULL | 题目标题 |
| content | JSONB | NOT NULL | 题目内容（含选项、代码模板等） |
| answer | JSONB | NOT NULL | 正确答案 |
| difficulty | INTEGER | CHECK(1~5) | 题目难度 |
| explanation | TEXT | NULL | 题目解析 |

#### 3.1.4 练习记录表 (exercise_records)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 记录 ID |
| user_id | UUID | FK → users.id | 用户 ID |
| exercise_id | UUID | FK → exercises.id | 题目 ID |
| user_answer | JSONB | NOT NULL | 用户答案 |
| is_correct | BOOLEAN | NOT NULL | 是否正确 |
| time_spent | INTEGER | DEFAULT 0 | 耗时（秒） |
| created_at | TIMESTAMP | DEFAULT NOW() | 答题时间 |

#### 3.1.5 知识掌握度表 (knowledge_mastery)

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 记录 ID |
| user_id | UUID | FK → users.id | 用户 ID |
| knowledge_point_id | UUID | FK → knowledge_points.id | 知识点 ID |
| mastery_score | FLOAT | CHECK(0~1) | 掌握度 (0~1) |
| total_attempts | INTEGER | DEFAULT 0 | 总练习次数 |
| correct_attempts | INTEGER | DEFAULT 0 | 正确次数 |
| last_practiced_at | TIMESTAMP | NULL | 最近练习时间 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 更新时间 |

### 3.2 Neo4j 知识图谱设计

#### 3.2.1 节点标签

```cypher
// KnowledgeNode: 知识点节点
(:KnowledgeNode {
    id: String,          // UUID，与 PostgreSQL 对应
    name: String,
    description: String,
    difficulty: Integer, // 1~5
    category: String     // linear / tree / graph / sort / search / ...
})
```

#### 3.2.2 关系类型

```cypher
// PREREQUISITE_OF: A 是 B 的前置知识
(:KnowledgeNode)-[:PREREQUISITE_OF]->(:KnowledgeNode)

// SUBTOPIC_OF: A 是 B 的子话题
(:KnowledgeNode)-[:SUBTOPIC_OF]->(:KnowledgeNode)

// RELATED_TO: A 与 B 相关
(:KnowledgeNode)-[:RELATED_TO]->(:KnowledgeNode)

// APPLIED_IN: A 知识点应用于某场景
(:KnowledgeNode)-[:APPLIED_IN {scenario: String}]->(:KnowledgeNode)

// MASTERED_BY: 用户掌握程度
(:KnowledgeNode)-[:MASTERED_BY {score: Float}]->(:User {id: String})
```

#### 3.2.3 示例知识图谱数据

```cypher
// 线性结构分支
(线性表)-[:SUBTOPIC_OF]->(顺序表)
(线性表)-[:SUBTOPIC_OF]->(链表)
(链表)-[:SUBTOPIC_OF]->(单链表)
(链表)-[:SUBTOPIC_OF]->(双向链表)
(线性表)-[:PREREQUISITE_OF]->(栈)
(线性表)-[:PREREQUISITE_OF]->(队列)

// 树形结构分支
(二叉树)-[:PREREQUISITE_OF]->(二叉搜索树)
(二叉搜索树)-[:PREREQUISITE_OF]->(AVL树)
(二叉树)-[:PREREQUISITE_OF]->(堆)
(堆)-[:APPLIED_IN {scenario: "优先队列"}]->(哈夫曼树)

// 跨分支关联
(队列)-[:APPLIED_IN {scenario: "BFS"}]->(图遍历)
(栈)-[:APPLIED_IN {scenario: "DFS"}]->(图遍历)
```

---

## 4. API 设计

### 4.1 认证模块 `/api/v1/auth`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| POST | /auth/register | 用户注册 | 否 |
| POST | /auth/login | 用户登录，返回 JWT | 否 |
| GET | /auth/me | 获取当前用户信息 | 是 |

### 4.2 知识图谱模块 `/api/v1/knowledge-graph`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /knowledge-graph/nodes | 获取所有知识点（列表） | 否 |
| GET | /knowledge-graph/nodes/{id} | 获取知识点详情 | 否 |
| GET | /knowledge-graph/graph | 获取完整图数据（节点+边） | 否 |
| GET | /knowledge-graph/recommend/{user_id} | 推荐下一个学习知识点 | 是 |
| GET | /knowledge-graph/path | 查询两个知识点之间的学习路径 | 否 |
| POST | /knowledge-graph/nodes | 创建知识点（管理员） | 是 |
| PUT | /knowledge-graph/nodes/{id} | 更新知识点（管理员） | 是 |
| DELETE | /knowledge-graph/nodes/{id} | 删除知识点（管理员） | 是 |

### 4.3 练习模块 `/api/v1/exercises`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /exercises | 获取题目列表（按知识点筛选） | 否 |
| GET | /exercises/{id} | 获取题目详情 | 否 |
| POST | /exercises/{id}/submit | 提交答案并批改 | 是 |
| GET | /exercises/adaptive/{user_id} | 自适应推荐题目 | 是 |

### 4.4 学习进度模块 `/api/v1/progress`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /progress/{user_id} | 获取学习进度总览 | 是 |
| GET | /progress/{user_id}/mastery | 获取知识掌握度矩阵 | 是 |
| GET | /progress/{user_id}/stats | 获取学习统计 | 是 |

### 4.5 可视化模块 `/api/v1/visualization`

| 方法 | 路径 | 说明 | 认证 |
|------|------|------|------|
| GET | /visualization/{ds_type} | 获取指定数据结构的初始状态数据 | 否 |
| POST | /visualization/{ds_type}/step | 提交操作请求，返回下一步状态 | 否 |

---

## 5. 前端设计

### 5.1 路由设计

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | HomePage | 首页，包含平台介绍和导航 |
| `/login` | LoginPage | 登录页 |
| `/register` | RegisterPage | 注册页 |
| `/dashboard` | DashboardPage | 学习仪表盘（个人中心） |
| `/knowledge-graph` | KnowledgeGraphPage | 知识图谱浏览 |
| `/knowledge/:id` | KnowledgeDetailPage | 知识点详情（含可视化演示） |
| `/visualization/:type` | VisualizationPage | 独立可视化演示页 |
| `/exercises` | ExerciseListPage | 练习列表 |
| `/exercises/:id` | ExercisePage | 答题页 |
| `/admin` | AdminPage | 管理后台 |

### 5.2 核心组件树

```
App
├── Layout (Header + Sidebar + Content)
│   ├── HomePage
│   │   └── FeatureCards (平台功能导航卡片)
│   ├── DashboardPage
│   │   ├── ProgressOverview (学习进度概览)
│   │   ├── MasteryRadar (知识掌握度雷达图)
│   │   └── RecentRecords (最近练习记录)
│   ├── KnowledgeGraphPage
│   │   ├── GraphCanvas (D3.js 力导向图)
│   │   ├── NodeDetailDrawer (知识点详情抽屉)
│   │   └── GraphFilter (筛选器)
│   ├── KnowledgeDetailPage
│   │   ├── KnowledgeInfo (知识点说明)
│   │   ├── VisualizationPlayer (可视化演示播放器)
│   │   │   ├── CanvasRenderer (Canvas 渲染器)
│   │   │   ├── PlayerControls (播放控件)
│   │   │   └── CodeHighlighter (代码同步高亮)
│   │   └── RelatedNodes (相关知识点卡片)
│   ├── ExercisePage
│   │   ├── ChoiceQuestion (选择题组件)
│   │   ├── FillQuestion (填空题组件)
│   │   ├── CodeCompletion (代码补全组件 - Monaco Editor)
│   │   └── ResultFeedback (答题反馈)
│   └── AdminPage
│       ├── KnowledgeEditor (知识点编辑器)
│       └── ExerciseManager (题目管理器)
└── CommonComponents
    ├── LoadingSpinner
    ├── ErrorBoundary
    └── AuthGuard (路由守卫)
```

### 5.3 可视化核心设计

采用**D3.js + Canvas 混合渲染**策略：

- **知识图谱**：D3.js Force Simulation（SVG），支持节点拖拽、缩放、平移
- **数据结构动画**：Canvas 2D，自建动画循环，支持 60 FPS 高频更新
  - 每个数据结构封装为独立的 `DataStructureRenderer` 类
  - 统一接口：`init(data) → step(operation) → render(ctx, state)`

```typescript
// 可视化渲染器统一接口
interface DataStructureRenderer<TState, TOp> {
  // 初始化状态
  init(data: unknown): TState;
  // 执行一步操作，返回新状态
  step(state: TState, op: TOp): TState;
  // 渲染当前状态到 Canvas
  render(ctx: CanvasRenderingContext2D, state: TState, options: RenderOptions): void;
}
```

---

## 6. 知识图谱推理设计

### 6.1 学习路径推荐算法

基于知识图谱的拓扑排序 + 用户掌握度加权：

```
算法: PersonalizedLearningPath(user_id)
输入: 用户已掌握知识点集合 U_mastered, 目标知识点 target
输出: 推荐学习路径 (知识点序列)

1. 构建知识图谱依赖图 G = (V, E), E 为 PREREQUISITE_OF 关系
2. 识别用户知识边界: frontier = {v | v ∉ U_mastered ∧ ∀前置 p 满足 p ∈ U_mastered}
3. 对每个 frontier 中的节点 v:
   score(v) = α × (1 - difficulty(v)/5) + β × relevance(v, target) + γ × (1 - mastery(v))
4. 按 score 降序推荐 top-N
5. 若指定目标 target, 在 G 上运行 Dijkstra 求用户已掌握节点到 target 的最短路径
```

### 6.2 知识盲区检测

```cypher
// 查找用户未掌握的前置知识（知识盲区）
MATCH (kp:KnowledgeNode)-[:PREREQUISITE_OF*1..3]->(target:KnowledgeNode {id: $target_id})
WHERE NOT EXISTS {
    (kp)-[:MASTERED_BY {score: > 0.7}]->(:User {id: $user_id})
}
RETURN kp.name, kp.difficulty
ORDER BY kp.difficulty
```

---

## 7. 安全设计

| 层级 | 措施 |
|------|------|
| 传输层 | HTTPS 加密传输 |
| 认证层 | JWT 短过期（30min）+ Refresh Token 长过期（7d） |
| 密码 | bcrypt + 随机盐 |
| API 层 | 输入校验（Pydantic）、请求频率限制（Redis 滑动窗口） |
| 数据库 | 参数化查询（SQLAlchemy ORM 防注入）、密码等敏感字段加密 |
| 前端 | XSS 过滤（React 默认转义）、CSP 头、CSRF Token |

---

## 8. 部署架构

```
┌─────────────────────────────────────────┐
│              Docker Compose              │
│                                          │
│  ┌─────────┐ ┌────────┐ ┌───────────┐  │
│  │ Nginx   │ │ FastAPI│ │ FastAPI    │  │
│  │ :80     │ │ :8000  │ │ :8001     │  │
│  └─────────┘ └────────┘ └───────────┘  │
│  ┌─────────┐ ┌────────┐ ┌───────────┐  │
│  │PostgreSQL│ │ Neo4j  │ │  Redis    │  │
│  │ :5432   │ │:7474,7687│ │ :6379    │  │
│  └─────────┘ └────────┘ └───────────┘  │
└─────────────────────────────────────────┘
```

---

## 9. 团队分工

> 详见 [team-division.md](team-division.md)（完整分工方案 + Git 规范 + 协作机制）

| 成员 | 功能模块 | 技术栈 | KG 模块 |
|------|---------|--------|---------|
| **A** | 后端：练习系统 | FastAPI, SQLAlchemy | 线性结构 (7 nodes) |
| **B** | 前端：基础架构 | React, Vite, Zustand | 树形结构 Part1 (3 nodes) |
| **C** | 后端：用户认证 | FastAPI, JWT, bcrypt | 树形结构 Part2 (3 nodes) |
| **D** | 后端：知识图谱 API | FastAPI, Neo4j, Cypher | 图形结构 Part1 (3 nodes) |
| **E** | 前端：知识图谱 UI | D3.js, React, SVG | 图形结构 Part2 (3 nodes) |
| **F** | 前端：可视化引擎 | Canvas 2D, React | 排序算法 (5 nodes) |
| **G** | 后端：推荐引擎 & 统计 | FastAPI, 推荐算法 | 查找算法 (4 nodes) |
| **H** | 前端：练习UI & 仪表盘 | React, Monaco Editor | 基础概念+跨关联 (2+5) |
| **I** | DevOps & 数据库 | Docker, PostgreSQL, Neo4j | KG 规范制定 + 汇总 |

**注意**：本项目不设组长。项目管理通过全体遵守的分支策略、Commit 规范、定期会议机制实现。
