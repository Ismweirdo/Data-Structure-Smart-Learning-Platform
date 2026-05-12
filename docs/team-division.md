# 数据结构智能学习平台 — 9人小组分工方案

## 分工原则

1. **知识图谱全员共建**：9人各负责一个知识模块的知识点拆解与关联梳理，定期汇总统一标准
2. **功能模块独立负责**：每人至少独立承担一个功能模块，模块间通过接口契约解耦
3. **前后端并行开发**：前后端通过 RESTful API + TypeScript 类型定义对齐
4. **工作量均衡**：每人承担 KG 模块 + 功能模块双线任务，总量相当

### 关于"组长"

本项目**不设组长**。项目管理事务（分支策略、Commit 规范、定期会议组织、接口契约维护）由全体成员共同遵守事先约定的规范。涉及跨模块决策时，通过每周项目会议讨论表决。

DevOps/数据库设计作为独立的功能模块分配给成员 I，与其他人平等。

---

## 一、知识图谱共建（全体 9 人）

> 对应文档要求 4.1：每位成员负责至少一个模块的知识点拆解、关联梳理与属性完善

### 1.1 KG 模块分配

| 成员 | KG 模块 | 知识点 | 关系梳理重点 |
|------|---------|--------|-------------|
| **A** | 线性结构 | 线性表、顺序表、链表、单链表、双向链表、栈、队列 (7个) | 层级包含(SUBTOPIC_OF) + 前置依赖(线性表→栈/队列) |
| **B** | 树形结构 Part1 | 二叉树、二叉树的遍历（前/中/后/层序）、二叉搜索树 BST (3个) | 前置依赖(二叉树→遍历, 二叉树→BST) |
| **C** | 树形结构 Part2 | 平衡二叉树 AVL、堆（大顶堆/小顶堆）、哈夫曼树 (3个) | 前置依赖(BST→AVL, 二叉树→堆, 二叉树→Huffman) |
| **D** | 图形结构 Part1 | 图的基本概念、图的存储结构、图的遍历 DFS/BFS (3个) | 前置依赖(概念→存储, 概念→遍历) |
| **E** | 图形结构 Part2 | 最小生成树 Prim/Kruskal、最短路径 Dijkstra/Floyd、拓扑排序 (3个) | 前置依赖(存储→MST, 遍历→MST, 存储→最短路径) |
| **F** | 排序算法 | 排序概述、冒泡排序、快速排序、归并排序、堆排序 (5个) | 层级包含 + 前置依赖(复杂度→排序, 递归→快排/归并) |
| **G** | 查找算法 | 查找概述、顺序查找、二分查找、哈希表 (4个) | 层级包含 + 前置依赖(排序→二分查找, 数组→哈希表) |
| **H** | 基础概念 + 跨模块关联 | 算法复杂度、递归 (2个) + 跨类应用关系 | APPLIED_IN 关系（栈→DFS, 队列→BFS, 链表→邻接表, 数组→邻接矩阵, 堆→堆排序） |
| **I** | KG 规范 + 质量审查 | 制定命名规范、属性标准，审查全图谱一致性，补全遗漏关系 | 汇总合并所有成员的 KG 产出到 `neo4j_init.cypher` |

### 1.2 KG 产出物

每位成员需提交一个 Markdown 文件描述自己负责的 KG 模块：

```
docs/kg-modules/
├── A-线性结构.md        # 7个知识点：名称、描述、难度、分类、与其他模块的前置/包含关系
├── B-树形结构-part1.md  # 3个知识点
├── C-树形结构-part2.md  # 3个知识点
├── D-图形结构-part1.md  # 3个知识点
├── E-图形结构-part2.md  # 3个知识点
├── F-排序算法.md        # 5个知识点
├── G-查找算法.md        # 4个知识点
├── H-基础概念+跨关联.md  # 2个知识点 + 跨类别 APPLIED_IN 关系表
└── I-命名规范.md         # 统一命名规则、属性填写标准、质量检查清单
```

