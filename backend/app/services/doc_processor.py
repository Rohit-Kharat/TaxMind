import fitz  # PyMuPDF
import pandas as pd
import io

class DocumentProcessor:
    @staticmethod
    def parse_pdf(file_bytes):
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text

    @staticmethod
    def parse_excel(file_bytes):
        df = pd.read_excel(io.BytesIO(file_bytes))
        return df.to_string()

    @staticmethod
    def cleanup_text(text):
        # Basic cleanup
        return " ".join(text.split())
