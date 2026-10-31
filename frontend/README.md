# Fastor Food & Restaurant Ordering App

A production-grade, pixel-perfect React application matching the Fastor mobile application Figma design, integrated with live Staging REST APIs.

---

## 🚀 Live Demo & Staging Credentials

- **API Base URL**: `https://staging.fastor.ai/v1`
- **Default City ID**: `118` (Delhi NCR)
- **Staging Test Phone Number**: `9818979450`
- **Staging Test Dial Code**: `+91`
- **Staging Test OTP**: `123456`

---

## 📱 Figma Design Implementation

Built in accordance with the provided Figma design specifications:

1. **Screen 1: Sign Up / Register (`/register`)**
   - Brand orange back navigation button
   - Exact typography & layout matching Figma
   - Custom styled phone number input container (`+91 | 9818979450`)
   - Interactive on-screen numeric keypad + hardware keyboard input support
   - Form validation with error feedback
   - Primary `Get OTP` action button with loading state
   - Terms & Conditions subtext

2. **Screen 2: 6-Digit OTP Verification (`/verify-otp`)**
   - 6 individual OTP input boxes with center dash separator (`[ ][ ][ ] - [ ][ ][ ]`)
   - Auto-focus, paste detection, backspace traversal, and arrow key navigation
   - 30-second countdown timer (`00:30`) with dynamic "Resend Code" trigger
   - Quick "Auto-fill Test OTP" button for fast interviewer evaluation
   - Calls live login API, securely saves JWT token and user info, and redirects to restaurant listing

3. **Screen 3: Restaurant Listing & Home Feed (`/restaurants`)**
   - **Current Location Header**: "Model Town, New Delhi" with quick refresh
   - **User Profile Pill**: Dynamic user display (`Karan` / user name) with Profile Drawer & Logout
   - **Quick Action Buttons**: Coral notification bell & Blue Fastor wallet balance button
   - **Best Seller Carousel**: Horizontal scrollable list with food cards and price badges (`$103.0`, `$50.0`, `$12.99`, `$8.20`)
   - **Promotional 30% OFF Banner**: Red/orange gradient card with pizza imagery and slide indicators
   - **Live Restaurant Cards**: Direct integration with `/m/restaurant?city_id=118` displaying logo, name, complete address, rating, delivery time, "Order Now" & "Track Driver" pills
   - **Server Pagination**: Implements real backend parameter (`page_no=1, 2, 3`, 56 total count)
   - **Live Search**: Instant filter for restaurants by name and address
   - **Loading Skeletons & Error Retry**: Shimmer loading states and error recovery

4. **Screen 4: Restaurant / Dish Detail (`/restaurant/:id`)**
   - High-resolution hero food image with rounded card styling
   - Price display (`₹14.00`) and quantity stepper `[- 3 +]`
   - Item title and description
   - Portion selection radio group (`Personal`, `Medium`, `Familiar`, `Jumbo`)
   - Floating "Add to cart" button with instant toast feedback

5. **Desktop & Mobile Responsiveness**
   - True mobile-first layout (100% viewport on mobile)
   - On desktop, renders inside an elegant smartphone frame with a top toolbar toggle to switch between **Figma Mobile Frame View** and **Wide Responsive View**.

---

## 🛠️ Tech Stack & Architecture

- **React.js 18** with **Vite**
- **Tailwind CSS** (configured with exact Figma brand tokens)
- **Axios** (centralized API client with interceptors for token injection and error parsing)
- **React Router DOM v6** (with `ProtectedRoute` and `PublicRoute` guards)
- **React Context API** (`AuthContext` with persistent `localStorage` synchronization)
- **Lucide React** (modern, lightweight icons matching Figma design)

### Directory Structure

```
frontend/
├── public/
├── src/
│   ├── assets/              # Static assets and icons
│   ├── components/
│   │   ├── common/          # Reusable UI (AppContainer, StatusBar, Keypad, Toast)
│   │   ├── restaurant/      # Cards, Best Sellers, Offer Banner, Skeletons, Pagination
│   │   └── routes/          # ProtectedRoute, PublicRoute
│   ├── context/
│   │   └── AuthContext.jsx  # Authentication state, token, user profile, persistence
│   ├── pages/
│   │   ├── RegisterPage.jsx         # Screen 1: Mobile registration
│   │   ├── OtpPage.jsx              # Screen 2: OTP verification
│   │   ├── RestaurantListPage.jsx   # Screen 3: Home feed & restaurants
│   │   ├── RestaurantDetailPage.jsx # Screen 4: Dish & restaurant details
│   │   └── NotFoundPage.jsx         # 404 handler
│   ├── services/
│   │   ├── api.js                   # Axios instance, interceptors, error extraction
│   │   ├── authService.js           # Register & Login endpoints
│   │   └── restaurantService.js     # Restaurant listing & detail endpoints
│   ├── App.jsx                      # App router and providers
│   ├── index.css                    # Tailwind directives and custom animations
│   └── main.jsx                     # Application entry point
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## ⚡ Getting Started

### Prerequisites

- Node.js (v18.0.0 or later recommended)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create your environment configuration:
   ```bash
   cp .env.example .env
   ```
   *The default configuration points to `https://staging.fastor.ai/v1` and `city_id=118`.*

4. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
   ```bash
   npm run build
   ```

---

## 🧪 Testing the Live Workflow

1. Navigate to `http://localhost:3000/register`.
2. Notice pre-filled staging test number `9818979450` (or type any valid 10-digit number via keyboard or on-screen keypad).
3. Click **Get OTP**. The live API returns `{"status":"Success","data":"otp sent"}` and routes to `/verify-otp`.
4. On the OTP screen, enter `123456` (or click the **Auto-fill** helper button).
5. Click **Continue**. The login API validates credentials, returns the JWT token, stores it securely, and navigates to `/restaurants`.
6. Browse live restaurant listings from Fastor's staging API, search, navigate across pages 1, 2, and 3, or click any card to view the detail page.
7. Click the user profile pill to view account info or log out.
