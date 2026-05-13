import os
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader

class VectorStoreService:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.vector_db_path = "faiss_index"
        self.vector_store = None

    def initialize_kb(self, kb_file_path):
        if not os.path.exists(kb_file_path):
            print(f"KB file {kb_file_path} not found.")
            return

        loader = TextLoader(kb_file_path)
        documents = loader.load()
        text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        docs = text_splitter.split_documents(documents)
        
        self.vector_store = FAISS.from_documents(docs, self.embeddings)
        self.vector_store.save_local(self.vector_db_path)
        print("Knowledge Base initialized and saved locally.")

    def load_kb(self):
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
        
        results = self.vector_store.similarity_search(query, k=k)
        return results
