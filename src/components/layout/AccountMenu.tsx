import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LogIn, LogOut, MapPin, Package, Settings, User, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AccountMenu() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    navigate('/');
  };

  const firstName = profile?.full_name?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'there';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Account"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-cocoa-600/[0.06] transition-colors hover:bg-cocoa-600/10"
      >
        <User className="h-5 w-5 text-cocoa-700" strokeWidth={2} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-12 z-50 w-64 rounded-2xl bg-cream-100 p-2 shadow-lift ring-1 ring-cocoa-600/[0.08]"
          >
            {user ? (
              <>
                <div className="px-3 py-2.5 text-sm font-bold text-cocoa-700">Hi, {firstName}</div>
                <div className="mb-1 h-px bg-cocoa-600/10" />
                <Link
                  to="/account/orders"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-cocoa-600 hover:bg-cocoa-600/[0.06]"
                >
                  <Package className="h-4 w-4" /> My Orders
                </Link>
                <Link
                  to="/account/addresses"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-cocoa-600 hover:bg-cocoa-600/[0.06]"
                >
                  <MapPin className="h-4 w-4" /> Saved Addresses
                </Link>
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-cocoa-600 hover:bg-cocoa-600/[0.06]"
                >
                  <Settings className="h-4 w-4" /> Account Settings
                </Link>
                <div className="my-1 h-px bg-cocoa-600/10" />
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-berry hover:bg-berry/10"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-cocoa-600 hover:bg-cocoa-600/[0.06]"
                >
                  <LogIn className="h-4 w-4" /> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-cocoa-600 hover:bg-cocoa-600/[0.06]"
                >
                  <UserPlus className="h-4 w-4" /> Create Account
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
