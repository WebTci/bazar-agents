import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const handle = async (s) => {
      if (cancelled) return;
      setSession(s);
      if (s) {
        const { data } = await supabase
          .from('profiles')
          .select('id, username, full_name, role')
          .eq('id', s.user.id)
          .maybeSingle();
        if (!cancelled) setProfile(data ?? null);
      } else {
        setProfile(null);
      }
      if (!cancelled) setLoading(false);
    };

    supabase.auth.getSession().then(({ data }) => handle(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => handle(s));

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, profile, loading };
}
