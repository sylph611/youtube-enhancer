/**
 * YouTube Enhancer - Main Entry Point
 * 메인 초기화 및 단축키 처리
 */

(function() {
  'use strict';

  let video = null;
  let initialized = false;

  // 기본 단축키 설정
  const DEFAULT_SHORTCUTS = {
    speedUp: ']',
    speedDown: '[',
    speedReset: 'z',
    setPointA: 'a',
    setPointB: 'b',
    toggleLoop: '\\',
    screenshot: 's'
  };

  let shortcuts = { ...DEFAULT_SHORTCUTS };

  // 설정 로드
  function loadSettings() {
    chrome.storage.sync.get(['shortcuts'], (result) => {
      if (result.shortcuts) {
        shortcuts = { ...DEFAULT_SHORTCUTS, ...result.shortcuts };
      }
    });
  }

  // 비디오 엘리먼트 찾기
  function findVideo() {
    return document.querySelector('video.html5-main-video');
  }

  // 컨트롤 패널 삽입 위치 찾기
  function findControlsContainer() {
    // 영상 플레이어 아래 컨트롤 영역
    return document.querySelector('#below-player-buttons') ||
           document.querySelector('#info-contents') ||
           document.querySelector('#secondary-inner');
  }

  // 초기화
  function initialize() {
    video = findVideo();
    if (!video) return;

    // 모듈 초기화
    OSD.init();
    SpeedControl.init(video);
    LoopControl.init(video);
    ScreenshotControl.init(video);

    // UI 생성 및 삽입
    const panel = ControlsUI.create();
    const container = findControlsContainer();

    if (container) {
      // 기존 패널 제거 후 삽입
      const existingPanel = document.getElementById('yt-enhancer-panel');
      if (existingPanel) {
        existingPanel.remove();
      }
      container.insertBefore(panel, container.firstChild);
    }

    initialized = true;
    console.log('[YT Enhancer] Initialized');
  }

  // 단축키 처리
  function handleKeydown(e) {
    // 입력 필드에서는 무시
    if (e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable) {
      return;
    }

    const key = e.key.toLowerCase();

    switch (key) {
      case shortcuts.speedUp:
        e.preventDefault();
        const increasedSpeed = SpeedControl.increase();
        ControlsUI.updateSpeedDisplay(increasedSpeed);
        OSD.showSpeed(increasedSpeed);
        break;

      case shortcuts.speedDown:
        e.preventDefault();
        const decreasedSpeed = SpeedControl.decrease();
        ControlsUI.updateSpeedDisplay(decreasedSpeed);
        OSD.showSpeed(decreasedSpeed);
        break;

      case shortcuts.speedReset:
        e.preventDefault();
        const resetSpeed = SpeedControl.reset();
        ControlsUI.updateSpeedDisplay(resetSpeed);
        OSD.showSpeed(resetSpeed);
        break;

      case shortcuts.setPointA:
        e.preventDefault();
        const pointA = LoopControl.setPointA();
        ControlsUI.updateLoopDisplay('a', pointA);
        OSD.showPointA(pointA);
        break;

      case shortcuts.setPointB:
        e.preventDefault();
        const pointB = LoopControl.setPointB();
        ControlsUI.updateLoopDisplay('b', pointB);
        OSD.showPointB(pointB);
        break;

      case shortcuts.toggleLoop:
        e.preventDefault();
        const isLooping = LoopControl.toggle();
        ControlsUI.updateLoopToggle(isLooping);
        OSD.showLoop(isLooping);
        break;

      case shortcuts.screenshot:
        e.preventDefault();
        ScreenshotControl.download();
        ControlsUI.flashScreenshotButton();
        OSD.showScreenshot();
        break;
    }
  }

  // 페이지 변경 감지 (YouTube SPA)
  function observePageChanges() {
    let lastUrl = location.href;

    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        // URL 변경 시 재초기화
        setTimeout(() => {
          if (location.pathname === '/watch') {
            initialize();
          }
        }, 1000);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 비디오 로드 대기
  function waitForVideo() {
    const checkInterval = setInterval(() => {
      const video = findVideo();
      if (video && video.readyState >= 2) {
        clearInterval(checkInterval);
        initialize();
      }
    }, 500);

    // 최대 30초 대기
    setTimeout(() => clearInterval(checkInterval), 30000);
  }

  // 시작
  function start() {
    loadSettings();
    document.addEventListener('keydown', handleKeydown);
    observePageChanges();

    if (location.pathname === '/watch') {
      waitForVideo();
    }
  }

  // DOM 준비 후 시작
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
