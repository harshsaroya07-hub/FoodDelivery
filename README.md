# 🍔 FOODORA X — Next-Generation Food Delivery Ecosystem

> **"More than food. An experience."**
> A complete, production-quality full-stack food delivery web application built with React 19, Express.js, TypeScript, Tailwind CSS v4, and Google Gemini 3.6 Flash AI.

---

## 🌟 Executive Summary & Key Innovations

Unlike generic food delivery clones, **Foodora X** is built as a complete startup product containing 4 distinct operational role portals and next-gen food tech features:

1. **🤖 AI Craving Finder**: Conversational natural language food finder powered by server-side **Google Gemini 3.6 Flash**. Parses dietary constraints, budget, and cravings into real-time menu recommendations.
2. **🌱 Eco Delivery Score (88/100)**: Environmental responsibility engine tracking plastic-free packaging, electric scooter fleet delivery, carbon offset points, and a ₹5 "Plant a Tree" opt-in.
3. **🧬 Personalized Food DNA**: Algorithmic taste profile analyzing cuisine preferences, spice tolerance, ordering time habits, and total customer savings.
4. **🍕 Food Comparison Matrix**: Side-by-side comparison tool comparing price, calories, ratings, and spice levels for up to 3 dishes.
5. **🤝 Order Together (Group Cart)**: Shared cart link generation allowing friends to add items to a single order.
6. **🛵 Live GPS Order Tracking**: Interactive animated tracking feed with driver contact, ETA counter, and status transitions (Placed → Preparing → Packed → Out for Delivery → Delivered).
7. **📚 Viva & Presentation Guide**: Integrated showcase drawer containing 12 automated test cases, architecture diagrams, and sample viva Q&A for college evaluation.

---

## 🏛️ Project Architecture & Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons.
- **Backend**: Express.js REST API running on Node.js.
- **AI Engine**: `@google/genai` TypeScript SDK invoking `gemini-3.6-flash` (server-side API route `/api/ai-food-finder`).
- **State Management**: React Context API (`AppContext`) with persistence in `localStorage`.
- **Build System**: Vite (client SPA) + ESBuild CommonJS bundle (`dist/server.cjs`).

---

## 🎭 4 Operational Role Portals

1. **Customer View**: Explore cuisines, mood-based recommendations, AI finder, custom food options, cart checkout, and order tracking.
2. **Restaurant Owner View**: Live kitchen order feed, order acceptance/preparation state controls, and menu stock availability toggles.
3. **Delivery Partner View**: EV driver trip assignments, online/offline status, earnings tracking, and destination map routes.
4. **Executive Admin View**: Real-time GMV sales revenue metrics, fulfillment rates, carbon offset tracking, and category share charts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- npm 10+

### Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Building for Production
```bash
npm run build
npm start
```

---

## 🧪 Automated Test Suite (12 Test Cases)

1. `TC01`: REST API Health & Restaurant Partner Endpoints
2. `TC02`: Gemini 3.6 AI Craving Recommendation Parsing
3. `TC03`: Cart Quantity & Customization Extra Pricing
4. `TC04`: Promo Coupon Validation Engine (`WELCOME50`, `FLAT100`)
5. `TC05`: Group Order Code Generation & Shared Cart Sync
6. `TC06`: Eco Group Delivery Discount Logic
7. `TC07`: Live GPS Tracking State Machine
8. `TC08`: Food Comparison Matrix Property Diffing
9. `TC09`: Restaurant Owner Order Acceptance & Preparation Controls
10. `TC10`: Delivery Partner EV Earnings & Trip Route
11. `TC11`: Admin Analytics Revenue & Category Charts
12. `TC12`: Food DNA Taste Profiling Algorithm

---

© 2026 **FOODORA X**. Developed for Startup Demonstration & College Evaluation.
