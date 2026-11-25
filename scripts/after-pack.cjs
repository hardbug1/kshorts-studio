// electron-builder afterPack: 설치판 실행 파일의 Electron 퓨즈를 끈다.
// 구매자가 `--inspect` 디버거, ELECTRON_RUN_AS_NODE, NODE_OPTIONS 로 메인 프로세스(토큰 차감·라이선스)를 건드리지 못하게 한다.
// shortcut: asar 무결성 검사(EnableEmbeddedAsarIntegrityValidation)는 Windows 에서 미검증이라 켜지 않았다. 윈도 PC에서 설치판 실행을 확인한 뒤 켤 것.
const path = require('path');
const { flipFuses, FuseVersion, FuseV1Options } = require('@electron/fuses');

module.exports = async function afterPack(context) {
  const { appOutDir, electronPlatformName, packager } = context;
  const name = packager.appInfo.productFilename;
  const exe = electronPlatformName === 'win32' ? path.join(appOutDir, `${name}.exe`)
    : electronPlatformName === 'darwin' ? path.join(appOutDir, `${name}.app`)
    : path.join(appOutDir, packager.executableName);

  await flipFuses(exe, {
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  });
  console.log(`[afterPack] Electron fuses locked: ${exe}`);
};
