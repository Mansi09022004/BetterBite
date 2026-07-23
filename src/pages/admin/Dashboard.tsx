import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ShoppingBag, IndianRupee, Users, CalendarClock, Clock } from 'lucide-react';
import { StatCard } from '../../components/admin/StatCard';
import { getDashboardStats, type DashboardStats } from '../../services/admin/stats';

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Helmet>
        <title>Dashboard — BetterBite Admin</title>
      </Helmet>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-cocoa-700 dark:text-slate-100">
        Dashboard
      </h1>
      <p className="mt-2 text-[15px] text-cocoa-400 dark:text-slate-400">Overview of your store, right now.</p>

      {loading ? (
        <p className="mt-10 text-cocoa-400 dark:text-slate-400">Loading...</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard label="Total Orders" value={stats?.total_orders ?? 0} icon={ShoppingBag} delay={0} />
          <StatCard
            label="Total Revenue"
            value={Math.round(stats?.total_revenue ?? 0)}
            format={(n) => `₹${n.toLocaleString('en-IN')}`}
            icon={IndianRupee}
            delay={0.05}
          />
          <StatCard label="Total Customers" value={stats?.total_customers ?? 0} icon={Users} delay={0.1} />
          <StatCard label="Today's Orders" value={stats?.todays_orders ?? 0} icon={CalendarClock} delay={0.15} />
          <StatCard label="Pending Orders" value={stats?.pending_orders ?? 0} icon={Clock} delay={0.2} />
        </div>
      )}
    </div>
  );
}
