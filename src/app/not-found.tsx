import React from 'react';
import Link from 'next/link';
import { Camera, Compass, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-32">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-amber-400 mx-auto shadow-2xl">
            <Camera className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono text-amber-400 tracking-widest uppercase">
              404 Error • Not Found
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              Project Not Found
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed font-light">
              This collection may not be published yet, has been moved to a new address, or does not exist.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 font-medium text-xs tracking-wider uppercase hover:bg-amber-100 transition-all shadow-lg"
            >
              <Compass className="w-4 h-4 text-zinc-900" />
              <span>Return to Gallery</span>
            </Link>

            <Link
              href="/admin/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-white/10 hover:border-white/25 text-zinc-300 hover:text-white text-xs tracking-wider uppercase transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
