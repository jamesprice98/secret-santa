# Database Migration Instructions

## Add Password Column to Participant Table

The database needs to be updated to include the `password` column for participant login functionality.

### Option 1: Using Prisma Migrate Deploy (Recommended)

1. **Pull environment variables from Vercel:**
   ```bash
   vercel env pull
   ```

2. **Apply the migration:**
   ```bash
   npx prisma migrate deploy
   ```

   Or use the npm script:
   ```bash
   npm run migrate
   ```

### Option 2: Using Prisma DB Push (Quick Fix)

This will sync your schema directly without creating migration files:

```bash
# Pull Vercel environment variables first
vercel env pull

# Push schema changes
npx prisma db push
```

### Option 3: Manual SQL via Vercel Dashboard

1. Go to your Vercel project dashboard
2. Navigate to **Storage** → Your Postgres database
3. Click on **"Data"** or **"SQL Editor"**
4. Run this SQL command:
   ```sql
   ALTER TABLE "Participant" ADD COLUMN "password" TEXT;
   ```

### Option 4: Using Prisma Studio

1. Pull environment variables:
   ```bash
   vercel env pull
   ```

2. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```

3. The schema will be automatically synced when you open it

## Verify Migration

After running the migration, verify the column was added:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Participant' AND column_name = 'password';
```

You should see a row with `column_name = 'password'` and `data_type = 'text'`.

## Troubleshooting

- **Error: "column already exists"** - The migration was already applied, you can ignore this
- **Error: "relation does not exist"** - Make sure you're connected to the correct database
- **Connection errors** - Verify your `DATABASE_URL` is correct in Vercel

