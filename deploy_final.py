import paramiko
import sys
import codecs
import os

sys.stdout.reconfigure(encoding='utf-8')

host = '192.168.101.10'
username = 'systemnrel'
password = 'admin'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(hostname=host, username=username, password=password, timeout=10)
    
    # Extraer variables de entorno del sistema local o usar valores por defecto
    gh_id = os.environ.get('AUTH_GITHUB_ID', '')
    gh_secret = os.environ.get('AUTH_GITHUB_SECRET', '')
    stripe_sk = os.environ.get('STRIPE_SECRET_KEY', 'sk_test_mock')
    stripe_wh = os.environ.get('STRIPE_WEBHOOK_SECRET', '')
    stripe_price = os.environ.get('STRIPE_PRO_PRICE_ID', 'price_mock_pro')

    export_cmd = f"export AUTH_GITHUB_ID='{gh_id}' AUTH_GITHUB_SECRET='{gh_secret}' STRIPE_SECRET_KEY='{stripe_sk}' STRIPE_WEBHOOK_SECRET='{stripe_wh}' STRIPE_PRO_PRICE_ID='{stripe_price}'"

    commands = [
        "cd ~/NovaNewsOsNrel && git pull origin main",
        f"cd ~/NovaNewsOsNrel && {export_cmd} && docker compose -f docker-compose.prod.yml up --build -d",
        "cd ~/NovaNewsOsNrel && docker compose -f docker-compose.prod.yml ps"
    ]
    
    for cmd in commands:
        print(f"\n--- Executing: {cmd} ---")
        stdin, stdout, stderr = client.exec_command(cmd)
        
        for line in stdout:
            print(line, end="")
        for line in stderr:
            print(line, end="")
            
finally:
    client.close()
