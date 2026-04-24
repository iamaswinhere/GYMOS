"use client";
import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardProvider } from '@/lib/context/DashboardContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuth, setIsAuth] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('gymos_admin_token');
    const adminDataStr = localStorage.getItem('gymos_admin_data');
    const isLoggedIn = !!token;
    
    const isLoginPage = pathname === '/admin/login' || pathname === '/trainer';
    
    if (!isLoggedIn && !isLoginPage) {
      router.push('/admin/login');
    } else if (isLoggedIn && isLoginPage) {
      // Redirect based on role
      const adminData = adminDataStr ? JSON.parse(adminDataStr) : null;
      if (adminData?.role === 'trainer') {
        router.push('/admin/members');
      } else {
        router.push('/admin');
      }
    } else {
      setIsAuth(true);
    }
  }, [pathname, router]);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const isLoginPage = pathname === '/admin/login' || pathname === '/trainer';

  if (!isAuth && !isLoginPage) {
    return <div className="min-h-screen bg-black" />; // Loading state
  }

  return (
    <DashboardProvider>
      {isLoginPage ? (
        children
      ) : (
        <div className="min-h-screen bg-black flex overflow-hidden">
          {/* Sidebar for Desktop */}
          <div className="hidden lg:block w-64 shrink-0 h-screen">
            <Sidebar isOpen={true} onClose={() => {}} isMobile={false} />
          </div>

          {/* Sidebar for Mobile */}
          <AnimatePresence>
            {isSidebarOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-[280px] z-[70] lg:hidden"
                >
                  <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} isMobile={true} />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex-1 flex flex-col h-screen overflow-hidden">
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-black custom-scrollbar">
              {children}
            </main>
          </div>
        </div>
      )}
    </DashboardProvider>
  );
}
