import { useState, useEffect, useRef, useCallback } from 'react';

interface UseImageLoaderProps {
  src: string;
  srcSet?: string;
  placeholder?: string;
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  onLoad?: () => void;
  onError?: () => void;
}

interface ImageState {
  isLoading: boolean;
  isLoaded: boolean;
  hasError: boolean;
  currentSrc: string;
}

export function useImageLoader({
  src,
  srcSet,
  placeholder,
  priority = false,
  loading = 'lazy',
  onLoad,
  onError,
}: UseImageLoaderProps) {
  const [state, setState] = useState<ImageState>({
    isLoading: true,
    isLoaded: false,
    hasError: false,
    currentSrc: placeholder || '',
  });

  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const loadImage = useCallback(() => {
    if (state.isLoaded || state.hasError) return;

    const img = new Image();
    imageRef.current = img;
    
    img.onload = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isLoaded: true,
        currentSrc: src,
      }));
      onLoad?.();
    };

    img.onerror = () => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        hasError: true,
      }));
      onError?.();
    };

    img.src = src;
    if (srcSet) {
      img.srcset = srcSet;
    }
  }, [src, srcSet, state.isLoaded, state.hasError, onLoad, onError]);

  useEffect(() => {
    if (priority || loading === 'eager') {
      loadImage();
      return;
    }

    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage();
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadImage, priority, loading]);

  useEffect(() => {
    // Preload high priority images
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      if (srcSet) {
        link.setAttribute('imagesrcset', srcSet);
      }
      document.head.appendChild(link);

      return () => {
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [src, srcSet, priority]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (imageRef.current) {
        imageRef.current.onload = null;
        imageRef.current.onerror = null;
      }
    };
  }, []);

  return {
    ...state,
    imgRef,
  };
}