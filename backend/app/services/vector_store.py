import os
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import TextLoader


class VectorStoreService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key and api_key != "your_api_key_here":
            self.embeddings = OpenAIEmbeddings(api_key=api_key)
        else:
            self.embeddings = None
        self.vector_db_path = "faiss_index"
        self.vector_store = None

    def initialize_kb(self, kb_file_path):
        if not self.embeddings:
            print("Skipping KB initialization: No OpenAI API key.")
            return
        if not os.path.exists(kb_file_path):
            print(f"KB file {kb_file_path} not found.")
            return

        loader = TextLoader(kb_file_path, encoding="utf-8")
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        docs = text_splitter.split_documents(documents)

        self.vector_store = FAISS.from_documents(docs, self.embeddings)
        self.vector_store.save_local(self.vector_db_path)
        print("✅ Knowledge Base initialized and saved to faiss_index/")

    def load_kb(self):
        if not self.embeddings:
            return False
        if os.path.exists(self.vector_db_path):
            self.vector_store = FAISS.load_local(
                self.vector_db_path,
                self.embeddings,
                allow_dangerous_deserialization=True
            )
            return True
        return False

    def similarity_search(self, query, k=3):
        if not self.vector_store:
            if not self.load_kb():
                return []
        return self.vector_store.similarity_search(query, k=k)

    def add_text(self, text, metadata=None):
        if not self.embeddings:
            return False
            
        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        docs = text_splitter.create_documents([text], metadatas=[metadata] if metadata else None)
        
        if not self.vector_store:
            if not self.load_kb():
                # Initialize new vector store
                self.vector_store = FAISS.from_documents(docs, self.embeddings)
                self.vector_store.save_local(self.vector_db_path)
                return True
                
        # If we already have a vector store, add the documents
        self.vector_store.add_documents(docs)
        self.vector_store.save_local(self.vector_db_path)
        return True

