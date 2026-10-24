import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DAY_TASKS, STATS_FIELDS } from '../lib/tasks';
import { todayKey, todayWeekday, todayFa, WEEKDAYS, WEEK_ORDER } from '../lib/time';

export default function AgentHome({ profile }) {
  const date = todayKey();
  const weekday = todayWeekday();

  const [cleaningDays, setCleaningDays] = useState([]);
  const [checks, setChecks] = useState({});
  const [stats, setStats] = useState({});
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [cd, entry] = await Promise.all([
        supabase.from('cleaning_days').select('weekday').eq('agent_id', profile.id),
        supabase
          .from('daily_entries')
          .select('checks, stats')
          .eq('entry_date', date)
          .eq('agent_id', profile.id)
          .maybeSingle(),
      ]);

      if (cd.error || entry.error) setMsg('خطا در بارگذاری اطلاعات');
      setCleaningDays((cd.data || []).map((r) => r.weekday));
      setChecks(entry.data?.checks || {});
      setStats(entry.data?.stats || {});
      setLoading(false);
    })();
  }, [profile.id, date]);

  const isCleaningToday = cleaningDays.includes(weekday);

  // متن نوبت نظافت، مرتب از شنبه، مثل «شنبه، یکشنبه»
  const cleaningText = useMemo(
    () => WEEK_ORDER.filter((d) => cleaningDays.includes(d)).map((d) => WEEKDAYS[d]).join('، '),
    [cleaningDays]
  );

  // وظایف نظافت فقط در روز نوبت خودِ مشاور نمایش داده می‌شوند
  const visibleTasks = DAY_TASKS.filter((t) => !t.cleaningOnly || isCleaningToday);
  const doneCount = visibleTasks.filter((t) => checks[t.key]).length;

  // ذخیره فقط ستون‌های ارسالی را به‌روز می‌کند و بقیه دست‌نخورده می‌ماند
  async function save(patch) {
    const { error } = await supabase
      .from('daily_entries')
      .upsert(
        { entry_date: date, agent_id: profile.id, ...patch },
        { onConflict: 'entry_date,agent_id' }
      );
    if (error) setMsg('خطا در ذخیره: ' + error.message);
  }

  async function toggle(key) {
    const next = { ...checks, [key]: !checks[key] };
    setChecks(next);
    setMsg('');
    await save({ checks: next });
  }

  async function saveStats(e) {
    e.preventDefault();
    setMsg('');
    await save({ stats });
    setMsg('آمار امروز ذخیره شد');
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (loading) return <div className="center muted">در حال بارگذاری…</div>;

  let lastSection = null;

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <div className="title">سلام {profile.full_name}</div>
          <div className="muted small">{todayFa()}</div>
        </div>
        <button className="btn ghost" onClick={logout}>خروج</button>
      </header>

      {cleaningDays.length > 0 && (
        <div className={`notice ${isCleaningToday ? 'warn' : ''}`}>
          {isCleaningToday
            ? 'امروز نوبت نظافت شماست'
            : `نوبت نظافت شما: ${cleaningText}`}
        </div>
      )}

      <div className="progress">
        <div className="bar" style={{ width: `${(doneCount / visibleTasks.length) * 100}%` }} />
        <span className="small">{doneCount} از {visibleTasks.length} انجام شده</span>
      </div>

      <section className="card">
        {visibleTasks.map((t) => {
          const header = t.section !== lastSection ? t.section : null;
          lastSection = t.section;
          return (
            <div key={t.key}>
              {header && <h3 className="section">{header}</h3>}
              <label className={`task ${checks[t.key] ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  checked={!!checks[t.key]}
                  onChange={() => toggle(t.key)}
                />
                <span>{t.title}</span>
              </label>
            </div>
          );
        })}
      </section>

      <section className="card">
        <h3 className="section">ثبت آمار امروز</h3>
        <form onSubmit={saveStats} className="stats-grid">
          {STATS_FIELDS.map((f) => (
            <label key={f.key}>
              {f.label}
              <input
                type="number"
                inputMode="numeric"
                min="0"
                value={stats[f.key] ?? ''}
                onChange={(e) => setStats({ ...stats, [f.key]: e.target.value })}
              />
            </label>
          ))}
          <button className="btn primary full">ذخیره آمار</button>
        </form>
        {msg && <div className="notice ok">{msg}</div>}
      </section>
    </div>
  );
}
