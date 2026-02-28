import base64
import json
import re
from dataclasses import dataclass

import requests
from fastapi import HTTPException

from src.config import get_settings


@dataclass(frozen=True)
class ImageInput:
    content_type: str
    data: bytes


def extract_ingredients_from_text(text: str) -> list[str]:
    prompt = (
        "Extract only ingredient names from the input text. "
        "Return strict JSON only in this format: "
        '{"ingredients":["ingredient1","ingredient2"]}. '
        "No explanation, no markdown."
    )
    raw = _call_gemini(
        [{"text": prompt}, {"text": f"Input text:\n{text}"}],
    )
    return _parse_ingredients(raw)


def extract_ingredients_from_images(images: list[ImageInput]) -> list[str]:
    parts: list[dict] = [
        {
            "text": (
                "You will receive multiple refrigerator or ingredient images. "
                "Extract only ingredient names considering all images together. "
                'Return strict JSON only: {"ingredients":["ingredient1","ingredient2"]}. '
                "No explanation, no markdown."
            )
        }
    ]
    for image in images:
        parts.append(
            {
                "inline_data": {
                    "mime_type": image.content_type,
                    "data": base64.b64encode(image.data).decode("ascii"),
                }
            }
        )

    raw = _call_gemini(parts)
    return _parse_ingredients(raw)


def merge_ingredient_lists(current_ingredients: list[str], ingredient_lists: list[list[str]]) -> list[str]:
    merged = list(current_ingredients)
    for values in ingredient_lists:
        merged.extend(values)
    return _normalize_and_dedup(merged)


def _call_gemini(parts: list[dict]) -> str:
    settings = get_settings()
    if not settings.gemini_api_key:
        raise HTTPException(status_code=400, detail="GEMINI_API_KEY is required.")

    url = (
        f"https://generativelanguage.googleapis.com/v1beta/models/"
        f"{settings.gemini_model}:generateContent?key={settings.gemini_api_key}"
    )
    payload = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseMimeType": "application/json"},
    }

    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
    except requests.RequestException as exc:
        raise HTTPException(status_code=502, detail=f"Gemini API request failed: {exc}") from exc

    try:
        data = response.json()
    except ValueError as exc:
        raise HTTPException(status_code=502, detail="Gemini API returned invalid JSON.") from exc
    candidates = data.get("candidates", [])
    if not candidates:
        return ""

    content = candidates[0].get("content", {})
    text_parts = []
    for part in content.get("parts", []):
        text_value = part.get("text")
        if isinstance(text_value, str):
            text_parts.append(text_value)
    return "\n".join(text_parts).strip()


def _parse_ingredients(raw_text: str) -> list[str]:
    parsed = _try_parse_json(raw_text)
    if parsed is not None:
        return _normalize_and_dedup(parsed)

    lines: list[str] = []
    for line in raw_text.splitlines():
        item = line.strip()
        item = re.sub(r"^[-*]\s*", "", item)
        item = re.sub(r"^\d+[\).\-\s]+", "", item)
        item = item.strip(" ,")
        if item:
            if "," in item:
                lines.extend([part.strip() for part in item.split(",") if part.strip()])
            else:
                lines.append(item)
    return _normalize_and_dedup(lines)


def _try_parse_json(raw_text: str) -> list[str] | None:
    if not raw_text:
        return []

    candidates = [raw_text.strip()]
    code_match = re.search(r"```(?:json)?\s*(.*?)```", raw_text, flags=re.IGNORECASE | re.DOTALL)
    if code_match:
        candidates.append(code_match.group(1).strip())

    for candidate in candidates:
        try:
            loaded = json.loads(candidate)
        except json.JSONDecodeError:
            continue

        if isinstance(loaded, dict):
            ingredients = loaded.get("ingredients")
            if isinstance(ingredients, list):
                return [str(item) for item in ingredients]
        if isinstance(loaded, list):
            return [str(item) for item in loaded]

    return None


def _normalize_and_dedup(values: list[str]) -> list[str]:
    deduped: list[str] = []
    seen: set[str] = set()
    for value in values:
        normalized = value.strip().lower()
        if not normalized or normalized in seen:
            continue
        seen.add(normalized)
        deduped.append(normalized)
    return deduped
