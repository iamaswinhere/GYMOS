"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  TrendingUp, 
  Zap, 
  Plus, 
  Sparkles,
  Search,
  ChevronRight,
  User as UserIcon,
  Edit2,
  Calendar,
  ArrowUpRight,
  Activity,
  Check
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useDashboard } from '@/lib/context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Helper for relative time
const getRelativeTime = (dateString: string) => {
  if (!dateString) return 'Pending';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return date.toLocaleDateString();
};

const Dashboard = () => {
  const { 
    revenue, 
    activeMembers, 
    newMemberships, 
    gymTraffic, 
    members, 
    addMember,
    highlightedMonth,
    aiReport,
    generateAIReport,
    searchQuery,
    searchResult,
    isLoading,
    payments
  } = useDashboard();

  const router = useRouter();
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberPlan, setNewMemberPlan] = useState('Monthly GYM');
  const [hasPT, setHasPT] = useState(false);
  const [viewType, setViewType] = useState<'weekly' | 'monthly'>('monthly');

  const calculateAmount = (plan: string, pt: boolean) => {
    let base = plan === 'Student' ? 800 : 1000;
    return pt ? base + 2000 : base;
  };

  const calculateExpiry = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().split('T')[0];
  };

  // Draft persistence for Dashboard Quick Signup
  useEffect(() => {
    if (!showAddMember) return;
    const draftName = localStorage.getItem('gymos_quick_draft_name_v2');
    const draftPhone = localStorage.getItem('gymos_quick_draft_phone_v2');
    if (draftName) setNewMemberName(draftName);
    if (draftPhone) setNewMemberPhone(draftPhone);
  }, [showAddMember]);

  useEffect(() => {
    if (showAddMember) {
      localStorage.setItem('gymos_quick_draft_name_v2', newMemberName);
      localStorage.setItem('gymos_quick_draft_phone_v2', newMemberPhone);
    }
  }, [newMemberName, newMemberPhone, showAddMember]);

  // Handle Search-based view toggle
  useEffect(() => {
    if (searchQuery.toLowerCase().includes('weekly')) {
      setViewType('weekly');
    } else if (searchQuery.toLowerCase().includes('monthly')) {
      setViewType('monthly');
    }
  }, [searchQuery]);

  // Calculate Real Data based on View Type
  const chartData = useMemo(() => {
    if (viewType === 'monthly') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const data = months.map(month => ({ name: month, income: 0 }));
      payments.forEach(payment => {
        const date = new Date(payment.date);
        const monthIndex = date.getMonth();
        data[monthIndex].income += payment.amount;
      });
      return data;
    } else {
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        let income = 0;
        payments.forEach(p => {
           const paymentDate = new Date(p.date);
           if (paymentDate.toDateString() === d.toDateString()) {
             income += p.amount;
           }
        });
        data.push({ name: dayName, income });
      }
      return data;
    }
  }, [payments, viewType]);

  const stats = [
    { label: 'Total Revenue', value: `₹${revenue.toLocaleString()}`, icon: TrendingUp, color: 'from-blue-500/20 to-blue-600/5' },
    { label: 'Active Members', value: activeMembers.toLocaleString(), icon: Users, color: 'from-primary/20 to-primary/5' },
    { label: 'New Signups', value: newMemberships.toLocaleString(), icon: TrendingUp, color: 'from-green-500/20 to-green-600/5' },
    { label: 'Gym Traffic', value: `${gymTraffic}%`, icon: Zap, color: 'from-purple-500/20 to-purple-600/5', isTraffic: true },
  ];

  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName) return;
    
    const amount = calculateAmount(newMemberPlan, hasPT);
    const planName = `${newMemberPlan}${hasPT ? ' + PT' : ''}`;
    
    addMember({
      name: newMemberName,
      number: newMemberPhone || "+91 0000000000",
      plan: planName,
      status: 'active',
      expiry: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      amount: amount,
      date: new Date().toISOString().split('T')[0]
    });

    setNewMemberName('');
    setNewMemberPhone('');
    setNewMemberPlan('Monthly GYM');
    setHasPT(false);
    localStorage.removeItem('gymos_quick_draft_name_v2');
    localStorage.removeItem('gymos_quick_draft_phone_v2');
    setShowAddMember(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
         <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
         <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Syncing with Cloud DB...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-black min-h-screen">
      {/* Search Results Overlay */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="dashboard-card border-primary/30 bg-primary/5"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <Search size={16} /> Directory Search for "{searchQuery}"
              </h3>
            </div>
            {searchResult.length === 0 ? (
               <p className="text-gray-500 text-sm italic">No members found in directory.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {searchResult.map(member => (
                  <div key={member.id} className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-start gap-4 group">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                        <UserIcon size={24} />
                    </div>
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-black text-white">{member.name}</h4>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                             member.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                             member.status === 'expired' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                             'bg-red-500/10 text-red-500 border-red-500/20'
                          }`}>{member.status}</span>
                       </div>
                       <div className="grid grid-cols-2 gap-4 text-[11px] font-bold text-gray-500">
                          <div><p className="uppercase tracking-widest text-[8px] mb-1">Mobile</p><p className="text-white">{member.number}</p></div>
                          <div><p className="uppercase tracking-widest text-[8px] mb-1">Plan</p><p className="text-white">{member.plan}</p></div>
                          <div><p className="uppercase tracking-widest text-[8px] mb-1">Expiry</p><p className="text-white">{member.expiry}</p></div>
                          <div><p className="uppercase tracking-widest text-[8px] mb-1">Fee Paid</p><p className="text-primary italic">₹{member.amount.toLocaleString()}</p></div>
                       </div>
                    </div>
                    <button 
                      onClick={() => router.push('/members')}
                      className="p-2 bg-white/5 rounded-xl text-primary hover:bg-primary hover:text-black transition-all"
                      title="Manage in Directory"
                    >
                      <Edit2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase transition-all">GYM <span className="text-primary italic">DASHBOARD</span></h1>
          <p className="text-gray-500 font-medium mt-1 uppercase text-xs tracking-widest">Pricing: Standard ₹1000 | Student ₹800</p>
        </div>
        <button 
          onClick={() => setShowAddMember(true)}
          className="bg-primary text-black px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,196,0,0.3)] group"
        >
          <Plus size={20} strokeWidth={3} className="group-hover:rotate-90 transition-transform" /> QUICK SIGNUP
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`dashboard-card relative overflow-hidden group border-white/5 bg-[#0D0D0D]`}>
             <div className="relative z-10 flex justify-between items-start">
               <div>
                  <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white tracking-tight">{stat.value}</h3>
               </div>
               <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-all ${stat.isTraffic && gymTraffic > 85 ? 'text-red-500 relative' : 'text-primary'}`}>
                  <stat.icon size={22} className={stat.isTraffic && gymTraffic > 85 ? 'animate-pulse' : ''} />
                  {stat.isTraffic && gymTraffic > 85 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                  )}
               </div>
             </div>
             <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.color} blur-3xl opacity-50`}></div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 dashboard-card bg-[#0D0D0D]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-3">
                <Activity size={20} className="text-primary" />
                Revenue Stream Analytics
            </h3>
            <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                <button onClick={() => setViewType('weekly')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewType === 'weekly' ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}>Weekly</button>
                <button onClick={() => setViewType('monthly')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${viewType === 'monthly' ? 'bg-primary text-black' : 'text-gray-500 hover:text-white'}`}>Monthly</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc400" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffc400" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} tick={{ fill: '#666' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#ffc400', fontWeight: 'bold' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Income']}
                />
                <Area type="monotone" dataKey="income" stroke="#ffc400" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {highlightedMonth && viewType === 'monthly' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-primary/10 border border-primary/20 rounded-xl flex items-center gap-3">
               <Sparkles size={20} className="text-primary" />
               <p className="text-xs text-white font-medium">Agent Insight: <span className="text-primary font-black uppercase tracking-tighter">Seasonality Alert!</span> {highlightedMonth} shows lower predicted revenue. AI suggests a summer discount campaign.</p>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <div className="dashboard-card border-primary/20 bg-primary/5 relative overflow-hidden group">
            <div className="relative z-10">
                <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={16} /> AI Performance Reporter
                </h3>
                {aiReport ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <p className="text-[11px] text-gray-300 leading-relaxed font-bold border-l-2 border-primary pl-3 py-1 bg-primary/5">{aiReport.summary}</p>
                    <div className="space-y-2">
                        {aiReport.insights.map((insight, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                                <ArrowUpRight size={14} className="text-primary shrink-0 mt-0.5" />
                                <p className="text-[10px] text-white/70 font-medium">{insight}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-primary/10">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2">Growth Opportunity</p>
                        <p className="text-[10px] text-white italic">"{aiReport.growthOpportunity}"</p>
                    </div>
                    <button onClick={() => generateAIReport()} className="text-[9px] font-black text-primary hover:underline uppercase tracking-widest mt-4">Refresh AI Analysis</button>
                </motion.div>
                ) : (
                <div className="py-8 text-center bg-black/20 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-widest px-4">Analyze signup & revenue trends instantly.</p>
                    <button onClick={() => generateAIReport()} className="bg-primary text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-[0_0_15px_rgba(255,196,0,0.2)]">Generate AI Report</button>
                </div>
                )}
            </div>
          </div>
          <div className="dashboard-card bg-[#0D0D0D]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Activity</h3>
              <button onClick={() => router.push('/members')} className="text-[10px] text-primary font-black uppercase tracking-tighter hover:underline">Directory</button>
            </div>
            <div className="space-y-4">
              {payments.length === 0 ? (
                <div className="py-12 flex flex-col items-center gap-3">
                   <Activity className="text-gray-800" size={32} />
                   <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest text-center">No recent activity found.</p>
                </div>
              ) : (
                payments.slice(0, 4).map((payment) => (
                  <div key={payment.id} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/5 text-gray-400 group-hover:text-primary group-hover:border-primary/50 transition-all font-black text-xs text-center uppercase">{payment.name.charAt(0)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-white group-hover:text-primary transition-colors">{payment.name}</p>
                      <p className="text-[9px] text-gray-600 font-black uppercase tracking-tighter">{payment.plan} • {getRelativeTime(payment.createdAt || payment.date)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-white">₹{payment.amount.toLocaleString()}</p>
                      <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest italic">Success</p>
                    </div>
                  </div>
                ))
              )}
          </div>
        </div>
      </div>
    </div>

      <AnimatePresence>
        {showAddMember && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0D0D0D] border border-white/10 rounded-[40px] p-10 w-full max-w-md shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full"></div>
              <div className="flex justify-between items-center mb-10 relative">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Quick <span className="text-primary italic">SIGNUP</span></h2>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Automatic 1-Month Plan</p>
                  </div>
                  <button onClick={() => setShowAddMember(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><ChevronRight size={24} className="rotate-90" /></button>
              </div>
              <form onSubmit={handleAddMemberSubmit} className="space-y-5 relative">
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-gray-500 uppercase ml-2 tracking-widest">Member Full Name</label>
                   <input type="text" placeholder="e.g. Rahul Sharma" value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-700 font-sans" required />
                </div>
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-gray-500 uppercase ml-2 tracking-widest">Phone Number</label>
                   <input type="text" placeholder="+91 80000 00000" value={newMemberPhone} onChange={(e) => setNewMemberPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-700 font-sans" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-500 uppercase ml-2 tracking-widest">Plan Selection</label>
                        <select value={newMemberPlan} onChange={(e) => setNewMemberPlan(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer">
                            <option value="Monthly GYM">Regular (₹1000)</option>
                            <option value="Student">Student (₹800)</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-500 uppercase ml-2 tracking-widest">PT Option (+₹2k)</label>
                        <button type="button" onClick={() => setHasPT(!hasPT)} className={`w-full border rounded-2xl px-5 py-4 font-black text-[10px] uppercase transition-all flex items-center justify-center gap-2 ${hasPT ? 'bg-primary text-black border-primary' : 'bg-white/5 text-gray-500 border-white/10'}`}>
                            {hasPT ? <Check size={14} strokeWidth={4} /> : null} Personal Trainer
                        </button>
                    </div>
                </div>
                
                <div className="p-5 bg-black rounded-3xl border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">To be Paid</p>
                        <p className="text-2xl font-black text-white italic">₹{calculateAmount(newMemberPlan, hasPT).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">1 MONTH ACCESS</p>
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setShowAddMember(false)} className="flex-1 bg-white/5 text-white/50 font-black py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-xs tracking-widest">CANCEL</button>
                  <button type="submit" className="flex-1 bg-primary text-black font-black py-4 rounded-2xl shadow-[0_10px_30px_rgba(255,196,0,0.3)] hover:scale-[1.02] transition-all text-xs tracking-widest uppercase">Register & Pay</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
