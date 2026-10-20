'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Camera,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Database,
  Layers,
  PlusCircle,
} from 'lucide-react';
import { authService, AdminUser } from '@/lib/auth-service';
import { dataService } from '@/lib/data-service';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const isLoginPage = pathname === '/admin/login';
  const supabaseStatus = dataService.getSupabaseStatus();

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);

      if (!currentUser && !isLoginPage) {
        router.push('/admin/login');
      }
    });
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    router.push('/admin/login');
  };

  // If on login page, just render children without the admin chrome
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
          <span className="text-xs font-mono tracking-widest uppercase">Authenticating admin session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Section Title */}
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 text-white hover:text-amber-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-300">
                <Camera className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-sm font-bold tracking-widest uppercase">
                  LUMEN ADMIN
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Portfolio Management</span>
              </div>
            </Link>

            {/* Supabase Status Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono border">
              <Database className="w-3 h-3 text-emerald-400" />
              {supabaseStatus.configured ? (
                <span className="text-emerald-300 border-emerald-500/20 bg-emerald-500/10">
                  Supabase Live
                </span>
              ) : (
                <span className="text-amber-300 border-amber-500/20 bg-amber-500/10">
                  Demo &amp; Local Store
                </span>
              )}
            </div>
          </div>

          {/* Quick Actions & User Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/admin/projects/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-semibold text-xs tracking-wider uppercase hover:bg-amber-300 transition-all shadow-md active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">New Project</span>
              <span className="xs:hidden">New</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-white/10 hover:border-white/20 text-xs text-zinc-300 hover:text-white transition-all"
              title="View public website"
            >
              <span className="hidden md:inline">Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {user && (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-medium text-white truncate max-w-[140px]">
                    {user.email}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400">
                    {user.isDemo ? 'Administrator (Demo)' : 'Admin'}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
