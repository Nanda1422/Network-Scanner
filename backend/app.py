from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import scanner
import os
import json
import threading

app = Flask(__name__, static_folder='../frontend')
CORS(app)  # Enable CORS for all routes

# Store scan results
scan_history = []
current_scan = {"status": "idle", "progress": 0, "devices": [], "results": []}

@app.route('/')
def index():
    return send_from_directory('../frontend', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../frontend', path)

@app.route('/api/scan', methods=['POST'])
def start_scan():
    global current_scan
    
    data = request.json
    target_ip = data.get('target', '')
    ports_str = data.get('ports', '21,22,23,80,443,445,3389')
    
    # Validate input
    if not target_ip:
        return jsonify({"error": "Target IP range is required"}), 400
    
    try:
        ports_to_scan = [int(p) for p in ports_str.split(',')]
    except ValueError:
        return jsonify({"error": "Invalid port format"}), 400
    
    # Reset current scan status
    current_scan = {
        "status": "scanning",
        "progress": 0,
        "target": target_ip,
        "ports": ports_to_scan,
        "devices": [],
        "results": []
    }
    
    # Start scanning in a background thread
    scan_thread = threading.Thread(
        target=perform_scan,
        args=(target_ip, ports_to_scan)
    )
    scan_thread.daemon = True
    scan_thread.start()
    
    return jsonify({"message": "Scan started", "scan_id": len(scan_history)})

def perform_scan(target_ip, ports_to_scan):
    global current_scan
    
    try:
        # Update progress - ARP scanning phase
        current_scan["status"] = "discovering"
        current_scan["progress"] = 10
        
        # Perform ARP scan
        devices = scanner.get_arp_scan(target_ip)
        current_scan["devices"] = devices
        current_scan["progress"] = 40
        
        if not devices:
            current_scan["status"] = "completed"
            current_scan["progress"] = 100
            scan_history.append(current_scan.copy())
            return
        
        # Get hostnames
        for device in devices:
            device["hostname"] = scanner.get_hostname(device["ip"])
        
        current_scan["progress"] = 50
        current_scan["status"] = "port_scanning"
        
        # Scan ports for each device
        results = []
        total_devices = len(devices)
        
        for idx, device in enumerate(devices):
            ip, open_ports = scanner.scan_ports(device["ip"], ports_to_scan)
            
            port_details = []
            for port in open_ports:
                try:
                    service = scanner.get_service_name(port)
                except:
                    service = "unknown"
                
                port_details.append({
                    "port": port,
                    "service": service
                })
            
            results.append({
                "ip": ip,
                "open_ports": port_details
            })
            
            # Update progress
            scan_progress = 50 + int((idx + 1) / total_devices * 50)
            current_scan["progress"] = min(99, scan_progress)
        
        current_scan["results"] = results
        current_scan["status"] = "completed"
        current_scan["progress"] = 100
        
        # Add to scan history
        scan_history.append(current_scan.copy())
    
    except Exception as e:
        current_scan["status"] = "error"
        current_scan["error"] = str(e)
        scan_history.append(current_scan.copy())

@app.route('/api/scan/status', methods=['GET'])
def get_scan_status():
    return jsonify(current_scan)

@app.route('/api/scan/history', methods=['GET'])
def get_scan_history():
    return jsonify(scan_history)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)