export const TZ = 'Asia/Tehran';

// کلید تاریخ امروز به وقت تهران: "2026-10-23"
export const todayKey = () =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

// روز هفته به وقت تهران؛ 0 = یکشنبه ... 6 = شنبه (مطابق Date.getDay)
export const todayWeekday = () =>
  new Date(new Date().toLocaleString('en-US', { timeZone: TZ })).getDay();

// ترتیب نمایش هفته از شنبه (فارسی)
export const WEEK_ORDER = [6, 0, 1, 2, 3, 4, 5];

export const WEEKDAYS = {
  0: 'یکشنبه',
  1: 'دوشنبه',
  2: 'سه‌شنبه',
  3: 'چهارشنبه',
  4: 'پنج‌شنبه',
  5: 'جمعه',
  6: 'شنبه',
};

export const todayFa = () =>
  new Intl.DateTimeFormat('fa-IR', { timeZone: TZ, dateStyle: 'full' }).format(new Date());

// "HH:MM" به وقت تهران برای مقایسه‌ی ساعت ورود
export const timeHHMM = (iso) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(iso));

export const formatTime = (iso) =>
  new Intl.DateTimeFormat('fa-IR', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
