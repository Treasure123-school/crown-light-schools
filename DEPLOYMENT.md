# Deployment Guide: Render (Frontend Static Site + Backend Web Service)

This guide deploys the Treasure Home School Management System entirely on **Render**.

## Architecture

| Component | Render Service Type | URL Pattern |
|-----------|-------------------|-------------|
| Frontend (React/Vite) | Static Site | `https://school-management-frontend.onrender.com` |
| Backend (Express API) | Web Service | `https://school-management-backend.onrender.com` |
| Database | External (Neon PostgreSQL) | Set via `DATABASE_URL` |

---

## Part 1: Deploy Backend (Web Service)

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Configure for Render deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `school-management-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Build Command**: `npm install --include=dev && npm run build:backend`
   - **Start Command**: `npm run start`
   - **Instance Type**: Free or paid tier

### Step 3: Set Environment Variables

**Required** (set in Render dashboard → Environment):

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Neon PostgreSQL connection string |
| `FRONTEND_URL` | `https://school-management-frontend.onrender.com` |
| `JWT_SECRET` | Auto-generated or use `openssl rand -base64 48` |
| `SESSION_SECRET` | Auto-generated or use `openssl rand -base64 48` |

**File Storage** (required for uploads):

| Variable | Value |
|----------|-------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |

**Optional**:

| Variable | Value |
|----------|-------|
| `GOOGLE_CLIENT_ID` | For Google OAuth |
| `GOOGLE_CLIENT_SECRET` | For Google OAuth |
| `GOOGLE_CALLBACK_URL` | `https://school-management-backend.onrender.com/api/auth/google/callback` |

### Step 4: Deploy & Verify

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. Test health check: `https://school-management-backend.onrender.com/api/health`

---

## Part 2: Deploy Frontend (Static Site)

### Step 1: Create Render Static Site

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Static Site"**
3. Connect the **same** GitHub repository
4. Configure:
   - **Name**: `school-management-frontend`
   - **Branch**: `main`
   - **Build Command**: `npm install --include=dev && npm run build:frontend`
   - **Publish Directory**: `dist/public`

### Step 2: Set Environment Variables

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://school-management-backend.onrender.com` |

### Step 3: Add Rewrite Rule

In **Redirects/Rewrites** settings, add:
- **Source**: `/*`
- **Destination**: `/index.html`
- **Action**: Rewrite

> This ensures client-side routing (wouter) works — all paths serve `index.html`.

### Step 4: Deploy & Update Backend

1. Deploy the static site
2. Go back to the **backend** service → Environment
3. Set `FRONTEND_URL` to your static site URL (e.g., `https://school-management-frontend.onrender.com`)

---

## Part 3: Using render.yaml (Blueprint)

Alternatively, use the included `render.yaml` to deploy both services at once:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Render will detect `render.yaml` and create both services
5. Set the `sync: false` env vars in each service's dashboard

---

## Troubleshooting

### Blank Page After Deploy
- Check browser console for errors
- Verify `VITE_API_URL` is set correctly on the static site
- Ensure the static site publish path is `dist/public`
- Confirm the rewrite rule `/* → /index.html` is set

### CORS Errors
- Ensure `FRONTEND_URL` on the backend matches your static site URL exactly (including `https://`)
- Redeploy backend after updating `FRONTEND_URL`

### 502 Bad Gateway
- Check Render logs for startup errors
- Verify `DATABASE_URL` is correct
- Ensure the backend health check passes at `/api/health`

### API Connection Failed
- Verify `VITE_API_URL` points to the backend URL (not the frontend)
- Test backend independently: `curl https://your-backend.onrender.com/api/health`

---

## Free Tier Notes

- **Backend**: Spins down after 15 minutes of inactivity. First request after spin-down takes ~30 seconds.
- **Static Site**: Always available, no cold starts.
- Upgrade to paid ($7/month) for always-on backend.
