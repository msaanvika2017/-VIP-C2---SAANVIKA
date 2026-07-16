# RentEase - House Rent Management System

A complete full-stack House Rent Management System built using the MERN stack (MongoDB, Express, React, Node.js). It features secure user role authentications (Tenants & Admins), responsive premium glassmorphic interfaces, interactive property creation with file uploads, and a booking workflow.

---

## Technical Stack
*   **Frontend**: React.js, React Router, Axios, Tailwind CSS, Lucide Icons, Vite
*   **Backend**: Node.js, Express.js, Multer (file uploading), JWT & bcryptjs (authentication)
*   **Database**: MongoDB (Mongoose ODM)

---

## Features

### 👤 Regular User (Tenant)
1.  **Authentication**: Register with Name, Email, Password, and Phone. Secure login/logout.
2.  **Browsing**: Scan active rental properties with filter settings (Location, Bedroom count, Maximum Budget).
3.  **Details View**: View HD photo galleries, descriptions, amenities, and host contact numbers.
4.  **Booking Request**: Request bookings with a single click (automatically flags double bookings).
5.  **Dashboard**: View submission date, application ID, host phone number, and approval status.

### 🔑 Administrator
1.  **Consoles**: Dedicated dashboard displaying properties grid, requests tab, and users lists.
2.  **Property Management**: List new properties with multiple image uploads, title, location, price, and rooms. Edit or delete existing properties.
3.  **Booking Management**: Approve or reject tenant requests (approving automatically makes the house unavailable).
4.  **Users Directory**: View registered tenants and administrators.

---

## Directory Layout
```
house rent/
├── backend/
│   ├── config/          # DB connections
│   ├── controllers/     # Core route handling logics
│   ├── middleware/      # JWT guards, image uploads
│   ├── models/          # MongoDBSchemas
│   ├── routes/          # REST Endpoints
│   ├── uploads/         # Stored property images
│   ├── .env             # Secrets config
│   └── server.js        # Main entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/  # Navs, Footers, Protected routes
│   │   ├── context/     # Auth Context global store
│   │   ├── pages/       # Login, Register, Dashboards
│   │   └── utils/       # Axios API helper
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html
└── README.md
```

---

## Setup & Running Guide

### Prerequisites
Make sure you have **Node.js** (v16+) and **npm** installed on your system. If not, download and install Node.js from [nodejs.org](https://nodejs.org/).

### 1. Database Setup
You can use a local MongoDB instance or MongoDB Atlas:
*   **Local MongoDB**: Ensure MongoDB is running locally on `mongodb://localhost:27017/house-rent`.
*   **MongoDB Atlas (Cloud)**:
    1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    2. Retrieve your Connection String.
    3. Replace the `MONGO_URI` in `backend/.env` with your cluster string.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables in `backend/.env` if needed:
   *   `PORT`: Port for Express Server (default: `5000`)
   *   `MONGO_URI`: MongoDB connection string
   *   `JWT_SECRET`: Secret key for JWT hashing
   *   `CLIENT_URL`: URL of the React app (default: `http://localhost:5173` or `http://localhost:3000`)
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will boot up on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The client application will boot up on `http://localhost:5173`.*

---

## Backend API Documentation

### Auth Endpoints
*   `POST /api/auth/register` - Create user account (returns JWT).
*   `POST /api/auth/login` - Authenticate credentials (returns JWT).
*   `GET /api/auth/users` - Fetch list of all registered users (Admin only).

### Property Endpoints
*   `GET /api/properties` - Fetch all properties (supports search filters like `location`, `bedrooms`, `maxPrice`).
*   `GET /api/properties/:id` - Fetch single property details.
*   `POST /api/properties` - Create property listing with images (Admin only).
*   `PUT /api/properties/:id` - Update property details and images (Admin only).
*   `DELETE /api/properties/:id` - Delete property listing (Admin only).

### Booking Endpoints
*   `POST /api/bookings` - Submit rental booking request.
*   `GET /api/bookings/user/:id` - Fetch bookings submitted by user.
*   `GET /api/bookings` - Fetch all bookings in the system (Admin only).
*   `PUT /api/bookings/:id/status` - Update request status: `approved` or `rejected` (Admin only).