### 1.3 KG 协作流程

```
第1周  各成员独立调研自己模块的知识点，填写草稿
第1周末 全体会议：统一命名规范、难度评级标准（成员 I 主持）
第2周  各成员按统一标准完善 KG 文档
第2周末 成员 I 审查一致性，反馈修改意见
第3周  各成员修改定稿，成员 I 汇总生成 neo4j_init.cypher
```

### 1.4 KG 节点属性标准

每个知识点节点需填写以下属性：

| 属性 | 说明 | 示例 |
|------|------|------|
| `name` | 知识点名称（中文，≤10字） | "二叉搜索树" |
| `description` | 一句话描述 | "左子树<根<右子树的二叉树" |
| `difficulty` | 难度 1~5 | 3 |
| `category` | 分类名（英文） | "tree" |
| `prerequisites` | 前置知识点列表 | ["二叉树"] |
| `subtopics` | 子知识点列表 | [] |
| `applied_in` | 应用场景（可选） | [("堆排序", "堆用于实现堆排序")] |

---

## 二、功能模块分工（每人独立负责至少一个）

> 对应文档要求 4.2：每位成员至少独立负责一个功能模块或子模块

### 成员 A — 后端：练习系统

| 职责 | 说明 |
|------|------|
| Exercise / ExerciseRecord ORM | `backend/app/models/exercise.py`, `progress.py` |
| 题目 API | `GET /exercises` 列表(支持按知识点筛选), `GET /exercises/{id}` 详情 |
| 答案提交与批改 | `POST /exercises/{id}/submit` — 选择/填空/代码三种题型自动批改 |
| 练习记录写入 | 每次提交写入 `exercise_records` 表 |
| 掌握度更新 | 批改后同步更新 `knowledge_mastery` 表 |

**代码题自动批改（C++ CLI 辅助）：**

代码题（如"在位置 i 插入元素 x"）的批改可调用 `algorithm_runner` 获取 C++ 标准运行结果作为答案基准：

```python
from app.services.algorithm_runner import step_array_insert
expected = step_array_insert(data, position, value)["final_state"]
correct = (student_result == expected)
```

避免了手写每种操作预期结果的工作。

**交付物：**
```
backend/app/models/exercise.py
backend/app/models/progress.py          # ExerciseRecord 部分
backend/app/schemas/exercise.py
backend/app/api/v1/exercises.py         # 题目列表/详情/提交接口
backend/app/services/exercise_service.py
```

**接口契约：**
```
GET   /api/v1/exercises?knowledge_point_id=xxx → list[ExerciseResponse]
GET   /api/v1/exercises/{id}                    → ExerciseResponse
POST  /api/v1/exercises/{id}/submit             → ExerciseSubmitResponse
```

**依赖：** 成员 C 提供用户认证，成员 D 提供知识点数据，`algorithm_runner`（C++ CLI 封装）

---

### 成员 B — 前端：基础架构

| 职责 | 说明 |
|------|------|
| 脚手架 | Vite + React 18 + TypeScript + Ant Design 初始化 |
| 路由 | `react-router-dom` v6 路由表，所有页面路由注册 |
| 主布局 | Header（Logo + 导航 + 用户状态）+ Sider + Content |
| 路由守卫 | AuthGuard 组件（未登录→/login，非admin→/） |
| API 客户端 | Axios 封装（JWT 拦截、401自动刷新） |
| 状态管理 | Zustand store（authStore, knowledgeStore） |
| 登录/注册/首页 | 完整表单页面 + 功能导航卡片 |
| TypeScript 类型 | `types/index.ts` — 所有接口类型的统一定义和维护 |

