"use client";
import React, { useEffect, useState } from 'react';
import { AlertCircle, QrCode, LogOut, Calendar } from 'lucide-react';
import { useMember } from '@/lib/context/MemberContext';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:5001';

export default function MemberDashboard() {
  const { member, logout, refreshMember } = useMember();
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();

    const socket = io(API_URL);
    socket.on('eventUpdate', (data: any) => {
      if (data.type === 'added') {
        setEvents(prev => [...prev, data.event].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } else if (data.type === 'deleted') {
        setEvents(prev => prev.filter(e => (e._id || e.id) !== data.id));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/events/all`);
      const data = await res.json();
      setEvents(data);
    } catch (e) {
      console.log('Failed to fetch events', e);
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  const handleRenewUPI = async () => {
    if (confirm('Simulating UPI Payment: Redirecting to UPI App (GPay/PhonePe). Press OK to simulate a successful payment.')) {
      try {
        const res = await fetch(`${API_URL}/api/members/renew/${member?._id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ durationMonths: 1 })
        });
        
        if (res.ok) {
          const data = await res.json();
          if (confirm('Membership renewed for 1 month! Would you like to download your receipt?')) {
            if (data.pdf) {
              window.open(data.pdf, '_blank');
            }
          }
          await refreshMember();
        } else {
          alert('Failed to renew membership on server');
        }
      } catch (e) {
        alert('Network error while renewing');
      }
    }
  };

  if (!member) return null;

  const calculateDaysLeft = () => {
    if (!member?.expiryDate) return 0;
    const expiry = new Date(member.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysLeft = calculateDaysLeft();
  const isExpired = daysLeft <= 0;

  return (
    <div className="max-w-6xl mx-auto min-h-screen pb-24 relative px-6 md:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-12 mt-8">
        <div>
          <p className="text-gray-500 text-sm font-black tracking-widest uppercase">Hello,</p>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
            {member.name?.split(' ')[0] || 'MEMBER'} <span className="text-primary italic">OS</span>
          </h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/member/attendance')} 
            className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl hover:bg-primary/20 hover:border-primary/50 text-white hover:text-primary transition-all group"
            title="Scan Attendance"
          >
            <QrCode size={24} className="group-hover:scale-110 transition-transform" />
          </button>
          <button 
            onClick={handleLogout} 
            className="w-14 h-14 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 text-white transition-all"
            title="Log Out"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Membership Status */}
        <div className="lg:col-span-5">
          <div className="bg-[#0D0D0D] border border-white/5 rounded-[40px] p-8 md:p-10 relative overflow-hidden shadow-2xl h-full flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-10 relative z-10">
                <p className="text-xs text-gray-500 font-black tracking-widest uppercase">Membership Status</p>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${isExpired ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-green-500/10 border-green-500/20 text-green-500'}`}>
                  {isExpired ? 'Expired' : 'Active'}
                </div>
              </div>

              <div className="mb-12 relative z-10">
                <div className="flex items-center gap-4 mb-2">
                  <AlertCircle color={isExpired ? '#ef4444' : '#ffc400'} size={32} />
                  <h3 className="text-white font-black text-3xl tracking-tight">
                    {isExpired ? 'Access Revoked' : 'Elite Member'}
                  </h3>
                </div>
                <p className="text-gray-400 font-medium text-lg ml-12">
                  {isExpired ? 'Your membership has expired.' : <span>Valid for the next <span className="text-primary font-black">{daysLeft} days</span></span>}
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <button 
                onClick={handleRenewUPI} 
                className="w-full h-18 bg-primary text-black font-black uppercase tracking-widest rounded-3xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,196,0,0.2)] flex items-center justify-center gap-3 text-sm py-5"
              >
                Renew via UPI <span className="text-xs opacity-50 font-bold tracking-normal italic">(Simulated)</span>
              </button>
            </div>
            
            <div className={`absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] rounded-full pointer-events-none ${isExpired ? 'bg-red-500/20' : 'bg-primary/20'}`}></div>
          </div>
        </div>

        {/* Right Column: Events */}
        <div className="lg:col-span-7">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
              <Calendar className="text-primary" size={24} />
              Upcoming Events
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.length === 0 ? (
              <div className="col-span-full py-20 bg-[#0D0D0D] border border-white/5 rounded-[40px] flex flex-col items-center justify-center text-center">
                <Calendar className="text-white/10 mb-4" size={64} />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No upcoming events scheduled</p>
              </div>
            ) : (
              events.map((event, index) => {
                const eDate = new Date(event.date);
                return (
                  <div key={event._id || index} className="bg-[#0D0D0D] border border-white/5 rounded-[32px] overflow-hidden hover:border-primary/30 transition-all group">
                    <div className="h-40 bg-[#1a1a1a] flex items-center justify-center relative overflow-hidden">
                      {event.imageUrl ? (
                        <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <Calendar color="rgba(255,255,255,0.1)" size={64} />
                      )}
                      <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                        <p className="text-primary font-black text-[10px] tracking-widest uppercase">{eDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-white font-black text-xl tracking-tight mb-2 group-hover:text-primary transition-colors">{event.name}</h3>
                      <p className="text-gray-500 text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>
                        {eDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
