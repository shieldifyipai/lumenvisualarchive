import { NextResponse } from 'next/server';
import { ProjectFormData, ProjectStatus } from '@/types/portfolio';
import { slugify } from '@/lib/utils/slugify';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Api-Key',
};

export function json<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status, headers: CORS_HEADERS });
}

export function jsonError(message: string, status: number): NextResponse {
  return json({ error: message }, status);
}

// ---------------------------------------------------------------------------
// API key authentication
//
// Clients must send the key via the `x-api-key` header
// (or `Authorization: Bearer <key>`).
//
// In production (`NODE_ENV=production`) requests are rejected unless
// ADMIN_API_KEY is configured. In development the API stays open so it can be
// exercised without extra setup — a warning is logged on the first request.
// ---------------------------------------------------------------------------

let warnedAboutMissingKey = false;

interface AuthResult {
  // null when the request may proceed; a NextResponse when it must be rejected.
  error: NextResponse | null;
  // true only when a real, configured API key was presented and matched.
  // Stays false in dev-open mode so sensitive reads (drafts) stay locked.
  authenticated: boolean;
}

export function authenticateApiRequest(request: Request): AuthResult {
  const configuredKey = process.env.ADMIN_API_KEY;

  if (!configuredKey) {
    if (process.env.NODE_ENV === 'production') {
      return {
        error: jsonError(
          'API is not configured: the server is missing ADMIN_API_KEY.',
          503
        ),
        authenticated: false,
      };
    }
    if (!warnedAboutMissingKey) {
      warnedAboutMissingKey = true;
      console.warn(
        '[api] ADMIN_API_KEY is not set — write endpoints are open (development mode), but draft data stays private.'
      );
    }
    // Open for writes in dev, but NOT treated as an authenticated key holder.
    return { error: null, authenticated: false };
  }

  const headerKey = request.headers.get('x-api-key');
  const authHeader = request.headers.get('authorization');
  const bearer = authHeader?.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : null;
  const provided = headerKey || bearer;

  if (!provided || provided !== configuredKey) {
    return {
      error: jsonError('Unauthorized: a valid x-api-key header is required.', 401),
      authenticated: false,
    };
  }

  return { error: null, authenticated: true };
}

// ---------------------------------------------------------------------------
// Payload validation
// ---------------------------------------------------------------------------

interface ValidationResult {
  data?: ProjectFormData;
  error?: string;
}

const VALID_STATUSES: ProjectStatus[] = ['draft', 'published'];

