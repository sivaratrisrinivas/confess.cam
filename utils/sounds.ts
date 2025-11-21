// Sound effects utility using Web Audio API

const createNoiseBuffer = (ctx: AudioContext) => {
  const bufferSize = ctx.sampleRate * 2; // 2 seconds of noise
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

export function playShutterSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;

    // 1. Mechanical Click (High frequency burst)
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = 1000;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.1);

    // 2. Shutter Movement (Low Thud)
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.3, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.15);
  } catch (e) {
    // Silently fail
  }
}

export function playDropSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const t = ctx.currentTime;

    // 1. Paper Slide (Whoosh) - Filtered Pink Noise-ish
    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.linearRampToValueAtTime(100, t + 0.2);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.3, t + 0.05);
    gain.gain.linearRampToValueAtTime(0, t + 0.3);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.3);

    // 2. Impact (Thud) - Delayed
    setTimeout(() => {
      const impactOsc = ctx.createOscillator();
      impactOsc.frequency.setValueAtTime(80, ctx.currentTime);
      impactOsc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 0.1);
      const impactGain = ctx.createGain();
      impactGain.gain.setValueAtTime(0.4, ctx.currentTime);
      impactGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      
      impactOsc.connect(impactGain);
      impactGain.connect(ctx.destination);
      impactOsc.start(ctx.currentTime);
      impactOsc.stop(ctx.currentTime + 0.1);
    }, 150);

  } catch (e) {
    // Silently fail
  }
}

export function playBurnSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create multiple crackles
    const crackleCount = 5;
    for (let i = 0; i < crackleCount; i++) {
      setTimeout(() => {
        const t = ctx.currentTime;
        const noise = ctx.createBufferSource();
        noise.buffer = createNoiseBuffer(ctx);
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 2000;

        const gain = ctx.createGain();
        // Randomize volume for texture
        const vol = 0.1 + Math.random() * 0.1; 
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start(t);
        noise.stop(t + 0.05);
      }, Math.random() * 200); // Random spread over 200ms
    }
  } catch (e) {
    // Silently fail
  }
}
