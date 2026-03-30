import { Platform } from 'react-native';

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 
  (Platform.OS === 'ios' ? 'http://localhost:5001' : 'http://10.0.2.2:5001');
