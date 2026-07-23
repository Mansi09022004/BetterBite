import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { upsertProfile } from '../../services/profile';
import { supabase } from '../../lib/supabase';
import { Reveal } from '../../components/ui/Reveal';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setFullName(profile?.full_name ?? '');
    setPhone(profile?.phone ?? '');
  }, [profile]);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingInfo(true);
    const { error } = await upsertProfile(user.id, { full_name: fullName, phone });
    await refreshProfile();
    setSavingInfo(false);
    setMessage(error ? { type: 'error', text: error } : { type: 'success', text: 'Profile updated.' });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords don't match." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password changed.' });
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="container-page py-14 sm:py-20">
      <Helmet>
        <title>My Profile — BetterBite</title>
      </Helmet>

      <h1 className="font-display text-3xl font-bold text-cocoa-700 sm:text-4xl">My Profile</h1>

      {message && (
        <Reveal className="mt-6">
          <div
            className={`rounded-xl px-4 py-2.5 text-sm font-medium ${
              message.type === 'success' ? 'bg-gold-100 text-gold-700' : 'bg-berry/10 text-berry'
            }`}
          >
            {message.text}
          </div>
        </Reveal>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Reveal className="rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-8">
          <h2 className="font-display text-lg font-bold text-cocoa-700">Customer Information</h2>
          <form onSubmit={handleSaveInfo} className="mt-5 flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
                Name
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
                Email
              </label>
              <input value={user?.email ?? ''} disabled className="input-field w-full opacity-60" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
                Phone
              </label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field w-full" />
            </div>
            <button type="submit" disabled={savingInfo} className="btn-primary mt-2 w-full sm:w-auto">
              {savingInfo ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.08} className="rounded-3xl bg-white/70 p-6 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-8">
          <h2 className="font-display text-lg font-bold text-cocoa-700">Change Password</h2>
          <form onSubmit={handleChangePassword} className="mt-5 flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-400">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field w-full"
              />
            </div>
            <button type="submit" disabled={savingPassword} className="btn-primary mt-2 w-full sm:w-auto">
              {savingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
            </button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
