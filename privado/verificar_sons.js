/* Confere se os cenários genéricos têm ambiente próprio e se o catálogo aponta para MP3 presentes. */
"use strict";
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "..");
const mestre = fs.readFileSync(path.join(__dirname, "mestre.js"), "utf8");
const catalogo = fs.readFileSync(path.join(__dirname, "sons.php"), "utf8");
const bloco = mestre.match(/var CENARIOS_GENERICOS = \[([\s\S]*?)\n\];/);
if (!bloco) throw Error("Lista de cenários não encontrada");
const nomes = [...bloco[1].matchAll(/^  \["([^"]+)"/gm)].map(x => x[1]);
const linhas = [...catalogo.matchAll(/^    '([mae]\d{2,3})' => \['tipo' => '(musica|ambiente|efeito)', 'arquivo' => '([^']+)', 'dur' => (\d+),.*?'cenarios' => \[([^\]]*)\]/gm)];
if (nomes.length !== 18 || linhas.length < 27) throw Error(`Lista incompleta: ${nomes.length} cenários, ${linhas.length} faixas`);
const ambientes = new Map();
const musicas = new Set();
for (const [, id, tipo, arquivo, dur, cenarios] of linhas) {
  const file = path.join(root, "sons", arquivo), bytes = fs.readFileSync(file);
  const mp3 = bytes.subarray(0, 3).toString() === "ID3" || (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0);
  if (bytes.length > 3_000_000 || bytes.length < 1000 || !mp3)
    throw Error(`MP3 ausente, inválido ou grande demais: ${id}`);
  if (Number(dur) !== 32 && tipo !== "efeito") throw Error(`Duração inesperada: ${id}`);
  const c = [...cenarios.matchAll(/'([^']+)'/g)].map(x => x[1]);
  if (tipo === "musica") c.forEach(x => musicas.add(x));
  if (tipo === "ambiente" && id !== "a01") {
    if (c.length !== 1 || ambientes.has(c[0])) throw Error(`Ambiente sem cenário único: ${id}`);
    ambientes.set(c[0], id);
  }
}
for (const nome of nomes) if (!ambientes.has(nome)) throw Error(`Falta ambiente: ${nome}`);
for (const nome of nomes) if (!musicas.has(nome)) throw Error(`Falta música sugerida: ${nome}`);
if (ambientes.size !== nomes.length) throw Error("Catálogo tem cenário desconhecido");
console.log(`${nomes.length} cenários com ambiente único e música sugerida; ${linhas.length} MP3 do catálogo presentes.`);
