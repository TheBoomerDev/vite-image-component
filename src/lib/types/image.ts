export interface ImageMetadata {
  src: string;
  width: number;
  height: number;
  format: string;
  placeholder?: string;
  srcSet?: string;
  blurDataURL?: string;
}

export interface ImageOptimizationConfig {
  quality: number;
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  sizes: number[];
  placeholder: boolean;
  cache: boolean;
}

export interface ResponsiveImageSet {
  [key: string]: {
    src: string;
    width: number;
    height: number;
  };
}

export type ImagePriority = 'high' | 'low' | 'auto';
export type ImageLoading = 'lazy' | 'eager';
export type ImagePlaceholder = 'blur' | 'empty';
export type ImageFit = 'cover' | 'contain' | 'fill' | 'inside' | 'outside';

export interface ImageComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: ImagePlaceholder;
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  loading?: ImageLoading;
  quality?: number;
  unoptimized?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export interface ImageLoaderConfig {
  src: string;
  width?: number;
  quality?: number;
}