<div align="center">

# 🌾 FosholBari

### *Bridging Farmers and Buyers.*
### *Fresh from the Field, Right to Your Door.*

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

<br/>

[![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://fosholbari.vercel.app)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square)](https://github.com/fosholbari/fosholbari/pulls)

<br/>

[🌐 Live Demo](https://fosholbari.vercel.app) &nbsp;|&nbsp;
[📁 Frontend Repo](https://github.com/fosholbari/fosholbari) &nbsp;|&nbsp;
[🔧 Backend Repo](https://github.com/fosholbari/fosholbari-server)

</div>

---

## 🌟 Project Overview

**FosholBari** (ফসলবাড়ি) is a full-stack MERN-based agricultural marketplace that directly connects farmers and buyers in Bangladesh. It gives farmers a self-managed storefront to list and sell their produce, while buyers get a seamless platform to discover and purchase fresh agricultural products.

Built with **Next.js 16**, **Express 5**, **MongoDB Atlas**, and **BetterAuth**, FosholBari features a role-based system (Admin, Farmer, Buyer), product search and filtering, order tracking, demand posting, bazar notes, Recharts-powered dashboards, and a fully Bengali UI — making it a production-ready application.

---

## 💡 Why FosholBari?

### The Problem
Farmers in Bangladesh are deprived of fair prices due to middlemen. Buyers have no reliable digital channel to purchase fresh produce directly from farmers. There is no trusted platform connecting both sides.

### The Solution
FosholBari solves this by:

- Giving **farmers** a self-managed storefront — list products, set prices, and sell directly
- Giving **buyers** a way to connect with farmers and post market demands
- Giving **admins** full platform control with real-time analytics
- **Eliminating middlemen** and enabling direct communication between farmers and buyers

---

## 🔑 Key Features

### 🔐 Authentication & Authorization
- Email/password sign-up and login powered by **BetterAuth**
- **Google OAuth 2.0** social login
- **JWT tokens** with 7-day expiry stored in secure HttpOnly cookies
- Role-based route protection enforced on both frontend and backend
- User-friendly Bengali error message translation

### 🌾 Product Management (Explore)
- Farmers can **add, edit, and delete** product listings
- Products support name, category, tag, price, weight, image, and description
- **Search** (by name/category/tag), **Filter** (category, tag, max price), and **Sort** (price asc/desc)
- Server-side **pagination** — default 6 products per page
- Full product detail page with image, description, price, and order option

### 📦 Order System
- Buyers can place **orders** directly on a product (with quantity, address, and phone)
- Farmers can **track their orders** and update order status
- Separate order views for Buyer and Farmer roles

### 📢 Demands System
- Buyers can **post market demands** — what product they want and at what price
- Farmers can **reply with proposals** (comments) on a demand
- Edit and delete own demands; Admin can delete any demand

### 📝 Bazar Notes
- Buyers can create a personal **shopping list** (bazar note)
- Add, edit, and delete notes

### 📊 Analytics Dashboard
- Farmer dashboard features a **Recharts AreaChart** for monthly revenue
- Stats include total products, out-of-stock items, total orders, pending orders, and total revenue
- Admin dashboard provides platform-wide reports and statistics

### 🌗 Dark / Light Theme
- Full **Dark and Light mode** support via **next-themes**
- Theme-specific images for 404, login, registration, and unauthorized pages
- All UI components are theme-aware

### 🎞️ Animations
- **Framer Motion 12** — page transitions, card entrances, staggered list animations
- **HarvestLoader** — a custom branded loading animation (seed → sprout → harvest themed)
- Suspense-based loading fallback on all pages

### 👤 Profile Management
- Users can update name, email, and avatar
- Farmers have extended fields: NID, farm name, farm location, bio, bKash/Nagad/bank details
- Profile picture upload via **ImgBB API** with preview before saving

### 🚨 Error Handling
- Custom **404** page with Dark/Light theme variants
- **Unauthorized** page for role-mismatch redirects
- **React Toastify** toast notifications for all user actions
- All error messages translated to Bengali for end users

---

## 👥 User Roles

### 🛒 Buyer
The default role assigned to every new signup. Buyers can:
- Browse, search, and order products
- Post and manage market demands
- Create personal bazar notes
- View order history
- Manage profile (name, email, avatar, address, phone)

### 🌾 Farmer
Promoted from Buyer by an Admin. Farmers can:
- Add, edit, and delete their own product listings
- Track orders and update order status
- Reply to buyer demands with proposals
- View sales analytics via Recharts charts
- Manage profile (bio, farm info, payment details)

### 🛡️ Admin
The platform administrator. Admins can:
- View all users and change their roles
- View and delete any product or order
- Manage all demands across the platform
- Access full platform analytics
- Manage their own profile

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 16.2.10 (App Router), React 19, TypeScript 5 |
| **Backend** | Node.js, Express 5.x, TypeScript |
| **Database** | MongoDB Atlas (Native Driver) |
| **Authentication** | BetterAuth v1.6.23 (JWT + Google OAuth) |
| **Image Hosting** | ImgBB API |
| **Animations** | Framer Motion 12.x |
| **Charts** | Recharts 3.x |
| **UI Framework** | Tailwind CSS 4.x |
| **Theme** | next-themes 0.4.x |
| **Icons** | Lucide React, React Icons |
| **Notifications** | React Toastify |
| **Fonts** | Hind Siliguri (Bengali), Manrope (Latin) |
| **Deployment** | Vercel (Frontend + Backend) |

---

## 📦 NPM Packages

### Frontend (`fosholbari`)

| Category | Package | Purpose |
|----------|---------|---------|
| **Framework** | `next@16.2.10` | App Router, SSR, routing |
| **UI/Styling** | `tailwindcss@4` | Utility-first CSS |
| **Theme** | `next-themes@0.4.6` | Dark/Light mode |
| **Animation** | `framer-motion@12` | Page & component animations |
| **Charts** | `recharts@3` | Farmer revenue analytics |
| **Auth** | `better-auth@1.6.23` | Auth client, session, JWT |
| **Icons** | `lucide-react@1.24`, `react-icons@5` | Icon libraries |
| **Notifications** | `react-toastify@11` | Toast notifications |

### Backend (`server`)

| Category | Package | Purpose |
|----------|---------|---------|
| **Server** | `express@5` | HTTP server & routing |
| **Database** | `mongodb@7` | Native MongoDB driver |
| **Auth** | `better-auth@1.6.23` | Auth server, JWT, Google OAuth |
| **Middleware** | `cors@2` | Cross-origin support |
| **Config** | `dotenv@17` | Environment variable management |

---

## 📁 Folder Structure

### Frontend
```
fosholbari/
├── public/
│   └── Assets/
│       ├── B1.jpg, B2.jpg, B3.jpg      # Banner images
│       ├── loginD.jpg / loginN.jpg      # Login page theme images
│       ├── RegD.png / RegN.jpg          # Registration theme images
│       ├── 404D.jpg / 404N.png          # 404 theme images
│       ├── UnauthoBgD.png               # Unauthorized page (Dark)
│       └── UnauthoBgN.png               # Unauthorized page (Light)
├── src/
│   ├── app/
│   │   ├── page.tsx                     # Home page
│   │   ├── layout.tsx                   # Root layout (fonts, Providers)
│   │   ├── providers.tsx                # ThemeProvider + ToastContainer
│   │   ├── globals.css                  # Global styles
│   │   ├── not-found.tsx                # Custom 404 page
│   │   ├── loading.tsx                  # Root loading (HarvestLoader)
│   │   ├── auth/                        # Login / Sign-up page
│   │   ├── explore/
│   │   │   ├── (overview)/              # Product listing with filters
│   │   │   └── [id]/                    # Product detail page
│   │   ├── demand/                      # Public demands page
│   │   ├── farmer-help/                 # Farmer help & guide page
│   │   └── dashboard/
│   │       ├── page.tsx                 # Dashboard role router
│   │       ├── buyer/
│   │       │   ├── page.tsx             # Buyer overview
│   │       │   ├── layout.tsx           # Buyer sidebar layout
│   │       │   ├── all-orders/          # Order history
│   │       │   ├── demand/              # My demands
│   │       │   ├── bazar-note/          # Bazar notes
│   │       │   └── profile/             # Profile management
│   │       ├── farmer/
│   │       │   ├── page.tsx             # Farmer overview (Recharts)
│   │       │   ├── layout.tsx           # Farmer sidebar layout
│   │       │   ├── add-item/            # Add new product
│   │       │   ├── my-item/             # My products
│   │       │   ├── order-track/         # Order tracking
│   │       │   └── profile/             # Profile management
│   │       └── admin/
│   │           ├── page.tsx             # Admin overview
│   │           ├── layout.tsx           # Admin sidebar layout
│   │           ├── users/               # User management
│   │           ├── products/            # Product management
│   │           ├── orders/              # All orders
│   │           └── demands/             # Demand management
│   ├── Components/
│   │   ├── loading/                     # Custom HarvestLoader animation
│   │   │   ├── HarvestLoader.tsx
│   │   │   ├── LoadingProvider.tsx
│   │   │   ├── SproutReveal.tsx
│   │   │   ├── Soil.tsx / SoilCrack.tsx / SoilParticles.tsx
│   │   │   ├── Seed.tsx
│   │   │   └── BrandText.tsx
│   │   ├── Navbar.tsx                   # Navigation bar
│   │   ├── Footer.tsx                   # Footer
│   │   ├── LayoutShell.tsx              # Main layout shell
│   │   ├── AuthSync.tsx                 # Session synchronizer
│   │   ├── Banner.tsx                   # Home banner
│   │   ├── Most.tsx                     # Popular products section
│   │   ├── Demand.tsx                   # Demands section
│   │   ├── Trust.tsx                    # Trust section
│   │   ├── WhyUs.tsx                    # Why FosholBari section
│   │   ├── HowWork.tsx                  # How it works section
│   │   └── Subscribe.tsx                # Subscribe section
│   └── lib/
│       ├── auth-client.ts               # BetterAuth client config
│       ├── data.ts                      # All API utility functions
│       └── jwt-helper.ts                # JWT token helper
├── next.config.ts
├── tsconfig.json
└── package.json
```

### Backend
```
server/
├── index.ts          # Express app — all API routes
├── auth.ts           # BetterAuth config (JWT, Google OAuth, MongoDB)
├── package.json
├── tsconfig.json
├── vercel.json       # Vercel serverless config
└── .env              # Environment variables
```

---

## 🚀 Installation Guide

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Google Cloud Console project (for OAuth)
- ImgBB account

### 1. Clone the Repositories

```bash
# Frontend
git clone https://github.com/fosholbari/fosholbari.git
cd fosholbari

# Backend (separate terminal)
git clone https://github.com/fosholbari/fosholbari-server.git
cd fosholbari-server
```

### 2. Install Dependencies

```bash
# Frontend
cd fosholbari
npm install

# Backend
cd fosholbari-server
npm install
```

### 3. Configure Environment Variables

See the [Environment Variables](#-environment-variables) section below.

### 4. Run the Backend

```bash
cd fosholbari-server
npm run dev
# Server runs on http://localhost:5000
```

### 5. Run the Frontend

```bash
cd fosholbari
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🔒 Environment Variables

### Client (Frontend) — `.env`

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Backend base URL (e.g. `http://localhost:5000`) |
| `NEXT_PUBLIC_EXPLORE_URL` | Products API endpoint |
| `NEXT_PUBLIC_ORDERS_URL` | Orders API endpoint |
| `NEXT_PUBLIC_DEMANDS_URL` | Demands API endpoint |
| `NEXT_PUBLIC_BAZAR_NOTES_URL` | Bazar notes API endpoint |
| `NEXT_PUBLIC_PROFILE_URL` | Profile API endpoint |
| `NEXT_PUBLIC_STATS_URL` | Stats API endpoint |
| `NEXT_PUBLIC_IMAGEBB_API` | ImgBB API key |

### Server (Backend) — `.env`

| Variable | Description |
|----------|-------------|
| `PORT` | Express server port (e.g. `5000`) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `CLIENT_URL` | Frontend URL (e.g. `http://localhost:3000`) |
| `BETTER_AUTH_URL` | Backend auth base URL |
| `BETTER_AUTH_SECRET` | BetterAuth secret key |
| `CLIENT_ID` | Google OAuth Client ID |
| `CLIENT_SECRET` | Google OAuth Client Secret |

> ⚠️ **Never commit `.env` files to version control.**

---

## 📡 API Overview

### Authentication (BetterAuth)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/sign-up/email` | Register with email & password |
| POST | `/api/auth/sign-in/email` | Login with email & password |
| POST | `/api/auth/sign-out` | Sign out current session |
| GET | `/api/auth/get-session` | Get current session & user data |
| GET | `/api/auth/sign-in/social` | Initiate Google OAuth login |
| GET | `/api/auth/callback/google` | Google OAuth callback |
| GET | `/api/auth/token` | Retrieve JWT token |

### Products (Explore)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/explore` | All products (search, filter, sort, paginate) |
| GET | `/explore/filters` | Available categories and tags |
| GET | `/explore/:id` | Single product detail |
| POST | `/explore` | Create a new product (Farmer) |
| PATCH | `/explore/:id` | Update a product (Farmer) |
| DELETE | `/explore/:id` | Delete a product (Farmer/Admin) |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/orders` | Order list (`?role=buyer` or `?role=farmer`) |
| POST | `/orders` | Place a new order |
| PATCH | `/orders/:id` | Update order status |

### Demands

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/demands` | All demands (`?my=true` for own only) |
| POST | `/demands` | Post a new demand |
| PATCH | `/demands/:id` | Update a demand |
| DELETE | `/demands/:id` | Delete a demand |
| POST | `/demands/:id/comments` | Add a proposal/comment to a demand |

### Bazar Notes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bazar-notes` | All personal bazar notes |
| POST | `/bazar-notes` | Create a new note |
| PATCH | `/bazar-notes/:id` | Update a note |
| DELETE | `/bazar-notes/:id` | Delete a note |

### Profile & Stats

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get own profile |
| PATCH | `/profile` | Update profile |
| GET | `/stats/farmer` | Farmer sales statistics |
| GET | `/stats/buyer` | Buyer order statistics |
| GET | `/stats/admin` | Admin platform statistics |

### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | All users |
| PATCH | `/admin/users/:id` | Change user role |
| DELETE | `/admin/users/:id` | Delete a user |
| GET | `/admin/orders` | All orders |
| PATCH | `/admin/orders/:id` | Update any order status |
| DELETE | `/admin/orders/:id` | Delete an order |
| DELETE | `/admin/explore/:id` | Delete any product |
| DELETE | `/admin/demands/:id` | Delete any demand |

---

## 🔐 Authentication Flow

FosholBari uses **BetterAuth v1.6.23** — a modern, framework-agnostic authentication library.

### Email & Password
1. User submits the signup form → BetterAuth creates the user in MongoDB
2. Default role is set to `Buyer`
3. On login, BetterAuth issues a **JWT** (7-day expiry) stored in a secure HttpOnly cookie
4. In production, cookies use `SameSite: None; Secure: true` for cross-origin support

### Google OAuth
1. User clicks "Continue with Google" → redirected to `/api/auth/sign-in/social`
2. BetterAuth handles the OAuth flow using `CLIENT_ID` and `CLIENT_SECRET`
3. On callback, BetterAuth creates or retrieves the user in MongoDB
4. Same JWT session flow applies

### JWT & Bearer Token
- BetterAuth's `jwt()` plugin is active — 7-day expiry
- `bearer()` plugin enables Authorization header support on API routes
- Frontend `jwtHelper` caches the token in localStorage
- All API calls include `Authorization: Bearer <token>` header

### Protected Routes
- Frontend checks `authClient.useSession()` — unauthenticated users are sent to `/auth`
- Role-based redirects: accessing `/dashboard/admin` as a Buyer results in a block
- Backend validates session and role before every sensitive operation

---

## 📊 Dashboard Overview

### 🛒 Buyer Dashboard
| Page | Description |
|------|-------------|
| Overview | Recent orders and quick statistics |
| All Orders | Full order list with status |
| My Demands | Manage own posted demands |
| Bazar Notes | Personal shopping list management |
| Profile | Update name, email, avatar, address, phone |

### 🌾 Farmer Dashboard
| Page | Description |
|------|-------------|
| Overview | Recharts AreaChart for monthly revenue, total products/orders stats |
| Add Product | Create a new listing with ImgBB image upload |
| My Products | All own products — edit and delete |
| Order Tracking | View all orders and update their status |
| Profile | Update bio, farm info, bKash/Nagad/bank details |

### 🛡️ Admin Dashboard
| Page | Description |
|------|-------------|
| Overview | Platform-wide statistics |
| Users | View all users, change roles, delete accounts |
| Products | View and delete any product |
| Orders | View all orders and update status |
| Demands | View and delete any demand |

---

## 📱 Responsive Design

FosholBari is fully responsive across all screen sizes:

- **Mobile (< 768px):** Single-column layouts, collapsible navigation, touch-friendly buttons
- **Tablet (768px–1024px):** Two-column product grid, adaptive sidebar navigation
- **Desktop (> 1024px):** Three-column product grid, full sidebar dashboard, expanded charts

Responsive behavior is implemented using **Tailwind CSS 4** responsive prefixes (`sm:`, `md:`, `lg:`) throughout all components.

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|---------------|
| **JWT Authentication** | 7-day tokens via BetterAuth JWT plugin, `HttpOnly` cookies |
| **Secure Cookies** | `SameSite: None; Secure: true` in production |
| **CORS** | Origin-whitelisted to `CLIENT_URL` only |
| **Role Validation** | Backend checks user role before every sensitive operation |
| **Bearer Token** | Authorization header verified on all API calls |
| **ObjectId Validation** | `ObjectId.isValid()` checked before all MongoDB queries |
| **Environment Variables** | All secrets stored in `.env`, never committed |

---

## ⚡ Performance Optimizations

- **Next.js App Router** — server and client components used appropriately for optimal rendering
- **React Compiler** — `babel-plugin-react-compiler` for automatic optimization
- **HarvestLoader** — custom loading animation prevents layout shift during data fetching
- **Framer Motion** — GPU-accelerated CSS transforms for smooth animations without repaints
- **Server-side Pagination** — only the current page of products is fetched from the database
- **`next/image`** — automatic image optimization (lazy loading, resizing, WebP conversion)
- **JWT Cache** — `jwtHelper` caches the token in localStorage to reduce repeated API calls
- **Lazy MongoDB Init** — serverless-safe connection that connects once per cold start and reuses

---

## 🔮 Future Improvements

1. **Real-Time Notifications** — WebSocket or SSE for live order and demand alerts
2. **Mobile App** — React Native app for iOS and Android
3. **Payment Integration** — bKash / Nagad / Stripe direct payment support
4. **Review & Rating System** — Star ratings for products and farmers
5. **AI Product Recommendations** — Personalized suggestions based on order history
6. **Delivery Tracking** — Real-time order location tracking
7. **Farmer Verification** — NID-based verification for trust and credibility
8. **Multi-language Support** — English alongside Bengali
9. **Advanced Analytics** — Monthly revenue trends, top-selling product charts
10. **SEO Optimization** — Dynamic `og:image` and metadata per product for social sharing

---

## 👨‍💻 Developer

<div align="center">

**FosholBari Team**
Full Stack MERN Developers

*Built with ❤️ using Next.js, Express, MongoDB, and BetterAuth*
*Made for the farmers of Bangladesh 🇧🇩*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

⭐ **If you found this project helpful, please give it a star!** ⭐

[🌐 Live Demo](https://fosholbari.vercel.app) &nbsp;|&nbsp;
[📁 Frontend Repo](https://github.com/fosholbari/fosholbari) &nbsp;|&nbsp;
[🔧 Backend Repo](https://github.com/fosholbari/fosholbari-server)

</div>