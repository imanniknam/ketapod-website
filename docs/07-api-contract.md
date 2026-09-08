# قرارداد API صفحه Home

> **این سند فقط صفحه Home را پوشش می‌دهد.** قرارداد کامل API — کاتالوگ،
> پخش، کتابخانه، تجارت، کودک — در `../backend/api/openapi.yaml` است که
> تنها منبع حقیقت است و سه کلاینت از آن تولید می‌شوند. آن فایل الان ۶۳
> مسیر دارد؛ آنچه پایین می‌آید زیرمجموعه‌ای است که سند طراحی لندینگ
> تعریف کرده و برای مرجع تاریخی نگه داشته شده.
>
> **تغییری که روی این صفحه اثر دارد:** `sources[].audioUrl` حالا یک URL
> امضاشده و کوتاه‌عمر است (`?t=…`). برای نسخه‌های رایگان — که همه
> کلیپ‌های دموی لندینگ هستند — رفتار عوض نشده و بازدیدکننده ناشناس کل
> کلیپ را می‌گیرد. برای نسخه پولی همان URL فقط پیش‌نمایش می‌دهد.

منبع: `../design-web-v1.1-HomePage.docx`.
**همه مسیرها زیر `/api/v1` یکسان‌سازی شده‌اند** ــ سند اصلی در دو جا ناسازگار بود
(`/api/v1/public/home/stats` در کنار `/public/home/demo`).

پایه: `https://api.ketapod.ir/api/v1`

## اصل معماری محتوا

سند تفکیک صریحی گذاشته که باید حفظ شود:

**ثابت در فرانت** ــ متن‌های Header، Hero، Why Us، Problem، Features، Kids،
Final CTA، Footer پایه، ساختار FAQ.
این‌ها در `../web/lib/content.ts` هستند و از دیتابیس خوانده نمی‌شوند.

**داینامیک از API** ــ KPIهای Trust Strip، داده Demo، زبان‌ها و محتوای بومی،
Social Proof، تنظیمات فرم لید، ثبت لید.

## `GET /public/home/stats`

```json
{
  "stats": [
    { "key": "books",       "label": "کتاب صوتی",  "value": 1200,  "displayValue": "1200+" },
    { "key": "narrators",   "label": "گوینده",      "value": 18,    "displayValue": "18" },
    { "key": "categories",  "label": "دسته محتوا",  "value": 45,    "displayValue": "45+" },
    { "key": "activeUsers", "label": "کاربر",       "value": 20000, "displayValue": "20K+" }
  ]
}
```

خطا ← فرانت با fallback رندر می‌کند یا سکشن را پنهان می‌کند. صفحه نباید بشکند.

## `GET /public/home/demo`

داده اولیه سکشن Interactive Demo. **فایل صوتی برنمی‌گرداند.**

```json
{
  "sampleBook": {
    "id": "book-1",
    "title": "ماجراجویی در جنگل",
    "author": "نویسنده نمونه",
    "coverUrl": "...",
    "durationSeconds": 1240,
    "currentProgressPercent": 42,
    "aiTag": "پیشنهاد هوشمند"
  },
  "voices": [
    { "id": "voice_narrator_fa_01", "name": "آرام",   "style": "calm",     "isDefault": true },
    { "id": "voice_narrator_fa_02", "name": "نمایشی", "style": "dramatic", "isDefault": false },
    { "id": "voice_narrator_fa_03", "name": "کودک",   "style": "kids",     "isDefault": false }
  ],
  "recommendations": [
    { "id": "r1", "bookId": "book-2", "title": "قصه شب",       "coverUrl": "...", "tag": "AI Suggestion", "type": "ai" },
    { "id": "r2", "bookId": "book-3", "title": "ماجرای کوچک",  "coverUrl": "...", "tag": "Kids",          "type": "kids" },
    { "id": "r3", "bookId": "book-4", "title": "افسانه محلی",  "coverUrl": "...", "tag": "Local",         "type": "local" }
  ],
  "continueListening": {
    "id": "c1", "bookId": "book-5", "title": "قصه‌های کوتاه",
    "progressPercent": 68, "coverUrl": "..."
  },
  "uiHints": { "kidsModeDefault": false, "autoplayAnimation": false }
}
```

**نکته سند:** فیلد `narratorName` از `sampleBook` حذف شده. نام گوینده باید فقط از
voice انتخاب‌شده یا source فعال استخراج شود، وگرنه با تغییر صدا رابط ناسازگار می‌شود.

`autoplayAnimation` فقط برای انیمیشن است و **نباید** باعث autoplay واقعی صوت شود.

## `GET /public/home/audio-items/{book_id}`

فایل‌های صوتی واقعی به تفکیک صدا.

```json
{
  "id": "home-sample-001",
  "bookId": "book-2",
  "title": "قصه شب",
  "durationSeconds": 185,
  "coverUrl": "...",
  "sources": [
    { "voiceId": "voice_narrator_fa_01", "voiceName": "گوینده آرام", "audioUrl": "...", "isKidsRecommended": false },
    { "voiceId": "voice_narrator_fa_03", "voiceName": "گوینده کودک", "audioUrl": "...", "isKidsRecommended": true }
  ],
  "isKidsFriendly": true
}
```

