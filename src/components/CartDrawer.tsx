import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, Plus, Minus, Tag, Leaf, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    deliveryMethod,
    setDeliveryMethod,
    plantTreeOptIn,
    setIsCheckoutOpen
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const itemTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  let deliveryFee = deliveryMethod === 'express' ? 45 : deliveryMethod === 'eco' ? 20 : 35;
  let platformFee = cart.length > 0 ? 10 : 0;
  let taxes = Math.round(itemTotal * 0.05);

  let discount = appliedCoupon ? appliedCoupon.discount : 0;
  let ecoDiscount = deliveryMethod === 'eco' ? 15 : 0;

  const grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee + taxes - discount - ecoDiscount);

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = await applyCouponCode(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0 flex justify-end">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-200 dark:border-slate-800">
          
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg">Your Smart Cart 🛒</span>
              {cart.length > 0 && (
                <span className="bg-orange-500 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                  {cart.reduce((s, i) => s + i.quantity, 0)} Items
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-4 overflow-y-auto flex-1 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <span className="text-4xl">🛒</span>
                <p className="font-extrabold text-slate-800 dark:text-slate-100 text-base">
                  Your cart is empty
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Explore top restaurants or ask AI Food Finder to recommend something delicious!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div
                    key={item.cartItemId}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex space-x-2.5">
                        <img
                          src={item.foodItem.image}
                          alt={item.foodItem.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                            {item.foodItem.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 block">
                            ₹{item.unitPrice} per item
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-slate-400 hover:text-red-500 transition p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Customization Details */}
                    {item.selectedCustomizations.length > 0 && (
                      <div className="text-[10px] bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 space-y-0.5">
                        {item.selectedCustomizations.map((c, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>• {c.optionName}</span>
                            {c.price > 0 && <span>+₹{c.price}</span>}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Quantity & Item Total */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, -1)}
                          className="p-0.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-xs w-4 text-center text-slate-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, 1)}
                          className="p-0.5 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        ₹{item.totalPrice}
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                {/* Delivery Method Choice */}
                <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Choose Delivery Method:
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                    <button
                      onClick={() => setDeliveryMethod('express')}
                      className={`p-2 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                        deliveryMethod === 'express'
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Zap className="w-4 h-4 mb-0.5" />
                      <span className="text-[11px]">Express</span>
                      <span className="text-[9px] opacity-80">20-25m • ₹45</span>
                    </button>

                    <button
                      onClick={() => setDeliveryMethod('standard')}
                      className={`p-2 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                        deliveryMethod === 'standard'
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span>🚲 Standard</span>
                      <span className="text-[9px] opacity-80">30-40m • ₹35</span>
                    </button>

                    <button
                      onClick={() => setDeliveryMethod('eco')}
                      className={`p-2 rounded-2xl border text-center transition flex flex-col items-center justify-center ${
                        deliveryMethod === 'eco'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Leaf className="w-4 h-4 mb-0.5" />
                      <span className="text-[11px]">Eco Group</span>
                      <span className="text-[9px] opacity-80">-₹15 Off Fee</span>
                    </button>
                  </div>
                </div>

                {/* Coupon Input */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Apply Promo Coupon:
                  </span>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center space-x-1.5 font-bold">
                        <Tag className="w-4 h-4 text-emerald-500" />
                        <span>{appliedCoupon.code} (-₹{appliedCoupon.discount})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-600 font-bold text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={e => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Try WELCOME50 or FLAT100"
                        className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 uppercase"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold px-4 py-2 rounded-xl text-xs transition"
                      >
                        Apply
                      </button>
                    </div>
                  )}

                  {couponError && (
                    <span className="text-[10px] font-bold text-red-500 block">
                      {couponError}
                    </span>
                  )}
                </div>

                {/* Bill Breakdown */}
                <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between">
                    <span>Item Total</span>
                    <span>₹{itemTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee ({deliveryMethod})</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST Taxes (5%)</span>
                    <span>₹{taxes}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Coupon Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  {ecoDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Eco Group Bonus</span>
                      <span>-₹{ecoDiscount}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-black text-base text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span>Grand Total</span>
                    <span>₹{grandTotal}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black py-3.5 px-5 rounded-2xl shadow-xl shadow-orange-500/25 transition flex items-center justify-between text-sm"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center space-x-2">
                  <span>₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
