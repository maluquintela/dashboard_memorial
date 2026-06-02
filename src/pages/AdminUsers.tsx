import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { ShieldCheck, UserPlus, Trash2, RefreshCw } from 'lucide-react';
import { createUser, deleteUser, listUsers, updateUser } from '../services/api';
import type { UserProfile, UserRole } from '../types';
import { TP, tpCardStyle } from '../theme';
import { hideRemovedUsers, removeUserFromPanel } from './adminUsersState';

interface AdminUsersProps {
  currentUser: UserProfile;
}

export default function AdminUsers({ currentUser }: AdminUsersProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [removedUserIds, setRemovedUserIds] = useState<Set<string>>(() => new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setUsers(hideRemovedUsers(await listUsers(), removedUserIds));
    } catch {
      setError('Não foi possível carregar os usuários.');
    } finally {
      setIsLoading(false);
    }
  }, [removedUserIds]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const created = await createUser({
        displayName: displayName.trim(),
        email: email.trim(),
        password,
        role,
      });
      setUsers((prev) => [...prev, created]);
      setDisplayName('');
      setEmail('');
      setPassword('');
      setRole('user');
    } catch {
      setError('Não foi possível criar o usuário.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggleRole(user: UserProfile) {
    const nextRole: UserRole = user.role === 'owner' ? 'user' : 'owner';
    setError(null);
    try {
      const updated = await updateUser(user.userId, { role: nextRole });
      setUsers((prev) => prev.map((item) => item.userId === updated.userId ? updated : item));
    } catch {
      setError('Não foi possível alterar o papel do usuário.');
    }
  }

  async function handleDeactivate(user: UserProfile) {
    const confirmed = window.confirm(`Desativar "${user.displayName}"?`);
    if (!confirmed) return;
    setError(null);
    try {
      const updated = await updateUser(user.userId, { status: 'inactive' });
      setUsers((prev) => prev.map((item) => item.userId === updated.userId ? updated : item));
    } catch {
      setError('Não foi possível desativar o usuário.');
    }
  }

  async function handleRemoveFromPanel(user: UserProfile) {
    const confirmed = window.confirm(`Remover "${user.displayName}" do painel?`);
    if (!confirmed) return;
    setError(null);
    setRemovedUserIds((prev) => new Set(prev).add(user.userId));
    setUsers((prev) => removeUserFromPanel(prev, user.userId));
    try {
      await deleteUser(user.userId);
    } catch {
      setError('Não foi possível remover o usuário do painel.');
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 pb-5 pt-4 lg:px-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight" style={{ color: TP.primary }}>
          Administração
        </h2>
      </div>

      {error && (
        <div className="rounded-lg border px-4 py-3 text-sm font-medium text-red-700" style={{ borderColor: '#FECACA', background: '#FEF2F2' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleCreate} className="grid gap-3 p-4 md:grid-cols-[1fr_1fr_12rem_8rem_auto]" style={tpCardStyle}>
        <input
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          placeholder="Nome de usuário"
          required
          minLength={2}
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: TP.border }}
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="email@empresa.com"
          type="email"
          required
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: TP.border }}
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Senha inicial"
          type="password"
          required
          minLength={8}
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: TP.border }}
        />
        <select
          value={role}
          onChange={(event) => setRole(event.target.value as UserRole)}
          className="rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: TP.border }}
        >
          <option value="user">Usuário</option>
          <option value="owner">Owner</option>
        </select>
        <button type="submit" disabled={isSaving} className="tp-btn-primary flex items-center justify-center gap-2 px-4 py-2 text-sm disabled:opacity-60">
          <UserPlus size={15} />
          Criar
        </button>
      </form>

      <section className="min-h-[20rem] overflow-hidden" style={tpCardStyle}>
        <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: TP.border }}>
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} style={{ color: TP.accent }} />
            <h3 className="text-sm font-semibold" style={{ color: TP.text }}>Contas</h3>
          </div>
          <button type="button" onClick={fetchUsers} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold" style={{ borderColor: TP.border, color: TP.primary }}>
            <RefreshCw size={13} />
            Atualizar
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead style={{ color: TP.muted }}>
              <tr className="border-b" style={{ borderColor: TP.border }}>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Papel</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td className="px-4 py-6" colSpan={5}>Carregando...</td></tr>
              ) : users.map((user) => {
                const isSelf = user.userId === currentUser.userId;
                return (
                  <tr key={user.userId} className="border-b last:border-b-0" style={{ borderColor: TP.border }}>
                    <td className="px-4 py-3 font-medium" style={{ color: TP.text }}>{user.displayName}</td>
                    <td className="px-4 py-3" style={{ color: TP.muted }}>{user.email}</td>
                    <td className="px-4 py-3">{user.role === 'owner' ? 'Owner' : 'Usuário'}</td>
                    <td className="px-4 py-3">{user.status === 'active' ? 'Ativo' : 'Inativo'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleRole(user)}
                          disabled={isSelf}
                          className="rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                          style={{ borderColor: TP.border, color: TP.primary }}
                        >
                          {user.role === 'owner' ? 'Tornar usuário' : 'Tornar owner'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeactivate(user)}
                          disabled={isSelf || user.status === 'inactive'}
                          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                          style={{ borderColor: 'rgba(248, 113, 113, 0.45)', color: '#dc2626' }}
                        >
                          <Trash2 size={12} />
                          Desativar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveFromPanel(user)}
                          disabled={isSelf}
                          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40"
                          style={{ borderColor: 'rgba(107, 114, 128, 0.35)', color: TP.muted }}
                        >
                          <Trash2 size={12} />
                          Remover
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
