#!/bin/bash
echo "🚀 Starting Meraab Backend (NestJS) Production Deployment"

# Go to NestJS project folder
cd /home/ubuntu/Meraab-Backend/MeraabBackend || exit

echo "📥 Pulling latest code..."
git reset --hard
git pull origin main

echo "📦 Installing production dependencies..."
npm install --only=prod

echo "🛠 Building NestJS Backend..."
npm run build

echo "🔄 Restarting PM2 process for Backend..."
pm2 delete MeraabBackend 2>/dev/null
pm2 start "npm run start:prod" --name "MeraabBackend"

echo "💾 Saving PM2 processes..."
pm2 save

echo "🔧 Ensuring PM2 autostart..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu

echo "🎉 Meraab Backend Deployment Complete!"
echo "Meraab Backend is now running in production."