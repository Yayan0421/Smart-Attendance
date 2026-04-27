# Backend Deployment Guide

Your frontend is now deployed on Vercel! Now you need to deploy your backend so the frontend can communicate with it.

## Current Status
- ✅ Frontend: Deployed on Vercel (https://smart-attendance12.vercel.app)
- ❌ Backend: Not deployed yet (causing "Login failed" error)

## Deployment Options

### Option 1: Deploy to Render (Recommended - Free)

Render offers a free tier and is perfect for this project.

#### Step 1: Prepare Repository
```bash
# Make sure everything is committed and pushed
git add -A
git commit -m "ready for deployment"
git push origin main
```

#### Step 2: Create Render Web Service

1. Go to [https://render.com](https://render.com)
2. Sign up or log in with GitHub
3. Click "New +" → "Web Service"
4. Select your GitHub repository
5. Configure:
   - **Name:** `smart-attendance-backend` (or your choice)
   - **Environment:** `Node`
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `npm start`
   - **Region:** Choose closest to your users

#### Step 3: Add Environment Variables

In Render dashboard, go to your service → Environment:

```
DATABASE_URL=your_supabase_connection_string
CORS_ORIGIN=https://smart-attendance12.vercel.app
NODE_ENV=production
```

**Get these from:**
- `DATABASE_URL`: Your Supabase connection string
- `CORS_ORIGIN`: Your Vercel frontend URL (https://smart-attendance12.vercel.app)

#### Step 4: Deploy
Click "Create Web Service" and wait for deployment (2-5 minutes)

**Your backend URL will be:** `https://your-service-name.onrender.com`

---

### Option 2: Deploy to Railway

Railway is also free with easy GitHub integration.

1. Go to [https://railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Node.js project
5. Add environment variables (same as Render)
6. Deploy

---

### Option 3: Deploy to Heroku (Paid)

Heroku removed free tier but is reliable:

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create smart-attendance-backend

# Set environment variables
heroku config:set DATABASE_URL=your_connection_string
heroku config:set CORS_ORIGIN=https://smart-attendance12.vercel.app

# Deploy
git push heroku main
```

---

## Step 5: Update Frontend with Backend URL

Once your backend is deployed:

1. Copy your backend URL (e.g., `https://smart-attendance-backend.onrender.com`)

2. **On Vercel:**
   - Go to your Vercel project settings
   - Environment Variables
   - Add: `VITE_API_BASE_URL=https://your-backend-url.onrender.com`
   - Redeploy

OR create `frontend/.env.production`:
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

3. **Push to GitHub:**
```bash
git add frontend/.env.production
git commit -m "config: set production API URL"
git push origin main
```

4. **Vercel will auto-redeploy** with the new environment variable

---

## Verify Deployment

### Test Backend Health:
```bash
curl https://your-backend-url.onrender.com/health
# Should return: {"message":"Server is running"}
```

### Test Login:
1. Go to https://smart-attendance12.vercel.app/login
2. Use demo credentials:
   - Email: `admin@example.com`
   - Password: `password123`
3. Should login successfully! ✅

---

## Troubleshooting

### "Login failed" error persists

**Check:**
1. Backend is actually running: `curl https://your-backend-url/health`
2. CORS is configured: Check Response Headers for `Access-Control-Allow-Origin`
3. Environment variables are set on deployment platform
4. Frontend has correct `VITE_API_BASE_URL` set
5. Database connection string is valid

### Backend crashes on start

**Check:**
- `DATABASE_URL` environment variable is set correctly
- Supabase credentials are valid
- All required packages are installed (`npm install` runs successfully)

### CORS errors in browser

**Fix in backend (already done):**
- Ensure `CORS_ORIGIN` environment variable matches your frontend URL
- Check [backend/src/server.js](backend/src/server.js) CORS configuration

---

## Production Environment Variables

### Backend (.env on Render/Railway/Heroku):
```env
DATABASE_URL=postgresql://user:password@host/dbname
CORS_ORIGIN=https://smart-attendance12.vercel.app
NODE_ENV=production
PORT=5000
```

### Frontend (Vercel Environment Variables):
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

## Next Steps

1. ✅ Deploy backend to Render/Railway/Heroku
2. ✅ Get backend URL
3. ✅ Set `VITE_API_BASE_URL` on Vercel
4. ✅ Test login on deployed app
5. ✅ Share app with users!

---

## Cost Estimate

| Service | Cost | Notes |
|---------|------|-------|
| Vercel (Frontend) | Free | 100GB/month bandwidth |
| Render (Backend) | Free | $7/month for prod DB |
| Supabase (Database) | Free tier | Great for development |
| **Total** | ~$7/month | Very affordable! |

---

Need help? Check the network tab in DevTools (F12) to see exactly what's failing!
