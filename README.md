# Local Ollama AI Server with RAG & API Access

This project sets up an **AI server powered by Ollama** on Ubuntu, with cross-platform access from Windows and other machines over the network. It provides:

- **`main.py`** → Chat interface with the Ollama AI server  
- **`vector.py`** → RAG (Retrieval Augmented Generation) pipeline for context-aware responses  
- **`api.py`** → REST API endpoints for integrating the AI into **web apps** (e.g., personal portfolio, dashboards, or custom apps)
- **`chatbox.jsx`** → React Component to incorperate and test your local Agent.

---

## 🚀 Features
- AI inference via [Ollama](https://ollama.ai/) running on Ubuntu  
- Access the AI server from Windows or other devices on your network  
- RAG support for **context-aware answers** (document retrieval + AI)  
- API endpoints to connect your AI with **frontends, web apps, and portfolios**  
- Clean, modular Python scripts for chatting, retrieval, and integration  

---

## 🛠️ Installation & Setup

### 1. Requirements
- **Ubuntu machine** with Ollama installed  
- **Python 3.10+**  
- Recommended: Virtual environment  
