"""
Converts the Takshaka wellness catalogue workbook into the import format.

    python scripts/xlsx-to-products.py refference/Wellness_Catalog_Takshaka_2026_Database.xlsx data/products.json

The sheet carries no category column, so categories are derived from the
catalogue's own ordering — the source document is grouped by theme. Review them
in the admin; changing one is a single dropdown.

Text is copied verbatim. The workbook's own guidance note says the wording was
preserved from the printed catalogue, so nothing is rewritten here either.
"""

import json
import re
import sys
import unicodedata

import openpyxl

# Ranges follow the thematic runs in the source catalogue.
CATEGORIES = [
    (1, 3, "Rituals & Ceremony"),
    (4, 16, "Healing & Sound"),
    (17, 25, "Yoga & Movement"),
    (26, 36, "Spa & Retreats"),
    (37, 52, "Nature & Nourishment"),
    (53, 73, "Art & Culture"),
]

AUDIENCE = {
    "solo": "solo",
    "couple": "couple",
    "couples": "couple",
    "group": "group",
    "small group": "group",
    "large group": "group",
    "corporate": "corporate",
    "community": "community",
}


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = "".join(c for c in value if not unicodedata.combining(c))
    value = re.sub(r"[^A-Za-z0-9]+", "-", value).strip("-").lower()
    return re.sub(r"-{2,}", "-", value)


def lines(value):
    if not value:
        return []
    return [part.strip() for part in str(value).splitlines() if part.strip()]


# The venue column was lifted from a PDF, so long names are broken across
# lines and a bare place name is the location of the venue above it. Splitting
# on the newline alone invents venues like "Arma Museum &" and "Eve".
CONTINUES = re.compile(r"(?:&|,|\b(?:at|of|by|and|during|the|near|in)\s*)$", re.IGNORECASE)

# A bare place name is a location: joined with a comma.
PLACES = {
    "ubud", "sanur", "canggu", "seminyak", "kuta", "denpasar", "gianyar",
    "klungkung", "karangasem", "buleleng", "bali", "north bali", "lovina",
    "nusa dua", "uluwatu", "kintamani", "tabanan", "munduk", "sidemen",
    "jimbaran", "amed", "candidasa", "bedugul", "payangan", "tegallalang",
}

# A bare venue-type noun is the tail of the name above it: joined with a space.
SUFFIXES = {
    "resort", "resorts", "wellness", "waterfall", "workshop", "studio",
    "retreat", "temple", "spa", "centre", "center", "village", "eve", "house",
    "garden", "farm", "museum", "beach",
}


def venues(value):
    """Rebuilds venue names from PDF-wrapped lines."""
    parts = lines(value)
    out = []

    for part in parts:
        if out and CONTINUES.search(out[-1]):
            # Previous line ended mid-phrase.
            out[-1] = f"{out[-1].rstrip(',').rstrip()} {part}".strip()
            continue
        if out and part.lower() in SUFFIXES:
            out[-1] = f"{out[-1]} {part}"
            continue
        if out and part.lower() in PLACES:
            # A bare place name belongs to the venue above it.
            joiner = " " if out[-1].endswith("&") else ", "
            out[-1] = f"{out[-1]}{joiner}{part}"
            continue
        out.append(part)

    return [re.sub(r"\s{2,}", " ", v).strip(" ,") for v in out if v.strip(" ,")]


def category_for(code: str) -> str:
    match = re.search(r"(\d+)", code or "")
    number = int(match.group(1)) if match else 0
    for low, high, name in CATEGORIES:
        if low <= number <= high:
            return name
    return CATEGORIES[-1][2]


def audiences(value):
    found = []
    for part in re.split(r"[,/]", str(value or "")):
        key = part.strip().lower()
        mapped = AUDIENCE.get(key)
        if mapped and mapped not in found:
            found.append(mapped)
    return found


def main():
    source = sys.argv[1]
    target = sys.argv[2]

    workbook = openpyxl.load_workbook(source, data_only=True)
    sheet = workbook["Database Produk"]

    rows = []
    seen_slugs = set()
    problems = []

    for excel_row, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
        code, title, subtitle, description, benefit, venue, duration, facilities, suitable, _page = (
            list(row) + [None] * 10
        )[:10]

        if not title:
            continue

        title = str(title).strip()
        slug = slugify(title)
        if slug in seen_slugs:
            slug = f"{slug}-{slugify(str(code))}"
            problems.append(f"row {excel_row}: duplicate title '{title}', slug made unique")
        seen_slugs.add(slug)

        if not description:
            problems.append(f"row {excel_row}: '{title}' has no description")

        rows.append(
            {
                "slug": slug,
                "code": str(code).strip() if code else None,
                "category": category_for(str(code or "")),
                "venues": venues(venue),
                "suitableFor": audiences(suitable),
                "featured": False,
                "order": len(rows),
                "en": {
                    "title": title,
                    "subtitle": str(subtitle).strip() if subtitle else None,
                    "description": str(description).strip() if description else None,
                    "highlightText": str(benefit).strip() if benefit else None,
                    "durationText": str(duration).strip() if duration else None,
                    "facilities": lines(facilities),
                },
            }
        )

    with open(target, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2, ensure_ascii=False)
        handle.write("\n")

    all_venues = sorted({v for row in rows for v in row["venues"]})
    print(f"wrote {len(rows)} products to {target}")
    print(f"distinct venues: {len(all_venues)}")
    for low, high, name in CATEGORIES:
        count = sum(1 for r in rows if r["category"] == name)
        print(f"  {name:<24} {count}")
    if problems:
        print("\nnotes:")
        for p in problems:
            print("  -", p)


if __name__ == "__main__":
    main()
