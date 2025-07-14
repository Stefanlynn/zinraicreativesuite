# ZiNRAi Creative Suite - replit.md

## Overview

This is a full-stack web application built for ZiNRAi Creative Suite, a platform for accessing and managing creative assets like graphics, videos, templates, and other digital content. The application features a modern React frontend with a comprehensive content management system and project request functionality.

## User Preferences

Preferred communication style: Simple, everyday language.
Design preference: Apple-meets-creativity aesthetic with clean, modern interfaces and smooth interactions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Development**: Hot module replacement with Vite integration

## Key Components

### Database Schema
Located in `shared/schema.ts`, the application uses four main tables:
- **users**: User authentication and management
- **content_items**: Creative assets (graphics, videos, templates, etc.)
- **project_requests**: Custom project requests from users
- **downloads**: Download tracking and analytics

### API Layer
The backend provides RESTful endpoints for:
- Content retrieval with filtering by category, search, and featured status
- Content downloads with tracking
- Project request submissions
- User management (authentication structure in place)

### Frontend Components
- **Content Grid**: Displays creative assets with filtering and search
- **Category Tabs**: Navigation between different content categories
- **Project Request Form**: Form for users to request custom projects
- **File Upload**: Component for handling file uploads in project requests
- **Search Input**: Debounced search functionality

## Data Flow

1. **Content Discovery**: Users browse content through category tabs or search
2. **Content Filtering**: Frontend sends requests to `/api/content` with query parameters
3. **Content Access**: Users click "Get File" to open external links (Dropbox/Google Drive) in new tabs
4. **Download Tracking**: File access is tracked in the database for analytics
5. **Project Requests**: Users submit custom project requests through a comprehensive form
6. **File Handling**: Reference files can be uploaded as part of project requests
7. **Admin Management**: Admins can add, edit, and delete content items with external file URLs

## Admin Dashboard

### Authentication
- Simple session-based authentication system
- Demo credentials: admin/admin123
- Session tokens stored in localStorage
- Admin routes protected with middleware

### Content Management
- Add new assets with external file URLs (Dropbox/Google Drive links)
- Edit existing content items (title, description, category, type, URLs)
- Delete content items with confirmation
- Toggle featured status for content
- Real-time stats dashboard showing total assets, downloads, and project requests

### Project Request Management
- View all submitted project requests
- Monitor request status and details
- Access user contact information and project descriptions

### External File Integration
- Content items link to external files (Dropbox, Google Drive, etc.)
- Users click "Get File" to open files in new tabs
- No actual file hosting - all files are external links
- Download tracking still works for analytics

## External Dependencies

### UI and Styling
- **Radix UI**: Comprehensive set of accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom ZiNRAi brand colors
- **Lucide Icons**: Icon library for consistent iconography

### Database and Storage
- **Neon Database**: Serverless PostgreSQL database
- **Drizzle ORM**: Type-safe database operations and migrations

### Development Tools
- **Vite**: Fast build tool with HMR and optimization
- **TypeScript**: Type safety across the entire application
- **Replit Integration**: Development environment optimizations

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds the React application to `dist/public`
- **Backend**: esbuild bundles the Express server to `dist/index.js`
- **Database**: Drizzle migrations are applied via `db:push` command

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution and Vite dev server
- **Production**: Serves built static files through Express with API routes
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection

### Key Features
- **Hot Module Replacement**: Instant updates during development
- **Static Asset Serving**: Express serves the built React application
- **API Integration**: Seamless integration between frontend and backend
- **Database Migrations**: Automated schema management with Drizzle
- **Error Handling**: Comprehensive error boundaries and API error handling

The application is designed to be easily deployable on Replit with automatic environment provisioning and optimized for both development and production workflows.