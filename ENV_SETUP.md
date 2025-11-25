# Environment Variables Setup Guide

Follow these steps to set up your `.env` file:

## Step 1: Create the .env File

Create a new file named `.env` in the root directory of your project (same level as `package.json`).

## Step 2: Add Each Variable

Copy and fill in each variable below:

### 1. Database URL

**For Local PostgreSQL:**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/secretsanta?schema=public"
```
- Replace `username` with your PostgreSQL username (often `postgres`)
- Replace `password` with your PostgreSQL password
- Replace `secretsanta` with your database name (or create a new database)

**To create a local database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE secretsanta;

# Exit
\q
```

**For Vercel Postgres (when deploying):**
- Go to your Vercel project → Storage → Create Postgres
- Copy the connection string from the dashboard
- Use that as your `DATABASE_URL`

### 2. NextAuth URL

**For Local Development:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**For Production (Vercel):**
```env
NEXTAUTH_URL="https://your-app-name.vercel.app"
```

### 3. NextAuth Secret

Generate a secure random string:

**On Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**On Mac/Linux:**
```bash
openssl rand -base64 32
```

**Or use an online generator:**
- Visit: https://generate-secret.vercel.app/32
- Copy the generated string

Then add to `.env`:
```env
NEXTAUTH_SECRET="paste-your-generated-secret-here"
```

### 4. Admin Credentials

Set the email and password for your admin account:

```env
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-secure-password"
```

**Note:** These will be used to create your admin account when you run `npm run setup-admin`

### 5. Resend API Key (Email Service)

1. Sign up at [Resend.com](https://resend.com) (free tier: 3,000 emails/month)
2. Go to API Keys in your dashboard
3. Create a new API key
4. Copy the key (starts with `re_`)

```env
RESEND_API_KEY="re_your_actual_api_key_here"
```

**Optional:** If you don't want email notifications yet, you can leave this empty, but the app will log warnings.

### 6. Twilio Credentials (SMS Service)

1. Sign up at [Twilio.com](https://www.twilio.com) (free trial available)
2. Get your Account SID and Auth Token from the dashboard
3. Get a phone number from Twilio (or use your trial number)

```env
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"
```

**Optional:** If you don't want SMS notifications yet, you can leave these empty, but the app will log warnings.

## Complete .env File Example

Here's what your complete `.env` file should look like:

```env
# Database
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/secretsanta?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-64-character-base64-secret-here"

# Admin Credentials
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="changeme123"

# Email Service (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"
```

## Step 3: Verify Your Setup

After creating your `.env` file:

1. **Check that the file exists:**
   ```bash
   # The file should be in the root directory
   ls .env  # Mac/Linux
   dir .env # Windows
   ```

2. **Make sure `.env` is in `.gitignore`** (it should be already)

3. **Test your database connection:**
   ```bash
   npx prisma db push
   ```

## Quick Start (Minimal Setup)

If you want to test locally without email/SMS first:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/secretsanta?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secret-here"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASSWORD="test123"
```

You can add the email/SMS keys later when you're ready to test notifications.

## Troubleshooting

**"DATABASE_URL is not set"**
- Make sure your `.env` file is in the root directory
- Check for typos in the variable name
- Restart your development server after creating/updating `.env`

**"NEXTAUTH_SECRET is missing"**
- Generate a new secret using one of the methods above
- Make sure there are no quotes around the value (or use consistent quotes)

**Database connection errors**
- Verify PostgreSQL is running
- Check your username, password, and database name
- Try connecting with `psql` to verify credentials

## Next Steps

After setting up your `.env` file:

1. Run database migrations: `npx prisma migrate dev --name init`
2. Create admin account: `npm run setup-admin`
3. Start the app: `npm run dev`

