// Android emulator reaches the host machine at 10.0.2.2; a physical phone needs your computer's LAN IP.
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';
