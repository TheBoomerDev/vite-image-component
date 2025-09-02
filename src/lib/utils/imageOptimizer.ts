import sharp from 'sharp';
import crypto from 'crypto';
import path from 'path';

export interface OptimizationOptions {
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
}

export interface OptimizedImageResult {
  buffer: Buffer;
  info: sharp.OutputInfo;
  placeholder: string;
  metadata: {
    width: number;
    height: number;
    format: string;
  };
}

export class ImageOptimizer {
  private cache = new Map<string, OptimizedImageResult>();

  async optimizeImage(
    inputPath: string,
    options: OptimizationOptions = {}
  ): Promise<OptimizedImageResult> {
    const cacheKey = this.generateCacheKey(inputPath, options);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const {
      quality = 75,
      format = 'webp',
      width,
      height,
      fit = 'cover',
    } = options;

    try {
      let pipeline = sharp(inputPath);
      const metadata = await pipeline.metadata();

      // Resize if dimensions provided
      if (width || height) {
        pipeline = pipeline.resize(width, height, { fit });
      }

      // Apply format and quality
      switch (format) {
        case 'webp':
          pipeline = pipeline.webp({ quality });
          break;
        case 'avif':
          pipeline = pipeline.avif({ quality });
          break;
        case 'jpeg':
          pipeline = pipeline.jpeg({ quality });
          break;
        case 'png':
          pipeline = pipeline.png({ quality });
          break;
      }

      const { data: buffer, info } = await pipeline.toBuffer({ resolveWithObject: true });

      // Generate placeholder
      const placeholder = await this.generatePlaceholder(inputPath);

      const result: OptimizedImageResult = { 
        buffer, 
        info, 
        placeholder,
        metadata: {
          width: metadata.width || 0,
          height: metadata.height || 0,
          format: metadata.format || 'unknown',
        }
      };
      
      this.cache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw error;
    }
  }

  async generatePlaceholder(inputPath: string): Promise<string> {
    try {
      const placeholderBuffer = await sharp(inputPath)
        .resize(20, 20, { fit: 'inside' })
        .blur(5)
        .jpeg({ quality: 20 })
        .toBuffer();

      return `data:image/jpeg;base64,${placeholderBuffer.toString('base64')}`;
    } catch (error) {
      console.warn('Failed to generate placeholder:', error);
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YzZjRmNiIvPgo8L3N2Zz4K';
    }
  }

  async generateResponsiveSizes(
    inputPath: string,
    sizes: number[],
    format: string = 'webp'
  ): Promise<Array<{ width: number; buffer: Buffer; filename: string; info: sharp.OutputInfo }>> {
    return Promise.all(
      sizes.map(async (size) => {
        const result = await this.optimizeImage(inputPath, {
          width: size,
          format: format as any,
        });

        const hash = this.generateCacheKey(inputPath, { width: size }).slice(0, 8);
        const basename = path.basename(inputPath, path.extname(inputPath));
        const filename = `${basename}-${hash}-${size}w.${format}`;

        return {
          width: size,
          buffer: result.buffer,
          filename,
          info: result.info,
        };
      })
    );
  }

  private generateCacheKey(inputPath: string, options: OptimizationOptions): string {
    const optionsString = JSON.stringify(options);
    return crypto
      .createHash('md5')
      .update(`${inputPath}-${optionsString}`)
      .digest('hex');
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Singleton instance
export const imageOptimizer = new ImageOptimizer();