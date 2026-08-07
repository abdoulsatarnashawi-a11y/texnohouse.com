export type MenuItem = {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
};

export type SiteSettings = {
  brandName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  company: string;
  eik: string;
  currency: string;
  currencySymbol: string;
  freeShippingFrom: number;
  announcement: string;
  logoText: string;
  heroImage: string;
};

export type HeaderConfig = {
  topBarLinks: MenuItem[];
  mainMenu: MenuItem[];
  showSearch: boolean;
  showCart: boolean;
  showAccount: boolean;
};

export type FooterConfig = {
  columns: { id: string; title: string; links: MenuItem[] }[];
  bottomText: string;
  social: MenuItem[];
  showNewsletter: boolean;
};

export type ProductRow = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  price: number;
  regular_price: number;
  sale_price: number | null;
  on_sale: number;
  currency: string;
  is_in_stock: number;
  average_rating: number;
  review_count: number;
  images_json: string;
  categories_json: string;
  tags_json: string;
  attributes_json: string;
  featured: number;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number;
  image: string | null;
  count: number;
  sort_order: number;
};

export type PageRow = {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  status: string;
  menu_order: number;
  updated_at: string;
};

export type ProductImage = {
  id?: number;
  src: string;
  thumbnail?: string;
  name?: string;
  alt?: string;
};

export type ProductCategoryRef = {
  id: number;
  name: string;
  slug: string;
};
