# scanner.py
import scapy.all as scapy
import socket

# Perform ARP scan on local network
def get_arp_scan(ip_range):
    arp_request = scapy.ARP(pdst=ip_range)
    broadcast = scapy.Ether(dst="ff:ff:ff:ff:ff:ff")
    arp_request_broadcast = broadcast / arp_request
    answered_list = scapy.srp(arp_request_broadcast, timeout=2, verbose=False)[0]

    devices = []
    for element in answered_list:
        devices.append({
            "ip": element[1].psrc,
            "mac": element[1].hwsrc
        })
    return devices

# Get hostname by IP
def get_hostname(ip):
    try:
        return socket.gethostbyaddr(ip)[0]
    except socket.herror:
        return "Unknown"

# Scan ports on a host
def scan_ports(ip, ports):
    open_ports = []
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(0.5)
            result = sock.connect_ex((ip, port))
            if result == 0:
                open_ports.append(port)
            sock.close()
        except:
            continue
    return ip, open_ports

# Get common service names from port numbers
def get_service_name(port):
    try:
        return socket.getservbyport(port)
    except:
        return "Unknown"
