# Secret Santa Application

A full-stack web application for managing Secret Santa events with automatic assignment generation and notification delivery.

## Features

- Public registration page for participants
- Admin dashboard for managing participants and assignments
- Spouse relationship management to prevent spouse-to-spouse assignments
- Automatic Secret Santa assignment generation
- Email and SMS notifications for assignments

## Tech Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Email**: Resend API
- **SMS**: Twilio API
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or cloud)
- Resend account (for email) - [Sign up](https://resend.com)
- Twilio account (for SMS) - [Sign up](https://www.twilio.com)

## Environment Variables

Create a `.env` file in the root directory with the following variables (you can copy this template):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/secretsanta?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Admin Credentials (used for initial setup)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="changeme"

# Email Service (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"

# SMS Service (Twilio)
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="your_auth_token_here"
TWILIO_PHONE_NUMBER="+1234567890"
```

### Generating NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## Setup Instructions

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy the environment variables above to a `.env` file
   - Fill in your database connection string
   - Generate and add your `NEXTAUTH_SECRET`
   - Add your Resend API key
   - Add your Twilio credentials

3. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

5. **Create admin account:**
   ```bash
   npm run setup-admin
   ```
   This will create an admin account using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your `.env` file.

6. **Run the development server:**
   ```bash
   npm run dev
   ```

7. **Access the application:**
   - Public registration: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

## Usage

1. **Registration**: Share the public URL with participants. They can register with their name and at least one contact method (email or phone).

2. **Manage Spouses**: As admin, go to "Manage Spouses" to define spouse relationships. This ensures spouses won't be assigned to each other.

3. **Generate Assignments**: Once all participants are registered and spouse relationships are set, click "Generate Assignments" in the admin dashboard. This will:
   - Create Secret Santa assignments
   - Send email notifications to participants with email addresses
   - Send SMS notifications to participants with phone numbers

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Create a Vercel account** and import your repository

3. **Set up Vercel Postgres:**
   - In your Vercel project dashboard, go to Storage
   - Create a new Postgres database
   - Copy the connection string

4. **Configure environment variables in Vercel:**
   - Go to Settings → Environment Variables
   - Add all variables from your `.env` file
   - For `DATABASE_URL`, use the connection string from Vercel Postgres
   - For `NEXTAUTH_URL`, use your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

5. **Deploy:**
   - Vercel will automatically detect Next.js and deploy
   - The build process will run Prisma migrations automatically

6. **Run migrations:**
   - After first deployment, you may need to run migrations manually:
   ```bash
   npx prisma migrate deploy
   ```
   Or use Vercel's CLI:
   ```bash
   vercel env pull
   npx prisma migrate deploy
   ```

7. **Create admin account:**
   - After deployment, run the setup script locally with production environment variables, or
   - Create the admin account directly in the database

## Database Migrations

To create a new migration:
```bash
npx prisma migrate dev --name migration-name
```

To apply migrations in production:
```bash
npx prisma migrate deploy
```

## Project Structure

```
secretsanta/
├── app/
│   ├── api/              # API routes
│   ├── admin/            # Admin pages (protected)
│   └── page.tsx          # Public registration page
├── components/           # React components
├── lib/                 # Utility functions
├── prisma/
│   └── schema.prisma    # Database schema
└── public/             # Static assets
```

## Troubleshooting

### Database Connection Issues
- Ensure your PostgreSQL database is running
- Verify the `DATABASE_URL` is correct
- Check database credentials and permissions

### Email/SMS Not Sending
- Verify API keys are correct in environment variables
- Check Resend/Twilio account status and credits
- Review server logs for error messages

### Authentication Issues
- Ensure `NEXTAUTH_SECRET` is set and matches between environments
- Verify `NEXTAUTH_URL` matches your deployment URL
- Clear browser cookies and try again

## License

MIT
