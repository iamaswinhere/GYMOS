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
  Dumbbell
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Members', icon: Users, path: '/admin/members' },
    { name: 'Payments', icon: CreditCard, path: '/admin/payments' },
    { name: 'Events', icon: Calendar, path: '/admin/events' },
    { name: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('gymos_admin_session');
    router.push('/admin/login');
  };

  return (
    <div className="w-64 h-screen bg-[#050505] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <Dumbbell className="text-primary w-8 h-8" />
        <span className="text-2xl font-black tracking-tighter text-white">GYM<span className="text-primary">OS</span></span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={cn(
                "sidebar-link",
                isActive && "sidebar-link-active"
              )}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
