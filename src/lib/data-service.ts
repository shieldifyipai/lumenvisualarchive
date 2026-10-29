import { Project, ProjectFormData, ProjectImage } from '@/types/portfolio';
import { supabase, isSupabaseConfigured } from './supabase/client';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabase/admin';
import { INITIAL_PROJECTS } from './mock-data';

const STORAGE_KEY = 'lumina_portfolio_projects_v1';

// In-memory cache for server-side or local execution
let memoryProjects: Project[] = [...INITIAL_PROJECTS];

function getStoredProjects(): Project[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    } catch {
      // ignore localStorage errors
    }
  }
  return memoryProjects;
}

function saveStoredProjects(projects: Project[]): void {
  memoryProjects = projects;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // ignore storage quota errors
    }
  }
}

export const dataService = {
  isSupabaseEnabled(): boolean {
    return isSupabaseConfigured && supabase !== null;
  },

  getSupabaseStatus(): { configured: boolean; url: string } {
    return {
      configured: isSupabaseConfigured,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    };
  },

  async getAvailableYears(): Promise<number[]> {
    if (this.isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase!
          .from('projects')
          .select('year')
          .eq('status', 'published');

        if (!error && data) {
          const years = Array.from(new Set(data.map((p) => p.year))).sort((a, b) => b - a);
          return years;
        }
      } catch {
        // Fallback to local
      }
    }

    const projects = getStoredProjects().filter((p) => p.status === 'published');
    const years = Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a);
    return years.length > 0 ? years : [new Date().getFullYear()];
  },

  async getPublishedProjects(options?: {
    year?: number | null;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ projects: Project[]; total: number }> {
    const { year, search, limit = 12, offset = 0 } = options || {};

    if (this.isSupabaseEnabled()) {
      try {
        let query = supabase!
          .from('projects')
          .select('*, project_images(*)', { count: 'exact' })
          .eq('status', 'published')
          .order('year', { ascending: false })
          .order('created_at', { ascending: false });

        if (year) {
          query = query.eq('year', year);
        }

        if (search && search.trim()) {
          const s = search.trim();
          query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%,category.ilike.%${s}%`);
        }

        query = query.range(offset, offset + limit - 1);

        const { data, count, error } = await query;

        if (!error && data) {
          const mapped: Project[] = data.map((item: any) => ({
            ...item,
            images: item.project_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
          }));
          return { projects: mapped, total: count || mapped.length };
        }
      } catch (err) {
        console.warn('Supabase query error, falling back to local dataset:', err);
      }
    }

    // Local / fallback dataset
    let list = getStoredProjects().filter((p) => p.status === 'published');

    if (year) {
      list = list.filter((p) => p.year === year);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const total = list.length;
    const paginated = list.slice(offset, offset + limit);

    return { projects: paginated, total };
  },

  async getProjectBySlug(slug: string, allowDraft = false): Promise<Project | null> {
    if (this.isSupabaseEnabled()) {
      try {
        let query = supabase!
          .from('projects')
          .select('*, project_images(*)')
          .eq('slug', slug);

        if (!allowDraft) {
          query = query.eq('status', 'published');
        }

        const { data, error } = await query.single();

        if (!error && data) {
          const project: Project = {
            ...data,
            images: data.project_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
          };
          return project;
        }
      } catch {
        // Fallback to local
      }
    }

    const projects = getStoredProjects();
    const found = projects.find((p) => p.slug === slug);

    if (!found) return null;
    if (!allowDraft && found.status !== 'published') return null;

    return found;
  },

  async getAllProjectsAdmin(options?: {
    status?: string;
    search?: string;
  }): Promise<Project[]> {
    const { status, search } = options || {};

    if (this.isSupabaseEnabled()) {
      try {
        let query = supabase!
          .from('projects')
          .select('*, project_images(*)')
          .order('created_at', { ascending: false });

        if (status && status !== 'all') {
          query = query.eq('status', status);
        }

        if (search && search.trim()) {
          const s = search.trim();
          query = query.or(`title.ilike.%${s}%,slug.ilike.%${s}%`);
        }

        const { data, error } = await query;

        if (!error && data) {
          return data.map((item: any) => ({
            ...item,
            images: item.project_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
          }));
        }
      } catch {
        // Fallback to local
      }
    }

    let list = [...getStoredProjects()];

    if (status && status !== 'all') {
      list = list.filter((p) => p.status === status);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return list;
  },

  async getProjectById(id: string): Promise<Project | null> {
    if (this.isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase!
          .from('projects')
          .select('*, project_images(*)')
          .eq('id', id)
          .single();

        if (!error && data) {
          return {
            ...data,
            images: data.project_images?.sort((a: any, b: any) => a.sort_order - b.sort_order) || [],
          };
        }
      } catch {
        // Fallback
      }
    }

    const projects = getStoredProjects();
    return projects.find((p) => p.id === id) || null;
  },

  async checkSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    if (this.isSupabaseEnabled()) {
      try {
        let query = supabase!
          .from('projects')
          .select('id')
          .eq('slug', slug);

        if (excludeId) {
          query = query.neq('id', excludeId);
        }

        const { data, error } = await query;
        if (!error) {
          return !data || data.length === 0;
        }
      } catch {
        // Fallback
      }
    }

    const projects = getStoredProjects();
    const collision = projects.some((p) => p.slug === slug && p.id !== excludeId);
    return !collision;
  },

  async uploadImageFile(file: File): Promise<{ url: string; width?: number; height?: number }> {
    // 1. If Supabase is connected, upload to Supabase Storage bucket 'project-images'
    if (this.isSupabaseEnabled()) {
      try {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase!.storage
          .from('project-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (!uploadError) {
          const { data: publicData } = supabase!.storage
            .from('project-images')
            .getPublicUrl(filePath);

          return { url: publicData.publicUrl };
        }
      } catch (err) {
        console.warn('Supabase storage upload error, falling back to local data URL:', err);
      }
    }

    // 2. Local Fallback: Convert file to Base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        resolve({ url: result });
      };
      reader.onerror = () => reject(new Error('Unable to read image file'));
      reader.readAsDataURL(file);
    });
  },

  async saveProject(formData: ProjectFormData, existingId?: string): Promise<Project> {
    const isNew = !existingId;
    const now = new Date().toISOString();
    const projectId = existingId || `proj-${Date.now()}`;

    const projectPayload: Project = {
      id: projectId,
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      year: formData.year,
      description: formData.description,
      cover_image: formData.cover_image || formData.images[0]?.image_url || '',
      status: formData.status,
      category: formData.category || 'Editorial',
      location: formData.location || '',
      camera_info: formData.camera_info || '',
      created_at: formData.created_at || now,
      published_at:
        formData.status === 'published'
          ? formData.published_at || now
          : null,
      images: formData.images.map((img, idx) => ({
        id: img.id || `img-${Date.now()}-${idx}`,
        project_id: projectId,
        image_url: img.image_url,
        alt_text: img.alt_text || formData.title,
        caption: img.caption || '',
        sort_order: idx,
        width: img.width || 1600,
        height: img.height || 1067,
        created_at: now,
      })),
    };

    if (this.isSupabaseEnabled()) {
      try {
        const { id, images, ...tableData } = projectPayload;
        
        if (isNew) {
          const { data: inserted, error: insertError } = await supabase!
            .from('projects')
            .insert([tableData])
            .select()
            .single();

          if (insertError) throw insertError;
          projectPayload.id = inserted.id;

          // Insert images
          if (images && images.length > 0) {
            const imageRows = images.map((img, index) => ({
              project_id: inserted.id,
              image_url: img.image_url,
              alt_text: img.alt_text,
              caption: img.caption,
              sort_order: index,
            }));

            await supabase!.from('project_images').insert(imageRows);
          }
        } else {
          // Update project
          const { error: updateError } = await supabase!
            .from('projects')
            .update(tableData)
            .eq('id', existingId);

          if (updateError) throw updateError;

          // Re-sync images: delete old, insert updated
          await supabase!.from('project_images').delete().eq('project_id', existingId);

          if (images && images.length > 0) {
            const imageRows = images.map((img, index) => ({
              project_id: existingId,
              image_url: img.image_url,
              alt_text: img.alt_text,
              caption: img.caption,
              sort_order: index,
            }));

            await supabase!.from('project_images').insert(imageRows);
          }
        }

        return projectPayload;
      } catch (err) {
        console.warn('Supabase save error, persisting locally:', err);
      }
    }

    // Local / fallback store
    const projects = getStoredProjects();
    if (isNew) {
      projects.unshift(projectPayload);
    } else {
      const index = projects.findIndex((p) => p.id === existingId);
      if (index !== -1) {
        projectPayload.created_at = projects[index].created_at;
        if (projectPayload.status === 'published' && !projects[index].published_at) {
          projectPayload.published_at = now;
        } else {
          projectPayload.published_at = projects[index].published_at;
        }
        projects[index] = projectPayload;
      } else {
        projects.unshift(projectPayload);
      }
    }

    saveStoredProjects(projects);
    return projectPayload;
  },

  async deleteProject(id: string): Promise<boolean> {
    if (this.isSupabaseEnabled()) {
      try {
        const { error } = await supabase!.from('projects').delete().eq('id', id);
        if (!error) return true;
      } catch {
        // Fallback to local
      }
    }

    const projects = getStoredProjects();
    const updated = projects.filter((p) => p.id !== id);
    saveStoredProjects(updated);
    return true;
  },

  // ---------------------------------------------------------------------------
  // Server-side write methods used by the REST API route handlers.
  // They use the service-role client so they work regardless of RLS/admin login.
  // ---------------------------------------------------------------------------

  isSupabaseAdminEnabled(): boolean {
    return isSupabaseAdminConfigured && supabaseAdmin !== null;
  },

  async saveProjectAdmin(
    formData: ProjectFormData,
    existingId?: string
  ): Promise<Project> {
    // When a service-role client is available, write straight to Supabase.
    if (this.isSupabaseAdminEnabled()) {
      const now = new Date().toISOString();

      const tableData = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        year: formData.year,
        description: formData.description,
        cover_image: formData.cover_image || formData.images[0]?.image_url || '',
        status: formData.status,
        category: formData.category || 'Editorial',
        location: formData.location || '',
        camera_info: formData.camera_info || '',
        // Honor an explicit ISO-8601 published_at (e.g. backdated import),
        // otherwise stamp "now" when publishing.
        published_at:
          formData.status === 'published'
            ? formData.published_at || now
            : null,
      };

      let projectId = existingId;

      if (!projectId) {
        const insertPayload: Record<string, unknown> = { ...tableData };
        if (formData.created_at) insertPayload.created_at = formData.created_at;

        const { data: inserted, error } = await supabaseAdmin!
          .from('projects')
          .insert([insertPayload])
          .select()
          .single();

        if (error) throw new Error(`Supabase insert failed: ${error.message}`);
        projectId = inserted.id;
      } else {
        // Keep the original created_at / published_at when a project is updated.
        const { data: existing } = await supabaseAdmin!
          .from('projects')
          .select('created_at, published_at')
          .eq('id', projectId)
          .single();

        const updatePayload: Record<string, unknown> = {
          ...tableData,
          published_at:
            formData.status === 'published'
              ? formData.published_at || existing?.published_at || now
              : null,
        };
        if (formData.created_at) updatePayload.created_at = formData.created_at;

        const { error } = await supabaseAdmin!
          .from('projects')
          .update(updatePayload)
          .eq('id', projectId);

        if (error) throw new Error(`Supabase update failed: ${error.message}`);

        // Re-sync images
        await supabaseAdmin!
          .from('project_images')
          .delete()
          .eq('project_id', projectId);
      }

      if (formData.images.length > 0) {
        const imageRows = formData.images.map((img, index) => ({
          project_id: projectId,
          image_url: img.image_url,
          alt_text: img.alt_text || formData.title,
          caption: img.caption || '',
          sort_order: index,
          width: img.width ?? null,
          height: img.height ?? null,
        }));

        const { error: imgError } = await supabaseAdmin!
          .from('project_images')
          .insert(imageRows);

        if (imgError) {
          throw new Error(`Supabase image sync failed: ${imgError.message}`);
        }
      }

      // Read back with the admin client — drafts are invisible to the
      // anon key because of RLS ("public can view published only").
      const { data: saved } = await supabaseAdmin!
        .from('projects')
        .select('*, project_images(*)')
        .eq('id', projectId!)
        .single();

      if (saved) {
        return {
          ...saved,
          images:
            saved.project_images?.sort(
              (a: ProjectImage, b: ProjectImage) => a.sort_order - b.sort_order
            ) || [],
        };
      }

      // Fallback shape if the read-back misses
      return {
        id: projectId!,
        ...tableData,
        created_at: now,
        images: formData.images.map((img, index) => ({
          id: img.id || `img-${Date.now()}-${index}`,
          project_id: projectId!,
          image_url: img.image_url,
          alt_text: img.alt_text || formData.title,
          caption: img.caption || '',
          sort_order: index,
          width: img.width ?? null,
          height: img.height ?? null,
          created_at: now,
        })),
      };
    }

    // Local demo mode: delegate to the regular save (in-memory + localStorage).
    return this.saveProject(formData, existingId);
  },

  async deleteProjectAdmin(id: string): Promise<boolean> {
    if (this.isSupabaseAdminEnabled()) {
      const { error } = await supabaseAdmin!
        .from('projects')
        .delete()
        .eq('id', id);
      if (error) throw new Error(`Supabase delete failed: ${error.message}`);
      return true;
    }

    return this.deleteProject(id);
  },
};
