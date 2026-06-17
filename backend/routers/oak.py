import httpx
import concurrent.futures
from fastapi import APIRouter, Depends, HTTPException, Query
from auth import get_current_user
from models import User
from config import settings

router = APIRouter(prefix="/api/oak", tags=["oak"])

OAK_HEADERS = {
    "Authorization": f"Bearer {settings.OAK_API_KEY}",
    "Accept": "application/json",
}

YEAR_TO_KS = {
    "Year 1": "key stage 1", "Year 2": "key stage 1",
    "Year 3": "key stage 2", "Year 4": "key stage 2",
    "Year 5": "key stage 2", "Year 6": "key stage 2",
    "Year 7": "key stage 3", "Year 8": "key stage 3", "Year 9": "key stage 3",
    "Year 10": "key stage 4", "Year 11": "key stage 4",
}

# Topic keywords per subject — each triggers a separate parallel search
SUBJECT_KEYWORDS = {
    "maths": ["number", "algebra", "geometry", "ratio", "statistics", "fractions", "decimals", "probability", "angles", "sequences"],
    "english": ["reading", "writing", "poetry", "grammar", "fiction", "non-fiction", "shakespeare", "narrative", "vocabulary", "punctuation"],
    "science": ["biology", "chemistry", "physics", "cells", "forces", "energy", "atoms", "ecology", "electricity", "waves"],
    "history": ["medieval", "empire", "revolution", "monarchy", "war", "ancient", "migration", "power", "society", "crime"],
    "geography": ["rivers", "climate", "urbanisation", "development", "coasts", "ecosystems", "population", "resources", "weather", "globalisation"],
    "art and design": ["drawing", "painting", "sculpture", "printmaking", "textiles", "colour", "composition", "design", "portrait", "abstract"],
    "design and technology": ["engineering", "product", "food", "textiles", "resistant materials", "structures", "mechanisms", "electronics", "cooking", "materials"],
    "computing": ["programming", "algorithms", "data", "networks", "cybersecurity", "python", "html", "binary", "database", "software"],
    "religious education": ["christianity", "islam", "buddhism", "hinduism", "ethics", "beliefs", "worship", "sacred", "morality", "philosophy"],
    "physical education": ["fitness", "athletics", "team", "skills", "health", "swimming", "gymnastics", "dance", "tactics", "movement"],
    "music": ["rhythm", "melody", "harmony", "composition", "notation", "instruments", "performance", "listening", "blues", "classical"],
    "french": ["vocabulary", "grammar", "reading", "listening", "speaking", "writing", "verbs", "nouns", "phrases", "culture"],
    "spanish": ["vocabulary", "grammar", "reading", "listening", "speaking", "writing", "verbs", "nouns", "phrases", "culture"],
    "german": ["vocabulary", "grammar", "reading", "listening", "speaking", "writing", "verbs", "nouns", "phrases", "culture"],
}


def _fetch_one(query: str) -> list:
    url = f"{settings.OAK_BASE_URL}/search/lessons"
    try:
        with httpx.Client(timeout=10) as client:
            r = client.get(url, headers=OAK_HEADERS, params={"q": query})
            r.raise_for_status()
            return r.json().get("hits", {}).get("hits", [])
    except Exception:
        return []


def build_oak_url(src: dict) -> str:
    subject_slug = src.get("subject_slug", "")
    phase = src.get("phase", "primary")
    ks_slug = src.get("key_stage_slug", "")
    ks_abbrev = ks_slug.replace("key-stage-", "ks")
    programme_slug = f"{subject_slug}-{phase}-{ks_abbrev}"
    unit_slug = src.get("topic_slug", "")
    lesson_slug = src.get("slug", "")
    return f"https://www.thenational.academy/pupils/programmes/{programme_slug}/units/{unit_slug}/lessons/{lesson_slug}"


@router.get("/search")
def search_lessons(
    q: str = Query(default="", min_length=0),
    subject: str = Query(default=""),
    year: str = Query(default=""),
    _: User = Depends(get_current_user),
):
    ks = YEAR_TO_KS.get(year, "")
    subject_lower = subject.lower()
    keywords = SUBJECT_KEYWORDS.get(subject_lower, [""])

    # Build one query per keyword — run all in parallel
    queries = [
        f"{subject} {year} {ks} {kw} {q}".strip()
        for kw in keywords
    ]

    seen_slugs: dict = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(_fetch_one, qry) for qry in queries]
        for future in concurrent.futures.as_completed(futures):
            for hit in future.result():
                src = hit.get("_source", {})
                slug = src.get("slug")
                if slug and slug not in seen_slugs:
                    seen_slugs[slug] = src

    results = []
    for src in seen_slugs.values():
        if year and src.get("year_title", "") != year:
            continue
        if subject and src.get("subject_title", "").lower() != subject_lower:
            continue

        results.append({
            "slug": src.get("slug"),
            "title": src.get("title", ""),
            "subject": src.get("subject_title", ""),
            "keyStage": src.get("key_stage_title", ""),
            "yearTitle": src.get("year_title", ""),
            "unitTitle": src.get("topic_title", ""),
            "description": src.get("lesson_description", ""),
            "oakUrl": build_oak_url(src),
        })

    results.sort(key=lambda r: (r["unitTitle"], r["title"]))
    return results
