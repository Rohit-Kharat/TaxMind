# TaxMind AI Assistant 🇮🇳

TaxMind is an AI-powered tax assistant tailored for the Indian tax system (GST, Income Tax, etc.). It features a beautiful React dashboard, an intelligent chat interface powered by LangChain and OpenAI, and a document processing engine for analyzing tax returns and spreadsheets.

## Features
- **AI Tax Assistant**: Ask questions about GST, Income Tax, and compliance rules.
- **RAG & Vector Store**: Upload your PDFs and Excel files to augment the AI's knowledge base.
- **Analytics Dashboard**: Visualize tax liabilities, GST payments, and deductions.
- **Settings Management**: Choose between the Old and New Tax Regimes for personalized calculations.
- **Stateful Database**: Uploaded documents and metadata are persisted securely using SQLAlchemy and SQLite.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS (v4), Chart.js
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **AI/RAG**: LangChain, FAISS, OpenAI (`gpt-4`), PyMuPDF
- **Deployment**: Docker, Docker Compose

## Quick Start (Docker)

The easiest way to run the application is using Docker Compose:

```bash
# Add your OpenAI API key to backend/.env
echo "OPENAI_API_KEY=sk-your-key-here" > backend/.env

# Build and start the containers
docker-compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8000`

## Local Development

If you prefer to run the components separately:

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
