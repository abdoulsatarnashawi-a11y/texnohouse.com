/**
 * Seed TexnoHouse SQLite DB from scraped TexnoHouse catalog.
 * Run: npx tsx scripts/seed.ts
 */
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";

const root = process.cwd();
const catalogPath = path.join(root, "data", "catalog.json");
const pagesPath = path.join(root, "data", "pages_clean.json");
const dbPath =
  process.env.DATABASE_PATH || path.join(root, "data", "texnohouse.db");

type CatalogProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_code: string;
    currency_minor_unit: number;
  };
  average_rating: string | number;
  review_count: number;
  is_in_stock: boolean;
  images: unknown[];
  categories: { id: number; name: string; slug: string }[];
  tags: unknown[];
  attributes: unknown[];
};

function toPrice(raw: string | number | null | undefined, minor = 2): number {
  if (raw === null || raw === undefined || raw === "") return 0;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (Number.isNaN(n)) return 0;
  return Number((n / Math.pow(10, minor)).toFixed(2));
}

/** Official fixed rate: 1 EUR = 1.95583 BGN */
const BGN_PER_EUR = 1.95583;

function toEur(bgn: number): number {
  return Number((bgn / BGN_PER_EUR).toFixed(2));
}

function translitSlug(slug: string): string {
  // Keep Cyrillic slugs as-is (URL-encoded by Next). Also fix WP percent-encoding leftovers.
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function replaceBrand(html: string): string {
  return html
    .replace(/texnohouse\.com/gi, "texnohouse.com")
    .replace(/Texno House/gi, "TexnoHouse")
    .replace(/TexnoHouse/gi, "TexnoHouse")
    .replace(/texnohouse/gi, "texnohouse");
}

if (!fs.existsSync(catalogPath)) {
  console.error("Missing data/catalog.json — scrape first");
  process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const pagesClean = fs.existsSync(pagesPath)
  ? JSON.parse(fs.readFileSync(pagesPath, "utf8"))
  : [];

fs.mkdirSync(path.dirname(dbPath), { recursive: true });
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT DEFAULT '',
    parent_id INTEGER DEFAULT 0,
    image TEXT,
    count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0
  );
  CREATE TABLE products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT DEFAULT '',
    short_description TEXT DEFAULT '',
    description TEXT DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    regular_price REAL NOT NULL DEFAULT 0,
    sale_price REAL,
    on_sale INTEGER DEFAULT 0,
    currency TEXT DEFAULT 'EUR',
    is_in_stock INTEGER DEFAULT 1,
    average_rating REAL DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    images_json TEXT DEFAULT '[]',
    categories_json TEXT DEFAULT '[]',
    tags_json TEXT DEFAULT '[]',
    attributes_json TEXT DEFAULT '[]',
    featured INTEGER DEFAULT 0,
    status TEXT DEFAULT 'publish',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE product_categories (
    product_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (product_id, category_id)
  );
  CREATE TABLE pages (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    content TEXT DEFAULT '',
    excerpt TEXT DEFAULT '',
    status TEXT DEFAULT 'publish',
    menu_order INTEGER DEFAULT 0,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    items_json TEXT NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

const setSetting = db.prepare(
  "INSERT INTO settings (key, value) VALUES (?, ?)"
);

const site = {
  brandName: "TexnoHouse",
  tagline: "Всичко за дома и кухнята",
  phone: "+359 883 349 895",
  email: "office@texnohouse.com",
  address: 'гр. София, жк. "Лев Толстой" бл.40 вх. A ет.3 ап.9',
  company: '"АДИ ЕЛЕКТРОНИКС" ЕООД',
  eik: "206467532",
  currency: "EUR",
  currencySymbol: "€",
  freeShippingFrom: 50,
  announcement: "Безплатна доставка над 50 € · Бърза обработка на поръчки",
  logoText: "TexnoHouse",
  heroImage: "/texnohouse-hero.png",
};

const header = {
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
    { id: "appliances", label: "Електроуреди", href: "/category/електроуреди" },
    {
      id: "kitchen",
      label: "Кухненски съдове",
      href: "/category/кухненски-съдове-и-аксесоари",
    },
    { id: "beauty", label: "Лична грижа", href: "/category/лична-грижа-и-красота" },
    { id: "about", label: "За нас", href: "/p/about-us" },
    { id: "contact", label: "Контакт", href: "/p/contact-us" },
  ],
};

const footer = {
  showNewsletter: false,
  bottomText: "© TexnoHouse. Всички права запазени.",
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

setSetting.run("site", JSON.stringify(site));
setSetting.run("header", JSON.stringify(header));
setSetting.run("footer", JSON.stringify(footer));

const insertCat = db.prepare(`
  INSERT INTO categories (id, name, slug, description, parent_id, image, count, sort_order)
  VALUES (@id, @name, @slug, @description, @parent_id, @image, @count, @sort_order)
`);

const insertProduct = db.prepare(`
  INSERT INTO products (
    id, name, slug, sku, short_description, description,
    price, regular_price, sale_price, on_sale, currency,
    is_in_stock, average_rating, review_count,
    images_json, categories_json, tags_json, attributes_json,
    featured, status
  ) VALUES (
    @id, @name, @slug, @sku, @short_description, @description,
    @price, @regular_price, @sale_price, @on_sale, @currency,
    @is_in_stock, @average_rating, @review_count,
    @images_json, @categories_json, @tags_json, @attributes_json,
    @featured, 'publish'
  )
`);

const insertPC = db.prepare(
  `INSERT OR IGNORE INTO product_categories (product_id, category_id) VALUES (?, ?)`
);

const insertPage = db.prepare(`
  INSERT INTO pages (id, slug, title, content, excerpt, status, menu_order)
  VALUES (@id, @slug, @title, @content, @excerpt, 'publish', @menu_order)
`);

const slugMap: Record<string, string> = {
  "как-да-поръчам-онлайн": "kak-da-poracham-onlayn",
  "условия-за-ползване": "usloviya-za-polzvane",
  "защита-на-данните": "zashtita-na-dannite",
  "каталог": "katalog",
  "home-page": "home-page",
  "about-us": "about-us",
  "contact-us": "contact-us",
};

const categoryImages = new Map<number, string>();

const tx = db.transaction(() => {
  for (const [i, c] of catalog.categories.entries()) {
    insertCat.run({
      id: c.id,
      name: c.name,
      slug: translitSlug(c.slug),
      description: c.description || "",
      parent_id: c.parent || 0,
      image: c.image || null,
      count: c.count || 0,
      sort_order: i,
    });
  }

  const usedSlugs = new Set<string>();
  for (const [i, p] of (catalog.products as CatalogProduct[]).entries()) {
    let slug = translitSlug(p.slug);
    if (usedSlugs.has(slug)) slug = `${slug}-${p.id}`;
    usedSlugs.add(slug);
    const minor = p.prices?.currency_minor_unit ?? 2;
    const price = toEur(toPrice(p.prices?.price, minor));
    const regular = toEur(toPrice(p.prices?.regular_price, minor));
    const sale = p.on_sale
      ? toEur(toPrice(p.prices?.sale_price || p.prices?.price, minor))
      : null;
    const cats = (p.categories || []).map((c) => ({
      ...c,
      slug: translitSlug(c.slug),
    }));
    const productImage = p.images?.[0] as { src?: string } | undefined;
    if (productImage?.src) {
      for (const category of cats) {
        if (!categoryImages.has(category.id)) {
          categoryImages.set(category.id, productImage.src);
        }
      }
    }

    insertProduct.run({
      id: p.id,
      name: p.name,
      slug,
      sku: p.sku || "",
      short_description: replaceBrand(p.short_description || ""),
      description: replaceBrand(p.description || ""),
      price,
      regular_price: regular || price,
      sale_price: sale,
      on_sale: p.on_sale ? 1 : 0,
      currency: "EUR",
      is_in_stock: p.is_in_stock ? 1 : 0,
      average_rating: Number(p.average_rating) || 0,
      review_count: p.review_count || 0,
      images_json: JSON.stringify(p.images || []),
      categories_json: JSON.stringify(cats),
      tags_json: JSON.stringify(p.tags || []),
      attributes_json: JSON.stringify(p.attributes || []),
      featured: i < 12 ? 1 : 0,
    });

    for (const c of cats) {
      if (c.id) insertPC.run(p.id, c.id);
    }
  }

  // Product categories do not include thumbnails in the public API. Use the
  // first real product image in each category, including parents, as a useful
  // default that can later be changed in the admin panel.
  const parentById = new Map<number, number>(
    catalog.categories.map((category: { id: number; parent?: number }) => [
      category.id,
      category.parent || 0,
    ])
  );
  for (const [categoryId, image] of [...categoryImages]) {
    let parentId = parentById.get(categoryId) || 0;
    while (parentId) {
      if (!categoryImages.has(parentId)) categoryImages.set(parentId, image);
      parentId = parentById.get(parentId) || 0;
    }
  }
  const updateCategoryImage = db.prepare(
    "UPDATE categories SET image = ? WHERE id = ? AND (image IS NULL OR image = '')"
  );
  for (const category of catalog.categories) {
    const image = categoryImages.get(category.id);
    if (image) updateCategoryImage.run(image, category.id);
  }

  // CMS pages
  for (const pg of pagesClean) {
    const rawSlug = translitSlug(pg.slug);
    const slug = slugMap[rawSlug] || rawSlug;
    let content = replaceBrand(pg.content || "");
    let title = replaceBrand(pg.title || "");
    if (slug === "about-us") {
      content = `<p><strong>TexnoHouse</strong> е онлайн магазин за електроуреди и кухненски аксесоари. Ние ценим мнението на клиентите и предлагаме продукти с високо качество на оптимални цени. Благодарение на натрупания опит и квалифицирани кадри сме дълги години на пазара.</p>
<p>Фирма – „АДИ ЕЛЕКТРОНИКС“ ЕООД<br/>ЕИК: 206467532<br/>Адрес: гр. София, жк. „Лев Толстой“ бл.40 вх. A ет.3 ап.9<br/>Телефон: 0883349895<br/>Email: office@texnohouse.com</p>`;
    }
    if (slug === "contact-us") {
      content = `<p>Свържете се с нас – ще се радваме да ви помогнем.</p>
<p><strong>Телефон:</strong> <a href="tel:+359883349895">+359 883 349 895</a><br/>
<strong>Email:</strong> <a href="mailto:office@texnohouse.com">office@texnohouse.com</a><br/>
<strong>Адрес:</strong> гр. София, жк. „Лев Толстой“ бл.40 вх. A ет.3 ап.9</p>`;
    }
    if (slug === "katalog" || slug === "home-page") {
      // skip huge catalog dump / homepage widgets — storefront handles these
      continue;
    }
    insertPage.run({
      id: pg.id,
      slug,
      title,
      content,
      excerpt: "",
      menu_order: pg.menu_order || 0,
    });
  }

  // Ensure how-to-order page exists with clean content if missing
  const how = db.prepare("SELECT id FROM pages WHERE slug = ?").get("kak-da-poracham-onlayn");
  if (!how) {
    insertPage.run({
      id: 9001,
      slug: "kak-da-poracham-onlayn",
      title: "Как да поръчам онлайн",
      content: `<ol>
<li><strong>Избери продуктите</strong> — прегледай категориите или използвай търсачката. Добави продуктите с бутона „Добави в количката“.</li>
<li><strong>Количка</strong> — прегледай количествата, актуализирай или премахни продукти.</li>
<li><strong>Поръчка</strong> — попълни данните за доставка и изпрати поръчката. Ще се свържем с теб за потвърждение.</li>
</ol>`,
      excerpt: "",
      menu_order: 10,
    });
  }

  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "TexnoHouse2026!", 10);
  db.prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)").run(
    process.env.ADMIN_USER || "admin",
    hash
  );
});

tx();

const counts = {
  products: (db.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number }).c,
  categories: (db.prepare("SELECT COUNT(*) as c FROM categories").get() as { c: number }).c,
  pages: (db.prepare("SELECT COUNT(*) as c FROM pages").get() as { c: number }).c,
};
console.log("Seeded TexnoHouse DB:", counts);
console.log("Admin: admin / TexnoHouse2026!");
db.close();
