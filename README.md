# TexnoHouse

متجر إلكتروني حديث وديناميكي مبني على محتوى [TexnoHouse](https://www.texnohouse.com/) مع اسم العلامة الجديد **TexnoHouse**.

## المميزات

- واجهة المتجر بالكامل باللغة **البلغارية** والعملة **اليورو (€) فقط**
- **415 منتجًا** و **101 تصنيفًا** مستوردة من الموقع الأصلي (الأسعار محوّلة من BGN إلى EUR)
- صفحات CMS: من نحن، اتصل بنا، شروط الاستخدام، حماية البيانات، كيفية الطلب
- لوحة إدارة `/admin`:
  - تعديل/إضافة/حذف روابط **الهيدر**
  - تعديل/إضافة/حذف أعمدة وروابط **الفوتر**
  - إدارة المنتجات والصفحات والطلبات والإعدادات
- سلة محلية + حفظ الطلبات في SQLite

## التشغيل محليًا

```bash
npm install
npm run seed    # يبني data/texnohouse.db من data/catalog.json
npm run dev     # http://localhost:3000
```

### بيانات الدخول للإدارة

- العنوان: `/admin/login`
- المستخدم: `admin`
- كلمة المرور: `TexnoHouse2026!`

غيّرها عبر متغيرات البيئة `ADMIN_USER` / `ADMIN_PASSWORD` / `ADMIN_SECRET` قبل إعادة `npm run seed`.

## إعادة السحب من الموقع الأصلي

```bash
npm run scrape   # يحدّث data/catalog.json
npm run seed     # يعيد بناء قاعدة البيانات
```

## النشر على الدومين الأصلي (texnohouse.com)

الموقع مبني بـ **Next.js** ويحتاج استضافة تدعم Node.js (VPS، Railway، Render، Vercel، أو Node على cPanel إن توفر).

1. ارفع المشروع على السيرفر وشغّل:
   ```bash
   npm install
   npm run seed
   npm run build
   npm start
   ```
2. اضبط `ADMIN_SECRET` وبيانات الأدمن في `.env`.
3. وجّه الدومين `www.texnohouse.com` إلى السيرفر الجديد (A/CNAME أو reverse proxy).
4. بعد التأكد، يمكنك في الإعدادات إعادة اسم العلامة إلى TexnoHouse إن رغبت — المحتوى جاهز للتبديل من لوحة الإدارة.
5. اختياري لاحقًا: انقل صور المنتجات من `texnohouse.com/wp-content/uploads` إلى استضافتك وحدّث الروابط.

> حاليًا الصور تُحمَّل من روابط الموقع الأصلي حتى يتم النقل الكامل للملفات.

## البنية

- `src/app/(store)` — واجهة المتجر
- `src/app/admin` — لوحة التحكم
- `data/catalog.json` — نسخة مسحوبة من الأصل
- `data/texnohouse.db` — قاعدة SQLite التشغيلية
- `scripts/seed.ts` / `scripts/scrape_texnohouse.py`
