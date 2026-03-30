"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useRouter, usePathname } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const SOCKET_URL = BASE_URL.replace('/api', '');

// ... (interfaces remain same)
export interface Member {
  id: string;
  name: string;
  number: string;
  plan: string;
  status: 'active' | 'expired' | 'stopped' | 'pending';
  expiry: string;
  amount: number;
  date: string;
  createdAt?: string;
}

export interface GymEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  imageUrl?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface SiteSettings {
  notifications: {
    whatsappSummaries: boolean;
    trafficThresholdAlerts: boolean;
  };
}

interface AIReport {
  summary: string;
  insights: string[];
  growthOpportunity: string;
}

interface DashboardState {
  revenue: number;
  activeMembers: number;
  newMemberships: number;
  gymTraffic: number;
  members: Member[];
  events: GymEvent[];
  notifications: string[];
  weeklySummary: string;
  aiReport: AIReport | null;
  highlightedMonth: string | null;
  searchQuery: string;
  searchResult: Member[];
  isLoading: boolean;
  settings: SiteSettings;
  payments: Member[];
  token: string | null;
  admin: any | null;
}

interface DashboardContextType extends DashboardState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  addMember: (member: Omit<Member, 'id'>) => Promise<void>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  addEvent: (event: Omit<GymEvent, 'id'>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  generateAIReport: () => void;
  clearNotifications: () => void;
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [state, setState] = useState<DashboardState>({
    revenue: 0,
    activeMembers: 0,
    newMemberships: 0,
    gymTraffic: 0,
    members: [],
    events: [],
    notifications: [],
    weeklySummary: "",
    aiReport: null,
    highlightedMonth: null,
    searchQuery: "",
    searchResult: [],
    isLoading: true,
    settings: {
      notifications: {
        whatsappSummaries: true,
        trafficThresholdAlerts: false
      }
    },
    payments: [],
    token: null,
    admin: null
  });

  const logout = useCallback(() => {
    localStorage.removeItem('gymos_admin_token');
    localStorage.removeItem('gymos_admin_data');
    setState(prev => ({ ...prev, token: null, admin: null }));
    router.push('/admin/login');
  }, [router]);

  const authenticatedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = state.token || localStorage.getItem('gymos_admin_token');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401 || response.status === 403) {
      logout();
      throw new Error("Unauthorized");
    }
    
    return response;
  }, [state.token, logout]);

  const fetchAllData = useCallback(async () => {
    if (!state.token && !localStorage.getItem('gymos_admin_token')) return;

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const [membersRes, eventsRes, paymentsRes, settingsRes] = await Promise.all([
        authenticatedFetch(`${BASE_URL}/members/all`),
        authenticatedFetch(`${BASE_URL}/events/all`),
        authenticatedFetch(`${BASE_URL}/payments/all`),
        authenticatedFetch(`${BASE_URL}/admin/settings`)
      ]);

      const [membersData, eventsData, paymentsData, settingsData] = await Promise.all([
        membersRes.json(),
        eventsRes.json(),
        paymentsRes.json(),
        settingsRes.json()
      ]);

      const members = (membersData || []).map((m: any) => ({
        id: m._id,
        name: m.name,
        number: m.mobileNumber,
        plan: m.membershipPlan?.name || 'Standard',
        status: m.membershipStatus || 'active',
        expiry: m.expiryDate ? new Date(m.expiryDate).toISOString().split('T')[0] : '',
        amount: m.membershipPlan?.price || 0,
        date: m.joiningDate ? new Date(m.joiningDate).toISOString().split('T')[0] : '',
        createdAt: m.createdAt
      }));

      const totalRevenue = (paymentsData || []).reduce((sum: number, p: any) => sum + p.amount, 0);
      
      const activityFromPayments = (paymentsData || []).map((p: any) => ({
        id: p._id,
        name: p.memberId?.name || 'Member',
        number: '',
        plan: p.planName,
        status: 'active' as const,
        expiry: '',
        amount: p.amount,
        date: p.paymentDate,
        createdAt: p.paymentDate
      }));

      const events = (eventsData || []).map((e: any) => ({
        id: e._id,
        name: e.name,
        date: e.date,
        location: e.location,
        imageUrl: e.imageUrl,
        status: e.status,
      }));

      const activeCount = members.filter((m: Member) => m.status === 'active').length;

      setState(prev => ({
        ...prev,
        members,
        payments: activityFromPayments,
        events,
        revenue: totalRevenue,
        activeMembers: activeCount,
        newMemberships: members.filter((m: any) => {
           const d = new Date(m.createdAt || m.date);
           const now = new Date();
           return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length,
        settings: settingsData || prev.settings,
        isLoading: false
      }));
    } catch (error) {
      console.error("Failed to fetch data", error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.token, authenticatedFetch]);

  useEffect(() => {
    const token = localStorage.getItem('gymos_admin_token');
    const adminData = localStorage.getItem('gymos_admin_data');
    
    if (token && adminData) {
      setState(prev => ({ 
        ...prev, 
        token, 
        admin: JSON.parse(adminData) 
      }));
    } else if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  useEffect(() => {
    if (!state.token) return;

    fetchAllData();

    const socket = io(SOCKET_URL);

    socket.on('attendanceUpdate', (data: { memberName: string, checkInTime: string }) => {
      setState(prev => ({
        ...prev,
        notifications: [
          `⚡ ${data.memberName} checked in at ${new Date(data.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          ...prev.notifications
        ].slice(0, 5),
        gymTraffic: Math.min(100, prev.gymTraffic + 1)
      }));
    });

    socket.on('eventUpdate', (data: { type: 'added' | 'deleted', event?: any, id?: string }) => {
      if (data.type === 'added' && data.event) {
        const newEvent = {
          id: data.event._id,
          name: data.event.name,
          date: data.event.date,
          location: data.event.location,
          imageUrl: data.event.imageUrl,
          status: data.event.status,
        };
        setState(prev => ({ ...prev, events: [...prev.events, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) }));
      } else if (data.type === 'deleted' && data.id) {
        setState(prev => ({ ...prev, events: prev.events.filter(e => e.id !== data.id) }));
      }
    });

    socket.on('leadUpdate', (data: { type: string, lead: any }) => {
      setState(prev => ({
        ...prev,
        notifications: [
          `🔥 New Lead: ${data.lead.name} interested in ${data.lead.plan}${data.lead.hasPT ? ' + PT' : ''}`,
          ...prev.notifications
        ].slice(0, 5)
      }));
    });

    socket.on('paymentUpdate', (data: { memberName: string, amount: number, plan: string, memberId: string, date: string }) => {
      setState(prev => {
        const paymentRecord = {
          id: `payment_${Date.now()}_${data.memberId}`,
          name: data.memberName,
          number: '',
          plan: data.plan,
          status: 'active' as const,
          expiry: '',
          amount: data.amount,
          date: data.date,
          createdAt: data.date
        };

        const updatedMembers = prev.members.map(m => 
          m.id === data.memberId ? { ...m, status: 'active' as const } : m
        );

        return {
          ...prev,
          notifications: [
            `💰 New Payment: ₹${data.amount} from ${data.memberName} (${data.plan})`,
            ...prev.notifications
          ].slice(0, 5),
          revenue: prev.revenue + data.amount,
          payments: [paymentRecord, ...prev.payments],
          members: updatedMembers
        };
      });
    });

    const interval = setInterval(() => {
        setState(prev => ({ 
            ...prev, 
            gymTraffic: Math.min(100, Math.max(0, prev.gymTraffic + (Math.random() > 0.5 ? 2 : -2)))
        }));
    }, 10000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [state.token, fetchAllData]);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Login failed');
      }

      const data = await res.json();
      localStorage.setItem('gymos_admin_token', data.token);
      localStorage.setItem('gymos_admin_data', JSON.stringify(data.admin));
      
      setState(prev => ({ 
        ...prev, 
        token: data.token, 
        admin: data.admin 
      }));
      
      router.push('/admin');
    } catch (error: any) {
      throw error;
    }
  };

  const addMember = async (memberData: Omit<Member, 'id'>) => {
    try {
      const payload = {
        name: memberData.name,
        mobileNumber: memberData.number,
        membershipStatus: memberData.status,
        membershipPlan: {
          name: memberData.plan,
          durationMonths: 1,
          price: memberData.amount
        },
        expiryDate: new Date(memberData.expiry)
      };

      const res = await authenticatedFetch(`${BASE_URL}/members/add`, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const savedMember = await res.json();
        const ownerNumber = '919567950284';
        const waMessage = encodeURIComponent(
          `🏋️ *GYMOS New Signup Alert!*\n\n` +
          `👤 *Name:* ${savedMember.name}\n` +
          `📱 *Phone:* ${savedMember.mobileNumber}\n` +
          `💳 *Plan:* ${savedMember.membershipPlan.name}\n` +
          `💰 *Amount Paid:* ₹${savedMember.membershipPlan.price}\n` +
          `📅 *Expiry:* ${new Date(savedMember.expiryDate).toLocaleDateString()}\n\n` +
          `_Real-time update from GYMOS Admin Portal._`
        );
        window.open(`https://wa.me/${ownerNumber}?text=${waMessage}`, '_blank');
        await fetchAllData();
      }
    } catch (error) {
       console.error("Add member failed", error);
    }
  };

  const updateMember = async (id: string, memberData: Partial<Member>) => {
    try {
      const payload: any = { ...memberData };
      if (memberData.number) payload.mobileNumber = memberData.number;
      if (memberData.status) payload.membershipStatus = memberData.status;
      if (memberData.expiry) payload.expiryDate = new Date(memberData.expiry);
      if (memberData.plan || memberData.amount) {
        payload.membershipPlan = {
           name: memberData.plan || 'Standard',
           durationMonths: 1,
           price: memberData.amount || 0
        };
      }

      await authenticatedFetch(`${BASE_URL}/members/update/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      await fetchAllData();
    } catch (error) {
       console.error("Update member failed", error);
    }
  };

  const deleteMember = async (id: string) => {
    try {
      await authenticatedFetch(`${BASE_URL}/members/delete/${id}`, {
        method: 'DELETE'
      });
      await fetchAllData();
    } catch (error) {
       console.error("Delete failed", error);
    }
  };

  const addEvent = async (eventData: Omit<GymEvent, 'id'>) => {
    try {
      await authenticatedFetch(`${BASE_URL}/events/add`, {
        method: 'POST',
        body: JSON.stringify(eventData)
      });
      await fetchAllData();
    } catch (error) {
       console.error("Event add failed", error);
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await authenticatedFetch(`${BASE_URL}/events/delete/${id}`, {
        method: 'DELETE'
      });
      await fetchAllData();
    } catch (error) {
       console.error("Event delete failed", error);
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    try {
      const res = await authenticatedFetch(`${BASE_URL}/admin/settings`, {
        method: 'PUT',
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        const updated = await res.json();
        setState(prev => ({ ...prev, settings: updated }));
      }
    } catch (error) {
      console.error("Update settings failed", error);
    }
  };

  const setSearchQuery = (query: string) => {
    const lowerQuery = query.toLowerCase();
    let highlightedMonth = null;
    if (lowerQuery.includes("low performing") || lowerQuery.includes("dip") || lowerQuery.includes("june")) {
      highlightedMonth = 'Jun';
    }

    let searchResult: Member[] = [];
    if (query.trim() !== "") {
      searchResult = state.members.filter(m => 
        m.name.toLowerCase().includes(lowerQuery) || 
        (m.number && m.number.includes(query))
      );
    }

    setState(prev => ({ 
      ...prev, 
      searchQuery: query,
      searchResult,
      highlightedMonth 
    }));
  };

  const generateAIReport = () => {
    if (state.members.length === 0) {
      setState(prev => ({ ...prev, aiReport: { 
        summary: "Insufficient data for a deep report.",
        insights: ["Add more members to unlock trend analysis."],
        growthOpportunity: "Focus on first-member acquisition."
      }}));
      return;
    }

    const avgRevenue = state.revenue / state.members.length;
    const growthRate = state.newMemberships > 0 ? "15%" : "0%";

    setState(prev => ({ 
        ...prev, 
        aiReport: {
            summary: `Month-over-month growth is estimated at ${growthRate}. Revenue per member is averaging ₹${avgRevenue.toFixed(0)}.`,
            insights: [
                "Signups are up 10%, but revenue per member has dipped due to seasonal discounts.",
                "Peak traffic is shifting towards 6 PM - 8 PM.",
                `${state.activeMembers} active members indicate a 90% retention rate.`
            ],
            growthOpportunity: "Consider launching a 'refer-a-friend' program to boost the upcoming 'Elite' plan adoption."
        }
    }));
  };

  const clearNotifications = () => {
    setState(prev => ({ ...prev, notifications: [] }));
  };

  return (
    <DashboardContext.Provider value={{ 
      ...state, 
      login,
      logout,
      addMember, 
      updateMember,
      deleteMember,
      addEvent,
      deleteEvent,
      setSearchQuery, 
      generateAIReport,
      clearNotifications,
      updateSettings
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};
