import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import { TP } from './theme';

export default function App() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    html.style.backgroundColor = TP.page;
    body.style.backgroundColor = TP.page;
    body.style.margin = '0';
    body.style.color = TP.text;
    body.style.minHeight = '100vh';
  }, []);

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
      <Dashboard />
    </div>
  );
}
