import { Platform } from 'react-native';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://gymos-backend-8s52.onrender.com';

// Normalize the API URL: remove trailing slashes and any trailing '/api'
// This ensures that sockets connect to the base domain and fetches correctly append '/api'
export const API_URL = rawBaseUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
