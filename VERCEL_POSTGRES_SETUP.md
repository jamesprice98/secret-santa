# Step-by-Step: Vercel Postgres Setup

Follow these steps to set up Vercel Postgres for your Secret Santa app.

## Prerequisites

- GitHub account (to host your code)
- Vercel account (free) - [Sign up here](https://vercel.com/signup)

## Step 1: Push Your Code to GitHub

1. **Create a new repository on GitHub:**
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it (e.g., `secret-santa`)
   - Make it public or private (your choice)
   - Don't initialize with README (you already have one)

2. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Import your repository:**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure project (if needed):**
   - Framework Preset: Next.js (should be auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `prisma generate && next build` (already in vercel.json)
   - Install Command: `npm install` (default)

4. **Click "Deploy"** (don't add environment variables yet - we'll do that after creating the database)

## Step 3: Create Vercel Postgres Database

1. **In your Vercel project dashboard:**
   - After deployment completes, go to your project
   - Click on the **"Storage"** tab (in the top navigation)

2. **Create Postgres database:**
   - Click **"Create Database"**
   - Select **"Postgres"**
   - Choose the **Hobby (Free)** plan (256 MB - perfect for family use)
   - Give it a name (e.g., "secretsanta-db")
   - Select a region (choose closest to you)
   - Click **"Create"**

3. **Wait for database to be created** (takes ~30 seconds)

## Step 4: Get Your Database Connection String

1. **In the Storage tab:**
   - Click on your newly created Postgres database
   - Go to the **".env.local"** tab
   - You'll see `POSTGRES_PRISMA_URL` and `POSTGRES_URL`

2. **Copy the `POSTGRES_PRISMA_URL`:**
   - This is the connection string you need
   - It looks like: `postgres://default:xxxxx@xxxxx.vercel-storage.com:5432/verceldb`
   - **Copy this entire string**

## Step 5: Set Environment Variables in Vercel

1. **Go to your project → Settings → Environment Variables**

2. **Add each variable:**

   **a) DATABASE_URL:**
   - Key: `DATABASE_URL`
   - Value: Paste the `POSTGRES_PRISMA_URL` you copied
   - Environment: Production, Preview, Development (select all)

   **b) NEXTAUTH_URL:**
   - Key: `NEXTAUTH_URL`
   - Value: `https://your-project-name.vercel.app` (your actual Vercel URL)
   - Environment: Production, Preview, Development

   **c) NEXTAUTH_SECRET:**
   - Key: `NEXTAUTH_SECRET`
   - Value: Generate one using PowerShell:
     ```powershell
     [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
     ```
   - Environment: Production, Preview, Development

   **d) ADMIN_EMAIL:**
   - Key: `ADMIN_EMAIL`
   - Value: Your email (e.g., `admin@example.com`)
   - Environment: Production, Preview, Development

   **e) ADMIN_PASSWORD:**
   - Key: `ADMIN_PASSWORD`
   - Value: A secure password
   - Environment: Production, Preview, Development

   **f) RESEND_API_KEY (Optional - for email):**
   - Key: `RESEND_API_KEY`
   - Value: Your Resend API key (starts with `re_`)
   - Environment: Production, Preview, Development

   **g) TWILIO_ACCOUNT_SID (Optional - for SMS):**
   - Key: `TWILIO_ACCOUNT_SID`
   - Value: Your Twilio Account SID
   - Environment: Production, Preview, Development

   **h) TWILIO_AUTH_TOKEN (Optional - for SMS):**
   - Key: `TWILIO_AUTH_TOKEN`
   - Value: Your Twilio Auth Token
   - Environment: Production, Preview, Development

   **i) TWILIO_PHONE_NUMBER (Optional - for SMS):**
   - Key: `TWILIO_PHONE_NUMBER`
   - Value: Your Twilio phone number (e.g., `+1234567890`)
   - Environment: Production, Preview, Development

3. **Click "Save" for each variable**

## Step 6: Set Up Local Development

1. **Copy the DATABASE_URL to your local `.env` file:**
   - Go back to Vercel → Storage → Your database → ".env.local" tab
   - Copy the `POSTGRES_PRISMA_URL`
   - Add to your local `.env`:
     ```env
     DATABASE_URL="postgres://default:xxxxx@xxxxx.vercel-storage.com:5432/verceldb"
     ```

2. **Add other local environment variables:**
   ```env
   DATABASE_URL="postgres://..." # From Vercel
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="same-secret-as-vercel"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="your-password"
   RESEND_API_KEY="re_..."
   TWILIO_ACCOUNT_SID="AC..."
   TWILIO_AUTH_TOKEN="..."
   TWILIO_PHONE_NUMBER="+..."
   ```

## Step 7: Run Database Migrations

1. **Install Vercel CLI (optional but helpful):**
   ```bash
   npm install -g vercel
   ```

2. **Pull environment variables locally:**
   ```bash
   vercel env pull .env.local
   ```
   This downloads your Vercel environment variables to `.env.local`

3. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   ```
   Or if you want to create a new migration:
   ```bash
   npx prisma migrate dev --name init
   ```

## Step 8: Create Admin Account

1. **Make sure your `.env` has ADMIN_EMAIL and ADMIN_PASSWORD set**

2. **Run the setup script:**
   ```bash
   npm run setup-admin
   ```

   This creates your admin account in the database.

## Step 9: Test Your Setup

1. **Test locally:**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000 (should see registration page)
   - Visit http://localhost:3000/admin/login (should see login page)
   - Log in with your admin credentials

2. **Test on Vercel:**
   - Visit your Vercel URL: `https://your-project.vercel.app`
   - Try registering a test participant
   - Log in to admin dashboard

## Troubleshooting

### "Can't reach database server"
- Make sure you copied the correct `POSTGRES_PRISMA_URL` (not `POSTGRES_URL`)
- Check that the database is created and running in Vercel dashboard

### "Migration failed"
- Make sure `DATABASE_URL` is set correctly in Vercel
- Try running `npx prisma migrate deploy` again

### "Authentication failed"
- Verify `NEXTAUTH_SECRET` is the same in both Vercel and local `.env`
- Make sure `NEXTAUTH_URL` matches your actual Vercel URL

### "Admin account not found"
- Run `npm run setup-admin` again
- Check that `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set correctly

## Quick Reference: Vercel Dashboard Locations

- **Storage/Database**: Project → Storage tab
- **Environment Variables**: Project → Settings → Environment Variables
- **Deployments**: Project → Deployments tab
- **Database Connection String**: Storage → Your database → ".env.local" tab → `POSTGRES_PRISMA_URL`

## Next Steps

Once everything is set up:
1. ✅ Your app is deployed on Vercel
2. ✅ Database is connected
3. ✅ Admin account is created
4. ✅ You can develop locally using the same database

You're all set! Share your Vercel URL with family members to start registering!

