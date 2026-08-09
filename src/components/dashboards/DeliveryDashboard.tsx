import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bike, MapPin, DollarSign, Leaf, Phone, CheckCircle, Navigation, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';

export const DeliveryDashboard: React.FC = () => {
  const { showToast } = useApp();
  const [isOnline, setIsOnline] = useState(true);
  const [assignedOrders, setAssignedOrders] = useState<Order[]>([]);

  const fetchDeliveryOrders = () => {
    fetch('/api/delivery/orders')
      .then(res => res.json())
      .then(data => setAssignedOrders(data))
      .catch(err => console.error('Delivery orders fetch error:', err));
  };

  useEffect(() => {
    fetchDeliveryOrders();
    const interval = setInterval(fetchDeliveryOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const completeDelivery = async (orderId: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' })
      });
      showToast(`🎉 Delivery #${orderId} Completed! Earned ₹75`);
      fetchDeliveryOrders();
    } catch (err) {
      console.error('Complete delivery error:', err);
    }
  };

  const markOutForDelivery = async (orderId: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'out_for_delivery' })
      });
      showToast(`Order #${orderId} marked OUT FOR DELIVERY`);
      fetchDeliveryOrders();
    } catch (err) {
      console.error('Mark out for delivery error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Driver Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-emerald-500">
            <img
              src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=300&auto=format&fit=crop&q=80"
              alt="Ramesh Kumar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1">
              <Bike className="w-3 h-3" />
              <span>DELIVERY PARTNER PORTAL</span>
            </div>
            <h1 className="text-2xl font-black">Ramesh Kumar (EV Rider)</h1>
            <p className="text-xs text-slate-400">Vehicle: UP16 EV 9081 • Rating: ★ 4.9</p>
          </div>
        </div>

        {/* Online Toggle & Earnings Stats */}
        <div className="flex items-center space-x-4 text-xs">
          <button
            onClick={() => {
              setIsOnline(!isOnline);
              showToast(isOnline ? 'You are now OFFLINE' : 'You are ONLINE & Ready for Trips!');
            }}
            className={`px-4 py-2.5 rounded-2xl font-extrabold transition shadow ${
              isOnline ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isOnline ? '🟢 ONLINE' : '🔴 OFFLINE'}
          </button>

          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center min-w-[100px]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Today Earnings</span>
            <span className="text-lg font-black text-amber-400">₹850</span>
          </div>
        </div>
      </div>

      {/* Orders List for Delivery */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">
          Active Trip Deliveries ({assignedOrders.length})
        </h2>

        {assignedOrders.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-2">
            <Bike className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-sm text-slate-700 dark:text-slate-300">
              No active delivery requests assigned right now.
            </p>
            <p className="text-xs text-slate-400">
              Stay online in Noida Sector 62 hotspot to receive upcoming orders!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignedOrders.map(o => (
              <div
                key={o.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-3">
                  <div>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      Trip Order #{o.id}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Restaurant: {o.restaurantName}
                    </span>
                  </div>
                  <span className="bg-emerald-500 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full">
                    {o.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1">
                    <div className="flex items-center space-x-1 font-bold text-slate-700 dark:text-slate-200">
                      <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                      <span>Deliver to: {o.deliveryAddress.street}, {o.deliveryAddress.city}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 pl-5">
                      Method: {o.deliveryMethod.toUpperCase()} • Payout: <strong className="text-emerald-500">₹75</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-1">
                  <button
                    onClick={() => markOutForDelivery(o.id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-2xl transition text-xs flex items-center justify-center space-x-1"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Out for Delivery</span>
                  </button>

                  <button
                    onClick={() => completeDelivery(o.id)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-2xl transition text-xs flex items-center justify-center space-x-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Mark Delivered</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