**اصلاحیه پیاده‌سازی:** مثال بالا در نسخهٔ قبلی این سند `voice_narrator_fa_02`
(«نمایشی» در `voices[]` سکشن دمو) را به `isKidsRecommended: true` و
voiceName «گوینده کودک» نسبت داده بود — ناسازگار با صدای کودک واقعی که
`voice_narrator_fa_03` است. اصلاح شد تا `voices[].id` در سراسر سند یکدست
بماند: `fa_01` آرام، `fa_02` نمایشی، `fa_03` کودک.

### قرارداد الزامی

**`voices[].id` باید دقیقاً با `sources[].voiceId` یکسان باشد.**
فرانت نباید هیچ نگاشت دستی بین صدای انتخابی و منبع صوتی انجام دهد.

**`sources[].audioUrl` باید مطلق (absolute) باشد، نه مسیر نسبی.** در توسعه
محلی فرانت روی `:3000` و بک‌اند روی `:8080` اجرا می‌شوند؛ یک URL نسبی در
مرورگر نسبت به origin صفحه (یعنی `:3000`) حل می‌شود، نه نسبت به API، و
درخواست صوت را به سرور اشتباه می‌فرستد. بک‌اند این را با
`PUBLIC_BASE_URL` (پیش‌فرض `http://localhost:8080`، در پروداکشن
`https://api.ketapod.ir`) می‌سازد — نگاه کنید `04-architecture.md`.

### رفتار فرانت

**بارگذاری اولیه:** `GET /public/home/demo` ← `selectedVoiceId` از `isDefault=true` ←
`kidsModeEnabled` از `uiHints` ← `GET /audio-items/{sampleBook.id}` ←
source متناظر با `selectedVoiceId`. اگر نبود، اولین source معتبر و همگام‌سازی `selectedVoiceId`.

**تغییر صدا:** source متناظر در آیتم فعال پیدا شود ← `audioUrl` عوض شود ←
نام گوینده از `source.voiceName` ← style بصری از `voice.style`.
اگر source نبود، آن صدا نباید فعال شود.

**قرارداد MVP:** فقط صداهایی قابل انتخاب باشند که source متناظرشان در آیتم فعال
وجود دارد؛ بقیه disabled یا پنهان.

**تغییر پیشنهاد:** پخش متوقف ← `GET /audio-items/{recommendation.bookId}` ←
تلاش برای حفظ `selectedVoiceId`؛ اگر نبود صدای پیش‌فرض، اگر آن هم نبود اولین source ←
progress صفر. **پخش خودکار شروع نمی‌شود.**

**Progress و Seek:** مقدار اولیه می‌تواند از `currentProgressPercent` بیاید، اما پس از
آماده شدن player، **مرجع نهایی `currentTime / duration` خودِ player است**.

### مدیریت خطا

- خطا در `/demo` ← سکشن پنهان یا با محتوای ثابت. **page-level failure مجاز نیست**
- خطا در `/audio-items` ← رابط رندر شود، player در حالت unavailable، دکمه Play غیرفعال
- خطا در source فعال ← پخش متوقف، پیام خطای قابل کنترل، بررسی fallback

## `GET /public/home/localization`

```json
{
  "title": "برای زبان‌ها و فرهنگ‌های متنوع",
  "subtitle": "محتوای بومی، زبان‌های مختلف و تجربه‌ای نزدیک‌تر به شنونده.",
  "languages": [
    { "code": "fa", "label": "فارسی" },
    { "code": "en", "label": "English" },
    { "code": "ar", "label": "العربية" },
    { "code": "ku", "label": "کوردی" },
    { "code": "tr", "label": "Türkçe" }
  ],
  "localTopics": ["قصه‌های محلی", "ادبیات کودک بومی", "فرهنگ عامه", "افسانه‌ها", "روایت‌های منطقه‌ای"],
  "samples": [
    { "id": "s1", "title": "افسانه‌های محلی", "coverUrl": "...", "language": "fa" },
    { "id": "s2", "title": "Bedtime Stories", "coverUrl": "...", "language": "en" },
    { "id": "s3", "title": "قصه‌های قومی",   "coverUrl": "...", "language": "ku" }
  ]
}
```

## `GET /public/home/social-proof`

```json
{
  "stats": [
    { "label": "کتاب", "value": "1200+" },
    { "label": "صدا",  "value": "18" },
    { "label": "کاربر","value": "20K+" },
    { "label": "همکار","value": "24" }
  ],
  "testimonials": [
    { "id": "t1", "name": "مریم", "role": "مادر",  "message": "...", "avatarUrl": "..." }
  ],
  "partners": [
    { "id": "p1", "name": "Partner A", "logoUrl": "..." }
  ]
}
```

**بدون داده واقعی این سکشن رندر نمی‌شود.** نظر ساختگی روی صفحه نمی‌رود.

