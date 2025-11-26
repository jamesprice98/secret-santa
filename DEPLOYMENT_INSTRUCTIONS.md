# Deployment Instructions

## After First Deployment

After your app is deployed to Vercel, you need to run database migrations to create the tables.

### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. Pull environment variables:
   ```bash
   vercel env pull
   ```

3. Run migrations:
   ```bash
   npm run migrate
   ```

4. Create admin account:
   ```bash
   npm run setup-admin
   ```

### Option 2: Using Vercel Dashboard

1. Go to your Vercel project → Settings → Environment Variables
2. Make sure `DATABASE_URL` is set correctly
3. Go to Deployments tab
4. Click on the latest deployment
5. Open the "Functions" tab or use Vercel's database interface to run SQL

### Option 3: Manual SQL (via Prisma Studio or Database UI)

1. Connect to your database (Prisma Postgres dashboard or Prisma Studio)
2. Run the SQL from `prisma/migrations/0_init/migration.sql`

## Quick Setup After Deployment

```bash
# Pull environment variables from Vercel
vercel env pull

# Run migrations
npm run migrate

# Create admin account
npm run setup-admin
```

## Troubleshooting

If migrations fail:
- Verify `DATABASE_URL` is set correctly in Vercel
- Check that your database is accessible
- Ensure the database user has CREATE TABLE permissions

