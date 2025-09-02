export function generateSrcSet(
  baseSrc: string,
  sizes: number[],
  format: string = 'webp'
): string {
  const basePath = baseSrc.replace(/\.[^/.]+$/, '');
  
  return sizes
    .map(size => `${basePath}-${size}w.${format} ${size}w`)
    .join(', ');
}

export function generateSizes(breakpoints: Array<{ breakpoint: number; size: string }>): string {
  return breakpoints
    .map(({ breakpoint, size }, index) => {
      if (index === breakpoints.length - 1) {
        return size; // Last item doesn't need media query
      }
      return `(max-width: ${breakpoint}px) ${size}`;
    })
    .join(', ');
}

export function getOptimalFormat(): 'avif' | 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  // Check for AVIF support
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
      return 'avif';
    }
  } catch {}

  // Check for WebP support
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }
  } catch {}

  return 'jpeg';
}

export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

export function generateBlurSVG(width: number, height: number, color: string = '#f3f4f6'): string {
  const aspectRatio = calculateAspectRatio(width, height);
  const svgHeight = aspectRatio > 1 ? 20 : 20 * aspectRatio;
  const svgWidth = aspectRatio > 1 ? 20 / aspectRatio : 20;

  return `data:image/svg+xml;base64,${btoa(
    `<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>`
  )}`;
}

export interface ResponsiveImageConfig {
  mobile: { breakpoint: number; size: string };
  tablet: { breakpoint: number; size: string };
  desktop: { breakpoint: number; size: string };
}

export const defaultResponsiveConfig: ResponsiveImageConfig = {
  mobile: { breakpoint: 640, size: '100vw' },
  tablet: { breakpoint: 1024, size: '50vw' },
  desktop: { breakpoint: 1920, size: '33vw' },
};

export function createResponsiveSizes(config: ResponsiveImageConfig = defaultResponsiveConfig): string {
  return generateSizes([
    config.mobile,
    config.tablet,
    config.desktop,
  ]);
}

export function optimizeImageUrl(src: string, options: { 
  width?: number; 
  height?: number; 
  quality?: number; 
  format?: string 
} = {}): string {
  const url = new URL(src, window.location.origin);
  
  Object.entries(options).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

export function preloadImage(src: string, srcSet?: string, sizes?: string): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  
  if (srcSet) {
    link.setAttribute('imagesrcset', srcSet);
  }
  
  if (sizes) {
    link.setAttribute('imagesizes', sizes);
  }
  
  document.head.appendChild(link);
}