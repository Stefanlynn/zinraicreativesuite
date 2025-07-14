#!/bin/bash
set -e

# Ensure directories exist
mkdir -p dist/public
mkdir -p dist/functions

# Build the frontend
echo "Building frontend..."
npx vite build

# Verify frontend build
if [ ! -f "dist/public/index.html" ]; then
    echo "Frontend build failed - index.html not found"
    exit 1
fi

# Build the Netlify functions
echo "Building Netlify functions..."
npx esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/functions --external:@netlify/functions --target=node18

# Verify function build
if [ ! -f "dist/functions/api.js" ]; then
    echo "Function build failed - api.js not found"
    exit 1
fi

echo "Build completed successfully!"
echo "Frontend files:"
ls -la dist/public/
echo "Function files:"
ls -la dist/functions/