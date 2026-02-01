/**
 * Controls UI Module
 * 컨트롤 패널 UI 생성 및 관리
 */

const ControlsUI = {
  panel: null,
  isMinimized: false,

  create() {
    if (this.panel) return this.panel;

    this.panel = document.createElement('div');
    this.panel.id = 'yt-enhancer-panel';
    this.panel.innerHTML = `
      <div class="yt-enhancer-header">
        <span class="yt-enhancer-title">YT Enhancer</span>
        <button class="yt-enhancer-minimize" title="최소화">−</button>
      </div>
      <div class="yt-enhancer-content">
        <div class="yt-enhancer-section">
          <div class="yt-enhancer-label">속도</div>
          <div class="yt-enhancer-speed-controls">
            <button class="yt-enhancer-btn" data-action="speed-down" title="속도 감소 ([)">◀</button>
            <span class="yt-enhancer-speed-value">1.0x</span>
            <button class="yt-enhancer-btn" data-action="speed-up" title="속도 증가 (])">▶</button>
            <button class="yt-enhancer-btn yt-enhancer-btn-small" data-action="speed-reset" title="1.0x로 리셋">↺</button>
          </div>
        </div>
        <div class="yt-enhancer-section">
          <div class="yt-enhancer-label">구간 반복</div>
          <div class="yt-enhancer-loop-controls">
            <button class="yt-enhancer-btn" data-action="set-a" title="시작점 설정 (A)">A: --:--</button>
            <button class="yt-enhancer-btn" data-action="set-b" title="끝점 설정 (B)">B: --:--</button>
            <button class="yt-enhancer-btn yt-enhancer-btn-toggle" data-action="toggle-loop" title="반복 토글 (\\)">반복</button>
            <button class="yt-enhancer-btn yt-enhancer-btn-small" data-action="reset-loop" title="구간 초기화">✕</button>
          </div>
        </div>
        <div class="yt-enhancer-section">
          <button class="yt-enhancer-btn yt-enhancer-btn-full" data-action="screenshot" title="스크린샷 (S)">📷 스크린샷</button>
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
        case 'speed-down':
          this.updateSpeedDisplay(SpeedControl.decrease());
          break;
        case 'speed-up':
          this.updateSpeedDisplay(SpeedControl.increase());
          break;
        case 'speed-reset':
          this.updateSpeedDisplay(SpeedControl.reset());
          break;
        case 'set-a':
          this.updateLoopDisplay('a', LoopControl.setPointA());
          break;
        case 'set-b':
          this.updateLoopDisplay('b', LoopControl.setPointB());
          break;
        case 'toggle-loop':
          this.updateLoopToggle(LoopControl.toggle());
          break;
        case 'reset-loop':
          LoopControl.reset();
          this.resetLoopDisplay();
          break;
        case 'screenshot':
          ScreenshotControl.download();
          this.flashScreenshotButton();
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
      btn.textContent = isLooping ? '반복 중' : '반복';
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
      btnToggle.textContent = '반복';
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
