# Netlify Deployment Guide for ZiNRAi Creative Suite

## Prerequisites

1. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
2. **GitHub Repository**: Push your code to a GitHub repository

## Deployment Steps

### 1. Connect to Netlify

1. Go to your Netlify dashboard
2. Click "New site from Git"
3. Choose GitHub and authorize Netlify
4. Select your repository

### 2. Build Configuration

Netlify will automatically detect these settings from `netlify.toml`:

- **Build command**: `chmod +x build.sh && ./build.sh`
- **Publish directory**: `dist/public`
- **Functions directory**: `dist/functions`

### 3. Environment Variables

No environment variables are required for the basic setup since we're using in-memory storage.

### 4. Deploy

1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at the generated Netlify URL

## Features Supported

✅ **Frontend**: Full React application with Tailwind CSS
✅ **Admin Dashboard**: Complete content management system
✅ **File Uploads**: Thumbnail images (converted to base64)
✅ **External Links**: Dropbox/Google Drive file hosting
✅ **Project Requests**: Contact form submissions
✅ **Authentication**: Admin login system
✅ **Download Tracking**: Analytics for content downloads

## API Endpoints

All API endpoints are available under `/.netlify/functions/api/`:

- `GET /api/content` - Get content items
- `POST /api/content` - Create content (admin)
- `PATCH /api/content/:id` - Update content (admin)
- `DELETE /api/content/:id` - Delete content (admin)
- `POST /api/content/:id/download` - Track downloads
- `POST /api/project-requests` - Submit project requests
- `GET /api/project-requests` - Get project requests (admin)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/stats/downloads` - Download statistics (admin)

## Admin Access

- **URL**: `https://yoursite.netlify.app/admin/login`
- **Username**: `andre.butler@zinrai.com`
- **Password**: `6September2008`

## Data Storage

The application uses in-memory storage which means:
- ✅ Fast performance
- ✅ No database costs
- ⚠️ Data resets on each deployment
- ⚠️ Data doesn't persist between function cold starts

## Limitations

1. **Data Persistence**: Data is stored in memory and will reset on deployments
2. **Function Timeout**: Netlify functions have a 10-second timeout
3. **File Storage**: Thumbnails are stored as base64 (limited to 5MB)
4. **Cold Starts**: First request after inactivity may be slower

## Custom Domain (Optional)

1. In Netlify dashboard, go to "Domain management"
2. Add your custom domain
3. Configure DNS settings as instructed
4. SSL certificate will be automatically provisioned

## Current Status

Your Netlify site is currently showing a 404 error, which indicates the build process is failing. Here's how to fix it:

### Fix Steps Required:

1. **Check Build Logs**: Go to your Netlify dashboard → Site settings → Build & deploy → Build logs
2. **Common Issues**:
   - Build timeout (Vite build taking too long)
   - Missing dependencies
   - Node version mismatch

### Immediate Solutions:

**Option 1: Use Faster Build**
```bash
# In netlify.toml, change the build command to:
command = "npm run build && mkdir -p dist/functions && cp netlify/functions/api.ts dist/functions/api.js"
```

**Option 2: Push Latest Changes**
The current build script has been updated with verification steps. Push your latest changes to trigger a new build.

### Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify the build script has execute permissions
- If build times out, try reducing bundle size or using simpler build commands

### Functions Not Working
- Check function logs in Netlify dashboard
- Verify API calls are prefixed with `/.netlify/functions/api`
- Ensure CORS headers are properly configured

### Admin Login Issues
- Use the exact credentials: `andre.butler@zinrai.com` / `6September2008`
- Check browser console for any errors
- Verify the login API endpoint is working

## Next Steps

After deployment, you can:
1. Access your site at the provided Netlify URL
2. Login to admin dashboard to add content
3. Test all functionality with real data
4. Set up custom domain if desired
5. Monitor usage through Netlify analytics

## Support

For Netlify-specific issues, consult [Netlify Documentation](https://docs.netlify.com/).
For application issues, refer to the main project documentation.