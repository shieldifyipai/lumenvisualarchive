'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import ProjectForm from '@/components/admin/ProjectForm';
import { Project } from '@/types/portfolio';
import { dataService } from '@/lib/data-service';

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    dataService
      .getProjectById(id)
      .then((data) => {
        if (!data) {
          setError('Project not found for editing.');
        } else {
          setProject(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching project:', err);
        setError('An error occurred while loading project data.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mx-auto mb-3" />
        <span className="text-xs font-mono text-zinc-400">Loading project details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8 rounded-2xl bg-zinc-900 border border-white/10 text-center max-w-md mx-auto my-16 space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6 stroke-[1.5]" />
        </div>
        <h3 className="font-serif text-lg font-bold text-white">
          {error || 'Project Not Found'}
        </h3>
        <p className="text-xs text-zinc-400">
          This project may have been deleted or the access URL is invalid.
        </p>
        <div className="pt-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 text-white text-xs font-mono uppercase tracking-wider hover:bg-zinc-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Admin Dashboard</span>
          </Link>
        </div>
      </div>
    );
  }

  return <ProjectForm initialProject={project} isEdit={true} />;
}
