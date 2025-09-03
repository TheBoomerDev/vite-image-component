import React, { forwardRef, useState } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'loading'> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: 'lazy' | 'eager';
  className?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  unoptimized?: boolean;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(({
  src,
  alt,
  width,
  height,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  sizes,
  fill = false,
  loading = 'lazy',
  className = '',
  onLoad,
  onError,
  unoptimized = false,
  style,
  ...props
}, ref) => {
  const [imageError, setImageError] = useState(false);
  
  const handleLoadSuccess = () => {
    onLoad?.({} as React.SyntheticEvent<HTMLImageElement>);
  };

  const handleLoadError = () => {
    setImageError(true);
    onError?.({} as React.SyntheticEvent<HTMLImageElement>);
  };

  const { isLoading, isLoaded, hasError, currentSrc, imgRef } = useImageLoader({
    src: unoptimized ? src : `${src}?optimized`,
    placeholder: placeholder === 'blur' ? blurDataURL : undefined,
    priority,
    loading: priority ? 'eager' : loading,
    onLoad: handleLoadSuccess,
    onError: handleLoadError,
  });

  // Generate responsive srcSet if sizes provided
  // Note: Actual srcSet generation should be handled by the Vite plugin or build process
  const responsiveSrcSet = sizes && !unoptimized ? undefined : undefined;

  const imageStyles: React.CSSProperties = {
    ...style,
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
    ...(fill ? {
      position: 'absolute',
      height: '100%',
      width: '100%',
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      objectFit: 'cover',
    } : {}),
  };

  const containerStyles: React.CSSProperties = fill ? {
    position: 'relative',
    display: 'block',
    overflow: 'hidden',
  } : {};

  // Error state
  if (hasError || imageError) {
    const errorContent = (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height,
          minHeight: fill ? '200px' : undefined,
        }}
      >
        <span className="text-gray-400 text-sm">Failed to load image</span>
      </div>
    );

    return fill ? (
      <div style={containerStyles} className="relative">
        {errorContent}
      </div>
    ) : errorContent;
  }

  const imageElement = (
    <>
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && isLoading && (
        <img
          src={blurDataURL}
          alt=""
          aria-hidden="true"
          style={{
            position: fill ? 'absolute' : 'static',
            inset: fill ? 0 : undefined,
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
            objectFit: fill ? 'cover' : undefined,
            filter: 'blur(10px)',
            transform: 'scale(1.1)',
            opacity: isLoading ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      )}
      
      {/* Main image */}
      <img
        ref={ref || imgRef}
        src={currentSrc || src}
        srcSet={responsiveSrcSet}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        loading={priority ? 'eager' : loading}
        decoding="async"
        sizes={sizes}
        style={imageStyles}
        className={fill ? 'absolute inset-0 w-full h-full object-cover' : ''}
        {...props}
      />
    </>
  );

  if (fill) {
    return (
      <div className={`relative ${className}`} style={containerStyles}>
        {imageElement}
      </div>
    );
  }

  return (
    <span className={`inline-block ${className}`} style={containerStyles}>
      {imageElement}
    </span>
  );
});

Image.displayName = 'Image';

// Esta función no se usa actualmente y genera errores de importación
// Se mantiene comentada para referencia futura
/*
function generateResponsiveSrcSet(src: string, sizes: string): string {
  const basePath = src.replace(/\.[^/.]+$/, '');
  const ext = '.webp'; // Default extension for optimized images
  
  // Extract size information from sizes attribute
  const sizeBreakpoints = [640, 750, 828, 1080, 1200, 1920];
  
  return sizeBreakpoints
    .map(size => `${basePath}-${size}w${ext} ${size}w`)
    .join(', ');
}
*/

export default Image;