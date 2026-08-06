#!/usr/bin/env python3
"""Re-scrape catalog from texnohouse.com into data/catalog.json"""
import html
import json
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://www.texnohouse.com/wp-json"
OUT = Path(__file__).resolve().parents[1] / "data" / "catalog.json"


def get(url: str):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 DomoVoltImporter/1.0"})
    with urllib.request.urlopen(req, timeout=60) as r:
        headers = {k.lower(): v for k, v in r.headers.items()}
        return json.loads(r.read().decode("utf-8")), headers


def paginate(url: str, label: str, per_page: int = 50):
    items = []
    page = 1
    while True:
        data, headers = get(f"{url}{'&' if '?' in url else '?'}per_page={per_page}&page={page}")
        if not data:
            break
        items.extend(data)
        total_pages = int(headers.get("x-wp-totalpages", "1"))
        print(f"{label} {page}/{total_pages} (+{len(data)})")
        if page >= total_pages:
            break
        page += 1
        time.sleep(0.2)
    return items


def main():
    cats = paginate(f"{BASE}/wc/store/v1/products/categories", "categories", 100)
    pages = paginate(f"{BASE}/wp/v2/pages", "pages", 50)
    products = paginate(f"{BASE}/wc/store/v1/products", "products", 50)

    norm_cats = []
    for c in cats:
        img = None
        if c.get("image"):
            img = c["image"].get("src") or c["image"].get("thumbnail")
        norm_cats.append(
            {
                "id": c["id"],
                "name": c["name"],
                "slug": urllib.parse.unquote(c["slug"]),
                "description": c.get("description") or "",
                "parent": c.get("parent") or 0,
                "count": c.get("count") or 0,
                "image": img,
                "permalink": c.get("permalink"),
            }
        )

    norm_products = []
    for p in products:
        prices = p.get("prices") or {}
        norm_products.append(
            {
                "id": p["id"],
                "name": p["name"],
                "slug": urllib.parse.unquote(p.get("slug") or ""),
                "type": p.get("type"),
                "permalink": p.get("permalink"),
                "sku": p.get("sku") or "",
                "short_description": p.get("short_description") or "",
                "description": p.get("description") or "",
                "on_sale": p.get("on_sale", False),
                "prices": {
                    "price": prices.get("price"),
                    "regular_price": prices.get("regular_price"),
                    "sale_price": prices.get("sale_price"),
                    "currency_code": prices.get("currency_code") or "BGN",
                    "currency_symbol": prices.get("currency_symbol") or "лв.",
                    "currency_minor_unit": prices.get("currency_minor_unit", 2),
                },
                "average_rating": p.get("average_rating"),
                "review_count": p.get("review_count"),
                "is_in_stock": p.get("is_in_stock", True),
                "is_purchasable": p.get("is_purchasable", True),
                "images": p.get("images") or [],
                "categories": [
                    {
                        "id": c.get("id"),
                        "name": c.get("name"),
                        "slug": urllib.parse.unquote(c.get("slug") or ""),
                    }
                    for c in (p.get("categories") or [])
                ],
                "tags": p.get("tags") or [],
                "attributes": p.get("attributes") or [],
            }
        )

    norm_pages = []
    for pg in pages:
        title = (pg.get("title") or {}).get("rendered") or ""
        norm_pages.append(
            {
                "id": pg["id"],
                "slug": pg.get("slug") or "",
                "title": html.unescape(re.sub(r"<[^>]+>", "", title)),
                "content": (pg.get("content") or {}).get("rendered") or "",
                "excerpt": (pg.get("excerpt") or {}).get("rendered") or "",
                "link": pg.get("link"),
                "menu_order": pg.get("menu_order") or 0,
                "parent": pg.get("parent") or 0,
                "status": pg.get("status"),
                "date": pg.get("date"),
                "modified": pg.get("modified"),
            }
        )

    out = {
        "source": "https://www.texnohouse.com/",
        "brand_new": "DomoVolt",
        "tagline": "Всичко за дома и кухнята",
        "scraped_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "counts": {
            "products": len(norm_products),
            "categories": len(norm_cats),
            "pages": len(norm_pages),
        },
        "categories": norm_cats,
        "products": norm_products,
        "pages": norm_pages,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Wrote", OUT, out["counts"])


if __name__ == "__main__":
    main()
