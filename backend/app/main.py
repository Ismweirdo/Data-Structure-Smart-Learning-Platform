from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, exercises, knowledge_graph, learning, visualization
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # TODO: I 启动时初始化数据库连接池、检查 Neo4j/Redis 连通性
    yield
    # TODO: I 关闭时释放连接资源


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/api/docs",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(knowledge_graph.router, prefix=settings.API_V1_PREFIX)
app.include_router(exercises.router, prefix=settings.API_V1_PREFIX)
app.include_router(learning.router, prefix=settings.API_V1_PREFIX)
app.include_router(visualization.router, prefix=settings.API_V1_PREFIX)


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": settings.VERSION}
