# 🍺 Beer8 Restaurant Website

A cutting-edge, full-stack restaurant website for Beer8 - Premium craft beer restaurant in Bălți, Moldova.

## 🚀 Features

### Complete Full-Stack Application
- **Full-stack TypeScript**: React + Vite frontend, Node.js + Express backend
- **Multi-language Support**: Russian, Romanian, and English (i18next) ✅
- **Dark/Light Theme**: Automatic theme detection with manual override ✅
- **Custom Reservation System**: Interactive calendar with zone selection ✅
- **Shopping Cart**: Full cart functionality with session persistence ✅
- **Coupon System**: QR code generation for discounts ✅
- **Blog System**: Posts, categories, and comments ✅
- **Gallery**: Masonry layout with lightbox viewer ✅
- **User Profiles**: Reservations and coupons management ✅
- **Admin Panel**: Complete CRUD operations (backend ready) 
- **Role-Based Access**: Owner, Administrator, Manager roles ✅
- **Secure Authentication**: JWT-based with bcrypt password hashing ✅
- **MySQL Database**: Comprehensive schema with 20+ tables ✅
- **Responsive Design**: Mobile-first approach with glassmorphism effects ✅
- **SEO Optimized**: Meta tags and semantic HTML ✅

## 📋 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- React Router
- i18next (internationalization)
- Three.js / React Three Fiber
- Framer Motion (animations)
- React Hook Form
- Zustand (state management)
- Axios

### Backend
- Node.js
- Express
- TypeScript
- MySQL 8
- JWT Authentication
- bcryptjs
- Nodemailer
- QRCode generation
- Express Rate Limiting
- Helmet (security)
- CORS

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Quick Start (Linux Fedora)

1. **Clone the repository**
```bash
git clone https://github.com/KortanPRQ/beer8.md.git
cd beer8.md
```

2. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

3. **Install dependencies**
```bash
npm install
```

4. **Setup database**
```bash
# Option 1: Using Docker Compose (recommended)
docker-compose up -d

# Option 2: Using local MySQL
# Make sure MySQL is running and credentials are configured in .env
npm run db:setup
```

5. **Start development servers**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📦 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run db:setup` - Create database schema and seed initial data
- `npm start` - Start production server

### Client (Frontend)
```bash
cd client
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Server (Backend)
```bash
cd server
npm run dev      # Start with hot reload (tsx watch)
npm run build    # Compile TypeScript
npm start        # Start production server
npm run db:setup # Setup database
npm run db:seed  # Seed data only
```

## 🗄️ Database Schema

The application uses MySQL with 20+ tables including:

- **Users & Auth**: users, user_sessions, password_resets, user_preferences
- **Menu**: menu_categories, menu_items, menu_item_translations, beer_pairings, allergens
- **Orders**: carts, cart_items, orders, order_items
- **Coupons**: coupons, coupon_usage, user_coupons
- **Reservations**: reservations, reservation_zones, time_slots
- **Content**: blog_posts, blog_categories, blog_comments, gallery_images, gallery_categories
- **System**: site_settings, activity_logs, admin_roles, admin_permissions

## 🔐 Default Admin Credentials

After running `npm run db:setup`, you can login with:
- **Email**: admin@beer8.md
- **Password**: admin123

**⚠️ Change these credentials immediately in production!**

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Menu
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/items` - Get menu items (with filters, search, sort)
- `GET /api/menu/items/:id` - Get item details with allergens and pairings

### Reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/:id` - Get reservation details
- `GET /api/reservations/user/my-reservations` - Get user reservations
- `GET /api/reservations/zones` - Get available zones

### Shopping Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item quantity
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart

### Coupons
- `POST /api/coupons/generate` - Generate new coupon with QR code
- `GET /api/coupons/my-coupons` - Get user's coupons
- `GET /api/coupons/validate/:code` - Validate coupon code
- `POST /api/coupons/apply` - Apply coupon to order

### Blog
- `GET /api/blog/posts` - Get all posts (with pagination, search)
- `GET /api/blog/posts/:slug` - Get specific post
- `GET /api/blog/categories` - Get blog categories
- `POST /api/blog/comments` - Add comment to post

### Admin (Protected)
- `GET /api/admin/dashboard` - Dashboard stats
- `CRUD /api/admin/menu` - Menu management
- `CRUD /api/admin/reservations` - Reservations management
- `CRUD /api/admin/users` - Users management

## 🎨 Design System

### Color Palette
- Deep Amber: `#D97706`
- Copper: `#B45309`
- Dark Wood: `#44403C`
- Cream Foam: `#FEF3C7`
- Gold: `#EAB308`

### Typography
- Font Family: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Base Size: 16px
- Headings: 700 weight

### Components
- Glassmorphism effects with backdrop-filter
- Smooth transitions (0.2s - 0.3s)
- Card-based layouts
- Hover animations

## 📱 Pages

1. **Home** - Hero section, featured items, specials carousel ✅
2. **Menu** - 18 categories with filtering, search, sorting, grid/list view ✅
3. **About** - Mission statement, history, team ✅
4. **Gallery** - Masonry layout with lightbox and category filters ✅
5. **Reservations** - Interactive calendar, zone selection, time slots ✅
6. **Contacts** - Map integration, contact form, restaurant info ✅
7. **Blog** - Posts with categories, featured posts, comments ✅
8. **Profile** - User dashboard, reservations history, coupons with QR codes ✅
9. **Login/Register** - Authentication with form validation ✅
10. **Admin Panel** - Complete management system (backend ready)

## 🔒 Security Features

- ✅ SQL Injection Prevention (parameterized queries)
- ✅ Password Hashing (bcrypt with 12 rounds)
- ✅ CSRF Protection
- ✅ Rate Limiting
- ✅ Secure Sessions (httpOnly cookies)
- ✅ Input Validation & Sanitization
- ✅ XSS Prevention
- ✅ Helmet Security Headers
- ✅ CORS Configuration

## 🌍 Internationalization

Supported languages:
- 🇷🇺 Russian (ru)
- 🇷🇴 Romanian (ro)
- 🇬🇧 English (en)

Language auto-detection based on browser settings with manual override.

## 📄 License

MIT License - Created by Beer8 Team © 2025

## 📞 Contact

**Beer8 Restaurant**
- Address: Strada Conev 34, Bălți MD-3100, Moldova
- Phone: +373 612 88 880
- Email: info@beer8.md
- Facebook: https://facebook.com/beer8md
- Instagram: https://instagram.com/beer8md

## 🤝 Contributing

This is a private project for Beer8 Restaurant. For any issues or suggestions, please contact the development team.

---

**Made with ❤️ and 🍺 by Beer8 Team**