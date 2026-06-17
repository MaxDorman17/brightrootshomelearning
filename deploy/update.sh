#!/bin/bash
# Bright Roots Home Learning — Update Script
# Run this whenever you push new code to GitHub.
# Usage: bash update.sh

set -e

APP_DIR="/opt/brightrootshomelearning"

echo "Pulling latest code..."
git -C "$APP_DIR" pull

echo "Updating backend dependencies..."
cd "$APP_DIR/backend"
./venv/bin/pip install -r requirements.txt -q

echo "Rebuilding frontend..."
cd "$APP_DIR/frontend"
npm ci --silent
npm run build

echo "Restarting services..."
sudo systemctl restart homeschool-backend homeschool-frontend

echo ""
echo "Done. Services restarted."
sudo systemctl status homeschool-backend --no-pager | head -4
sudo systemctl status homeschool-frontend --no-pager | head -4
