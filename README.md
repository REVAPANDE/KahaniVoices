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
2. Connect your GitHub repository to Render
3. Render will automatically use the configuration from `render.yaml`

#### Option B: Manual Setup
1. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command**: `npm install && vite build --outDir dist/public --emptyOutDir && esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:@neondatabase/serverless --external:ws`
     - **Start Command**: `npm run db:push && node dist/index.js`
     - **Node Version**: 18 or higher

### 3. Environment Variables

Add these environment variables in Render:

- `NODE_ENV`: `production`
- `DATABASE_URL`: Your PostgreSQL connection string from step 1

The connection string format:
```
postgresql://username:password@hostname:port/database_name
```

### 4. Deploy

1. Click "Create Web Service" (or push to trigger auto-deploy with render.yaml)
2. Render will automatically:
   - Build your application
   - Run database migrations
   - Initialize default categories
   - Deploy your app

Your Kahani platform will be live at the Render-provided URL.

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your `.env` file with `DATABASE_URL` (see `.env.example`)
4. Run database migrations: `npm run db:push`
5. Start development server: `npm run dev`

## Troubleshooting Deployment

### Common Issues:
- **Database connection errors**: Ensure your `DATABASE_URL` is correctly formatted
- **Build failures**: Check that all dependencies are listed in package.json
- **Missing tables**: The app will automatically initialize the database on first run

### Render-specific:
- Use PostgreSQL 14+ for best compatibility
- Ensure your database allows SSL connections
- Check the Render logs for detailed error messages

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