/*
 * SNova sound engine - 100% procedural Web Audio. No files, no CDN fetches,
 * no licensing: every sound is synthesized in the browser.
 *
 *   ambient  : detuned low drones + slow LFO + airy band-passed noise
 *   sfx.hover / dock / release / click / transmit : short synth chirps
 *   scrollWhoosh(v) : looping filtered noise whose gain follows velocity
 *
 * Browsers block audio until a user gesture - SoundToggle calls unlock()
 * on the first pointer/key/wheel event. Mute ramps the master bus, so it
 * silences everything (including the ambient bed) smoothly.
 */
let ctx = null;
let master = null;
let whooshGain = null;
let whooshFilter = null;
let started = false;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.7;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/** Call once from any first user gesture. Safe to call repeatedly. */
export function unlock() {
  ensureCtx();
  if (started) return;
  started = true;
  startAmbient();
  startWhoosh();
}

export function setMuted(m) {
  if (!ctx) return;
  master.gain.cancelScheduledValues(ctx.currentTime);
  master.gain.linearRampToValueAtTime(m ? 0 : 0.7, ctx.currentTime + 0.35);
}

/* ── ambient deep-space bed ────────────────────────────────────────── */
function startAmbient() {
  const bed = ctx.createGain();
  bed.gain.value = 0.05;
  bed.connect(master);

  // two barely-detuned triangles + a soft octave sine = slow beating drone
  [
    { f: 55.0, type: "triangle", v: 0.6 },
    { f: 55.7, type: "triangle", v: 0.6 },
    { f: 110.3, type: "sine", v: 0.3 },
  ].forEach(({ f, type, v }) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    const g = ctx.createGain();
    g.gain.value = v;
    o.connect(g);
    g.connect(bed);
    o.start();
  });

  // 20-second breathing LFO on the bed
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.05;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 0.02;
  lfo.connect(lfoG);
  lfoG.connect(bed.gain);
  lfo.start();

  // airy shimmer: looping brown-ish noise through a gentle bandpass
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    d[i] = (last + 0.02 * w) / 1.02;
    last = d[i];
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  noise.loop = true;
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = 900;
  bp.Q.value = 0.6;
  const ng = ctx.createGain();
  ng.gain.value = 0.015;
  noise.connect(bp);
  bp.connect(ng);
  ng.connect(master);
  noise.start();
}

/* ── scroll whoosh (gain follows Lenis velocity) ───────────────────── */
function startWhoosh() {
  const len = ctx.sampleRate;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  whooshFilter = ctx.createBiquadFilter();
  whooshFilter.type = "lowpass";
  whooshFilter.frequency.value = 300;
  whooshGain = ctx.createGain();
  whooshGain.gain.value = 0;
  src.connect(whooshFilter);
  whooshFilter.connect(whooshGain);
  whooshGain.connect(master);
  src.start();
}

export function scrollWhoosh(velocity) {
  if (!ctx || !whooshGain) return;
  const t = Math.min(Math.abs(velocity) / 60, 1);
  const now = ctx.currentTime;
  whooshGain.gain.linearRampToValueAtTime(t * 0.11, now + 0.08);
  whooshFilter.frequency.linearRampToValueAtTime(300 + t * 1400, now + 0.08);
}

/* ── one-shot synth chirps ─────────────────────────────────────────── */
function tone({
  freq = 880,
  end = null,
  type = "sine",
  dur = 0.15,
  vol = 0.2,
  delay = 0,
}) {
  if (!ctx || !started) return;
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  o.frequency.exponentialRampToValueAtTime(Math.max(end ?? freq, 1), t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g);
  g.connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.05);
}

export const sfx = {
  hover: () => tone({ freq: 1200, end: 1500, dur: 0.08, vol: 0.05 }),
  click: () => tone({ freq: 900, end: 700, dur: 0.07, vol: 0.08 }),
  dock: () => {
    tone({ freq: 520, end: 180, type: "triangle", dur: 0.28, vol: 0.14 });
    tone({ freq: 1400, end: 2000, dur: 0.12, vol: 0.05, delay: 0.05 });
  },
  release: () =>
    tone({ freq: 300, end: 700, type: "triangle", dur: 0.2, vol: 0.09 }),
  transmit: () =>
    [660, 880, 1320].forEach((f, i) =>
      tone({ freq: f, end: f * 1.12, dur: 0.14, vol: 0.09, delay: i * 0.09 }),
    ),
};
