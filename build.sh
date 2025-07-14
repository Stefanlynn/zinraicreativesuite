#!/bin/bash
set -e

# Build the frontend
echo "Building frontend..."
npx vite build

# Build the Netlify functions
echo "Building Netlify functions..."
mkdir -p dist/functions
npx esbuild netlify/functions/api.ts --platform=node --packages=external --bundle --format=esm --outdir=dist/functions --external:@netlify/functions --target=node18

echo "Build completed successfully!"