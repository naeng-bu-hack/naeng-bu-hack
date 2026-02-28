import base64
import difflib
import json
import re
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

import requests
from fastapi import HTTPException

from src.config import get_settings

_FALLBACK_CACHE: dict[str, str] = {}
_LOCALIZE_CACHE: dict[str, str] = {}


@dataclass(frozen=True)
class ImageInput:
    content_type: str
    data: bytes


def extract_ingredients_from_images(images: list[ImageInput]) -> list[str]:
    allowed_list = _allowed_ingredients_prompt_block()
    parts: list[dict] = [
        {
            "text": (
                "You will receive multiple refrigerator or ingredient images. "
                "Extract only ingredient names considering all images together. "
                "Return ingredient names in English only. "
                "You must only choose ingredients from the allowed list below. "
                "If unsure or not in the list, omit it. "
                'Return strict JSON only: {"ingredients":["ingredient1","ingredient2"]}. '
                "No explanation, no markdown.\n\n"
                f"Allowed ingredient list:\n{allowed_list}"
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
    parsed = _parse_ingredients(raw)
    return _restrict_to_allowed_ingredients(parsed, use_llm_fallback=True)


def normalize_ingredients(values: list[str], use_llm_fallback: bool = False) -> list[str]:
    return _restrict_to_allowed_ingredients(values, use_llm_fallback=use_llm_fallback)


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
        display = value.strip()
        dedup_key = display.lower()
        if not display or dedup_key in seen:
            continue
        seen.add(dedup_key)
        deduped.append(display)
    return deduped


@lru_cache
def _allowed_ingredients() -> tuple[str, ...]:
    file_path = Path(__file__).resolve().parent.parent / "ingredient_list_readable.txt"
    if not file_path.exists():
        return tuple()
    return tuple(line.strip() for line in file_path.read_text(encoding="utf-8").splitlines() if line.strip())


@lru_cache
def _allowed_ingredients_prompt_block() -> str:
    return "\n".join(_allowed_ingredients())


@lru_cache
def _allowed_ingredient_index() -> tuple[dict[str, str], tuple[str, ...]]:
    allowed = _allowed_ingredients()
    index: dict[str, str] = {}
    normalized_values: list[str] = []
    for item in allowed:
        key = _normalize_key(item)
        if not key:
            continue
        if key not in index:
            index[key] = item
            normalized_values.append(key)
    ko_map = _ingredient_ko_map()
    for english, korean in ko_map.items():
        eng_key = _normalize_key(english)
        canonical = index.get(eng_key)
        if not canonical:
            nearest = difflib.get_close_matches(eng_key, normalized_values, n=1, cutoff=0.9)
            if nearest:
                canonical = index[nearest[0]]
        if not canonical:
            continue
        ko_key = _normalize_key(korean)
        if ko_key and ko_key not in index:
            index[ko_key] = canonical
    return index, tuple(normalized_values)


def _normalize_key(value: str) -> str:
    normalized = value.strip().lower()
    normalized = re.sub(r"[^a-z0-9가-힣\s]", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized.strip()


def _plural_variants(key: str) -> list[str]:
    variants = [key]
    if key.endswith("es"):
        variants.append(key[:-2])
    if key.endswith("s"):
        variants.append(key[:-1])
    return [item for item in variants if item]


def _map_to_allowed_ingredient(value: str) -> str | None:
    index, normalized_values = _allowed_ingredient_index()
    if not index:
        return value.strip() or None

    key = _normalize_key(value)
    if not key:
        return None

    for variant in _plural_variants(key):
        if variant in index:
            return index[variant]

    nearest = difflib.get_close_matches(key, normalized_values, n=1, cutoff=0.9)
    if nearest:
        return index[nearest[0]]
    return None


def _restrict_to_allowed_ingredients(values: list[str], use_llm_fallback: bool = True) -> list[str]:
    mapped: list[str] = []
    unresolved: list[str] = []
    for value in values:
        resolved = _map_to_allowed_ingredient(value)
        if resolved:
            mapped.append(resolved)
        else:
            unresolved.append(value)

    if use_llm_fallback and unresolved:
        fallback = _resolve_unmapped_with_llm(unresolved)
        mapped.extend(fallback)

    return _normalize_and_dedup(mapped)


@lru_cache
def _ingredient_ko_map() -> dict[str, str]:
    file_path = Path(__file__).resolve().parent.parent / "ingredient_map_ko.json"
    if not file_path.exists():
        return {}
    try:
        loaded = json.loads(file_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError:
        return {}
    if not isinstance(loaded, dict):
        return {}
    return {str(key): str(value) for key, value in loaded.items()}


@lru_cache
def _ingredient_ko_map_index() -> dict[str, str]:
    index: dict[str, str] = {}
    for english, korean in _ingredient_ko_map().items():
        key = _normalize_key(english)
        if key:
            index[key] = korean
    return index


def localize_ingredient(value: str) -> str:
    key = _normalize_key(value)
    ko = _ingredient_ko_map_index().get(key) or _LOCALIZE_CACHE.get(key)
    if ko:
        return ko
    return value


def localize_ingredients(values: list[str], use_llm_fallback: bool = True) -> list[str]:
    localized: list[str] = []
    unresolved: list[str] = []
    for value in values:
        ko = localize_ingredient(value)
        if ko == value:
            unresolved.append(value)
        localized.append(ko)

    if use_llm_fallback and unresolved:
        translated = _translate_unmapped_to_korean(unresolved)
        for source, target in translated.items():
            _LOCALIZE_CACHE[_normalize_key(source)] = target
        localized = [localize_ingredient(value) for value in values]

    return localized


def _resolve_unmapped_with_llm(values: list[str]) -> list[str]:
    index, normalized_values = _allowed_ingredient_index()
    if not index or not normalized_values:
        return []

    resolved: list[str] = []
    unresolved_for_request: list[str] = []

    for raw in values:
        key = _normalize_key(raw)
        if not key:
            continue
        cached = _FALLBACK_CACHE.get(key)
        if cached:
            resolved.append(cached)
            continue
        unresolved_for_request.append(raw)

    if not unresolved_for_request:
        return _normalize_and_dedup(resolved)

    allowed_list = _allowed_ingredients_prompt_block()
    items_text = "\n".join(f"- {item}" for item in unresolved_for_request)
    prompt = (
        "Map each input ingredient to exactly one item from the allowed ingredient list. "
        "If no suitable item exists, use an empty string. "
        "Return strict JSON only in this format: "
        '{"mappings":[{"input":"...","matched":"..."}]}. '
        "No explanation, no markdown.\n\n"
        "Inputs:\n"
        f"{items_text}\n\n"
        "Allowed ingredient list:\n"
        f"{allowed_list}"
    )

    raw = _call_gemini([{"text": prompt}])
    mappings = _try_parse_mapping_json(raw)
    for input_value, matched_value in mappings:
        canonical = _map_to_allowed_ingredient(matched_value)
        if not canonical:
            continue
        input_key = _normalize_key(input_value)
        if input_key:
            _FALLBACK_CACHE[input_key] = canonical
        resolved.append(canonical)

    return _normalize_and_dedup(resolved)


def _try_parse_mapping_json(raw_text: str) -> list[tuple[str, str]]:
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
            mappings = loaded.get("mappings")
            if not isinstance(mappings, list):
                continue
            pairs: list[tuple[str, str]] = []
            for item in mappings:
                if not isinstance(item, dict):
                    continue
                input_value = item.get("input")
                matched_value = item.get("matched")
                if isinstance(input_value, str) and isinstance(matched_value, str):
                    pairs.append((input_value, matched_value))
            return pairs

    return []


def _translate_unmapped_to_korean(values: list[str]) -> dict[str, str]:
    unique_values = _normalize_and_dedup(values)
    if not unique_values:
        return {}

    items_text = "\n".join(f"- {item}" for item in unique_values)
    prompt = (
        "Translate each ingredient into natural Korean ingredient names. "
        "Return strict JSON only in this format: "
        '{"translations":[{"input":"...","korean":"..."}]}. '
        "No explanation, no markdown.\n\n"
        "Inputs:\n"
        f"{items_text}"
    )

    raw = _call_gemini([{"text": prompt}])
    return _try_parse_translation_json(raw)


def _try_parse_translation_json(raw_text: str) -> dict[str, str]:
    if not raw_text:
        return {}

    candidates = [raw_text.strip()]
    code_match = re.search(r"```(?:json)?\s*(.*?)```", raw_text, flags=re.IGNORECASE | re.DOTALL)
    if code_match:
        candidates.append(code_match.group(1).strip())

    for candidate in candidates:
        try:
            loaded = json.loads(candidate)
        except json.JSONDecodeError:
            continue

        if not isinstance(loaded, dict):
            continue
        translations = loaded.get("translations")
        if not isinstance(translations, list):
            continue

        result: dict[str, str] = {}
        for item in translations:
            if not isinstance(item, dict):
                continue
            input_value = item.get("input")
            korean_value = item.get("korean")
            if not isinstance(input_value, str) or not isinstance(korean_value, str):
                continue
            korean_value = korean_value.strip()
            if not korean_value or not re.search(r"[가-힣]", korean_value):
                continue
            result[input_value] = korean_value
        return result

    return {}
