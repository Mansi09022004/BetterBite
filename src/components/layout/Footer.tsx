import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-cocoa-700 pt-16 text-cream-200">
      <div className="container-page grid grid-cols-2 gap-10 pb-12 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold text-cream-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-sm text-cocoa-800">
              B
            </span>
            BetterBite
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/70">
            Mini protein bites, 50 calories each. Real dessert flavor, real protein, zero added sugar.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-100/10 transition-colors hover:bg-gold-500 hover:text-cocoa-800"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-cream-100">Shop</h4>
          <ul className="space-y-2.5 text-sm text-cream-200/70">
            <li><a href="/#shop" className="hover:text-gold-500">All Flavors</a></li>
            <li><Link to="/subscribe" className="hover:text-gold-500">Bite Box Subscription</Link></li>
            <li><a href="/#shop" className="hover:text-gold-500">Bundles</a></li>
            <li><Link to="/cart" className="hover:text-gold-500">Your Cart</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-cream-100">Company</h4>
          <ul className="space-y-2.5 text-sm text-cream-200/70">
            <li><a href="/#story" className="hover:text-gold-500">Our Story</a></li>
            <li><a href="/#sustainability" className="hover:text-gold-500">Sustainability</a></li>
            <li><a href="/#faq" className="hover:text-gold-500">FAQ</a></li>
            <li><a href="#" className="hover:text-gold-500">Careers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-cream-100">Support</h4>
          <ul className="space-y-2.5 text-sm text-cream-200/70">
            <li><a href="#" className="hover:text-gold-500">Contact Us</a></li>
            <li><a href="#" className="hover:text-gold-500">Shipping & Returns</a></li>
            <li><a href="#" className="hover:text-gold-500">Track Order</a></li>
            <li><a href="#" className="hover:text-gold-500">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream-100/10 py-6">
        <div className="container-page flex flex-col items-center justify-between gap-3 text-xs text-cream-200/50 sm:flex-row">
          <span>© {new Date().getFullYear()} BetterBite. All rights reserved.</span>
          <span>Made with real cocoa & real protein.</span>
        </div>
      </div>
    </footer>
  );
}
