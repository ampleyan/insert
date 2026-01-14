#!/bin/bash

# Windows 98 Desktop - GitHub Pages Deployment Script
# This script helps you deploy your Win98 interface to GitHub Pages

set -e

echo "🚀 Win98 Desktop - GitHub Pages Deployment"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized"
    echo "Run: git init"
    exit 1
fi

# Check for GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username is required"
    exit 1
fi

REPO_NAME="win98"
read -p "Repository name (default: win98): " USER_REPO_NAME
REPO_NAME=${USER_REPO_NAME:-$REPO_NAME}

echo ""
echo "📦 Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo "🌐 Live URL: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo ""

# Check for large video files
echo "🔍 Checking video file sizes..."
LARGE_FILES=$(find videos -name "*.mp4" -size +90M 2>/dev/null || true)

if [ ! -z "$LARGE_FILES" ]; then
    echo "⚠️  Warning: Large video files detected (>90MB):"
    echo "$LARGE_FILES"
    echo ""
    echo "Consider compressing them with:"
    echo "ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset fast -c:a aac -b:a 96k output.mp4"
    echo ""
    read -p "Continue anyway? (y/N): " CONTINUE
    if [[ ! $CONTINUE =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Stage all files
echo "📝 Staging files..."
git add .

# Create commit
echo "💾 Creating commit..."
git commit -m "Deploy: Win98 party promo interface" || echo "Nothing to commit"

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "✓ Remote 'origin' already configured"
else
    echo "🔗 Adding remote repository..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
fi

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. Under 'Source', select 'main' branch"
echo "3. Click 'Save'"
echo "4. Wait 2-5 minutes"
echo "5. Visit: https://$GITHUB_USERNAME.github.io/$REPO_NAME"
echo ""
echo "📚 For more details, see DEPLOY.md"
