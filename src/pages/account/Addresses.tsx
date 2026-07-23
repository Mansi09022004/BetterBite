import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { MapPinPlus, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  addAddress,
  deleteAddress,
  listAddresses,
  setDefaultAddress,
  updateAddress,
  type Address,
  type AddressInput,
} from '../../services/addresses';
import { AddressCard } from '../../components/account/AddressCard';
import { AddressForm } from '../../components/account/AddressForm';
import { Reveal } from '../../components/ui/Reveal';

export default function Addresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const refresh = async () => {
    if (!user) return;
    const data = await listAddresses(user.id);
    setAddresses(data);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async (input: AddressInput) => {
    if (!user) return;
    if (editing) {
      await updateAddress(editing.id, input);
    } else {
      await addAddress(user.id, input);
    }
    setFormOpen(false);
    setEditing(null);
    await refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteAddress(id);
    await refresh();
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    await setDefaultAddress(user.id, id);
    await refresh();
  };

  return (
    <div className="container-page py-14 sm:py-20">
      <Helmet>
        <title>Saved Addresses — BetterBite</title>
      </Helmet>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-cocoa-700 sm:text-4xl">Saved Addresses</h1>
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4" /> Add Address
        </button>
      </div>

      {loading ? (
        <p className="mt-10 text-cocoa-400">Loading your addresses...</p>
      ) : addresses.length === 0 ? (
        <Reveal className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cocoa-600/[0.06] text-cocoa-400">
            <MapPinPlus className="h-9 w-9" />
          </div>
          <h2 className="font-display text-xl font-bold text-cocoa-700">No addresses saved</h2>
          <p className="max-w-sm text-sm text-cocoa-500">
            Add an address to make checkout faster next time.
          </p>
        </Reveal>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => {
                setEditing(address);
                setFormOpen(true);
              }}
              onDelete={() => handleDelete(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {formOpen && (
          <AddressForm
            initial={editing}
            onSubmit={handleSubmit}
            onClose={() => {
              setFormOpen(false);
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
