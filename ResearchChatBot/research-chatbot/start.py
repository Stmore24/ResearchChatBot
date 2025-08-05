
#!/usr/bin/env python3
import os
import sys
import subprocess
import threading
import time

def start_backend():
    """Start the FastAPI backend server"""
    backend_dir = os.path.join(os.path.dirname(__file__), 'backend')
    os.chdir(backend_dir)
    
    print("🚀 Starting backend server...")
    subprocess.run([sys.executable, "main.py"])

def start_frontend():
    """Start the React frontend server"""
    time.sleep(3)  # Wait for backend to start
    frontend_dir = os.path.join(os.path.dirname(__file__), 'frontend')
    os.chdir(frontend_dir)
    
    # Install dependencies if node_modules doesn't exist
    if not os.path.exists('node_modules'):
        print("📦 Installing frontend dependencies...")
        subprocess.run(["npm", "install"])
    
    print("🌐 Starting frontend server...")
    subprocess.run(["npm", "start"])

if __name__ == "__main__":
    print("🤖 Research Chatbot - Starting Application")
    print("=" * 50)
    
    # Start backend in a separate thread
    backend_thread = threading.Thread(target=start_backend)
    backend_thread.daemon = True
    backend_thread.start()
    
    # Start frontend in main thread
    try:
        start_frontend()
    except KeyboardInterrupt:
        print("\n\n👋 Shutting down servers...")
        sys.exit(0)
