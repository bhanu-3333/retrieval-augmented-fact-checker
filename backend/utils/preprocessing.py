import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s]', '', text)
    return text.strip()

def extract_claims(text):
    # Simplified: split by sentences and filter short ones
    sentences = re.split(r'[.!?]+', text)
    claims = [s.strip() for s in sentences if len(s.strip()) > 10]
    return claims if claims else [text]
