# 🏠 RentEase - House Rent Application

A full-stack House Rent Application built with **React** and **JSON Server**.  
**Designed & Developed by: Saanvika**  
📧 Contact: xyz@gmail.com

---

## 🚀 Features

### For Tenants
- 🔍 Browse and search properties with advanced filters
- 📅 Book property visits directly
- ❤️ Save/wishlist favourite properties
- ⭐ Write reviews and rate properties
- 📊 Personal dashboard with booking history

### For Landlords
- 🏠 List and manage multiple properties
- ✏️ Edit property details anytime
- 📋 View and manage booking requests (confirm/decline)
- 📊 Dashboard with stats and analytics
- 🔄 Toggle property availability

### General
- 🔐 User authentication (Login / Register)
- 👥 Role-based access (Tenant / Landlord)
- 📱 Fully responsive (mobile-friendly)
- 💾 Persistent data with JSON Server
- 🎨 Professional UI with clean design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Pure CSS with CSS Variables |
| Backend | JSON Server (REST API mock) |
| Database | db.json (file-based) |
| Fonts | Google Fonts (Inter + Playfair Display) |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v16+ installed
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/house-rent-app.git
cd house-rent-app

# 2. Install dependencies
npm install

# 3. Start both React + JSON Server together
npm start
```

The app will open at: **http://localhost:3000**  
JSON Server API runs at: **http://localhost:3001**

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Tenant | tenant@demo.com | tenant123 |
| Landlord | landlord@demo.com | landlord123 |

---

## 📁 Project Structure

```
house-rent-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   └── PropertyCard.js
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── PropertyContext.js
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Properties.js
│   │   ├── PropertyDetail.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── TenantDashboard.js
│   │   ├── LandlordDashboard.js
│   │   ├── AddProperty.js
│   │   ├── EditProperty.js
│   │   ├── Contact.js
│   │   └── About.js
│   ├── App.js
│   ├── App.css
│   └── index.js
├── db.json          ← Database (JSON Server)
├── package.json
└── README.md
```

---

## 📦 How to Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: RentEase House Rent Application"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/house-rent-app.git
git push -u origin main
```

---

## 📄 License

This project was created as an academic submission.  
© 2024 Saanvika — All rights reserved.
