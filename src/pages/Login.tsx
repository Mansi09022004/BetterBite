import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { GoogleButton } from '../components/auth/GoogleButton';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    navigate(from, { replace: true });
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  };

  return (
    <AuthLayout
      heading="Welcome Back"
      subtitle="Sign in to track orders, save addresses and enjoy a faster checkout."
    >
      <Helmet>
        <title>Login — BetterBite</title>
      </Helmet>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl bg-berry/10 px-4 py-2.5 text-sm font-medium text-berry">{error}</div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="input-field w-full"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="input-field w-full"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-cocoa-500">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-cocoa-600/30 text-cocoa-600 focus:ring-gold-500"
            />
            Remember Me
          </label>
          <Link to="/forgot-password" className="font-semibold text-cocoa-600 hover:text-gold-700">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Login'}
        </button>

        <div className="flex items-center gap-3 py-1 text-xs font-semibold uppercase tracking-wide text-cocoa-400">
          <span className="h-px flex-1 bg-cocoa-600/10" />
          OR
          <span className="h-px flex-1 bg-cocoa-600/10" />
        </div>

        <GoogleButton onClick={handleGoogle} disabled={submitting} />

        <p className="mt-2 text-center text-sm text-cocoa-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-cocoa-700 hover:text-gold-700">
            Create Account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
