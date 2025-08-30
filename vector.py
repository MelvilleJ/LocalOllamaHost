from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import json


jsonl_path = "./resume_dataset.jsonl"
db_location = "./chrome_langchain_db4"


documents = []
with open(jsonl_path, "r", encoding="utf-8") as f:
    for line in f:
        if line.strip():  
            entry = json.loads(line)
            documents.append(
                Document(
                    page_content=entry["content"],
                    metadata={"id": entry.get("id"), "title": entry.get("title")}
                )
            )


embeddings = OllamaEmbeddings(
    model="nomic-embed-text",
    base_url="http://192.168.100.244:11434"
)

vector_store = Chroma(
    collection_name="resume_collection",
    persist_directory=db_location,
    embedding_function=embeddings
)


if documents:
    vector_store.add_documents(documents=documents)
    print(f" JSONL entries added to the vector database!")


retriever = vector_store.as_retriever(search_kwargs={"k": 50})
