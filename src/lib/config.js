// نام کاربری‌ها. در Supabase Auth برای هرکدام کاربری با ایمیل زیر ساخته می‌شود.
export const AGENTS = [
  { username: 'hamzeh',   name: 'حمزه' },
  { username: 'mokhtari', name: 'مختاری' },
  { username: 'sepiani',  name: 'سپیانی' },
];

export const ADMIN = { username: 'admin', name: 'مدیر سیستم' };

// دامنه‌ی داخلی فقط برای ساخت ایمیل ورود است؛ ایمیلی ارسال نمی‌شود.
const INTERNAL_DOMAIN = 'bazar-team.com';

export const emailFor = (username) => `${username}@${INTERNAL_DOMAIN}`;
