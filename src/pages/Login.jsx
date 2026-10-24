import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { AGENTS, ADMIN, emailFor } from '../lib/config';

const OPTIONS = [...AGENTS, ADMIN];

export default function Login() {
  const [username, setUsername] = useState(AGENTS[0].username);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: emailFor(username),
      password,
    });
    setBusy(false);
    if (error) setError('رمز عبور اشتباه است');
  }

  return (
    <div className="login-wrap">
      <form className="card login-card" onSubmit={submit}>
        <h1>بازار</h1>
        <p className="muted">ورود</p>

        <label>
          نام
          <select value={username} onChange={(e) => setUsername(e.target.value)}>
            {OPTIONS.map((o) => (
              <option key={o.username} value={o.username}>{o.name}</option>
            ))}
          </select>
        </label>

        <label>
          رمز عبور
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button className="btn primary" disabled={busy}>
          {busy ? 'در حال ورود…' : 'ورود'}
        </button>
        <p className="muted small">ورود شما تا خروج دستی باقی می‌ماند.</p>
      </form>
    </div>
  );
}
