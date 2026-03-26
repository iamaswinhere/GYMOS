"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MemberProvider, useMember } from '@/lib/context/MemberContext';

const MemberAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { member, isLoading } = useMember();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    
    if (!member && pathname !== '/member/login') {
      router.push('/member/login');
    } else if (member && pathname === '/member/login') {
      router.push('/member');
    }
  }, [member, isLoading, pathname, router]);

  if (isLoading) return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return <>{children}</>;
};

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      <MemberProvider>
        <MemberAuthGuard>
          {children}
        </MemberAuthGuard>
      </MemberProvider>
    </div>
  );
}
