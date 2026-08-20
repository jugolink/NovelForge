from fastapi import APIRouter, Depends

from app.api.endpoints import ai, cards, llm_configs, projects, prompts, auth
from app.api.endpoints import assistant as assistant_ep
from app.api.endpoints import chapter_reviews as chapter_reviews_ep
from app.api.endpoints import context as context_ep
from app.api.endpoints import foreshadow as foreshadow_ep
from app.api.endpoints import knowledge as knowledge_ep
from app.api.endpoints import memory as memory_ep
from app.api.endpoints import relation_graph as relation_graph_ep
from app.api.endpoints import workflow_agent as workflow_agent_ep
from app.api.endpoints import workflows as workflows_ep
from app.api.dependencies import get_current_user


api_router = APIRouter()

# 无需鉴权的路由
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])

# 需要鉴权的路由
auth_deps = [Depends(get_current_user)]
api_router.include_router(projects.router, prefix="/projects", tags=["projects"], dependencies=auth_deps)
api_router.include_router(llm_configs.router, prefix="/llm-configs", tags=["llm-configs"], dependencies=auth_deps)

api_router.include_router(ai.router, prefix="/ai", tags=["ai"], dependencies=auth_deps)
api_router.include_router(assistant_ep.router, prefix="/ai", tags=["assistant"], dependencies=auth_deps)
api_router.include_router(workflow_agent_ep.router, tags=["workflow-agent"], dependencies=auth_deps)
api_router.include_router(prompts.router, prefix="/prompts", tags=["prompts"], dependencies=auth_deps)
api_router.include_router(cards.router, prefix="", tags=["cards"], dependencies=auth_deps)
api_router.include_router(chapter_reviews_ep.router, prefix="/chapter-reviews", tags=["chapter-reviews"], dependencies=auth_deps)

api_router.include_router(context_ep.router, prefix="/context", tags=["context"], dependencies=auth_deps)
api_router.include_router(memory_ep.router, prefix="/memory", tags=["memory"], dependencies=auth_deps)
api_router.include_router(relation_graph_ep.router, prefix="/relation-graph", tags=["relation-graph"], dependencies=auth_deps)
api_router.include_router(foreshadow_ep.router, prefix="/foreshadow", tags=["foreshadow"], dependencies=auth_deps)
api_router.include_router(knowledge_ep.router, prefix="/knowledge", tags=["knowledge"], dependencies=auth_deps)
api_router.include_router(workflows_ep.router, tags=["workflows"], dependencies=auth_deps)
