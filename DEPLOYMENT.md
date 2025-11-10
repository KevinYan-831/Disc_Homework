# Deployment Guide

## Backend Deployment (Render)

### Prerequisites
- GitHub repository with your backend code
- Render account (https://render.com)

### Steps

1. **Push your backend code to GitHub**
   ```bash
   cd backend
   git add .
   git commit -m "Backend restructure complete"
   git push
   ```

2. **Create a new Web Service on Render**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your project

3. **Configure the Web Service**
   - **Name**: `pet-your-pet-backend` (or your choice)
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your deployment branch)
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

4. **Set Environment Variables**
   Go to "Environment" tab and add:
   ```
   DATABASE_URL=postgresql://postgres.nyyraxgibahkehtujhpu:Yjx20060831!@aws-1-us-east-1.pooler.supabase.com:6543/postgres
   PORT=5000
   NODE_ENV=production
   SUPABASE_URL=https://nyyraxgibahkehtujhpu.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   FRONTEND_URL=https://your-firebase-app.web.app
   ```

   **Important**: Get your `SUPABASE_SERVICE_ROLE_KEY` from:
   - Supabase Dashboard → Settings → API → service_role key (secret)

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - You'll get a URL like: `https://pet-your-pet-backend.onrender.com`

6. **Test your API**
   ```bash
   curl https://your-backend-url.onrender.com/api/health
   ```

---

## Frontend Deployment (Firebase)

### Prerequisites
- Firebase account (https://firebase.google.com)
- Firebase CLI installed: `npm install -g firebase-tools`

### Steps

1. **Login to Firebase**
   ```bash
   firebase login
   ```

2. **Initialize Firebase in your project**
   ```bash
   cd frontend
   firebase init hosting
   ```
   
   Configuration:
   - **Project**: Select or create a new Firebase project
   - **Public directory**: `dist` (Vite build output)
   - **Single-page app**: `Yes`
   - **GitHub deploys**: `No` (optional)
   - **Overwrite index.html**: `No`

3. **Update Frontend Environment Variables**
   Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

4. **Build the Frontend**
   ```bash
   npm run build
   ```

5. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

6. **Your app is live!**
   - URL: `https://your-project-id.web.app`
   - Or custom domain: `https://your-project-id.firebaseapp.com`

7. **Update Backend CORS**
   Update your backend `.env` on Render:
   ```
   FRONTEND_URL=https://your-project-id.web.app
   ```

---

## Post-Deployment Configuration

### Update CORS in Backend
Make sure your backend allows requests from your Firebase frontend:

In `backend/src/index.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
```

### Configure Custom Domain (Optional)

#### Firebase
1. Go to Firebase Console → Hosting → Add custom domain
2. Follow DNS configuration instructions

#### Render
1. Go to your service → Settings → Custom Domain
2. Add your domain and configure DNS

---

## Important Notes

### Render Free Tier Limitations
- **Cold starts**: Services spin down after 15 minutes of inactivity
- **First request**: May take 30-60 seconds after inactivity
- **Upgrade**: Consider paid plan for production apps

### Firebase Free Tier
- **Hosting**: 10 GB storage, 360 MB/day transfer
- **Good for**: Most small to medium projects

### Security Checklist
- ✅ Never commit `.env` files to git
- ✅ Use `SUPABASE_SERVICE_ROLE_KEY` (not anon key) in backend
- ✅ Configure proper CORS origins
- ✅ Enable HTTPS (automatic on Render & Firebase)
- ✅ Change default database passwords

---

## Troubleshooting

### Backend Issues
- **500 errors**: Check Render logs in dashboard
- **Database connection**: Verify DATABASE_URL in environment
- **Auth errors**: Verify SUPABASE_SERVICE_ROLE_KEY is correct

### Frontend Issues
- **API errors**: Check VITE_API_URL points to correct backend
- **CORS errors**: Verify FRONTEND_URL in backend matches your Firebase URL
- **Build errors**: Run `npm run build` locally first to test

### Common Commands
```bash
# View Render logs
# Go to Dashboard → Your Service → Logs

# Redeploy on Render
# Push to GitHub (auto-deploys) or click "Manual Deploy"

# Redeploy on Firebase
cd frontend
npm run build
firebase deploy
```

---

## Environment Variables Summary

### Backend (Render)
```
DATABASE_URL=<your-supabase-db-url>
PORT=5000
NODE_ENV=production
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
FRONTEND_URL=<your-firebase-url>
```

### Frontend (Firebase)
```
VITE_API_URL=<your-render-backend-url>/api
```

---

## CI/CD (Optional)

### Auto-deploy on GitHub Push

#### Render
- Automatically deploys when you push to the configured branch

#### Firebase
Add to `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: cd frontend && npm ci && npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: your-project-id
          channelId: live
```
