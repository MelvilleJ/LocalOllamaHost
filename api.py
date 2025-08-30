import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from vector import retriever
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LLM and prompt
model = OllamaLLM(model="mistral:instruct", base_url="http://192.168.100.244:11434")
template = """
You are Leslie, a professional AI assistant.
You must ONLY answer from the provided data. 
If the answer cannot be fully answered from the data, respond with exactly:
"I don't know."

Here is the data related to Joshua Melville: {data}
Here is the question: {question}

Rules:
- Never list, invent, or reinterpret items in the data.
- Never re-label items (e.g., do not call technologies "poets").
- If the requested category is not present in the data, respond only with "I don't know."
- Do not attempt to partially answer.

"""
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model


class Query(BaseModel):
    question: str

@app.post("/ask")
def ask(query: Query):
    if not query.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    docs = retriever.invoke(query.question)
    if not docs:
        return {"answer": "No relevant information found in the dataset."}


    data = "\n\n".join(
        [f"{d.page_content}\nPage: {d.metadata.get('page_number', 'N/A')}" 
         for d in docs]
    )


    raw_result = chain.invoke({"data": data, "question": query.question})

    cleaned_result = re.sub(r"<think>.*?</think>", "", raw_result, flags=re.DOTALL).strip()

    return {"answer": cleaned_result}

@app.get("/")
def read_root():
    return {"message": "API is running. Use POST /ask to ask questions."}
 