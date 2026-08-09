import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Search,
  ShoppingBag,
  Sparkles,
  Users,
  Award,
  Leaf,
  ChevronDown,
  User,
  Heart,
  Clock,
  LogOut
} from 'lucide-react';

export const Navbar: React.FC<{
  onSearchChange: (q: string) => void;
  searchQuery: string;
}> = ({ onSearchChange, searchQuery }) => {
  const {
    currentLocation,
    setCurrentLocation,
    cart,
    setIsCartOpen,
    setIsAIFinderOpen,
    setIsGroupOrderModalOpen,
    setIsFoodDNAModalOpen,
    user,
    favorites,
    showToast
  } = useApp();

  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-10 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        
        {/* Logo & Location */}
        <div className="flex items-center space-x-6">
          <a href="#" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-yellow-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              X
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">
                FOODORA X
              </span>
              <span className="block text-[9px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 -mt-1">
                More than food
              </span>
            </div>
          </a>

          {/* Location Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 px-3 py-2 rounded-xl transition"
            >
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <div className="text-left max-w-[160px] truncate">
                <span className="font-bold block text-[10px] text-slate-400 uppercase tracking-wider">
                  {currentLocation.type} Delivery
                </span>
                <span className="font-medium truncate block text-xs">
                  {currentLocation.street}, {currentLocation.city}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Location Dropdown */}
            {isLocationMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-3 z-50">
                <div className="text-xs font-bold text-slate-400 uppercase px-2 mb-2">
                  Select Delivery Address
                </div>
                {user?.savedAddresses.map(addr => (
                  <button
                    key={addr.id}
                    onClick={() => {
                      setCurrentLocation(addr);
                      setIsLocationMenuOpen(false);
                      showToast(`Delivering to ${addr.type} (${addr.street})`);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs mb-1 transition flex items-start space-x-2 ${
                      currentLocation.id === addr.id
                        ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-bold">{addr.type}</span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {addr.street}, {addr.city}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden sm:block relative">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Search dishes, restaurants or cuisines..."
              className="w-full pl-10 pr-24 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition border border-transparent focus:border-orange-500/30"
            />
            <button
              onClick={() => setIsAIFinderOpen(true)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium text-[10px] px-2.5 py-1 rounded-xl shadow-sm hover:opacity-90 transition flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-yellow-200" />
              <span>AI Craving</span>
            </button>
          </div>
        </div>

        {/* Actions & Utilities */}
        <div className="flex items-center space-x-3">
          {/* Rewards Badge */}
          <button
            onClick={() => setIsFoodDNAModalOpen(true)}
            className="hidden lg:flex items-center space-x-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-amber-100 transition"
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>{user?.foodoraPoints || 350} Pts</span>
          </button>

          {/* Group Order Button */}
          <button
            onClick={() => setIsGroupOrderModalOpen(true)}
            className="hidden sm:flex items-center space-x-1 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl text-xs font-medium transition"
            title="Order Together with friends"
          >
            <Users className="w-4 h-4 text-indigo-500" />
            <span className="hidden xl:inline">Order Together</span>
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative bg-gradient-to-r from-orange-500 to-amber-500 text-white p-2.5 sm:px-4 sm:py-2 rounded-2xl shadow-md shadow-orange-500/20 hover:shadow-orange-500/30 font-semibold text-xs transition flex items-center space-x-2 group"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-white text-orange-600 font-extrabold text-[11px] px-1.5 py-0.5 rounded-full shadow">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="w-9 h-9 rounded-2xl overflow-hidden border-2 border-orange-500/40 hover:border-orange-500 transition shadow-sm"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 z-50 text-xs">
                <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-800 dark:text-slate-100 block text-sm">
                    {user?.name}
                  </span>
                  <span className="text-slate-400 text-[11px]">{user?.email}</span>
                  <div className="mt-2 inline-flex items-center space-x-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-2 py-0.5 rounded-full text-[10px]">
                    <Sparkles className="w-3 h-3" />
                    <span>{user?.rewardTier}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsFoodDNAModalOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center space-x-2 text-slate-700 dark:text-slate-200"
                  >
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span>My Food DNA 🧬</span>
                  </button>

                  <button
                    onClick={() => {
                      showToast(`Favorites (${favorites.length} saved items)`);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl flex items-center space-x-2 text-slate-700 dark:text-slate-200"
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                    <span>Saved Favorites ({favorites.length})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
