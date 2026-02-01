/**
 * YouTube Enhancer - Options Page Script
 * 단축키 설정 관리
 */

const DEFAULT_SHORTCUTS = {
  speedUp: ']',
  speedDown: '[',
  speedReset: 'z',
  setPointA: 'a',
  setPointB: 'b',
  toggleLoop: '\\',
  screenshot: 's'
};

let currentShortcuts = { ...DEFAULT_SHORTCUTS };
let recordingInput = null;

// i18n 헬퍼
function getMessage(key, substitutions) {
  return chrome.i18n.getMessage(key, substitutions) || key;
}

// i18n 적용
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const message = getMessage(key);
    if (message) {
      el.textContent = message;
    }
  });
}

// 키 표시명 변환
function getKeyDisplayName(key) {
  const keyNames = {
    ' ': 'Space',
    'arrowup': '↑',
    'arrowdown': '↓',
    'arrowleft': '←',
    'arrowright': '→',
    'escape': 'Esc',
    'enter': 'Enter',
    'backspace': 'Backspace',
    'tab': 'Tab',
    'delete': 'Delete',
    '\\': '\\',
    '/': '/',
    '[': '[',
    ']': ']',
  };

  const lowerKey = key.toLowerCase();
  return keyNames[lowerKey] || key.toUpperCase();
}

// 설정 로드
function loadSettings() {
  chrome.storage.sync.get(['shortcuts'], (result) => {
    if (result.shortcuts) {
      currentShortcuts = { ...DEFAULT_SHORTCUTS, ...result.shortcuts };
    }
    updateInputs();
  });
}

// 입력 필드 업데이트
function updateInputs() {
  document.querySelectorAll('.shortcut-input').forEach(input => {
    const action = input.dataset.action;
    if (currentShortcuts[action]) {
      input.value = getKeyDisplayName(currentShortcuts[action]);
    }
  });
}

// 설정 저장
function saveSettings() {
  chrome.storage.sync.set({ shortcuts: currentShortcuts }, () => {
    showToast(getMessage('settingsSaved'), 'success');
  });
}

// 기본값으로 초기화
function resetToDefaults() {
  currentShortcuts = { ...DEFAULT_SHORTCUTS };
  updateInputs();
  showToast(getMessage('settingsReset'));
}

// 토스트 메시지
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast show ' + type;

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// 키 녹화 시작
function startRecording(input) {
  if (recordingInput) {
    recordingInput.classList.remove('recording');
  }
  recordingInput = input;
  recordingInput.classList.add('recording');
  recordingInput.value = getMessage('pressKey');
}

// 키 녹화 중지
function stopRecording() {
  if (recordingInput) {
    recordingInput.classList.remove('recording');
    recordingInput = null;
  }
}

// 키 입력 처리
function handleKeyDown(e) {
  if (!recordingInput) return;

  e.preventDefault();
  e.stopPropagation();

  // Escape는 취소
  if (e.key === 'Escape') {
    updateInputs();
    stopRecording();
    return;
  }

  // 수식키 단독은 무시
  if (['Control', 'Alt', 'Shift', 'Meta'].includes(e.key)) {
    return;
  }

  const action = recordingInput.dataset.action;
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

  // 중복 체크
  const duplicateAction = Object.entries(currentShortcuts).find(
    ([act, k]) => k === key && act !== action
  );

  if (duplicateAction) {
    const actionName = getMessage(duplicateAction[0]);
    showToast(getMessage('keyInUse', [actionName]));
    return;
  }

  currentShortcuts[action] = key;
  recordingInput.value = getKeyDisplayName(key);
  stopRecording();
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  applyI18n();
  loadSettings();

  // 입력 필드 클릭 이벤트
  document.querySelectorAll('.shortcut-input').forEach(input => {
    input.addEventListener('click', () => startRecording(input));
  });

  // 키 입력 이벤트
  document.addEventListener('keydown', handleKeyDown);

  // 다른 곳 클릭 시 녹화 취소
  document.addEventListener('click', (e) => {
    if (!e.target.classList.contains('shortcut-input')) {
      if (recordingInput) {
        updateInputs();
        stopRecording();
      }
    }
  });

  // 저장 버튼
  document.getElementById('saveBtn').addEventListener('click', saveSettings);

  // 초기화 버튼
  document.getElementById('resetBtn').addEventListener('click', resetToDefaults);
});
