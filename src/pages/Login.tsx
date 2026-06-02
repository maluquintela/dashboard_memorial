import { useState } from 'react';
import type { FormEvent } from 'react';
import { LockKeyhole } from 'lucide-react';
import TecPredLogo from '../components/TecPredLogo';
import { useAuth } from '../auth/authContext';
import { TP } from '../theme';

export default function Login() {
  const { signIn, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch {
      setLocalError('Email ou senha inválidos.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: TP.page }}>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg border bg-white p-6 shadow-sm"
        style={{ borderColor: TP.border }}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div
            className="flex w-full justify-center rounded-lg px-5 py-4 shadow-sm"
            style={{
              background: `linear-gradient(92deg, ${TP.headerFrom} 0%, ${TP.headerTo} 100%)`,
              boxShadow: '0 10px 24px rgba(59, 63, 175, 0.22)',
            }}
          >
            <TecPredLogo variant="light" size="default" />
          </div>
          <div
            className="mt-5 flex h-11 w-11 items-center justify-center rounded-lg"
            style={{ background: TP.navActiveBg, color: TP.primary }}
          >
            <LockKeyhole size={22} />
          </div>
          <h1 className="mt-3 text-xl font-bold" style={{ color: TP.text }}>
            Entrar na plataforma
          </h1>
        </div>

        <label className="block text-sm font-semibold" style={{ color: TP.text }}>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4c4fbf]"
            style={{ borderColor: TP.border }}
          />
        </label>

        <label className="mt-4 block text-sm font-semibold" style={{ color: TP.text }}>
          Senha
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#4c4fbf]"
            style={{ borderColor: TP.border }}
          />
        </label>

        {(localError || authError) && (
          <p className="mt-4 rounded-lg border px-3 py-2 text-sm font-medium text-red-700" style={{ background: '#FEF2F2', borderColor: '#FECACA' }}>
            {localError ?? authError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="tp-btn-primary mt-5 w-full px-4 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
