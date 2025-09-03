import { useState } from 'react';
import Image from './Image';
import { generateBlurSVG } from '../utils/imageUtils';

interface ImageWithPlaceholderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty' | string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  unoptimized?: boolean;
}

export default function ImageWithPlaceholder({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  placeholder = 'blur',
  fill = false,
  sizes,
  quality,
  unoptimized = false,
}: ImageWithPlaceholderProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = () => {
    setImageLoaded(true);
  };

  const handleError = () => {
    setImageError(true);
  };

  // Generate blur placeholder if needed
  const blurDataURL = placeholder === 'blur' && !fill 
    ? generateBlurSVG(width, height, '#e5e7eb')
    : typeof placeholder === 'string' && placeholder !== 'empty' 
    ? placeholder 
    : undefined;

  if (imageError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center border border-gray-300 rounded-lg ${className}`}
        style={{ 
          width: fill ? '100%' : width, 
          height: fill ? '100%' : height,
          minHeight: fill ? '200px' : undefined,
        }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 text-sm mb-2">⚠️</div>
          <span className="text-gray-500 text-xs">Image failed to load</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${!fill ? 'inline-block' : ''} ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        fill={fill}
        sizes={sizes}
        quality={quality}
        unoptimized={unoptimized}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-all duration-300 ${
          imageLoaded ? 'scale-100 opacity-100' : 'scale-105 opacity-0'
        }`}
      />
      
      {/* Loading state overlay */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
}