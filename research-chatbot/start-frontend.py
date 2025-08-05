
#!/usr/bin/env python3
import os
import subprocess

# Change to frontend directory
frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
os.chdir(frontend_dir)

# Install npm dependencies
print("Installing frontend dependencies...")
subprocess.run(["npm", "install"])

# Start the React development server
print("Starting frontend server on port 3000...")
subprocess.run(["npm", "start"])
