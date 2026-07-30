import paramiko
import sys
import codecs

sys.stdout.reconfigure(encoding='utf-8')

host = '192.168.101.10'
username = 'systemnrel'
password = 'admin'

print(f"Connecting to {host} as {username}...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    client.connect(hostname=host, username=username, password=password, timeout=10)
    
    commands = [
        "echo 'admin' | sudo -S growpart /dev/sda 3",
        "echo 'admin' | sudo -S pvresize /dev/sda3",
        "echo 'admin' | sudo -S lvextend -l +100%FREE /dev/ubuntu-vg/ubuntu-lv",
        "echo 'admin' | sudo -S resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv",
        "df -h /",
        "cd ~/NovaNewsOsNrel && docker compose -f docker-compose.prod.yml up --build -d"
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
