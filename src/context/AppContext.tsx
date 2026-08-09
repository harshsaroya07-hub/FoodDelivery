import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  UserRole,
  Restaurant,
  FoodItem,
  CartItem,
  Coupon,
  Order,
  Address,
  SelectedCustomization,
  DeliveryMethod
} from '../types';

interface AppContextType {
  user: User | null;
  role: UserRole;
  switchRole: (newRole: UserRole) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Location
  currentLocation: Address;
  setCurrentLocation: (addr: Address) => void;

  // Cart
  cart: CartItem[];
  addToCart: (foodItem: FoodItem, quantity?: number, customizations?: SelectedCustomization[], spiceLevel?: string, size?: string, specialInstructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartRestaurantId: string | null;
  
  // Applied Coupon
  appliedCoupon: { code: string; discount: number; description: string } | null;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  plantTreeOptIn: boolean;
  setPlantTreeOptIn: (optIn: boolean) => void;

  // Favorites & Compare
  favorites: string[]; // foodItem or restaurant IDs
  toggleFavorite: (id: string) => void;
  compareItems: FoodItem[];
  addToCompare: (item: FoodItem) => void;
  removeFromCompare: (itemId: string) => void;
  clearCompare: () => void;

  // Active Order for Tracking
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // UI Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAIFinderOpen: boolean;
  setIsAIFinderOpen: (open: boolean) => void;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (open: boolean) => void;
  selectedFoodForCustomization: FoodItem | null;
  openCustomizationFor: (food: FoodItem) => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
  isPresentationGuideOpen: boolean;
  setIsPresentationGuideOpen: (open: boolean) => void;
  isFoodDNAModalOpen: boolean;
  setIsFoodDNAModalOpen: (open: boolean) => void;
  isGroupOrderModalOpen: boolean;
  setIsGroupOrderModalOpen: (open: boolean) => void;

  // Notification Toasts
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Refresh trigger for backend data
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>('customer');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('foodora_theme') === 'dark';
  });

  const [currentLocation, setCurrentLocation] = useState<Address>({
    id: 'addr-1',
    type: 'Home',
    street: 'Flat 402, Green Valley Heights, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    zipCode: '201301',
    isDefault: true
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('foodora_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [plantTreeOptIn, setPlantTreeOptIn] = useState<boolean>(true);

  const [favorites, setFavorites] = useState<string[]>(['rest-1', 'food-1', 'food-4']);
  const [compareItems, setCompareItems] = useState<FoodItem[]>([]);

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIFinderOpen, setIsAIFinderOpen] = useState(false);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [selectedFoodForCustomization, setSelectedFoodForCustomization] = useState<FoodItem | null>(null);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isPresentationGuideOpen, setIsPresentationGuideOpen] = useState(false);
  const [isFoodDNAModalOpen, setIsFoodDNAModalOpen] = useState(false);
  const [isGroupOrderModalOpen, setIsGroupOrderModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setRole(data.role || 'customer');
      })
      .catch(err => console.error('Fetch me error:', err));
  }, []);

  useEffect(() => {
    localStorage.setItem('foodora_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('foodora_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('foodora_theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    fetch('/api/auth/switch-role', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) setUser(data.user);
        showToast(`Switched view to ${newRole.replace('_', ' ').toUpperCase()} mode!`);
      });
  };

  const cartRestaurantId = cart.length > 0 ? cart[0].foodItem.restaurantId : null;

  const addToCart = (
    foodItem: FoodItem,
    quantity = 1,
    customizations: SelectedCustomization[] = [],
    spiceLevel?: string,
    size?: string,
    specialInstructions?: string
  ) => {
    if (cart.length > 0 && cart[0].foodItem.restaurantId !== foodItem.restaurantId) {
      if (!window.confirm('Adding items from a new restaurant will clear your current cart. Continue?')) {
        return;
      }
      setCart([]);
    }

    const customizationExtra = customizations.reduce((sum, c) => sum + c.price, 0);
    const unitPrice = foodItem.price + customizationExtra;
    const totalPrice = unitPrice * quantity;

    const cartItemId = `${foodItem.id}-${customizations.map(c => c.optionId).sort().join('-')}-${spiceLevel || ''}-${size || ''}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: updated[existingIndex].unitPrice * newQty
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            foodItem,
            quantity,
            selectedCustomizations: customizations,
            spiceLevel,
            size,
            specialInstructions,
            unitPrice,
            totalPrice
          }
        ];
      }
    });

    showToast(`Added "${foodItem.name}" to your cart! 🛒`);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: item.unitPrice * newQty
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = async (code: string) => {
    const itemTotal = cart.reduce((sum, i) => sum + i.totalPrice, 0);
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartAmount: itemTotal })
      });
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: data.code,
          discount: data.discount,
          description: data.description
        });
        showToast(`Coupon "${data.code}" applied! Saved ₹${data.discount}`);
        return { success: true, message: data.description };
      } else {
        return { success: false, message: data.message };
      }
    } catch {
      return { success: false, message: 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Removed from favorites');
        return prev.filter(item => item !== id);
      } else {
        showToast('Saved to favorites ❤️');
        return [...prev, id];
      }
    });
  };

  const addToCompare = (item: FoodItem) => {
    if (compareItems.length >= 3) {
      showToast('You can compare up to 3 food items at a time');
      return;
    }
    if (compareItems.some(i => i.id === item.id)) {
      showToast('Item already added to comparison');
      return;
    }
    setCompareItems(prev => [...prev, item]);
    showToast(`Added "${item.name}" to comparison matrix`);
  };

  const removeFromCompare = (itemId: string) => {
    setCompareItems(prev => prev.filter(i => i.id !== itemId));
  };

  const clearCompare = () => setCompareItems([]);

  const openCustomizationFor = (food: FoodItem) => {
    setSelectedFoodForCustomization(food);
    setIsCustomizationModalOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        switchRole,
        darkMode,
        toggleDarkMode,
        currentLocation,
        setCurrentLocation,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartRestaurantId,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        deliveryMethod,
        setDeliveryMethod,
        plantTreeOptIn,
        setPlantTreeOptIn,
        favorites,
        toggleFavorite,
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        activeTrackingOrder,
        setActiveTrackingOrder,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAIFinderOpen,
        setIsAIFinderOpen,
        isCustomizationModalOpen,
        setIsCustomizationModalOpen,
        selectedFoodForCustomization,
        openCustomizationFor,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isPresentationGuideOpen,
        setIsPresentationGuideOpen,
        isFoodDNAModalOpen,
        setIsFoodDNAModalOpen,
        isGroupOrderModalOpen,
        setIsGroupOrderModalOpen,
        toastMessage,
        showToast,
        refreshTrigger,
        triggerRefresh
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
