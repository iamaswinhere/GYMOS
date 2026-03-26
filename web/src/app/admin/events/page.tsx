"use client";
import React, { useState } from 'react';
import { Calendar, Plus, MapPin, Clock, X, Trash2 } from 'lucide-react';
import { useDashboard, GymEvent } from '@/lib/context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventsPage() {
  const { events, addEvent, deleteEvent, isLoading } = useDashboard();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    imageUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addEvent({
      ...formData,
      status: 'upcoming'
    });
    setIsModalOpen(false);
    setFormData({ name: '', date: '', location: '', imageUrl: '' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
         <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
         <p className="text-gray-500 font-black uppercase tracking-widest text-xs">Loading Events...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Gym <span className="text-primary italic">Events</span></h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Quick Activity Scheduler</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-black font-black px-6 py-3 rounded-2xl flex items-center gap-2 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,196,0,0.2)]">
          <Plus size={20} strokeWidth={3} /> CREATE EVENT
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length === 0 ? (
           <div className="col-span-full py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
              <Calendar className="mx-auto text-gray-700 mb-4" size={48} />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No events scheduled yet.</p>
           </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="dashboard-card group relative overflow-hidden">
              <button 
                onClick={() => deleteEvent(event.id)}
                className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 z-20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-500 hover:text-white"
              >
                <Trash2 size={16} />
              </button>
              
              {event.imageUrl ? (
                <div className="h-48 w-full -mt-8 -mx-8 mb-6 overflow-hidden relative">
                  <img 
                    src={event.imageUrl} 
                    alt={event.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] to-transparent"></div>
                </div>
              ) : (
                <div className="mb-6 flex justify-between items-start">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                      <Calendar size={24} />
                  </div>
                </div>
              )}

              <div className="relative">
                <span className={`text-[10px] font-black border px-2 py-1 rounded uppercase tracking-tighter italic z-10 ${
                  event.imageUrl ? 'absolute -top-12 left-0 bg-black/50 backdrop-blur-md' : ''
                } ${
                  event.status === 'upcoming' ? 'bg-primary/10 text-primary border-primary/20' : 
                  event.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                  'bg-red-500/10 text-red-500 border-red-500/20'
                }`}>
                  {event.status}
                </span>
                
                <h3 className="text-xl font-black text-white mb-4 group-hover:text-primary transition-colors uppercase tracking-tight line-clamp-2">{event.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-gray-400 text-xs font-bold uppercase tracking-wider">
                    <Clock size={16} className="text-primary" /> {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
                    <MapPin size={16} /> {event.location}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0D0D0D] border border-white/10 rounded-[40px] p-10 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-all"><X size={24}/></button>
              
              <div className="mb-8">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">New <span className="text-primary italic">Event</span></h2>
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Quickly add a new gym activity.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Event Name</label>
                   <input type="text" placeholder="e.g. Morning Yoga" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Date & Time</label>
                   <input type="datetime-local" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Location</label>
                   <input type="text" placeholder="e.g. Studio A" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all" required />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-gray-500 uppercase ml-2 tracking-widest">Photo URL (Optional)</label>
                   <input type="text" placeholder="https://images.unsplash.com/..." value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold focus:border-primary/50 outline-none transition-all" />
                </div>
                <button type="submit" className="w-full bg-primary text-black font-black py-5 rounded-2xl shadow-[0_10px_30px_rgba(255,196,0,0.3)] hover:scale-[1.02] transition-all text-sm tracking-widest uppercase">CREATE EVENT</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
