/**
 * YouTube Enhancer - Popup Script
 */

const DEFAULT_SHORTCUTS = {
  speedUp: ']',
  speedDown: '[',
  setPointA: 'a',
  setPointB: 'b',
  toggleLoop: '\\',
  screenshot: 's'
};

// 키 표시명 변환
function getKeyDisplayName(key) {
  const keyNames = {
    ' ': 'Space',
    'arrowup': '↑',
    'arrowdown': '↓',
    'arrowleft': '←',
    'arrowright': '→',
    '\\': '\\',
    '/': '/',
    '[': '[',
    ']': ']',
  };

  const lowerKey = key.toLowerCase();
  return keyNames[lowerKey] || key.toUpperCase();
}

// 단축키 표시 업데이트
function updateShortcutDisplay(shortcuts) {
  document.querySelectorAll('.shortcut-key[data-action]').forEach(el => {
    const action = el.dataset.action;
    if (shortcuts[action]) {
      el.textContent = getKeyDisplayName(shortcuts[action]);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 버전 표시
  const manifest = chrome.runtime.getManifest();
  const versionEl = document.querySelector('.version');
  if (versionEl) {
    versionEl.textContent = `v${manifest.version}`;
  }

  // 저장된 단축키 로드
  chrome.storage.sync.get(['shortcuts'], (result) => {
    const shortcuts = { ...DEFAULT_SHORTCUTS, ...result.shortcuts };
    updateShortcutDisplay(shortcuts);
  });

  // 설정 페이지 열기
  const settingsBtn = document.getElementById('openSettings');
  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  // 후원 링크 클릭 추적 (선택)
  const supportBtn = document.querySelector('.support-btn');
  if (supportBtn) {
    supportBtn.addEventListener('click', () => {
      console.log('[YT Enhancer] Support button clicked');
    });
  }
});
