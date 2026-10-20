'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Image as ImageIcon, MapPin } from 'lucide-react';
import { Project } from '@/types/portfolio';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export default function ProjectCard({ project, priority = false }: ProjectCardProps) {
  const photoCount = project.images?.length || 0;

  return (
    <Link
      href={`/project/${project.slug}`}
      className="group photo-card block relative rounded-2xl overflow-hidden bg-zinc-900 border border-white/10 hover:border-white/30 transition-all duration-500 shadow-xl shadow-black/40 hover:-translate-y-1"
    >
      {/* Cover Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-[16/11] w-full overflow-hidden bg-zinc-950">
        <Image
          src={project.cover_image}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          className="photo-hover-zoom object-cover object-center"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="glass-pill px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wider text-amber-200">
            {project.year}
          </span>

          <div className="flex items-center gap-1.5 glass-pill px-2.5 py-1 rounded-full text-[11px] font-mono text-zinc-300">
            <ImageIcon className="w-3 h-3 text-zinc-400" />
            <span>{photoCount} {photoCount === 1 ? 'photo' : 'photos'}</span>
          </div>
        </div>

        {/* Action Icon on Hover */}
        <div className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Project Meta Details */}
      <div className="p-5 sm:p-6 bg-zinc-900/90">
        {project.category && (
          <p className="text-[11px] font-mono uppercase tracking-widest text-amber-400/90 mb-2">
            {project.category}
          </p>
        )}

        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors line-clamp-1 mb-2">
          {project.title}
        </h3>

        {project.description && (
          <p className="text-sm text-zinc-400 line-clamp-2 font-light leading-relaxed mb-4">
            {project.description}
          </p>
        )}

        {project.location && (
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-sans">
            <MapPin className="w-3 h-3 text-zinc-500 flex-shrink-0" />
            <span className="truncate">{project.location}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
