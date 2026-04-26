# Deploy Backend (Render) + Frontend (Vercel)

## Architecture
```
Frontend (Vercel) → Backend API (Render) → Supabase Database
```

---

## PART 1: Deploy Backend to Render (5 minutes)

### Step 1: Connect Repository to Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Select **"Build and deploy from a Git repository"**
4. Click **"Connect account"** and authorize GitHub
5. Select repository: `Smart-Attendance`
6. Click **"Connect"**

### Step 2: Configure Backend Service

| Field | Value |
|-------|-------|
| **Name** | `smart-attendance-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | Free |

### Step 3: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** for each:

```
NODE_ENV = production
SUPABASE_URL = https://dxjsmxnfgapfpmtajefm.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET = rfid_attendance_secret_key_2024
CORS_ORIGIN = https://your-vercel-frontend-url.vercel.app
```

> ⚠️ You'll add the exact Vercel URL after deploying frontend

### Step 4: Deploy

Click **"Create Web Service"** and wait for deployment ✅

**Backend URL will be**: `https://smart-attendance-backend.onrender.com`

---

## PART 2: Deploy Frontend to Vercel (5 minutes)

### Step 1: Connect Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Paste: `https://github.com/Yayan0421/Smart-Attendance.git`
5. Click **"Import"**

### Step 2: Configure Project

| Field | Value |
|-------|-------|
| **Project Name** | `smart-attendance` |
| **Framework** | `Vite` |
| **Root Directory** | `frontend` |

### Step 3: Add Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_URL = https://smart-attendance-backend.onrender.com
```

> ℹ️ Use the Render backend URL from PART 1

### Step 4: Deploy

Click **"Deploy"** and wait ✅

**Frontend URL will be**: `https://smart-attendance.vercel.app` (or custom)

---

## PART 3: Update Backend CORS (Required!)

### Step 1: Update Render Environment Variable

1. Go to Render Dashboard → Select `smart-attendance-backend` service
2. Go to **"Environment"** tab
3. Find `CORS_ORIGIN` variable
4. Change value to your Vercel frontend URL
5. Click **"Save"**
6. Service will auto-redeploy ✅

**Example**:
```
CORS_ORIGIN = https://smart-attendance.vercel.app
```

---

## VERIFICATION

### Test Backend
```bash
curl https://smart-attendance-backend.onrender.com/logs
# Should return: []
```

### Test Frontend
Open in browser:
```
https://smart-attendance.vercel.app
```

### Test RFID Endpoint
```bash
curl -X POST https://smart-attendance-backend.onrender.com/rfid-scan \
  -H "Content-Type: application/json" \
  -d '{"uid":"A1B2C3D4"}'

# Should return: { "status": "success", "action": "TIME IN", ... }
```

---

## Features by Platform

### Render (Backend)
✅ Node.js runtime  
✅ Automatic HTTPS  
✅ GitHub auto-deploy  
✅ Free tier available  
⏸️ May sleep after 15 min inactivity (free plan)

### Vercel (Frontend)
✅ Optimized for React/Vite  
✅ Serverless Functions  
✅ Global CDN  
✅ Free tier generous  
✅ Fast cold starts  
✅ Built-in analytics

### Supabase (Database)
✅ PostgreSQL cloud database  
✅ Automatic backups  
✅ Real-time subscriptions  
✅ Free tier with limits

---

## Troubleshooting

### Frontend shows "Cannot reach API"
- ✅ Check `VITE_API_URL` in Vercel environment
- ✅ Verify Render backend is running: https://dashboard.render.com
- ✅ Check CORS_ORIGIN in Render matches Vercel URL

### Backend returns CORS error
- ✅ Update `CORS_ORIGIN` in Render to match Vercel URL exactly
- ✅ Wait ~2 min for Render to redeploy

### Render backend sleeping (free plan)
- 💡 Upgrade to paid plan, or
- 💡 Use https://uptimerobot.com to ping endpoint every 5 minutes

### Vercel deployment fails
- ✅ Check `frontend/package.json` has build script
- ✅ Check Node version: `18.x` or higher

---

## Useful Dashboards

| Service | Dashboard |
|---------|-----------|
| **Render** | https://dashboard.render.com |
| **Vercel** | https://vercel.com/dashboard |
| **Supabase** | https://app.supabase.com |
| **GitHub** | https://github.com/Yayan0421/Smart-Attendance |

---

## Auto-Deploy Updates

Both Render and Vercel auto-deploy when you push to `main` branch:

```bash
git add .
git commit -m "Update RFID logic"
git push origin main

# Render and Vercel will auto-deploy! ✅
```

---

## Cost Breakdown (Monthly)

| Service | Cost | Notes |
|---------|------|-------|
| **Render** | Free ($7/mo to remove sleep) | Backend service |
| **Vercel** | Free | Frontend hosting |
| **Supabase** | Free ($25/mo for more) | Database + auth |
| **Total** | Free - $32/mo | Full production stack |

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Update CORS in Render
4. ✅ Test endpoints
5. 🎯 Test with ESP32 hardware
6. 🎯 Add custom domain (optional)
7. 🎯 Monitor logs and analytics
