# کتاپاد — لندینگ پیج

پیاده‌سازی صفحه Home بر اساس `design-web-v1.1-HomePage`.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 · Motion (Framer Motion) · Lucide

```bash
npm run dev
```

---

## ۱. ساختار صفحه

ترتیب سکشن‌ها دقیقاً مطابق داکیومنت است و در [`src/app/page.tsx`](src/app/page.tsx) تعریف شده:

| # | سکشن | فایل | منبع داده |
|---|------|------|-----------|
| 1 | Header | `sections/Header.tsx` | ثابت |
| 2 | Hero | `sections/Hero.tsx` + `HeroMockup.tsx` | ثابت |
| 3 | Trust Strip | `sections/TrustStrip.tsx` | `GET /api/v1/public/home/stats` |
| 4 | Why Us | `sections/WhyUs.tsx` | ثابت |
| 5 | Problem | `sections/Problem.tsx` | ثابت |
| 6 | Features | `sections/Features.tsx` | ثابت |
| 7 | Interactive Demo | `sections/InteractiveDemo.tsx` + `hooks/useDemoPlayer.ts` | `GET /public/home/demo` و `GET /public/home/audio-items/{book_id}` |
| 8 | Kids | `sections/Kids.tsx` | ثابت |
| 9 | Localization | `sections/Localization.tsx` | `GET /api/v1/public/home/localization` |
| 10 | Social Proof | `sections/SocialProof.tsx` | `GET /api/v1/public/home/social-proof` |
| 11 | FAQ | `sections/Faq.tsx` | ثابت |
| 12 | Lead Form | `sections/LeadForm.tsx` | `GET /api/v1/public/leads/options` · `POST /api/v1/public/leads` |
| 13 | Final CTA | `sections/FinalCta.tsx` | ثابت |
| 14 | Footer | `sections/Footer.tsx` | ثابت |

- تمام **متن‌های ثابت** در [`src/lib/content.ts`](src/lib/content.ts) هستند — نه در کامپوننت‌ها.
- تمام **قراردادهای API** در [`src/lib/api.ts`](src/lib/api.ts) هستند (تایپ‌ها، مسیرها، fallbackها).

---

## ۲. asset‌های سه‌بعدی

رندرها از روی شیت گالری (`Gemini_Generated_Image_*.jpg`) بریده شده‌اند و در `public/assets/` هستند:

| فایل | جایگاه |
|------|--------|
| `microphone.webp` | Hero — المان شناور بالا-چپ |
| `ui-elements.webp` | Hero — المان شناور پایین-راست |
| `kid-scene.webp` | سکشن کودک — رندر اصلی |
| `globe.webp` | Localization — پشت کارت‌های نمونه |
| `phone-headphones.webp` | Final CTA |
| `icon-cards.webp` | یدکی — هنوز جایگاهی برایش تعریف نشده |

نگاشت جایگاه‌ها فقط در [`src/lib/assets.ts`](src/lib/assets.ts) است. برای عوض کردن هر کدام، فایل را در `public/assets/` بگذارید و مسیر را همان‌جا تغییر دهید — هر جایگاه نسبت‌تصویر قفل‌شده دارد، پس **هیچ layout shift‌ای اتفاق نمی‌افتد**. مقدار خالی یعنی «placeholder طراحی‌شده را نشان بده».

### درباره کیفیت برش

شیت گالری یک **JPEG بدون کانال آلفا** بود (نسخه‌ی شطرنجی هم شطرنجی‌اش نقاشی‌شده بود، نه شفافیت واقعی). بنابراین برش با difference matte انجام شده: پس‌زمینه‌ی هر کارت بازسازی و از تصویر کم شده است. اسکریپتش با توضیح کامل اینجاست: [`scripts/extract-assets.py`](scripts/extract-assets.py).

نتیجه روی پس‌زمینه‌ی کاغذی صفحه تمیز است، ولی دو محدودیت دارد که ارزش دانستن دارند:

- نور برگشتی خودِ رندر روی پلیت، جایی‌که رنگ شیء به رنگ پلیت نزدیک است (لبه‌های هدفون سفید) کمی هاله باقی می‌گذارد. روی کِرِم دیده نمی‌شود، روی پنل تیره در اندازه‌های بزرگ ممکن است دیده شود.
- رزولوشن منبع محدود است (۴۷۰ تا ۷۰۰ پیکسل). برای نمایش‌های بزرگ‌تر از ~۳۵۰px روی صفحه‌های رتینا کمی نرم می‌شود.

اگر رندرهای تکی با پس‌زمینه‌ی شفاف واقعی (PNG/WebP، ۲ برابر اندازه نمایش) گرفتید، کافی است جایگزین همین فایل‌ها شوند؛ هیچ کد دیگری تغییر نمی‌کند.

