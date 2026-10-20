'use client';

import React from 'react';
import Link from 'next/link';
import { Camera, Mail, Globe, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-950 border-t border-white/10 text-zinc-400 font-light">
      {/* Statement & Bio Section */}
      <section id="statement" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-b border-white/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono tracking-widest text-amber-400 uppercase block mb-3">
              Artist Statement
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal leading-snug">
              &ldquo;Photography is not merely capturing a subject, but capturing the exact moment light touches emotion.&rdquo;
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
            <p>
              LUMEN is an independent visual archive dedicated to cinematic aesthetics and uncompromised authenticity. 
              Undertaken across diverse series over the years, the work focuses on contemporary architecture, 
              the quiet presence of nature, and documentary human stories.
            </p>
            <p className="text-zinc-400 text-sm">
              Each collection is meticulously curated for lighting rhythm, compositional harmony, and natural tonal palettes, 
              delivering an unadulterated visual experience for photography connoisseurs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact & Inquiries */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-white/10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h3 className="text-white font-serif text-2xl font-semibold mb-2">
              Collaborations &amp; Inquiries
            </h3>
            <p className="text-sm text-zinc-400">
              Available for commercial architectural photography, gallery exhibitions, documentary assignments, and print publications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="mailto:contact@lumenarchive.studio"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs tracking-wider uppercase transition-all"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>contact@lumenarchive.studio</span>
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-all"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>

            <a
              href="https://500px.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-zinc-900 border border-white/10 text-zinc-300 hover:text-white hover:border-white/30 transition-all"
              aria-label="500px Profile"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-500">
        <div className="flex items-center gap-3">
          <Camera className="w-4 h-4 text-zinc-400" />
          <span>© {new Date().getFullYear()} LUMEN ARCHIVE • ALL RIGHTS RESERVED.</span>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/admin/login" className="hover:text-zinc-300 transition-colors">
            Admin Portal
          </Link>
          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 hover:text-white transition-colors"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
