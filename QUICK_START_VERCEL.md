# Quick Start: Vercel Postgres Setup (Web Interface Only)

This guide uses only the Vercel web interface - no CLI needed!

## Step 1: Prepare Your Code for GitHub

**Check if git is initialized:**
```bash
git status
```

**If not initialized, run:**
```bash
git init
git add .
git commit -m "Initial commit"
```

## Step 2: Push to GitHub

1. Create a new repository on [GitHub.com](https://github.com/new)
2. Copy the repository URL
3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel (Web Interface)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Click **"Deploy"** (use default settings)
5. Wait for deployment to complete (~2 minutes)

## Step 4: Create Vercel Postgres Database

1. In your Vercel project dashboard, click **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose **"Hobby (Free)"** plan
5. Name it: `secretsanta-db`
6. Select region (closest to you)
7. Click **"Create"**
8. Wait ~30 seconds for creation

## Step 5: Get Database Connection String

1. In **Storage** tab, click on your database
2. Click **".env.local"** tab
3. Find **`POSTGRES_PRISMA_URL`**
4. **Copy the entire string** (starts with `postgres://`)

## Step 6: Add Environment Variables in Vercel

Go to: **Project → Settings → Environment Variables**

Add these one by one:

### Required Variables:

1. **DATABASE_URL**
   - Value: Paste the `POSTGRES_PRISMA_URL` you copied
   - Environments: ✅ Production ✅ Preview ✅ Development

2. **NEXTAUTH_URL**
   - Value: `https://your-project-name.vercel.app` (your actual URL from Vercel)
   - Environments: ✅ Production ✅ Preview ✅ Development

3. **NEXTAUTH_SECRET**
   - Generate in PowerShell:
     ```powershell
     [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
     ```
   - Copy the output and paste as value
   - Environments: ✅ Production ✅ Preview ✅ Development

4. **ADMIN_EMAIL**
   - Value: Your email (e.g., `admin@example.com`)
   - Environments: ✅ Production ✅ Preview ✅ Development

5. **ADMIN_PASSWORD**
   - Value: A secure password
   - Environments: ✅ Production ✅ Preview ✅ Development

### Optional (for email/SMS):

6. **RESEND_API_KEY** (if you have Resend account)
7. **TWILIO_ACCOUNT_SID** (if you have Twilio account)
8. **TWILIO_AUTH_TOKEN** (if you have Twilio account)
9. **TWILIO_PHONE_NUMBER** (if you have Twilio account)

**After adding each variable, click "Save"**

## Step 7: Redeploy

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Step 8: Set Up Local Development

1. **Create/Update your local `.env` file:**
   ```env
   # Copy from Vercel: Storage → Database → .env.local → POSTGRES_PRISMA_URL
   DATABASE_URL="postgres://default:xxxxx@xxxxx.vercel-storage.com:5432/verceldb"
   
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="same-secret-as-vercel"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="your-password"
   RESEND_API_KEY="re_..."
   TWILIO_ACCOUNT_SID="AC..."
   TWILIO_AUTH_TOKEN="..."
   TWILIO_PHONE_NUMBER="+..."
   ```

2. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

3. **Create admin account:**
   ```bash
   npm run setup-admin
   ```

4. **Test locally:**
   ```bash
   npm run dev
   ```

## Step 9: Test Your Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. You should see the registration page
3. Visit: `https://your-project.vercel.app/admin/login`
4. Log in with your admin credentials

## Common Issues & Solutions

**"Database connection failed"**
- Make sure you copied `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)
- Check that database is created and running in Vercel

**"Migration failed"**
- Make sure `DATABASE_URL` is set in Vercel environment variables
- Try redeploying after adding the variable

**"Can't log in"**
- Make sure you ran `npm run setup-admin` after setting up the database
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are correct

## You're Done! 🎉

Your app is now:
- ✅ Deployed on Vercel
- ✅ Connected to Vercel Postgres
- ✅ Ready for local development
- ✅ Ready to use!

Share your Vercel URL with family members to start registering!

