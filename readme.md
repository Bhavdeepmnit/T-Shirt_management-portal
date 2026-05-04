<!-- 
  ╔══════════════════════════════════════════════════════════╗
  ║              SEED DATA / QUICK REFERENCE                ║
  ╠══════════════════════════════════════════════════════════╣
  ║                                                          ║
  ║  Role            Email                     Password      ║
  ║  ──────────────  ────────────────────────  ────────────  ║
  ║  Super Admin     superadmin@mnit.ac.in     SuperSecure@MNIT2024  ║
  ║  CSE Admin       cse.poc@mnit.ac.in        Admin@123     ║
  ║  ECE Admin       ece.poc@mnit.ac.in        Admin@123     ║
  ║  EE Admin        ee.poc@mnit.ac.in         Admin@123     ║
  ║  Civil Admin     civil.poc@mnit.ac.in      Admin@123     ║
  ║  Meta Admin      meta.poc@mnit.ac.in       Admin@123     ║
  ║  Mech Admin      mech.poc@mnit.ac.in       Admin@123     ║
  ║  Chem Admin      chem.poc@mnit.ac.in       Admin@123     ║
  ║                                                          ║
  ║  Students: ~70 demo students seeded across all branches  ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
-->

<p align="center">
  <img src="https://img.shields.io/badge/MNIT-Jaipur-4f46e5?style=for-the-badge&logoColor=white" alt="MNIT Jaipur" />
  <img src="https://img.shields.io/badge/Stack-MERN-10b981?style=for-the-badge&logo=mongodb&logoColor=white" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Version-1.0.0-f97316?style=for-the-badge" alt="Version" />
</p>

<h1 align="center">👕 T-Shirt Order Management Portal</h1>

<p align="center">
  <strong>Malaviya National Institute of Technology (MNIT), Jaipur</strong><br/>
  A centralized, role-based web application for managing batch T-shirt orders<br/>across all 7 engineering branches.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-getting-started">Setup</a> •
  <a href="#-default-credentials">Credentials</a> •
  <a href="#-api-endpoints">API</a>
</p>

---

## 📋 Overview

This portal streamlines the entire lifecycle of batch T-shirt ordering — from student form submission to payment verification to dispatch-ready Excel exports. It features a **triple-tiered RBAC system** with dedicated dashboards for each role.

| Role | Access Level | What They Can Do |
|------|-------------|------------------|
| **Super Admin** | Full System | Manage admins, view all students, set pricing, lock form permanently |
| **Branch Admin** | Branch Only | View branch students, confirm/reject payments, export Excel |
| **Student** | Public Form | Submit order (no login needed), see branch POC contact |

---

## ✨ Features

| Category | Features |
|----------|----------|
| **🎯 Core** | Public order form · Payment confirm/reject · Global form lock · Excel export · Size chart |
| **🛡️ Security** | JWT auth (access + refresh) · Bcrypt hashing · Rate limiting · Helmet · Joi validation · CORS |
| **📊 Analytics** | Branch bar chart · Size pie chart · KPI cards · Admin performance table |
| **🔔 Real-Time** | Socket.io admin notifications · Room-based architecture |
| **🎨 Design** | Glassmorphism UI · Micro-animations · Responsive layout · Inter typography |

---

## 🛠️ Tech Stack

### Backend

| Package | Purpose |
|---------|---------|
| Express.js `4.21` | REST API framework |
| Mongoose `7.8` | MongoDB ODM |
| jsonwebtoken `9.0` | JWT authentication |
| bcryptjs `2.4` | Password hashing (12 rounds) |
| Socket.io `4.7` | Real-time notifications |
| Joi `17.13` | Input validation |
| xlsx (SheetJS) `0.18` | Excel file generation |
| Helmet `7.1` | HTTP security headers |
| express-rate-limit `7.4` | API rate limiting |
| Morgan `1.10` | HTTP request logging |

### Frontend

| Package | Purpose |
|---------|---------|
| React `18` + Vite `8` | UI framework + build tool |
| Tailwind CSS `3.x` | Utility-first CSS |
| React Router `6.x` | Client-side routing |
| Axios `1.x` | HTTP client + JWT interceptors |
| Recharts `2.x` | Charts (bar, pie) |
| React Hot Toast `2.x` | Toast notifications |
| React Icons `5.x` | Icon library |
| Socket.io Client `4.x` | Real-time WebSocket |

---

## 📁 Project Structure

