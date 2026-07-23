import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { AccountMenu } from './AccountMenu';

const navLinks = [
  { label: 'Shop', href: '/#shop' },
  { label: 'Our Story', href: '/#story' },
  { label: 'Subscribe', href: '/subscribe' },
  { label: 'FAQ', href: '/#faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-cream-100/90 shadow-soft backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className={`container-page flex items-center justify-between transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-cocoa-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cocoa-600 text-sm text-gold-500">
            B
          </span>
          BetterBite
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-semibold text-cocoa-600 transition-colors hover:text-gold-700"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/subscribe?plan=starter" className="hidden lg:inline-flex">
            <button className="btn-secondary !py-2.5 !px-5 text-sm">Try Starter Pack</button>
          </NavLink>
          <AccountMenu />
          <button
            onClick={openDrawer}
            aria-label="Open cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-cocoa-600/[0.06] transition-colors hover:bg-cocoa-600/10"
          >
            <ShoppingBag className="h-5 w-5 text-cocoa-700" strokeWidth={2} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-cocoa-800">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-cocoa-600/[0.06] md:hidden"
          >
            <Menu className="h-5 w-5 text-cocoa-700" />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-cocoa-800/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
              className="ml-auto flex h-full w-[80%] max-w-xs flex-col gap-6 bg-cream-100 p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-lg font-bold text-cocoa-700">Menu</span>
                <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6 text-cocoa-700" />
                </button>
              </div>
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-semibold text-cocoa-700"
                >
                  {link.label}
                </a>
              ))}
              <NavLink to="/subscribe?plan=starter" onClick={() => setMenuOpen(false)}>
                <button className="btn-primary w-full">Try Starter Pack</button>
              </NavLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
