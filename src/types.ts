export type UserRole = 'customer' | 'restaurant_owner' | 'delivery_partner' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  foodoraPoints: number;
  rewardTier: 'Food Explorer' | 'Food Lover' | 'Food Master' | 'Food Legend';
  savedAddresses: Address[];
  foodDNA?: FoodDNA;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  rating: number;
  ratingCount: number;
  cuisines: string[];
  deliveryTimeMinutes: number;
  priceForTwo: number;
  distanceKm: number;
  isEcoFriendly: boolean;
  badges: string[]; // '🔥 Trending', '⭐ Top Rated', '⚡ Fast Delivery', '🌱 Eco Friendly', '💎 Premium'
  address: string;
  isOpen: boolean;
  featuredDishes?: string[];
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
}

export interface CustomizationGroup {
  id: string;
  title: string;
  required: boolean;
  maxSelect?: number;
  options: CustomizationOption[];
}

export interface FoodItem {
  id: string;
  restaurantId: string;
  restaurantName?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isSpicy?: boolean;
  spiceLevel?: 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
  calories?: number;
  rating: number;
  inStock: boolean;
  tags: string[]; // e.g. 'Popular', 'High Protein', 'Bestseller', 'Chef Special'
  customizationGroups?: CustomizationGroup[];
}

export interface SelectedCustomization {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  foodItem: FoodItem;
  quantity: number;
  selectedCustomizations: SelectedCustomization[];
  spiceLevel?: string;
  size?: string;
  specialInstructions?: string;
  unitPrice: number;
  totalPrice: number;
  addedByUserName?: string;
}

export interface Coupon {
  code: string;
  discountPercentage?: number;
  discountAmount?: number;
  minOrderValue: number;
  maxDiscount?: number;
  description: string;
  expiryDate: string;
}

export type OrderStatus = 
  | 'Order Confirmed'
  | 'Restaurant Preparing'
  | 'Packed'
  | 'Delivery Partner Assigned'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type DeliveryMethod = 'express' | 'standard' | 'eco';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  restaurantId: string;
  restaurantName: string;
  restaurantAddress: string;
  items: CartItem[];
  itemTotal: number;
  deliveryFee: number;
  platformFee: number;
  taxes: number;
  discount: number;
  ecoDiscount: number;
  grandTotal: number;
  deliveryMethod: DeliveryMethod;
  status: OrderStatus;
  deliveryAddress: Address;
  paymentMethod: 'UPI' | 'Credit/Debit Card' | 'Cash on Delivery' | 'Net Banking' | 'Wallet';
  paymentStatus: 'Paid' | 'Pending';
  createdAt: string;
  estimatedDeliveryTime: string;
  deliveryPartner?: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    vehicleNumber: string;
    rating: number;
  };
  ecoScore: number; // 0-100
  plantTreeOptIn?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  restaurantId: string;
  restaurantName: string;
  foodItemId?: string;
  foodItemName?: string;
  ratingRestaurant: number;
  ratingFood: number;
  ratingDelivery: number;
  comment: string;
  tags: string[];
  createdAt: string;
  likesCount: number;
}

export interface FoodDNA {
  favoriteCuisine: string;
  favoriteDish: string;
  avgOrderValue: number;
  spicePreference: 'Mild' | 'Medium' | 'Spicy' | 'Super Spicy';
  orderingTimeHabit: 'Lunch Explorer' | 'Evening Snacker' | 'Night Owl' | 'Weekend Feaster';
  favoriteRestaurant: string;
  healthyFoodScore: number; // 0-100
  totalOrdersCount: number;
  totalSavings: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  category: 'restaurant' | 'veg' | 'budget' | 'review' | 'eco';
}

export interface GroupOrder {
  code: string;
  hostName: string;
  restaurantId: string;
  restaurantName: string;
  participants: {
    userName: string;
    itemCount: number;
  }[];
  items: CartItem[];
  createdAt: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  vehicleNumber: string;
  rating: number;
  isOnline: boolean;
  todayEarnings: number;
  completedDeliveries: number;
  activeOrderId?: string;
}

export interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  activeUsersCount: number;
  totalRestaurants: number;
  totalDeliveryPartners: number;
  monthlyRevenue: { month: string; revenue: number; orders: number }[];
  popularFoods: { name: string; count: number; category: string }[];
  topRestaurants: { name: string; orders: number; revenue: number }[];
}
