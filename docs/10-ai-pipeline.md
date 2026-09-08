# خط لوله تولید محتوا و دیتابیس مشترک با سرویس AI

این سند سه چیز را توضیح می‌دهد: دیتابیس چطور بین دو تیم یکی شد، پنل تولید محتوا
چه می‌کند، و همکار AI برای وصل‌شدن دقیقاً چه چیزی را باید عوض کند.

---

## ۱. یک دیتابیس، دو مالک

تا امروز دو دیتابیس جدا بود: `ketapod` (بک‌اند Go، مهاجرت با goose) و `ketapod-ai`
(سرویس Python، مهاجرت با alembic). نتیجه این بود که هیچ‌کدام وضعیت دیگری را
نمی‌دید و هر اتصال بین دو سمت یک API تازه می‌خواست.

حالا هر دو روی **دیتابیس `ketapod`** هستند:

| schema | مالک | محتوا |
|---|---|---|
| `catalog`, `identity`, `media`, `commerce`, `library`, `kids`, `home`, `jobs` | goose (بک‌اند Go) | مدل دامنه محصول |
| `ingest` | goose (بک‌اند Go) | ثبت‌های پنل تولید محتوا |
| `public` | **alembic (سرویس AI)** | `books`, `book_documents`, `book_chapters`, `book_sections`, `book_chunks`, `jobs`, `job_steps`, `knowledge_versions`, `audio_assets`, `document_artifacts` |

جدول‌های `public` عیناً از dump سرویس AI (revision `c0936393668e`) ساخته شده‌اند —
همان نام، همان نوع، همان enum، همان ایندکس و FK. با `information_schema` ستون‌به‌ستون
مقایسه شد و تفاوتی نداشت. ردیف `alembic_version` هم با همان revision پر شده تا
اولین `alembic upgrade head` روی دیتابیس مشترک no-op باشد نه خطای duplicate.

### قاعده مالکیت — این را نشکنید

- goose به `public` **دست نمی‌زند**. مهاجرت `00014_ai_shared.sql` فقط نقطه شروع
  مشترک را می‌سازد؛ از این به بعد هر تغییر در جدول‌های AI باید از مهاجرت alembic
  سمت همکار بیاید.
- alembic به schemaهای ما دست نمی‌زند.
- `ingest.submissions.ai_book_id` عمداً FK ندارد: FK از schema ما به جدولی که
  ابزار دیگری drop/recreate می‌کند یعنی مهاجرت آن تیم روی دیتابیس مشترک شکست
  می‌خورد. ایندکس یکتا همان تضمین عملی را بدون این گره می‌دهد.
- جدول `goose_db_version` هم در `public` است (پیش‌فرض goose). یعنی یک
  `DROP SCHEMA public CASCADE` تاریخچه مهاجرت ما را هم می‌برد. روی دیتابیس مشترک
  چنین کاری نکنید.

---

## ۲. آنچه همکار AI باید عوض کند

**یک متغیر.** مدل‌های SQLAlchemy schema نمی‌دهند و روی `public` می‌نشینند، که
دقیقاً همان جایی است که جدول‌ها ساخته شده‌اند:

```bash
DATABASE_URL=postgresql://ketapod:ketapod@<host>:5432/ketapod
```

و object storage همان bucket قبلی (`ketapod-media`) با همان الگوی کلید:
`books/{bookId}/original/{fileName}`. بک‌اند Go فایل را دقیقاً همان‌جا می‌گذارد.

### قراردادی که بک‌اند Go صدا می‌زند

بعد از هر آپلود، بک‌اند این درخواست را می‌فرستد (با retry از طریق outbox):

```
POST {AI_SERVICE_BASE_URL}{AI_SERVICE_PROCESS_PATH}
Authorization: Bearer {AI_SERVICE_API_KEY}   # فقط اگر ست شده باشد
Content-Type: application/json
```

`AI_SERVICE_PROCESS_PATH` پیش‌فرض `/api/v1/books/{bookId}/process` است و `{bookId}`
با شناسه ردیف `public.books` جایگزین می‌شود.

```json
{
  "bookId": "uuid — همان public.books.id",
  "documentId": "uuid — همان public.book_documents.id",
  "storageKey": "books/<bookId>/original/<fileName>",
  "fileName": "kelidar.pdf",
  "mimeType": "application/pdf",
  "title": "کلیدر",
  "author": "محمود دولت‌آبادی",
  "language": "fa",
  "enableTts": true,
  "enableAssistant": true
}
```

قواعد:

- ردیف‌های `public.books` و `public.book_documents` **قبلاً نوشته شده‌اند**. این
  درخواست فقط می‌گوید «شروع کن»، نه «بساز».
- تحویل **at-least-once** است. اگر کار همین کتاب قبلاً شروع شده، `409` برگردانید؛
  بک‌اند آن را «قبلاً گرفتی» می‌فهمد نه شکست.
