def map_citations(chunks):
    citations = []
    for chunk in chunks:
        meta = chunk.get("metadata", {})
        page = meta.get("page", "unknown")
        excerpt = chunk["content"][:150] + "..."
        citations.append({
            "page": page,
            "excerpt": excerpt,
            "confidence": "high"
        })
    return citations
