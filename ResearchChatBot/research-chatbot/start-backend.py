
#!/usr/bin/env python3
import os
import sys
import subprocess

# Change to backend directory
backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
os.chdir(backend_dir)

# Install required packages
print("Installing backend dependencies...")
subprocess.run([sys.executable, "-m", "pip", "install", "-r", "../requirements.txt"])

# Start the backend server
print("Starting backend server on port 8000...")
subprocess.run([sys.executable, "main.py"])
