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

// ---------------------------------------------------------------------------
// GET /api/projects
// Public endpoint. Query params:
//   ?year=2025          filter by year
//   ?search=fog         full-text-ish search on title/description/category
//   ?limit=12&offset=0  pagination (limit capped at 50)
//   ?status=draft       requires API key — lists drafts too (default: published)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    const statusFilter = sp.get('status');
    const includeDrafts = statusFilter === 'draft' || statusFilter === 'all';

    // Listing drafts requires the API key — they are not public data.
    if (includeDrafts) {
      const auth = authenticateApiRequest(request);
      if (auth.error) return auth.error;
      if (!auth.authenticated) {
        return jsonError(
          'Unauthorized: a valid x-api-key header is required to list drafts.',
          401
        );
      }

      const projects = await dataService.getAllProjectsAdmin({
        status: statusFilter === 'all' ? undefined : 'draft',
        search: sp.get('search') || undefined,
      });
      return json({ projects, total: projects.length });
    }

    const yearParam = sp.get('year');
    const year = yearParam ? Number(yearParam) : null;
    if (yearParam && !Number.isInteger(year)) {
      return jsonError('Query param "year" must be an integer.', 400);
    }

    const limit = Math.min(Math.max(Number(sp.get('limit')) || 12, 1), 50);
    const offset = Math.max(Number(sp.get('offset')) || 0, 0);

    const { projects, total } = await dataService.getPublishedProjects({
      year,
      search: sp.get('search') || undefined,
      limit,
      offset,
    });

    return json({ projects, total, limit, offset });
  } catch (err) {
    console.error('[api] GET /api/projects failed:', err);
    return jsonError('Failed to load projects.', 500);
  }
}

// ---------------------------------------------------------------------------
// POST /api/projects
// Protected — creates a new project (a photography series).
// Auth: `x-api-key: <ADMIN_API_KEY>` or `Authorization: Bearer <ADMIN_API_KEY>`.
//
// Body example:
// {
//   "title": "Fog Over the Highlands",
//   "slug": "fog-over-highlands",          // optional, auto-generated
//   "year": 2026,                           // optional, defaults to current year
//   "status": "published",                  // "draft" | "published" (default draft)
//   "description": "...",
//   "category": "Landscape",
//   "location": "Ba Vi, Vietnam",
//   "camera_info": "Leica M11",
//   "cover_image": "https://...",           // optional, defaults to images[0]
//   "images": [{ "image_url": "https://...", "alt_text": "...", "caption": "..." }]
// }
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  const auth = authenticateApiRequest(request);
  if (auth.error) return auth.error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Request body must be valid JSON.', 400);
  }

  const { data, error } = validateProjectPayload(body);
  if (error || !data) {
    return jsonError(error || 'Invalid payload.', 400);
  }

  try {
    const slugAvailable = await dataService.checkSlugAvailable(data.slug);
    if (!slugAvailable) {
      return jsonError(`Slug "${data.slug}" is already taken.`, 409);
    }

    const project = await dataService.saveProjectAdmin(data);

    return json(
      {
        project,
        url: `/project/${project.slug}`,
        message:
          project.status === 'published'
            ? 'Project published successfully.'
            : 'Project saved as draft.',
      },
      201
    );
  } catch (err) {
    console.error('[api] POST /api/projects failed:', err);
    return jsonError((err instanceof Error ? err.message : null) || 'Failed to create project.', 500);
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
