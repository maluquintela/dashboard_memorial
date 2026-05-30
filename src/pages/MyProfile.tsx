import { useState } from 'react';
import type { FormEvent } from 'react';
import { Save } from 'lucide-react';
import { useAuth } from '../auth/authContext';
import { updateMyProfile } from '../services/api';
import { TP, tpCardStyle } from '../theme';

export default function MyProfile() {
  const { profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      await updateMyProfile(displayName.trim());
      await refreshProfile();
      setMessage('Perfil atualizado.');
    } catch {
      setMessage('Não foi possível atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-4 lg:px-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: TP.primary }}>
          Meu perfil
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl p-5" style={tpCardStyle}>
        <label className="block text-sm font-semibold" style={{ color: TP.text }}>
          Email
          <input
            value={profile?.email ?? ''}
            disabled
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm disabled:bg-slate-50"
            style={{ borderColor: TP.border, color: TP.muted }}
          />
        </label>
        <label className="mt-4 block text-sm font-semibold" style={{ color: TP.text }}>
          Nome de usuário
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            minLength={2}
            maxLength={80}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
            style={{ borderColor: TP.border }}
          />
        </label>
        {message && (
          <p className="mt-4 text-sm font-medium" style={{ color: message.includes('atualizado') ? '#047857' : '#dc2626' }}>
            {message}
          </p>
        )}
        <button type="submit" disabled={isSaving} className="tp-btn-primary mt-5 flex items-center gap-2 px-4 py-2 text-sm disabled:opacity-60">
          <Save size={15} />
          Salvar perfil
        </button>
      </form>
    </div>
  );
}
