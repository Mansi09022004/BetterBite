import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Loader2, MailCheck } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await resetPassword(email);
    setSubmitting(false);
    if (error) {
      setError(error);
      return;
    }
    setSent(true);
  };

  return (
    <AuthLayout
      heading="Reset Your Password"
      subtitle="We'll email you a link to get back into your account."
    >
      <Helmet>
        <title>Forgot Password — BetterBite</title>
      </Helmet>

      {sent ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-gold-700">
            <MailCheck className="h-7 w-7" />
          </div>
          <h2 className="font-display text-xl font-bold text-cocoa-700">Check your email</h2>
          <p className="max-w-xs text-sm text-cocoa-500">
            If an account exists for <span className="font-semibold text-cocoa-700">{email}</span>, a reset link is
            on its way.
          </p>
          <Link to="/login" className="mt-2">
            <button className="btn-secondary">Back to Login</button>
          </Link>
        </div>
      ) : (
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

          <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
          </button>

          <p className="mt-2 text-center text-sm text-cocoa-500">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-cocoa-700 hover:text-gold-700">
              Login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
