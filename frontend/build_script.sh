#!/bin/bash
# Exit immediately if a command exits with a non-zero status
set -e

# Run build and capture exit status
echo "Starting build process..."
npm run build
BUILD_STATUS=$?

# Check if build was successful
if [ $BUILD_STATUS -ne 0 ]; then
  echo "ERROR: npm build failed with status $BUILD_STATUS"
  exit $BUILD_STATUS
fi

echo "Build successful, deploying files..."
sudo rm -rf /var/www/html/map/*
sudo mv ./dist/* /var/www/html/map/
echo "Deployment complete!"
