# 🚀 Deployment Guide - Render.com

## ✅ **Why Render?**
- ✅ **100% FREE** for your project size
- ✅ **Zero code changes** needed
- ✅ **Auto-deploy** from GitHub
- ✅ **Easy setup** (5 minutes)

---

## 📋 **Step-by-Step Deployment**

### **Step 1: Push Code to GitHub**

1. Create a GitHub account (if you don't have one)
2. Create a new repository
3. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

---

### **Step 2: Deploy Backend on Render**

1. Go to [render.com](https://render.com) and sign up (free)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your repository
5. Configure:
   - **Name**: `blog-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `Backend`
6. Click **"Advanced"** → Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend.onrender.com (set after frontend deploys)
   APPWRITE_ENDPOINT=your_appwrite_endpoint
   APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_API_KEY=your_api_key
   JWT_SECRET=your_random_secret_key
   JWT_EXPIRES_IN=7d
   ```
7. Click **"Create Web Service"**
8. Wait for deployment (2-3 minutes)
9. Copy your backend URL (e.g., `https://blog-backend.onrender.com`)

---

### **Step 3: Deploy Frontend on Render**

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub account (if not already)
3. Select your repository
4. Configure:
   - **Name**: `blog-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `Frontend/dist`
   - **Root Directory**: `Frontend`
5. Add Environment Variables:
   ```
   VITE_APPWRITE_URL=your_appwrite_url
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   VITE_APPWRITE_COLLECTION_ID=your_collection_id
   VITE_APPWRITE_BUCKET_ID=your_bucket_id
   VITE_APPWRITE_COMMENTS_COLLECTION_ID=your_comments_id
   ```
6. Click **"Create Static Site"**
7. Wait for deployment (2-3 minutes)
8. Copy your frontend URL (e.g., `https://blog-frontend.onrender.com`)

---

### **Step 4: Update Backend CORS**

1. Go back to your **Backend** service in Render
2. Click **"Environment"** tab
3. Update `FRONTEND_URL` to your frontend URL:
   ```
   FRONTEND_URL=https://blog-frontend.onrender.com
   ```
4. Click **"Save Changes"**
5. Render will automatically redeploy

---

### **Step 5: Update Appwrite Settings**

**Important:** You don't need Custom Domains for Render URLs. Instead, add your frontend URL as a Web Platform.

1. Go to your Appwrite dashboard
2. Select your **Project** (from the left sidebar)
3. Go to **Settings** → Look for **"Platforms"** or **"Web Platforms"** section
4. Click **"Add Platform"** or **"Create Platform"** → Select **"Web"**
5. Enter your frontend URL: `https://blog-frontend-6mzh.onrender.com` (with https://)
6. Save changes

**Alternative Path:**
- If you see **"Platforms"** in the left sidebar, click it → **"Add Platform"** → **"Web"**
- Enter: `https://blog-frontend-6mzh.onrender.com`
- Save

**Note:** Custom Domains is only for your own custom domain (like example.com), not for Render's free subdomain. For Render URLs, use Platforms/Web Platforms instead.

---

## ✅ **That's It!**

Your blog is now live! 🎉

- **Frontend**: `https://blog-frontend.onrender.com`
- **Backend**: `https://blog-backend.onrender.com`

---

## 🔧 **Troubleshooting**

### **Backend not starting?**
- Check logs in Render dashboard
- Verify all environment variables are set
- Make sure `PORT` is set to `10000`

### **Frontend not loading?**
- Check build logs in Render
- Verify all `VITE_` environment variables are set
- Check browser console for errors

### **CORS errors?**
- Make sure `FRONTEND_URL` in backend matches your frontend URL
- Add frontend URL to Appwrite domains

---

## 📝 **Notes**

- Render free tier: Services sleep after 15 minutes of inactivity (wakes up on first request)
- First request after sleep takes ~30 seconds (normal for free tier)
- All your code stays the same - no changes needed! ✅

---

## 🆘 **Need Help?**

If you encounter any issues:
1. Check Render logs
2. Verify environment variables
3. Test locally first: `npm run build` and `npm start`

