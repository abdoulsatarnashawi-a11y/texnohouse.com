import { getDb, getSetting } from "./db";
import type {
  CategoryRow,
  FooterConfig,
  HeaderConfig,
  PageRow,
  ProductImage,
  ProductRow,
  SiteSettings,
} from "./types";

export const defaultSettings: SiteSettings = {
  brandName: "DomoVolt",
  tagline: "Всичко за дома и кухнята",
  phone: "+359 883 349 895",
  email: "office@domovolt.bg",
  address: 'гр. София, жк. "Лев Толстой" бл.40 вх. A ет.3 ап.9',
  company: '"АДИ ЕЛЕКТРОНИКС" ЕООД',
  eik: "206467532",
  currency: "BGN",
  currencySymbol: "лв.",
  freeShippingFrom: 100,
  announcement: "Безплатна доставка над 100 лв. · Бърза обработка на поръчки",
  logoText: "DomoVolt",
};

export const defaultHeader: HeaderConfig = {
  showSearch: true,
  showCart: true,
  showAccount: false,
  topBarLinks: [
    { id: "how", label: "Как да поръчам", href: "/p/kak-da-poracham-onlayn" },
    { id: "terms", label: "Условия", href: "/p/usloviya-za-polzvane" },
    { id: "privacy", label: "Защита на данните", href: "/p/zashtita-na-dannite" },
  ],
  mainMenu: [
    { id: "home", label: "Начало", href: "/" },
    { id: "shop", label: "Магазин", href: "/shop" },
    {
      id: "appliances",
      label: "Електроуреди",
      href: "/category/електроуреди",
    },
    {
      id: "kitchen",
      label: "Кухненски съдове",
      href: "/category/кухненски-съдове-и-аксесоари",
    },
    { id: "about", label: "За нас", href: "/p/about-us" },
    { id: "contact", label: "Контакт", href: "/p/contact-us" },
  ],
};

export const defaultFooter: FooterConfig = {
  showNewsletter: false,
  bottomText: "© DomoVolt. Всички права запазени.",
  social: [],
  columns: [
    {
      id: "shop",
      title: "Магазин",
      links: [
        { id: "all", label: "Всички продукти", href: "/shop" },
        { id: "sale", label: "Намаления", href: "/shop?sale=1" },
        { id: "new", label: "Нови", href: "/shop?sort=newest" },
      ],
    },
    {
      id: "help",
      title: "Помощ",
      links: [
        { id: "how", label: "Как да поръчам", href: "/p/kak-da-poracham-onlayn" },
        { id: "terms", label: "Условия за ползване", href: "/p/usloviya-za-polzvane" },
        { id: "privacy", label: "Защита на данните", href: "/p/zashtita-na-dannite" },
      ],
    },
    {
      id: "company",
      title: "Компания",
      links: [
        { id: "about", label: "За нас", href: "/p/about-us" },
        { id: "contact", label: "Контакт", href: "/p/contact-us" },
      ],
    },
  ],
};

export function getSiteSettings() {
  return getSetting<SiteSettings>("site", defaultSettings);
}

export function getHeaderConfig() {
  return getSetting<HeaderConfig>("header", defaultHeader);
}

export function getFooterConfig() {
  return getSetting<FooterConfig>("footer", defaultFooter);
}

export function parseImages(json: string): ProductImage[] {
  try {
    return JSON.parse(json) as ProductImage[];
  } catch {
    return [];
  }
}

export function parseJsonArray<T>(json: string): T[] {
  try {
    return JSON.parse(json) as T[];
  } catch {
    return [];
  }
}

export function getProductBySlug(slug: string) {
  return getDb()
    .prepare("SELECT * FROM products WHERE slug = ? AND status = 'publish'")
    .get(slug) as ProductRow | undefined;
}

export function getProductById(id: number) {
  return getDb().prepare("SELECT * FROM products WHERE id = ?").get(id) as
    | ProductRow
    | undefined;
}

export function listProducts(opts: {
  q?: string;
  categorySlug?: string;
  sale?: boolean;
  sort?: string;
  page?: number;
  perPage?: number;
  featured?: boolean;
}) {
  const page = Math.max(1, opts.page || 1);
  const perPage = Math.min(48, Math.max(1, opts.perPage || 24));
  const where: string[] = ["p.status = 'publish'"];
  const params: unknown[] = [];

  if (opts.q) {
    where.push("(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)");
    const like = `%${opts.q}%`;
    params.push(like, like, like);
  }
  if (opts.sale) where.push("p.on_sale = 1");
  if (opts.featured) where.push("p.featured = 1");

  let join = "";
  if (opts.categorySlug) {
    join = `
      JOIN product_categories pc ON pc.product_id = p.id
      JOIN categories c ON c.id = pc.category_id
    `;
    where.push("(c.slug = ? OR c.id IN (SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = ? LIMIT 1)))");
    params.push(opts.categorySlug, opts.categorySlug);
  }

  let order = "p.id DESC";
  switch (opts.sort) {
    case "price_asc":
      order = "p.price ASC";
      break;
    case "price_desc":
      order = "p.price DESC";
      break;
    case "name":
      order = "p.name ASC";
      break;
    case "popular":
      order = "p.review_count DESC, p.average_rating DESC";
      break;
    case "newest":
    default:
      order = "p.id DESC";
  }

  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const countRow = getDb()
    .prepare(`SELECT COUNT(DISTINCT p.id) as c FROM products p ${join} ${whereSql}`)
    .get(...params) as { c: number };
  const total = countRow?.c || 0;
  const offset = (page - 1) * perPage;
  const items = getDb()
    .prepare(
      `SELECT DISTINCT p.* FROM products p ${join} ${whereSql} ORDER BY ${order} LIMIT ? OFFSET ?`
    )
    .all(...params, perPage, offset) as ProductRow[];

  return { items, total, page, perPage, totalPages: Math.max(1, Math.ceil(total / perPage)) };
}

export function getTopCategories(limit = 8) {
  return getDb()
    .prepare(
      `SELECT * FROM categories WHERE parent_id = 0 AND count > 0 ORDER BY count DESC LIMIT ?`
    )
    .all(limit) as CategoryRow[];
}

export function getCategoryBySlug(slug: string) {
  return getDb().prepare("SELECT * FROM categories WHERE slug = ?").get(slug) as
    | CategoryRow
    | undefined;
}

export function getAllCategories() {
  return getDb()
    .prepare("SELECT * FROM categories ORDER BY parent_id ASC, sort_order ASC, name ASC")
    .all() as CategoryRow[];
}

export function getPageBySlug(slug: string) {
  return getDb()
    .prepare("SELECT * FROM pages WHERE slug = ? AND status = 'publish'")
    .get(slug) as PageRow | undefined;
}

export function getAllPages() {
  return getDb().prepare("SELECT * FROM pages ORDER BY menu_order ASC, title ASC").all() as PageRow[];
}

export function slugifyBg(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-");
}
