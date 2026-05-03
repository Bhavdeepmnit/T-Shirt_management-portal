# 🚀 Free Deployment Guide — MNIT T-Shirt Portal

## Deployment Architecture

```
┌─────────────┐       ┌──────────────┐       ┌──────────────┐
│   Vercel     │       │  Render.com  │       │ MongoDB Atlas│
│  (Frontend)  │──────▶│  (Backend)   │──────▶│  (Database)  │
│  React App   │       │  Express API │       │  Free M0     │
│  FREE ✅     │       │  FREE ✅     │       │  FREE ✅     │
└─────────────┘       └──────────────┘       └──────────────┘
```

| Component | Platform | Free Tier Limits |
|-----------|----------|-----------------|
| Frontend | **Vercel** | Unlimited deploys, custom domain, HTTPS |
| Backend | **Render.com** | 750 hours/month, spins down after 15min inactivity |
| Database | **MongoDB Atlas** | 512 MB storage, shared cluster (M0) |

> [!NOTE]
> Render free tier **spins down** your backend after 15 min of no requests. First request after spin-down takes ~30-50 seconds. This is fine for a college project.

---

## Pre-requisites

Before starting, make sure you have:
- [x] A **GitHub account** (push your code to GitHub first)
- [x] MongoDB Atlas already set up (you already have this ✅)
- [x] Your project working locally

---

## Step 0: Push Code to GitHub

If you haven't already, push your project to GitHub:

```bash
cd "D:\Final Projects\T-Shirt_management_portal"

# Create .gitignore in root
# (Make sure node_modules and .env are ignored)

git init
git add .
git commit -m "Initial commit: MNIT T-Shirt Portal"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/T-Shirt_management_portal.git
git branch -M main
git push -u origin main
```

> [!IMPORTANT]
> Make sure `backend/.env` is in `.gitignore`! It contains your MongoDB password and JWT secrets. Only `.env.example` should be committed.

---

## Step 1: Deploy Backend on Render.com

### 1.1 — Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your **GitHub account** (easiest)

### 1.2 — Create a New Web Service

1. From the Render dashboard, click **"New +"** → **"Web Service"**
2. Select **"Build and deploy from a Git repository"** → Next
3. Connect your GitHub repo: `T-Shirt_management_portal`
4. Configure the service:

| Setting | Value |
|---------|-------|
| **Name** | `mnit-tshirt-api` |
| **Region** | Singapore (closest to India) or Oregon |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | **Free** |

### 1.3 — Add Environment Variables

