// Use your Local IP or localhost based on the environment (iOS simulator can use localhost)
import { Platform } from 'react-native';

export const API_URL = Platform.OS === 'ios' ? 'http://localhost:5001' : 'http://10.0.2.2:5001';
