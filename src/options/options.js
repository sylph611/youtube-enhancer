/**
 * YouTube Enhancer - Options Page Script
 * 단축키 설정 관리
 */

const DEFAULT_SHORTCUTS = {
  speedUp: ']',
  speedDown: '[',
  setPointA: 'a',
  setPointB: 'b',
  toggleLoop: '\\',
  screenshot: 's'
};

let currentShortcuts = { ...DEFAULT_SHORTCUTS };
let recordingInput = null;

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
    showToast('설정이 저장되었습니다', 'success');
  });
}

// 기본값으로 초기화
function resetToDefaults() {
  currentShortcuts = { ...DEFAULT_SHORTCUTS };
  updateInputs();
  showToast('기본값으로 초기화되었습니다');
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
  recordingInput.value = '키를 누르세요...';
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
    showToast(`이 키는 "${getActionName(duplicateAction[0])}"에서 사용 중입니다`);
    return;
  }

  currentShortcuts[action] = key;
  recordingInput.value = getKeyDisplayName(key);
  stopRecording();
}

// 액션 이름
function getActionName(action) {
  const names = {
    speedUp: '속도 증가',
    speedDown: '속도 감소',
    setPointA: '구간 시작점',
    setPointB: '구간 끝점',
    toggleLoop: '반복 토글',
    screenshot: '스크린샷'
  };
  return names[action] || action;
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
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
