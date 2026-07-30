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
        "lsblk",
        "df -h"
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
