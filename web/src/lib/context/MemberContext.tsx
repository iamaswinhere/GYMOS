"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_URL = 'http://localhost:5001/api';

export interface MemberInfo {
  _id: string;
  name: string;
  mobileNumber: string;
  membershipStatus: 'active' | 'expired' | 'stopped';
  membershipPlan: { name: string; durationMonths: number; price: number };
  expiryDate: string;
  joiningDate: string;
}

interface MemberContextType {
  member: MemberInfo | null;
  isLoading: boolean;
  login: (mobileNumber: string) => Promise<void>;
  logout: () => void;
  refreshMember: () => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: React.ReactNode }) => {
  const [member, setMember] = useState<MemberInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('gymos_member_info');
    if (stored) {
      try { setMember(JSON.parse(stored)); } catch {}
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
    setMember(data);
    localStorage.setItem('gymos_member_info', JSON.stringify(data));
  };

  const logout = () => {
    setMember(null);
    localStorage.removeItem('gymos_member_info');
  };

  const refreshMember = async () => {
    if (member?.mobileNumber) await login(member.mobileNumber);
  };

  return (
    <MemberContext.Provider value={{ member, isLoading, login, logout, refreshMember }}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMember = () => {
  const ctx = useContext(MemberContext);
  if (!ctx) throw new Error('useMember must be used within MemberProvider');
  return ctx;
};