کاورهای کتاب و آواتارها جدا هستند: اگر `coverUrl` / `avatarUrl` از API بیاید استفاده می‌شود، در غیر این صورت `CoverArt` یک کاور SVG قطعی (deterministic) می‌سازد.

---

## ۳. اتصال به بک‌اند

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://api.ketapod.ir
```

نکات پیاده‌سازی مطابق داکیومنت:

- **هر سکشن مستقل fail می‌شود.** خطای یک endpoint باعث page-level failure نمی‌شود؛ داده seed رندر می‌شود.
- **Trust Strip / Localization / Social Proof / Lead options** بلافاصله با داده fallback رندر می‌شوند و با رسیدن پاسخ API جایگزین می‌شوند — بدون skeleton و بدون reflow.
- **Interactive Demo پخش واقعی دارد.** یک `<audio>` تنها منبع حقیقت برای `isPlaying`، progress و duration است. اگر audio item لود نشود، پلیر به حالت `unavailable` می‌رود و دکمه Play غیرفعال می‌شود؛ بقیه سکشن فعال می‌ماند.
- **قرارداد voice ⇄ source:** فقط voiceهایی قابل انتخاب‌اند که `sources[].voiceId` متناظر داشته باشند. نام گوینده همیشه از `source.voiceName` خوانده می‌شود، نه از `sampleBook`.
- **Kids Mode** فقط state محلی UI است و هیچ‌جا persist نمی‌شود.
- **دامنه تصاویر** باید در `next.config.ts` → `images.remotePatterns` مجاز شود.

> ⚠️ داکیومنت، دو endpoint دموی صوتی را **بدون** پیشوند `/api/v1` نوشته و بقیه را **با** آن. هر دو شکل عیناً در `ENDPOINTS` (فایل `api.ts`) نگه داشته شده‌اند؛ اگر بک‌اند یکسان‌سازی کرد، یک خط تغییر کافی است.

### ایونت‌ها

همه ایونت‌های لیست داکیومنت پیاده شده‌اند و از طریق `trackEvent()` با `navigator.sendBeacon` ارسال می‌شوند (fire-and-forget — هرگز UI را نمی‌شکند). برای MVP لازم نیست؛ اگر endpoint نباشد بی‌صدا رد می‌شود.

---

## ۴. دیزاین سیستم

توکن‌ها در [`src/app/globals.css`](src/app/globals.css) با `@theme` تعریف شده‌اند.

- **کانسپت:** «کاغذ و موج» — پس‌زمینه کاغذی گرم، تایپ جوهری، بنفش الکتریک، و موتیف موج صوتی که به‌جای تزئین، عنصر ساختاری است.
- **رنگ:** `paper #FAF8F4` · `ink #15131D` · `violet #6C4CF0` · `amber #F0B23C` · `mint #2F9E73` · `night #14121C`
- **تایپوگرافی:** Vazirmatn برای فارسی + JetBrains Mono برای eyebrowها، اعداد و لیبل‌های لاتین. همین جفت‌شدن است که به صفحه لحن editorial می‌دهد.
- **Radius:** 8 / 12 / 16 / 24 / 32 — **Spacing:** گرید ۸px — **Elevation:** ۴ سطح سایه با ته‌رنگ گرم.
- **ریتم صفحه:** کارت → پنل تیره → بنتو → کنسول تیره‌بنفش → پنل گرم کودک → ... هیچ دو سکشن پشت‌سرهم یک treatment ندارند.

### انیمیشن

- دو منحنی، نه بیشتر: `EASE_OUT_EXPO` برای ورودها، spring برای تعامل‌ها ([`src/lib/motion.ts`](src/lib/motion.ts)).
- ورود اسکرولی از طریق `<Reveal>` / `<RevealGroup>` + `<RevealItem>` (استفاده از `whileInView` و variant propagation، نه delay دستی).
- `useReducedMotion()` همه‌جا رعایت شده: حرکت حذف می‌شود، محتوا باقی می‌ماند. مارکی‌ها کامل متوقف می‌شوند.
- Waveform فقط وقتی پخش واقعاً در جریان است حرکت می‌کند.

---

## ۵. بررسی‌های انجام‌شده

- `npm run build` · `npx tsc --noEmit` · `npx eslint .` — همه پاک.
- بدون overflow افقی در ۳۹۰px، ۷۶۸px، ۱۴۴۰px.
- RTL: اعداد لاتین (`20K+`) با `dir="ltr"` ایزوله شده‌اند تا `+` جابه‌جا نشود.
- ولیدیشن فرم لید مطابق قواعد داکیومنت تست شد (اجباری‌بودن نام، الزام ایمیل **یا** موبایل، فرمت‌ها، consent).
- CTA سکشن کودک، فرم را با `userType=parent` و علاقه‌مندی `kids` از پیش پر می‌کند.
