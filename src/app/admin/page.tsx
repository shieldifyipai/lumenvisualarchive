'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Database,
  ExternalLink,
  Code2,
  X,
} from 'lucide-react';
import { Project } from '@/types/portfolio';
import { dataService } from '@/lib/data-service';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Deletion state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSqlGuide, setShowSqlGuide] = useState(false);

  const supabaseStatus = dataService.getSupabaseStatus();

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await dataService.getAllProjectsAdmin({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery,
      });
      setProjects(data);
    } catch (err) {
      console.error('Error fetching admin projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, searchQuery]);

  // Metrics
  const totalProjects = projects.length;
  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const draftCount = projects.filter((p) => p.status === 'draft').length;
  const totalPhotos = projects.reduce((acc, p) => acc + (p.images?.length || 0), 0);

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      await dataService.deleteProject(projectToDelete.id);
      setProjectToDelete(null);
      await fetchProjects();
    } catch (err) {
      console.error('Delete project failed:', err);
      alert('Failed to delete project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title & Top CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">
            Manage Photography Series
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Create, edit, organize photos, and publish your photography projects.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSqlGuide(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-white/25 text-xs font-mono text-zinc-300 hover:text-white transition-all"
            title="View Supabase database guide"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supabase SQL Guide</span>
          </button>

          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-amber-400/10 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Total Projects</span>
            <Layers className="w-4 h-4 text-zinc-500" />
          </div>
          <p className="text-3xl font-bold font-serif text-white">{totalProjects}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Published</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold font-serif text-emerald-300">{publishedCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Drafts</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-3xl font-bold font-serif text-amber-300">{draftCount}</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-mono uppercase tracking-wider">Photographs</span>
            <Layers className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-3xl font-bold font-serif text-sky-300">{totalPhotos}</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/70 border border-white/10">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-xl border border-white/5">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all ${
              statusFilter === 'all'
                ? 'bg-zinc-800 text-white font-medium shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            All ({totalProjects})
          </button>
          <button
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all ${
              statusFilter === 'published'
                ? 'bg-emerald-500/20 text-emerald-300 font-medium border border-emerald-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Published ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all ${
              statusFilter === 'draft'
                ? 'bg-amber-500/20 text-amber-300 font-medium border border-amber-500/30'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 transition-all"
          />
        </div>
      </div>

      {/* Projects Table / Card List */}
      <div className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-16 text-center text-zinc-400">
            <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs font-mono">Loading photography projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-16 text-center text-zinc-400 space-y-3">
            <p className="text-base font-serif text-white">No matching projects found</p>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Start by creating your first photography series with &quot;New Project&quot;.
            </p>
            <div className="pt-2">
              <Link
                href="/admin/projects/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 text-zinc-950 font-semibold text-xs tracking-wider uppercase hover:bg-amber-300 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Create Project Now</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-zinc-950/50 text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                  <th className="py-4 px-6">Project</th>
                  <th className="py-4 px-4">URL Slug</th>
                  <th className="py-4 px-4">Year</th>
                  <th className="py-4 px-4">Photos</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Created Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {projects.map((project) => {
                  const isPublished = project.status === 'published';
                  const photoCount = project.images?.length || 0;
                  const dateStr = new Date(project.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  });

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      {/* Title & Cover */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-14 h-11 rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0 border border-white/10">
                            {project.cover_image ? (
                              <Image
                                src={project.cover_image}
                                alt={project.title}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                                <Layers className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <Link
                              href={`/admin/projects/${project.id}/edit`}
                              className="font-serif font-semibold text-white hover:text-amber-300 transition-colors line-clamp-1"
                            >
                              {project.title}
                            </Link>
                            {project.category && (
                              <span className="text-[11px] font-mono text-zinc-400">
                                {project.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-4 px-4 font-mono text-xs text-zinc-400 truncate max-w-[180px]">
                        /project/{project.slug}
                      </td>

                      {/* Year */}
                      <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                        {project.year}
                      </td>

                      {/* Photo Count */}
                      <td className="py-4 px-4 font-mono text-xs text-zinc-300">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-zinc-950 border border-white/5">
                          {photoCount} {photoCount === 1 ? 'photo' : 'photos'}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono tracking-wider bg-amber-500/10 border border-amber-500/30 text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-4 px-4 font-mono text-xs text-zinc-400">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Live preview */}
                          <Link
                            href={`/project/${project.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                            title="View live project"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Edit button */}
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-zinc-400 hover:text-amber-300 hover:border-amber-400/30 transition-all"
                            title="Edit project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete button */}
                          <button
                            onClick={() => setProjectToDelete(project)}
                            className="p-2 rounded-lg bg-zinc-950 border border-white/5 text-zinc-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-all"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6 stroke-[1.5]" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-xl font-bold text-white">
                Confirm Project Deletion?
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                You are about to permanently delete{' '}
                <strong className="text-white">&ldquo;{projectToDelete.title}&rdquo;</strong>. 
                This action cannot be undone and will remove all associated photographs.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 text-xs font-mono tracking-wider uppercase transition-all"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs font-mono tracking-wider uppercase transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Delete Permanently</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supabase SQL Helper Modal */}
      {showSqlGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/15 rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="font-serif text-lg font-bold text-white">
                  Supabase Database &amp; Storage Configuration Guide
                </h3>
              </div>
              <button
                onClick={() => setShowSqlGuide(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 text-xs text-zinc-300 font-sans leading-relaxed pr-2">
              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 space-y-2">
                <span className="font-mono text-amber-300 font-semibold">1. Step 1: Create Supabase Project</span>
                <p className="text-zinc-400">
                  Visit <strong>supabase.com</strong>, create a new Project, and retrieve your project URL &amp; anon key.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 space-y-2">
                <span className="font-mono text-amber-300 font-semibold">2. Step 2: Execute SQL Migration</span>
                <p className="text-zinc-400">
                  Open the <strong>SQL Editor</strong> tab on your Supabase Dashboard, paste the entire contents of{' '}
                  <code className="text-emerald-300 font-mono">supabase/schema.sql</code>, and click <strong>Run</strong>.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-950 border border-white/5 space-y-2">
                <span className="font-mono text-amber-300 font-semibold">3. Step 3: Configure Environment Variables</span>
                <p className="text-zinc-400">
                  Create a <code className="text-emerald-300 font-mono">.env.local</code> file based on{' '}
                  <code className="text-emerald-300 font-mono">.env.example</code> and set your two keys:
                </p>
                <pre className="p-3 rounded bg-black/60 font-mono text-[11px] text-zinc-300 overflow-x-auto">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...`}
                </pre>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setShowSqlGuide(false)}
                className="px-5 py-2 rounded-xl bg-white text-zinc-950 font-medium text-xs font-mono uppercase tracking-wider hover:bg-amber-100 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
