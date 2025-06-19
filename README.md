# Kahani - Story Sharing Platform

A platform for sharing real-life stories and amplifying marginalized community voices.

## Features

- 📖 Story submission with rich text editor
- 🏷️ Category-based organization
- 🔍 Search and filtering capabilities
- ⭐ Featured stories system
- 👨‍💼 Admin panel for content moderation
- 📱 Responsive design

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Build**: Vite

## Deployment on Render

### 1. Database Setup

1. Create a PostgreSQL database on Render:
   - Go to your Render dashboard
   - Click "New" → "PostgreSQL"
   - Name it `kahani-db`
   - Note down the connection details

### 2. Web Service Setup

#### Option A: Using render.yaml (Recommended)
1. Push the `render.yaml` file to your repository
2. Go to Render Dashboard
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically create both the database and web service

#### Option B: Manual Setup
1. **First, create the database:**
   - Go to Render Dashboard
   - Click "New" → "PostgreSQL" 
   - Name: `kahani-db`
   - Database Name: `kahani`
   - User: `kahani`

2. **Then create the web service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command**: `npm install && vite build --outDir dist/public --emptyOutDir && esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:@neondatabase/serverless --external:ws`
     - **Start Command**: `npm run db:push && node dist/index.js`
     - **Node Version**: 18 or higher

### 3. Environment Variables

**For Blueprint (render.yaml):**
- Environment variables are automatically configured

**For Manual Setup:**
Add these environment variables in your web service:

- `NODE_ENV`: `production`
- `DATABASE_URL`: Your PostgreSQL connection string from the database you created

**Getting the DATABASE_URL:**
1. Go to your PostgreSQL database in Render
2. Copy the "External Database URL" 
3. The format should be: `postgresql://username:password@hostname:port/database_name`

### 4. Deploy

**For Blueprint:**
1. After connecting your repository, Render will automatically deploy
2. Monitor the build logs for any issues

**For Manual Setup:**
1. Ensure the DATABASE_URL environment variable is set
2. Click "Create Web Service"
3. Render will automatically build and deploy

**What happens during deployment:**
- Application builds successfully
- Database migrations run automatically
- Default categories are initialized
- Your app goes live

Your Kahani platform will be available at the Render-provided URL.

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file with `DATABASE_URL` (see `.env.example`)
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

## Troubleshooting Deployment

### Common Issues:

**"DATABASE_URL must be set" Error:**
- For Blueprint: Make sure the database section is defined before the services section in `render.yaml`
- For Manual: Ensure you've created the PostgreSQL database first, then added the DATABASE_URL to your web service environment variables
- Double-check the connection string format: `postgresql://user:password@host:port/database`

**Build Failures:**
- Check that all dependencies are in package.json (don't edit manually)
- Verify Node.js version compatibility (18+)
- Review build logs for specific error messages

**Database Connection Issues:**
- Ensure your PostgreSQL database is running
- Verify SSL connections are enabled
- Use the "External Database URL" from Render, not the internal one

### Render-specific Tips:
- Always create the database before the web service
- Use PostgreSQL 14+ for best compatibility  
- Monitor the deployment logs carefully
- Database initialization happens automatically on first run

## Admin Panel

Access the admin panel at `/admin` to:
- Review and approve submitted stories
- Feature stories on the homepage
- Delete inappropriate content
- Monitor platform activity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.