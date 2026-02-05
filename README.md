# سامانه رهگیری تجهیزات جراحی چندگیت

این پروژه یک نمونه کامل فرانت‌اند برای رهگیری ابزارهای جراحی در چند گیت بیمارستانی است. رابط کاربری کاملاً راست‌به‌چپ و به زبان فارسی طراحی شده و از داده‌های Mock برای شبیه‌سازی API استفاده می‌کند.

## پیش‌نیازها

- Node.js 18+
- npm

## اجرای پروژه

```bash
npm install
npm run dev
```

## اسکریپت‌ها

```bash
npm run build
npm run preview
npm run typecheck
```

## تنظیمات محیطی

نمونه فایل `.env.example` را کپی کنید:

```bash
cp .env.example .env
```

- `VITE_USE_MOCK=true` برای استفاده از داده‌های Mock
- `VITE_API_BASE_URL` برای اتصال به API واقعی

## ورود نمونه

- مدیر: `admin / admin`
- حامی: `support / support`

