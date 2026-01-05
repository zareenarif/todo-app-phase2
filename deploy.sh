#!/bin/bash
# Automated Deployment Script for Todo App
# This script sets up and deploys your application to Render

set -e

echo "🚀 Starting automated deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Step 1: Checking repository status${NC}"
cd "$(dirname "$0")"

if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
fi

# Check if we have a remote
if ! git remote | grep -q "origin"; then
    echo -e "${YELLOW}Adding GitHub remote...${NC}"
    git remote add origin https://github.com/zareenarif/todo-app-phase-2.git
fi

echo -e "${BLUE}Step 2: Committing latest changes${NC}"
git add .
git commit -m "feat: add deployment configurations" || echo "No changes to commit"
git push origin 004-fullstack-web-app || git push -u origin 004-fullstack-web-app

echo -e "${GREEN}✓ Code pushed to GitHub${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   DEPLOYMENT READY!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}To complete deployment, follow these simple steps:${NC}"
echo ""
echo -e "${BLUE}OPTION 1: One-Click Deploy to Render (Recommended)${NC}"
echo "1. Click this link: https://render.com/deploy?repo=https://github.com/zareenarif/todo-app-phase-2"
echo "2. Sign in with GitHub"
echo "3. Click 'Connect' to link your repository"
echo "4. All services will be deployed automatically!"
echo ""
echo -e "${BLUE}OPTION 2: Manual Render Setup${NC}"
echo "1. Go to: https://render.com"
echo "2. Sign in with GitHub"
echo "3. Click 'New +' → 'Blueprint'"
echo "4. Select your repository: todo-app-phase-2"
echo "5. Click 'Apply' - Render will read render.yaml and deploy everything"
echo ""
echo -e "${BLUE}OPTION 3: Railway + Vercel${NC}"
echo "Backend (Railway):"
echo "  1. Go to: https://railway.app"
echo "  2. Sign in with GitHub"
echo "  3. New Project → Deploy from GitHub repo → Select todo-app-phase-2"
echo "  4. Select 'backend' as root directory"
echo ""
echo "Frontend (Vercel):"
echo "  1. Go to: https://vercel.com"
echo "  2. Sign in with GitHub"
echo "  3. Import repository: todo-app-phase-2"
echo "  4. Set root directory to 'frontend'"
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}After deployment, your app will be live!${NC}"
echo -e "${GREEN}========================================${NC}"