```
T-Shirt_management_portal/
│
├── backend/
│   ├── server.js                        # Entry point
│   ├── package.json
│   ├── .env.example                     # Env template
│   ├── .env                             # Your env (gitignored)
│   │
│   ├── scripts/
│   │   ├── seedSuperAdmin.js            # npm run seed
│   │   └── seedDemoData.js              # npm run seed:demo
│   │
│   └── src/
│       ├── config/
│       │   ├── db.js                    # MongoDB connection
│       │   └── socket.js               # Socket.io + JWT auth
│       │
│       ├── models/
│       │   ├── User.model.js            # Admin accounts
│       │   ├── Student.model.js         # Student orders
│       │   ├── FormSettings.model.js    # Form lock singleton
│       │   └── Notification.model.js    # Notifications
│       │
│       ├── middlewares/
│       │   ├── auth.middleware.js        # JWT verify + role guard
│       │   ├── ownBranch.middleware.js   # Branch isolation
│       │   ├── formLock.middleware.js    # Block when locked
│       │   └── rateLimiter.js           # Rate limiting
│       │
│       ├── controllers/
│       │   ├── auth.controller.js       # Login/logout/refresh
│       │   ├── superadmin.controller.js # Dashboard, CRUD, lock
│       │   ├── admin.controller.js      # Branch ops, payments
│       │   └── student.controller.js    # Order submission
│       │
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── superadmin.routes.js
│       │   ├── admin.routes.js
│       │   └── student.routes.js
│       │
│       ├── services/
│       │   ├── notification.service.js
│       │   └── excel.service.js         # .xlsx generation
│       │
│       └── utils/
│           ├── asyncHandler.js
│           ├── apiResponse.js
│           └── validators.js            # Joi schemas
│
├── frontend/
│   ├── index.html
│   ├── tailwind.config.js
│   ├── .env
│   │
│   └── src/
│       ├── App.jsx                      # Router + AuthProvider
│       ├── main.jsx
│       ├── index.css                    # Design system
│       │
│       ├── api/                         # Axios API modules
│       │   ├── axios.js                 # Instance + interceptors
│       │   ├── auth.api.js
│       │   ├── superadmin.api.js
│       │   ├── admin.api.js
│       │   └── student.api.js
│       │
│       ├── context/AuthContext.jsx       # Auth state
│       ├── hooks/useAuth.js
│       ├── hooks/useDebounce.js
│       ├── utils/constants.js
│       ├── utils/formatters.js
│       │
│       ├── components/shared/           # Reusable UI
│       │   ├── ProtectedRoute.jsx
│       │   ├── Navbar.jsx
│       │   ├── Sidebar.jsx
│       │   ├── LoadingSpinner.jsx
│       │   ├── ConfirmationDialog.jsx
│       │   ├── SearchInput.jsx
│       │   └── Pagination.jsx
│       │
│       └── pages/
│           ├── public/
│           │   ├── LandingPage.jsx
│           │   ├── AdminLogin.jsx
│           │   ├── OrderForm.jsx
│           │   ├── NotFound.jsx
│           │   └── Unauthorized.jsx
│           ├── superadmin/
│           │   ├── SuperAdminLayout.jsx
│           │   ├── Dashboard.jsx
│           │   ├── AdminManagement.jsx
│           │   ├── AllStudents.jsx
│           │   └── FormSettings.jsx
│           └── admin/
│               ├── AdminLayout.jsx
│               ├── Dashboard.jsx
│               └── StudentsList.jsx
│
└── readme.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB** Atlas cluster (or local)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/T-Shirt_management_portal.git
cd T-Shirt_management_portal
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env from template
cp .env.example .env

# ⚠️ Edit .env → paste your MongoDB URI
# If password has @ in it, encode as %40
# Example: mongodb+srv://user:password%40mnit@cluster0.xxx.mongodb.net/mnit-tshirt
```

### 3. Seed the Database

```bash
# Create Super Admin account
npm run seed
# Output: ✅ Super Admin created: superadmin@mnit.ac.in

# Create demo admins + ~70 students (optional but recommended)
npm run seed:demo
# Output: ✅ Admin created for CSE, ECE, EE, Civil, Meta, Mech, Chem
```

### 4. Start Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm install
npm run dev
```

### 5. Open in Browser

| Page | URL |
|------|-----|
| 🏠 Home | http://localhost:5173 |
| 📝 Order Form | http://localhost:5173/order |
| 🔐 Admin Login | http://localhost:5173/admin/login |
| 📊 Super Admin | http://localhost:5173/superadmin/dashboard |
| 📊 Admin Panel | http://localhost:5173/admin/dashboard |
| 🩺 Health Check | http://localhost:5000/api/health |

---

## 🔑 Default Credentials

> ⚠️ **Change these in production!**

### Super Admin

```
Email:    superadmin@mnit.ac.in
Password: SuperSecure@MNIT2024
```

### Branch Admins (after `npm run seed:demo`)

| Branch | Email | Password |
|--------|-------|----------|
| CSE | `cse.poc@mnit.ac.in` | `Admin@123` |
| ECE | `ece.poc@mnit.ac.in` | `Admin@123` |
| EE | `ee.poc@mnit.ac.in` | `Admin@123` |
| Civil | `civil.poc@mnit.ac.in` | `Admin@123` |
| Meta | `meta.poc@mnit.ac.in` | `Admin@123` |
| Mech | `mech.poc@mnit.ac.in` | `Admin@123` |
| Chem | `chem.poc@mnit.ac.in` | `Admin@123` |

### Students

Students **do not need to login** — they access `/order` directly.

---

## 🌐 API Endpoints

**Base URL:** `http://localhost:5000/api`

