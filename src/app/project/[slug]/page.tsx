import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { dataService } from '@/lib/data-service';
import ProjectDetailClient from './ProjectDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await dataService.getProjectBySlug(slug, true);

  if (!project) {
    return {
      title: 'Project Not Found • LUMEN ARCHIVE',
      description: 'The requested photography series does not exist or has not been published.',
    };
  }

  return {
    title: `${project.title} (${project.year}) • LUMEN ARCHIVE`,
    description: project.description || `Fine art photography collection: ${project.title}.`,
    openGraph: {
      title: `${project.title} • LUMEN ARCHIVE`,
      description: project.description,
      images: [
        {
          url: project.cover_image,
          width: 1600,
          height: 1067,
          alt: project.title,
        },
      ],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.title} • LUMEN ARCHIVE`,
      description: project.description,
      images: [project.cover_image],
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await dataService.getProjectBySlug(slug, true);

  // If not found or draft without admin preview, render custom 404 UI
  if (!project) {
    notFound();
  }

  // Fetch adjacent projects for seamless browsing
  const { projects: allPublished } = await dataService.getPublishedProjects({ limit: 12 });
  const otherProjects = allPublished.filter((p) => p.id !== project.id).slice(0, 3);

  return (
    <ProjectDetailClient
      project={project}
      otherProjects={otherProjects}
    />
  );
}
