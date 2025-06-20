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

### Simple File-Based Deployment

This version uses local file storage instead of a database, making deployment much simpler.

### 1. Deploy with render.yaml (Recommended)

1. Push your code to GitHub with the `render.yaml` file
2. Go to Render Dashboard
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically deploy your app

### 2. Manual Deployment

1. Create a new Web Service on Render:
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command**: `npm install && vite build --outDir dist/public --emptyOutDir && esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:@neondatabase/serverless --external:ws`
     - **Start Command**: `node dist/index.js`
     - **Node Version**: 18 or higher

2. Set environment variable:
   - `NODE_ENV`: `production`

### 3. What happens during deployment

- Application builds and deploys
- File storage system initializes automatically
- Default categories are created
- Stories are stored in local JSON files
- Your app goes live immediately

Your Kahani platform will be available at the Render-provided URL with persistent file storage.

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

The app will automatically create a `data` directory and initialize with default categories.

## Troubleshooting Deployment

### Common Issues:

**Build Failures:**
- Check that all dependencies are in package.json
- Verify Node.js version compatibility (18+)
- Review build logs for specific error messages

**File Storage Issues:**
- The app creates a `data` directory automatically
- Stories are stored in JSON files that persist across restarts
- No database configuration needed

### Render-specific Tips:
- File storage works immediately without setup
- Stories persist in the container filesystem
- Monitor deployment logs for any build issues
- Categories initialize automatically on first run

## Admin Panel

Access the admin panel at `/admin` to:
- Review and approve submitted stories
- Feature stories on the homepage
- Delete inappropriate content
- Monitor platform activity
https://kahanivoices.onrender.com/

![Screenshot (360)](https://github.com/user-attachments/assets/2689efa9-937b-45dc-9b56-bee2e456ebf3)

![Screenshot (347)](https://github.com/user-attachments/assets/83aa5437-f3cf-4110-a946-adc09d231bb9)

![Screenshot (348)](https://github.com/user-attachments/assets/4508981c-ebd3-4c98-b027-c692bedbcd86)
![Screenshot (349)](https://github.com/user-attachments/assets/22c74dc5-0c55-4e99-8edd-1702e128122d)
