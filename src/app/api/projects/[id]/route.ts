import type { NextRequest } from 'next/server';
import { dataService } from '@/lib/data-service';
import {
  json,
  jsonError,
  authenticateApiRequest,
  validateProjectPayload,
  CORS_HEADERS,
} from '@/lib/api-utils';

export const dynamic = 'force-dynamic';

interface Ctx {
  params: Promise<{ id: string }>;
}

// ---------------------------------------------------------------------------
// GET /api/projects/[id]
// Public for published projects. Drafts require the API key.
// Also accepts a slug: /api/projects/fog-over-highlands?by=slug
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const bySlug = request.nextUrl.searchParams.get('by') === 'slug';

    const project = bySlug
      ? await dataService.getProjectBySlug(id, true)
      : await dataService.getProjectById(id);

    if (!project) {
      return jsonError('Project not found.', 404);
    }

    // Drafts are only visible to key holders — never to anonymous callers.
    if (project.status !== 'published') {
      const auth = authenticateApiRequest(request);
      if (!auth.authenticated) {
        return jsonError('Project not found.', 404); // don't leak draft existence
      }
    }

    return json({ project });
  } catch (err) {
    console.error('[api] GET /api/projects/[id] failed:', err);
    return jsonError('Failed to load project.', 500);
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/projects/[id]
// Protected — updates an existing project. Send only the fields to change;
// images, when provided, replace the whole gallery.
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest, ctx: Ctx) {
  const auth = authenticateApiRequest(request);
  if (auth.error) return auth.error;

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Request body must be valid JSON.', 400);
  }

  try {
    const existing = await dataService.getProjectById(id);
    if (!existing) {
      return jsonError('Project not found.', 404);
    }

    const { data: patch, error } = validateProjectPayload(body, { partial: true });
    if (error || !patch) {
      return jsonError(error || 'Invalid payload.', 400);
    }

    // Slug uniqueness check when the slug is being changed.
    if (patch.slug && patch.slug !== existing.slug) {
      const available = await dataService.checkSlugAvailable(patch.slug, id);
      if (!available) {
        return jsonError(`Slug "${patch.slug}" is already taken.`, 409);
      }
    }

    // Merge: keep existing images/cover unless explicitly replaced.
    const merged = {
      title: patch.title ?? existing.title,
      slug: patch.slug ?? existing.slug,
      year: patch.year ?? existing.year,
      description: patch.description ?? existing.description,
      category: patch.category ?? existing.category,
      location: patch.location ?? existing.location,
      camera_info: patch.camera_info ?? existing.camera_info,
      status: patch.status ?? existing.status,
      cover_image: patch.cover_image ?? existing.cover_image,
      images: patch.images
        ? patch.images
        : (existing.images || []).map((img, i) => ({
            id: img.id,
            image_url: img.image_url,
            alt_text: img.alt_text,
            caption: img.caption || '',
            sort_order: i,
            width: img.width ?? undefined,
            height: img.height ?? undefined,
          })),
    };

    if (merged.images.length === 0) {
      return jsonError('A project must keep at least one image.', 400);
    }

    const project = await dataService.saveProjectAdmin(merged, id);
    return json({ project, url: `/project/${project.slug}` });
  } catch (err) {
    console.error('[api] PATCH /api/projects/[id] failed:', err);
    return jsonError((err instanceof Error ? err.message : null) || 'Failed to update project.', 500);
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/projects/[id]
// Protected — permanently removes the project and its image rows.
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest, ctx: Ctx) {
  const auth = authenticateApiRequest(request);
  if (auth.error) return auth.error;

  const { id } = await ctx.params;

  try {
    const existing = await dataService.getProjectById(id);
    if (!existing) {
      return jsonError('Project not found.', 404);
    }

    await dataService.deleteProjectAdmin(id);
    return json({ deleted: true, id });
  } catch (err) {
    console.error('[api] DELETE /api/projects/[id] failed:', err);
    return jsonError((err instanceof Error ? err.message : null) || 'Failed to delete project.', 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
