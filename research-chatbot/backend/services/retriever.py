
# import re
# from langchain_community.vectorstores import FAISS
# from langchain_community.embeddings import HuggingFaceEmbeddings

# def retrieve_chunks(doc_id, query, exact_match=False):
#     embedder = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

#     vectorstore = FAISS.load_local(
#         f"data/embeddings/{doc_id}_index",
#         embedder,
#         allow_dangerous_deserialization=True
#     )

#     docs = vectorstore.similarity_search(query, k=5)

#     chunks = [
#         {
#             "content": doc.page_content,
#             "metadata": doc.metadata
#         }
#         for doc in docs
#     ]

#     # ✅ Build answer
#     if exact_match:
#         # Return first matching sentence
#         answer = "No exact match found."
#         for doc in docs:
#             sentences = re.split(r'(?<=[.!?]) +', doc.page_content)
#             for sentence in sentences:
#                 if query.lower() in sentence.lower():
#                     answer = sentence.strip()
#                     break
#             if answer != "No exact match found.":
#                 break
#     else:
#         # Return cleaned summary
#         summary_parts = []
#         for doc in docs:
#             text = doc.page_content.strip()

#             # ✅ Remove line breaks and extra spaces
#             text = text.replace("\n", " ").replace("  ", " ")

#             # ✅ Remove bracketed references like [19], [13,19]
#             text = re.sub(r"\[\d+(,\d+)*\]", "", text)

#             # ✅ Truncate long excerpts
#             if len(text) > 300:
#                 text = text[:297] + "..."

#             summary_parts.append(text)

#         answer = " ".join(summary_parts)

#     # ✅ Minimal citation info with paragraph
#     citations = []
#     for doc in docs:
#         page = doc.metadata.get("page", "N/A")
#         paragraph = doc.metadata.get("paragraph", "N/A")
#         citations.append({
#             "page": page,
#             "paragraph": paragraph
#         })

#     return {
#         "chunks": chunks,
#         "answer": answer,
#         "citations": citations
#     }
# ============================================================================
# services/retriever.py

# import re
# from langchain_community.vectorstores import FAISS
# from langchain_community.embeddings import HuggingFaceEmbeddings

# def retrieve_chunks(doc_id, query, exact_match=False):
#     embedder = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

#     vectorstore = FAISS.load_local(
#         f"data/embeddings/{doc_id}_index",
#         embedder,
#         allow_dangerous_deserialization=True
#     )

#     docs = vectorstore.similarity_search(query, k=5)

#     chunks = [
#         {
#             "content": doc.page_content,
#             "metadata": doc.metadata
#         }
#         for doc in docs
#     ]

#     # ✅ Build answer
#     if exact_match:
#         # Return first matching sentence
#         for doc in docs:
#             sentences = re.split(r'(?<=[.!?]) +', doc.page_content)
#             for sentence in sentences:
#                 if query.lower() in sentence.lower():
#                     answer = sentence.strip()
#                     break
#             else:
#                 continue
#             break
#         else:
#             answer = "No exact match found."
#     else:
#         # Return cleaned summary
#         summary_parts = []
#         for doc in docs:
#             text = doc.page_content.strip()
#             text = text.replace("\n", " ").replace("  ", " ")
#             text = re.sub(r"\[\d+(,\d+)*\]", "", text)
#             if len(text) > 300:
#                 text = text[:297] + "..."
#             summary_parts.append(text)
#         answer = " ".join(summary_parts)

#     # ✅ Minimal citation info
#     citations = []
#     for doc in docs:
#         page = doc.metadata.get("page", "N/A")
#         citations.append({ "page": page })

#     return {
#         "chunks": chunks,
#         "answer": answer,
#         "citations": citations
#     }

#==================================================================================
# {
#  "doc_id": "nutrients-16-04281-v2_2C64",
#  "question": "what is the Nutrient Composition Analysis done here"
# }
#===================================================================================
# services/retriever.py

import re
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from services.chat_history import save_chat_entry

def retrieve_chunks(doc_id, query, exact_match=False):
    embedder = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

    vectorstore = FAISS.load_local(
        f"data/embeddings/{doc_id}_index",
        embedder,
        allow_dangerous_deserialization=True
    )

    docs = vectorstore.similarity_search(query, k=5)

    chunks = [
        {
            "content": doc.page_content,
            "metadata": doc.metadata
        }
        for doc in docs
    ]

    # ✅ Build answer
    if exact_match:
        answer = "No exact match found."
        for doc in docs:
            sentences = re.split(r'(?<=[.!?]) +', doc.page_content)
            for sentence in sentences:
                if query.lower() in sentence.lower():
                    answer = sentence.strip()
                    break
            if answer != "No exact match found.":
                break
    else:
        summary_parts = []
        for doc in docs:
            text = doc.page_content.strip()
            text = text.replace("\n", " ").replace("  ", " ")
            text = re.sub(r"\[\d+(,\d+)*\]", "", text)
            if len(text) > 300:
                text = text[:297] + "..."
            summary_parts.append(text)
        answer = " ".join(summary_parts)

    # ✅ Save to chat history
    save_chat_entry(doc_id, query, answer)

    return {
        "chunks": chunks,
        "answer": answer
    }
