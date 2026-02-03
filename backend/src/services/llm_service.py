"""
LLM Service - Unified interface for Groq and Ollama.
Groq: Free tier with Llama 3, Mixtral models.
Ollama: Local fallback for development/offline use.
"""
import httpx
from typing import Optional, List, Dict, Any
from abc import ABC, abstractmethod

from src.core.config import settings


class BaseLLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    async def complete(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Generate completion from prompt."""
        pass

    @abstractmethod
    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Generate chat completion from message history."""
        pass


class GroqProvider(BaseLLMProvider):
    """Groq API provider - free tier with fast inference."""

    def __init__(self, api_key: str, model: str = "llama-3.1-70b-versatile"):
        self.api_key = api_key
        self.model = model
        self.base_url = "https://api.groq.com/openai/v1"

    async def complete(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Generate completion using Groq API."""
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        return await self.chat(messages, temperature, max_tokens)

    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Generate chat completion using Groq API."""
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": self.model,
                    "messages": messages,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]


class OllamaProvider(BaseLLMProvider):
    """Ollama local provider - completely free, runs locally."""

    def __init__(self, base_url: str = "http://localhost:11434", model: str = "llama3"):
        self.base_url = base_url
        self.model = model

    async def complete(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Generate completion using Ollama API."""
        full_prompt = prompt
        if system_prompt:
            full_prompt = f"{system_prompt}\n\n{prompt}"

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["response"]

    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 1024,
    ) -> str:
        """Generate chat completion using Ollama API."""
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": self.model,
                    "messages": messages,
                    "stream": False,
                    "options": {
                        "temperature": temperature,
                        "num_predict": max_tokens,
                    },
                },
            )
            response.raise_for_status()
            data = response.json()
            return data["message"]["content"]


class LLMService:
    """
    Unified LLM service with automatic provider selection.
    Uses Groq by default (free tier), falls back to Ollama if unavailable.
    """

    def __init__(
        self,
        provider: Optional[str] = None,
        groq_api_key: Optional[str] = None,
        ollama_base_url: Optional[str] = None,
    ):
        self.provider_name = provider or settings.LLM_PROVIDER
        self.groq_api_key = groq_api_key or settings.GROQ_API_KEY
        self.ollama_base_url = ollama_base_url or settings.OLLAMA_BASE_URL

        # Initialize primary provider
        if self.provider_name == "groq" and self.groq_api_key:
            self._provider = GroqProvider(
                api_key=self.groq_api_key,
                model=settings.GROQ_MODEL,
            )
        else:
            self._provider = OllamaProvider(
                base_url=self.ollama_base_url,
                model=settings.OLLAMA_MODEL,
            )

        # Keep fallback ready
        self._fallback = OllamaProvider(
            base_url=self.ollama_base_url,
            model=settings.OLLAMA_MODEL,
        )

    async def complete(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """Generate completion with automatic fallback."""
        temp = temperature or settings.LLM_TEMPERATURE
        tokens = max_tokens or settings.LLM_MAX_TOKENS

        try:
            return await self._provider.complete(prompt, system_prompt, temp, tokens)
        except Exception as e:
            # Try fallback provider
            if self._provider != self._fallback:
                try:
                    return await self._fallback.complete(prompt, system_prompt, temp, tokens)
                except Exception:
                    pass
            raise RuntimeError(f"All LLM providers failed: {e}")

    async def chat(
        self,
        messages: List[Dict[str, str]],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        """Generate chat completion with automatic fallback."""
        temp = temperature or settings.LLM_TEMPERATURE
        tokens = max_tokens or settings.LLM_MAX_TOKENS

        try:
            return await self._provider.chat(messages, temp, tokens)
        except Exception as e:
            # Try fallback provider
            if self._provider != self._fallback:
                try:
                    return await self._fallback.chat(messages, temp, tokens)
                except Exception:
                    pass
            raise RuntimeError(f"All LLM providers failed: {e}")

    async def health_check(self) -> Dict[str, Any]:
        """Check LLM provider availability."""
        results = {"primary": None, "fallback": None}

        # Check primary
        try:
            await self._provider.complete("Hello", max_tokens=10)
            results["primary"] = {"status": "ok", "provider": self.provider_name}
        except Exception as e:
            results["primary"] = {"status": "error", "error": str(e)}

        # Check fallback
        try:
            await self._fallback.complete("Hello", max_tokens=10)
            results["fallback"] = {"status": "ok", "provider": "ollama"}
        except Exception as e:
            results["fallback"] = {"status": "error", "error": str(e)}

        return results


# Singleton instance
_llm_service: Optional[LLMService] = None


def get_llm_service() -> LLMService:
    """Get or create LLM service singleton."""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
