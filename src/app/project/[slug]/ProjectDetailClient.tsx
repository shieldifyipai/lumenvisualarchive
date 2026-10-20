'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Share2,
  Check,
  Calendar,
  Camera,
  MapPin,
  Maximize2,
  ShieldAlert,
  ArrowRight,
  Layers,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Lightbox from '@/components/Lightbox';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types/portfolio';

interface Props {
  project: Project;
  otherProjects: Project[];
}

export default function ProjectDetailClient({ project, otherProjects }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const images = project.images && project.images.length > 0 ? project.images : [];

  const handleOpenPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
    setLightboxOpen(true);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-400/20">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        {/* Draft Notice Banner if viewed in preview */}
        {project.status === 'draft' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <span className="text-sm font-medium">
                  This is a Draft Preview. This collection is not yet visible to the public.
                </span>
              </div>
              <Link
                href={`/admin/projects/${project.id}/edit`}
                className="px-3.5 py-1.5 rounded-lg bg-amber-400 text-zinc-950 font-semibold text-xs tracking-wider uppercase hover:bg-amber-300 transition-colors whitespace-nowrap"
              >
                Edit Project
              </Link>
            </div>
          </div>
        )}

        {/* Project Header & Metadata */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          {/* Top Navigation Row */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <Link
              href="/#gallery-grid"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:-translate-x-1 transition-transform" />
              <span>Back to all projects</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-white/10 hover:border-white/25 text-xs text-zinc-300 hover:text-white transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Link copied to clipboard</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Project</span>
                </>
              )}
            </button>
          </div>

          {/* Project Title & Category */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
              {project.category && (
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300 uppercase tracking-widest">
                  {project.category}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Year {project.year}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-zinc-500" />
                <span>{images.length} {images.length === 1 ? 'photo' : 'photos'}</span>
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              {project.title}
            </h1>

            {/* Description & Narrative */}
            {project.description && (
              <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed pt-2 max-w-3xl whitespace-pre-line">
                {project.description}
              </p>
            )}

            {/* Technical Gear & Location Bar */}
            {(project.location || project.camera_info) && (
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs font-mono text-zinc-400">
                {project.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{project.location}</span>
                  </div>
                )}
                {project.camera_info && (
                  <div className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>{project.camera_info}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Editorial Photo Gallery */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {images.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-zinc-900/30">
              <p className="text-zinc-400 text-sm">No photographs available in this collection yet.</p>
            </div>
          ) : (
            images.map((photo, index) => {
              // Alternating rhythm: index % 3 === 0 is full width cinematic, others are staggered
              const isCinematicWide = index === 0 || index % 4 === 0;

              return (
                <figure
                  key={photo.id || index}
                  onClick={() => handleOpenPhoto(index)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden bg-zinc-900/80 border border-white/10 hover:border-white/30 transition-all duration-300 shadow-2xl shadow-black/60"
                >
                  <div
                    className={`relative w-full overflow-hidden bg-zinc-950 flex items-center justify-center ${
                      isCinematicWide ? 'aspect-[16/10] sm:aspect-[21/10]' : 'aspect-[4/3] sm:aspect-[16/11]'
                    }`}
                  >
                    <Image
                      src={photo.image_url}
                      alt={photo.alt_text || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 1200px"
                      priority={index < 2}
                      className="photo-hover-zoom object-contain sm:object-cover object-center"
                    />

                    {/* Gradient Overlay & Fullscreen prompt */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono tracking-wider flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-transform">
                        <Maximize2 className="w-3.5 h-3.5 text-amber-300" />
                        <span>View Fullscreen</span>
                      </div>
                    </div>

                    {/* Top index badge */}
                    <div className="absolute top-4 left-4 glass-pill px-2.5 py-1 rounded-full text-[11px] font-mono text-zinc-300 pointer-events-none">
                      {String(index + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(images.length).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Caption & Alt Text */}
                  {(photo.caption || photo.alt_text) && (
                    <figcaption className="p-4 sm:p-5 bg-zinc-900/90 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <p className="font-serif text-sm sm:text-base text-zinc-200">
                        {photo.caption || photo.alt_text}
                      </p>
                      {photo.alt_text && photo.caption && (
                        <span className="text-xs text-zinc-500 font-sans truncate max-w-xs">
                          {photo.alt_text}
                        </span>
                      )}
                    </figcaption>
                  )}
                </figure>
              );
            })
          )}
        </section>

        {/* Bottom Recommendations / Other Projects */}
        {otherProjects.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28 pt-16 border-t border-white/10">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-mono tracking-widest text-amber-400 uppercase block mb-1">
                  Discover More
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-white">
                  More Series &amp; Projects
                </h2>
              </div>

              <Link
                href="/#gallery-grid"
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {otherProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 500px Fullscreen Lightbox Modal */}
      <Lightbox
        images={images}
        currentIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIndex) => setSelectedPhotoIndex(newIndex)}
        projectTitle={project.title}
      />

      <Footer />
    </div>
  );
}
