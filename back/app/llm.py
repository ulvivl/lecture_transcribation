import logging
import re
from typing import Dict, List, Optional, Set, Tuple

import nltk
import numpy as np
import spacy
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms.huggingface_pipeline import HuggingFacePipeline
from langchain.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langchain.schema.runnable import RunnablePassthrough
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import Chroma
from nltk.tokenize import word_tokenize
from transformers import AutoTokenizer

from app.prompts import (
    DEFAULT_GLOSARY_TEMPLATE,
    DEFAULT_MISTRAL_SYSTEM,
    EXTRACT_BASE_TEMPLATE,
    EXTRACT_CONCLUSION_TEMPLATE,
    EXTRACT_INTRO_TEMPLATE,
    EXTRACT_THEME_TEMPLATE,
    QA_TEMPLATE,
    RETRIEVAL_MISTRAL_SYSTEM,
)

__import__("pysqlite3")
import sys

sys.modules["sqlite3"] = sys.modules.pop("pysqlite3")

logger = logging.getLogger(__name__)

nltk.download("punkt")


def filter_by_words(string: str) -> bool:
    return len(word_tokenize(string)) > 2


def filter_by_format(string: str) -> bool:
    return re.match(pattern=r"Термин\s+\d+:\s[\w\s]+\s\-\s.+\.$", string=string) is not None


def format_docs(docs):
    return "\n\n".join([d.page_content for d in docs])


def process(nlp: spacy.language.Language, text: str):
    doc = nlp(text)
    sents = list(doc.sents)
    vecs = np.stack([sent.vector / sent.vector_norm for sent in sents])

    return sents, vecs


def cluster_text(sents, vecs, threshold):
    clusters = [[0]]
    for i in range(1, len(sents)):
        if np.dot(vecs[i], vecs[i - 1]) < threshold:
            clusters.append([])
        clusters[-1].append(i)

    return clusters


def split_into_paragraphs(nlp, input_text):  # pylint: disable=too-many-locals
    # Initialize the clusters lengths list and final texts list
    clusters_lens = []
    final_texts = []

    # Process the chunk
    threshold = 0.05
    sents, vecs = process(nlp, input_text)

    # Cluster the sentences
    clusters = cluster_text(sents, vecs, threshold)

    for cluster in clusters:
        cluster_txt = " ".join([sents[i].text for i in cluster])
        cluster_len = len(cluster_txt)

        # Check if the cluster is too short
        if cluster_len < 800:
            continue

        # Check if the cluster is too long
        if cluster_len > 3000:
            threshold = 0.1
            sents_div, vecs_div = process(nlp, cluster_txt)
            reclusters = cluster_text(sents_div, vecs_div, threshold)

            for subcluster in reclusters:
                div_txt = " ".join([sents_div[i].text for i in subcluster])
                div_len = len(div_txt)

                if div_len < 800 or div_len > 3000:
                    continue

                clusters_lens.append(div_len)
                final_texts.append(div_txt)

        else:
            clusters_lens.append(cluster_len)
            final_texts.append(cluster_txt)

    return final_texts


FILTERS = [filter_by_format, filter_by_words]


