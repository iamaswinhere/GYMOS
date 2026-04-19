"use client";
import React, { useState } from 'react';
import { Bell, Lock } from 'lucide-react';
import { useDashboard } from '@/lib/context/DashboardContext';

export default function SettingsPage() {
  const { settings, updateSettings, updateAdminCredentials } = useDashboard();

  // Credentials State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdatingCreds, setIsUpdatingCreds] = useState(false);
  const [credMessage, setCredMessage] = useState('');

  const handleToggle = (key: 'whatsappSummaries' | 'trafficThresholdAlerts') => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
  };

  const handleCredentialsUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) return;
    setIsUpdatingCreds(true);
    setCredMessage('');
    
    // Only send what isn't empty
    const payload: any = { currentPassword };
    if (newUsername.trim()) payload.newUsername = newUsername.trim();
    if (newPassword.trim()) payload.newPassword = newPassword.trim();

    try {
      const success = await updateAdminCredentials(payload);
      if (success) {
        setCredMessage('Credentials updated successfully!');
        setCurrentPassword('');
        setNewUsername('');
        setNewPassword('');
      } else {
        setCredMessage('Failed to update credentials.');
      }
    } catch(err: any) {
        setCredMessage('Error occurred: Check your current password.');
    } finally {
        setIsUpdatingCreds(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-black text-white mb-2 tracking-tight">PORTAL SETTINGS</h1>
        <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">System Configuration & Account</p>
      </div>

      <div className="space-y-6">
        {/* Notifications Section */}
        <div className="dashboard-card">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
              <Bell size={20} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Agent Notifications</h3>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-center py-4 border-b border-white/5">
                <div>
                  <p className="text-white font-bold">WhatsApp Daily Summaries</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">Get automated reports every morning</p>
                </div>
                <button 
                  onClick={() => handleToggle('whatsappSummaries')}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings.notifications.whatsappSummaries ? 'bg-primary' : 'bg-white/5 border border-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${settings.notifications.whatsappSummaries ? 'right-1 bg-black' : 'left-1 bg-gray-500'}`}></div>
                </button>
             </div>
             <div className="flex justify-between items-center py-4">
                <div>
                  <p className="text-white font-bold">Traffic Threshold Alerts</p>
                  <p className="text-[10px] text-gray-500 uppercase font-black">Notify when gym capacity exceeds 80%</p>
                </div>
                <button 
                  onClick={() => handleToggle('trafficThresholdAlerts')}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${settings.notifications.trafficThresholdAlerts ? 'bg-primary' : 'bg-white/5 border border-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full transition-all duration-300 ${settings.notifications.trafficThresholdAlerts ? 'right-1 bg-black' : 'left-1 bg-gray-500'}`}></div>
                </button>
             </div>
          </div>
        </div>

        {/* Credentials Section */}
        <div className="dashboard-card">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
              <Lock size={20} />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">Security & Access</h3>
          </div>
          
          <form onSubmit={handleCredentialsUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2 md:col-span-2 border-b border-white/5 pb-6">
                 <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Current Password <span className="text-red-500">*</span></label>
                 <input 
                    type="password" 
                    value={currentPassword} 
                    onChange={e => setCurrentPassword(e.target.value)} 
                    placeholder="Verify it's you..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-red-500/50 outline-none transition-all placeholder:text-gray-800" 
                    required 
                 />
                 <p className="text-[10px] text-gray-500 italic mt-2 ml-2">Must be verified to make any administrative access changes.</p>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">New Username</label>
                 <input 
                    type="text" 
                    value={newUsername} 
                    onChange={e => setNewUsername(e.target.value)} 
                    placeholder="Leave blank to keep current" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-red-500/50 outline-none transition-all placeholder:text-gray-800" 
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">New Password</label>
                 <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="Leave blank to keep current" 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-red-500/50 outline-none transition-all placeholder:text-gray-800" 
                 />
               </div>
            </div>

            {credMessage && (
               <div className={`p-4 rounded-xl text-sm font-bold ${credMessage.includes('success') ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                 {credMessage}
               </div>
            )}

            <button 
              type="submit" 
              disabled={isUpdatingCreds || !currentPassword || (!newUsername && !newPassword)}
              className="w-full bg-white/5 text-white font-black py-4 rounded-2xl border border-white/10 hover:bg-white/10 transition-all text-xs tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isUpdatingCreds ? 'VERIFYING...' : 'UPDATE ACCESS CREDENTIALS'}
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}
