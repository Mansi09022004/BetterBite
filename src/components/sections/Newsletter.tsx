import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Reveal } from '../ui/Reveal';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitted(true);
  };

  return (
    <section className="container-page py-14 sm:py-28">
      <Reveal className="mx-auto max-w-2xl rounded-3xl bg-cocoa-600 px-5 py-10 text-center sm:px-12 sm:py-14">
        <h2 className="font-display text-2xl font-bold text-cream-100 sm:text-3xl">
          Get 15% off your first box
        </h2>
        <p className="mt-3 text-cream-200/80">
          Join the list for new flavor drops, restock alerts, and subscriber-only deals.
        </p>

        {submitted ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 font-semibold text-gold-500"
          >
            You're in! Check your inbox for your code.
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full rounded-full border-2 border-cream-100/20 bg-cream-100/10 px-5 py-3 text-sm text-cream-100 placeholder:text-cream-200/50 focus:border-gold-500 focus:outline-none"
            />
            <button type="submit" className="btn-gold shrink-0">
              Subscribe <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </Reveal>
    </section>
  );
}
