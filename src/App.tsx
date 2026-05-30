import { useEffect } from 'react';
import { AuthProvider } from './auth/AuthProvider';
import { useAuth } from './auth/authContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import { TP } from './theme';

function AppContent() {
  const { profile, isOwner, isLoading, signOut } = useAuth();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.backgroundColor = TP.page;
    body.style.backgroundColor = TP.page;
    body.style.margin = '0';
    body.style.color = TP.text;
    body.style.minHeight = '100vh';
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: TP.page, color: TP.text }}>
        Carregando...
      </div>
    );
  }

  if (!profile) {
    return <Login />;
  }

  return (
    <div
      id="tecpred-shell"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: TP.page,
        color: TP.text,
      }}
    >
      <Dashboard profile={profile} isOwner={isOwner} onLogout={signOut} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
