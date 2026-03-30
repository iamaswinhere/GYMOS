"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export interface MemberInfo {
  _id: string;
  name: string;
  mobileNumber: string;
  membershipStatus: 'active' | 'expired' | 'stopped' | 'pending';
  membershipPlan: { name: string; durationMonths: number; price: number };
  expiryDate: string;
  joiningDate: string;
}

interface MemberContextType {
  member: MemberInfo | null;
  token: string | null;
  isLoading: boolean;
  login: (mobileNumber: string) => Promise<void>;
  logout: () => void;
  refreshMember: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: React.ReactNode }) => {
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedInfo = localStorage.getItem('gymos_member_info');
    const storedToken = localStorage.getItem('gymos_member_token');
    if (storedInfo && storedToken) {
      try { 
        setMember(JSON.parse(storedInfo)); 
        setToken(storedToken);
      } catch {}
    }
    setIsLoading(false);
  }, []);

  const login = async (mobileNumber: string) => {
    const response = await fetch(`${API_URL}/members/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    
    setMember(data.member);
    setToken(data.token);
    localStorage.setItem('gymos_member_info', JSON.stringify(data.member));
    localStorage.setItem('gymos_member_token', data.token);
  };

  const logout = () => {
    setMember(null);
    setToken(null);
    localStorage.removeItem('gymos_member_info');
    localStorage.removeItem('gymos_member_token');
  };

  const refreshMember = async () => {
    if (member?.mobileNumber) await login(member.mobileNumber);
  };

  return (
    <MemberContext.Provider value={{ member, token, isLoading, login, logout, refreshMember }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember must be used within MemberProvider');
  return ctx;
};
