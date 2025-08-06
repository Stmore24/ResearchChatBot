from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes.upload import router as upload_router
from api.routes.chat import router as chat_router
from api.routes.citation import router as citation_router
from api.routes.view_docs import router as view_docs_router
from api.routes.chat_history_api import router as chat_history_router

from database.schema import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Research Chatbot API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://0.0.0.0:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router, prefix="/upload")
app.include_router(chat_router, prefix="/chat")
app.include_router(view_docs_router, prefix="/documents")
app.include_router(chat_history_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)