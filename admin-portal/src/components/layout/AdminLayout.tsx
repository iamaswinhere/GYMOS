"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardProvider } from '@/lib/context/DashboardContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const session = localStorage.getItem('gymos_admin_session');
    const isLoggedIn = session === 'active';
    
    if (!isLoggedIn && pathname !== '/login') {
      router.push('/login');
    } else if (isLoggedIn && pathname === '/login') {
      router.push('/');
    } else {
      setIsAuth(true);
    }
  }, [pathname, router]);

  if (!isAuth && pathname !== '/login') {
    return <div className="min-h-screen bg-black" />; // Loading state
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-black">
        <Sidebar />
        <div className="pl-64 flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
