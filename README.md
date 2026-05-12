# 数据结构智能学习平台

知识工程课程项目 — 基于知识图谱的智能化数据结构学习系统。

## 项目简介

通过知识图谱组织数据结构知识点，提供交互式可视化演示、智能学习路径推荐和自适应练习。

## 技术栈

| 层 | 技术 |
|---|------|
| 前端 | React 18 + TypeScript + Ant Design + D3.js + Canvas API |
| 后端 | Python FastAPI + SQLAlchemy + Neo4j Driver |
| 数据库 | PostgreSQL 15 + Neo4j 5 |
| 缓存 | Redis 7 |
| 部署 | Docker Compose + Nginx |

## 项目结构

```
├── docs/                    # 项目文档
│   ├── requirements.md      # 需求规格说明书
│   ├── technical-design.md  # 技术设计文档
│   ├── team-division.md     # 9人分工方案
│   └── kg-modules/          # 知识图谱模块文档（每人一份）
├── backend/                 # FastAPI 后端
│   └── app/
│       ├── api/v1/          # API 路由
│       ├── models/          # ORM 模型
│       ├── schemas/         # Pydantic Schema
│       ├── services/        # 业务逻辑
│       ├── core/            # 配置/认证/数据库
│       └── knowledge_graph/ # KG Schema/Cypher/种子数据
├── frontend/                # React 前端
│   └── src/
│       ├── pages/           # 页面组件
│       ├── components/      # 公共组件
│       ├── api/             # API 客户端
│       ├── store/           # Zustand 状态
│       └── types/           # TS 类型定义
├── database/                # 数据库脚本
│   ├── init.sql             # PostgreSQL 建表
│   └── neo4j_init.cypher    # Neo4j 种子数据
└── docker/                  # Docker 配置
```

## 团队成员与分工

| 成员 | KG 模块 | 功能模块 |
|------|---------|---------|
| **A** | 线性结构 | 后端：练习系统 |
| **B** | 树形结构 Part1 | 前端：基础架构 |
| **C** | 树形结构 Part2 | 后端：用户认证 |
| **D** | 图形结构 Part1 | 后端：知识图谱 API |
| **E** | 图形结构 Part2 | 前端：知识图谱 UI |
| **F** | 排序算法 | 前端：可视化引擎 |
| **G** | 查找算法 | 后端：推荐引擎 & 统计 |
| **H** | 基础概念 + 跨关联 | 前端：练习UI & 仪表盘 |
| **I** | KG 规范 + 汇总 | DevOps & 可视化数据 API |

> 详见 [docs/team-division.md](docs/team-division.md)

## 快速启动

### 1. 克隆仓库

```bash
git clone git@github.com:Ismweirdo/Data-Structure-Smart-Learning-Platform.git
cd Data-Structure-Smart-Learning-Platform
```

### 2. Docker 部署（推荐）

```bash
docker compose up -d
```

### 3. 本地开发

**后端：**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# API 文档: http://localhost:8000/api/docs
```

**前端：**
```bash
cd frontend
npm install
npm run dev
# 访问: http://localhost:3000
```

## Git 分支与提交规范

### 分支命名

每个成员两个分支：`kg/{成员}-{模块}` + `feat/{成员}-{功能}`，从 `main` 检出。

### Commit 格式

```
<type>(<scope>): <subject>

例：
  feat(exercise): 实现题目列表查询接口
  feat(kg-ui): 实现 D3.js 力导向图渲染
  chore(devops): 完成 PostgreSQL 建表
```

### 工作流

1. 在自己分支上开发
2. 完成后向 `main` 提 PR
3. 至少 2 人 review 后合入
4. 禁止直接在 `main` 上 commit

## 文档

- [需求规格说明书](docs/requirements.md)
- [技术设计文档](docs/technical-design.md)
- [团队分工方案](docs/team-division.md)
