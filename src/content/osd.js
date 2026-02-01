/**
 * OSD (On-Screen Display) Module
 * 화면에 배속 등 정보를 일시적으로 표시
 */

const OSD = {
  element: null,
  hideTimeout: null,
  DISPLAY_DURATION: 1000, // 1초 후 사라짐

  init() {
    if (this.element) return;

    this.element = document.createElement('div');
    this.element.id = 'yt-enhancer-osd';
    this.element.innerHTML = `
      <span class="yt-enhancer-osd-content"></span>
    `;
    document.body.appendChild(this.element);
  },

  show(text, type = 'speed') {
    if (!this.element) this.init();

    const content = this.element.querySelector('.yt-enhancer-osd-content');
    content.textContent = text;

    // 타입에 따른 아이콘
    this.element.className = '';
    this.element.classList.add(`yt-enhancer-osd-${type}`);

    // 표시
    this.element.classList.add('visible');

    // 기존 타이머 취소
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    // 일정 시간 후 숨김
    this.hideTimeout = setTimeout(() => {
      this.element.classList.remove('visible');
    }, this.DISPLAY_DURATION);
  },

  showSpeed(speed) {
    this.show(`${speed.toFixed(1)}x`, 'speed');
  },

  showLoop(isLooping) {
    const msgOn = chrome.i18n.getMessage('osdLoopOn') || '🔁 구간 반복 ON';
    const msgOff = chrome.i18n.getMessage('osdLoopOff') || '구간 반복 OFF';
    this.show(isLooping ? msgOn : msgOff, 'loop');
  },

  showScreenshot() {
    const msg = chrome.i18n.getMessage('osdScreenshot') || '📷 스크린샷 저장됨';
    this.show(msg, 'screenshot');
  },

  showPointA(time) {
    this.show(`A: ${this.formatTime(time)}`, 'loop');
  },

  showPointB(time) {
    this.show(`B: ${this.formatTime(time)}`, 'loop');
  },

  formatTime(seconds) {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

window.OSD = OSD;
