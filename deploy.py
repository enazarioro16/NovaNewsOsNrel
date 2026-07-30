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
        "cd ~/NovaNewsOsNrel && git pull origin main",
        "cd ~/NovaNewsOsNrel && docker compose -f docker-compose.prod.yml build --no-cache",
        "cd ~/NovaNewsOsNrel && docker compose -f docker-compose.prod.yml up -d"
    ]
    
    for cmd in commands:
        print(f"\nExecuting: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        
        # Read the output line by line as it is being produced
        for line in stdout:
            print(line, end="")
        for line in stderr:
            print(line, end="")
            
        exit_status = stdout.channel.recv_exit_status()
        print(f"Exit status: {exit_status}")
        
        if exit_status != 0:
            print(f"Command failed: {cmd}")
            sys.exit(1)

finally:
    client.close()
    print("Connection closed.")
