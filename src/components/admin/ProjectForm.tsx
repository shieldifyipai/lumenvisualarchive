'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  UploadCloud,
  X,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowLeft,
  Sparkles,
  Link2,
} from 'lucide-react';
import { Project, ProjectStatus } from '@/types/portfolio';
import { dataService } from '@/lib/data-service';
import { slugify } from '@/lib/utils/slugify';

interface FormImageItem {
  id?: string;
  image_url: string;
  alt_text: string;
  caption?: string;
  sort_order: number;
  width?: number | null;
  height?: number | null;
  file?: File;
  uploading?: boolean;
  progress?: number;
  error?: string | null;
}

interface ProjectFormProps {
  initialProject?: Project | null;
  isEdit?: boolean;
}

export default function ProjectForm({ initialProject, isEdit = false }: ProjectFormProps) {
  const router = useRouter();

  // Form Fields
  const [title, setTitle] = useState(initialProject?.title || '');
  const [slug, setSlug] = useState(initialProject?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(isEdit));
  const [year, setYear] = useState<number>(initialProject?.year || new Date().getFullYear());
  const [description, setDescription] = useState(initialProject?.description || '');
  const [category, setCategory] = useState(initialProject?.category || 'Landscape & Architecture');
  const [location, setLocation] = useState(initialProject?.location || '');
  const [cameraInfo, setCameraInfo] = useState(initialProject?.camera_info || '');
  const [status, setStatus] = useState<ProjectStatus>(initialProject?.status || 'draft');
  const [coverImage, setCoverImage] = useState(initialProject?.cover_image || '');

  // Images list
  const [images, setImages] = useState<FormImageItem[]>(
    initialProject?.images?.map((img, idx) => ({
      ...img,
      sort_order: idx,
      uploading: false,
      progress: 100,
      error: null,
    })) || []
  );

  // UI state
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlDialog, setShowUrlDialog] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug when title changes unless slug was manually edited
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!slugManuallyEdited) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setSlugManuallyEdited(true);
    setSlug(slugify(newSlug));
  };

  // Upload handler for new files
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (fileArray.length === 0) return;

    setErrorMsg(null);

    // Create temporary image items with progress 0
    const newItems: FormImageItem[] = fileArray.map((file, i) => {
      const tempUrl = URL.createObjectURL(file);
      return {
        id: `temp-${Date.now()}-${i}`,
        image_url: tempUrl,
        alt_text: file.name.replace(/\.[^/.]+$/, ''),
        caption: '',
        sort_order: images.length + i,
        file,
        uploading: true,
        progress: 15,
        error: null,
      };
    });

    setImages((prev) => [...prev, ...newItems]);

    // Automatically set cover image if none chosen yet
    if (!coverImage && newItems.length > 0) {
      setCoverImage(newItems[0].image_url);
    }

    // Process uploads
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i];
      try {
        // Upload via dataService
        const uploadResult = await dataService.uploadImageFile(item.file!);

        setImages((prev) =>
          prev.map((img) =>
            img.id === item.id
              ? {
                  ...img,
                  image_url: uploadResult.url,
                  uploading: false,
                  progress: 100,
                  error: null,
                }
              : img
          )
        );

        // Update cover image if it was pointing to temp URL
        setCoverImage((prev) => (prev === item.image_url ? uploadResult.url : prev));
      } catch (err: any) {
        console.error('File upload error:', err);
        setImages((prev) =>
          prev.map((img) =>
            img.id === item.id
              ? {
                  ...img,
                  uploading: false,
                  error: err.message || 'Image upload failed',
                }
              : img
          )
        );
      }
    }
  };

  // Retry an individual failed upload
  const handleRetryUpload = async (index: number) => {
    const target = images[index];
    if (!target.file) return;

    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, uploading: true, error: null, progress: 20 } : img))
    );

    try {
      const uploadResult = await dataService.uploadImageFile(target.file);
      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? {
                ...img,
                image_url: uploadResult.url,
                uploading: false,
                progress: 100,
                error: null,
              }
            : img
        )
      );
      setCoverImage((prev) => (prev === target.image_url ? uploadResult.url : prev));
    } catch (err: any) {
      setImages((prev) =>
        prev.map((img, i) =>
          i === index
            ? {
                ...img,
                uploading: false,
                error: err.message || 'Retry failed',
              }
            : img
        )
      );
    }
  };

  // Add photo via direct web URL
  const handleAddUrlPhoto = () => {
    if (!urlInput.trim()) return;

    const newItem: FormImageItem = {
      id: `url-${Date.now()}`,
      image_url: urlInput.trim(),
      alt_text: title || 'Photography Series',
      caption: '',
      sort_order: images.length,
      uploading: false,
      progress: 100,
      error: null,
    };

    setImages((prev) => [...prev, newItem]);
    if (!coverImage) {
      setCoverImage(newItem.image_url);
    }
    setUrlInput('');
    setShowUrlDialog(false);
  };

  // Drag and drop sorting
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    // Re-assign sort orders
    const updated = reordered.map((img, idx) => ({ ...img, sort_order: idx }));
    setImages(updated);
  };

  const removeImage = (index: number) => {
    const target = images[index];
    const filtered = images.filter((_, i) => i !== index);
    setImages(filtered);

    // If removed photo was cover, assign new cover
    if (coverImage === target.image_url) {
      setCoverImage(filtered[0]?.image_url || '');
    }
  };

  // Drag events for dropzone
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // Save / Publish form submit
  const handleSave = async (targetStatus: ProjectStatus) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (!title.trim()) {
      setErrorMsg('Please enter a project title.');
      return;
    }

    const cleanSlug = slug.trim() || slugify(title);
    if (!cleanSlug) {
      setErrorMsg('Please enter or verify the URL slug.');
      return;
    }

    // Check slug uniqueness
    const isAvailable = await dataService.checkSlugAvailable(cleanSlug, initialProject?.id);
    if (!isAvailable) {
      setErrorMsg(`URL slug "${cleanSlug}" already exists. Please choose a different slug.`);
      return;
    }

    if (images.length === 0) {
      setErrorMsg('Please add at least one photograph to this project.');
      return;
    }

    // Check if any upload is still pending or failed
    const hasUnfinishedUploads = images.some((img) => img.uploading);
    if (hasUnfinishedUploads) {
      setErrorMsg('Some images are still uploading. Please wait a moment.');
      return;
    }

    setSaving(true);

    try {
      const selectedCover = coverImage || images[0]?.image_url || '';

      const savedProject = await dataService.saveProject(
        {
          title: title.trim(),
          slug: cleanSlug,
          year,
          description: description.trim(),
          category,
          location: location.trim(),
          camera_info: cameraInfo.trim(),
          cover_image: selectedCover,
          status: targetStatus,
          images: images.map((img, idx) => ({
            id: img.id?.startsWith('temp-') ? undefined : img.id,
            image_url: img.image_url,
            alt_text: img.alt_text || title,
            caption: img.caption || '',
            sort_order: idx,
            width: img.width || 1600,
            height: img.height || 1067,
          })),
        },
        initialProject?.id
      );

      setSuccessMsg(
        targetStatus === 'published'
          ? 'Project published successfully!'
          : 'Draft saved successfully!'
      );

      // If published, redirect directly to the public project page
      if (targetStatus === 'published') {
        setTimeout(() => {
          router.push(`/project/${savedProject.slug}`);
        }, 1000);
      } else {
        setTimeout(() => {
          router.push('/admin');
        }, 1200);
      }
    } catch (err: any) {
      console.error('Failed to save project:', err);
      setErrorMsg(err.message || 'An error occurred while saving the project. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header Back & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {isEdit ? 'Edit Photography Series' : 'Create New Series'}
            </h1>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              {isEdit ? `ID: ${initialProject?.id}` : 'Add a new photography project to the archive'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            disabled={images.length === 0}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-white/15 bg-zinc-900 hover:bg-zinc-800 text-xs font-mono tracking-wider uppercase text-zinc-300 hover:text-white transition-all disabled:opacity-50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-xs font-mono tracking-wider uppercase text-amber-300 transition-all disabled:opacity-50"
          >
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs font-mono tracking-wider uppercase transition-all shadow-lg shadow-amber-400/10 active:scale-95 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>{isEdit ? 'Update & Publish' : 'Publish Project'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-3 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Form Inputs (Left) and Image Uploader (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Metadata Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-5">
            <h3 className="font-serif text-lg font-semibold text-white border-b border-white/5 pb-3">
              Basic Information
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Project Title <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Fog Over the Highlands - Ba Vi Series"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-300">
                  URL Slug <span className="text-amber-400">*</span>
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  Auto-generated, editable
                </span>
              </div>
              <div className="flex items-center rounded-xl bg-zinc-950 border border-white/10 overflow-hidden focus-within:border-amber-400 transition-all">
                <span className="px-3 text-xs font-mono text-zinc-500 bg-zinc-900 border-r border-white/5 select-none">
                  /project/
                </span>
                <input
                  type="text"
                  required
                  placeholder="fog-over-highlands"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent text-sm font-mono text-amber-200 placeholder-zinc-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Year & Category Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  Year Created
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm font-mono text-white focus:outline-none focus:border-amber-400 transition-all"
                >
                  {/* Descending: current year down to 2000 */}
                  {Array.from(
                    { length: new Date().getFullYear() - 2000 + 1 },
                    (_, i) => new Date().getFullYear() - i
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                  Genre / Category
                </label>
                <input
                  type="text"
                  placeholder="Landscape, Architecture, Portrait..."
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Description &amp; Narrative Story
              </label>
              <textarea
                rows={5}
                placeholder="Describe the mood, lighting conditions, or artistic intent behind this series..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-950 border border-white/10 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400 transition-all leading-relaxed"
              />
            </div>

            {/* Location & Camera Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hanoi, Tokyo, Lofoten"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Equipment / Optics
                </label>
                <input
                  type="text"
                  placeholder="Leica M11, Sony A7R..."
                  value={cameraInfo}
                  onChange={(e) => setCameraInfo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Status Radio */}
            <div className="pt-2 border-t border-white/5">
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-2">
                Publication Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setStatus('published')}
                  className={`p-3 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    status === 'published'
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-bold'
                      : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Published</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStatus('draft')}
                  className={`p-3 rounded-xl border text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    status === 'draft'
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                      : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-Image Drag-and-Drop Uploader & Gallery Manager */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="font-serif text-lg font-semibold text-white">
                  Photographs ({images.length})
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Drag &amp; drop files to upload • Star an image to set as cover
                </p>
              </div>

              {/* Extra button: Add image via URL */}
              <button
                type="button"
                onClick={() => setShowUrlDialog(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 bg-zinc-950 text-xs font-mono text-zinc-300 hover:text-white transition-all"
              >
                <Link2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Add via URL</span>
              </button>
            </div>

            {/* Direct URL input dialog */}
            {showUrlDialog && (
              <div className="p-4 rounded-xl bg-zinc-950 border border-white/15 space-y-3">
                <span className="text-xs font-mono text-amber-300">
                  Paste direct image URL (Unsplash, CDN, Storage URL):
                </span>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlPhoto}
                    className="px-4 py-2 rounded-lg bg-amber-400 text-zinc-950 text-xs font-mono font-bold uppercase"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlDialog(false)}
                    className="p-2 text-zinc-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
                  : 'border-white/15 bg-zinc-950/60 hover:border-white/30 hover:bg-zinc-950'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300">
                <UploadCloud className="w-6 h-6 stroke-[1.5]" />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-white">
                  Drag & drop multiple images here, or <span className="text-amber-400 underline underline-offset-4">browse files</span>
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  Supports JPG, PNG, WEBP, AVIF • Upload multiple images simultaneously
                </p>
              </div>
            </div>

            {/* Uploaded Images List with Reordering & Metadata */}
            {images.length > 0 && (
              <div className="space-y-4 pt-2">
                {images.map((img, index) => {
                  const isCover = coverImage === img.image_url;

                  return (
                    <div
                      key={img.id || index}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                        isCover
                          ? 'bg-amber-400/[0.04] border-amber-400/40 shadow-sm'
                          : 'bg-zinc-950 border-white/10'
                      }`}
                    >
                      {/* Image Thumbnail & Badges */}
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-zinc-900 flex-shrink-0 border border-white/10">
                          <Image
                            src={img.image_url}
                            alt={img.alt_text || 'Photo'}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />

                          {/* Uploading Spinner */}
                          {img.uploading && (
                            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                              <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                            </div>
                          )}
                        </div>

                        {/* Title & Caption Inputs */}
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            placeholder="Photo caption / note..."
                            value={img.caption || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImages((prev) =>
                                prev.map((item, i) => (i === index ? { ...item, caption: val } : item))
                              );
                            }}
                            className="w-full px-2.5 py-1 text-xs rounded bg-zinc-900 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                          />
                          <input
                            type="text"
                            placeholder="Alt text (accessibility)..."
                            value={img.alt_text || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setImages((prev) =>
                                prev.map((item, i) => (i === index ? { ...item, alt_text: val } : item))
                              );
                            }}
                            className="w-full px-2.5 py-1 text-[11px] rounded bg-zinc-900/60 border border-white/5 text-zinc-300 placeholder-zinc-600 focus:outline-none"
                          />

                          {/* Error & Retry */}
                          {img.error && (
                            <div className="flex items-center gap-2 text-[11px] text-red-400 pt-0.5">
                              <span>Error: {img.error}</span>
                              <button
                                type="button"
                                onClick={() => handleRetryUpload(index)}
                                className="underline font-semibold hover:text-red-300"
                              >
                                Retry
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Tools: Cover Star, Move Up/Down, Delete */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {/* Cover image toggle */}
                        <button
                          type="button"
                          onClick={() => setCoverImage(img.image_url)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            isCover
                              ? 'bg-amber-400 text-zinc-950 font-bold shadow-md shadow-amber-400/20'
                              : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                          }`}
                          title="Set as cover photo"
                        >
                          <Star className={`w-3.5 h-3.5 ${isCover ? 'fill-current' : ''}`} />
                          <span className="hidden sm:inline">
                            {isCover ? 'Cover' : 'Set Cover'}
                          </span>
                        </button>

                        {/* Move Up */}
                        <button
                          type="button"
                          onClick={() => moveImage(index, index - 1)}
                          disabled={index === 0}
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          onClick={() => moveImage(index, index + 1)}
                          disabled={index === images.length - 1}
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white border border-white/5 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete photo */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Public Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-white/15 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-900/80">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                <Eye className="w-4 h-4" />
                <span>PREVIEW MODE • {title || 'Untitled Project'}</span>
              </div>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Mock Public Page View */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-12">
              <div className="max-w-3xl">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
                  {category} • Year {year}
                </span>
                <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
                  {title || 'Project Title'}
                </h1>
                <p className="text-zinc-300 font-light leading-relaxed whitespace-pre-line">
                  {description || 'No detailed narrative provided for this collection yet.'}
                </p>
                {(location || cameraInfo) && (
                  <div className="pt-4 mt-4 border-t border-white/10 flex gap-6 text-xs font-mono text-zinc-400">
                    {location && <span>📍 {location}</span>}
                    {cameraInfo && <span>📷 {cameraInfo}</span>}
                  </div>
                )}
              </div>

              {/* Photos Gallery */}
              <div className="space-y-10">
                {images.map((photo, i) => (
                  <div
                    key={i}
                    className="rounded-2xl overflow-hidden bg-zinc-950 border border-white/10"
                  >
                    <div className="relative w-full flex items-center justify-center p-3 sm:p-5 bg-zinc-950">
                      <img
                        src={photo.image_url}
                        alt={photo.alt_text || 'Photo'}
                        className="w-auto h-auto max-w-full max-h-[80vh] object-contain mx-auto rounded-xl shadow-xl"
                      />
                    </div>
                    {(photo.caption || photo.alt_text) && (
                      <div className="p-4 bg-zinc-900/90 border-t border-white/5 text-xs text-zinc-300">
                        {photo.caption || photo.alt_text}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-white/10 bg-zinc-900/80 flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-500">
                Expected URL: /project/{slug || slugify(title)}
              </span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-medium text-xs font-mono uppercase tracking-wider hover:bg-amber-100"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
