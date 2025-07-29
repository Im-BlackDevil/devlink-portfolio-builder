# Vercel Deployment Guide

## Prerequisites
- GitHub repository with your project
- Vercel account

## Step 1: Prepare Your Repository

1. Make sure your `.gitignore` includes:
   ```
   .next/
   node_modules/
   .env
   ```

2. Commit and push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Fix deployment configuration"
   git push origin main
   ```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

## Step 3: Set Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

### Required Variables:
```
DATABASE_URL=your-database-url
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Optional Variables (for AI features):
```
OPENAI_API_KEY=your-openai-api-key
```

## Step 4: Database Setup

Since you're using SQLite locally, you'll need to set up a production database:

### Option 1: Use Vercel Postgres (Recommended)
1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string to `DATABASE_URL`

### Option 2: Use PlanetScale (Free tier available)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get the connection string and add it to `DATABASE_URL`

### Option 3: Use Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get the connection string and add it to `DATABASE_URL`

## Step 5: Update Database Schema

After setting up your production database, you'll need to run migrations:

1. Update your `DATABASE_URL` in Vercel environment variables
2. Deploy your project
3. Run database migrations (you may need to do this manually or set up a build script)

## Step 6: Verify Deployment

1. Check that your app builds successfully
2. Test the authentication flow
3. Verify all features work as expected

## Troubleshooting

### Common Issues:

1. **Build fails with NextAuth error**:
   - Make sure `NEXTAUTH_SECRET` is set
   - Ensure `NEXTAUTH_URL` matches your domain

2. **Database connection issues**:
   - Verify `DATABASE_URL` is correct
   - Check if your database is accessible from Vercel

3. **Environment variables not working**:
   - Make sure variables are set in Vercel dashboard
   - Redeploy after adding new variables

### Local Testing:
Before deploying, test locally:
```bash
npm run build
npm start
```

## Additional Notes

- The `output: 'standalone'` in `next.config.js` optimizes for Vercel deployment
- `serverActions: true` enables server actions if you use them
- Make sure all API routes are properly typed and don't have static generation issues 