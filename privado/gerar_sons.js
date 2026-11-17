/* Gera os ambientes e as trilhas instrumentais originais do catálogo.
   Uso: node privado/gerar_sons.js C:/caminho/ffmpeg.exe
   Apenas ferramenta de preparo: o site reproduz os MP3 prontos, sem Node ou FFmpeg. */
"use strict";
const fs = require("fs"), os = require("os"), path = require("path"), cp = require("child_process");
const ffmpeg = process.argv[2] || "ffmpeg";
const root = path.resolve(__dirname, "..");
const sr = 44100, sec = 32, n = sr * sec, tau = Math.PI * 2;
let seed = 1;
function rand() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296 * 2 - 1; }
function tone(f, t) { return Math.sin(tau * f * t); }
function add(out, t, dur, fn) {
  const start = Math.floor(t * sr), count = Math.min(Math.floor(dur * sr), n - start);
  for (let j = 0; j < count; j++) if (start + j >= 0) out[start + j] += fn(j / sr, j / count);
}
function air(out, amount, speed) {
  let low = 0, mid = 0;
  for (let i = 0; i < n; i++) {
    const r = rand(), t = i / sr;
    low += (r - low) * .003;
    mid += (r - mid) * .035;
    out[i] += amount * (low * 3 + mid * .35) * (.8 + .2 * tone(speed, t));
  }
}
function hiss(out, amount, speed) {
  let low = 0;
  for (let i = 0; i < n; i++) {
    const r = rand(); low += (r - low) * .16;
    out[i] += amount * (r - low) * (.8 + .2 * tone(speed, i / sr));
  }
}
function rumble(out, amount, f) {
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    out[i] += amount * (tone(f, t) + .3 * tone(f * 1.997, t)) * (.75 + .25 * tone(.07, t));
  }
}
function event(out, type, t, amp) {
  if (type === "fire") {
    add(out, t, .14, (u) => amp * (rand() * .72 + tone(110, u) * .25) * Math.exp(-40 * u));
  } else if (type === "drop") {
    const f = 540 + 270 * rand();
    add(out, t, .26, (u) => amp * (tone(f - 190 * u, u) + .25 * tone(f * 1.8, u)) * Math.exp(-23 * u));
  } else if (type === "bird") {
    const f = 1400 + 400 * rand();
    add(out, t, .55, (u) => amp * tone(f + 450 * Math.sin(tau * 8 * u) + 180 * u, u) * Math.sin(Math.PI * u / .55) * (.6 + .4 * tone(17, u)));
  } else if (type === "cricket") {
    add(out, t, .6, (u) => amp * tone(4300, u) * Math.max(0, tone(28, u)) * Math.sin(Math.PI * u / .6));
  } else if (type === "step" || type === "hoof") {
    const f = type === "hoof" ? 170 : 105;
    add(out, t, .24, (u) => amp * (tone(f - 45 * u, u) * .55 + rand() * .28) * Math.exp(-20 * u));
  } else if (type === "wood") {
    add(out, t, .55, (u) => amp * (tone(140 - 70 * u, u) * .7 + tone(280 - 120 * u, u) * .2 + rand() * .1) * Math.sin(Math.PI * u / .55));
  } else if (type === "metal") {
    add(out, t, .85, (u) => amp * (tone(720, u) * .45 + tone(1031, u) * .3 + tone(1560, u) * .18 + rand() * .07) * Math.exp(-4.2 * u));
  } else if (type === "bell") {
    add(out, t, 2, (u) => amp * (tone(440, u) * .4 + tone(880.5, u) * .3 + tone(1321, u) * .14) * Math.exp(-2.6 * u));
  } else if (type === "glass") {
    add(out, t, .65, (u) => amp * (tone(1020, u) + .4 * tone(1635, u)) * Math.exp(-7 * u));
  } else if (type === "paper") {
    let soft = 0;
    add(out, t, .6, (u) => { const r = rand(); soft += (r - soft) * .2; return amp * (r - soft) * Math.sin(Math.PI * u / .6) * .35; });
  } else if (type === "chain") {
    add(out, t, .75, (u) => amp * (tone(640, u) + .6 * tone(930, u) + rand() * .3) * Math.exp(-9 * u));
  } else if (type === "rat") {
    add(out, t, .34, (u) => amp * tone(1500 + 700 * u, u) * Math.sin(Math.PI * u / .34));
  }
}
function scatter(out, type, amount, amp) {
  for (let k = 0; k < amount; k++) event(out, type, 1.8 + (k + .3 * rand()) * 28.4 / amount, amp * (.7 + .3 * rand()));
}
const scenes = [
  ["a02", "Caverna Comum", { wind:.17, drip:18, rumble:.018, f:57 }],
  ["a03", "Sala de Pedra", { wind:.08, wood:3, fire:15, rumble:.012, f:74 }],
  ["a04", "Taverna", { crowd:.18, fire:46, wood:6, glass:8, step:10 }],
  ["a05", "Pousada", { crowd:.075, fire:30, wood:5, hoof:4, wind:.04 }],
  ["a06", "Quarto de Pousada", { wind:.065, fire:9, wood:4, rain:.015 }],
  ["a07", "Estrada de Terra", { wind:.15, bird:13, hoof:10, wood:3 }],
  ["a08", "Praça do Mercado", { crowd:.22, step:28, glass:7, bird:5 }],
  ["a09", "Ferraria", { fire:68, metal:14, wood:3, rumble:.015, f:70 }],
  ["a10", "Cripta", { wind:.11, drip:9, rumble:.037, f:47, chain:3 }],
  ["a11", "Esgoto", { water:.15, drip:24, rat:6, wind:.055, rumble:.014, f:55 }],
  ["a12", "Acampamento", { fire:54, cricket:16, wind:.09, wood:3 }],
  ["a13", "Biblioteca", { wind:.025, paper:11, step:5, wood:3, rumble:.007, f:90 }],
  ["a14", "Cabana na Floresta", { wind:.11, bird:10, fire:26, wood:6, cricket:6 }],
  ["a15", "Capela", { wind:.04, bell:3, step:3, rumble:.013, f:82 }],
  ["a16", "Beco da Cidade", { rain:.075, step:12, wind:.10, wood:3, rumble:.012, f:61 }],
  ["a17", "Porão de Armazém", { wind:.045, drip:8, wood:11, step:6, rumble:.01, f:68 }],
  ["a18", "Cela de Prisão", { wind:.055, drip:12, chain:7, step:4, rumble:.014, f:49 }],
  ["a19", "Salão Nobre", { crowd:.07, fire:22, glass:8, step:5, bell:2 }]
];
function ambient(cfg) {
  const out = new Float32Array(n);
  if (cfg.wind) air(out, cfg.wind, .04);
  if (cfg.rain) hiss(out, cfg.rain, .08);
  if (cfg.water) { hiss(out, cfg.water * .32, .1); air(out, cfg.water, .17); }
  if (cfg.crowd) {
    let voice = 0;
    for (let i = 0; i < n; i++) {
      const r = rand(), t = i / sr; voice += (r - voice) * .012;
      out[i] += cfg.crowd * voice * 4 * (.6 + .2 * tone(.31, t) + .2 * tone(.47, t));
    }
  }
  if (cfg.rumble) rumble(out, cfg.rumble, cfg.f);
  for (const type of ["fire", "drop", "bird", "cricket", "step", "hoof", "wood", "metal", "bell", "glass", "paper", "chain", "rat"])
    if (cfg[type]) scatter(out, type, cfg[type], {
      fire:.09, drop:.12, bird:.035, cricket:.015, step:.095, hoof:.12, wood:.08,
      metal:.14, bell:.10, glass:.09, paper:.09, chain:.075, rat:.035
    }[type]);
  return out;
}
const themes = [
  ["m02", "aconchego", [196, 220, 246.94, 220], [0,2,4,2,1,2,4,3, 2,4,5,4,2,1,0,1]],
  ["m03", "jornada", [174.61, 196, 220, 261.63], [0,2,4,5,4,2,1,0, 2,3,5,4,2,1,0,2]],
  ["m04", "pedra", [146.83, 164.81, 174.61, 130.81], [0,1,3,2,0,1,4,3, 2,1,0,3,2,1,0,1]],
  ["m05", "sombras", [110, 116.54, 98, 103.83], [0,3,1,2,4,2,1,0, 1,2,4,3,2,1,0,1]],
  ["m06", "solene", [220, 196, 174.61, 196], [0,2,4,5,4,2,3,1, 0,2,5,4,3,2,1,0]],
  ["m07", "intriga", [130.81, 146.83, 123.47, 110], [0,1,3,4,2,1,0,3, 2,4,3,1,0,1,3,2]]
];
function music(name, roots, melody) {
  const left = new Float32Array(n), right = new Float32Array(n);
  const ratios = name === "sombras" ? [1, 1.1892, 1.4983, 1.7818, 2, 2.3784] : [1, 1.1225, 1.2599, 1.4983, 1.6818, 2];
  for (let i = 0; i < n; i++) {
    const t = i / sr, chord = Math.floor(t / 8) % 4, f = roots[chord], pulse = .78 + .22 * tone(.125, t);
    const low = .095 * (tone(f / 2, t) + .21 * tone(f, t));
    const pad = .055 * (tone(f, t) + .7 * tone(f * ratios[2], t) + .45 * tone(f * ratios[4], t)) * pulse;
    left[i] = low + pad + .015 * tone(f * 1.003, t);
    right[i] = low + pad + .015 * tone(f * .997, t);
  }
  const beat = name === "aconchego" ? .5 : name === "sombras" ? 1 : .5;
  for (let t = 0; t < sec; t += beat) {
    const chord = Math.floor(t / 8) % 4, root = roots[chord], step = Math.round(t / beat);
    const note = melody[step % melody.length], f = root * ratios[note] * (name === "sombras" ? 1 : 2);
    const amp = name === "sombras" ? .065 : name === "solene" ? .055 : .078;
    add(left, t, .68, (u) => amp * (tone(f, u) + .32 * tone(f * 2, u) + .12 * tone(f * 3, u)) * Math.exp(-5 * u));
    add(right, t + .012, .68, (u) => amp * (tone(f * 1.002, u) + .3 * tone(f * 2, u)) * Math.exp(-5 * u));
    if (name === "pedra" || name === "intriga") {
      add(left, t, .15, (u) => .045 * (rand() * .45 + tone(90, u)) * Math.exp(-25 * u));
      add(right, t, .15, (u) => .045 * (rand() * .45 + tone(90, u)) * Math.exp(-25 * u));
    }
  }
  return [left, right];
}
function wav(file, channels, type) {
  const len = n * channels.length * 2, b = Buffer.allocUnsafe(44 + len);
  b.write("RIFF", 0); b.writeUInt32LE(36 + len, 4); b.write("WAVEfmt ", 8);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(channels.length, 22);
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * channels.length * 2, 28);
  b.writeUInt16LE(channels.length * 2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(len, 40);
  let peak = 0;
  for (const ch of channels) for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(ch[i]));
  const scale = Math.min(5, (type === "musica" ? .45 : .7) / peak);
  for (let i = 0; i < n; i++) for (let c = 0; c < channels.length; c++) {
    const edge = Math.min(1, i / (sr * .12), (n - i) / (sr * .12));
    b.writeInt16LE(Math.round(Math.max(-1, Math.min(1, channels[c][i] * scale * edge)) * 32767), 44 + (i * channels.length + c) * 2);
  }
  fs.writeFileSync(file, b);
}
function encode(id, type, channels) {
  const tmp = path.join(os.tmpdir(), `grimoria-${id}-${process.pid}.wav`);
  const target = path.join(root, "sons", type, `${id}.mp3`);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  try {
    wav(tmp, channels, type);
    cp.execFileSync(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", "-i", tmp, "-ac", String(channels.length), "-ar", String(sr), "-b:a", channels.length === 2 ? "128k" : "96k", "-map_metadata", "-1", target], { stdio: "inherit" });
  } finally { if (fs.existsSync(tmp)) fs.unlinkSync(tmp); }
  console.log(id, path.basename(target), fs.statSync(target).size);
}
for (let i = 0; i < scenes.length; i++) {
  const [id, name, cfg] = scenes[i]; seed = 1000 + i * 101; encode(id, "ambiente", [ambient(cfg)]);
}
for (let i = 0; i < themes.length; i++) {
  const [id, name, roots, melody] = themes[i]; seed = 7000 + i * 101; encode(id, "musica", music(name, roots, melody));
}
