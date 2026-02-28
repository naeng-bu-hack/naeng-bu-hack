import re

import requests


def build_recipe_profile_from_url(
    url: str,
    ingredients_ko: list[str],
    timeout: float = 8.0,
) -> dict:
    source_title, source_excerpt = _fetch_recipe_source(url, timeout)

    # TODO: 실제 LLM API 호출로 교체
    # 예시 의도:
    # - 입력: url, ingredients_ko (함수 내부에서 source_title/source_excerpt 추출)
    # - 출력(JSON): title/description/difficulty/time/badge/servings/ingredients/steps
    title = source_title or "추천 레시피"
    if " " in title:
        words = [word for word in title.split(" ") if word]
        title = " ".join(words[:8]).strip()

    return {
        "title": title,
        "description": f"원문 레시피를 바탕으로 재료 {', '.join(ingredients_ko[:3])} 중심으로 구성한 버전",
        "difficulty": "보통",
        "time": "30분",
        "badge": "AI요약",
        "servings": 2,
        "ingredients": [{"item": item, "amount": "적당량"} for item in ingredients_ko[:8]],
        "steps": [
            {"step": 1, "description": "원문 레시피 핵심 흐름을 확인한다.", "tip": url},
            {"step": 2, "description": "재료를 손질하고 순서대로 조리한다."},
            {"step": 3, "description": "간을 조정하고 플레이팅한다."},
        ],
        "source_excerpt": source_excerpt[:400],
    }


def _fetch_recipe_source(url: str, timeout: float) -> tuple[str, str]:
    try:
        response = requests.get(url, timeout=timeout)
        response.raise_for_status()
    except requests.RequestException:
        return _title_from_url(url, default=""), ""

    content_type = response.headers.get("content-type", "")
    if "text/html" not in content_type:
        return _title_from_url(url, default=""), ""

    html = response.text
    title_match = re.search(r"<title[^>]*>(.*?)</title>", html, flags=re.IGNORECASE | re.DOTALL)
    title = _clean_html_text(title_match.group(1)) if title_match else _title_from_url(url, default="")

    paragraph_matches = re.findall(r"<p[^>]*>(.*?)</p>", html, flags=re.IGNORECASE | re.DOTALL)
    joined = " ".join(_clean_html_text(value) for value in paragraph_matches[:6])
    excerpt = re.sub(r"\s+", " ", joined).strip()
    return title, excerpt[:2000]


def _title_from_url(url: str, default: str) -> str:
    parts = url.strip("/").split("/")
    if not parts:
        return default
    slug = parts[-1].replace("-", " ").replace("_", " ").strip()
    return slug if slug else default


def _clean_html_text(value: str) -> str:
    no_tags = re.sub(r"<[^>]+>", " ", value)
    no_entities = (
        no_tags.replace("&nbsp;", " ")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">")
    )
    return re.sub(r"\s+", " ", no_entities).strip()
