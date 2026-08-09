import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ShowcaseBar } from './components/ShowcaseBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategorySection } from './components/CategorySection';
import { MoodFoodFinder } from './components/MoodFoodFinder';
import { TrendingSection } from './components/TrendingSection';
import { TopRestaurants } from './components/TopRestaurants';
import { EcoDeliveryBadge } from './components/EcoDeliveryBadge';
import { Footer } from './components/Footer';

import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { LiveOrderTracking } from './components/LiveOrderTracking';
import { AIFoodFinder } from './components/AIFoodFinder';
import { FoodCustomizationModal } from './components/FoodCustomizationModal';
import { FoodComparisonModal } from './components/FoodComparisonModal';
import { GroupOrderModal } from './components/GroupOrderModal';
import { FoodDNAModal } from './components/FoodDNAModal';
import { PresentationGuide } from './components/PresentationGuide';
import { RestaurantDetailModal } from './components/RestaurantDetailModal';
import { ReviewsModal } from './components/ReviewsModal';

import { RestaurantDashboard } from './components/dashboards/RestaurantDashboard';
import { DeliveryDashboard } from './components/dashboards/DeliveryDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

import { Restaurant, FoodItem, Order } from './types';

const MainAppContent: React.FC = () => {
  const { role, toastMessage, refreshTrigger } = useApp();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedRestaurantForDetail, setSelectedRestaurantForDetail] = useState<Restaurant | null>(null);
  const [orderToReview, setOrderToReview] = useState<Order | null>(null);

  useEffect(() => {
    fetch('/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error('Fetch restaurants error:', err));

    fetch('/api/foods')
      .then(res => res.json())
      .then(data => setFoodItems(data))
      .catch(err => console.error('Fetch foods error:', err));
  }, [refreshTrigger]);

  const filteredFoods = foodItems.filter(item => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const filteredRestaurants = restaurants.filter(rest => {
    if (!searchQuery.trim()) return true;
    return (
      rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rest.cuisines.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      
      {/* Top Demo & Showcase Bar */}
      <ShowcaseBar />

      {/* Role-Based Rendering */}
      {role === 'customer' && (
        <>
          <Navbar
            searchQuery={searchQuery}
            onSearchChange={q => setSearchQuery(q)}
          />

          <main className="flex-1">
            <HeroSection onSearch={q => setSearchQuery(q)} />
            
            <CategorySection
              selectedCategory={selectedCategory}
              onSelectCategory={cat => setSelectedCategory(cat)}
            />

            <MoodFoodFinder />

            <TrendingSection foodItems={filteredFoods} />

            <TopRestaurants
              restaurants={filteredRestaurants}
              onSelectRestaurant={rest => setSelectedRestaurantForDetail(rest)}
            />

            <EcoDeliveryBadge />
          </main>

          <Footer />

          {/* Customer Drawers & Modals */}
          <CartDrawer />
          <CheckoutModal />
          <LiveOrderTracking onOpenReview={order => setOrderToReview(order)} />
          <AIFoodFinder />
          <FoodCustomizationModal />
          <FoodComparisonModal />
          <GroupOrderModal />
          <FoodDNAModal />
          <PresentationGuide />
          
          <RestaurantDetailModal
            restaurant={selectedRestaurantForDetail}
            onClose={() => setSelectedRestaurantForDetail(null)}
          />

          <ReviewsModal
            orderToReview={orderToReview}
            onClose={() => setOrderToReview(null)}
          />
        </>
      )}

      {role === 'restaurant_owner' && (
        <main className="flex-1">
          <RestaurantDashboard />
          <PresentationGuide />
        </main>
      )}

      {role === 'delivery_partner' && (
        <main className="flex-1">
          <DeliveryDashboard />
          <PresentationGuide />
        </main>
      )}

      {role === 'admin' && (
        <main className="flex-1">
          <AdminDashboard />
          <PresentationGuide />
        </main>
      )}

      {/* Global Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl border border-slate-700/50 font-bold text-xs flex items-center space-x-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}

export default App;
