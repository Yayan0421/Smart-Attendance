# Render Deployment Guide

## Step 1: Set Up Git Repository
```bash
cd c:\Users\wenif\Desktop\MIcrop
git init
git add .
git commit -m "Initial commit: RFID attendance system with Supabase"
git branch -M main
git remote add origin https://github.com/Yayan0421/Smart-Attendance.git
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `smart-attendance-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   SUPABASE_URL=https://dxjsmxnfgapfpmtajefm.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=rfid_attendance_secret_key_2024
   CORS_ORIGIN=https://your-frontend-url.onrender.com
   ```

6. Click "Create Web Service"

## Step 3: Deploy Frontend to Render

1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `smart-attendance-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`

4. Add Build Environment Variables:
   ```
   VITE_API_URL=https://smart-attendance-backend.onrender.com
   ```

5. Click "Create Static Site"

## Step 4: Update Frontend API URL

Update `frontend/src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

## Step 5: Update CORS

In backend `.env`:
```
CORS_ORIGIN=https://your-frontend-render-url.onrender.com
```

## Important Notes

- **Free Plan**: May go to sleep after 15 minutes of inactivity
- **Render URLs**: Will look like `smart-attendance-backend.onrender.com`
- **Environment Variables**: Never commit `.env` file (already in .gitignore)
- **Database**: Using Supabase cloud, no database setup needed in Render

## Monitoring

View logs in Render dashboard:
- Backend logs: https://dashboard.render.com → Select web service
- Frontend logs: https://dashboard.render.com → Select static site
