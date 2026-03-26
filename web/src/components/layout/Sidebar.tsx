"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Settings, 
  Calendar,
  LogOut,
  Dumbbell,
  X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}

const Sidebar = ({ isOpen, onClose, isMobile = false }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Members', icon: Users, path: '/admin/members' },
    { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { name: 'Events', icon: Calendar, path: '/admin/events' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('gymos_admin_session');
    router.push('/admin/login');
  };

  return (
    <div className={cn(
      "h-full bg-[#050505] border-r border-white/5 flex flex-col z-50",
      !isMobile ? "w-64 fixed left-0 top-0" : "w-full"
    )}>
      <div className="p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Dumbbell className="text-primary w-8 h-8" />
          <span className="text-2xl font-black tracking-tighter text-white uppercase italic">GYM<span className="text-primary">OS</span></span>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white lg:hidden">
            <X size={24} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              onClick={() => isMobile && onClose()}
              className={cn(
                "sidebar-link group",
                isActive && "sidebar-link-active"
              )}
            >
              <item.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "scale-110")} />
              <span className="uppercase tracking-widest text-[11px] font-black">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 bg-[#050505]">
        <button 
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-500/10 hover:text-red-500 group"
        >
          <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
          <span className="uppercase tracking-widest text-[11px] font-black">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
