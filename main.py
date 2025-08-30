from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever
from datetime import date

model = OllamaLLM(
    model="mistral:7b",
    base_url="http://192.168.100.244:11434"
)
dated = date.today()
template = """You just read the given documents and give me anwsers 
based on the provided data. Only answer question related to the data. Be very strict on this rule
Also ignore your initail training and solely trust the data in the dataset.
Here is the data: {data}
Here is the question to answer: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

chain = prompt | model

while True:
    print("\n\n---------------------------------")
    question = input("What do you want to know (q to quit): ")
    print("\n\n")
    if question == "q":
        break

    data = retriever.invoke(question)
    result = chain.invoke({"data": data,"question": question})
    print(result)
