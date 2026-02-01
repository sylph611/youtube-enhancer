/**
 * Controls UI Module
 * 컨트롤 패널 UI 생성 및 관리
 */

const ControlsUI = {
  panel: null,
  isMinimized: false,

  create() {
    if (this.panel) return this.panel;

    // i18n 헬퍼
    const msg = (key, fallback) => chrome.i18n.getMessage(key) || fallback;

    this.panel = document.createElement('div');
    this.panel.id = 'yt-enhancer-panel';
    this.panel.innerHTML = `
      <div class="yt-enhancer-header">
        <span class="yt-enhancer-title">${msg('panelTitle', 'YT Enhancer')}</span>
        <button class="yt-enhancer-minimize" title="${msg('minimize', '최소화')}">−</button>
      </div>
      <div class="yt-enhancer-content">
        <div class="yt-enhancer-section">
          <div class="yt-enhancer-label">${msg('speed', '속도')}</div>
          <div class="yt-enhancer-speed-controls">
            <button class="yt-enhancer-btn" data-action="speed-down" title="${msg('speedDown', '속도 감소')} ([)">◀</button>
            <span class="yt-enhancer-speed-value">1.0x</span>
            <button class="yt-enhancer-btn" data-action="speed-up" title="${msg('speedUp', '속도 증가')} (])">▶</button>
            <button class="yt-enhancer-btn yt-enhancer-btn-small" data-action="speed-reset" title="${msg('speedReset', '1배속으로')}">↺</button>
          </div>
        </div>
        <div class="yt-enhancer-section">
          <div class="yt-enhancer-label">${msg('loop', '구간 반복')}</div>
          <div class="yt-enhancer-loop-controls">
            <button class="yt-enhancer-btn" data-action="set-a" title="${msg('setPointA', '구간 시작')} (A)">A: --:--</button>
            <button class="yt-enhancer-btn" data-action="set-b" title="${msg('setPointB', '구간 끝')} (B)">B: --:--</button>
            <button class="yt-enhancer-btn yt-enhancer-btn-toggle" data-action="toggle-loop" title="${msg('toggleLoop', '반복 토글')} (\\)">${msg('loopOff', '반복')}</button>
            <button class="yt-enhancer-btn yt-enhancer-btn-small" data-action="reset-loop" title="Reset">✕</button>
          </div>
        </div>
        <div class="yt-enhancer-section">
          <button class="yt-enhancer-btn yt-enhancer-btn-full" data-action="screenshot" title="${msg('screenshot', '스크린샷')} (S)">📷 ${msg('screenshot', '스크린샷')}</button>
        </div>
      </div>
    `;

    this.attachEvents();
    return this.panel;
  },

  attachEvents() {
    // 최소화 버튼
    this.panel.querySelector('.yt-enhancer-minimize').addEventListener('click', () => {
      this.toggleMinimize();
    });

    // 액션 버튼들
    this.panel.addEventListener('click', (e) => {
      const action = e.target.dataset.action;
      if (!action) return;

      switch (action) {
        case 'speed-down': {
          const speed = SpeedControl.decrease();
          this.updateSpeedDisplay(speed);
          OSD.showSpeed(speed);
          break;
        }
        case 'speed-up': {
          const speed = SpeedControl.increase();
          this.updateSpeedDisplay(speed);
          OSD.showSpeed(speed);
          break;
        }
        case 'speed-reset': {
          const speed = SpeedControl.reset();
          this.updateSpeedDisplay(speed);
          OSD.showSpeed(speed);
          break;
        }
        case 'set-a': {
          const point = LoopControl.setPointA();
          this.updateLoopDisplay('a', point);
          OSD.showPointA(point);
          break;
        }
        case 'set-b': {
          const point = LoopControl.setPointB();
          this.updateLoopDisplay('b', point);
          OSD.showPointB(point);
          break;
        }
        case 'toggle-loop': {
          const isLooping = LoopControl.toggle();
          this.updateLoopToggle(isLooping);
          OSD.showLoop(isLooping);
          break;
        }
        case 'reset-loop':
          LoopControl.reset();
          this.resetLoopDisplay();
          break;
        case 'screenshot':
          ScreenshotControl.download();
          this.flashScreenshotButton();
          OSD.showScreenshot();
          break;
      }
    });
  },

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    this.panel.classList.toggle('minimized', this.isMinimized);
    this.panel.querySelector('.yt-enhancer-minimize').textContent = this.isMinimized ? '+' : '−';
  },

  updateSpeedDisplay(speed) {
    const display = this.panel.querySelector('.yt-enhancer-speed-value');
    if (display) {
      display.textContent = `${speed.toFixed(1)}x`;
    }
  },

  updateLoopDisplay(point, time) {
    const btn = this.panel.querySelector(`[data-action="set-${point}"]`);
    if (btn && time !== null) {
      btn.textContent = `${point.toUpperCase()}: ${LoopControl.formatTime(time)}`;
      btn.classList.add('active');
    }
  },

  updateLoopToggle(isLooping) {
    const btn = this.panel.querySelector('[data-action="toggle-loop"]');
    if (btn) {
      btn.classList.toggle('active', isLooping);
      const msgOn = chrome.i18n.getMessage('loopOn') || '반복 중';
      const msgOff = chrome.i18n.getMessage('loopOff') || '반복';
      btn.textContent = isLooping ? msgOn : msgOff;
    }
  },

  resetLoopDisplay() {
    const btnA = this.panel.querySelector('[data-action="set-a"]');
    const btnB = this.panel.querySelector('[data-action="set-b"]');
    const btnToggle = this.panel.querySelector('[data-action="toggle-loop"]');

    if (btnA) {
      btnA.textContent = 'A: --:--';
      btnA.classList.remove('active');
    }
    if (btnB) {
      btnB.textContent = 'B: --:--';
      btnB.classList.remove('active');
    }
    if (btnToggle) {
      const msgOff = chrome.i18n.getMessage('loopOff') || '반복';
      btnToggle.textContent = msgOff;
      btnToggle.classList.remove('active');
    }
  },

  flashScreenshotButton() {
    const btn = this.panel.querySelector('[data-action="screenshot"]');
    if (btn) {
      btn.classList.add('flash');
      setTimeout(() => btn.classList.remove('flash'), 300);
    }
  },

  insert(container) {
    if (!container || this.panel.parentNode) return;
    container.appendChild(this.panel);
  },

  remove() {
    if (this.panel && this.panel.parentNode) {
      this.panel.parentNode.removeChild(this.panel);
    }
  }
};

window.ControlsUI = ControlsUI;
