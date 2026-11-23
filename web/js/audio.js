// web/js/audio.js - Web Audio API procedural sound synthesizer
// Zero external sound asset dependencies. Punchy, responsive, and immediate.

class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Fast whoosh for punch / kick swings
  playWhoosh(intensity = 1.0) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140 * intensity, t);
    osc.frequency.exponentialRampToValueAtTime(320 * intensity, t + 0.05);
    osc.frequency.exponentialRampToValueAtTime(70, t + 0.16);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, t);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.25 * intensity, t + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.2);
  }

  // Heavy bone / glove impact sound
  playPunchImpact(heavy = false, critical = false) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Low punch sub-thud
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    const startFreq = heavy ? 160 : 210;
    const endFreq = heavy ? 38 : 50;
    subOsc.frequency.setValueAtTime(startFreq, t);
    subOsc.frequency.exponentialRampToValueAtTime(endFreq, t + (heavy ? 0.2 : 0.12));

    subGain.gain.setValueAtTime(heavy ? 0.6 : 0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + (heavy ? 0.24 : 0.15));

    subOsc.connect(subGain);
    subGain.connect(this.masterGain);
    subOsc.start(t);
    subOsc.stop(t + (heavy ? 0.25 : 0.16));

    // Transient slap / crack
    const bufferSize = this.ctx.sampleRate * 0.06;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.012));
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(heavy ? 900 : 1500, t);
    noiseFilter.Q.setValueAtTime(2.5, t);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(critical ? 0.5 : 0.35, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    noiseSource.start(t);

    // If critical knockout hit, add ring / sub explosion
    if (critical) {
      this.playKOShockwave();
    }
  }

  // Heavy body slam / takedown impact
  playTakedownSlam() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(25, t + 0.35);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.42);

    this.playPunchImpact(true, false);
  }

  // Stiff-arm / truck hit
  playStiffArm() {
    this.playPunchImpact(true, true);
  }

  // Trampoline acoustic boom
  playTrampolineBounce(doubleBounce = false) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const pitch = doubleBounce ? 90 : 70;
    osc.frequency.setValueAtTime(pitch, t);
    osc.frequency.exponentialRampToValueAtTime(doubleBounce ? 260 : 180, t + 0.12);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.4);

    gain.gain.setValueAtTime(doubleBounce ? 0.8 : 0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.48);
  }

  // Knockout slow-motion bass drop
  playKOShockwave() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.8);

    gain.gain.setValueAtTime(0.9, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.9);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.95);
  }

  // UFC Fight Bell Ding
  playFightBell() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    [1046.5, 2093].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(idx === 0 ? 0.4 : 0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 1.25);
    });
  }

  // Skateboard roll rumble loop (can be toggled)
  setSkateRoll(active, speedNorm = 0.5) {
    if (!this.ctx || !this.enabled) return;
    if (active) {
      if (!this.skateLoop) {
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.5;
        }

        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(280, this.ctx.currentTime);
        filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.08 * speedNorm, this.ctx.currentTime);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        source.start();
        this.skateLoop = { source, gain, filter };
      } else {
        this.skateLoop.gain.gain.setTargetAtTime(0.12 * Math.min(speedNorm, 1.0), this.ctx.currentTime, 0.05);
        this.skateLoop.filter.frequency.setTargetAtTime(200 + speedNorm * 400, this.ctx.currentTime, 0.05);
      }
    } else {
      if (this.skateLoop) {
        try {
          this.skateLoop.source.stop();
        } catch (e) {}
        this.skateLoop = null;
      }
    }
  }

  // Neighbor grunt / yell on hit
  playGrunt(pitch = 1.0) {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140 * pitch, t);
    osc.frequency.exponentialRampToValueAtTime(75 * pitch, t + 0.15);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, t);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.18);
  }
}

export const soundFX = new SoundFX();
