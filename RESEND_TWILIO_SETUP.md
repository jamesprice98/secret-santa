# Resend & Twilio Setup Guide

This guide will walk you through setting up Resend (for emails) and Twilio (for SMS) for your Secret Santa application.

## Part 1: Setting Up Resend (Email Service)

Resend offers a free tier with 3,000 emails per month - perfect for family Secret Santa!

### Step 1: Create a Resend Account

1. Go to [resend.com](https://resend.com)
2. Click **"Sign Up"** (you can use your GitHub account for quick signup)
3. Verify your email address

### Step 2: Get Your API Key

1. After logging in, go to **"API Keys"** in the left sidebar
2. Click **"Create API Key"**
3. Give it a name (e.g., "Secret Santa App")
4. Select **"Sending access"** permissions
5. Click **"Add"**
6. **Copy the API key** (starts with `re_`) - you won't be able to see it again!

### Step 3: Verify Your Domain (Optional but Recommended)

**For testing, you can use the default sender:**
- The code uses `onboarding@resend.dev` which works for testing
- You can send up to 100 emails/day with this default sender

**To use your own domain (for production):**
1. Go to **"Domains"** in Resend
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records Resend provides to your domain registrar
5. Wait for verification (usually a few minutes)
6. Once verified, update the `from` field in `lib/notifications.ts` to use your domain

### Step 4: Add API Key to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Click **"Add New"**
4. Add:
   - **Key:** `RESEND_API_KEY`
   - **Value:** Paste your Resend API key (starts with `re_`)
   - **Environments:** ✅ Production ✅ Preview ✅ Development
5. Click **"Save"**

### Step 5: Add API Key to Local .env (for testing)

1. Open your `.env` file
2. Add:
   ```env
   RESEND_API_KEY="re_your_api_key_here"
   ```

That's it for Resend! ✅

---

## Part 2: Setting Up Twilio (SMS Service)

Twilio offers a free trial with credits to test SMS functionality.

### Step 1: Create a Twilio Account

1. Go to [twilio.com](https://www.twilio.com)
2. Click **"Sign up"** (free account)
3. Fill in your details:
   - Name
   - Email
   - Password
   - Phone number (for verification)
4. Verify your email and phone number

### Step 2: Get Your Account Credentials

1. After logging in, you'll see your **Dashboard**
2. Look for **"Account SID"** and **"Auth Token"** (they're on the main dashboard)
3. **Copy both values** - you'll need them:
   - **Account SID:** Starts with `AC...`
   - **Auth Token:** Click "View" to reveal it

### Step 3: Get a Twilio Phone Number

1. In the Twilio Console, go to **"Phone Numbers" → "Manage → Buy a number"**
2. Click **"Buy a number"**
3. Select your country (e.g., United States)
4. For testing, you can use the **"Trial"** option (free)
   - Trial numbers can only send to verified phone numbers
5. Click **"Search"** and select a number
6. Click **"Buy"** (it's free for trial accounts)
7. **Copy the phone number** (format: `+1234567890`)

**Note:** Trial accounts can only send SMS to verified phone numbers. To send to any number, you'll need to upgrade your account (but the free trial credits are usually enough for testing).

### Step 4: Verify Phone Numbers (For Trial Accounts)

If you're using a trial account, you need to verify recipient phone numbers:

1. Go to **"Phone Numbers" → "Manage → Verified Caller IDs"**
2. Click **"Add a new Caller ID"**
3. Enter the phone number you want to send SMS to
4. Twilio will send a verification code
5. Enter the code to verify

**Important:** Trial accounts can only send SMS to verified numbers. For production, you'll need to upgrade (but free trial usually has enough credits for testing).

### Step 5: Add Credentials to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add these three variables:

   **a) TWILIO_ACCOUNT_SID:**
   - **Key:** `TWILIO_ACCOUNT_SID`
   - **Value:** Your Account SID (starts with `AC...`)
   - **Environments:** ✅ Production ✅ Preview ✅ Development

   **b) TWILIO_AUTH_TOKEN:**
   - **Key:** `TWILIO_AUTH_TOKEN`
   - **Value:** Your Auth Token
   - **Environments:** ✅ Production ✅ Preview ✅ Development

   **c) TWILIO_PHONE_NUMBER:**
   - **Key:** `TWILIO_PHONE_NUMBER`
   - **Value:** Your Twilio phone number (format: `+1234567890`)
   - **Environments:** ✅ Production ✅ Preview ✅ Development

4. Click **"Save"** for each one

### Step 6: Add Credentials to Local .env (for testing)

1. Open your `.env` file
2. Add:
   ```env
   TWILIO_ACCOUNT_SID="ACyour_account_sid"
   TWILIO_AUTH_TOKEN="your_auth_token"
   TWILIO_PHONE_NUMBER="+1234567890"
   ```

That's it for Twilio! ✅

---

## Testing Your Setup

### Test Email (Resend)

1. Make sure `RESEND_API_KEY` is set in your `.env` file
2. Run your app locally: `npm run dev`
3. Go to the admin panel and generate assignments
4. Check the email inbox of the participant

### Test SMS (Twilio)

1. Make sure all three Twilio variables are set in your `.env` file
2. **Important:** If using a trial account, verify the recipient's phone number in Twilio first
3. Run your app locally: `npm run dev`
4. Go to the admin panel and generate assignments
5. Check the phone for the SMS message

---

## Troubleshooting

### Resend Issues

- **"Invalid API key"**: Make sure you copied the full API key (starts with `re_`)
- **"Domain not verified"**: If using a custom domain, wait for DNS verification. For testing, use `onboarding@resend.dev`
- **"Rate limit exceeded"**: Free tier allows 3,000 emails/month. Check your usage in Resend dashboard

### Twilio Issues

- **"Trial account can't send to this number"**: Verify the phone number in Twilio Console first
- **"Invalid phone number format"**: Make sure phone numbers include country code (e.g., `+1234567890`)
- **"Insufficient funds"**: Trial accounts have free credits. Check your balance in Twilio Console
- **"Unauthorized"**: Double-check your Account SID and Auth Token are correct

---

## Cost Information

### Resend (Free Tier)
- ✅ 3,000 emails/month free
- ✅ 100 emails/day with default sender
- Perfect for family Secret Santa!

### Twilio (Free Trial)
- ✅ Free trial credits (usually $15-20 worth)
- ✅ Can send to verified numbers only (trial)
- ⚠️ To send to any number, upgrade required (pay-as-you-go pricing)
- 💰 SMS typically costs $0.0075 - $0.01 per message

For a family Secret Santa, the free tiers should be more than enough! 🎉

---

## Next Steps

After setting up both services:

1. **Redeploy your Vercel app** (or wait for automatic deployment)
2. **Test the assignment flow** in your admin panel
3. **Verify emails and SMS are received** by participants

If you need help, check the Vercel function logs for any error messages!

