setup: requirements.txt
	pip install -r requirements.txt
	pip install git+https://github.com/m-bain/whisperX
	python3 -m spacy download ru_core_news_sm
application: application.py
	uvicorn application:app --reload
whisper: consumer_whisper.py
	python consumer_whisper.py
llm_glosary: consumer_glosary.py
	python consumer_glosary.py
llm_conspect: consumer_conspect.py
	python consumer_conspect.py