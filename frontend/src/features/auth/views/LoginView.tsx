import { useState, type FormEvent } from 'react';
import { useAuth } from '../AuthContext';

const inputClass =
  'w-full rounded-[6px] border border-[#c9cdd4] bg-white px-[12px] py-[10px] font-body-md text-body-md text-[#171a20] focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary';
const labelClass =
  'mb-[6px] block font-label-caps text-label-caps font-bold uppercase text-[#737780]';

/** Full-screen, centered sign-in card shown whenever there is no active session. */
export function LoginView() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(username.trim(), password);
      // On success the app swaps to the main layout and this view unmounts.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Accesso non riuscito.');
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-[400px] max-w-full rounded-[12px] bg-white p-[36px] shadow-[0_16px_48px_rgba(0,0,0,0.16)]">
        <div className="mb-[28px] text-center">
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary-container">OrtoDynamic</h1>
          <p className="mt-[6px] font-body-sm text-body-sm text-on-surface-variant">Accedi per continuare</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-[18px]">
          <div>
            <label htmlFor="username" className={labelClass}>
              Nome utente o email
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !username || !password}
            className="h-[44px] w-full rounded-[6px] bg-secondary font-body-md text-body-md font-semibold text-on-secondary hover:bg-secondary-container disabled:opacity-50"
          >
            {submitting ? 'Accesso in corso…' : 'Accedi'}
          </button>
        </form>
      </div>
    </div>
  );
}
