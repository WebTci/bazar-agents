import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DAY_TASKS } from '../lib/tasks';
import { todayKey, WEEKDAYS, WEEK_ORDER, formatTime, timeHHMM } from '../lib/time';

// تعداد وظایف قابل نمایش برای همه‌ی مشاوران (بدون نظافت، که فقط روز نوبت دیده می‌شود)
const COMMON_TASK_COUNT = DAY_TASKS.filter((t) => !t.cleaningOnly).length;

export default function AdminPanel({ profile }) {
  const [agents, setAgents] = useState([]);
  const [cleaning, setCleaning] = useState([]);
  const [date, setDate] = useState(todayKey());
  const [entries, setEntries] = useState([]);
  const [msg, setMsg] = useState('');

  // مشاوران و نوبت‌های نظافت
  useEffect(() => {
    (async () => {
      const [a, c] = await Promise.all([
        supabase.from('profiles').select('id, full_name').eq('role', 'agent').order('full_name'),
        supabase.from('cleaning_days').select('agent_id, weekday'),
      ]);
      if (a.error || c.error) setMsg('خطا در بارگذاری');
      setAgents(a.data || []);
      setCleaning(c.data || []);
    })();
  }, []);

  // وضعیت روزانه‌ی مشاوران برای تاریخ انتخابی
  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('daily_entries')
        .select('agent_id, checked_in_at, checks, stats')
        .eq('entry_date', date);
      if (error) setMsg(error.message);
      setEntries(data || []);
    })();
  }, [date]);

  async function toggleDay(agentId, weekday) {
    const exists = cleaning.some((c) => c.agent_id === agentId && c.weekday === weekday);
    const res = exists
      ? await supabase.from('cleaning_days').delete().eq('agent_id', agentId).eq('weekday', weekday)
      : await supabase.from('cleaning_days').insert({ agent_id: agentId, weekday });

    if (res.error) return setMsg(res.error.message);
    setCleaning(
      exists
        ? cleaning.filter((c) => !(c.agent_id === agentId && c.weekday === weekday))
        : [...cleaning, { agent_id: agentId, weekday }]
    );
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="title">کنترل و نظارت</div>
        <button className="btn ghost" onClick={logout}>خروج</button>
      </header>

      <section className="card">
        <h3 className="section">نوبت نظافت</h3>
        {agents.map((a) => (
          <div key={a.id} className="cleaning-row">
            <div className="name">{a.full_name}</div>
            <div className="days">
              {WEEK_ORDER.map((wd) => {
                const on = cleaning.some((c) => c.agent_id === a.id && c.weekday === wd);
                return (
                  <button
                    key={wd}
                    className={`day ${on ? 'on' : ''}`}
                    onClick={() => toggleDay(a.id, wd)}
                  >
                    {WEEKDAYS[wd]}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {msg && <div className="error">{msg}</div>}
      </section>

      <section className="card">
        <div className="row-between">
          <h3 className="section">وضعیت روزانه</h3>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        {agents.map((a) => {
          const e = entries.find((x) => x.agent_id === a.id);
          if (!e) {
            return (
              <div key={a.id} className="entry muted">
                {a.full_name}: هنوز وارد نشده
              </div>
            );
          }
          const late = timeHHMM(e.checked_in_at) > '08:30';
          const done = Object.entries(e.checks || {}).filter(([, v]) => v).length;
          const s = e.stats || {};
          return (
            <div key={a.id} className="entry">
              <div className="row-between">
                <strong>{a.full_name}</strong>
                <span className={late ? 'late' : 'ok-text'}>
                  ورود {formatTime(e.checked_in_at)} {late && '(دیرتر از ۸:۳۰)'}
                </span>
              </div>
              <div className="small muted">
                وظایف: {done} از {COMMON_TASK_COUNT} | مشاوره: {s.consultations || 0} |
                بازدید: {s.visits || 0} | پرزنت: {s.presented_clients || 0} |
                ملک ثبت‌شده: {s.properties_saved || 0} | دیوار: {s.divar_ads || 0} |
                پیگیری: {s.followed_ads || 0} | جلسه: {s.meetings || 0}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