## `GET /public/leads/options`

```json
{
  "userTypes":    [{ "value": "normal", "label": "کاربر عادی" }, { "value": "parent", "label": "والدین" },
                   { "value": "teen", "label": "نوجوان" }, { "value": "publisher", "label": "ناشر" },
                   { "value": "creator", "label": "تولیدکننده محتوا" }],
  "ageRanges":    [{ "value": "under-12", "label": "زیر 12 سال" }, "..."],
  "interestTags": [{ "value": "story", "label": "داستان" }, { "value": "kids", "label": "کودک" },
                   { "value": "self-development", "label": "توسعه فردی" }, { "value": "education", "label": "آموزشی" },
                   { "value": "local", "label": "محتوای بومی" }, { "value": "multilingual", "label": "چندزبانه" }],
  "languages":    [{ "value": "fa", "label": "فارسی" }, "..."]
}
```

## `POST /public/leads`

```json
{
  "fullName": "علی رضایی",
  "phoneNumber": "09120000000",
  "userType": "parent",
  "interestTags": ["kids", "local"],
  "consent": true,
  "source": "home",
  "landingPath": "/",
  "referrer": "https://google.com",
  "utm": { "source": "google", "medium": "cpc", "campaign": "brand-launch" }
}
```

**اعتبارسنجی:** `fullName` اجباری، حداقل ۲ کاراکتر · یکی از `email` یا `phoneNumber`
اجباری با فرمت معتبر · `userType` اجباری · `consent` باید `true` باشد.

**اصلاحیه پیاده‌سازی (بک‌اند، این سشن):** فرم واقعی در
`web/components/LeadForm.tsx` فقط `fullName` + `phoneNumber` + `userType` +
`interestTags` + `consent` می‌فرستد — بدون `email`. این با `08-decisions.md`
("فرم لید کوتاه شد: ایمیل و بازه سنی حذف شدند") سازگار است اما با متن بالا و
مثال ستون `409` این سند (که `duplicateBy: "email"` را نمونه زده) در تناقض
بود. بک‌اند تشخیص تکراری را بر پایه **`phoneNumber`** پیاده کرده — همان
چیزی که فرم واقعی می‌فرستد. `email` هنوز به‌عنوان فیلد اختیاری در قرارداد و
دیتابیس نگه داشته شده (برای مسیرهای غیر از فرم وب) و اگر ارسال شود همچنان
چک تکراری می‌شود.

| کد | معنی |
|---|---|
| `201` | `{ "message": "...", "leadId": "ld_...", "status": "created" }` |
| `409` | `{ "status": "duplicate", "duplicateBy": "phoneNumber" }` (یا `"email"` اگر آن مسیر ارسال شده باشد) |
| `422` | `{ "status": "validation_error", "errors": { "phoneNumber": ["..."] } }` |
| `500` | `{ "status": "error" }` |

**رفتار فرم:** دکمه هنگام submit به loading برود · کاربر نتواند چند بار submit کند ·
حالت duplicate پیام واضح بدهد · حالت موفق پیام کوتاه و روشن.

**غایب در سند و لازم پیش از انتشار:** rate limit بر اساس IP، تله honeypot،
تأیید پیامکی. این نقطه اسپم خواهد شد.

## `POST /public/events` — برای MVP لازم نیست

```json
{
  "eventName": "hero_primary_cta_clicked",
  "page": "home", "section": "hero", "element": "primary_cta",
  "metadata": { "target": "lead-form" },
  "userContext": { "sessionId": "...", "anonymousId": "...", "userAgent": "..." },
  "utm": { "...": "..." },
  "occurredAt": "2026-05-31T10:15:00Z"
}
```

پاسخ `202` یا `400`.

### فهرست ایونت‌ها

```
home_page_viewed · header_cta_clicked · hero_primary_cta_clicked
hero_secondary_cta_clicked · trust_strip_viewed · demo_play_clicked
demo_pause_clicked · demo_voice_changed · demo_kids_mode_toggled
demo_recommendation_selected · kids_cta_clicked · faq_item_opened
lead_form_started · lead_form_submitted · lead_form_submit_failed
lead_form_submit_succeeded · final_cta_clicked
```

ایونت‌ها فقط برای شمارش کلیک نیستند؛ باید بتوان فهمید کاربر از کدام نقطه وارد فرم
شده، با کدام بخش بیشتر تعامل داشته، و آیا سناریوی کودک برایش جذاب بوده.

## `PUT /api/v1/me/preferences/kids-mode`

```json
{ "enabled": true }
```

CTA سکشن کودک: اسکرول به فرم لید ← `userType` پیش‌فرض `parent` ← اگر علاقه‌مندی
خالی بود `kids` preselect شود. کاربر لاگین‌کرده ← ایونت ثبت شود؛
در غیر این صورت حالت کودک در کوکی نگه داشته شود.

## `GET /api/v1/me/services` — سوپر‌اپ

رجیستری سرویس سمت سرور. جزئیات در `03-product-surfaces.md`.
