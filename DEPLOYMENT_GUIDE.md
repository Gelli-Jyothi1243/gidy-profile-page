# Deployment Guide

## Prerequisites
- GitHub account
- MongoDB Atlas account (free tier)
- Render account (for backend)
- Vercel account (for frontend)

---

## Step 1: Setup MongoDB Atlas (Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (free tier M0)
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)
6. Replace `<password>` with your actual password
7. Add `/gidy-profile` at the end: `mongodb+srv://username:password@cluster.mongodb.net/gidy-profile`
8. **Important**: Go to "Network Access" → "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)

---

## Step 2: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Gidy Profile Page"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/gidy-profile-page.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

1. Go to [Render](https://render.com) and sign up/log in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `gidy-profile-backend` (or any name)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

5. Add Environment Variables:
   - Click "Advanced" → "Add Environment Variable"
   - Key: `MONGODB_URI`
   - Value: Your MongoDB Atlas connection string from Step 1
   - Key: `PORT`
   - Value: `5000`

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL** (looks like: `https://gidy-profile-backend.onrender.com`)

---

## Step 4: Deploy Frontend to Vercel

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [Vercel](https://vercel.com) and sign up/log in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add Environment Variable:
   - Click "Environment Variables"
   - Key: `VITE_API_URL`
   - Value: `https://YOUR-RENDER-URL.onrender.com/api/profile`
   - (Replace with your actual Render backend URL from Step 3)

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. **Copy your frontend URL** (looks like: `https://gidy-profile-page.vercel.app`)

### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to client folder
cd client

# Create .env.production file
echo "VITE_API_URL=https://YOUR-RENDER-URL.onrender.com/api/profile" > .env.production

# Deploy
vercel --prod

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? gidy-profile-page
# - Directory? ./
# - Override settings? No
```

---

## Step 5: Test Your Deployment

1. Open your Vercel frontend URL
2. Check if the page loads correctly
3. Try adding/editing/deleting items
4. Toggle dark mode and refresh - it should persist
5. Check browser console for any errors

---

## Step 6: Update README.md

Update the live demo links in your README.md:

```markdown
## 🚀 Live Demo

- **Frontend**: https://your-vercel-url.vercel.app
- **Backend**: https://your-render-url.onrender.com
```

Commit and push:
```bash
git add README.md
git commit -m "Update live demo URLs"
git push
```

---

## Troubleshooting

### Backend Issues

**Problem**: Backend not connecting to MongoDB
- **Solution**: Check MongoDB Atlas Network Access allows 0.0.0.0/0
- **Solution**: Verify MONGODB_URI in Render environment variables

**Problem**: Backend shows "Application failed to respond"
- **Solution**: Check Render logs for errors
- **Solution**: Ensure `npm start` script exists in server/package.json

### Frontend Issues

**Problem**: Frontend can't connect to backend
- **Solution**: Check VITE_API_URL environment variable in Vercel
- **Solution**: Ensure backend URL includes `/api/profile` at the end
- **Solution**: Check CORS is enabled in backend

**Problem**: Environment variables not working
- **Solution**: Redeploy after adding environment variables
- **Solution**: Ensure variable name starts with `VITE_`

### CORS Issues

If you see CORS errors, update `server/server.js`:

```javascript
app.use(cors({
  origin: ['http://localhost:5174', 'https://your-vercel-url.vercel.app'],
  credentials: true
}));
```

---

## Important Notes

1. **Render Free Tier**: Backend may sleep after 15 minutes of inactivity. First request after sleep takes 30-60 seconds.
2. **MongoDB Atlas**: Free tier has 512MB storage limit
3. **Vercel**: Automatic deployments on git push to main branch
4. **Environment Variables**: Never commit .env files to git

---

## Final Checklist

- [ ] MongoDB Atlas cluster created and connection string copied
- [ ] Code pushed to GitHub
- [ ] Backend deployed to Render with MONGODB_URI set
- [ ] Frontend deployed to Vercel with VITE_API_URL set
- [ ] Application tested and working
- [ ] README.md updated with live URLs
- [ ] All features working (add, edit, delete, dark mode)

---

## Submission

Email to: gidy@gidy.ai

Include:
1. Live frontend URL
2. GitHub repository URL
3. Brief note about your innovations

Good luck! 🚀
