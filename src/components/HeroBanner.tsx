'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowDown, Sparkles, Compass } from 'lucide-react';
import { Project } from '@/types/portfolio';

interface HeroBannerProps {
  featuredProject?: Project | null;
  totalProjects: number;
}

export default function HeroBanner({ featuredProject, totalProjects }: HeroBannerProps) {
  const heroImage =
    featuredProject?.cover_image ||
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85';

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-end justify-start overflow-hidden pt-24 pb-16">
      {/* Background Hero Image with cinematic dark gradients */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage}
          alt="LUMEN Featured Visual"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 transition-transform duration-[10000ms] ease-out hover:scale-100"
        />
        {/* Multilayer gradient for optimal visual clarity and contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-zinc-950/40 to-zinc-950/90" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          {/* Top tag badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-200 mb-6 font-mono tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Contemporary Photography Portfolio</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-6">
            Light, space &amp; cinematic stillness.
          </h1>

          {/* Introduction Subtitle */}
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed max-w-2xl mb-8">
            A curated archive of documentary, contemporary architecture, and untouched landscape photography. 
            Every frame captures a visual fragment preserved with authentic optical fidelity and evocative depth.
          </p>

          {/* CTA Buttons & Stats */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#gallery-grid"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-zinc-950 font-medium text-sm tracking-wide hover:bg-amber-100 transition-all shadow-lg shadow-white/10 active:scale-95"
            >
              <Compass className="w-4 h-4 text-zinc-900" />
              <span>Explore Collections</span>
              <ArrowDown className="w-4 h-4 ml-1 animate-bounce" />
            </a>

            {featuredProject && (
              <Link
                href={`/project/${featuredProject.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900/80 backdrop-blur-md border border-white/20 text-zinc-200 text-sm tracking-wide hover:bg-zinc-800 hover:text-white transition-all"
              >
                <span>Featured: {featuredProject.title.split('-')[0]}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Floating Bottom Metadata Badge */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs tracking-wider text-zinc-400 font-mono">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-white font-medium">{totalProjects}</span> PUBLISHED SERIES
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-zinc-600" />
            <div className="hidden sm:block">FULL FRAME &amp; MEDIUM FORMAT ARCHIVE</div>
          </div>
          <div className="text-zinc-500">
            500px INSPIRED VISUAL EXPERIENCE
          </div>
        </div>
      </div>
    </section>
  );
}
