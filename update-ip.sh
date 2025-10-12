#!/bin/bash

# Auto-update IP address in mobile app API configuration
# Run this script when your IP changes

# Get current IP address
CURRENT_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

if [ -z "$CURRENT_IP" ]; then
    echo "❌ Could not detect IP address"
    exit 1
fi

echo "🔍 Current IP address: $CURRENT_IP"

# Update the IP configuration file
IP_CONFIG_FILE="services/ip-config.ts"

if [ ! -f "$IP_CONFIG_FILE" ]; then
    echo "❌ IP config file not found: $IP_CONFIG_FILE"
    exit 1
fi

# Backup the original file
# cp "$IP_CONFIG_FILE" "$IP_CONFIG_FILE.backup"

# Update IP in the file using sed
# This pattern matches the specific line with the AUTO_IP_MARKER comment
sed -i '' "s/return '[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*\.[0-9][0-9]*';/return '${CURRENT_IP}';/" "$IP_CONFIG_FILE"

echo "✅ Updated IP configuration with IP: $CURRENT_IP"
# echo "💾 Backup saved as: $IP_CONFIG_FILE.backup"

# Test the connection
echo "🧪 Testing connection..."
if curl -s "http://$CURRENT_IP:3000/health" > /dev/null; then
    echo "✅ Backend server is reachable!"
else
    echo "❌ Cannot reach backend server. Make sure Rails is running."
fi