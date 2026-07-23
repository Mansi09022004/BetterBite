import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { listOrders, type Order } from '../../services/orders';
import { OrderCard } from '../../components/account/OrderCard';
import { Reveal } from '../../components/ui/Reveal';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    listOrders(user.id)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="container-page py-14 sm:py-20">
      <Helmet>
        <title>My Orders — BetterBite</title>
      </Helmet>

      <h1 className="font-display text-3xl font-bold text-cocoa-700 sm:text-4xl">My Orders</h1>

      {loading ? (
        <p className="mt-10 text-cocoa-400">Loading your orders...</p>
      ) : orders.length === 0 ? (
        <Reveal className="mt-16 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cocoa-600/[0.06] text-cocoa-400">
            <PackageSearch className="h-9 w-9" />
          </div>
          <h2 className="font-display text-xl font-bold text-cocoa-700">No orders yet</h2>
          <p className="max-w-sm text-sm text-cocoa-500">
            When you place an order, it'll show up here so you can track it anytime.
          </p>
          <Link to="/#shop">
            <button className="btn-primary">Shop Flavors</button>
          </Link>
        </Reveal>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