**交付物：**
```
frontend/package.json, vite.config.ts, tsconfig.json, index.html
frontend/src/main.tsx, App.tsx, router.tsx
frontend/src/types/index.ts
frontend/src/api/client.ts, endpoints.ts
frontend/src/store/authStore.ts, knowledgeStore.ts
frontend/src/components/layout/MainLayout.tsx, AuthGuard.tsx
frontend/src/pages/HomePage.tsx, LoginPage.tsx, RegisterPage.tsx
frontend/src/styles/global.css
```

**接口契约（对前端其他成员）：**
- `endpoints.ts` 统一出口，所有 API 函数从此 import
- `types/index.ts` 类型定义，前端组件类型均从此 import
- `store/` 全局状态，通过 Zustand hook 使用

**依赖：** 成员 I 提供 API 基础 URL 和部署环境

---

### 成员 C — 后端：用户认证

| 职责 | 说明 |
|------|------|
| User ORM | `backend/app/models/user.py` |
| 密码安全 | bcrypt 哈希 + JWT 生成/验证 |
| 注册 API | `POST /auth/register` |
| 登录 API | `POST /auth/login` — 返回 access_token + refresh_token |
| 用户信息 API | `GET /auth/me` |
| 认证中间件 | `get_current_user` 依赖注入（所有需登录的接口使用） |
| 管理员中间件 | `get_current_admin` 依赖注入 |

**交付物：**
```
backend/app/models/user.py
backend/app/schemas/user.py
backend/app/core/security.py
backend/app/api/v1/auth.py
backend/app/api/deps.py
backend/app/services/user_service.py
```

**接口契约：**
```
POST /api/v1/auth/register → UserResponse
POST /api/v1/auth/login    → TokenResponse
GET  /api/v1/auth/me       → UserResponse
```

**依赖：** 成员 I 提供 User 表结构

---

### 成员 D — 后端：知识图谱 API

| 职责 | 说明 |
|------|------|
| KnowledgePoint ORM | `backend/app/models/knowledge.py` |
| Neo4j 连接管理 | `backend/app/core/neo4j.py` |
| 知识点 CRUD | 列表(分页/按分类筛选)、详情、创建、更新、删除 |
| 图数据 API | `GET /knowledge-graph/graph` — 返回节点+边 JSON |
| 路径查询 | `POST /knowledge-graph/path` — 两点间最短学习路径（Cypher shortestPath） |
| Cypher 查询模板 | `backend/app/knowledge_graph/queries.py` |
| KG Schema 常量 | `backend/app/knowledge_graph/schema.py` |

**交付物：**
```
backend/app/models/knowledge.py
backend/app/schemas/knowledge.py
backend/app/core/neo4j.py
backend/app/api/v1/knowledge_graph.py
backend/app/services/kg_service.py
backend/app/knowledge_graph/schema.py
backend/app/knowledge_graph/queries.py
```

**接口契约：**
```
GET    /api/v1/knowledge-graph/nodes        → list[KnowledgePointResponse]
GET    /api/v1/knowledge-graph/nodes/{id}   → KnowledgePointResponse
GET    /api/v1/knowledge-graph/graph        → KnowledgeGraphResponse
POST   /api/v1/knowledge-graph/path         → LearningPathResponse
POST   /api/v1/knowledge-graph/nodes        → (admin)
PUT    /api/v1/knowledge-graph/nodes/{id}   → (admin)
DELETE /api/v1/knowledge-graph/nodes/{id}   → (admin)
```

**依赖：** 成员 I 提供 Neo4j 环境和初始 Schema，成员 C 提供 admin 认证

---

### 成员 E — 前端：知识图谱 UI

