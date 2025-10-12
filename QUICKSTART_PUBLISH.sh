#!/bin/bash
# Quick script to publish Komodo Actions to GitHub

echo "🚀 Publishing Komodo Actions to GitHub"
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
  echo "Initializing git..."
  git init
fi

# Add all files
echo "Adding files..."
git add .

# Commit
echo "Creating commit..."
git commit -m "feat: Komodo deploy GitHub Action with services and logs support

Features:
- Deploy Komodo stacks via GitHub Actions
- Support specific services deployment (comma-separated)
- Show detailed deployment logs
- Wait for completion or trigger only mode
- Handle update ID and status outputs"

# Add remote (update this with your repo URL)
echo "Adding remote..."
git remote add origin https://github.com/pandeptwidyaop/komodoactions.git 2>/dev/null || echo "Remote already exists"

# Push to main
echo "Pushing to main..."
git branch -M main
git push -u origin main

# Create tags
echo "Creating version tags..."
git tag -a v1.0.0 -m "Release v1.0.0 - Initial release

Features:
- Deploy Komodo stacks via GitHub Actions
- Support for specific services deployment
- Detailed deployment logs
- Wait for completion or trigger mode"

git tag -a v1 -m "Release v1"

# Push tags
echo "Pushing tags..."
git push origin v1.0.0
git push origin v1

echo ""
echo "✅ Done! Your action is now available at:"
echo "   https://github.com/pandeptwidyaop/komodoactions"
echo ""
echo "📖 Test it in another repo with:"
echo "   uses: pandeptwidyaop/komodoactions@v1"
