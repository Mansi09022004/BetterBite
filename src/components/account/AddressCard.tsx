import { MapPin, Pencil, Star, Trash2 } from 'lucide-react';
import type { Address } from '../../services/addresses';
import { Badge } from '../ui/Badge';

interface AddressCardProps {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
}

export function AddressCard({ address, onEdit, onDelete, onSetDefault }: AddressCardProps) {
  return (
    <div className="rounded-3xl bg-white/70 p-5 shadow-soft ring-1 ring-cocoa-600/[0.05] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cocoa-600/[0.08] text-cocoa-600">
            <MapPin className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display font-bold text-cocoa-700">{address.label || 'Address'}</p>
            <p className="text-xs text-cocoa-400">{address.full_name}</p>
          </div>
        </div>
        {address.is_default && <Badge tone="gold">Default</Badge>}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-cocoa-500">
        {address.line1}
        {address.line2 ? `, ${address.line2}` : ''}, {address.city}
        {address.state ? `, ${address.state}` : ''} {address.zip}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-cocoa-600/10 pt-4 text-sm">
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-full bg-cocoa-600/[0.06] px-3 py-1.5 font-semibold text-cocoa-600 hover:bg-cocoa-600/10"
        >
          <Pencil className="h-3.5 w-3.5" /> Edit
        </button>
        {!address.is_default && (
          <button
            onClick={onSetDefault}
            className="flex items-center gap-1.5 rounded-full bg-cocoa-600/[0.06] px-3 py-1.5 font-semibold text-cocoa-600 hover:bg-cocoa-600/10"
          >
            <Star className="h-3.5 w-3.5" /> Set as Default
          </button>
        )}
        <button
          onClick={onDelete}
          className="flex items-center gap-1.5 rounded-full bg-berry/10 px-3 py-1.5 font-semibold text-berry hover:bg-berry/20"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}
