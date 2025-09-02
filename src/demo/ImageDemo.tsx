import React, { useState } from 'react';
import { Image, ImageWithPlaceholder } from '../lib';
import { createResponsiveSizes, generateBlurSVG } from '../lib/utils/imageUtils';
import { Camera, Settings, Zap, Globe, Smartphone, Monitor } from 'lucide-react';

export default function ImageDemo() {
  const [selectedDemo, setSelectedDemo] = useState<'basic' | 'responsive' | 'fill' | 'placeholder'>('basic');

  const demoImages = {
    landscape: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    portrait: 'https://images.pexels.com/photos/1024981/pexels-photo-1024981.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=2',
    square: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=2',
    hero: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2',
  };

  const responsiveSizes = createResponsiveSizes({
    mobile: { breakpoint: 640, size: '100vw' },
    tablet: { breakpoint: 1024, size: '50vw' },
    desktop: { breakpoint: 1920, size: '33vw' },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vite Image Optimization</h1>
              <p className="text-gray-600 mt-1">Next.js Image component for Vite with automatic optimization</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Auto Optimization</h3>
            <p className="text-sm text-gray-600">Automatic image optimization with WebP/AVIF support and quality control</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">SEO Optimized</h3>
            <p className="text-sm text-gray-600">Proper alt tags, structured data, and preloading for better SEO performance</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Responsive</h3>
            <p className="text-sm text-gray-600">Automatic responsive images with srcSet and sizes for all devices</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Loading</h3>
            <p className="text-sm text-gray-600">Lazy loading with Intersection Observer and priority loading support</p>
          </div>
        </div>

        {/* Demo Navigation */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Interactive Demos</h2>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {[
              { key: 'basic', label: 'Basic Usage', icon: Camera },
              { key: 'responsive', label: 'Responsive Images', icon: Smartphone },
              { key: 'fill', label: 'Fill Container', icon: Monitor },
              { key: 'placeholder', label: 'Blur Placeholder', icon: Settings },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedDemo(key as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  selectedDemo === key
                    ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Demo Content */}
          <div className="bg-gray-50 rounded-lg p-6">
            {selectedDemo === 'basic' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Image Optimization</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Standard Image</h4>
                    <Image
                      src={demoImages.landscape}
                      alt="Landscape photo"
                      width={300}
                      height={200}
                      className="rounded-lg shadow-sm border"
                      unoptimized
                    />
                    <p className="text-xs text-gray-500">Unoptimized image</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Optimized Image</h4>
                    <Image
                      src={demoImages.landscape}
                      alt="Optimized landscape photo"
                      width={300}
                      height={200}
                      className="rounded-lg shadow-sm border"
                      quality={75}
                    />
                    <p className="text-xs text-gray-500">Auto-optimized with WebP/AVIF</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Priority Loading</h4>
                    <Image
                      src={demoImages.portrait}
                      alt="Priority loaded photo"
                      width={300}
                      height={400}
                      className="rounded-lg shadow-sm border"
                      priority
                      quality={85}
                    />
                    <p className="text-xs text-gray-500">Priority loading (preloaded)</p>
                  </div>
                </div>
              </div>
            )}

            {selectedDemo === 'responsive' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Responsive Images</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Responsive with Sizes</h4>
                    <Image
                      src={demoImages.hero}
                      alt="Responsive hero image"
                      width={1200}
                      height={600}
                      sizes={responsiveSizes}
                      className="w-full rounded-lg shadow-sm border"
                      quality={80}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Sizes: (max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[demoImages.landscape, demoImages.square, demoImages.portrait].map((src, index) => (
                      <div key={index} className="space-y-2">
                        <Image
                          src={src}
                          alt={`Gallery image ${index + 1}`}
                          width={400}
                          height={300}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="w-full h-48 object-cover rounded-lg shadow-sm border"
                        />
                        <p className="text-xs text-gray-500">Auto-responsive grid item</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {selectedDemo === 'fill' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Fill Container</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Card with Fill Image</h4>
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={demoImages.landscape}
                          alt="Card header image"
                          fill
                          className="hover:scale-105 transition-transform duration-300"
                          quality={80}
                        />
                      </div>
                      <div className="p-4">
                        <h5 className="font-semibold text-gray-900">Beautiful Landscape</h5>
                        <p className="text-sm text-gray-600 mt-1">Image fills the container perfectly</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Hero Section</h4>
                    <div className="relative h-64 rounded-xl overflow-hidden">
                      <Image
                        src={demoImages.hero}
                        alt="Hero background"
                        fill
                        priority
                        quality={90}
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <div className="text-center text-white">
                          <h5 className="text-2xl font-bold mb-2">Hero Content</h5>
                          <p className="text-sm opacity-90">Perfect for hero sections</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedDemo === 'placeholder' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Blur Placeholders</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[demoImages.landscape, demoImages.portrait, demoImages.square].map((src, index) => (
                    <div key={index} className="space-y-3">
                      <h4 className="font-medium text-gray-900">Image {index + 1}</h4>
                      <ImageWithPlaceholder
                        src={src}
                        alt={`Demo image ${index + 1}`}
                        width={350}
                        height={250}
                        placeholder="blur"
                        className="rounded-lg shadow-sm border"
                        quality={75}
                      />
                      <p className="text-xs text-gray-500">With blur placeholder transition</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Usage Examples</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Basic Usage</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`import { Image } from './lib';

<Image
  src="/path/to/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={true}
  quality={85}
/>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Responsive Images</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`import { Image, createResponsiveSizes } from './lib';

const responsiveSizes = createResponsiveSizes({
  mobile: { breakpoint: 640, size: '100vw' },
  tablet: { breakpoint: 1024, size: '50vw' },
  desktop: { breakpoint: 1920, size: '33vw' },
});

<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1920}
  height={1080}
  sizes={responsiveSizes}
  priority
/>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Fill Container</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`<div className="relative h-64">
  <Image
    src="/background.jpg"
    alt="Background"
    fill
    className="object-cover"
    quality={80}
  />
</div>`}
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">With Blur Placeholder</h3>
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-green-400 text-sm">
{`import { ImageWithPlaceholder } from './lib';

<ImageWithPlaceholder
  src="/photo.jpg"
  alt="Photo with blur placeholder"
  width={400}
  height={300}
  placeholder="blur"
  className="rounded-lg"
/>`}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Benefits */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Performance Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">75%</div>
              <div className="text-blue-100">Smaller file sizes with WebP/AVIF</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">50%</div>
              <div className="text-blue-100">Faster page loads with lazy loading</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Better SEO with proper optimization</div>
            </div>
          </div>
        </div>

        {/* Vite Plugin Configuration */}
        <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Vite Plugin Configuration</h2>
          <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-green-400 text-sm">
{`// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteImagePlugin } from './src/lib/vite-image-plugin';

export default defineConfig({
  plugins: [
    react(),
    viteImagePlugin({
      quality: 75,
      formats: ['webp', 'avif', 'jpeg'],
      sizes: [640, 750, 828, 1080, 1200, 1920],
      placeholder: true,
    }),
  ],
});`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}