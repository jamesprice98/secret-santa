# Gmail SMTP Setup Guide

This guide shows you how to use Gmail SMTP directly instead of Resend, so you can send emails from your Gmail address and avoid spam filters.

## Option 1: Use Gmail SMTP (Recommended for Gmail Users)

### Step 1: Enable Gmail App Password

1. Go to your Google Account: https://myaccount.google.com
2. Click **"Security"** in the left sidebar
3. Under **"2-Step Verification"**, make sure it's enabled (required for app passwords)
4. If not enabled, enable 2-Step Verification first
5. Go to **"App passwords"** (search for it if needed)
6. Select **"Mail"** and **"Other (Custom name)"**
7. Enter a name like "Secret Santa App"
8. Click **"Generate"**
9. **Copy the 16-character password** (you'll need this - it looks like: `abcd efgh ijkl mnop`)

### Step 2: Install Nodemailer

The app needs to be updated to use Nodemailer instead of Resend. Run:

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

### Step 3: Update Environment Variables

Add these to your `.env` file:

```env
# Gmail SMTP Configuration
GMAIL_USER="your-email@gmail.com"
GMAIL_APP_PASSWORD="your-16-character-app-password"
```

**Important:** 
- Use your full Gmail address for `GMAIL_USER`
- Use the 16-character app password (remove spaces if any)
- Never commit this to git!

### Step 4: Add to Vercel

1. Go to your Vercel project → Settings → Environment Variables
2. Add:
   - **Key:** `GMAIL_USER`
   - **Value:** Your Gmail address
   - **Environments:** ✅ Production ✅ Preview ✅ Development
3. Add:
   - **Key:** `GMAIL_APP_PASSWORD`
   - **Value:** Your 16-character app password
   - **Environments:** ✅ Production ✅ Preview ✅ Development

### Step 5: Update Code

The code will need to be updated to use Nodemailer. See the implementation below.

---

## Option 2: Verify Domain with Resend (Better for Production)

If you have your own domain (even a free one), you can verify it with Resend and use an email address from that domain.

### Step 1: Get a Free Domain (if needed)

- [Freenom](https://www.freenom.com) - Free domains (limited TLDs)
- [Namecheap](https://www.namecheap.com) - ~$1-2/year for .xyz domains
- Or use any domain you already own

### Step 2: Verify Domain in Resend

1. Go to [Resend Dashboard](https://resend.com/domains)
2. Click **"Add Domain"**
3. Enter your domain (e.g., `yourdomain.com`)
4. Resend will provide DNS records to add:
   - **SPF record** (TXT)
   - **DKIM record** (TXT)
   - **DMARC record** (TXT - optional but recommended)
5. Add these records to your domain's DNS settings
6. Wait for verification (usually 5-15 minutes)

### Step 3: Use Your Domain Email

Once verified, update your code to use:
- `from: 'Secret Santa <noreply@yourdomain.com>'`
- Or any email address from your verified domain

### Step 4: Set Environment Variable

Add to your `.env`:
```env
RESEND_FROM_EMAIL="Secret Santa <noreply@yourdomain.com>"
```

---

## Comparison

| Feature | Gmail SMTP | Resend with Domain |
|---------|-----------|-------------------|
| Setup Complexity | Easy | Medium |
| Spam Avoidance | Good (Gmail reputation) | Excellent (domain reputation) |
| Daily Limits | 500 emails/day (Gmail) | 3,000/month (Resend free) |
| Cost | Free | Free tier available |
| Custom Domain | No | Yes |
| Best For | Quick setup, personal use | Production, professional use |

---

## Recommendation

- **For family/personal use:** Gmail SMTP is perfect - quick setup, uses your Gmail address
- **For production/multiple events:** Verify a domain with Resend for better deliverability and professional appearance



