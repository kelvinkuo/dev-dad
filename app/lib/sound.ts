/**
 * 时段开始 / 时段中点的提示音效，明快带节奏，约 2～3 秒，使用 Web Audio API。
 * 需在用户与页面交互后首次播放（浏览器策略）。
 */

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

/** 解锁音频（在用户交互后调用一次，以便后续自动播放） */
export function unlockAudio(): void {
  const ctx = getContext();
  if (ctx?.state === "suspended") {
    ctx.resume();
  }
}

/** 播放一个短促的明快音（单音） */
function playChime(
  ctx: AudioContext,
  startTime: number,
  freq: number,
  duration: number,
  gainLevel: number
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, startTime);
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainLevel, startTime + 0.02);
  gain.gain.setValueAtTime(gainLevel, startTime + duration - 0.03);
  gain.gain.linearRampToValueAtTime(0, startTime + duration);
  osc.start(startTime);
  osc.stop(startTime + duration);
}

/**
 * 时段开始：三声上扬的短音（哆-咪-嗦），节奏：哒·哒 哒—
 * 时段中点：两声平行的短音（嗦-嗦），节奏：哒 哒
 */
export function playBlockSound(kind: "start" | "middle"): void {
  const ctx = getContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const gainLevel = 0.2;
  const noteLen = 0.14;
  const gap = 0.18;

  if (kind === "start") {
    const startFreqs = [523.25, 659.25, 783.99]; // C5 E5 G5
    startFreqs.forEach((freq, i) => {
      const t = now + i * (noteLen + gap);
      playChime(ctx, t, freq, noteLen, gainLevel);
    });
  } else {
    const middleFreq = 587.33; // D5
    playChime(ctx, now, middleFreq, noteLen, gainLevel);
    playChime(ctx, now + noteLen + gap * 0.7, middleFreq, noteLen, gainLevel);
  }
}
