# 🚀 Quick Setup Guide - Beer8 Restaurant Website

## Prerequisites Check

Before you begin, ensure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ MySQL 8.0+ installed OR Docker installed
- ✅ npm installed (`npm --version`)

## Option 1: Docker Setup (Recommended)

This is the easiest way to get started!

### Step 1: Clone & Navigate
```bash
git clone https://github.com/KortanPRQ/beer8.md.git
cd beer8.md
```

### Step 2: Environment Setup
```bash
# Copy environment file
cp .env.example .env

# Edit .env if needed (default values work with Docker)
# The default settings are already configured for Docker
```

### Step 3: Start MySQL with Docker
```bash
# Start MySQL container
docker-compose up -d

# Wait ~10 seconds for MySQL to be ready
sleep 10
```

### Step 4: Install Dependencies
```bash
# Install all dependencies (root, client, and server)
npm install
```

### Step 5: Setup Database
```bash
# This creates all tables and seeds data
npm run db:setup
```

Expected output:
```
🔧 Setting up Beer8 database...
✅ Database connection established successfully
📋 Executing SQL statements...
✅ Database schema created successfully!
🌱 Seeding database...
✅ All seed data inserted successfully!
```

### Step 6: Start Development Servers
```bash
# This starts both frontend and backend
npm run dev
```

You should see:
```
🍺 =====================================
🍺 Beer8 Server running on port 5000
🍺 Environment: development
🍺 API: http://localhost:5000/api
🍺 =====================================

VITE ready in XXX ms
➜  Local:   http://localhost:5173/
```

### Step 7: Open in Browser
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

---

## Option 2: Local MySQL Setup

If you already have MySQL installed locally:

### Step 1: Clone & Navigate
```bash
git clone https://github.com/KortanPRQ/beer8.md.git
cd beer8.md
```

### Step 2: Create Database
```bash
# Log into MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE beer8_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'beer8_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON beer8_db.* TO 'beer8_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Configure Environment
```bash
# Copy environment file
cp .env.example .env

# Edit .env with your MySQL settings
nano .env  # or use any editor
```

Update these values in `.env`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=beer8_user
DB_PASSWORD=your_password
DB_NAME=beer8_db
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Setup Database
```bash
npm run db:setup
```

### Step 6: Start Development
```bash
npm run dev
```

---

## 🎯 First Steps After Setup

### 1. Test the Homepage
Visit: http://localhost:5173

You should see the Beer8 homepage with:
- Hero section
- Navigation menu
- Theme toggle (sun/moon icon)
- Language switcher (RU/RO/EN)

### 2. Try Changing Language
Click on RU, RO, or EN buttons in the header to see the interface language change.

### 3. Try Theme Toggle
Click the sun/moon icon to switch between light and dark themes.

### 4. Login as Admin
1. Click "Войти" (Login) in the header
2. Use these credentials:
   - Email: `admin@beer8.md`
   - Password: `admin123`
3. Click "Войти" (Login button)

### 5. Test Menu API
Open in browser or use curl:
```bash
# Get all categories
curl http://localhost:5000/api/menu/categories

# Get menu items
curl http://localhost:5000/api/menu/items

# Get items in Russian
curl "http://localhost:5000/api/menu/items?language=ru"

# Get items in Romanian
curl "http://localhost:5000/api/menu/items?language=ro"

# Search items
curl "http://localhost:5000/api/menu/items?search=burger"
```

### 6. Test Reservation API
```bash
# Get zones
curl http://localhost:5000/api/reservations/zones

# Create a reservation (example)
curl -X POST http://localhost:5000/api/reservations \
  -H "Content-Type: application/json" \
  -d '{
    "zoneId": 1,
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "guestPhone": "+37300000000",
    "reservationDate": "2025-12-20",
    "reservationTime": "18:00",
    "numberOfGuests": 4
  }'
```

---

## 🐛 Troubleshooting

### "Database connection failed"
- Check if MySQL is running: `docker-compose ps` or `mysql -u root -p`
- Verify credentials in `.env`
- Check if port 3306 is available

### "Port 5000 already in use"
- Change PORT in `.env` to another port (e.g., 5001)
- Or stop the process using port 5000

### "Port 5173 already in use"
- Vite will automatically try the next available port
- Or configure in `client/vite.config.ts`

### Dependencies installation fails
```bash
# Try clearing npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database setup fails
```bash
# Check MySQL is running
docker-compose ps

# Restart MySQL
docker-compose down
docker-compose up -d
sleep 10

# Try setup again
npm run db:setup
```

---

## 📱 Testing on Mobile

### Using ngrok (expose local server)
```bash
# Install ngrok if you haven't
npm install -g ngrok

# Expose backend
ngrok http 5000

# Expose frontend
ngrok http 5173

# Update CLIENT_URL in .env to use the ngrok URL
```

### Using local network
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Linux/Mac)
2. Access from mobile: `http://YOUR_IP:5173`
3. Update `.env` with: `CLIENT_URL=http://YOUR_IP:5173`

---

## 🔄 Daily Development Workflow

### Starting Work
```bash
# Start MySQL (if using Docker)
docker-compose up -d

# Start development servers
npm run dev
```

### Stopping
```bash
# Stop dev servers: Ctrl+C

# Stop MySQL (if using Docker)
docker-compose down
```

### Resetting Database
```bash
# WARNING: This deletes all data and recreates everything
npm run db:setup
```

---

## 📊 Checking What's Working

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-12-09T...",
  "environment": "development"
}
```

### Database Connection
Check server logs when you run `npm run dev`, you should see:
```
✅ Database connection established successfully
```

### Seed Data Verification
```bash
# Login to MySQL
mysql -u beer8_user -p beer8_db

# Check tables
SHOW TABLES;

# Count menu items
SELECT COUNT(*) FROM menu_items;
# Should return 80+

# Check categories
SELECT * FROM menu_categories ORDER BY display_order;
# Should return 18 categories
```

---

## ✅ Success Checklist

After setup, you should be able to:
- [ ] See the homepage at http://localhost:5173
- [ ] Change language (RU/RO/EN)
- [ ] Toggle theme (light/dark)
- [ ] Login as admin
- [ ] View menu items in different languages
- [ ] Create a reservation
- [ ] See the B8 logo in the header

If all checked, you're ready to develop! 🎉

---

## 📚 Next Steps

1. Read `IMPLEMENTATION_SUMMARY.md` to understand what's built
2. Check `README.md` for detailed documentation
3. Explore the code structure
4. Start implementing remaining features

## 🆘 Need Help?

- Check the main `README.md`
- Review `IMPLEMENTATION_SUMMARY.md`
- Check error messages in terminal
- Verify `.env` configuration
- Ensure all prerequisites are installed

---

**Happy Coding! 🍺**
