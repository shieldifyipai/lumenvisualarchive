export function slugify(text: string): string {
  if (!text) return '';

  let slug = text.toLowerCase().trim();

  // Normalize Vietnamese characters
  slug = slug
    .replace(/[áàảãạăắằẳẵặâấầẩẫậ]/g, 'a')
    .replace(/[éèẻẽẹêếềểễệ]/g, 'e')
    .replace(/[íìỉĩị]/g, 'i')
    .replace(/[óòỏõọôốồổỗộơớờởỡợ]/g, 'o')
    .replace(/[úùủũụưứừửữự]/g, 'u')
    .replace(/[ýỳỷỹỵ]/g, 'y')
    .replace(/đ/g, 'd');

  // Remove combining diacritical marks
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Replace invalid characters with hyphens
  slug = slug
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return slug;
}
