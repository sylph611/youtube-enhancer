/**
 * A-B Loop Module
 * 구간 반복 기능
 */

const LoopControl = {
  pointA: null,
  pointB: null,
  isLooping: false,
  loopInterval: null,

  init(video) {
    this.video = video;
    this.reset();
  },

  setPointA() {
    if (!this.video) return null;
    this.pointA = this.video.currentTime;
    return this.pointA;
  },

  setPointB() {
    if (!this.video) return null;
    if (this.pointA === null) return null;

    this.pointB = this.video.currentTime;

    // A가 B보다 크면 스왑
    if (this.pointA > this.pointB) {
      [this.pointA, this.pointB] = [this.pointB, this.pointA];
    }

    return this.pointB;
  },

  startLoop() {
    if (this.pointA === null || this.pointB === null) return false;
    if (this.isLooping) return true;

    this.isLooping = true;
    this.video.currentTime = this.pointA;

    // 루프 체크 인터벌
    this.loopInterval = setInterval(() => {
      if (!this.isLooping) return;

      if (this.video.currentTime >= this.pointB || this.video.currentTime < this.pointA) {
        this.video.currentTime = this.pointA;
      }
    }, 100);

    return true;
  },

  stopLoop() {
    this.isLooping = false;
    if (this.loopInterval) {
      clearInterval(this.loopInterval);
      this.loopInterval = null;
    }
  },

  toggle() {
    if (this.isLooping) {
      this.stopLoop();
    } else {
      this.startLoop();
    }
    return this.isLooping;
  },

  reset() {
    this.stopLoop();
    this.pointA = null;
    this.pointB = null;
  },

  getState() {
    return {
      pointA: this.pointA,
      pointB: this.pointB,
      isLooping: this.isLooping
    };
  },

  formatTime(seconds) {
    if (seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
};

window.LoopControl = LoopControl;
