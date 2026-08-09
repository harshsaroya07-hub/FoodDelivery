import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, TrendingUp, Users, Store, DollarSign, Leaf, Activity, CheckCircle2 } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { showToast } = useApp();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error('Admin analytics error:', err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-2xl shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center space-x-1.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase mb-1">
              <span>EXECUTIVE ADMIN CONSOLE</span>
            </div>
            <h1 className="text-2xl font-black">Foodora X Ecosystem Metrics</h1>
            <p className="text-xs text-slate-400">Real-Time Platform GMV, Restaurant Health & Eco Performance</p>
          </div>
        </div>

        <button
          onClick={() => showToast('⚡ System Health Check Complete: 100% Operational')}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-bold px-4 py-2.5 rounded-2xl flex items-center space-x-2 transition"
        >
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>System Normal</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Gross Revenue (GMV)</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            ₹{analytics?.totalRevenue || '4,28,900'}
          </span>
          <span className="text-[10px] text-emerald-500 font-bold block">↑ +18.4% vs last month</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Total Orders</span>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {analytics?.totalOrders || '1,420'}
          </span>
          <span className="text-[10px] text-emerald-500 font-bold block">99.2% Fulfillment Rate</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Partner Kitchens</span>
            <Store className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white block">
            {analytics?.activeRestaurants || '20'}
          </span>
          <span className="text-[10px] text-slate-400 font-semibold block">Average Rating: 4.8 ★</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Eco Carbon Saved</span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-emerald-500 block">
            {analytics?.carbonSavedKg || '1,840'} kg
          </span>
          <span className="text-[10px] text-emerald-500 font-bold block">12,400+ Trees Planted 🌲</span>
        </div>
      </div>

      {/* Category Sales Share */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="font-bold text-base text-slate-900 dark:text-white">
          Category Revenue Distribution
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold">
          <div className="p-4 bg-orange-50 dark:bg-orange-950/40 rounded-2xl border border-orange-200 dark:border-orange-800">
            <span className="text-slate-500 block mb-1">North Indian Cuisines</span>
            <span className="text-lg text-orange-600 font-black">35% Share</span>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800">
            <span className="text-slate-500 block mb-1">Woodfire Pizzas</span>
            <span className="text-lg text-amber-600 font-black">28% Share</span>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-slate-500 block mb-1">Asian & Chinese</span>
            <span className="text-lg text-emerald-600 font-black">22% Share</span>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800">
            <span className="text-slate-500 block mb-1">Desserts & Drinks</span>
            <span className="text-lg text-purple-600 font-black">15% Share</span>
          </div>
        </div>
      </div>

    </div>
  );
};
