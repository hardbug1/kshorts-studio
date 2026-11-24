// 새 버전을 공개 업데이트 저장소(lsszz2100/kshorts-releases)에 올린다.
// 구매자 프로그램은 3분마다(그리고 창을 다시 볼 때) update.json 을 확인해 새 버전 알림 → 설치 파일을 받아
// SHA-256 을 확인한 뒤 설치한다. 소스 코드는 올리지 않는다(소스는 비공개 저장소).
// 사용법: npm run release   (= dist:win 빌드 후 이 스크립트)
//         node scripts/publish-release.js [--notes "변경 내용"]
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const REPO = 'lsszz2100/kshorts-releases';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = pkg.version;
const product = pkg.build?.productName || 'K-Shorts Studio';
const outDir = path.join(root, pkg.build?.directories?.output || 'release');
const exeName = `${product}-Setup-${version}.exe`;
const exePath = path.join(outDir, exeName);
const argv = process.argv;
const ai = argv.indexOf('--notes');
const notesFile = path.join(root, 'release-notes.txt');
const notes = ai >= 0 ? argv[ai + 1] : (fs.existsSync(notesFile) ? fs.readFileSync(notesFile, 'utf8').trim() : `K-Shorts Studio v${version}`);

function gh() {
  const cands = ['gh', path.join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages',
    'GitHub.cli_Microsoft.Winget.Source_8wekyb3d8bbwe', 'bin', 'gh.exe'), 'C:\\Program Files\\GitHub CLI\\gh.exe'];
  for (const c of cands) {
    try { execFileSync(c, ['--version'], { stdio: 'ignore' }); return c; } catch { /* 다음 후보 */ }
  }
  throw new Error('GitHub CLI(gh)를 찾지 못했습니다. gh auth login 을 먼저 해 주세요.');
}

if (!fs.existsSync(exePath)) {
  console.error(`[오류] 설치 파일이 없습니다: ${exePath}\n       먼저 npm run dist:win 으로 빌드하세요.`);
  process.exit(1);
}

// 관리자판(관리자 로그인 포함)이 공개 저장소에 올라가지 않게, 마지막 빌드가 구매자판인지 확인한다.
const editionMark = path.join(root, 'dist-electron', '.edition');
const edition = fs.existsSync(editionMark) ? fs.readFileSync(editionMark, 'utf8').trim() : '';
if (!edition.startsWith('buyer|')) {
  console.error(`[오류] 마지막 빌드가 구매자판이 아닙니다 (${edition || '표시 없음'}). npm run dist:win 으로 다시 빌드하세요.`);
  process.exit(1);
}
const adminLocal = path.join(root, 'admin.local.json');
const adminFnv = fs.existsSync(adminLocal) ? String(JSON.parse(fs.readFileSync(adminLocal, 'utf8')).adminKeyFnv || '') : '';
const assetsDir = path.join(root, 'dist', 'assets');
if (adminFnv && adminFnv !== '0' && fs.existsSync(assetsDir)
  && fs.readdirSync(assetsDir).some((f) => fs.readFileSync(path.join(assetsDir, f), 'utf8').includes(adminFnv))) {
  console.error('[오류] dist/assets 안에 관리자 키 검증값이 남아 있습니다. dist 폴더를 지우고 다시 빌드하세요.');
  process.exit(1);
}
const sha = crypto.createHash('sha256').update(fs.readFileSync(exePath)).digest('hex');
const shaPath = `${exePath}.sha256`;
fs.writeFileSync(shaPath, `${sha}  ${exeName}\n`, 'utf8');
// GitHub 는 올린 파일 이름의 공백을 '.' 으로 바꾼다
const assetName = exeName.replace(/ /g, '.');
const manifest = {
  version,
  notes,
  url: `https://github.com/${REPO}/releases/download/v${version}/${encodeURIComponent(assetName)}`,
  sha256: sha,
  published: new Date().toISOString(),
};
const manifestPath = path.join(outDir, 'update.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
const notesPath = path.join(outDir, `notes-${version}.md`);
fs.writeFileSync(notesPath, notes, 'utf8');

const g = gh();
console.log(`[배포] v${version} → ${REPO}`);
execFileSync(g, ['release', 'create', `v${version}`, exePath, shaPath, manifestPath, '--repo', REPO,
  '--title', `K-Shorts Studio v${version}`, '--notes-file', notesPath, '--latest'], { stdio: 'inherit' });
console.log(`배포 완료: https://github.com/${REPO}/releases/tag/v${version}`);
console.log('설치된 프로그램은 3분 안에(또는 창을 다시 볼 때) 업데이트 알림을 표시합니다.');
