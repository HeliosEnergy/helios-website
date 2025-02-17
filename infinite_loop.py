import time
import signal
import sys

def signal_handler(sig, frame):
    print('Gracefully shutting down...')
    sys.exit(0)

def main():
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    
    print("Container is running... (DEBUG: Script started)")
    sys.stdout.flush()  # Force the print to show up in logs immediately
    
    while True:
        print("DEBUG: Still alive")  # Add debug print
        sys.stdout.flush()
        time.sleep(60)

if __name__ == "__main__":
    print("DEBUG: Script launched")  # Add debug print
    sys.stdout.flush()
    main()
