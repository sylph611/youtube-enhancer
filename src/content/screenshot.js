/**
 * Screenshot Module
 * 현재 프레임 캡처 및 다운로드
 */

const ScreenshotControl = {
  init(video) {
    this.video = video;
  },

  capture() {
    if (!this.video) return null;

    const canvas = document.createElement('canvas');
    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL('image/png');
  },

  download() {
    const dataUrl = this.capture();
    if (!dataUrl) return false;

    const timestamp = this.formatTimestamp(this.video.currentTime);
    const videoTitle = this.getVideoTitle();
    const filename = `${videoTitle}_${timestamp}.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    link.click();

    return true;
  },

  formatTimestamp(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}h${mins}m${secs}s`;
    }
    return `${mins}m${secs}s`;
  },

  getVideoTitle() {
    const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer, h1.ytd-watch-metadata');
    let title = titleElement?.textContent?.trim() || 'youtube';

    // 파일명에 사용할 수 없는 문자 제거
    title = title.replace(/[<>:"/\\|?*]/g, '').substring(0, 50);

    return title;
  }
};

window.ScreenshotControl = ScreenshotControl;
