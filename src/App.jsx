import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import AgentHome from './pages/AgentHome';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const { session, profile, loading } = useAuth();

  if (loading) return <div className="center muted">در حال بارگذاری…</div>;
  if (!session || !profile) return <Login />;

  return profile.role === 'admin'
    ? <AdminPanel profile={profile} />
    : <AgentHome profile={profile} />;
}
