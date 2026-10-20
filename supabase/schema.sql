-- ==============================================================================
-- SCHEMA DEFINITION FOR PROFESSIONAL PHOTO PORTFOLIO (LUMEN / 500px INSPIRED)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    description TEXT,
    cover_image TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    category TEXT DEFAULT 'Editorial',
    location TEXT,
    camera_info TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create project_images table
CREATE TABLE IF NOT EXISTS public.project_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    caption TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    width INTEGER,
    height INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_year ON public.projects(year DESC);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON public.project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_project_images_sort_order ON public.project_images(project_id, sort_order ASC);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_images ENABLE ROW LEVEL SECURITY;

-- 6. Row Level Security Policies for `projects`
-- Public can view published projects
CREATE POLICY "Public can view published projects"
    ON public.projects
    FOR SELECT
    USING (status = 'published');

-- Authenticated admins can perform any operation on projects
CREATE POLICY "Authenticated admins can manage all projects"
    ON public.projects
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Row Level Security Policies for `project_images`
-- Public can view images belonging to published projects
CREATE POLICY "Public can view published project images"
    ON public.project_images
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE public.projects.id = public.project_images.project_id
            AND public.projects.status = 'published'
        )
    );

-- Authenticated admins can perform any operation on project images
CREATE POLICY "Authenticated admins can manage all project images"
    ON public.project_images
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- 8. STORAGE CONFIGURATION
-- ==============================================================================
-- Insert the storage bucket for project photos (if not already present)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Public read access to project images
CREATE POLICY "Public Access to project images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'project-images');

-- Storage Policy: Authenticated users can upload project images
CREATE POLICY "Authenticated users can upload project images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'project-images');

-- Storage Policy: Authenticated users can update project images
CREATE POLICY "Authenticated users can update project images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'project-images');

-- Storage Policy: Authenticated users can delete project images
CREATE POLICY "Authenticated users can delete project images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'project-images');