Scroll down to **"Environment Variables"** section and add these one by one:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGODB_URI` | `mongodb+srv://2022ucp1717_db_user:bhavdeep%405577@cluster0.txawrfr.mongodb.net/mnit-tshirt?retryWrites=true&w=majority` |
| `JWT_SECRET` | `e44999f647bc06d7651d7b0392ea1b77db6c9d95f7b4ca3e424d165b3962fd64c24cdec59abb99b0525d91560b65b838ef6dca95d3421a96d8ebcb7a73fd9dae` |
| `JWT_EXPIRES_IN` | `7d` |
| `JWT_REFRESH_SECRET` | `490578a030dea9c1fb3ad6209a133e2db5775af730783a87ea064035b1f56b919b21a3f01a12bcc772ce22d9825a1562d387bc80682a14587b1f7d3684eade2d` |
| `JWT_REFRESH_EXPIRES_IN` | `30d` |
| `RATE_LIMIT_WINDOW_MS` | `900000` |
| `RATE_LIMIT_MAX_REQUESTS` | `100` |
| `FRONTEND_URL` | *(leave empty for now — we'll add after Vercel deploy)* |

### 1.4 — Deploy

1. Click **"Create Web Service"**
2. Wait 2-5 minutes for the build to complete
3. You'll see logs like:
   ```
   ✅ MongoDB connected: cluster0-shard-00-02.txawrfr.mongodb.net
   🚀 Server running on port 10000
   ```
4. Your backend URL will be something like:
   ```
   https://mnit-tshirt-api.onrender.com
   ```
5. **Copy this URL** — you'll need it for the frontend

### 1.5 — Verify Backend is Running

Open in browser:
```
https://mnit-tshirt-api.onrender.com/api/health
```

You should see:
```json
{"success": true, "message": "MNIT T-Shirt Portal API is running"}
```

### 1.6 — Seed the Database on Render

Since your database is already seeded locally and you're using the same MongoDB Atlas cluster, **your data is already there!** No need to seed again.

If you need to re-seed, you can use Render's **Shell** tab:
1. Go to your service on Render dashboard
2. Click **"Shell"** tab (may require upgrading, so skip if needed)
3. Run: `node scripts/seedSuperAdmin.js`

---

## Step 2: Deploy Frontend on Vercel

### 2.1 — Create Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with your **GitHub account**

### 2.2 — Import Your Project

1. From Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find and select your `T-Shirt_management_portal` repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Project Name** | `mnit-tshirt-portal` |
| **Framework Preset** | `Vite` (auto-detected) |
| **Root Directory** | Click **"Edit"** → type `frontend` → click **"Continue"** |
| **Build Command** | `npm run build` (default) |
| **Output Directory** | `dist` (default) |

### 2.3 — Add Environment Variables

Click **"Environment Variables"** and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://mnit-tshirt-api.onrender.com/api` |
| `VITE_BACKEND_URL` | `https://mnit-tshirt-api.onrender.com` |
| `VITE_APP_NAME` | `MNIT T-Shirt Portal` |

> [!IMPORTANT]
> Replace `mnit-tshirt-api` with your actual Render service name from Step 1.4

### 2.4 — Deploy

1. Click **"Deploy"**
2. Wait 1-2 minutes for the build
3. Your frontend URL will be something like:
   ```
   https://mnit-tshirt-portal.vercel.app
   ```
4. **Copy this URL**

---

## Step 3: Connect Frontend ↔ Backend (CORS)

### 3.1 — Update Render Environment Variable

1. Go back to [Render Dashboard](https://dashboard.render.com)
2. Click your `mnit-tshirt-api` service
3. Go to **"Environment"** tab
4. Find `FRONTEND_URL` and set it to:
   ```
   https://mnit-tshirt-portal.vercel.app
   ```
   > If Vercel gave you a different URL, use that one
5. Click **"Save Changes"**
6. Render will automatically redeploy (wait ~2 min)

### 3.2 — Update MongoDB Atlas Network Access

Your MongoDB Atlas might be restricted to your local IP. You need to allow Render's servers:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click your cluster → **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** → set to `0.0.0.0/0`
5. Click **"Confirm"**

> [!WARNING]
> `0.0.0.0/0` allows all IPs. This is fine for a free tier / college project. For production, you'd whitelist specific Render IPs.

---

## Step 4: Test Your Live Site

### 4.1 — Test the Flow

1. **Landing Page**: Open `https://mnit-tshirt-portal.vercel.app`
2. **Order Form**: Click "Order Now" → fill form → submit
3. **Admin Login**: Go to `/admin/login` → login with:
   ```
   Email: superadmin@mnit.ac.in
   Password: SuperSecure@MNIT2024
   ```
4. **Dashboard**: Check if data loads from the live backend

### 4.2 — Common Issues

| Problem | Solution |
|---------|----------|
| Login fails / "Network Error" | Check FRONTEND_URL on Render matches your Vercel URL exactly |
| Backend returns CORS error | Add your Vercel URL to FRONTEND_URL on Render (no trailing slash!) |
| Backend takes 30+ sec to respond | Render free tier spin-up — just wait, it'll wake up |
| MongoDB connection error | Check Atlas Network Access allows `0.0.0.0/0` |
| Blank page on Vercel | Make sure root directory is set to `frontend` |

---

## Summary: Your Live URLs

After completing all steps, you'll have:

| What | URL |
|------|-----|
| 🌐 **Live Website** | `https://mnit-tshirt-portal.vercel.app` |
| 🔧 **API Backend** | `https://mnit-tshirt-api.onrender.com` |
| 🩺 **Health Check** | `https://mnit-tshirt-api.onrender.com/api/health` |
| 🗄️ **Database** | MongoDB Atlas (same cluster you already use) |

---

## Automatic Deployments

Both platforms support **auto-deploy on git push**:

```bash
# Make a change locally
git add .
git commit -m "Fix: updated button color"
git push origin main

# ✅ Vercel auto-deploys frontend in ~1 min
# ✅ Render auto-deploys backend in ~3 min
```

---

## Cost: $0.00 💰

| Service | Plan | Monthly Cost |
|---------|------|-------------|
| Vercel | Hobby | **$0** |
| Render | Free | **$0** |
| MongoDB Atlas | M0 Shared | **$0** |
| **Total** | | **$0** |
