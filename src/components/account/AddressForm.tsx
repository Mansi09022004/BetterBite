import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, X } from 'lucide-react';
import type { Address, AddressInput } from '../../services/addresses';

interface AddressFormProps {
  initial?: Address | null;
  onSubmit: (input: AddressInput) => Promise<void>;
  onClose: () => void;
}

export function AddressForm({ initial, onSubmit, onClose }: AddressFormProps) {
  const [form, setForm] = useState<AddressInput>({
    label: initial?.label ?? '',
    full_name: initial?.full_name ?? '',
    line1: initial?.line1 ?? '',
    line2: initial?.line2 ?? '',
    city: initial?.city ?? '',
    state: initial?.state ?? '',
    zip: initial?.zip ?? '',
  });
  const [submitting, setSubmitting] = useState(false);

  const update = (field: keyof AddressInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(form);
    setSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-cocoa-800/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-3xl bg-cream-100 p-6 shadow-lift sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-cocoa-700">
            {initial ? 'Edit Address' : 'Add Address'}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-5 w-5 text-cocoa-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            placeholder="Label (e.g. Home, Work)"
            value={form.label ?? ''}
            onChange={update('label')}
            className="input-field sm:col-span-2"
          />
          <input
            required
            placeholder="Full name"
            value={form.full_name}
            onChange={update('full_name')}
            className="input-field sm:col-span-2"
          />
          <input
            required
            placeholder="Address line 1"
            value={form.line1}
            onChange={update('line1')}
            className="input-field sm:col-span-2"
          />
          <input
            placeholder="Address line 2 (optional)"
            value={form.line2 ?? ''}
            onChange={update('line2')}
            className="input-field sm:col-span-2"
          />
          <input required placeholder="City" value={form.city} onChange={update('city')} className="input-field" />
          <input placeholder="State" value={form.state ?? ''} onChange={update('state')} className="input-field" />
          <input
            required
            placeholder="ZIP / Postal code"
            value={form.zip}
            onChange={update('zip')}
            className="input-field sm:col-span-2"
          />

          <div className="mt-2 flex gap-3 sm:col-span-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Address'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
