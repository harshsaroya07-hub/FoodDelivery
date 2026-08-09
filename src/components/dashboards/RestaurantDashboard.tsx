import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, CheckCircle, Clock, DollarSign, ToggleLeft, ToggleRight, AlertCircle, ShoppingBag, Check } from 'lucide-react';
import { Order, FoodItem } from '../../types';

export const RestaurantDashboard: React.FC = () => {
  const { showToast } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<FoodItem[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'menu'>('orders');

  const fetchRestaurantData = () => {
    fetch('/api/restaurant/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Restaurant orders fetch error:', err));

    fetch('/api/foods')
      .then(res => res.json())
      .then(data => setMenuItems(data.filter((f: FoodItem) => f.restaurantId === 'rest-1')))
      .catch(err => console.error('Menu items fetch error:', err));
  };

  useEffect(() => {
    fetchRestaurantData();
    const interval = setInterval(fetchRestaurantData, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      showToast(`Order #${orderId} status updated to "${status.toUpperCase()}"`);
      fetchRestaurantData();
    } catch (err) {
      console.error('Update order status error:', err);
    }
  };

  const toggleItemAvailability = (itemId: string, current: boolean) => {
    fetch(`/api/restaurant/foods/${itemId}/stock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAvailable: !current })
    })
      .then(res => res.json())
      .then(() => {
        showToast('Stock availability updated');
        fetchRestaurantData();
      });
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-orange-500 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=300&auto=format&fit=crop&q=80"
              alt="Restaurant"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1">
              <Store className="w-3 h-3" />
              <span>RESTAURANT PORTAL</span>
            </div>
            <h1 className="text-2xl font-black">Punjab Grill & Tandoor Dashboard</h1>
            <p className="text-xs text-slate-400">Manage Kitchen Orders, Stock Availability & Revenue</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex space-x-4 text-xs">
          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center min-w-[100px]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Orders Today</span>
            <span className="text-lg font-black text-white">{orders.length}</span>
          </div>

          <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 text-center min-w-[110px]">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Gross Sales</span>
            <span className="text-lg font-black text-amber-400">₹{totalRevenue}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 border-b-2 transition ${
            activeTab === 'orders'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Live Kitchen Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`pb-3 px-2 border-b-2 transition ${
            activeTab === 'menu'
              ? 'border-orange-500 text-orange-600 dark:text-orange-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Menu & Stock Controls ({menuItems.length})
        </button>
      </div>

      {/* Tab 1: Live Orders */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(o => (
            <div
              key={o.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4"
            >
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-3">
                <div>
                  <span className="font-black text-sm text-slate-900 dark:text-white">
                    Order #{o.id}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Method: {o.deliveryMethod.toUpperCase()}
                  </span>
                </div>
                <span className="bg-orange-500 text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full">
                  {o.status}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2 text-xs">
                {o.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span className="font-bold">{i.quantity}x {i.foodItem.name}</span>
                    <span>₹{i.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs font-black pt-2 border-t border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white">
                <span>Order Total</span>
                <span className="text-orange-600 dark:text-orange-400">₹{o.totalAmount}</span>
              </div>

              {/* Status Action Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2">
                <button
                  onClick={() => updateOrderStatus(o.id, 'preparing')}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-orange-500 hover:text-white text-slate-800 dark:text-slate-200 py-2 rounded-xl transition text-[11px]"
                >
                  🍳 Preparing
                </button>
                <button
                  onClick={() => updateOrderStatus(o.id, 'packed')}
                  className="bg-slate-100 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white text-slate-800 dark:text-slate-200 py-2 rounded-xl transition text-[11px]"
                >
                  📦 Food Packed
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Stock Controls */}
      {activeTab === 'menu' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{item.name}</h4>
                  <span className="text-xs font-extrabold text-orange-500">₹{item.price}</span>
                </div>
              </div>

              <button
                onClick={() => toggleItemAvailability(item.id, item.isAvailable)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  item.isAvailable
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                }`}
              >
                <span>{item.isAvailable ? 'In Stock' : 'Out of Stock'}</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
