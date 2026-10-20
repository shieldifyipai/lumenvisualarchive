'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import ProjectCard from '@/components/ProjectCard';
import Footer from '@/components/Footer';
import { Project } from '@/types/portfolio';
import { dataService } from '@/lib/data-service';
import {
  Search,
  Filter,
  X,
  Sparkles,
  LayoutGrid,
  Columns,
  RefreshCw,
  FolderOpen,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & State
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry'>('grid');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Fetch initial project data
  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const [years, result] = await Promise.all([
        dataService.getAvailableYears(),
        dataService.getPublishedProjects({ limit: 50 }),
      ]);
      setAvailableYears(years);
      setProjects(result.projects);
    } catch (err: any) {
      console.error('Failed to load portfolio projects:', err);
      setError('Unable to load photography projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Filter and search logic
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (selectedYear !== null) {
      result = result.filter((p) => p.year === selectedYear);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [projects, selectedYear, searchQuery]);

  // Featured project for Hero
  const featuredProject = projects.length > 0 ? projects[0] : null;

  // Paginated visible projects
  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProjects.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleResetFilters = () => {
    setSelectedYear(null);
    setSearchQuery('');
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-amber-400/20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroBanner featuredProject={featuredProject} totalProjects={projects.length} />

        {/* Gallery Section */}
        <section id="gallery-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Controls Bar: Search, Year Filters, Layout Toggle */}
          <div className="mb-12 space-y-6">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              {/* Heading */}
              <div>
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curated Archive</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-white">
                  Photography Series
                </h2>
              </div>

              {/* Live Search Input */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search by title, subject, location..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full bg-zinc-900 border border-white/10 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/50 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-white"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Year Filters & Layout Switcher */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Year Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-400 mr-2 flex items-center gap-1.5">
                  <Filter className="w-3 h-3 text-zinc-500" />
                  Year:
                </span>

                <button
                  onClick={() => {
                    setSelectedYear(null);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                    selectedYear === null
                      ? 'bg-white text-zinc-950 font-semibold shadow-md shadow-white/10'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                  }`}
                >
                  All ({projects.length})
                </button>

                {availableYears.map((yr) => {
                  const count = projects.filter((p) => p.year === yr).length;
                  const isSelected = selectedYear === yr;
                  return (
                    <button
                      key={yr}
                      onClick={() => {
                        setSelectedYear(yr);
                        setVisibleCount(ITEMS_PER_PAGE);
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all ${
                        isSelected
                          ? 'bg-amber-400 text-zinc-950 font-semibold shadow-md shadow-amber-400/20'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-white/5'
                      }`}
                    >
                      {yr} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Layout Switcher */}
              <div className="hidden sm:flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-white/10 text-zinc-400">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-1.5 rounded ${
                    layoutMode === 'grid' ? 'bg-zinc-800 text-white shadow-sm' : 'hover:text-white'
                  }`}
                  title="Balanced Grid"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('masonry')}
                  className={`p-1.5 rounded ${
                    layoutMode === 'masonry' ? 'bg-zinc-800 text-white shadow-sm' : 'hover:text-white'
                  }`}
                  title="Editorial Masonry"
                >
                  <Columns className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="p-8 rounded-2xl bg-red-950/20 border border-red-500/20 text-center my-8">
              <p className="text-red-300 font-medium mb-3">{error}</p>
              <button
                onClick={loadProjects}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden bg-zinc-900/60 border border-white/5 shimmer-effect h-[400px]"
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProjects.length === 0 && (
            <div className="py-24 text-center border border-dashed border-white/10 rounded-3xl bg-zinc-900/30">
              <FolderOpen className="w-12 h-12 text-zinc-600 mx-auto mb-4 stroke-1" />
              <h3 className="font-serif text-xl font-medium text-white mb-2">
                No matching projects found
              </h3>
              <p className="text-sm text-zinc-400 max-w-md mx-auto mb-6">
                {searchQuery || selectedYear !== null
                  ? 'Try adjusting your search query or reset the year filter to discover other collections.'
                  : 'There are currently no published projects in the archive.'}
              </p>
              {(searchQuery || selectedYear !== null) && (
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-medium tracking-wide transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset filters &amp; view all</span>
                </button>
              )}
            </div>
          )}

          {/* Project Grid */}
          {!loading && !error && filteredProjects.length > 0 && (
            <>
              <div
                className={`grid gap-8 ${
                  layoutMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-max'
                }`}
              >
                {visibleProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    priority={index < 3}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-16 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white text-sm font-medium tracking-wide shadow-xl hover:border-white/30 transition-all active:scale-95"
                  >
                    <span>Load more projects ({filteredProjects.length - visibleCount} remaining)</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
