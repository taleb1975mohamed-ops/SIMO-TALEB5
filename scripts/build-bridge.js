import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/js');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

esbuild.buildSync({
  stdin: {
    contents: `
      import { Capacitor } from '@capacitor/core';
      import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
      import { Share } from '@capacitor/share';

      window.AppCapacitor = {
        Capacitor,
        Filesystem,
        Directory,
        Encoding,
        Share,
        isNative: () => {
          try {
            return typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform();
          } catch(e) {
            return false;
          }
        }
      };
      console.log('AppCapacitor bridge loaded, native:', window.AppCapacitor.isNative());
    `,
    resolveDir: process.cwd(),
  },
  bundle: true,
  outfile: 'public/js/capacitor-bridge.js',
  format: 'iife',
  minify: true
});

console.log('capacitor-bridge.js built successfully');
