from typing import Any


def fetch_recipe_candidates(ingredients: list[str], cuisine: str, max_minutes: int) -> list[dict[str, Any]]:
    # TODO: 실제 DB 조회로 교체
    _ = (ingredients, cuisine, max_minutes)
    return [
        {'recipe_id': 'r1', 'title': '김치볶음밥', 'reason': '재료 커버리지가 높습니다.'},
        {'recipe_id': 'r2', 'title': '계란말이', 'reason': '조리 시간이 짧습니다.'},
        {'recipe_id': 'r3', 'title': '된장찌개', 'reason': '한식 조건에 맞습니다.'},
    ]
