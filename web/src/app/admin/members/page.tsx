"use client";
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  RefreshCw,
  Filter,
  X,
  UserCheck,
  Zap,
  AlertTriangle,
  Download,
  Upload
} from "lucide-react";
import { useDashboard, Member } from '@/lib/context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function MembersPage() {
  const { members, addMember, bulkImportMembers, updateMember, renewMember, deleteMember, isLoading, refreshData, getMemberPayments } = useDashboard();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [processingRenew, setProcessingRenew] = useState<string | null>(null);
  
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [viewingPayments, setViewingPayments] = useState<any[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // CSV Export
  const handleExport = () => {
    const header = ['Name', 'Phone', 'Plan', 'Status', 'Amount', 'Expiry'];
    const rows = members.map(m => [
        `"${m.name.replace(/"/g, '""')}"`, 
        `"${m.number}"`, 
        `"${m.plan}"`, 
        `"${m.status}"`, 
        m.amount, 
        `"${m.expiry}"`
    ]);
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `gymos_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        const text = event.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length <= 1) return alert('File is empty or invalid.');

        // Parse all rows into an array — no API calls inside the loop
        const batch: Omit<Member, 'id'>[] = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '')) || [];
            if (values.length >= 2) {
                batch.push({
                    name: values[0] || 'Unknown',
                    number: values[1] || '00000000',
                    plan: values[2] || 'Monthly GYM',
                    status: (values[3]?.toLowerCase() as any) || 'active',
                    amount: parseInt(values[4]) || 1,
                    expiry: values[5] ? new Date(values[5]).toISOString().split('T')[0] : calculateExpiry(),
                    date: new Date().toISOString().split('T')[0]
                });
            }
        }

        if (batch.length === 0) return alert('No valid rows found in CSV.');

        try {
            // Single HTTP request for the entire batch
            const result = await bulkImportMembers(batch);
            alert(`Import complete! ${result.inserted} members added successfully.`);
        } catch (err: any) {
            alert(`Import failed: ${err.message}`);
        }

        if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const [formData, setFormData] = useState({
    name: '',
    number: '',
    plan: 'Monthly GYM', // "Monthly GYM" or "Student"
    status: 'active' as Member['status'],
    hasPT: false,
    gender: 'male',
    dateOfBirth: '',
    address: '',
    emergencyContact: '',
    height: '',
    weight: '',
    bloodGroup: '',
    medicalConditions: ''
  });

  const calculateAmount = (plan: string, hasPT: boolean) => {
    let base = 0;
    if (plan === 'Student') base = 799;
    else if (plan === 'Monthly GYM') base = 999;
    else if (plan === 'Quarterly') base = 2500;
    else if (plan === 'Half-Yearly') base = 5000;
    else if (plan === 'Yearly') base = 10000;
    else base = 999;
    
    return base + (hasPT ? 4000 : 0);
  };

  // Auto-calculate expiry based on plan duration
  const calculateExpiry = (plan: string) => {
    let months = 1;
    if (plan === 'Quarterly') months = 3;
    else if (plan === 'Half-Yearly') months = 6;
    else if (plan === 'Yearly') months = 12;

    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  };

  // Draft Persistence
  useEffect(() => {
    if (!isModalOpen) return;
    const savedDraft = localStorage.getItem('gymos_form_draft_v2');
    if (savedDraft && !editingMember) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (e) {}
    }
  }, [isModalOpen, editingMember]);

  useEffect(() => {
    if (isModalOpen && !editingMember) {
      localStorage.setItem('gymos_form_draft_v2', JSON.stringify(formData));
    }
  }, [formData, isModalOpen, editingMember]);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.number.includes(searchTerm)
  );

  const handleOpenModal = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      const isPT = member.plan.includes('+ PT');
      const basePlan = member.plan.replace(' + PT', '');
      
      setFormData({
        name: member.name,
        number: member.number,
        plan: basePlan,
        status: member.status,
        hasPT: isPT,
        gender: member.gender || 'male',
        dateOfBirth: member.dateOfBirth || '',
        address: member.address || '',
        emergencyContact: member.emergencyContact || '',
        height: member.height ? String(member.height) : '',
        weight: member.weight ? String(member.weight) : '',
        bloodGroup: member.bloodGroup || '',
        medicalConditions: member.medicalConditions || ''
      });
    } else {
      setEditingMember(null);
      setFormData({
        name: '',
        number: '',
        plan: 'Monthly GYM',
        status: 'active',
        hasPT: false,
        gender: 'male',
        dateOfBirth: '',
        address: '',
        emergencyContact: '',
        height: '',
        weight: '',
        bloodGroup: '',
        medicalConditions: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleViewMember = async (member: Member) => {
    setViewingMember(member);
    setIsLoadingPayments(true);
    try {
      const payments = await getMemberPayments(member.id);
      setViewingPayments(payments);
    } catch (e) {
      console.error(e);
      setViewingPayments([]);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const handleRenew = async (member: Member) => {
    try {
      setProcessingRenew(member.id);
      await renewMember(member.id, 1);
      alert(`${member.name}'s membership extended and receipt generated!`);
    } catch (err: any) {
      alert(err.message || "Failed to renew member");
    } finally {
      setProcessingRenew(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = calculateAmount(formData.plan, formData.hasPT);
    const finalPlanName = `${formData.plan}${formData.hasPT ? ' + PT' : ''}`;
    const finalExpiry = calculateExpiry(formData.plan);

    if (editingMember) {
      updateMember(editingMember.id, {
        name: formData.name,
        number: formData.number,
        plan: finalPlanName,
        status: formData.status,
        amount: finalAmount,
        expiry: finalExpiry,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        bloodGroup: formData.bloodGroup,
        medicalConditions: formData.medicalConditions,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined
      });
    } else {
      addMember({
        name: formData.name,
        number: formData.number,
        plan: finalPlanName,
        status: formData.status,
        amount: finalAmount,
        expiry: finalExpiry,
        date: new Date().toISOString().split('T')[0],
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        bloodGroup: formData.bloodGroup,
        medicalConditions: formData.medicalConditions,
        height: formData.height ? parseFloat(formData.height) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined
      });
      localStorage.removeItem('gymos_form_draft_v2');
    }
    setIsModalOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (memberToDelete) {
      await deleteMember(memberToDelete.id);
      setMemberToDelete(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'expired': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'stopped': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'pending': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
         <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
         <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Syncing Directory...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Member <span className="text-primary italic">Directory</span></h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Standard Price: ₹999</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="file" 
            accept=".csv" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImport} 
          />
          <button onClick={() => fileInputRef.current?.click()} className="bg-white/5 border border-white/10 text-white font-black p-3 rounded-2xl hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]" title="Import CSV">
            <Upload size={20} strokeWidth={2} />
          </button>
          <button onClick={handleExport} className="bg-white/5 border border-white/10 text-white font-black p-3 rounded-2xl hover:bg-white/10 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]" title="Export CSV">
            <Download size={20} strokeWidth={2} />
          </button>
          <button onClick={() => handleOpenModal()} className="bg-primary text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,196,0,0.2)] ml-2">
            <Plus size={20} strokeWidth={3} /> <span className="hidden sm:inline">ADD MEMBER</span>
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-2xl p-6 flex flex-wrap gap-6 items-center">
         <div className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest italic border-r border-white/10 pr-6"><Zap size={14} /> All-Inclusive Access</div>
         <div className="flex items-center gap-2 text-gray-400 font-bold text-xs"><UserCheck size={14} className="text-primary" /> Cardio</div>
         <div className="flex items-center gap-2 text-gray-400 font-bold text-xs"><UserCheck size={14} className="text-primary" /> Weight Management</div>
         <div className="flex items-center gap-2 text-gray-400 font-bold text-xs"><UserCheck size={14} className="text-primary" /> Strength Training</div>
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
      </div>

      {/* Desktop Members Table */}
      <div className="hidden lg:block dashboard-card overflow-hidden !p-0 bg-[#0D0D0D]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#050505] border-b border-white/5">
              <tr>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Full Name</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Plan Details</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest">Auto Expiry</th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-gray-600 italic font-bold uppercase tracking-widest text-xs">No records found.</td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => handleViewMember(member)}>
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
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-white uppercase tracking-tighter">{member.plan}</span>
                            <span className="text-[10px] text-primary font-black italic">₹{member.amount.toLocaleString()}</span>
                          </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${getStatusColor(member.status)}`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-gray-500 font-bold uppercase">{new Date(member.expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRenew(member); }} 
                            disabled={!!processingRenew}
                            className={`p-2.5 bg-white/5 rounded-xl text-gray-500 transition-all ${processingRenew === member.id ? 'opacity-50' : 'hover:text-green-500 hover:bg-green-500/10'}`} 
                            title="Extend 1 Month"
                          >
                            {processingRenew === member.id ? (
                                <RefreshCw size={18} className="animate-spin text-green-500" />
                            ) : (
                                <RefreshCw size={18} />
                            )}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleOpenModal(member); }} className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-primary hover:bg-primary/10 transition-all" title="Edit Profile">
                            <Edit2 size={18} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); setMemberToDelete(member); }} className="p-2.5 bg-white/5 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all" title="Delete record">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile members list */}
      <div className="lg:hidden flex flex-col gap-4">
        {filteredMembers.length === 0 ? (
          <div className="py-20 bg-[#0D0D0D] border border-white/5 rounded-[32px] flex flex-col items-center justify-center text-center px-6">
            <Search className="text-white/10 mb-4" size={48} />
            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">No matching records found.</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div key={member.id} className="bg-[#0D0D0D] border border-white/5 rounded-[32px] p-6 flex flex-col gap-6 relative overflow-hidden group cursor-pointer" onClick={() => handleViewMember(member)}>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary font-black uppercase text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-white group-hover:text-primary transition-colors tracking-tighter uppercase">{member.name}</h3>
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mt-0.5">{member.number}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border shadow-lg ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>

              <div className="bg-white/[0.02] rounded-2xl p-4 border border-white/5 grid grid-cols-2 gap-4 relative z-10">
                <div>
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Plan</p>
                  <p className="text-xs font-black text-white italic">{member.plan}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Fee</p>
                  <p className="text-xs font-black text-primary italic">₹{member.amount.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between relative z-10 border-t border-white/5 pt-4">
                <div>
                  <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-0.5">Expires On</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase">{new Date(member.expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRenew(member); }} 
                    disabled={!!processingRenew}
                    className={`p-3 bg-white/5 rounded-xl text-gray-400 transition-all border border-white/5 ${processingRenew === member.id ? 'opacity-50' : 'hover:text-green-500 hover:bg-green-500/10'}`} 
                    title="Renew"
                  >
                    {processingRenew === member.id ? (
                         <RefreshCw size={18} className="animate-spin text-green-500" />
                    ) : (
                        <RefreshCw size={18} />
                    )}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleOpenModal(member); }} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-primary hover:bg-primary/10 transition-all border border-white/5" title="Edit">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setMemberToDelete(member); }} className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent blur-3xl opacity-30 rounded-full group-hover:opacity-60 transition-all`}></div>
            </div>
          ))
        )}
      </div>


      <AnimatePresence>
        {/* Registration/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0D0D0D] border border-white/10 rounded-[40px] p-10 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh] relative">
              <div className="absolute top-0 right-0 p-8">
                  <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><X size={24}/></button>
              </div>

              <div className="mb-10">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{editingMember ? 'Update' : 'Register'} <span className="text-primary italic">Member</span></h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Expiry Date will be set automatically to 1 Month from today.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Full Name</label>
                       <input type="text" placeholder="Member Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-800" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Phone Number</label>
                       <input type="text" placeholder="+91 XXXX XXXX" value={formData.number} onChange={(e) => setFormData({...formData, number: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-800" required />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Membership Plan</label>
                       <select value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer">
                          <option value="Student">Student (₹799)</option>
                          <option value="Monthly GYM">Regular GYM (₹999)</option>
                          <option value="Quarterly">Quarterly (₹2,500)</option>
                          <option value="Half-Yearly">Half-Yearly (₹5,000)</option>
                          <option value="Yearly">Yearly (₹10,000)</option>
                       </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Current Status</label>
                        <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer">
                           <option value="active">Active</option>
                           <option value="stopped">Stopped / Hold</option>
                           <option value="expired">Mark as Expired</option>
                        </select>
                     </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="text-white font-black uppercase text-sm italic">Personal Training (PT)</h4>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Additional expert guidance for ₹4000 extras</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={formData.hasPT} onChange={(e) => setFormData({...formData, hasPT: e.target.checked})} className="sr-only peer" />
                            <div className="w-14 h-8 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-gray-500 peer-checked:after:bg-black after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary border border-white/10"></div>
                        </label>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-white/10 pt-8 mt-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Gender</label>
                       <select value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all appearance-none cursor-pointer">
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Emergency Contact</label>
                       <input type="text" placeholder="+91 XXXX XXXX" value={formData.emergencyContact} onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-800" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Residential Address</label>
                       <textarea placeholder="Enter full address..." value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-800 min-h-[100px]"></textarea>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 border-t border-white/10 pt-8 mt-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Height (cm)</label>
                       <input type="number" placeholder="175" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-800" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Weight (kg)</label>
                       <input type="number" placeholder="70" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-800" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Blood Group</label>
                       <input type="text" placeholder="O+" value={formData.bloodGroup} onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-800" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Medical Conditions</label>
                       <input type="text" placeholder="Asthma, Diabetes, None..." value={formData.medicalConditions} onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all placeholder:text-gray-800" />
                    </div>
                </div>

                <div className="p-6 bg-[#050505] rounded-3xl border border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Fee Amount</p>
                        <p className="text-3xl font-black text-white italic">₹{calculateAmount(formData.plan, formData.hasPT).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Billing Period</p>
                        <p className="text-sm font-black text-primary">{formData.plan === 'Yearly' ? '12 MONTHS' : formData.plan === 'Half-Yearly' ? '6 MONTHS' : formData.plan === 'Quarterly' ? '3 MONTHS' : '1 MONTH'}</p>
                    </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-white/5 text-white/50 font-black py-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-sm tracking-widest">CANCEL</button>
                  <button type="submit" className="flex-1 bg-primary text-black font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(255,196,0,0.3)] hover:scale-[1.02] transition-all text-sm tracking-widest">
                    {editingMember ? 'SAVE CHANGES' : 'COMPLETE REGISTRATION'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {memberToDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-[#0D0D0D] border border-red-500/20 rounded-[40px] p-10 w-full max-w-sm shadow-2xl relative text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                  <AlertTriangle size={32} />
              </div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Delete <span className="text-red-500 underline underline-offset-4 decoration-2">Member?</span></h2>
              <p className="text-gray-500 text-sm font-medium mb-8">Are you sure you want to delete <span className="text-white font-bold">{memberToDelete.name}</span>? This action cannot be undone.</p>
              
              <div className="flex flex-col gap-3">
                  <button onClick={handleDeleteConfirm} className="w-full bg-red-500 text-white font-black py-4 rounded-2xl hover:bg-red-600 transition-all text-sm tracking-widest uppercase shadow-[0_10px_30px_rgba(239,68,68,0.2)]">
                    Yes, Delete Member
                  </button>
                  <button onClick={() => setMemberToDelete(null)} className="w-full bg-white/5 text-gray-500 font-black py-4 rounded-2xl hover:bg-white/10 transition-all text-sm tracking-widest uppercase">
                    Cancel
                  </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {/* View Member Profile & Payments Modal */}
        {viewingMember && (
          <div className="fixed inset-0 z-[100] flex justify-end p-0 md:p-6 bg-black/80 backdrop-blur-sm sm:items-start" onClick={() => setViewingMember(null)}>
            <motion.div 
              initial={{ x: '100%', opacity: 0 }} 
              animate={{ x: 0, opacity: 1 }} 
              exit={{ x: '100%', opacity: 0 }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0A0A0A] border-l border-white/10 md:rounded-3xl w-full max-w-2xl h-full md:h-auto md:max-h-[90vh] shadow-2xl flex flex-col relative"
            >
              <div className="absolute top-0 right-0 p-6 z-10">
                  <button onClick={() => setViewingMember(null)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"><X size={24}/></button>
              </div>

              {/* Header */}
              <div className="p-8 border-b border-white/5">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/30 flex items-center justify-center text-primary font-black uppercase text-3xl shadow-[0_0_30px_rgba(255,196,0,0.15)]">
                    {viewingMember.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{viewingMember.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                       <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${getStatusColor(viewingMember.status)}`}>
                         {viewingMember.status}
                       </span>
                       <span className="text-sm font-bold text-gray-500">{viewingMember.number}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
                
                {/* Profile Data */}
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><UserCheck size={16} className="text-primary"/> Profile Details</h3>
                  <div className="grid grid-cols-2 map-gap-4 gap-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                     <div>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Gender</p>
                       <p className="text-sm font-black text-gray-300 capitalize">{viewingMember.gender || '-'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Date of Birth</p>
                       <p className="text-sm font-black text-gray-300">{viewingMember.dateOfBirth || '-'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Emergency Contact</p>
                       <p className="text-sm font-black text-gray-300">{viewingMember.emergencyContact || '-'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Address</p>
                       <p className="text-sm font-black text-gray-300 truncate">{viewingMember.address || '-'}</p>
                     </div>
                  </div>
                </div>

                {/* Body Metrics */}
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><Zap size={16} className="text-primary"/> Physical Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                     <div>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Height</p>
                       <p className="text-sm font-black text-primary">{viewingMember.height ? `${viewingMember.height} cm` : '-'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Weight</p>
                       <p className="text-sm font-black text-primary">{viewingMember.weight ? `${viewingMember.weight} kg` : '-'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Blood</p>
                       <p className="text-sm font-black text-red-500">{viewingMember.bloodGroup || '-'}</p>
                     </div>
                     <div>
                       <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest mb-1">Medical</p>
                       <p className="text-xs font-bold text-gray-400 truncate" title={viewingMember.medicalConditions}>{viewingMember.medicalConditions || '-'}</p>
                     </div>
                  </div>
                </div>

                {/* Membership Plan */}
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-primary"/> Membership</h3>
                  <div className="bg-[#121212] border border-primary/20 rounded-2xl p-6 relative overflow-hidden">
                     <div className="flex justify-between items-end relative z-10">
                        <div>
                           <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Current Plan</p>
                           <p className="text-lg font-black text-white uppercase italic">{viewingMember.plan}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Valid Until</p>
                           <p className="text-lg font-black text-primary">{new Date(viewingMember.expiry).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-primary/10 blur-2xl rounded-full"></div>
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Payment Ledger</h3>
                  <div className="bg-[#050505] border border-white/5 rounded-2xl overflow-hidden">
                     {isLoadingPayments ? (
                        <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div></div>
                     ) : viewingPayments.length === 0 ? (
                        <div className="p-8 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">No payment records found.</div>
                     ) : (
                        <table className="w-full text-left">
                           <thead className="bg-white/[0.02] border-b border-white/5">
                             <tr>
                               <th className="px-4 py-3 text-[9px] font-black text-gray-600 uppercase tracking-widest">Date</th>
                               <th className="px-4 py-3 text-[9px] font-black text-gray-600 uppercase tracking-widest">Amount</th>
                               <th className="px-4 py-3 text-[9px] font-black text-gray-600 uppercase tracking-widest">Method</th>
                               <th className="px-4 py-3 text-[9px] font-black text-gray-600 uppercase tracking-widest">Status</th>
                             </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                              {viewingPayments.map(payment => (
                                 <tr key={payment._id}>
                                    <td className="px-4 py-3 text-xs text-gray-400 font-bold">{new Date(payment.paymentDate || Math.random() * 1000).toLocaleDateString()}</td>
                                    <td className="px-4 py-3 text-xs text-primary font-black">₹{payment.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs text-gray-400 uppercase font-bold">{payment.paymentMethod || 'Cash'}</td>
                                    <td className="px-4 py-3">
                                       <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${payment.status === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                          {payment.status || 'success'}
                                       </span>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     )}
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
