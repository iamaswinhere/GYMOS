"use client";
import React from 'react';
import { Download, Filter, IndianRupee, TrendingUp, AlertCircle } from 'lucide-react';
import { useDashboard } from '@/lib/context/DashboardContext';

export default function PaymentsPage() {
  const { members, revenue, admin } = useDashboard();

  // Calculate some sub-stats
  const totalReceived = revenue;
  const pendingFees = members.filter(m => m.status === 'expired').length * 2500; // Mock calculation for pending
  const stoppedRevenue = members.filter(m => m.status === 'stopped').length * 2500;

  const handleExportFinancials = () => {
    const header = ['Payer Name', 'Payment Date', 'Plan Type', 'Amount Paid', 'Status'];
    const rows = members.map(m => [
        `"${m.name.replace(/"/g, '""')}"`, 
        `"${m.date}"`, 
        `"${m.plan}"`, 
        m.amount, 
        `"Completed"`
    ]);
    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `gymos_financials_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Payment <span className="text-primary italic">Tracking</span></h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Financial Analytics & Revenue Stream</p>
        </div>
        <button onClick={handleExportFinancials} className="bg-white/5 border border-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
          <Download size={20} /> Export Financials
        </button>
      </div>

      {admin?.role !== 'trainer' && (
      <div className="grid md:grid-cols-3 gap-6">
          <div className="dashboard-card border-green-500/20 bg-green-500/5 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Total Revenue (₹)</p>
                <h3 className="text-3xl font-black text-white">₹{totalReceived.toLocaleString()}</h3>
                <div className="mt-4 flex items-center gap-2 text-green-500 text-[10px] font-black uppercase">
                  <TrendingUp size={14} /> Tracking active
                </div>
              </div>
              <IndianRupee className="absolute -right-4 -bottom-4 w-24 h-24 text-green-500/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
          
          <div className="dashboard-card border-yellow-500/20 bg-yellow-500/5 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Estimated Pending (₹)</p>
                <h3 className="text-3xl font-black text-white">₹{pendingFees.toLocaleString()}</h3>
                <div className="mt-4 flex items-center gap-2 text-yellow-500 text-[10px] font-black uppercase">
                  <AlertCircle size={14} /> {members.filter(m => m.status === 'expired').length} Expired Members
                </div>
              </div>
              <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-yellow-500/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>

          <div className="dashboard-card border-red-500/20 bg-red-500/5 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-1">Lost Opportunity (₹)</p>
                <h3 className="text-3xl font-black text-white">₹{stoppedRevenue.toLocaleString()}</h3>
                <div className="mt-4 flex items-center gap-2 text-red-500 text-[10px] font-black uppercase">
                   {members.filter(m => m.status === 'stopped').length} Stopped Members
                </div>
              </div>
              <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
      </div>
      )}

      <div className="dashboard-card !p-0">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-black text-white uppercase tracking-tighter">Transition History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a0a] text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Payer Name</th>
                <th className="px-6 py-4">Payment Date</th>
                <th className="px-6 py-4">Plan Type</th>
                <th className="px-6 py-4">Amount Paid</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {members.length === 0 ? (
                  <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic text-sm font-medium">No recorded transactions in this cycle.</td>
                  </tr>
              ) : (
                  members.map((m) => (
                      <tr key={m.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-primary border border-white/5">{m.name.charAt(0)}</div>
                              <span className="font-bold text-white text-sm">{m.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 text-xs font-medium">{m.date}</td>
                        <td className="px-6 py-4">
                           <span className="text-[10px] font-black text-white/70 bg-white/5 px-2 py-0.5 rounded border border-white/5">{m.plan}</span>
                        </td>
                        <td className="px-6 py-4 text-primary font-black text-sm">₹{m.amount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                            <span className="text-[9px] font-black bg-green-500/10 text-green-500 border border-green-500/20 px-2 py-0.5 rounded-full uppercase tracking-tighter">Completed</span>
                        </td>
                      </tr>
                    ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
