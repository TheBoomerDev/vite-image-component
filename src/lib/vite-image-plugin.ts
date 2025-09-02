import type { Plugin } from 'vite';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

interface ImageConfig {
  quality: number;
  formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
  sizes: number[];
  placeholder: boolean;
  cacheDir: string;
}

const defaultConfig: ImageConfig = {
  quality: 75,
  formats: ['webp', 'avif', 'jpeg'],
  sizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  placeholder: true,
  cacheDir: '.vite/images',
};

interface ProcessedImage {
  src: string;
  srcSet: string;
  placeholder?: string;
  width: number;
  height: number;
  formats: Record<string, string>;
  blurDataURL?: string;
}

export function viteImagePlugin(config: Partial<ImageConfig> = {}): Plugin {
  const finalConfig = { ...defaultConfig, ...config };
  const imageCache = new Map<string, ProcessedImage>();
  const outputDir = 'dist/images';

  return {
    name: 'vite-image-optimization',
    configResolved(resolvedConfig) {
      // Ensure cache directory exists
      if (resolvedConfig.command === 'build') {
        fs.mkdir(path.join(process.cwd(), finalConfig.cacheDir), { recursive: true }).catch(() => {});
      }
    },
    
    async load(id) {
      if (id.includes('?optimized')) {
        const [filePath] = id.split('?');
        const absolutePath = path.resolve(filePath);
        
        try {
          await fs.access(absolutePath);
        } catch {
          return null;
        }

        if (imageCache.has(absolutePath)) {
          return `export default ${JSON.stringify(imageCache.get(absolutePath))}`;
        }

        const processed = await processImage(absolutePath, finalConfig);
        imageCache.set(absolutePath, processed);
        
        return `export default ${JSON.stringify(processed)}`;
      }
      return null;
    },

    generateBundle: {
      order: 'post',
      async handler() {
        // Ensure output directory exists
        await fs.mkdir(outputDir, { recursive: true }).catch(() => {});
        
        // In a real implementation, we would copy optimized images to dist
        // For this demo, we'll focus on the component functionality
        console.log(`Generated ${imageCache.size} optimized images`);
      },
    },
  };
}

async function processImage(filePath: string, config: ImageConfig): Promise<ProcessedImage> {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const { width = 0, height = 0 } = metadata;
    
    const hash = crypto.createHash('md5').update(filePath + JSON.stringify(config)).digest('hex').slice(0, 8);
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);
    
    const formats: Record<string, string> = {};
    const srcSetEntries: string[] = [];

    // Generate different formats
    for (const format of config.formats) {
      const formatSrc = `/images/${basename}-${hash}.${format}`;
      formats[format] = formatSrc;
    }

    // Generate responsive sizes for primary format
    const primaryFormat = config.formats[0];
    for (const size of config.sizes) {
      if (size <= width) {
        const responsiveSrc = `/images/${basename}-${hash}-${size}w.${primaryFormat}`;
        srcSetEntries.push(`${responsiveSrc} ${size}w`);
      }
    }

    // Generate blur placeholder
    let blurDataURL: string | undefined;
    if (config.placeholder && width && height) {
      try {
        const placeholderBuffer = await image
          .resize(20, Math.round((20 * height) / width))
          .blur(5)
          .jpeg({ quality: 20 })
          .toBuffer();
        
        blurDataURL = `data:image/jpeg;base64,${placeholderBuffer.toString('base64')}`;
      } catch (error) {
        console.warn('Failed to generate placeholder for', filePath, error);
      }
    }

    const src = formats[primaryFormat];
    const srcSet = srcSetEntries.join(', ');

    return {
      src,
      srcSet,
      placeholder: blurDataURL,
      width,
      height,
      formats,
      blurDataURL,
    };
  } catch (error) {
    console.error('Failed to process image:', filePath, error);
    
    // Return fallback data
    return {
      src: filePath,
      srcSet: '',
      width: 0,
      height: 0,
      formats: {},
    };
  }
}