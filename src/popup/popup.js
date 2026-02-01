/**
 * YouTube Enhancer - Popup Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 버전 표시
  const manifest = chrome.runtime.getManifest();
  const versionEl = document.querySelector('.version');
  if (versionEl) {
    versionEl.textContent = `v${manifest.version}`;
  }

  // 후원 링크 클릭 추적 (선택)
  const supportBtn = document.querySelector('.support-btn');
  if (supportBtn) {
    supportBtn.addEventListener('click', () => {
      console.log('[YT Enhancer] Support button clicked');
    });
  }
});
