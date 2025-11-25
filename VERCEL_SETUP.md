# Vercel Deployment Setup Guide

## Database Options for Vercel

You have several options for your database when deploying to Vercel:

### Option 1: Vercel Postgres (Recommended - Easiest)

**Best for:** Production deployment and simple setup

1. **Create Vercel Postgres in your project:**
   - Go to your Vercel project dashboard
   - Click on "Storage" tab
   - Click "Create Database" → Select "Postgres"
   - Choose the free tier (256 MB storage - perfect for family use)
   - Vercel will automatically add the `DATABASE_URL` to your environment variables

2. **Use the same database for local development:**
   - Copy the `DATABASE_URL` from Vercel dashboard
   - Add it to your local `.env` file
   - Now you can develop locally using the same database as production

**Pros:**
- ✅ No local database setup needed
- ✅ Automatic environment variable configuration
- ✅ Free tier is sufficient for family use
- ✅ Easy to manage from Vercel dashboard

**Cons:**
- ⚠️ Local development requires internet connection
- ⚠️ Changes affect production data (use carefully during development)

### Option 2: Separate Databases (Development + Production)

**Best for:** When you want to test without affecting production data

1. **Production Database (Vercel Postgres):**
   - Create Vercel Postgres in your Vercel project
   - This will be used in production

2. **Development Database Options:**
   - **Option A:** Another Vercel Postgres database (create a separate one)
   - **Option B:** Free cloud PostgreSQL:
     - [Neon](https://neon.tech) - Free tier available
     - [Supabase](https://supabase.com) - Free tier available
     - [Railway](https://railway.app) - Free tier available
   - **Option C:** Local PostgreSQL (only if you want to install it)

3. **Environment Variables:**
   - In Vercel: Use the production database URL
   - In local `.env`: Use the development database URL

### Option 3: Local Database Only for Development

**Best for:** When you want offline development

1. Install PostgreSQL locally
2. Use local database in `.env` for development
3. Use Vercel Postgres for production (set in Vercel dashboard)

## Recommended Setup for Vercel

### Step 1: Create Vercel Postgres

1. Push your code to GitHub
2. Import the repository to Vercel
3. In Vercel project → **Storage** → **Create Database** → **Postgres**
4. Select the free tier
5. Vercel automatically adds `DATABASE_URL` to your environment variables

### Step 2: Set Up Local Development

**Option A: Use Vercel Postgres for local dev too (Simplest)**

1. Copy the `DATABASE_URL` from Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Copy the `DATABASE_URL` value
2. Add to your local `.env`:
   ```env
   DATABASE_URL="postgresql://..."
   ```
3. You're done! Same database for dev and production

**Option B: Use a separate dev database**

1. Create a free PostgreSQL database at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Copy the connection string
3. Add to your local `.env`:
   ```env
   DATABASE_URL="postgresql://..." # Your dev database
   ```
4. Vercel will use its own database automatically

### Step 3: Complete Your .env File

For local development, your `.env` should have:

```env
# Database (from Vercel Postgres or separate dev database)
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# Admin Credentials
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-password"

# Email (Resend) - Optional
RESEND_API_KEY="re_..."

# SMS (Twilio) - Optional
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+..."
```

### Step 4: Set Environment Variables in Vercel

In your Vercel project dashboard → Settings → Environment Variables, add:

- `DATABASE_URL` - Already added by Vercel Postgres
- `NEXTAUTH_URL` - Your Vercel app URL (e.g., `https://your-app.vercel.app`)
- `NEXTAUTH_SECRET` - Same secret you use locally (or generate a new one)
- `ADMIN_EMAIL` - Your admin email
- `ADMIN_PASSWORD` - Your admin password
- `RESEND_API_KEY` - Your Resend API key
- `TWILIO_ACCOUNT_SID` - Your Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Your Twilio Auth Token
- `TWILIO_PHONE_NUMBER` - Your Twilio phone number

### Step 5: Run Migrations

After deploying to Vercel:

1. **Option A: Automatic (if configured):**
   - Vercel will run `prisma generate` during build
   - You may need to run migrations manually the first time

2. **Option B: Manual migration:**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Pull environment variables
   vercel env pull
   
   # Run migrations
   npx prisma migrate deploy
   ```

3. **Option C: Via Vercel Dashboard:**
   - Use Vercel's database interface to run SQL commands
   - Or use Prisma Studio: `npx prisma studio`

### Step 6: Create Admin Account

After deployment, create your admin account:

**Option A: Using the setup script locally:**
```bash
# Pull Vercel env vars
vercel env pull

# Run setup script
npm run setup-admin
```

**Option B: Directly in database:**
- Use Prisma Studio: `npx prisma studio`
- Or use Vercel's database interface

## Quick Start (No Local Database Needed)

1. **Deploy to Vercel:**
   - Push code to GitHub
   - Import to Vercel
   - Create Vercel Postgres database

2. **Set environment variables in Vercel dashboard**

3. **Copy DATABASE_URL to local .env for development**

4. **Run migrations:**
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```

5. **Create admin account:**
   ```bash
   npm run setup-admin
   ```

That's it! No local PostgreSQL installation needed.

## Summary

**For Vercel deployment, you DON'T need a local database.** You can:

✅ Use Vercel Postgres for both production and local development  
✅ Use a free cloud database (Neon/Supabase) for local dev  
✅ Skip local development and develop directly on Vercel  

The easiest approach is to use Vercel Postgres and connect to it from your local machine for development.

