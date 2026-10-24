import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,      // سشن در localStorage می‌ماند
      autoRefreshToken: true,    // توکن خودکار تمدید می‌شود
      detectSessionInUrl: false,
    },
  }
);
