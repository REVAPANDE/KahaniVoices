# Kahani - Story Sharing Platform

## Overview

Kahani is a full-stack story sharing platform that allows users to submit, browse, and discover meaningful stories across different categories. The platform focuses on amplifying voices and creating a community where authentic storytelling drives social impact. Users can submit stories for moderation, browse by categories, and engage with content through a clean, modern interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI components with shadcn/ui design system
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON responses
- **Development**: Hot reload with tsx for TypeScript execution

### Data Storage
- **Storage Type**: File-based JSON storage for simplicity
- **Implementation**: FileStorage class using local JSON files
- **Persistence**: Stories stored in ./data directory
- **Auto-initialization**: Categories and data structure created automatically

## Key Components

### Database Schema
- **Users**: Authentication and user management
- **Stories**: Main content with moderation workflow (pending/approved/rejected status)
- **Categories**: Organized content categorization with metadata
- **Story Fields**: Title, content, author info, category, tags, status, featured flag

### API Endpoints
- `GET /api/stories` - Retrieve approved stories with optional filtering
- `GET /api/stories/:id` - Get individual story details
- `POST /api/stories` - Submit new story for moderation
- `GET /api/categories` - List all categories with story counts
- Search and category filtering capabilities

### Frontend Pages
- **Home**: Hero section, featured stories, category overview
- **Stories**: Browse all stories with search and filtering
- **Story Detail**: Individual story view with sharing capabilities
- **Story Submission**: Form-based story creation with rich text editing
- **404**: Custom not found page

### UI Components
- **Header**: Navigation with search functionality
- **StoryCard**: Story preview with metadata
- **CategoryCard**: Category display with gradients and icons
- **RichTextEditor**: Content creation with formatting tools

## Data Flow

1. **Story Submission**: Users submit stories through the submission form
2. **Moderation**: Stories enter "pending" status awaiting approval
3. **Publication**: Approved stories become visible to all users
4. **Discovery**: Users browse stories by category or search
5. **Engagement**: Stories can be featured and shared

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless** - Serverless PostgreSQL connection
- **drizzle-orm** - Type-safe database ORM
- **@tanstack/react-query** - Server state management
- **@radix-ui/react-*** - Accessible UI primitives
- **react-hook-form** - Form state management
- **@hookform/resolvers** - Form validation with Zod
- **wouter** - Lightweight React router

### Development Tools
- **Vite** - Build tool and development server
- **TypeScript** - Type safety and developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **ESBuild** - Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with npm
- **Database**: PostgreSQL 16
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Automatic restart on file changes

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: ESBuild bundle to `dist/index.js`
- **Deployment**: Replit autoscale deployment target
- **Environment**: Production mode with optimized assets

### File Storage Management
- **Data Directory**: `./data/` with JSON files
- **Files**: users.json, stories.json, categories.json
- **Auto-initialization**: Default categories created on startup

## Changelog

- June 19, 2025: Simplified for Render deployment
  - Replaced database with file-based storage
  - Removed DATABASE_URL dependency
  - Stories now auto-approve for testing
  - Simplified deployment configuration
  - Data persists in JSON files
- June 19, 2025: Added complete admin functionality
  - Added story deletion with confirmation
  - Enhanced admin panel with full CRUD operations
  - Fixed featured stories endpoint issues
  - Added database management capabilities
- June 19, 2025: Added PostgreSQL database
  - Replaced in-memory storage with DatabaseStorage
  - Configured Drizzle ORM with PostgreSQL
  - Initialized database with default categories
  - All data now persists across application restarts
- June 18, 2025: Initial setup
  - Created complete storytelling platform
  - Implemented frontend with React/TypeScript
  - Built REST API with Express
  - Added story submission and browsing features

## User Preferences

Preferred communication style: Simple, everyday language.