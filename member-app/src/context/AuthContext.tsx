import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config'; // I should create this config file

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [member, setMember] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMember();
  }, []);

  const loadMember = async () => {
    try {
      const storedMember = await AsyncStorage.getItem('memberInfo');
      if (storedMember) {
        setMember(JSON.parse(storedMember));
      }
    } catch (e) {
      console.log('Failed to load member info', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (mobileNumber: string) => {
    try {
      const response = await fetch(`${API_URL}/api/members/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setMember(data);
      await AsyncStorage.setItem('memberInfo', JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setMember(null);
    await AsyncStorage.removeItem('memberInfo');
  };

  const refreshMember = async () => {
    if (member?.mobileNumber) {
      await login(member.mobileNumber);
    }
  };

  return (
    <AuthContext.Provider value={{ member, isLoading, login, logout, refreshMember }}>
      {children}
    </AuthContext.Provider>
  );
};
