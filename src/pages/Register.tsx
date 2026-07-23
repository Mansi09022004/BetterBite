import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { GoogleButton } from '../components/auth/GoogleButton';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    const { error, needsEmailConfirmation } = await signUp(email, password, fullName, phone);
    setSubmitting(false);

    if (error) {
      setError(error);
      return;
    }
    if (needsEmailConfirmation) {
      setConfirmationSent(true);
      return;
    }
    navigate('/', { replace: true });
  };

  const handleGoogle = async () => {
    setError(null);
    const { error } = await signInWithGoogle();
    if (error) setError(error);
  };

  if (confirmationSent) {
    return (
      <AuthLayout heading="Create Your Account" subtitle="Join BetterBite for faster checkout and order tracking.">
        <Helmet>
          <title>Create Account — BetterBite</title>
        </Helmet>
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <h2 className="font-display text-xl font-bold text-cocoa-700">Check your email</h2>
          <p className="max-w-xs text-sm text-cocoa-500">
            We've sent a confirmation link to <span className="font-semibold text-cocoa-700">{email}</span>. Confirm
            your email to finish setting up your account.
          </p>
          <Link to="/login" className="mt-2">
            <button className="btn-secondary">Back to Login</button>
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout heading="Create Your Account" subtitle="Join BetterBite for faster checkout and order tracking.">
      <Helmet>
        <title>Create Account — BetterBite</title>
      </Helmet>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="rounded-xl bg-berry/10 px-4 py-2.5 text-sm font-medium text-berry">{error}</div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
            Full Name
          </label>
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            className="input-field w-full"
          />
        </div>

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
            Phone Number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
            className="input-field w-full"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field w-full"
            />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary mt-2 w-full">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Account'}
        </button>

        <div className="flex items-center gap-3 py-1 text-xs font-semibold uppercase tracking-wide text-cocoa-400">
          <span className="h-px flex-1 bg-cocoa-600/10" />
          OR
          <span className="h-px flex-1 bg-cocoa-600/10" />
        </div>

        <GoogleButton onClick={handleGoogle} disabled={submitting} />

        <p className="mt-2 text-center text-sm text-cocoa-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-cocoa-700 hover:text-gold-700">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
