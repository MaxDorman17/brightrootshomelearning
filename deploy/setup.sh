#!/bin/bash
# Bright Roots Home Learning — Server Setup
# Run this once on the Dell server as a non-root user with sudo access.
# Usage: bash setup.sh

set -e

APP_DIR="/opt/brightrootshomelearning"
DOMAIN="brightrootshomelearning.co.uk"
REPO="https://github.com/MaxDorman17/brightrootshomelearning.git"
SERVICE_USER=$(whoami)

echo "========================================"
echo "  Bright Roots Home Learning — Setup"
echo "========================================"
echo "Install dir : $APP_DIR"
echo "Domain      : $DOMAIN"
echo "Service user: $SERVICE_USER"
echo ""

# ── 1. System packages ──────────────────────────────────────────────────────
echo "[1/7] Installing system packages..."
sudo apt update -qq
sudo apt install -y python3 python3-pip python3-venv git nginx curl

# Node.js 20 LTS (skip if already ≥18)
if ! node --version 2>/dev/null | grep -qE "v(18|20|22|24)"; then
    echo "      Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
fi

echo "      node $(node --version) | python3 $(python3 --version)"

# ── 2. Clone / pull repo ─────────────────────────────────────────────────────
echo "[2/7] Cloning repository..."
if [ -d "$APP_DIR/.git" ]; then
    echo "      Repo already exists — pulling latest..."
    git -C "$APP_DIR" pull
else
    sudo mkdir -p "$APP_DIR"
    sudo chown "$SERVICE_USER:$SERVICE_USER" "$APP_DIR"
    git clone "$REPO" "$APP_DIR"
fi

# ── 3. Backend (Python / FastAPI) ────────────────────────────────────────────
echo "[3/7] Setting up backend..."
cd "$APP_DIR/backend"
python3 -m venv venv
./venv/bin/pip install --upgrade pip -q
./venv/bin/pip install -r requirements.txt -q

# Create .env if it doesn't exist (SECRET_KEY is generated once and stays)
if [ ! -f "$APP_DIR/backend/.env" ]; then
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
    cat > "$APP_DIR/backend/.env" << EOF
SECRET_KEY=${SECRET_KEY}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
EOF
    echo "      Created backend/.env with generated SECRET_KEY"
else
    echo "      backend/.env already exists — skipping"
fi

# ── 4. Frontend (Next.js) ────────────────────────────────────────────────────
echo "[4/7] Setting up frontend..."
cd "$APP_DIR/frontend"

# NEXT_PUBLIC_API_URL tells the browser where to send API requests.
# With nginx on the same domain, this is just the domain itself.
if [ ! -f "$APP_DIR/frontend/.env.production" ]; then
    cat > "$APP_DIR/frontend/.env.production" << EOF
NEXT_PUBLIC_API_URL=https://${DOMAIN}
EOF
    echo "      Created frontend/.env.production"
fi

npm ci --silent
npm run build

# ── 5. Systemd services ──────────────────────────────────────────────────────
echo "[5/7] Installing systemd services..."

sudo tee /etc/systemd/system/homeschool-backend.service > /dev/null << EOF
[Unit]
Description=Bright Roots Homeschool Backend (FastAPI/uvicorn)
After=network.target

[Service]
User=${SERVICE_USER}
WorkingDirectory=${APP_DIR}/backend
EnvironmentFile=${APP_DIR}/backend/.env
ExecStart=${APP_DIR}/backend/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

NODE_BIN=$(which node)
sudo tee /etc/systemd/system/homeschool-frontend.service > /dev/null << EOF
[Unit]
Description=Bright Roots Homeschool Frontend (Next.js)
After=network.target

[Service]
User=${SERVICE_USER}
WorkingDirectory=${APP_DIR}/frontend
Environment="NODE_ENV=production"
ExecStart=${NODE_BIN} node_modules/.bin/next start -p 3000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable homeschool-backend homeschool-frontend
sudo systemctl restart homeschool-backend homeschool-frontend

echo "      Services enabled and started"

# ── 6. nginx ─────────────────────────────────────────────────────────────────
echo "[6/7] Configuring nginx..."

sudo tee /etc/nginx/sites-available/brightrootshomelearning > /dev/null << 'NGINXEOF'
server {
    listen 80;
    server_name brightrootshomelearning.co.uk www.brightrootshomelearning.co.uk;

    client_max_body_size 10M;

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

# Remove default nginx site if it's still enabled
sudo rm -f /etc/nginx/sites-enabled/default

sudo ln -sf /etc/nginx/sites-available/brightrootshomelearning \
            /etc/nginx/sites-enabled/brightrootshomelearning

sudo nginx -t
sudo systemctl reload nginx

# ── 7. Status check ──────────────────────────────────────────────────────────
echo "[7/7] Checking service status..."
echo ""
sleep 3
sudo systemctl status homeschool-backend --no-pager -l | head -8
echo ""
sudo systemctl status homeschool-frontend --no-pager -l | head -8
echo ""

echo "========================================"
echo "  Setup complete!"
echo "========================================"
echo ""
echo "Remaining step — Cloudflare Tunnel:"
echo "  In the Cloudflare Zero Trust dashboard, add a Public Hostname:"
echo "    Hostname : brightrootshomelearning.co.uk"
echo "    Service  : http://localhost:80"
echo ""
echo "  Also add a second hostname for www (optional):"
echo "    Hostname : www.brightrootshomelearning.co.uk"
echo "    Service  : http://localhost:80"
echo ""
echo "  Cloudflare handles HTTPS automatically — no certbot needed."
echo ""
echo "Check logs at any time:"
echo "  journalctl -u homeschool-backend -f"
echo "  journalctl -u homeschool-frontend -f"
