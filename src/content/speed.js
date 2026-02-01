/**
 * Speed Control Module
 * 0.1x 단위로 속도 조절 (0.5x ~ 3.0x)
 */

const SpeedControl = {
  MIN_SPEED: 0.5,
  MAX_SPEED: 3.0,
  STEP: 0.1,
  currentSpeed: 1.0,

  init(video) {
    this.video = video;
    this.currentSpeed = video.playbackRate;
  },

  setSpeed(speed) {
    if (!this.video) return;

    const newSpeed = Math.max(this.MIN_SPEED, Math.min(this.MAX_SPEED, speed));
    this.currentSpeed = Math.round(newSpeed * 10) / 10;
    this.video.playbackRate = this.currentSpeed;

    return this.currentSpeed;
  },

  increase() {
    return this.setSpeed(this.currentSpeed + this.STEP);
  },

  decrease() {
    return this.setSpeed(this.currentSpeed - this.STEP);
  },

  reset() {
    return this.setSpeed(1.0);
  },

  getSpeed() {
    return this.currentSpeed;
  }
};

window.SpeedControl = SpeedControl;