### 🔓 Public (No Auth)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/student/form-status` | Check if form is open |
| `POST` | `/student/order` | Submit T-shirt order |
| `GET` | `/student/check/:id` | Check duplicate submission |
| `GET` | `/student/branch-admin/:branch` | Get branch POC info |
| `POST` | `/auth/admin/login` | Admin login |
| `POST` | `/auth/refresh` | Refresh JWT token |

### 🔐 Admin (Requires JWT)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/admin/dashboard` | Branch dashboard stats |
| `GET` | `/admin/students` | List branch students |
| `PUT` | `/admin/student/:id/confirm-payment` | Confirm payment |
| `PUT` | `/admin/student/:id/reject-payment` | Reject payment |
| `GET` | `/admin/students/export` | Download Excel file |

### 👑 Super Admin (Requires JWT + superadmin role)

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/superadmin/dashboard` | Global dashboard |
| `POST` | `/superadmin/admin` | Create admin |
| `GET` | `/superadmin/admins` | List all admins |
| `PUT` | `/superadmin/admin/:id` | Update admin |
| `DELETE` | `/superadmin/admin/:id` | Delete admin |
| `GET` | `/superadmin/students` | List all students |
| `PUT` | `/superadmin/student/:id` | Edit student |
| `DELETE` | `/superadmin/student/:id` | Delete student |
| `GET` | `/superadmin/form/settings` | Get form config |
| `PUT` | `/superadmin/form/settings` | Update price/deadline |
| `POST` | `/superadmin/form/lock` | **Permanently** lock form |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mnit-tshirt

JWT_SECRET=<64-char-random-string>
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=<64-char-random-string>
JWT_REFRESH_EXPIRES_IN=30d

SUPER_ADMIN_EMAIL=superadmin@mnit.ac.in
SUPER_ADMIN_PASSWORD=SuperSecure@MNIT2024
SUPER_ADMIN_NAME=Super Admin MNIT

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
VITE_APP_NAME=MNIT T-Shirt Portal
```

---

## 📜 npm Scripts

| Location | Command | What It Does |
|----------|---------|--------------|
| Backend | `npm run dev` | Start with nodemon (auto-reload) |
| Backend | `npm start` | Start with node (production) |
| Backend | `npm run seed` | Create Super Admin + FormSettings |
| Backend | `npm run seed:demo` | Create 7 admins + ~70 students |
| Frontend | `npm run dev` | Vite dev server (port 5173) |
| Frontend | `npm run build` | Production build → `dist/` |
| Frontend | `npm run preview` | Preview production build |

---

## 🧪 User Flows

### 📝 Student Flow
```
Visit /  →  Click "Order Now"  →  Fill form  →  Submit
→  See branch POC contact info  →  Pay POC offline  →  Done
```

### 👤 Admin Flow
```
Login at /admin/login  →  View branch dashboard
→  "My Students" → Confirm ✓ or Reject ✗ payments
→  "Export Excel" → Download spreadsheet
```

### 👑 Super Admin Flow
```
Login at /admin/login  →  View global dashboard
→  "Manage Admins" → Create/edit/delete POCs
→  "All Students" → Search, filter, edit
→  "Form Settings" → Set price, deadline, lock form
```

---

## 🗃️ Database Collections

| Collection | Documents | Purpose |
|------------|-----------|---------|
| `users` | Super Admin + Branch Admins | Role-based admin accounts |
| `students` | Student orders | Name, branch, size, payment status |
| `formsettings` | 1 (singleton) | Form open/lock state, price, deadline |
| `notifications` | Per-student | Payment confirmations, form lock alerts |

---

## 🔒 Security Checklist

- [x] Bcrypt password hashing (12 salt rounds)
- [x] JWT access tokens (short-lived) + refresh tokens
- [x] Rate limiting — 10 login attempts / 15 min
- [x] Helmet.js security headers
- [x] Joi schema validation on all request bodies
- [x] CORS restricted to frontend origin only
- [x] Branch isolation middleware (admin can't see other branches)
- [x] Sensitive fields auto-stripped from JSON responses
- [x] Mongoose parameterized queries (no injection)

---

## 👨‍💻 Author

**MNIT Jaipur — Batch 2024**

---

<p align="center">Made with ❤️ for MNIT Jaipur</p>
