// Auto-detect development server IP address
export function getDevServerIP(): string {
  // Try to get IP from Expo's environment variable
  const expoIP = process.env.EXPO_DEVTOOLS_LISTEN_ADDRESS;
  if (expoIP && expoIP !== '0.0.0.0') {
    return expoIP;
  }

  // Try to get IP from Metro bundler (web platform)
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return hostname;
    }
  }

  // Fallback to current known IP (will be auto-updated by script)
  // AUTO_IP_MARKER: This line is automatically updated by update-ip.sh
  return '192.168.68.113';
}

const baseURL = `http://${getDevServerIP()}:3000`;

console.log(`🌐 API Base URL: ${baseURL}`);

export { baseURL };
