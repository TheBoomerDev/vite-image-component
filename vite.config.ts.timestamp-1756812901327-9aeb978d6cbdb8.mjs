// vite.config.ts
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";

// src/lib/vite-image-plugin.ts
import sharp from "file:///home/project/node_modules/sharp/lib/index.js";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
var defaultConfig = {
  quality: 75,
  formats: ["webp", "avif", "jpeg"],
  sizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  placeholder: true,
  cacheDir: ".vite/images"
};
function viteImagePlugin(config = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const imageCache = /* @__PURE__ */ new Map();
  const outputDir = "dist/images";
  return {
    name: "vite-image-optimization",
    configResolved(resolvedConfig) {
      if (resolvedConfig.command === "build") {
        fs.mkdir(path.join(process.cwd(), finalConfig.cacheDir), { recursive: true }).catch(() => {
        });
      }
    },
    async load(id) {
      if (id.includes("?optimized")) {
        const [filePath] = id.split("?");
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
      order: "post",
      async handler() {
        await fs.mkdir(outputDir, { recursive: true }).catch(() => {
        });
        console.log(`Generated ${imageCache.size} optimized images`);
      }
    }
  };
}
async function processImage(filePath, config) {
  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    const { width = 0, height = 0 } = metadata;
    const hash = crypto.createHash("md5").update(filePath + JSON.stringify(config)).digest("hex").slice(0, 8);
    const ext = path.extname(filePath);
    const basename = path.basename(filePath, ext);
    const formats = {};
    const srcSetEntries = [];
    for (const format of config.formats) {
      const formatSrc = `/images/${basename}-${hash}.${format}`;
      formats[format] = formatSrc;
    }
    const primaryFormat = config.formats[0];
    for (const size of config.sizes) {
      if (size <= width) {
        const responsiveSrc = `/images/${basename}-${hash}-${size}w.${primaryFormat}`;
        srcSetEntries.push(`${responsiveSrc} ${size}w`);
      }
    }
    let blurDataURL;
    if (config.placeholder && width && height) {
      try {
        const placeholderBuffer = await image.resize(20, Math.round(20 * height / width)).blur(5).jpeg({ quality: 20 }).toBuffer();
        blurDataURL = `data:image/jpeg;base64,${placeholderBuffer.toString("base64")}`;
      } catch (error) {
        console.warn("Failed to generate placeholder for", filePath, error);
      }
    }
    const src = formats[primaryFormat];
    const srcSet = srcSetEntries.join(", ");
    return {
      src,
      srcSet,
      placeholder: blurDataURL,
      width,
      height,
      formats,
      blurDataURL
    };
  } catch (error) {
    console.error("Failed to process image:", filePath, error);
    return {
      src: filePath,
      srcSet: "",
      width: 0,
      height: 0,
      formats: {}
    };
  }
}

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    react(),
    viteImagePlugin({
      quality: 75,
      formats: ["webp", "avif", "jpeg"],
      sizes: [640, 750, 828, 1080, 1200, 1920],
      placeholder: true
    })
  ],
  ssr: {
    external: ["sharp"]
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  },
  server: {
    fs: {
      allow: [".."]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL2xpYi92aXRlLWltYWdlLXBsdWdpbi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3Byb2plY3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcHJvamVjdC92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcbmltcG9ydCB7IHZpdGVJbWFnZVBsdWdpbiB9IGZyb20gJy4vc3JjL2xpYi92aXRlLWltYWdlLXBsdWdpbic7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICB2aXRlSW1hZ2VQbHVnaW4oe1xuICAgICAgcXVhbGl0eTogNzUsXG4gICAgICBmb3JtYXRzOiBbJ3dlYnAnLCAnYXZpZicsICdqcGVnJ10sXG4gICAgICBzaXplczogWzY0MCwgNzUwLCA4MjgsIDEwODAsIDEyMDAsIDE5MjBdLFxuICAgICAgcGxhY2Vob2xkZXI6IHRydWUsXG4gICAgfSksXG4gIF0sXG4gIHNzcjoge1xuICAgIGV4dGVybmFsOiBbJ3NoYXJwJ10sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG4gIHNlcnZlcjoge1xuICAgIGZzOiB7XG4gICAgICBhbGxvdzogWycuLiddLFxuICAgIH0sXG4gIH0sXG59KTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3Byb2plY3Qvc3JjL2xpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcHJvamVjdC9zcmMvbGliL3ZpdGUtaW1hZ2UtcGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvc3JjL2xpYi92aXRlLWltYWdlLXBsdWdpbi50c1wiO2ltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgc2hhcnAgZnJvbSAnc2hhcnAnO1xuaW1wb3J0IHsgcHJvbWlzZXMgYXMgZnMgfSBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuaW50ZXJmYWNlIEltYWdlQ29uZmlnIHtcbiAgcXVhbGl0eTogbnVtYmVyO1xuICBmb3JtYXRzOiAoJ3dlYnAnIHwgJ2F2aWYnIHwgJ2pwZWcnIHwgJ3BuZycpW107XG4gIHNpemVzOiBudW1iZXJbXTtcbiAgcGxhY2Vob2xkZXI6IGJvb2xlYW47XG4gIGNhY2hlRGlyOiBzdHJpbmc7XG59XG5cbmNvbnN0IGRlZmF1bHRDb25maWc6IEltYWdlQ29uZmlnID0ge1xuICBxdWFsaXR5OiA3NSxcbiAgZm9ybWF0czogWyd3ZWJwJywgJ2F2aWYnLCAnanBlZyddLFxuICBzaXplczogWzY0MCwgNzUwLCA4MjgsIDEwODAsIDEyMDAsIDE5MjAsIDIwNDhdLFxuICBwbGFjZWhvbGRlcjogdHJ1ZSxcbiAgY2FjaGVEaXI6ICcudml0ZS9pbWFnZXMnLFxufTtcblxuaW50ZXJmYWNlIFByb2Nlc3NlZEltYWdlIHtcbiAgc3JjOiBzdHJpbmc7XG4gIHNyY1NldDogc3RyaW5nO1xuICBwbGFjZWhvbGRlcj86IHN0cmluZztcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGZvcm1hdHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIGJsdXJEYXRhVVJMPzogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdml0ZUltYWdlUGx1Z2luKGNvbmZpZzogUGFydGlhbDxJbWFnZUNvbmZpZz4gPSB7fSk6IFBsdWdpbiB7XG4gIGNvbnN0IGZpbmFsQ29uZmlnID0geyAuLi5kZWZhdWx0Q29uZmlnLCAuLi5jb25maWcgfTtcbiAgY29uc3QgaW1hZ2VDYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBQcm9jZXNzZWRJbWFnZT4oKTtcbiAgY29uc3Qgb3V0cHV0RGlyID0gJ2Rpc3QvaW1hZ2VzJztcblxuICByZXR1cm4ge1xuICAgIG5hbWU6ICd2aXRlLWltYWdlLW9wdGltaXphdGlvbicsXG4gICAgY29uZmlnUmVzb2x2ZWQocmVzb2x2ZWRDb25maWcpIHtcbiAgICAgIC8vIEVuc3VyZSBjYWNoZSBkaXJlY3RvcnkgZXhpc3RzXG4gICAgICBpZiAocmVzb2x2ZWRDb25maWcuY29tbWFuZCA9PT0gJ2J1aWxkJykge1xuICAgICAgICBmcy5ta2RpcihwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgZmluYWxDb25maWcuY2FjaGVEaXIpLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBcbiAgICBhc3luYyBsb2FkKGlkKSB7XG4gICAgICBpZiAoaWQuaW5jbHVkZXMoJz9vcHRpbWl6ZWQnKSkge1xuICAgICAgICBjb25zdCBbZmlsZVBhdGhdID0gaWQuc3BsaXQoJz8nKTtcbiAgICAgICAgY29uc3QgYWJzb2x1dGVQYXRoID0gcGF0aC5yZXNvbHZlKGZpbGVQYXRoKTtcbiAgICAgICAgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgYXdhaXQgZnMuYWNjZXNzKGFic29sdXRlUGF0aCk7XG4gICAgICAgIH0gY2F0Y2gge1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGltYWdlQ2FjaGUuaGFzKGFic29sdXRlUGF0aCkpIHtcbiAgICAgICAgICByZXR1cm4gYGV4cG9ydCBkZWZhdWx0ICR7SlNPTi5zdHJpbmdpZnkoaW1hZ2VDYWNoZS5nZXQoYWJzb2x1dGVQYXRoKSl9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHByb2Nlc3NlZCA9IGF3YWl0IHByb2Nlc3NJbWFnZShhYnNvbHV0ZVBhdGgsIGZpbmFsQ29uZmlnKTtcbiAgICAgICAgaW1hZ2VDYWNoZS5zZXQoYWJzb2x1dGVQYXRoLCBwcm9jZXNzZWQpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGBleHBvcnQgZGVmYXVsdCAke0pTT04uc3RyaW5naWZ5KHByb2Nlc3NlZCl9YDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0sXG5cbiAgICBnZW5lcmF0ZUJ1bmRsZToge1xuICAgICAgb3JkZXI6ICdwb3N0JyxcbiAgICAgIGFzeW5jIGhhbmRsZXIoKSB7XG4gICAgICAgIC8vIEVuc3VyZSBvdXRwdXQgZGlyZWN0b3J5IGV4aXN0c1xuICAgICAgICBhd2FpdCBmcy5ta2RpcihvdXRwdXREaXIsIHsgcmVjdXJzaXZlOiB0cnVlIH0pLmNhdGNoKCgpID0+IHt9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIEluIGEgcmVhbCBpbXBsZW1lbnRhdGlvbiwgd2Ugd291bGQgY29weSBvcHRpbWl6ZWQgaW1hZ2VzIHRvIGRpc3RcbiAgICAgICAgLy8gRm9yIHRoaXMgZGVtbywgd2UnbGwgZm9jdXMgb24gdGhlIGNvbXBvbmVudCBmdW5jdGlvbmFsaXR5XG4gICAgICAgIGNvbnNvbGUubG9nKGBHZW5lcmF0ZWQgJHtpbWFnZUNhY2hlLnNpemV9IG9wdGltaXplZCBpbWFnZXNgKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gcHJvY2Vzc0ltYWdlKGZpbGVQYXRoOiBzdHJpbmcsIGNvbmZpZzogSW1hZ2VDb25maWcpOiBQcm9taXNlPFByb2Nlc3NlZEltYWdlPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgaW1hZ2UgPSBzaGFycChmaWxlUGF0aCk7XG4gICAgY29uc3QgbWV0YWRhdGEgPSBhd2FpdCBpbWFnZS5tZXRhZGF0YSgpO1xuICAgIGNvbnN0IHsgd2lkdGggPSAwLCBoZWlnaHQgPSAwIH0gPSBtZXRhZGF0YTtcbiAgICBcbiAgICBjb25zdCBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ21kNScpLnVwZGF0ZShmaWxlUGF0aCArIEpTT04uc3RyaW5naWZ5KGNvbmZpZykpLmRpZ2VzdCgnaGV4Jykuc2xpY2UoMCwgOCk7XG4gICAgY29uc3QgZXh0ID0gcGF0aC5leHRuYW1lKGZpbGVQYXRoKTtcbiAgICBjb25zdCBiYXNlbmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZVBhdGgsIGV4dCk7XG4gICAgXG4gICAgY29uc3QgZm9ybWF0czogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICAgIGNvbnN0IHNyY1NldEVudHJpZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICAvLyBHZW5lcmF0ZSBkaWZmZXJlbnQgZm9ybWF0c1xuICAgIGZvciAoY29uc3QgZm9ybWF0IG9mIGNvbmZpZy5mb3JtYXRzKSB7XG4gICAgICBjb25zdCBmb3JtYXRTcmMgPSBgL2ltYWdlcy8ke2Jhc2VuYW1lfS0ke2hhc2h9LiR7Zm9ybWF0fWA7XG4gICAgICBmb3JtYXRzW2Zvcm1hdF0gPSBmb3JtYXRTcmM7XG4gICAgfVxuXG4gICAgLy8gR2VuZXJhdGUgcmVzcG9uc2l2ZSBzaXplcyBmb3IgcHJpbWFyeSBmb3JtYXRcbiAgICBjb25zdCBwcmltYXJ5Rm9ybWF0ID0gY29uZmlnLmZvcm1hdHNbMF07XG4gICAgZm9yIChjb25zdCBzaXplIG9mIGNvbmZpZy5zaXplcykge1xuICAgICAgaWYgKHNpemUgPD0gd2lkdGgpIHtcbiAgICAgICAgY29uc3QgcmVzcG9uc2l2ZVNyYyA9IGAvaW1hZ2VzLyR7YmFzZW5hbWV9LSR7aGFzaH0tJHtzaXplfXcuJHtwcmltYXJ5Rm9ybWF0fWA7XG4gICAgICAgIHNyY1NldEVudHJpZXMucHVzaChgJHtyZXNwb25zaXZlU3JjfSAke3NpemV9d2ApO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEdlbmVyYXRlIGJsdXIgcGxhY2Vob2xkZXJcbiAgICBsZXQgYmx1ckRhdGFVUkw6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBpZiAoY29uZmlnLnBsYWNlaG9sZGVyICYmIHdpZHRoICYmIGhlaWdodCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXJCdWZmZXIgPSBhd2FpdCBpbWFnZVxuICAgICAgICAgIC5yZXNpemUoMjAsIE1hdGgucm91bmQoKDIwICogaGVpZ2h0KSAvIHdpZHRoKSlcbiAgICAgICAgICAuYmx1cig1KVxuICAgICAgICAgIC5qcGVnKHsgcXVhbGl0eTogMjAgfSlcbiAgICAgICAgICAudG9CdWZmZXIoKTtcbiAgICAgICAgXG4gICAgICAgIGJsdXJEYXRhVVJMID0gYGRhdGE6aW1hZ2UvanBlZztiYXNlNjQsJHtwbGFjZWhvbGRlckJ1ZmZlci50b1N0cmluZygnYmFzZTY0Jyl9YDtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGdlbmVyYXRlIHBsYWNlaG9sZGVyIGZvcicsIGZpbGVQYXRoLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3Qgc3JjID0gZm9ybWF0c1twcmltYXJ5Rm9ybWF0XTtcbiAgICBjb25zdCBzcmNTZXQgPSBzcmNTZXRFbnRyaWVzLmpvaW4oJywgJyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgc3JjLFxuICAgICAgc3JjU2V0LFxuICAgICAgcGxhY2Vob2xkZXI6IGJsdXJEYXRhVVJMLFxuICAgICAgd2lkdGgsXG4gICAgICBoZWlnaHQsXG4gICAgICBmb3JtYXRzLFxuICAgICAgYmx1ckRhdGFVUkwsXG4gICAgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gcHJvY2VzcyBpbWFnZTonLCBmaWxlUGF0aCwgZXJyb3IpO1xuICAgIFxuICAgIC8vIFJldHVybiBmYWxsYmFjayBkYXRhXG4gICAgcmV0dXJuIHtcbiAgICAgIHNyYzogZmlsZVBhdGgsXG4gICAgICBzcmNTZXQ6ICcnLFxuICAgICAgd2lkdGg6IDAsXG4gICAgICBoZWlnaHQ6IDAsXG4gICAgICBmb3JtYXRzOiB7fSxcbiAgICB9O1xuICB9XG59Il0sCiAgIm1hcHBpbmdzIjogIjtBQUF5TixTQUFTLG9CQUFvQjtBQUN0UCxPQUFPLFdBQVc7OztBQ0FsQixPQUFPLFdBQVc7QUFDbEIsU0FBUyxZQUFZLFVBQVU7QUFDL0IsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sWUFBWTtBQVVuQixJQUFNLGdCQUE2QjtBQUFBLEVBQ2pDLFNBQVM7QUFBQSxFQUNULFNBQVMsQ0FBQyxRQUFRLFFBQVEsTUFBTTtBQUFBLEVBQ2hDLE9BQU8sQ0FBQyxLQUFLLEtBQUssS0FBSyxNQUFNLE1BQU0sTUFBTSxJQUFJO0FBQUEsRUFDN0MsYUFBYTtBQUFBLEVBQ2IsVUFBVTtBQUNaO0FBWU8sU0FBUyxnQkFBZ0IsU0FBK0IsQ0FBQyxHQUFXO0FBQ3pFLFFBQU0sY0FBYyxFQUFFLEdBQUcsZUFBZSxHQUFHLE9BQU87QUFDbEQsUUFBTSxhQUFhLG9CQUFJLElBQTRCO0FBQ25ELFFBQU0sWUFBWTtBQUVsQixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixlQUFlLGdCQUFnQjtBQUU3QixVQUFJLGVBQWUsWUFBWSxTQUFTO0FBQ3RDLFdBQUcsTUFBTSxLQUFLLEtBQUssUUFBUSxJQUFJLEdBQUcsWUFBWSxRQUFRLEdBQUcsRUFBRSxXQUFXLEtBQUssQ0FBQyxFQUFFLE1BQU0sTUFBTTtBQUFBLFFBQUMsQ0FBQztBQUFBLE1BQzlGO0FBQUEsSUFDRjtBQUFBLElBRUEsTUFBTSxLQUFLLElBQUk7QUFDYixVQUFJLEdBQUcsU0FBUyxZQUFZLEdBQUc7QUFDN0IsY0FBTSxDQUFDLFFBQVEsSUFBSSxHQUFHLE1B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
