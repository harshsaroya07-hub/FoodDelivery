import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, CreditCard, Wallet, Truck, Check, Loader2, ArrowRight, X } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    clearCart,
    currentLocation,
    user,
    deliveryMethod,
    appliedCoupon,
    setActiveTrackingOrder,
    showToast
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('user@upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  if (!isCheckoutOpen || cart.length === 0) return null;

  const itemTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  let deliveryFee = deliveryMethod === 'express' ? 45 : deliveryMethod === 'eco' ? 20 : 35;
  let platformFee = 10;
  let taxes = Math.round(itemTotal * 0.05);
  let discount = appliedCoupon ? appliedCoupon.discount : 0;
  let ecoDiscount = deliveryMethod === 'eco' ? 15 : 0;
  const grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee + taxes - discount - ecoDiscount);

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const firstFood = cart[0].foodItem;
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: firstFood.restaurantId,
          restaurantName: firstFood.restaurantName,
          items: cart,
          totalAmount: grandTotal,
          deliveryAddress: currentLocation,
          deliveryMethod,
          paymentMethod
        })
      });
      const order = await res.json();
      setIsPlacingOrder(false);
      clearCart();
      setIsCheckoutOpen(false);
      setActiveTrackingOrder(order);
      showToast(`🎉 Order #${order.id} Placed Successfully! Live tracking started.`);
    } catch (err) {
      console.error('Place order error:', err);
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="font-black text-xl tracking-tight">Express Checkout ⚡</h2>
            <p className="text-xs text-slate-400">Review address and payment to confirm</p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-6 text-slate-800 dark:text-slate-100">
          
          {/* Step 1: Delivery Address */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              1. Delivery Location
            </span>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  {currentLocation.type} ({user?.name})
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentLocation.street}, {currentLocation.city}, {currentLocation.state} - {currentLocation.zipCode}
                </p>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Option */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              2. Choose Payment Mode
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              {[
                { id: 'upi', label: 'Google Pay / PhonePe', icon: CreditCard },
                { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                { id: 'wallet', label: 'Foodora Wallet (₹500)', icon: Wallet },
                { id: 'cod', label: 'Cash on Delivery', icon: Truck }
              ].map(p => {
                const Icon = p.icon;
                const isSel = paymentMethod === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id as any)}
                    className={`p-3 rounded-2xl border text-left transition flex items-center space-x-2 ${
                      isSel
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500 text-orange-600 dark:text-orange-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{p.label}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'upi' && (
              <div className="pt-1">
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  placeholder="Enter UPI ID (e.g. name@okhdfcbank)"
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100"
                />
              </div>
            )}
          </div>

          {/* Step 3: Order Summary Box */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
            <div className="flex justify-between font-bold">
              <span>Items ({cart.length})</span>
              <span>₹{itemTotal}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery ({deliveryMethod})</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>To Pay</span>
              <span className="text-orange-600 dark:text-orange-400">₹{grandTotal}</span>
            </div>
          </div>

        </div>

        {/* Footer Place Order Button */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handlePlaceOrder}
            disabled={isPlacingOrder}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3.5 px-5 rounded-2xl shadow-xl shadow-orange-500/25 transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {isPlacingOrder ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Securing Order Payment...</span>
              </>
            ) : (
              <>
                <span>Pay ₹{grandTotal} & Place Order</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
