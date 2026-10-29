export type ProjectStatus = 'draft' | 'published';

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  caption?: string;
  sort_order: number;
  width?: number | null;
  height?: number | null;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  year: number;
  description: string;
  cover_image: string;
  status: ProjectStatus;
  category?: string;
  location?: string;
  camera_info?: string;
  created_at: string;
  published_at: string | null;
  images?: ProjectImage[];
}

export interface ProjectFormData {
  title: string;
  slug: string;
  year: number;
  description: string;
  cover_image: string;
  status: ProjectStatus;
  category?: string;
  location?: string;
  camera_info?: string;
  // Optional ISO-8601 overrides for backdating (API use).
  // published_at only takes effect when status is 'published'.
  published_at?: string | null;
  created_at?: string;
  images: Array<{
    id?: string;
    image_url: string;
    alt_text: string;
    caption?: string;
    sort_order: number;
    width?: number;
    height?: number;
    file?: File;
  }>;
}