export function validateProjectPayload(
  body: unknown,
  { partial = false }: { partial?: boolean } = {}
): ValidationResult {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Request body must be a JSON object.' };
  }

  // Body is a plain object of unknowns — narrowed field-by-field below.
  const input = body as Record<string, unknown>;

  const data: Partial<ProjectFormData> = {};

  // --- title (required on create) ---
  if (input.title !== undefined) {
    if (typeof input.title !== 'string' || !input.title.trim()) {
      return { error: 'Field "title" must be a non-empty string.' };
    }
    data.title = input.title.trim();
  } else if (!partial) {
    return { error: 'Field "title" is required.' };
  }

  // --- slug (auto-generated from title when omitted) ---
  if (input.slug !== undefined) {
    if (typeof input.slug !== 'string') {
      return { error: 'Field "slug" must be a string.' };
    }
    const clean = slugify(input.slug);
    if (!clean) {
      return { error: 'Field "slug" does not contain any usable characters.' };
    }
    data.slug = clean;
  } else if (!partial) {
    const generated = slugify(data.title || '');
    if (!generated) {
      return { error: 'Could not generate a slug from the title — provide "slug" explicitly.' };
    }
    data.slug = generated;
  } else if (data.title && !input.slug) {
    // On partial updates, only re-generate when the caller also changes the title
    // and leaves slug untouched; otherwise keep the existing slug.
    data.slug = slugify(data.title);
  }

  // --- year ---
  const currentYear = new Date().getFullYear();
  if (input.year !== undefined) {
    const year = Number(input.year);
    if (!Number.isInteger(year) || year < 2000 || year > currentYear) {
      return { error: `Field "year" must be an integer between 2000 and ${currentYear}.` };
    }
    data.year = year;
  } else if (!partial) {
    data.year = currentYear;
  }

  // --- status ---
  if (input.status !== undefined) {
    if (!VALID_STATUSES.includes(input.status as ProjectStatus)) {
      return { error: 'Field "status" must be "draft" or "published".' };
    }
    data.status = input.status as ProjectStatus;
  } else if (!partial) {
    data.status = 'draft';
  }

  // --- optional scalar fields ---
  for (const key of ['description', 'category', 'location', 'camera_info', 'cover_image'] as const) {
    if (input[key] !== undefined) {
      if (input[key] !== null && typeof input[key] !== 'string') {
        return { error: `Field "${key}" must be a string.` };
      }
      data[key] = input[key] ?? '';
    }
  }

  if (!partial && data.description === undefined) data.description = '';

  // --- published_at (ISO date override; only meaningful when publishing) ---
  if (input.published_at !== undefined) {
    if (input.published_at !== null && typeof input.published_at !== 'string') {
      return { error: 'Field "published_at" must be an ISO-8601 date string or null.' };
    }
    const d = input.published_at ? new Date(input.published_at as string) : null;
    if (input.published_at && isNaN(d!.getTime())) {
      return { error: 'Field "published_at" is not a valid date.' };
    }
    data.published_at = d ? d.toISOString() : null;
  }

  // --- created_at (ISO date override; mainly for backdated imports) ---
  if (input.created_at !== undefined) {
    if (input.created_at !== null && typeof input.created_at !== 'string') {
      return { error: 'Field "created_at" must be an ISO-8601 date string or null.' };
    }
    const d = input.created_at ? new Date(input.created_at as string) : null;
    if (input.created_at && isNaN(d!.getTime())) {
      return { error: 'Field "created_at" is not a valid date.' };
    }
    if (d) data.created_at = d.toISOString();
  }

  // --- images ---
  if (input.images !== undefined) {
    if (!Array.isArray(input.images)) {
      return { error: 'Field "images" must be an array.' };
    }

    const images: ProjectFormData['images'] = [];
    for (let i = 0; i < input.images.length; i++) {
      const img = input.images[i];
      if (!img || typeof img !== 'object') {
        return { error: `images[${i}] must be an object.` };
      }
      if (typeof img.image_url !== 'string' || !img.image_url.trim()) {
        return { error: `images[${i}].image_url is required and must be a non-empty string.` };
      }

      const width = img.width === undefined || img.width === null ? undefined : Number(img.width);
      const height = img.height === undefined || img.height === null ? undefined : Number(img.height);
      if (width !== undefined && (!Number.isInteger(width) || width <= 0)) {
        return { error: `images[${i}].width must be a positive integer.` };
      }
      if (height !== undefined && (!Number.isInteger(height) || height <= 0)) {
        return { error: `images[${i}].height must be a positive integer.` };
      }

      images.push({
        image_url: img.image_url.trim(),
        alt_text: typeof img.alt_text === 'string' ? img.alt_text : (data.title || 'Photograph'),
        caption: typeof img.caption === 'string' ? img.caption : '',
        sort_order: i,
        width,
        height,
      });
    }
    data.images = images;
  } else if (!partial) {
    data.images = [];
  }

  // --- cover_image falls back to the first image ---
  if (!data.cover_image && data.images && data.images.length > 0) {
    data.cover_image = data.images[0].image_url;
  }

  if (!partial && (!data.images || data.images.length === 0)) {
    return { error: 'At least one image is required — pass "images": [{ "image_url": "..." }].' };
  }

  return { data: data as ProjectFormData };
}
