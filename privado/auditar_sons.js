/* Auditoria de arquivos finais: duração, silêncio, clipping e emenda dos ambientes. */
"use strict";
const fs = require("fs"), path = require("path"), cp = require("child_process");
const root = path.resolve(__dirname,"..");
const ffmpeg = process.argv[2] || "ffmpeg";
const ffprobe = ffmpeg.replace(/ffmpeg(?:\.exe)?$/i, process.platform === "win32" ? "ffprobe.exe" : "ffprobe");
const files = [];
for (const [dir, count] of [["musica",7],["ambiente",19],["dado",10],["efeito",1]]) {
  const letter = {musica:"m",ambiente:"a",dado:"d",efeito:"e"}[dir];
  for (let i=1;i<=count;i++) files.push([dir,`${letter}${String(i).padStart(2,"0")}`]);
}
let failures=0;
for (const [dir,id] of files) {
  const file=path.join(root,"sons",dir,`${id}.mp3`);
  const probe=cp.spawnSync(ffprobe,["-v","error","-show_entries","format=duration","-of","default=noprint_wrappers=1:nokey=1",file],{encoding:"utf8"});
  if (probe.status!==0) throw Error(`ffprobe falhou: ${file}`);
  const dur=Number(probe.stdout.trim());
  const decoded=cp.spawnSync(ffmpeg,["-v","error","-i",file,"-f","f32le","-ac","1","-ar","16000","pipe:1"],{maxBuffer:32*1024*1024});
  if (decoded.status!==0) throw Error(`FFmpeg falhou: ${file}: ${decoded.stderr}`);
  const pcm=new Float32Array(decoded.stdout.buffer,decoded.stdout.byteOffset,decoded.stdout.length/4);
  let energy=0,peak=0,edgeEnergy=0;
  for(let j=0;j<pcm.length;j++) {const v=pcm[j];energy+=v*v;peak=Math.max(peak,Math.abs(v));if(j<16000||j>=pcm.length-16000)edgeEnergy+=v*v;}
  const rms=Math.sqrt(energy/pcm.length), edgeRms=Math.sqrt(edgeEnergy/32000);
  const jump=Math.abs(pcm[0]-pcm[pcm.length-1]);
  const expected=dir==="ambiente"?32:dir==="efeito"?2:dir==="dado"?1.9:null;
  const bad=!Number.isFinite(dur)||Math.abs(dur-(expected||dur))>.15||peak>.995||rms<.0003||
    (dir==="ambiente"&&jump>.035);
  if(bad) failures++;
  console.log(`${bad?"FALHA ":"OK    "}${dir}/${id} ${dur.toFixed(2)}s RMS ${(20*Math.log10(rms)).toFixed(1)}dBFS pico ${(20*Math.log10(peak)).toFixed(1)}dBFS borda ${(20*Math.log10(edgeRms)).toFixed(1)}dBFS salto ${jump.toFixed(4)}`);
}
if(failures) throw Error(`${failures} arquivos precisam de revisão`);
console.log(`${files.length} arquivos auditados.`);
