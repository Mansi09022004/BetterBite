import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Users,
  Ticket,
  Cookie,
  Settings,
  Moon,
  Sun,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/coupons', label: 'Coupons', icon: Ticket },
  { to: '/admin/products', label: 'Products', icon: Cookie },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

const THEME_KEY = 'betterbite-admin-theme';

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname } = useLocation();

  return (
    <>
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cocoa-600 font-display text-sm font-extrabold text-gold-500 shadow-sm">
          B
        </div>
        <div className="leading-tight">
          <p className="font-display text-[15px] font-bold tracking-tight text-cocoa-700 dark:text-slate-100">
            BetterBite
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-cocoa-400 dark:text-slate-500">
            Admin
          </p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.end ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={`relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'text-cocoa-700 dark:text-cream-50'
                  : 'text-cocoa-400 hover:text-cocoa-600 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="admin-nav-active"
                  className="absolute inset-0 rounded-xl bg-gold-100 dark:bg-white/10"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
              <item.icon className="relative h-[18px] w-[18px] shrink-0" strokeWidth={2} />
              <span className="relative">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}

export function AdminLayout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem(THEME_KEY) as 'light' | 'dark') || 'light'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
    // Leaving /admin must never leave dark mode applied to customer pages.
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [theme]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex min-h-screen bg-cream-100 dark:bg-slate-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-cocoa-600/[0.07] bg-white/60 dark:border-white/10 dark:bg-slate-900/60 lg:flex">
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-cocoa-800/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="flex h-full w-64 flex-col bg-white dark:bg-slate-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-3 pt-3">
                <span />
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="p-2">
                  <X className="h-5 w-5 text-cocoa-600 dark:text-slate-200" />
                </button>
              </div>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-cocoa-600/[0.07] bg-white/70 px-4 py-5 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/70 sm:px-9">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="p-1 text-cocoa-600 dark:text-slate-200 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden leading-tight lg:block">
            <p className="text-sm text-cocoa-400 dark:text-slate-400">
              Welcome back <span aria-hidden>👋</span>
            </p>
            <p className="font-display text-base font-bold text-cocoa-700 dark:text-slate-100">{firstName}</p>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <span className="hidden text-sm text-cocoa-400 dark:text-slate-500 sm:block">{today}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-full text-cocoa-500 transition-colors hover:bg-cocoa-600/[0.07] dark:text-slate-300 dark:hover:bg-white/10"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 rounded-full border border-cocoa-600/10 px-4 py-2 text-xs font-semibold text-cocoa-600 transition-colors hover:bg-cocoa-600/[0.05] dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign Out
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 px-4 py-9 sm:px-9 sm:py-12">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
