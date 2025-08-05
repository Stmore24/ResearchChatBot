from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os
import uuid

def embed_document(file_path):
    try:
        loader = PyPDFLoader(file_path)
        docs = loader.load()

        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(docs)

        embedder = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = FAISS.from_documents(chunks, embedder)

        # Generate unique doc ID
        doc_id = generate_doc_id(file_path)

        # Save FAISS index
        index_path = f"data/embeddings/{doc_id}_index"
        os.makedirs("data/embeddings", exist_ok=True)
        vectorstore.save_local(index_path)

        return doc_id, [chunk.page_content for chunk in chunks]

    except Exception as e:
        print(f"Embedding error: {e}")
        raise e

def generate_doc_id(file_path):
    base = os.path.splitext(os.path.basename(file_path))[0]
    suffix = uuid.uuid4().hex[:4].upper()
    return f"{base}_{suffix}"
