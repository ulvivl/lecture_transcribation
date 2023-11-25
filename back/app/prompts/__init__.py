from pathlib import Path

_DIR = Path(__file__).parent

DEFAULT_GLOSARY_TEMPLATE = (_DIR / "glosary_template.txt").read_text()
DEFAULT_MISTRAL_SYSTEM = (_DIR / "default_mistral_system.txt").read_text()
RETRIEVAL_TEMPLATE = (_DIR / "retrieval_template.txt").read_text()
RETRIEVAL_MISTRAL_SYSTEM = (_DIR / "retrieval_mistral_system.txt").read_text()
QA_TEMPLATE = (_DIR / "qa_template.txt").read_text()
EXTRACT_INTRO_TEMPLATE = (_DIR / "extract_intro_template.txt").read_text()
EXTRACT_CONCLUSION_TEMPLATE = (_DIR / "extract_conclusion_template.txt").read_text()
EXTRACT_BASE_TEMPLATE = (_DIR / "extract_base_template.txt").read_text()
EXTRACT_THEME_TEMPLATE = (_DIR / "extract_theme_template.txt").read_text()
