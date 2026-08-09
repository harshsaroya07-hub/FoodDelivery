import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Bike, Phone, MapPin, CheckCircle2, Clock, Star, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { Order } from '../types';

export const LiveOrderTracking: React.FC<{
  onOpenReview: (order: Order) => void;
}> = ({ onOpenReview }) => {
  const { activeTrackingOrder, setActiveTrackingOrder, showToast } = useApp();
  const [orderState, setOrderState] = useState<Order | null>(activeTrackingOrder);

  useEffect(() => {
    setOrderState(activeTrackingOrder);
  }, [activeTrackingOrder]);

  useEffect(() => {
    if (!orderState) return;

    // Polling backend status every 4 seconds
    const interval = setInterval(() => {
      fetch(`/api/orders/${orderState.id}`)
        .then(res => res.json())
        .then(updated => {
          if (updated && updated.id) {
            setOrderState(updated);
          }
        })
        .catch(err => console.error('Tracking poll error:', err));
    }, 4000);

    return () => clearInterval(interval);
  }, [orderState?.id]);

  if (!orderState) return null;

  const steps = [
    { key: 'placed', label: 'Order Confirmed' },
    { key: 'preparing', label: 'Chef Preparing' },
    { key: 'packed', label: 'Food Packed' },
    { key: 'out_for_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered!' }
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'placed': return 0;
      case 'preparing': return 1;
      case 'packed': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex(orderState.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-orange-500 text-white shadow-md">
              <Bike className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-black text-lg tracking-tight">LIVE ORDER TRACKING 🛵</h2>
              <p className="text-xs text-slate-400">Order #{orderState.id}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTrackingOrder(null)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6 text-slate-800 dark:text-slate-100">
          
          {/* Simulated Animated GPS Map Box */}
          <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 p-4 flex flex-col justify-between text-white">
            {/* Map Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
            
            <div className="relative z-10 flex justify-between items-start">
              <span className="bg-emerald-500/90 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-full shadow">
                LIVE GPS FEED ACTIVE
              </span>
              <span className="font-bold text-xs bg-black/60 px-2.5 py-1 rounded-xl">
                ETA: {orderState.etaMinutes || 18} MINS
              </span>
            </div>

            {/* Simulated Driver Icon Moving */}
            <div className="relative z-10 my-auto flex items-center justify-around">
              <div className="text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold mx-auto border border-orange-500/40">
                  🍳
                </div>
                <span className="text-[10px] font-bold block">{orderState.restaurantName}</span>
              </div>

              {/* Animated Progress Line */}
              <div className="flex-1 max-w-[140px] h-1.5 bg-slate-700 rounded-full overflow-hidden mx-2 relative">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-1000"
                  style={{ width: `${(currentIndex + 1) * 20}%` }}
                />
              </div>

              <div className="text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mx-auto border border-emerald-500/40">
                  🏠
                </div>
                <span className="text-[10px] font-bold block">Your Location</span>
              </div>
            </div>

            <div className="relative z-10 text-[11px] text-slate-300 truncate">
              📍 Destination: {orderState.deliveryAddress.street}, {orderState.deliveryAddress.city}
            </div>
          </div>

          {/* Timeline Status */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Order Status Progress:
            </span>
            <div className="space-y-2">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div
                    key={step.key}
                    className={`flex items-center space-x-3 p-3 rounded-2xl border text-xs font-semibold transition ${
                      isCurrent
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-600 dark:text-orange-400 font-bold shadow-sm'
                        : isCompleted
                        ? 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        : 'opacity-40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        isCompleted ? 'bg-orange-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                      }`}
                    >
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span className="flex-1">{step.label}</span>
                    {isCurrent && (
                      <span className="text-[10px] text-orange-500 animate-pulse font-bold">In Progress</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Partner Profile Card */}
          {orderState.deliveryPartner && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={orderState.deliveryPartner.avatar}
                  alt={orderState.deliveryPartner.name}
                  className="w-12 h-12 rounded-2xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                    {orderState.deliveryPartner.name} 🛵
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    EV Bike ({orderState.deliveryPartner.vehicleNumber}) • ★ {orderState.deliveryPartner.rating}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${orderState.deliveryPartner.phone}`}
                onClick={e => {
                  e.preventDefault();
                  showToast(`Calling Delivery Partner (${orderState.deliveryPartner.phone})...`);
                }}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold p-2.5 rounded-2xl shadow transition flex items-center space-x-1 text-xs"
              >
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">Call</span>
              </a>
            </div>
          )}

          {/* Order Item List Summary */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
            <span className="font-bold text-slate-500 uppercase text-[10px] block">Items in this order:</span>
            {orderState.items.map((i, idx) => (
              <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>{i.quantity}x {i.foodItem.name}</span>
                <span className="font-bold">₹{i.totalPrice}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          {orderState.status === 'delivered' ? (
            <button
              onClick={() => {
                onOpenReview(orderState);
                setActiveTrackingOrder(null);
              }}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black py-3 rounded-2xl shadow transition text-xs flex items-center justify-center space-x-2"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Leave Order Review & Earn 50 Points</span>
            </button>
          ) : (
            <button
              onClick={() => {
                showToast('Refreshing order status...');
                fetch(`/api/orders/${orderState.id}`)
                  .then(r => r.json())
                  .then(u => setOrderState(u));
              }}
              className="w-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold py-3 rounded-2xl text-xs transition flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Status</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
