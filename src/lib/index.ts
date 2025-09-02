// Main exports
export { default as Image } from './components/Image';
export { default as ImageWithPlaceholder } from './components/ImageWithPlaceholder';
export { useImageLoader } from './hooks/useImageLoader';

// Utils exports (excluding server-side utilities)
export { generateSrcSet, generateSizes } from './utils/imageUtils';

// Types exports
export * from './types/image';