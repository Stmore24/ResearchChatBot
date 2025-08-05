from fastapi import FastAPI
from api.routes.upload import router as upload_router
from api.routes.chat import router as chat_router
from api.routes.citation import router as citation_router
from api.routes.view_docs import router as view_docs_router

from database.schema import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Research Chatbot API")

app.include_router(upload_router, prefix="/upload")
app.include_router(chat_router, prefix="/chat")
# app.include_router(citation_router, prefix="/citation")
# app.include_router(view_docs_router, prefix="/docs")

from api.routes.view_docs import router as view_docs_router
from api.routes.chat_history_api import router as chat_history_router

app.include_router(view_docs_router, prefix="/documents")
app.include_router(chat_history_router)