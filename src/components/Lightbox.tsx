'use client';

import React, { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Info,
  Share2,
  Check,
} from 'lucide-react';
import { ProjectImage } from '@/types/portfolio';

interface LightboxProps {
  images: ProjectImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
  projectTitle?: string;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
  projectTitle,
}: LightboxProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [copied, setCopied] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const currentImage = images[currentIndex];

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation & lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'i':
        case 'I':
          setShowInfo((prev) => !prev);
          break;
        default:
          break;
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Touch swipe handling for mobile
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-between lightbox-backdrop select-none animate-in fade-in duration-200"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs sm:text-sm tracking-widest text-amber-300 font-semibold">
            {String(currentIndex + 1).padStart(2, '0')}&nbsp;/&nbsp;{String(images.length).padStart(2, '0')}
          </span>
          {projectTitle && (
            <span className="hidden sm:inline-block text-xs font-light text-zinc-400 border-l border-zinc-700 pl-3 truncate max-w-sm">
              {projectTitle}
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy photo link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-full transition-colors ${
              showInfo ? 'text-amber-300 bg-white/10' : 'text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title="Photo details (Key I)"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors hidden sm:block"
            title="Fullscreen (Key F)"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/15 transition-all ml-1"
            title="Close (Key Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-8 overflow-hidden">
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 sm:left-6 z-30 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-2 sm:right-6 z-30 p-3 sm:p-4 rounded-full bg-black/40 hover:bg-black/80 text-white/70 hover:text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Display Image */}
        <div className="relative max-h-full max-w-full flex items-center justify-center">
          <img
            src={currentImage.image_url}
            alt={currentImage.alt_text || projectTitle || 'Gallery photo'}
            className="max-h-[78vh] sm:max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded shadow-2xl transition-all duration-300"
          />
        </div>
      </div>

      {/* Bottom Information Drawer */}
      {showInfo && (
        <div className="relative z-20 px-6 py-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-center sm:text-left">
            <div>
              {currentImage.caption && (
                <p className="text-sm sm:text-base font-serif text-white font-medium">
                  {currentImage.caption}
                </p>
              )}
              {currentImage.alt_text && (
                <p className="text-xs text-zinc-400 font-light mt-0.5">
                  {currentImage.alt_text}
                </p>
              )}
            </div>
            <div className="text-[11px] font-mono text-zinc-500 whitespace-nowrap">
              Use <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">←</kbd> <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">→</kbd> to navigate • <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
