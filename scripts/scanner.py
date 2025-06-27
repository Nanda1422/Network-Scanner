#!/usr/bin/env python3
import socket
import subprocess
import platform
import re
import ipaddress
import random
import time
from typing import List, Tuple, Dict, Any

def get_arp_scan(target_ip: str) -> List[Dict[str, str]]:
    """
    Perform an ARP scan to discover devices on the network.
    
    Args:
        target_ip: IP address range in CIDR notation (e.g., "192.168.1.0/24")
                  or a single IP address
    
    Returns:
        List of dictionaries containing IP and MAC addresses of discovered devices
    """
    print(f"Scanning network: {target_ip}")
    
    # For demonstration purposes, we'll simulate finding devices
    # In a real implementation, you would use tools like scapy, nmap, or system commands
    
    devices = []
    
    # Parse the target IP range
    try:
        # Check if it's a CIDR notation
        if "/" in target_ip:
            network = ipaddress.ip_network(target_ip, strict=False)
            ip_list = list(network.hosts())
        # Check if it's a range notation (e.g., 192.168.1.1-10)
        elif "-" in target_ip:
            base, range_end = target_ip.rsplit(".", 1)[0], target_ip.rsplit(".", 1)[1]
            if "-" in range_end:
                start, end = range_end.split("-")
                ip_list = [ipaddress.ip_address(f"{base}.{i}") for i in range(int(start), int(end) + 1)]
            else:
                ip_list = [ipaddress.ip_address(target_ip)]
        # Single IP address
        else:
            ip_list = [ipaddress.ip_address(target_ip)]
    except Exception as e:
        print(f"Error parsing IP range: {e}")
        return devices
    
    # Simulate finding 5-10 devices
    num_devices = random.randint(5, min(10, len(ip_list)))
    selected_ips = random.sample(list(ip_list), num_devices)
    
    for ip in selected_ips:
        # Generate a random MAC address
        mac = ":".join([f"{random.randint(0, 255):02x}" for _ in range(6)])
        devices.append({"ip": str(ip), "mac": mac})
        time.sleep(0.1)  # Simulate scanning delay
    
    print(f"Found {len(devices)} devices")
    return devices

def get_hostname(ip: str) -> str:
    """
    Get the hostname for a given IP address.
    
    Args:
        ip: IP address to lookup
    
    Returns:
        Hostname or empty string if not found
    """
    try:
        hostname = socket.getfqdn(ip)
        if hostname != ip:
            return hostname
        
        # Simulate some common device names
        device_types = ["Router", "Switch", "Printer", "Server", "Desktop", "Laptop", "Phone"]
        vendors = ["Cisco", "HP", "Dell", "Apple", "Samsung", "Netgear", "Linksys"]
        
        # Randomly decide if we return a hostname (70% chance)
        if random.random() < 0.7:
            return f"{random.choice(vendors)}-{random.choice(device_types)}"
        return ""
    except:
        return ""

def scan_ports(ip: str, ports: List[int]) -> Tuple[str, List[int]]:
    """
    Scan for open ports on a given IP address.
    
    Args:
        ip: IP address to scan
        ports: List of port numbers to scan
    
    Returns:
        Tuple of (ip_address, list_of_open_ports)
    """
    print(f"Scanning ports on {ip}: {ports}")
    open_ports = []
    
    # Simulate finding some open ports
    # In a real implementation, you would use socket connections to check ports
    
    # Common ports that are typically open
    common_open = [22, 80, 443, 445]
    
    for port in ports:
        # Simulate a 30% chance of a port being open
        # Higher chance for common ports
        if port in common_open:
            chance = 0.6
        else:
            chance = 0.3
            
        if random.random() < chance:
            open_ports.append(port)
        
        time.sleep(0.05)  # Simulate scanning delay
    
    print(f"Found {len(open_ports)} open ports on {ip}")
    return ip, open_ports

def get_service_name(port: int) -> str:
    """
    Get the service name for a given port number.
    
    Args:
        port: Port number
    
    Returns:
        Service name
    """
    services = {
        21: "FTP",
        22: "SSH",
        23: "Telnet",
        25: "SMTP",
        53: "DNS",
        80: "HTTP",
        110: "POP3",
        143: "IMAP",
        443: "HTTPS",
        445: "SMB",
        3306: "MySQL",
        3389: "RDP",
        5432: "PostgreSQL",
        8080: "HTTP-Proxy"
    }
    
    return services.get(port, "Unknown")

# Test the functions if run directly
if __name__ == "__main__":
    # Test ARP scan
    devices = get_arp_scan("192.168.1.0/24")
    print(f"Devices found: {devices}")
    
    # Test hostname lookup
    for device in devices:
        hostname = get_hostname(device["ip"])
        print(f"Hostname for {device['ip']}: {hostname}")
    
    # Test port scanning
    test_ports = [21, 22, 23, 80, 443, 445, 3389]
    for device in devices[:2]:  # Just test the first two devices
        ip, open_ports = scan_ports(device["ip"], test_ports)
        print(f"Open ports on {ip}: {open_ports}")
        
        # Test service name lookup
        for port in open_ports:
            service = get_service_name(port)
            print(f"Service on port {port}: {service}")
