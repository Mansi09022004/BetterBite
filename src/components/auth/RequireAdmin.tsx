import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// This is a UX convenience only — the real security boundary is the
// `is_admin` checks baked into every admin table's RLS policies, so even a
// bypassed route guard can't read or write admin data.
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || (user && profileLoading)) {
    // eslint-disable-next-line no-console
    console.log('[RequireAdmin] waiting on auth/profile to resolve...', { loading, profileLoading });
    return <div className="flex min-h-screen items-center justify-center text-cocoa-400">Loading...</div>;
  }

  if (!user) {
    // eslint-disable-next-line no-console
    console.log('❌ [RequireAdmin] no authenticated user — redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // eslint-disable-next-line no-console
  console.log('✓ [RequireAdmin] user authenticated', { id: user.id, email: user.email });

  if (!profile) {
    // eslint-disable-next-line no-console
    console.log('❌ [RequireAdmin] no profile row found for this user — redirecting to /');
    return <Navigate to="/" replace />;
  }

  // eslint-disable-next-line no-console
  console.log('✓ [RequireAdmin] profile loaded', { is_admin: profile.is_admin });

  if (!profile.is_admin) {
    // eslint-disable-next-line no-console
    console.log('❌ [RequireAdmin] profile.is_admin is false — redirecting to /');
    return <Navigate to="/" replace />;
  }

  // eslint-disable-next-line no-console
  console.log('✓ [RequireAdmin] admin access granted');
  return <>{children}</>;
}
