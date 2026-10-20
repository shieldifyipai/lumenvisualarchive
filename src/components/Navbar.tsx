'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Camera, ShieldCheck, Menu, X, ArrowUpRight } from 'lucide-react';
import { authService, AdminUser } from '@/lib/auth-service';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    authService.getCurrentUser().then(setUser);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAdminSection = pathname.startsWith('/admin');

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-zinc-950/85 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-black/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform duration-300 active:scale-95"
          >
            <div className="w-10 h-10 rounded-full border border-white/20 bg-zinc-900/80 flex items-center justify-center text-zinc-100 group-hover:border-amber-400/50 group-hover:text-amber-300 transition-colors">
              <Camera className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg tracking-[0.25em] font-semibold text-white uppercase group-hover:text-amber-200 transition-colors">
                LUMEN
              </span>
              <span className="text-[10px] tracking-[0.35em] text-zinc-400 uppercase -mt-1">
                Visual Archive
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm tracking-wider uppercase transition-colors hover:text-white ${
                pathname === '/' ? 'text-white font-medium' : 'text-zinc-400'
              }`}
            >
              Explore
            </Link>

            <a
              href="#statement"
              className="text-sm tracking-wider uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Artist
            </a>

            <a
              href="#contact"
              className="text-sm tracking-wider uppercase text-zinc-400 hover:text-white transition-colors"
            >
              Contact
            </a>

            <div className="h-4 w-[1px] bg-zinc-800" />

            {/* Admin CTA */}
            {user ? (
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide bg-amber-400/10 border border-amber-400/30 text-amber-300 hover:bg-amber-400/20 transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin ({user.email.split('@')[0]})</span>
              </Link>
            ) : (
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide border border-white/15 text-zinc-300 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all"
              >
                <span>Admin Login</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            {user && (
              <Link
                href="/admin"
                className="text-xs px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300"
              >
                Admin
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-300 hover:text-white border border-white/10 rounded-lg bg-zinc-900/60"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 mx-4 p-5 rounded-2xl bg-zinc-900/95 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium tracking-wider uppercase text-zinc-200 hover:text-amber-300 py-1"
          >
            Explore Projects
          </Link>
          <a
            href="#statement"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm tracking-wider uppercase text-zinc-400 hover:text-white py-1"
          >
            Artist &amp; Statement
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm tracking-wider uppercase text-zinc-400 hover:text-white py-1"
          >
            Contact &amp; Inquiries
          </a>

          <div className="h-[1px] bg-white/10 my-1" />

          {user ? (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300"
            >
              <span>Enter Admin Portal</span>
              <ShieldCheck className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between text-xs py-2 px-3 rounded-lg border border-white/15 text-zinc-200 hover:bg-white/5"
            >
              <span>Admin Login</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
