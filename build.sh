#!/bin/bash
echo "Building Kahani for production..."

# Install dependencies
npm install

# Build client
echo "Building client..."
vite build --outDir dist/public --emptyOutDir

# Build server
echo "Building server..."
esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:@neondatabase/serverless --external:ws

echo "Build completed successfully!"
echo "To start the server: node dist/index.js"