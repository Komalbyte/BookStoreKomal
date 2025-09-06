#!/bin/bash

echo "🚀 Pushing to both repositories..."

# Push to your repository
echo "📤 Pushing to your repository (origin)..."
git push origin main

# Push to friend's repository
echo "📤 Pushing to friend's repository..."
git push friend main

echo "✅ Successfully pushed to both repositories!"
echo "🔗 Your repo: https://github.com/rosh-an-n/BookStore"
echo "🔗 Friend's repo: https://github.com/Komalbyte/BookStoreKomal"
