// Simple test to verify the library exports work correctly
import { Image, useImageLoader, generateSrcSet, createResponsiveSizes } from '../src/lib';

// Test that exports are defined
describe('Library exports', () => {
  test('Image component is exported', () => {
    expect(Image).toBeDefined();
  });

  test('useImageLoader hook is exported', () => {
    expect(useImageLoader).toBeDefined();
  });

  test('generateSrcSet utility is exported', () => {
    expect(generateSrcSet).toBeDefined();
  });

  test('createResponsiveSizes utility is exported', () => {
    expect(createResponsiveSizes).toBeDefined();
  });
});

// Test utility functions
describe('Utility functions', () => {
  test('generateSrcSet creates correct srcSet string', () => {
    const srcSet = generateSrcSet('/images/photo.jpg', [640, 1280], 'webp');
    expect(srcSet).toContain('/images/photo-640w.webp 640w');
    expect(srcSet).toContain('/images/photo-1280w.webp 1280w');
  });

  test('createResponsiveSizes creates correct sizes string', () => {
    const sizes = createResponsiveSizes({
      mobile: { breakpoint: 640, size: '100vw' },
      tablet: { breakpoint: 1024, size: '50vw' },
      desktop: { breakpoint: 1920, size: '33vw' },
    });
    
    expect(sizes).toContain('(max-width: 640px) 100vw');
    expect(sizes).toContain('(max-width: 1024px) 50vw');
    expect(sizes).toContain('33vw');
  });
});