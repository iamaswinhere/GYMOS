"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const phoneNumber = "8921809791";

    const handleWhatsAppRedirect = (e: React.FormEvent) => {
        e.preventDefault();
        const text = `*New Inquiry from GYMOS*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}%0A*Phone:* ${formData.phone}%0A*Message:* ${formData.message}`;
        window.open(`https://wa.me/91${phoneNumber}?text=${text}`, '_blank');
    };

    return (
        <section id="contact" className="container mx-auto px-6 py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 className="text-5xl font-black mb-6">REACH OUT <br /><span className="text-primary">TO US</span></h2>
                    <p className="text-gray-400 mb-10 max-w-md">Ready to join the transformation? Send us a message or visit our state-of-the-art facility.</p>
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-primary"><Phone size={20} /></div>
                            <div>
                                <p className="text-sm text-gray-500">Call Us</p>
                                <p className="font-bold">+91 ${phoneNumber}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-primary"><Mail size={20} /></div>
                            <div>
                                <p className="text-sm text-gray-500">Email Us</p>
                                <p className="font-bold">gym@gym.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-300">
                            <div className="w-12 h-12 glass rounded-full flex items-center justify-center text-primary"><MapPin size={20} /></div>
                            <div>
                                <p className="text-sm text-gray-500">Locate Us</p>
                                <p className="font-bold">Alathur, Kerala, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-8 md:p-12">
                    <form className="space-y-6" onSubmit={handleWhatsAppRedirect}>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="bg-black/50 border border-white/10 rounded-lg p-4 focus:border-primary outline-none transition-colors text-white" 
                            />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="bg-black/50 border border-white/10 rounded-lg p-4 focus:border-primary outline-none transition-colors text-white" 
                            />
                        </div>
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:border-primary outline-none transition-colors text-white" 
                        />
                        <textarea 
                            placeholder="How can we help?" 
                            rows={4} 
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-4 focus:border-primary outline-none transition-colors resize-none text-white"
                        ></textarea>
                        <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                            Send to WhatsApp <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
