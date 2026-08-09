import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_RESTAURANTS,
  INITIAL_FOOD_ITEMS,
  INITIAL_COUPONS,
  INITIAL_REVIEWS,
  INITIAL_DELIVERY_PARTNERS,
  INITIAL_DAILY_CHALLENGES
} from './src/data/initialData';
import { Order, User, GroupOrder, DailyChallenge, FoodItem, Review, DeliveryPartner, Coupon } from './src/types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory Database Store
  let restaurants = [...INITIAL_RESTAURANTS];
  let foodItems = [...INITIAL_FOOD_ITEMS];
  let coupons = [...INITIAL_COUPONS];
  let reviews = [...INITIAL_REVIEWS];
  let deliveryPartners = [...INITIAL_DELIVERY_PARTNERS];
  let dailyChallenges = [...INITIAL_DAILY_CHALLENGES];
  let orders: Order[] = [
    {
      id: 'ORD-9821',
      userId: 'user-demo-1',
      userName: 'Harsh Saroya',
      userPhone: '+91 98765 00000',
      restaurantId: 'rest-1',
      restaurantName: 'Punjab Grill & Tandoor',
      restaurantAddress: 'Sector 18, Connaught Place, New Delhi',
      items: [
        {
          cartItemId: 'c-1',
          foodItem: INITIAL_FOOD_ITEMS[0],
          quantity: 1,
          selectedCustomizations: [{ groupId: 'group-portion', groupTitle: 'Portion', optionId: 'opt-half', optionName: 'Half (500 ml)', price: 0 }],
          unitPrice: 380,
          totalPrice: 380
        },
        {
          cartItemId: 'c-2',
          foodItem: INITIAL_FOOD_ITEMS[1],
          quantity: 1,
          selectedCustomizations: [],
          unitPrice: 290,
          totalPrice: 290
        }
      ],
      itemTotal: 670,
      deliveryFee: 35,
      platformFee: 10,
      taxes: 33,
      discount: 100,
      ecoDiscount: 15,
      grandTotal: 633,
      deliveryMethod: 'eco',
      status: 'Out for Delivery',
      deliveryAddress: {
        id: 'addr-1',
        type: 'Home',
        street: 'Flat 402, Green Valley Heights, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        zipCode: '201301',
        isDefault: true
      },
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      estimatedDeliveryTime: '15-20 min',
      deliveryPartner: {
        id: 'dp-1',
        name: 'Rohan Verma',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
        vehicleNumber: 'DL 01 EV 8821 (Electric Scooter 🌱)',
        rating: 4.9
      },
      ecoScore: 88,
      plantTreeOptIn: true
    }
  ];

  let groupOrders: Record<string, GroupOrder> = {};

  let currentUser: User = {
    id: 'user-demo-1',
    name: 'Harsh Saroya',
    email: 'harsh.build@foodorax.com',
    role: 'customer',
    phone: '+91 98765 00000',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    foodoraPoints: 350,
    rewardTier: 'Food Lover',
    savedAddresses: [
      {
        id: 'addr-1',
        type: 'Home',
        street: 'Flat 402, Green Valley Heights, Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        zipCode: '201301',
        isDefault: true
      },
      {
        id: 'addr-2',
        type: 'Work',
        street: 'Tower B, 7th Floor, Cyber City',
        city: 'Gurugram',
        state: 'Haryana',
        zipCode: '122002'
      }
    ]
  };

  // Gemini AI Client Setup
  let aiClient: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (err) {
      console.warn('Gemini client init notice:', err);
    }
  }

  // --- API ENDPOINTS ---

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', app: 'FOODORA X', timestamp: new Date().toISOString() });
  });

  // Auth User
  app.get('/api/auth/me', (req, res) => {
    res.json(currentUser);
  });

  app.post('/api/auth/switch-role', (req, res) => {
    const { role } = req.body;
    if (['customer', 'restaurant_owner', 'delivery_partner', 'admin'].includes(role)) {
      currentUser.role = role;
      res.json({ success: true, user: currentUser });
    } else {
      res.status(400).json({ error: 'Invalid role' });
    }
  });

  // Restaurants
  app.get('/api/restaurants', (req, res) => {
    const { search, category, vegOnly, minRating, sort } = req.query;
    let list = [...restaurants];

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisines.some(c => c.toLowerCase().includes(q)) ||
        r.address.toLowerCase().includes(q)
      );
    }

    if (category) {
      const cat = String(category).toLowerCase();
      list = list.filter(r => r.cuisines.some(c => c.toLowerCase().includes(cat)));
    }

    if (minRating) {
      list = list.filter(r => r.rating >= Number(minRating));
    }

    if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'deliveryTime') {
      list.sort((a, b) => a.deliveryTimeMinutes - b.deliveryTimeMinutes);
    } else if (sort === 'priceLow') {
      list.sort((a, b) => a.priceForTwo - b.priceForTwo);
    }

    res.json(list);
  });

  app.get('/api/restaurants/:id', (req, res) => {
    const restaurant = restaurants.find(r => r.id === req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    const items = foodItems.filter(f => f.restaurantId === restaurant.id);
    res.json({ restaurant, items });
  });

  // Food Items
  app.get('/api/food-items', (req, res) => {
    const { search, category, isVeg, maxPrice, isSpicy, minRating, sort } = req.query;
    let list = [...foodItems];

    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (category && category !== 'All') {
      const cat = String(category).toLowerCase();
      list = list.filter(f => f.category.toLowerCase() === cat || f.tags.some(t => t.toLowerCase() === cat));
    }

    if (isVeg === 'true') {
      list = list.filter(f => f.isVeg === true);
    }

    if (maxPrice) {
      list = list.filter(f => f.price <= Number(maxPrice));
    }

    if (minRating) {
      list = list.filter(f => f.rating >= Number(minRating));
    }

    if (sort === 'priceLow') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceHigh') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    res.json(list);
  });

  // Coupons
  app.get('/api/coupons', (req, res) => {
    res.json(coupons);
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, cartAmount } = req.body;
    const coupon = coupons.find(c => c.code.toUpperCase() === String(code).toUpperCase());

    if (!coupon) {
      return res.status(400).json({ valid: false, message: 'Invalid coupon code.' });
    }

    if (cartAmount < coupon.minOrderValue) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order amount for ${coupon.code} is ₹${coupon.minOrderValue}.`
      });
    }

    let discount = 0;
    if (coupon.discountAmount) {
      discount = coupon.discountAmount;
    } else if (coupon.discountPercentage) {
      discount = (cartAmount * coupon.discountPercentage) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }

    res.json({
      valid: true,
      code: coupon.code,
      discount: Math.round(discount),
      description: coupon.description
    });
  });

  // AI Food Finder 🤖 (Gemini 3.6 Flash + fallback)
  app.post('/api/ai-food-finder', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Try Gemini API call if client is available
    if (aiClient) {
      try {
        const foodCatalogSummary = foodItems.map(f => `${f.id}: ${f.name} (₹${f.price}, ${f.isVeg ? 'Veg' : 'NonVeg'}, ${f.spiceLevel || 'Mild'} spice, ${f.calories || 'N/A'} cal, Tags: ${f.tags.join(', ')})`).join('\n');
        
        const geminiPrompt = `You are the AI Food Recommendation engine for "FOODORA X".
User request: "${prompt}"

Available Food Catalog:
${foodCatalogSummary}

Select 2 to 4 food item IDs from the catalog that best match the user's craving. Respond ONLY in valid JSON format:
{
  "reasoning": "A short friendly 1-sentence explanation of why these dishes were recommended",
  "recommendedItemIds": ["food-1", "food-4"]
}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: geminiPrompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const rawText = response.text?.trim() || '';
        const parsed = JSON.parse(rawText);
        const matchedItems = foodItems.filter(item => parsed.recommendedItemIds?.includes(item.id));

        if (matchedItems.length > 0) {
          return res.json({
            explanation: parsed.reasoning || `Here are the best dishes matching "${prompt}"!`,
            items: matchedItems
          });
        }
      } catch (err) {
        console.warn('Gemini recommendation fallback triggered:', err);
      }
    }

    // Smart Rule-based Fallback
    const p = String(prompt).toLowerCase();
    let matches = foodItems.filter(item => {
      if (p.includes('spicy') && item.isSpicy) return true;
      if (p.includes('healthy') && (item.category === 'Healthy' || item.tags.includes('Superfood') || (item.calories && item.calories < 450))) return true;
      if (p.includes('veg') && item.isVeg) return true;
      if (p.includes('sweet') && item.category === 'Desserts') return true;
      if (p.includes('protein') && item.tags.includes('High Protein')) return true;
      if (p.includes('under 250') || p.includes('under ₹250') || p.includes('budget')) return item.price <= 250;
      return item.name.toLowerCase().includes(p) || item.description.toLowerCase().includes(p) || item.tags.some(t => t.toLowerCase().includes(p));
    });

    if (matches.length === 0) {
      matches = foodItems.slice(0, 3);
    } else {
      matches = matches.slice(0, 4);
    }

    res.json({
      explanation: `Found ${matches.length} curated options matching your craving "${prompt}"!`,
      items: matches
    });
  });

  // Mood Food Finder
  app.post('/api/mood-recommendations', (req, res) => {
    const { mood } = req.body;
    let filtered: FoodItem[] = [];

    switch (mood) {
      case 'Hungry':
        filtered = foodItems.filter(f => f.price > 300 || f.tags.includes('Bestseller'));
        break;
      case 'Spicy Mood':
        filtered = foodItems.filter(f => f.isSpicy || f.spiceLevel === 'Hot' || f.spiceLevel === 'Extra Hot');
        break;
      case 'Healthy':
        filtered = foodItems.filter(f => f.category === 'Healthy' || f.isVeg || (f.calories && f.calories < 450));
        break;
      case 'Comfort Food':
        filtered = foodItems.filter(f => f.category === 'Pizza' || f.category === 'Burgers' || f.category === 'Indian');
        break;
      case 'Party':
        filtered = foodItems.filter(f => f.category === 'Pizza' || f.category === 'Chinese' || f.category === 'Burgers');
        break;
      case 'Fitness':
        filtered = foodItems.filter(f => f.tags.includes('High Protein') || f.category === 'Healthy');
        break;
      case 'Sweet Tooth':
        filtered = foodItems.filter(f => f.category === 'Desserts' || f.category === 'Beverages');
        break;
      case 'Chill':
        filtered = foodItems.filter(f => f.category === 'Beverages' || f.category === 'Fast Food');
        break;
      default:
        filtered = foodItems.slice(0, 4);
    }

    res.json({ mood, items: filtered.slice(0, 6) });
  });

  // Create Order
  app.post('/api/orders', (req, res) => {
    const {
      items,
      restaurantId,
      deliveryAddress,
      deliveryMethod,
      paymentMethod,
      couponCode,
      plantTreeOptIn
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const rest = restaurants.find(r => r.id === restaurantId) || restaurants[0];
    const itemTotal = items.reduce((sum: number, item: any) => sum + (item.totalPrice || item.unitPrice * item.quantity), 0);

    let deliveryFee = deliveryMethod === 'express' ? 45 : deliveryMethod === 'eco' ? 20 : 35;
    let platformFee = 10;
    let taxes = Math.round(itemTotal * 0.05);

    let discount = 0;
    if (couponCode) {
      const c = coupons.find(cp => cp.code.toUpperCase() === String(couponCode).toUpperCase());
      if (c && itemTotal >= c.minOrderValue) {
        if (c.discountAmount) discount = c.discountAmount;
        else if (c.discountPercentage) discount = Math.min(c.maxDiscount || 999, Math.round((itemTotal * c.discountPercentage) / 100));
      }
    }

    let ecoDiscount = deliveryMethod === 'eco' ? 15 : 0;
    let grandTotal = Math.max(0, itemTotal + deliveryFee + platformFee + taxes - discount - ecoDiscount);

    // Eco Score calculation
    let ecoScore = 75;
    if (deliveryMethod === 'eco') ecoScore += 15;
    if (items.every((i: any) => i.foodItem?.isVeg)) ecoScore += 10;

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userPhone: currentUser.phone,
      restaurantId: rest.id,
      restaurantName: rest.name,
      restaurantAddress: rest.address,
      items,
      itemTotal,
      deliveryFee,
      platformFee,
      taxes,
      discount,
      ecoDiscount,
      grandTotal,
      deliveryMethod: deliveryMethod || 'standard',
      status: 'Order Confirmed',
      deliveryAddress: deliveryAddress || currentUser.savedAddresses[0],
      paymentMethod: paymentMethod || 'UPI',
      paymentStatus: 'Paid',
      createdAt: new Date().toISOString(),
      estimatedDeliveryTime: deliveryMethod === 'express' ? '20-25 min' : '30-40 min',
      deliveryPartner: deliveryPartners[0],
      ecoScore,
      plantTreeOptIn: Boolean(plantTreeOptIn)
    };

    orders.unshift(newOrder);

    // Update user points
    currentUser.foodoraPoints += Math.round(grandTotal / 10);

    res.json({ success: true, order: newOrder });
  });

  app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status;
    res.json({ success: true, order });
  });

  app.get('/api/user/orders', (req, res) => {
    res.json(orders);
  });

  // Food DNA API 🧬
  app.get('/api/user/food-dna', (req, res) => {
    const totalOrdersCount = orders.length + 8; // demo augmented
    const totalSavings = orders.reduce((sum, o) => sum + o.discount + o.ecoDiscount, 240);

    res.json({
      favoriteCuisine: 'North Indian & Italian',
      favoriteDish: 'Butter Chicken Gold',
      avgOrderValue: 480,
      spicePreference: 'Medium',
      orderingTimeHabit: 'Night Owl 🌙',
      favoriteRestaurant: 'Punjab Grill & Tandoor',
      healthyFoodScore: 84,
      totalOrdersCount,
      totalSavings
    });
  });

  // Group Order API 🤝
  app.post('/api/group-orders/create', (req, res) => {
    const { restaurantId, hostName } = req.body;
    const rest = restaurants.find(r => r.id === restaurantId) || restaurants[0];
    const code = `FOODORA-${Math.floor(100 + Math.random() * 900)}`;

    const groupOrder: GroupOrder = {
      code,
      hostName: hostName || currentUser.name,
      restaurantId: rest.id,
      restaurantName: rest.name,
      participants: [{ userName: hostName || currentUser.name, itemCount: 0 }],
      items: [],
      createdAt: new Date().toISOString()
    };

    groupOrders[code] = groupOrder;
    res.json(groupOrder);
  });

  app.get('/api/group-orders/:code', (req, res) => {
    const go = groupOrders[req.params.code.toUpperCase()];
    if (!go) return res.status(404).json({ error: 'Group order not found' });
    res.json(go);
  });

  app.post('/api/group-orders/:code/join', (req, res) => {
    const { userName } = req.body;
    const go = groupOrders[req.params.code.toUpperCase()];
    if (!go) return res.status(404).json({ error: 'Group order not found' });

    if (!go.participants.some(p => p.userName === userName)) {
      go.participants.push({ userName, itemCount: 0 });
    }
    res.json(go);
  });

  // Reviews
  app.get('/api/reviews', (req, res) => {
    res.json(reviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { restaurantId, ratingRestaurant, ratingFood, ratingDelivery, comment, tags } = req.body;
    const rest = restaurants.find(r => r.id === restaurantId);

    const newReview: Review = {
      id: `rev-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      restaurantId,
      restaurantName: rest?.name || 'Restaurant',
      ratingRestaurant: ratingRestaurant || 5,
      ratingFood: ratingFood || 5,
      ratingDelivery: ratingDelivery || 5,
      comment: comment || 'Great food and fast delivery!',
      tags: tags || ['🔥 Tasty', '🚀 Fast delivery'],
      createdAt: new Date().toISOString(),
      likesCount: 0
    };

    reviews.unshift(newReview);
    currentUser.foodoraPoints += 40; // review reward points

    res.json({ success: true, review: newReview });
  });

  // Rewards
  app.get('/api/rewards', (req, res) => {
    res.json({
      points: currentUser.foodoraPoints,
      tier: currentUser.rewardTier,
      dailyChallenges
    });
  });

  app.post('/api/rewards/claim-challenge', (req, res) => {
    const { challengeId } = req.body;
    const ch = dailyChallenges.find(c => c.id === challengeId);
    if (!ch) return res.status(404).json({ error: 'Challenge not found' });

    if (!ch.completed) {
      ch.completed = true;
      ch.currentCount = ch.targetCount;
      currentUser.foodoraPoints += ch.pointsReward;
    }

    res.json({ success: true, points: currentUser.foodoraPoints, challenge: ch });
  });

  // Restaurant Owner Management
  app.post('/api/restaurant-owner/food-items', (req, res) => {
    const newItem: FoodItem = {
      id: `food-${Date.now()}`,
      restaurantId: req.body.restaurantId || restaurants[0].id,
      restaurantName: restaurants[0].name,
      name: req.body.name || 'New Special Dish',
      description: req.body.description || 'Delicious freshly crafted dish.',
      price: Number(req.body.price) || 290,
      image: req.body.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      category: req.body.category || 'Indian',
      isVeg: Boolean(req.body.isVeg),
      isSpicy: Boolean(req.body.isSpicy),
      spiceLevel: req.body.spiceLevel || 'Medium',
      calories: Number(req.body.calories) || 450,
      rating: 5.0,
      inStock: true,
      tags: ['Chef Special', 'Fresh']
    };

    foodItems.unshift(newItem);
    res.json({ success: true, item: newItem });
  });

  // Delivery Partner API
  app.get('/api/delivery/partner', (req, res) => {
    res.json(deliveryPartners[0]);
  });

  app.post('/api/delivery/toggle-status', (req, res) => {
    deliveryPartners[0].isOnline = !deliveryPartners[0].isOnline;
    res.json({ success: true, isOnline: deliveryPartners[0].isOnline });
  });

  // Admin Analytics API
  app.get('/api/admin/analytics', (req, res) => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 452800);
    const totalOrders = orders.length + 1280;

    res.json({
      totalRevenue,
      totalOrders,
      activeUsersCount: 3420,
      totalRestaurants: restaurants.length,
      totalDeliveryPartners: deliveryPartners.length,
      monthlyRevenue: [
        { month: 'Mar', revenue: 62000, orders: 180 },
        { month: 'Apr', revenue: 78000, orders: 220 },
        { month: 'May', revenue: 95000, orders: 290 },
        { month: 'Jun', revenue: 110000, orders: 340 },
        { month: 'Jul', revenue: 135000, orders: 410 },
        { month: 'Aug', revenue: 162000, orders: 490 }
      ],
      popularFoods: [
        { name: 'Butter Chicken Gold', count: 480, category: 'Indian' },
        { name: 'Truffle Mushroom Pizza', count: 390, category: 'Pizza' },
        { name: 'Ghee Roast Masala Dosa', count: 350, category: 'Indian' },
        { name: 'Schezwan Triple Rice', count: 290, category: 'Chinese' },
        { name: 'Nutella Waffle Overload', count: 240, category: 'Desserts' }
      ],
      topRestaurants: restaurants.slice(0, 5).map(r => ({
        name: r.name,
        orders: Math.floor(r.ratingCount * 0.8),
        revenue: Math.floor(r.ratingCount * r.priceForTwo * 0.6)
      }))
    });
  });

  // Vite middleware setup for dev / production static serve
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🍔 FOODORA X Express Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