| 职责 | 说明 |
|------|------|
| 图谱页面 | D3.js Force Simulation 渲染知识节点和关系边 |
| 图谱交互 | 缩放/平移、节点拖拽、节点悬停高亮 |
| 分类筛选 | 按 category 下拉筛选显示 |
| 节点状态着色 | 已掌握(#52c41a 绿) / 学习中(#faad14 黄) / 未学习(#d9d9d9 灰) |
| 节点点击 | 弹出 Drawer 展示知识点详情 |
| 知识点详情页 | 描述/难度星级/分类/关联知识卡片/配套练习入口 |

**交付物：**
```
frontend/src/pages/KnowledgeGraphPage.tsx
frontend/src/pages/KnowledgeDetailPage.tsx
frontend/src/components/knowledge-graph/GraphCanvas.tsx
frontend/src/components/knowledge-graph/NodeDetailDrawer.tsx
frontend/src/components/knowledge-graph/GraphFilter.tsx
```

**依赖：** 成员 B 提供路由/布局/API/类型，成员 D 提供知识图谱 API

---

### 成员 F — 前端：数据结构可视化引擎

**核心变化：数据驱动渲染。** 动画算法逻辑由 C++ CLI 执行并输出逐步状态 JSON，Canvas 渲染器不再内嵌排序/查找/遍历的算法实现，改为消费 API 返回的 `steps[]` 逐帧播放。

| 职责 | 说明 |
|------|------|
| Canvas 渲染框架 | `DataStructureRenderer` 基类 + 动画循环 |
| 工具函数 | 缓动函数、圆角矩形、箭头绘制等 Canvas 工具 |
| 顺序表渲染器 | 消费 `step_array_*()` 返回的 steps JSON，播放插入/删除动画 |
| 链表渲染器 | 消费 `step_linked_list_*()` 的 steps，播放节点操作动画 |
| 栈渲染器 | 消费 push/pop steps，播放压栈/弹栈动画 |
| 队列渲染器 | 消费 enqueue/dequeue steps，播放入队/出队动画 |
| 树渲染器 | 消费 `init_bst()` 的 `insert_steps` + `search_bst()` 的 search steps |
| 图渲染器 | 消费 `traverse_graph_*()` 的 BFS/DFS steps |
| 排序渲染器 | 消费 `sort_*()` 的 compare/swap steps，逐帧播放比较交换 |
| 播放控件 | 播放/暂停/单步/重置 + 速度滑块 |
| 可视化页面 | 数据结构选择器 + Canvas 画布 + 控件栏 |

**数据流：**
```
用户操作 → POST /visualization/{type}/step → C++ CLI 执行 → steps[] JSON
→ CanvasRenderer 逐帧播放 (phase, indices, values, swapped)
```

**交付物：**
```
frontend/src/utils/visualization.ts
frontend/src/pages/VisualizationPage.tsx
frontend/src/components/visualization/CanvasRenderer.tsx
frontend/src/components/visualization/PlayerControls.tsx
frontend/src/components/visualization/renderers/
    ArrayRenderer.ts, LinkedListRenderer.ts,
    StackRenderer.ts, QueueRenderer.ts,
    TreeRenderer.ts, GraphRenderer.ts, SortRenderer.ts
```

**依赖：** 成员 B 提供路由/布局/API/类型，成员 I 提供可视化数据 API（C++ CLI 驱动）

---

### 成员 G — 后端：推荐引擎 & 学习统计

| 职责 | 说明 |
|------|------|
| KnowledgeMastery ORM | `backend/app/models/progress.py` 中 KnowledgeMastery |
| 掌握度计算 | mastery_score = correct / total |
| 进度总览 API | `GET /progress/{user_id}` — 已掌握数、正确率等 |
| 掌握度矩阵 API | `GET /progress/{user_id}/mastery` — 各知识点掌握度 |
| 统计 API | `GET /progress/{user_id}/stats` — 周活跃、分类雷达图 |
| 自适应推荐 API | `GET /exercises/adaptive/{user_id}` — 薄弱知识点优先选题 |
| 学习路径推荐 API | `GET /knowledge-graph/recommend/{user_id}` — 前沿节点推荐 |

**交付物：**
```
backend/app/models/progress.py              # KnowledgeMastery 部分
backend/app/schemas/progress.py
backend/app/api/v1/learning.py
backend/app/services/recommendation.py
```

**接口契约：**
```
GET /api/v1/progress/{user_id}                  → UserProgressOverview
GET /api/v1/progress/{user_id}/mastery          → list[KnowledgeMasteryResponse]
GET /api/v1/progress/{user_id}/stats            → LearningStatsResponse
GET /api/v1/exercises/adaptive/{user_id}        → list[ExerciseResponse]
GET /api/v1/knowledge-graph/recommend/{user_id} → list[str]
```

**依赖：** 成员 A 提供练习记录数据，成员 C 提供用户认证，成员 D 提供图查询

---

### 成员 H — 前端：练习系统 UI & 学习仪表盘

| 职责 | 说明 |
|------|------|
| 练习列表页 | 按知识点下拉筛选、题型标签、难度标签 |
| 答题页 | 选择题(Radio.Group)、填空题(Input)、代码题(Monaco Editor) |
| 答题反馈 | 正确/错误结果 + 题目解析 + 掌握度变化提示 |
| 学习仪表盘 | 统计卡片（总数/已掌握/正确率）、整体进度条 |
| 分类掌握度 | 各分类进度条或柱状图 |
| 周活跃图 | 最近 7 天练习频次（可用 recharts 或手写简单柱状图） |
| 管理后台 | Tab 布局：知识点管理(Tab1)、题目管理(Tab2)、用户管理(Tab3) |

**交付物：**
```
frontend/src/pages/ExercisesPage.tsx
frontend/src/pages/ExercisePage.tsx
frontend/src/pages/DashboardPage.tsx
frontend/src/pages/AdminPage.tsx
frontend/src/components/exercise/ChoiceQuestion.tsx
frontend/src/components/exercise/FillQuestion.tsx
frontend/src/components/exercise/CodeCompletion.tsx
frontend/src/components/exercise/ResultFeedback.tsx
```

**依赖：** 成员 B 提供路由/布局/API/类型/认证状态，成员 A 提供练习 API，成员 G 提供进度/统计 API

---

### 成员 I — DevOps / 数据库 / KG 规范 / 可视化数据 API

**职责一：基础设施与数据库（第 1~2 周）**

| 工作项 | 说明 |
|--------|------|
| Docker 环境 | `docker-compose.yml`（Nginx + FastAPI + PostgreSQL + Neo4j + Redis） |
| Nginx 配置 | 静态资源 + API 反向代理 |
| PostgreSQL Schema | `database/init.sql` — 5 张表的完整建表语句 |
| Neo4j 初始 Schema | 创建约束和索引的 Cypher 语句 |
| KG 规范制定 | 统一命名规则、属性填写标准（见 1.4 节） |
| KG 汇总 | 将 A~H 的 KG 模块文档汇总为 `neo4j_init.cypher` |
| .env 配置 | 环境变量模板 |

**职责二：可视化数据 API + C++ CLI 集成（第 3~4 周）— 已完成框架搭建**

> C++ 算法 CLI（`algorithms/cli.cpp` → `dsa-cli`）已实现全部数据结构的初始状态生成、操作步骤模拟、排序逐步追踪、图遍历。Python 侧通过 `algorithm_runner.py` → `visualization_service.py` → `visualization.py` 三层对接。

| 工作项 | 状态 | 说明 |
|--------|------|------|
| C++ CLI 编译与 Docker 集成 | **新增** | 确保 `dsa-cli` 在 Docker 容器中可编译运行（`g++ -std=c++17`），或在构建阶段预编译 |
| 可视化状态 API | 已实现 | `GET /visualization/{ds_type}` — 由 CLI `init` 命令驱动 |
| 操作步骤 API | 已实现 | `POST /visualization/{ds_type}/step` — 由 CLI `step` 命令驱动 |
| 数据结构状态生成 | 已实现 | CLI 已覆盖 array, linked-list, stack, queue, bst, graph 全部 6 种 |
| 操作模拟逻辑 | 已实现 | 每种结构的 insert/delete/push/pop/enqueue/dequeue 均已支持 |
| 排序算法追踪 | **新增** | CLI 支持 6 种排序（bubble/selection/insertion/quick/merge/heap）逐步 compare/swap 输出 |
| 图遍历 | **新增** | CLI 支持 BFS/DFS 逐步 visit/discover 输出 |

**I 的剩余工作：**
1. 在 Docker 中集成 C++ 编译环境，确保 FastAPI 容器可调用 `dsa-cli`
2. 完成 DevOps 交付物（docker-compose.yml、Nginx、PostgreSQL、Neo4j）
3. KG 规范制定 → 审查 → 汇总为 `neo4j_init.cypher`
4. 可视化 API 若需新增操作（如 BST 删除、AVL 旋转），扩写 CLI 对应函数

**交付物：**
```
docker-compose.yml
docker/Dockerfile.backend
docker/nginx/nginx.conf, default.conf
database/init.sql
database/neo4j_init.cypher
.env.example
algorithms/cli.cpp                         # C++ CLI 主程序（已搭建）
algorithms/CMakeLists.txt                  # CMake 构建配置
backend/app/services/algorithm_runner.py   # Python ↔ C++ CLI 封装（已实现）
backend/app/services/visualization_service.py # 可视化状态服务（已实现）
backend/app/api/v1/visualization.py        # 可视化数据 API 路由（已实现）
```

**接口契约：**
```
GET  /api/v1/visualization/{ds_type}       → 初始状态 JSON（节点/边/位置等）
POST /api/v1/visualization/{ds_type}/step  → 执行一步操作，返回新状态 JSON

CLI 输出 JSON 格式即为与成员 F 前端 Canvas 的数据契约（见 algorithms/cli.cpp 中各函数的输出结构）
```

**依赖：** 无（基础设施层 + 独立 API 模块，与成员 F 前端可视化引擎通过 JSON 数据对接）

---

## 三、模块联动与接口对接

> 对应文档要求 4.3：涉及模块联动的部分需及时对接数据接口

### 3.1 关键联动点

| 联动场景 | 涉及成员 | 接口/数据 |
|---------|---------|----------|
| 注册/登录后获取用户身份 | B ↔ C | `POST /auth/login` → Token → `GET /auth/me` |
| 知识图谱页面加载图数据 | E ↔ D | `GET /knowledge-graph/graph` → `KnowledgeGraphData` |
| 图谱叠加用户掌握度 | E ↔ G | `GET /progress/{uid}/mastery` + `KnowledgeGraphData` |
| 知识点详情页显示配套练习 | E ↔ A | `GET /exercises?knowledge_point_id=xxx` |
| 答题提交后更新掌握度 | A ↔ G | A 写入 mastery 表 → G 的 API 返回最新值 |
| 仪表盘展示学习统计 | H ↔ G | `GET /progress/{uid}` + `/stats` |
| 自适应推荐题目 | H ↔ G | `GET /exercises/adaptive/{uid}` |
| 可视化页面获取初始数据 | F ↔ I | `GET /visualization/{ds_type}` → 初始状态 JSON |
| 可视化操作步骤（逐帧动画） | F ↔ I | `POST /visualization/{ds_type}/step` → steps[] JSON |
| 代码题自动批改（C++ 基准） | A ↔ CLI | `algorithm_runner.step_*()` → 预期结果 |

> **新增联动说明**：F ↔ I 的数据契约即为 C++ CLI 的 JSON 输出结构——F 的 Canvas 渲染器按 `steps[].phase` 分发到对应动画帧，无需自行实现算法逻辑。A 的代码题批改可将学生答案与 CLI 输出对比。

### 3.2 接口对接流程

```
1. 后端成员在 backend/app/schemas/ 定义 Pydantic Schema（接口契约）
2. 前端成员 B 在 frontend/src/types/index.ts 维护对应的 TS 类型
3. 接口变更时，变更方需在项目群同步，接收方确认后合入
4. 联调前，双方对照 Swagger 文档 (/api/docs) 和 TS 类型确认一致性
```

---

## 四、Git 协作规范

### 4.1 远程仓库

```
git@github.com:Ismweirdo/Data-Structure-Smart-Learning-Platform.git
```

### 4.2 分支策略（体现个人工作量）

每位成员拥有独立的功能分支，分支名包含成员编号和模块名：

```
main                          # 保护分支，仅通过 PR 合入
│
├── kg/A-线性结构              # 成员 A KG 文档
├── feat/A-exercise-api       # 成员 A 练习系统后端
│
├── kg/B-树形结构-part1        # 成员 B KG 文档
├── feat/B-frontend-base      # 成员 B 前端基础架构
│
├── kg/C-树形结构-part2        # 成员 C KG 文档
├── feat/C-auth               # 成员 C 用户认证
│
├── kg/D-图形结构-part1        # 成员 D KG 文档
├── feat/D-kg-api             # 成员 D 知识图谱 API
│
├── kg/E-图形结构-part2        # 成员 E KG 文档
├── feat/E-kg-ui              # 成员 E 知识图谱 UI
│
├── kg/F-排序算法              # 成员 F KG 文档
├── feat/F-visualization      # 成员 F 可视化引擎
│
├── kg/G-查找算法              # 成员 G KG 文档
├── feat/G-recommendation     # 成员 G 推荐引擎
│
├── kg/H-基础概念              # 成员 H KG 文档
├── feat/H-exercise-ui        # 成员 H 练习UI+仪表盘
│
├── kg/I-规范                 # 成员 I KG 规范文档
├── feat/I-visualization-api  # 成员 I 可视化数据 API（代码开发）
└── feat/I-devops             # 成员 I DevOps/数据库
```

**规则：**
- 每个成员至少 2 个分支：`kg/{成员编号}-{KG模块}` + `feat/{成员编号}-{功能模块}`
- 日常开发在自己的分支上，完成一个子任务后向 `main` 提 PR
- PR 需至少 2 人 review 通过后方可合入
- **禁止**直接在 main 上 commit

### 4.3 Commit 规范

采用 Conventional Commits，scope 使用模块缩写，确保 `git log --author` 能清晰体现个人贡献：

```
格式: <type>(<scope>): <subject>

type:
  feat     新功能
  fix      Bug修复
  refactor 代码重构
  docs     文档变更
  style    格式调整
  test     测试
  chore    构建/工具

scope:
  kg        知识图谱文档 (docs/kg-modules/)
  auth      用户认证模块
  kg-api    知识图谱 API
  exercise  练习系统（后端）
  recommend 推荐引擎/统计
  devops    Docker/数据库/部署
  base      前端基础架构
  kg-ui     知识图谱 UI
  vis       可视化引擎
  ex-ui     练习UI/仪表盘
```

**示例：**
```bash
# 成员 A 的 KG 工作
git commit -m "docs(kg): 添加线性结构模块知识点拆解文档"

# 成员 A 的功能开发
git commit -m "feat(exercise): 实现题目列表查询接口（支持按知识点筛选）"
git commit -m "feat(exercise): 实现选择题/填空题答案批改逻辑"

# 成员 E 的功能开发
git commit -m "feat(kg-ui): 实现 D3.js 力导向图渲染知识节点"
git commit -m "feat(kg-ui): 添加节点按分类筛选功能"

# 成员 I 的基础设施
git commit -m "chore(devops): 完成 docker-compose.yml 五服务编排"
git commit -m "chore(devops): 添加 PostgreSQL 建表 SQL"
```

### 4.4 工作量追踪

通过以下 Git 命令可统计每位成员的工作量：

```bash
# 查看某个分支上的所有 commit
git log feat/A-exercise-api --oneline --author="成员A的用户名"

# 查看某个成员的 all branches 贡献
git log --all --oneline --author="成员A的用户名" --since="2026-05-12"

# 查看文件变更统计
git log --author="成员A的用户名" --stat

# 统计每个成员的 commit 数量
git shortlog -sn --all --since="2026-05-12"
```

**建议**：每位成员在自己的分支上开发，合入 main 时使用 `git merge --no-ff` 保留分支历史，确保 merge commit 可见，便于统计和回溯。

---

## 五、协作机制

> 对应文档要求 4.3：定期沟通、模块联动、相互了解

### 5.1 定期会议

| 频率 | 内容 | 时长 |
|------|------|------|
| 每周 1 次 | 项目进度同步：各成员汇报进度、遇到的问题、下周计划 | 30~60 min |
| 第 1 周末 | KG 命名规范统一会议（成员 I 主持） | 60 min |
| 第 2 周末 | KG 审查反馈 | 30 min |
| 第 3 周起 | 联调对齐：前后端接口对接确认 | 按需 |

### 5.2 协作守则

1. **接口先行**：后端先出 Swagger 文档，前端根据文档并行开发
2. **遇堵即报**：遇到阻塞问题不拖延，及时在群内或会议上提出
3. **跨模块主动沟通**：涉及联动（如 D 的 API 被 E/F 调用），主动确认数据结构
4. **相互了解**：每位成员需了解其他模块的基本原理，尤其是 AI 推荐功能（成员 G）的输入/输出，确保项目整体一致性
5. **Code Review 不走过场**：至少 2 人 review，重点关注接口契约是否匹配、边界条件是否处理

---

## 六、时间规划

| 阶段 | 时间 | KG 工作 | 功能开发 |
|------|------|---------|---------|
| 第 1 周 | D1-D7 | A~H 调研 KG 模块、填写草稿；I 制定规范 | I 完成 Docker/DB Schema；B 完成前端脚手架 |
| 第 1 周末 | D7 | 全体会议：统一 KG 命名规范 | — |
| 第 2 周 | D8-D14 | A~H 按规范完善 KG 文档；I 审查 | C(认证) D(KG API) 开发；B 完成基础架构 |
| 第 2 周末 | D14 | I 反馈 KG 审查意见 | — |
| 第 3 周 | D15-D21 | A~H 修改定稿；I 汇总 neo4j_init.cypher | A(练习) G(推荐) E(KG UI) F(可视化) 开发 |
| 第 4 周 | D22-D28 | — | H(练习UI) 开发；前后端开始联调 |
| 第 5 周 | D29-D35 | — | 全员联调、Bug 修复、文档完善、提交 |

---

## 七、分工总览表

| 成员 | KG 模块 | KG 节点数 | 功能模块 | 技术栈 |
|------|---------|----------|---------|--------|
| **A** | 线性结构 | 7 | 后端：练习系统 | FastAPI, SQLAlchemy, C++ CLI |
| **B** | 树形结构 Part1 | 3 | 前端：基础架构 | React, Vite, Ant Design, Zustand |
| **C** | 树形结构 Part2 | 3 | 后端：用户认证 | FastAPI, JWT, bcrypt |
| **D** | 图形结构 Part1 | 3 | 后端：知识图谱 API | FastAPI, Neo4j, Cypher |
| **E** | 图形结构 Part2 | 3 | 前端：知识图谱 UI | React, D3.js, SVG |
| **F** | 排序算法 | 5 | 前端：可视化引擎（数据驱动） | React, Canvas 2D |
| **G** | 查找算法 | 4 | 后端：推荐引擎 & 统计 | FastAPI, 推荐算法 |
| **H** | 基础概念 + 跨关联 | 2+5 | 前端：练习UI & 仪表盘 | React, Monaco Editor |
| **I** | KG 规范 + 汇总 | — | DevOps & 可视化数据 API + C++ CLI | Docker, PostgreSQL, Neo4j, FastAPI, C++ |