- هر ۲xx یعنی پذیرفته شد. بدنه پاسخ استفاده نمی‌شود.
- خطای ۴xx/۵xx با متن بدنه (۴۰۰ کاراکتر اول) در پنل نشان داده می‌شود، پس هرچه در
  `detail` بنویسید همان چیزی است که اپراتور می‌بیند.
- اگر مسیر یا شکل بدنه سمت شما فرق دارد، بگویید تا `AI_SERVICE_PROCESS_PATH` عوض
  شود؛ برای تغییر مسیر نیازی به تغییر کد نیست.

### چیزی که از شما خوانده می‌شود

پنل وضعیت را از `public.jobs` و `public.job_steps` می‌خواند — همان‌هایی که خود شما
می‌نویسید. هیچ کپی‌ای از آن نگه نمی‌داریم. یعنی هر `job_steps.step` که بنویسید در
پنل دیده می‌شود؛ نام گام‌ها ترجمه نشده‌اند مگر آن‌هایی که در
`web/src/lib/admin.ts` نگاشت فارسی دارند، و گام ناشناخته با نام خودش نمایش داده
می‌شود.

---

## ۳. پنل تولید محتوا

`/admin/books` در اپ Next. یک صفحه: فرم آپلود + فهرست ثبت‌ها با وضعیت زنده.

ورودی‌ها: عنوان، نویسنده، توضیح، فایل PDF، تصویر کاور، و دو چک‌باکس —
«تولید نسخه صوتی (TTS)» و «افزودن به چت‌بات کتاب‌یار».

با زدن ثبت:

1. PDF و کاور به object storage می‌روند (قبل از تراکنش — یک آبجکت یتیم ارزان است،
   یک ردیف commit‌شده که به فایل نبوده اشاره کند گران).
2. در **یک تراکنش**: `public.books` + `public.book_documents` (کار سرویس AI)،
   `catalog.books` + `catalog.rights_grants` (کتاب در سایت)، `ingest.submissions`
   (حلقه وصل)، و یک job در `jobs.outbox` (تحویل به سرویس AI).
3. worker آن job را برمی‌دارد و درخواست بالا را می‌زند. شکست = retry؛ خطای
   پیکربندی = توقف با پیام روشن و دکمه «تلاش دوباره» در پنل.

کتاب **در هر حالت** به کاتالوگ سایت اضافه می‌شود — چک‌باکس‌ها فقط تعیین می‌کنند
سرویس AI چه کاری روی آن انجام دهد. کتاب تازه هنوز `audio_edition` ندارد، پس در
فهرست و صفحه کتاب دیده می‌شود ولی تا تولید صوت قابل پخش نیست.

### احراز هویت

هدر `X-Admin-Key` (مقدار `ADMIN_API_KEY`) یا JWT با نقش admin. کلید در
`sessionStorage` مرورگر می‌ماند، نه در باندل — گذاشتنش در `NEXT_PUBLIC_*` یعنی
تحویل کلیدِ آپلود کتاب به هر بازدیدکننده سایت عمومی. در production اگر ست شود باید
حداقل ۳۲ کاراکتر باشد، وگرنه پروسه بالا نمی‌آید.

### API

| متد | مسیر | کار |
|---|---|---|
| `POST` | `/api/v1/admin/ingestions` | آپلود (multipart: title, author, description, pdf, cover, tts, assistant) |
| `GET` | `/api/v1/admin/ingestions` | فهرست + وضعیت job |
| `GET` | `/api/v1/admin/ingestions/{id}` | جزئیات + گام‌های پردازش |
| `POST` | `/api/v1/admin/ingestions/{id}/dispatch` | تلاش دوباره برای تحویل |
| `GET` | `/api/v1/public/covers/{id}` | کاور (عمومی — bucket خصوصی می‌ماند) |

---

## ۴. آنچه هنوز وصل نیست

- **صوت تولیدشده به کاتالوگ برنمی‌گردد.** سرویس AI خروجی TTS را در
  `public.audio_assets` می‌نویسد؛ برای پخش در سایت باید به
  `catalog.audio_editions` + `media.audio_assets` نگاشت شود. این نگاشت هنوز نوشته
  نشده چون قرارداد آن سمت هنوز داده مشخصی ندارد: هر asset با کدام `voice_id` و هر
  فصل با کدام edition متناظر است. اولین کتابی که واقعاً TTS شود، این را روشن می‌کند.
- **خلاصه تولیدشده به `catalog.books.description` برنمی‌گردد** — به همان دلیل: هنوز
  معلوم نیست خلاصه در `books.metadata` می‌نشیند یا در `document_artifacts`.
- **`/api/v1/public/events`** در قرارداد فرانت هست ولی در بک‌اند نه؛ تا ساخته‌شدنش
  `NEXT_PUBLIC_ANALYTICS_ENABLED=false` بماند.
