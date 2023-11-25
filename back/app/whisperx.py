from pathlib import Path
from typing import Any, Optional, Union

import numpy as np
import torch
import whisperx
from whisperx.asr import FasterWhisperPipeline


def create_pipeline(  # pylint: disable=too-many-arguments
    model: str = "large-v2",
    device: Union[str, torch.device] = "cuda",
    device_index: int = 0,
    language: Optional[str] = None,
    dtype: str = "float16",
    threads: int = 16,
) -> FasterWhisperPipeline:
    return whisperx.load_model(
        whisper_arch=model,
        device=device,
        device_index=device_index,
        language=language,
        compute_type=dtype,
        threads=threads,
    )


class WhisperXExecutor:  # pylint: disable=too-many-instance-attributes
    def __init__(  # pylint: disable=too-many-arguments
        self,
        model: str = "large-v2",
        device: Union[str, torch.device] = "cuda",
        device_index: int = 0,
        language: Optional[str] = None,
        dtype: str = "float16",
        threads: int = 16,
        batch_size: int = 128,
    ) -> None:
        self.pipe = create_pipeline(
            model=model, device=device, device_index=device_index, language=language, dtype=dtype, threads=threads
        )
        self.device = f"{device}:{device_index}" if device == "cuda" else device
        self.language = language
        self.batch_size = batch_size
        self.a_lang: str = None  # type: ignore
        self.a_model: Any = None  # type: ignore
        self.a_meta: dict = None  # type: ignore
        self.d_model: Any = None  # type: ignore

    @staticmethod
    def load_audio(audio_path: Union[str, Path], sample_rate: int = 16_000) -> np.ndarray:
        return whisperx.load_audio(file=str(audio_path), sr=sample_rate)

    def transcribe(  # pylint: disable=too-many-arguments
        self,
        audio: np.ndarray,
        language: Optional[str] = None,
        chunk_size: int = 30,
        num_workers: int = 0,
        print_progress: bool = False,
    ) -> dict:
        language = language or self.language
        return self.pipe.transcribe(
            audio=audio,
            batch_size=self.batch_size,
            language=language,
            chunk_size=chunk_size,
            num_workers=num_workers,
            print_progress=print_progress,
        )

    def align(self, audio: np.ndarray, transcription: dict) -> dict:
        if any(_ is None for _ in [self.a_lang, self.a_meta, self.a_model]) or self.a_lang != transcription["language"]:
            self.a_lang = transcription["language"]
            self.a_model, self.a_meta = whisperx.load_align_model(language_code=self.a_lang, device=self.device)
        return whisperx.align(
            transcript=transcription["segments"],
            audio=audio,
            model=self.a_model,
            align_model_metadata=self.a_meta,
            device=self.device,
            return_char_alignments=False,
        )

    def diarize(  # pylint: disable=too-many-arguments
        self,
        audio: np.ndarray,
        transcription: dict,
        min_speakers: Optional[int] = None,
        max_speakers: Optional[int] = None,
        hf_token: Optional[str] = None,
        fill_nearest: bool = False,
    ) -> dict:
        if self.d_model is None:
            assert hf_token is not None, "Need hf_token for download weights"
            self.d_model = whisperx.DiarizationPipeline(use_auth_token=hf_token, device=self.device)

        diarize_segments = self.d_model(audio, min_speakers=min_speakers, max_speakers=max_speakers)

        return whisperx.assign_word_speakers(
            diarize_df=diarize_segments, transcript_result=transcription, fill_nearest=fill_nearest
        )
