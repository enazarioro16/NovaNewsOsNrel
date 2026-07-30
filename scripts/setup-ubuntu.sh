#!/bin/bash
# NovaNews OS Enterprise AI - Server Provisioning Script
# Target: Ubuntu 22.04 LTS / 24.04 LTS

set -e # Salir inmediatamente si un comando falla

echo "================================================="
echo "Iniciando aprovisionamiento del VPS para NovaNews"
echo "================================================="

# 1. Actualizar repositorios y paquetes del sistema
echo "[1/4] Actualizando sistema operativo..."
sudo apt-update -y && sudo apt-upgrade -y
sudo apt-get install -y ca-certificates curl gnupg ufw

# 2. Configurar Firewall (UFW)
echo "[2/4] Configurando Reglas de Firewall (UFW)..."
sudo ufw default deny incoming
sudo ufw default allow outgoing
# Permitir SSH (Ajusta el puerto si tu VPS usa uno no estándar)
sudo ufw allow 22/tcp
# Permitir tráfico Web (Caddy / Nginx manejarán SSL)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

echo "Habilitando UFW..."
sudo ufw --force enable

# 3. Instalar Docker y Docker Compose V2
echo "[3/4] Instalando Docker Engine..."
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Habilitar Docker en el arranque del sistema
echo "[4/4] Habilitando Docker Daemon..."
sudo systemctl enable docker
sudo systemctl start docker

# Otorgar permisos al usuario actual para correr docker sin 'sudo'
sudo usermod -aG docker $USER

echo "================================================="
echo "¡Aprovisionamiento Completado!"
echo "Por favor, CIERRA ESTA SESIÓN SSH y vuelve a entrar"
echo "para que los permisos de Docker surtan efecto."
echo "================================================="
