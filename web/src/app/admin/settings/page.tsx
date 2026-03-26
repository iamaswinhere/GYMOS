"use client";
import React from 'react';
import { Bell } from 'lucide-react';
import { useDashboard } from '@/lib/context/DashboardContext';

export default function SettingsPage() {
  const { settings, updateSettings } = useDashboard();

  const handleToggle = (key: 'whatsappSummaries' | 'trafficThresholdAlerts') => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    });
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
      </div>

    </div>
  );
}
