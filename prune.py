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
    print("Connected successfully!")
    
    commands = [
        "docker system prune -a --volumes -f",
        "docker builder prune -a -f",
        "cd ~/NovaNewsOsNrel && docker compose -f docker-compose.prod.yml up --build -d"
    ]
    
    for cmd in commands:
        print(f"\nExecuting: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        
        for line in stdout:
            print(line, end="")
        for line in stderr:
            print(line, end="")
            
        exit_status = stdout.channel.recv_exit_status()
        print(f"Exit status: {exit_status}")
        
finally:
    client.close()
    print("Connection closed.")