class LLMExecutor:  # pylint: disable=too-many-instance-attributes
    def __init__(  # pylint: disable=too-many-arguments
        self,
        model_id: str = "IlyaGusev/saiga_mistral_7b_merged",
        embedding_model: str = "sentence-transformers/paraphrase-multilingual-mpnet-base-v2",
        device: int = 0,
        batch_size: int = 16,
        model_kwargs: Optional[dict] = None,
        chunk_size: int = 1024,
        chunk_overlap: int = 0,
        advanced: bool = False,
        retrieval_threshold: float = -1.5,
    ) -> None:
        self.device = device
        model_kwargs = model_kwargs or {
            "exponential_decay_length_penalty": (2450, 2.5),
            "repetition_penalty": 1.1,
            "temperature": 0.01,
            "max_length": 2560,
            "do_sample": True,
            "top_p": 0.9,
        }

        self.tokenizer = AutoTokenizer.from_pretrained("IlyaGusev/saiga_mistral_7b_merged")
        self.splitter = RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
            tokenizer=self.tokenizer, chunk_size=chunk_size, chunk_overlap=chunk_overlap, add_start_index=True
        )
        self.llm = HuggingFacePipeline.from_model_id(
            model_id=model_id,
            task="text-generation",
            device=self.device,
            batch_size=batch_size,
            model_kwargs=model_kwargs,
        )
        self.glosary_prompt = ChatPromptTemplate.from_messages(
            [("system", DEFAULT_MISTRAL_SYSTEM), ("human", DEFAULT_GLOSARY_TEMPLATE)]
        )
        # ADVANCED PART
        self.advanced = advanced
        self.retrieval_threshold = retrieval_threshold
        self.embedding_model = embedding_model
        self.embedder: HuggingFaceEmbeddings = None  # type: ignore
        self.rag_splitter = RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
            tokenizer=self.tokenizer, chunk_size=96, chunk_overlap=0, add_start_index=True
        )
        self.retrieval_prompt = ChatPromptTemplate.from_template(RETRIEVAL_MISTRAL_SYSTEM)
        # QA
        self.qa_prompt = ChatPromptTemplate.from_messages([("system", DEFAULT_MISTRAL_SYSTEM), ("human", QA_TEMPLATE)])
        # CONSPECT
        self.conspect_splitter = RecursiveCharacterTextSplitter.from_huggingface_tokenizer(
            tokenizer=self.tokenizer, chunk_size=512, chunk_overlap=128, add_start_index=True
        )
        self.nlp: spacy.language.Language = None  # type: ignore

    def generate_glosary(self, transcription: dict) -> List[Dict[str, str]]:
        text = "\n".join([_["text"] for _ in transcription["segments"]]).replace("  ", " ").strip()
        text_parts = self.splitter.create_documents([text])
        gpu_chain = self.glosary_prompt | self.llm.bind(stop=[" bot"])
        questions = [{"text": _.page_content} for _ in text_parts]

        logger.info("Start glosary generation")
        chunks_definitions = gpu_chain.batch(questions)
        assert len(questions) == len(chunks_definitions)

        definitions: List[str] = []
        for chunk_definitions in chunks_definitions:
            definitions.extend(list(map(str.strip, chunk_definitions.split("\n"))))

        termin2defenition = self._prepare_definitions(definitions=definitions)
        if self.advanced:
            logger.info("Start advanced retrieval cleaning")
            termin2defenition = self.retrieval_cleaning(
                text=text, termin2defenition=termin2defenition, threshold=self.retrieval_threshold
            )
        return [termin2defenition, self.generate_qa(text=text)]

    @staticmethod
    def _prepare_definitions(definitions: List[str]) -> Dict[str, str]:
        cleaned_definitions: List[str] = []
        for definition in definitions:
            for filter_ in FILTERS:
                if not filter_(definition):
                    continue
                cleaned_definitions.append(definition)

        termin2defenition: Dict[str, str] = {}
        for definition in cleaned_definitions:
            match = re.match(r"Термин\s+\d+:\s([\w\s]+?)\s\-\s(.+\.)$", definition)
            if match is None:
                continue
            termin2defenition[match.group(1)] = match.group(2)
        return termin2defenition

    def retrieval_cleaning(
        self,
        text: str,
        termin2defenition: Dict[str, str],
        threshold: float = -1.5,
    ) -> Dict[str, str]:
        if self.embedder is None:
            self.embedder = HuggingFaceEmbeddings(model_name=self.embedding_model)
        texts_rag = self.rag_splitter.create_documents([text])
        vectorstore = Chroma.from_documents(documents=texts_rag, embedding=self.embedder)
        retriever = vectorstore.as_retriever()
        corrupted_terms: Set[str] = set()
        for termim in termin2defenition.keys():
            if vectorstore.similarity_search_with_relevance_scores(f"определение {termim}")[1][1] < threshold:
                corrupted_terms.add(termim)
        retrieval_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}  # type: ignore
            | self.retrieval_prompt
            | self.llm.bind(stop=[" bot"])
            | StrOutputParser()
        )
        updated_defenitions = retrieval_chain.batch([f"Что такое {termin}?" for termin in termin2defenition.keys()])
        return dict(zip(termin2defenition.keys(), updated_defenitions))

    @staticmethod
    def _prepare_queries(raw_queries: List[str]) -> List[str]:
        queries: List[str] = []
        for raw_query in raw_queries:
            raw_query = raw_query.strip()
            for query in raw_query.splitlines():
                match = re.match(r"Вопрос \d+\: (.+?)?$", query)
                if match is None:
                    continue
                queries.append(match.group(1))
        return queries

    def generate_qa(self, text: str) -> Dict[str, str]:
        if self.embedder is None:
            self.embedder = HuggingFaceEmbeddings(model_name=self.embedding_model)
        qa_chain = self.qa_prompt | self.llm.bind(stop=[" bot"])
        texts_qa = self.splitter.create_documents([text])
        vectorstore = Chroma.from_documents(documents=texts_qa, embedding=self.embedder)
        retriever = vectorstore.as_retriever()
        queries = self._prepare_queries(qa_chain.batch([{"text": _.page_content} for _ in texts_qa[:3]]))
        retrieval_chain = (
            {"context": retriever | format_docs, "question": RunnablePassthrough()}  # type: ignore
            | self.retrieval_prompt
            | self.llm.bind(stop=[" bot"])
            | StrOutputParser()
        )
        answers = retrieval_chain.batch(queries)
        return dict(zip(queries, answers))

    def generate_conspect(self, transcription: dict) -> List:
        text = "\n".join([_["text"].strip() for _ in transcription["segments"]])
        chunks = [_.page_content for _ in self.conspect_splitter.create_documents([text])]

        prompt = ChatPromptTemplate.from_messages(
            [("system", DEFAULT_MISTRAL_SYSTEM), ("human", EXTRACT_BASE_TEMPLATE)]
        )

        chain = prompt | self.llm.bind(stop=[" bot"])
        questions = [
            {"prompt": cur_text}
            for cur_text in (EXTRACT_INTRO_TEMPLATE % chunks[0], EXTRACT_CONCLUSION_TEMPLATE % chunks[-1])
        ]
        intro, conclusion = chain.batch(questions)

        # SPLIT and get themes
        text = text.replace("  ", " ").strip()
        if self.nlp is None:
            self.nlp = spacy.load("ru_core_news_sm")

        paragraphs = split_into_paragraphs(self.nlp, text)
        prompt = ChatPromptTemplate.from_messages(
            [("system", DEFAULT_MISTRAL_SYSTEM), ("human", EXTRACT_THEME_TEMPLATE)]
        )

        chain = prompt | self.llm.bind(stop=[" bot"])
        questions = [{"text": cur_text} for cur_text in paragraphs]
        themes = chain.batch(questions, {"truncation": True, "max_length": 1536})
        return [intro, [themes, paragraphs], conclusion]
