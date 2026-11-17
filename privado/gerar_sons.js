/* Reconstrói o catálogo a partir de gravações CC0. Uso: node privado/gerar_sons.js [ffmpeg]
   Os arquivos de origem ficam em .audio-work/; as URLs e autores estão em sons/LEIA-ME.md. */
"use strict";
const fs = require("fs"), path = require("path"), cp = require("child_process");
const root = path.resolve(__dirname, "..");
const work = path.join(root, ".audio-work");
const ffmpeg = process.argv[2] || "ffmpeg";
const rate = 32000, duration = 32, samples = rate * duration, seam = rate * 2;
const cache = new Map();
function run(args) {
  const r = cp.spawnSync(ffmpeg, args, {encoding: "utf8", maxBuffer: 1024 * 1024});
  if (r.status !== 0) throw Error(`${ffmpeg} ${args.join(" ")}\n${r.stderr}`);
}
function source(id) {
  if (cache.has(id)) return cache.get(id);
  const file = path.join(work, `${id}.mp3`);
  if (!fs.existsSync(file)) throw Error(`Falta ${file}; consulte sons/LEIA-ME.md`);
  const pcm = path.join(work, `${id}.pcm`);
  if (!fs.existsSync(pcm)) run(["-y", "-loglevel", "error", "-i", file, "-af", "highpass=f=55,lowpass=f=7800", "-ac", "1", "-ar", String(rate), "-f", "f32le", pcm]);
  const bytes = fs.readFileSync(pcm);
  const audio = new Float32Array(bytes.buffer, bytes.byteOffset, bytes.length / 4);
  let sum = 0, peak = 0;
  for (let i = 0; i < audio.length; i++) { const v = audio[i]; sum += v * v; peak = Math.max(peak, Math.abs(v)); }
  const result = {audio, rms: Math.sqrt(sum / audio.length), peak};
  cache.set(id, result); return result;
}
function loopSample(a, n) {
  // Dissolve a costura da própria gravação antes de construir o loop de 32 s.
  const overlap = Math.min(rate, Math.floor(a.length / 5));
  const period = a.length - overlap;
  const p = ((n % period) + period) % period;
  if (p >= overlap) return a[p];
  const w = p / overlap;
  return a[period + p] * (1 - w) + a[p] * w;
}
function bed(out, id, level, offset = 0) {
  const s = source(id), scale = level / Math.max(s.rms, .001), start = Math.floor(offset * rate);
  for (let i = 0; i < out.length; i++) out[i] += loopSample(s.audio, start + i) * scale;
}
function event(out, id, at, peak = .09, offset = 0, length = null) {
  const s = source(id), start = Math.floor(at * rate), src = Math.floor(offset * rate);
  const count = Math.min(length === null ? s.audio.length - src : Math.floor(length * rate), out.length - start);
  let clipPeak = 0;
  for (let i = 0; i < count; i++) clipPeak = Math.max(clipPeak, Math.abs(s.audio[src + i]));
  const scale = peak / Math.max(clipPeak, .001), fade = Math.min(Math.floor(.035 * rate), Math.floor(count / 5));
  for (let i = 0; i < count; i++) {
    const edge = Math.min(1, i / fade, (count - 1 - i) / fade);
    out[start + i] += s.audio[src + i] * scale * edge;
  }
}
function encode(out, dest, bitrate = "96k") {
  let peak = 0;
  for (let i = 0; i < out.length; i++) peak = Math.max(peak, Math.abs(out[i]));
  const gain = Math.min(1, .83 / Math.max(peak, .001));
  for (let i = 0; i < out.length; i++) out[i] *= gain;
  const pcm = path.join(work, "render.pcm");
  fs.writeFileSync(pcm, Buffer.from(out.buffer));
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  run(["-y", "-loglevel", "error", "-f", "f32le", "-ar", String(rate), "-ac", "1", "-i", pcm, "-c:a", "libmp3lame", "-b:a", bitrate, "-map_metadata", "-1", dest]);
}
const scenes = {
  a01: {beds: [[547923,.028,20]], events: [[647646,[14],.05]]},
  a02: {beds: [[392668,.042,2]], events: []},
  a03: {beds: [[392668,.013,5],[717579,.019,15]], events: [[647646,[8,25],.07]]},
  a04: {beds: [[651364,.046,4],[717579,.018,12]], events: [[842180,[11,23],.10]]},
  a05: {beds: [[539811,.037,1],[717579,.012,27]], events: [[647646,[19],.07]]},
  a06: {beds: [[829765,.015,8]], events: [[346140,[14],.12]]},
  a07: {beds: [[547923,.028,28],[737643,.030,2]], events: []},
  a08: {beds: [[545756,.044,35]], events: [[521590,[9,22],.08]]},
  a09: {beds: [[717579,.022,6]], events: [[592111,[4,17],.14,0,7]]},
  a10: {beds: [[392668,.024,8]], events: [[401622,[12,26],.085,0,4]]},
  a11: {beds: [[509174,.038,2],[392668,.012,7]], events: []},
  a12: {beds: [[717579,.033,22],[829765,.018,3]], events: []},
  a13: {beds: [[346140,.006,2]], events: [[856497,[5,17,27],.22],[346140,[11],.08,0,3]]},
  a14: {beds: [[547923,.025,44],[717579,.014,29]], events: [[346140,[12],.055,0,4]]},
  a15: {beds: [], events: [[633208,[9],.15],[856497,[24],.04]]},
  a16: {beds: [[545756,.018,80]], events: [[521590,[5,18,26],.09],[647646,[14],.06]]},
  a17: {beds: [[346140,.018,1]], events: [[647646,[7,24],.09],[521590,[17],.07]]},
  a18: {beds: [[392668,.017,10]], events: [[401622,[6,21],.11,0,5],[647646,[15],.06]]},
  a19: {beds: [[539811,.027,12],[717579,.017,32]], events: [[842180,[9,24],.09]]}
};
for (const [id, recipe] of Object.entries(scenes)) {
  const raw = new Float32Array(samples + seam);
  for (const [src, level, offset] of recipe.beds) bed(raw, src, level, offset);
  for (const [src, times, peak, offset = 0, len = null] of recipe.events)
    for (const at of times) event(raw, src, at, peak, offset, len);
  const out = new Float32Array(samples);
  out.set(raw.subarray(0, samples));
  for (let i = 0; i < seam; i++) { const w = i / seam; out[i] = raw[samples + i] * (1 - w) + out[i] * w; }
  // Um trecho de 12 ms sem salto de amostra protege a emenda em gravações de carruagem.
  const edge = Math.floor(.012 * rate);
  for (let i = 0; i < edge; i++) { const w = i / edge; out[i] *= w; out[samples - 1 - i] *= w; }
  encode(out, path.join(root, "sons", "ambiente", `${id}.mp3`));
  console.log(`ambiente/${id}`);
}
// Sete composições completas, com 2 s de folga no fim para o crossfade do player.
const music = {m01:["back_to_nature",166],m02:["homestead",146],m03:["jaunt",143],m04:["springly_sprigs",141],m05:["bells_of_winter",149],m06:["fairy_lights",159],m07:["wandering_woodlands",166]};
for (const [id,[src,seconds]] of Object.entries(music)) {
  const file = path.join(work, `${src}.mp3`), dest = path.join(root,"sons","musica",`${id}.mp3`);
  if (!fs.existsSync(file)) throw Error(`Falta ${file}`);
  run(["-y","-loglevel","error","-i",file,"-t",String(seconds),"-af","loudnorm=I=-20:TP=-2:LRA=11","-ac","2","-ar","44100","-c:a","libmp3lame","-b:a","128k","-map_metadata","-1",dest]);
  console.log(`musica/${id}`);
}
// Dados: tomadas distintas da gravação na mesa; os avisos de 20 e 1 natural
// incluem um acento curto gravado, sem os antigos alertas sintetizados.
const dice = {
  d01:[[629982,0,.68,0,.62]], d02:[[629982,.05,.82,0,1.05],[347806,.43,.32,8.35,.65]],
  d03:[[147531,.05,.75,0,.69]], d04:[[147531,0,.67,0,.69],[842180,.63,.30,0,1.2]],
  d05:[[147531,0,.58,0,.69],[521590,.57,.20,.3,.7]],
  d06:[[347806,.02,.65,.90,.65]], d07:[[347806,.03,.68,5.50,.55],[347806,.58,.48,11.50,.45]],
  d08:[[347806,.03,.68,13.98,.65],[347806,.60,.40,17.00,.52]],
  d09:[[347806,.02,.72,8.43,.58]], d10:[[347806,.02,.72,14.00,.65]]
};
for (const [id,clips] of Object.entries(dice)) {
  const out = new Float32Array(Math.ceil(1.9 * rate));
  for (const [src,at,peak,offset,len] of clips) event(out,src,at,peak,offset,len);
  encode(out,path.join(root,"sons","dado",`${id}.mp3`),"128k");
  console.log(`dado/${id}`);
}
const fx = new Float32Array(2 * rate);
event(fx,633208,.03,.3,0,1.6);
encode(fx,path.join(root,"sons","efeito","e01.mp3"),"128k");
fs.rmSync(path.join(work,"render.pcm"),{force:true});
