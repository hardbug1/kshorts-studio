import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf-8'));
const isBuyerBuild = process.env.KSHORTS_EDITION === 'buyer';

// 관리자 키 검증값(FNV-1a 32비트). 저장소에는 올리지 않는 admin.local.json 또는 환경 변수에서만 읽는다.
function readAdminKeyFnv(): number {
  if (isBuyerBuild) return 0;
  const fromEnv = Number(process.env.KSHORTS_ADMIN_FNV || 0);
  if (fromEnv > 0) return fromEnv >>> 0;
  try {
    const local = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'admin.local.json'), 'utf-8'));
    const v = Number(local?.adminKeyFnv || 0);
    return v > 0 ? v >>> 0 : 0;
  } catch {
    return 0;
  }
}

export default defineConfig({
  plugins: [react()],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version || '1.4.0'),
    // 구매자 배포 빌드(KSHORTS_EDITION=buyer)에서는 관리자 로그인/라이선스 발급 화면과 코드가 번들에서 제거된다.
    __BUYER_BUILD__: JSON.stringify(isBuyerBuild),
    __ADMIN_KEY_FNV__: JSON.stringify(readAdminKeyFnv()),
  },
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true, // 이전 빌드(관리자판) 파일이 남아 구매자 설치 파일에 섞여 들어가지 않게 매번 비운다. public/은 빌드마다 다시 복사된다.
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },
});

