"use client";
import React, { useState, useEffect } from 'react';
import { useDashboard, Member } from '@/lib/context/DashboardContext';
import { Search, CheckSquare, XSquare, RefreshCw, Calendar as CalendarIcon, Check } from 'lucide-react';

interface AttendanceRecord {
  _id: string;
  memberId: Member | string;
  date: string;
  status: string;
}

export default function AttendancePage() {
  const { members, admin, token } = useDashboard();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

  const fetchAttendance = async () => {
    setIsLoading(true);
    try {
      const headers = {
        'Authorization': `Bearer ${token || localStorage.getItem('gymos_admin_token')}`,
        'Content-Type': 'application/json'
      };
      
      const res = await fetch(`${BASE_URL}/attendance?date=${selectedDate}`, { headers });
      if (!res.ok) throw new Error("Failed to fetch attendance");
      
      const data = await res.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token || localStorage.getItem('gymos_admin_token')) {
      fetchAttendance();
    }
  }, [selectedDate, token]);

  const toggleAttendance = async (memberId: string, recordId?: string) => {
    if (processingId) return;
    setProcessingId(memberId);
    
    try {
      const headers = {
        'Authorization': `Bearer ${token || localStorage.getItem('gymos_admin_token')}`,
        'Content-Type': 'application/json'
      };

      if (recordId) {
        // Unmark (Delete)
        const res = await fetch(`${BASE_URL}/attendance/${recordId}`, {
          method: 'DELETE',
          headers
        });
        if (!res.ok) throw new Error("Failed to unmark attendance");
        
        // Optimistic update
        setAttendanceRecords(prev => prev.filter(r => r._id !== recordId));
      } else {
        // Mark (Post)
        const res = await fetch(`${BASE_URL}/attendance/mark`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ memberId, date: selectedDate })
        });
        
        if (!res.ok) {
           const err = await res.json();
           throw new Error(err.message || "Failed to mark attendance");
        }
        
        const data = await res.json();
        // Update state
        setAttendanceRecords(prev => [...prev, data.attendance]);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setProcessingId(null);
    }
  };

  const activeMembers = members.filter(m => m.status === 'active' || m.status === 'pending');
  
  const filteredMembers = activeMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          member.number.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Daily <span className="text-primary italic">Attendance</span></h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Track & Manage Member Check-ins</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-[#121212] border border-white/5 rounded-2xl px-5 py-3 flex items-center gap-4 group">
              <Search size={20} className="text-gray-500 group-focus-within:text-primary transition-colors" />
              <input 
                  type="text" 
                  placeholder="Search members by name or phone..." 
                  className="bg-transparent border-none outline-none w-full text-white font-medium placeholder:text-gray-700"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
          <div className="bg-[#121212] border border-white/5 rounded-2xl px-5 py-3 flex items-center gap-4 w-full md:w-auto focus-within:border-primary/50 transition-colors">
              <CalendarIcon size={20} className="text-gray-500" />
              <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent border-none outline-none text-white font-black uppercase text-xs tracking-widest cursor-pointer [color-scheme:dark]"
              />
          </div>
          <button 
            onClick={fetchAttendance} 
            disabled={isLoading}
            className={`bg-white/5 border border-white/10 text-white font-black p-3 rounded-2xl hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center min-w-[50px] ${isLoading ? 'opacity-50' : ''}`}
            title="Refresh Attendance"
          >
            <RefreshCw size={20} className={isLoading ? "animate-spin" : ""} strokeWidth={2} />
          </button>
      </div>

      <div className="bg-[#0D0D0D] border border-white/5 rounded-[32px] p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                <CheckSquare className="text-primary" size={18} />
                Attendance Roster
            </h2>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                {attendanceRecords.length} Present
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#050505] border-b border-white/5">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Member</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center text-gray-600 italic font-bold uppercase tracking-widest text-xs">No active members found.</td>
                </tr>
              ) : (
                filteredMembers.map((member) => {
                  const record = attendanceRecords.find(r => {
                      if (typeof r.memberId === 'string') return r.memberId === member.id;
                      return (r.memberId as any)?._id === member.id;
                  });
                  const isPresent = !!record;
                  const isProcessing = processingId === member.id;

                  return (
                    <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black uppercase text-xs group-hover:border-primary/50 transition-all">
                               {member.name.charAt(0)}
                          </div>
                          <span className="font-black text-white group-hover:text-primary transition-all tracking-tight">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 font-bold">{member.number}</td>
                      <td className="px-6 py-5">
                        {isPresent ? (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border bg-green-500/10 text-green-500 border-green-500/20 inline-flex items-center gap-1">
                            <Check size={10} /> Present
                          </span>
                        ) : (
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border bg-gray-500/10 text-gray-500 border-gray-500/20 inline-flex items-center gap-1">
                            Absent
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                            onClick={() => toggleAttendance(member.id, record?._id)}
                            disabled={isProcessing}
                            className={`p-2.5 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ml-auto ${
                                isPresent 
                                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20' 
                                : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20'
                            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isProcessing ? (
                                <RefreshCw size={14} className="animate-spin" />
                            ) : isPresent ? (
                                <>
                                    <XSquare size={14} /> Unmark
                                </>
                            ) : (
                                <>
                                    <CheckSquare size={14} /> Mark
                                </>
                            )}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
