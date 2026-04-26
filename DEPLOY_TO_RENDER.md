# Deploy to Render - Step by Step

## Quick Start (5 minutes)

### 1. Go to Render Dashboard
https://dashboard.render.com

### 2. Deploy Backend

Click **"New +"** → **"Web Service"**

- **Repository**: Connect `https://github.com/Yayan0421/Smart-Attendance.git`
- **Branch**: `main`
- **Name**: `smart-attendance-backend`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

**Environment Variables** (add these):
```
NODE_ENV = production
SUPABASE_URL = https://dxjsmxnfgapfpmtajefm.supabase.co
SUPABASE_SERVICE_ROLE_KEY = [Your key from .env]
SUPABASE_ANON_KEY = [Your key from .env]
JWT_SECRET = rfid_attendance_secret_key_2024
CORS_ORIGIN = https://smart-attendance-frontend.onrender.com
```

Click **"Create Web Service"** and wait for deployment (2-3 min)

### 3. Deploy Frontend

Click **"New +"** → **"Static Site"**

- **Repository**: Same repo
- **Branch**: `main`
- **Name**: `smart-attendance-frontend`
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

**Environment Variables**:
```
VITE_API_URL = https://smart-attendance-backend.onrender.com
```

Click **"Create Static Site"** and wait (1-2 min)

### 4. Update CORS in Backend

Once both are deployed:

1. Note your backend URL: `https://smart-attendance-backend.onrender.com`
2. Note your frontend URL: `https://smart-attendance-frontend.onrender.com`
3. Go to backend service settings
4. Update `CORS_ORIGIN` environment variable to frontend URL
5. Redeploy backend

## Test Deployment

Once live:

```bash
# Test backend
curl https://smart-attendance-backend.onrender.com/logs

# Visit frontend
https://smart-attendance-frontend.onrender.com
```

## Troubleshooting

**Backend won't start?**
- Check logs: Render Dashboard → Service → Logs tab
- Verify all environment variables are set

**Frontend shows "Cannot connect to API"?**
- Check `VITE_API_URL` is correct
- Redeploy frontend after backend URL is known

**Build fails?**
- Check Node version compatibility
- Verify `package.json` scripts are correct

## Useful Links

- **Render Docs**: https://render.com/docs
- **GitHub Repository**: https://github.com/Yayan0421/Smart-Attendance
- **Supabase Dashboard**: https://app.supabase.com

## Production Tips

1. **Custom Domain**: Add custom domain in Render settings
2. **Auto-Deploy**: Enable auto-deploy on GitHub push
3. **Monitoring**: Enable email alerts for deployment failures
4. **Database Backups**: Supabase handles this automatically
5. **Rate Limiting**: Consider adding rate limiting for `/rfid-scan` endpoint
