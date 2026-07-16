from pypdf import PdfReader
from docx import Document

def file_extractor(filepath):
    if filepath.suffix.lower() == ".pdf":
        text=_pdf_extractor(filepath)
    elif filepath.suffix.lower() == ".docx":
        text=_docx_extractor(filepath)
    else:
        raise ValueError("invalid file type!! ")
    return text

def _pdf_extractor(filepath):
    reader= PdfReader(filepath)
    text= "\n".join(
        page.extract_text() or ""
        for page in reader.pages
    )
    return text

def _docx_extractor(filepath):
    doc = Document(filepath)

    text = ""

    # Extract paragraphs
    for para in doc.paragraphs:
        if para.text.strip():
            text += para.text.strip() + "\n"

    # Extract tables
    for table in doc.tables:
        for row in table.rows:
            row_text = " | ".join(cell.text.strip() for cell in row.cells)
            text += row_text + "\n"

    return text