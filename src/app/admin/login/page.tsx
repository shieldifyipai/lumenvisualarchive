'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService } from '@/lib/auth-service';
import { dataService } from '@/lib/data-service';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabaseStatus = dataService.getSupabaseStatus();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await authService.login(email, password);
      if (res.success) {
        router.push('/admin');
      } else {
        setError(res.error || 'Sign in failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'System error during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccess = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authService.login('admin@lumenarchive.studio', 'secure-admin-pass');
      if (res.success) {
        router.push('/admin');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-amber-400/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Logo */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="w-14 h-14 rounded-full border border-white/20 bg-zinc-900 flex items-center justify-center text-amber-400 shadow-2xl hover:scale-105 transition-transform"
          >
            <Camera className="w-7 h-7 stroke-[1.5]" />
          </Link>
        </div>

        <h2 className="mt-6 text-center font-serif text-3xl font-bold tracking-tight text-white">
          Portfolio Admin Portal
        </h2>
        <p className="mt-2 text-center text-xs font-mono tracking-widest text-zinc-400 uppercase">
          SECURE AUTHENTICATION • LUMEN ARCHIVE
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-zinc-900/90 py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-white/10 backdrop-blur-xl">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/30 border border-red-500/20 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@lumenarchive.studio"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white text-zinc-950 font-medium text-xs tracking-wider uppercase hover:bg-amber-100 transition-all shadow-lg shadow-white/5 active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-wider uppercase transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Quick Demo Admin Access</span>
            </button>
            <p className="mt-2 text-center text-[11px] text-zinc-500">
              {supabaseStatus.configured
                ? 'Connected to Supabase Auth. You can also sign in with your Supabase credentials.'
                : 'Designed so you can test all administration features immediately without pre-configuring Supabase credentials.'}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors"
            >
              ← Return to public site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
