// وظایف روزانه‌ی مشاور. صرفاً یادآور است و تیک‌خورده ذخیره می‌شود.
// cleaningOnly: فقط در روز نوبت نظافت نمایش داده می‌شود.
export const DAY_TASKS = [
  { key: 'arrive',           section: 'ورود',           title: 'حضور در دفتر (حداکثر ساعت ۸:۳۰)' },

  { key: 'cleaning',         section: 'شروع صبح',       title: 'انجام نظافت دفتر', cleaningOnly: true },
  { key: 'ads_review',       section: 'شروع صبح',       title: 'بررسی آگهی‌های گروه' },
  { key: 'eita_reply',       section: 'شروع صبح',       title: 'ریپلای در ایتا برای آگهی‌های خودم' },
  { key: 'visits_scheduled', section: 'شروع صبح',       title: 'هماهنگی بازدیدها و ثبت ساعت در دفتر' },

  { key: 'visit_done',       section: 'بازدید و پرزنت', title: 'بازدید طبق هماهنگی و پرزنت مشتری' },

  { key: 'property_saved',   section: 'بعدازظهر',       title: 'ثبت اطلاعات ملک‌های بازدیدشده در سیستم اصلی' },
  { key: 'my_ads_updated',   section: 'بعدازظهر',       title: 'به‌روزرسانی آگهی‌های خودم (فروخته‌شده، قیمت جدید)' },
  { key: 'boards_updated',   section: 'بعدازظهر',       title: 'آپدیت تابلوهای دفتر' },
];

// فیلدهای آمار پایان روز
export const STATS_FIELDS = [
  { key: 'consultations',      label: 'مشاوره' },
  { key: 'visits',             label: 'بازدید' },
  { key: 'presented_clients',  label: 'مشتری پرزنت‌شده' },
  { key: 'properties_saved',   label: 'ملک ثبت‌شده در سیستم' },
  { key: 'divar_ads',          label: 'آگهی ثبت‌شده در دیوار' },
  { key: 'followed_ads',       label: 'آگهی پیگیری‌شده' },
  { key: 'meetings',           label: 'جلسه' },
];
