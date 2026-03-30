import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../constants/config';

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [member, setMember] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuthData = async () => {
    try {
      const storedMember = await AsyncStorage.getItem('memberInfo');
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedMember && storedToken) {
        setMember(JSON.parse(storedMember));
        setToken(storedToken);
      }
    } catch (e) {
      console.log('Failed to load auth data', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuthData();
  }, []);

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

      setMember(data.member);
      setToken(data.token);
      await AsyncStorage.setItem('memberInfo', JSON.stringify(data.member));
      await AsyncStorage.setItem('userToken', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setMember(null);
    setToken(null);
    await AsyncStorage.removeItem('memberInfo');
    await AsyncStorage.removeItem('userToken');
  };

  const refreshMember = useCallback(async () => {
    if (member?.mobileNumber) {
      await login(member.mobileNumber);
    }
  }, [member?.mobileNumber]);

  useEffect(() => {
    let interval: any;
    if (token) {
      interval = setInterval(() => {
        refreshMember();
      }, 300000); // Check every 5 minutes instead of 1 minute to reduce overhead
    }
    return () => clearInterval(interval);
  }, [token, refreshMember]);

  return (
    <AuthContext.Provider value={{ member, token, isLoading, login, logout, refreshMember }}>
      {children}
    </AuthContext.Provider>
  );
};
