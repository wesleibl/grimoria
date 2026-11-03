"use strict";

/* ============================ DADOS ============================ */

var ATTR = {
  poder: { nome: "Poder", cor: "var(--poder)" },
  destreza: { nome: "Destreza", cor: "var(--destreza)" },
  inteligencia: { nome: "Inteligência", cor: "var(--inteligencia)" }
};

function extras(o, e) { if (e) { for (var k in e) { if (Object.prototype.hasOwnProperty.call(e, k)) o[k] = e[k]; } } return o; }
function sp(nome, custo, tipo, texto, e) { return extras({ nome: nome, custo: custo, tipo: tipo, texto: texto }, e); }
function fu(marco, nome, custo, tipo, texto, e) { return extras({ marco: marco, nome: nome, custo: custo, tipo: tipo, texto: texto }, e); }
function dotRes(attr, cd) { return "Lembrete: a cada turno do alvo, role resistência (" + attr + " contra " + cd + "). Se passar, ele evita o dano desse turno."; }
function dotSem() { return "Lembrete: este dano contínuo não pode ser resistido. Ele acontece todo turno."; }

var ABREV = { "Inteligência": "INT", "Poder": "POD", "Destreza": "DES" };
function numerico(t) {
  return t.replace(/\b(\d*)d(\d+)\b/g, function (m, n, f) {
    var q = n === "" ? 1 : parseInt(n, 10);
    return "(" + q + "-" + (q * parseInt(f, 10)) + ")";
  }).replace(/Inteligência|Poder|Destreza/g, function (w) { return ABREV[w]; });
}
function marcaDados(t) { return t.replace(/\b(\d*d\d+)\b/g, '<span class="dado">$1</span>'); }
function desc(t) {
  var n = numerico(t);
  if (n === t) return "<p>" + t + "</p>";
  return '<p class="desc" tabindex="0"><span class="d-a">' + marcaDados(t) + '</span><span class="d-b">' + n + "</span></p>";
}
function flagsHTML(s) {
  var f = [];
  if (s.limite) f.push('<span class="flag">' + ic("relogio") + s.limite + "</span>");
  if (s.dot) f.push('<span class="flag flag-dot">' + ic("ampulheta") + "Dano contínuo</span>");
  (s.aplica || []).forEach(function (a) { f.push('<span class="flag flag-st">' + ic("etiqueta") + a + "</span>"); });
  var h = f.length ? '<div class="flags">' + f.join("") + "</div>" : "";
  if (s.dot) h += '<p class="lembrete">' + ic("ampulheta") + s.dot + "</p>";
  return h;
}

var VILAREJOS = [
  { nome: "Vale das Colheitas", tema: "agrícola, pacífico", desc: "Gente simples, forte de tanto trabalhar na terra.",
    attr: "poder" },
  { nome: "Porto Salgado", tema: "pesqueiro, comércio", desc: "Pessoas falantes e espertas, acostumadas com viajantes e contrabando.",
    attr: "inteligencia" },
  { nome: "Floresta dos Cedros", tema: "caçadores, isolado", desc: "Rastreadores que vivem entre as árvores.",
    attr: "destreza" },
  { nome: "Pedra Velha", tema: "mineradores, perto das ruínas", desc: "Gente teimosa e resistente, que já ouviu histórias do que existe nas minas.",
    attr: "inteligencia" }
];

/* ============================ HELPERS ============================ */

var ICON_PATHS = {
  espada: '<g transform="rotate(45 12 12)"><path d="M12 2v14M8 16h8M12 16v6"/><path d="M10 4l2-2 2 2"/></g>',
  escudo: '<path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z"/>',
  megafone: '<path d="M3 10v4h3l8 4V6L6 10z"/><path d="M18 9a4 4 0 010 6"/>',
  reacao: '<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 016 6v3"/>',
  estrela: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
  brilho: '<path d="M12 3l2 7 7 2-7 2-2 7-2-7-7-2 7-2z"/>',
  gota: '<path d="M12 3c4 4.5 6 7.5 6 10.5a6 6 0 01-12 0C6 10.5 8 7.500 12 3z"/>',
  orbe: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/>',
  infinito: '<path d="M8 8c-2.500 0-4 1.800-4 4s1.500 4 4 4c4 0 4-8 8-8 2.500 0 4 1.800 4 4s-1.500 4-4 4c-4 0-4-8-8-8z"/>',
  olho: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  cima: '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>',
  coracao: '<path d="M12 20s-8-4.500-8-10a4.500 4.500 0 018-2.500A4.500 4.500 0 0120 10c0 5.500-8 10-8 10z"/>',
  martelo: '<path d="M14 4l6 6-3 3-6-6z"/><path d="M12.500 9.500L4 18l2 2 8.500-8.500"/>',
  vento: '<path d="M3 9h11a3 3 0 10-3-3"/><path d="M3 15h15a3 3 0 11-3 3"/>',
  livro: '<path d="M4 5a2 2 0 012-2h14v16H6a2 2 0 00-2 2z"/><path d="M4 19v1a2 2 0 002 2h14"/>',
  corrente: '<path d="M10 14a4 4 0 005.600 0l3-3a4 4 0 00-5.600-5.600l-1 1"/><path d="M14 10a4 4 0 00-5.600 0l-3 3a4 4 0 005.600 5.600l1-1"/>',
  bussola: '<circle cx="12" cy="12" r="9"/><path d="M15.500 8.500l-2 5-5 2 2-5z"/>',
  casa: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
  prancheta: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 9h6M9 13h6M9 17h4"/>',
  pata: '<circle cx="7" cy="10" r="2"/><circle cx="12" cy="7" r="2"/><circle cx="17" cy="10" r="2"/><path d="M8 17c0-3 2-5 4-5s4 2 4 5c0 2-2 3-4 2.500-2 .5-4-.5-4-2.500z"/>',
  pino: '<path d="M12 21s7-6 7-12a7 7 0 10-14 0c0 6 7 12 7 12z"/><circle cx="12" cy="9" r="2.500"/>',
  grupo: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.500 3-6 6-6s6 2.500 6 6"/><circle cx="17" cy="9" r="2.500"/><path d="M17 14c2.500 0 4 2 4 5"/>',
  cadeado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
  ampulheta: '<path d="M6 3h12M6 21h12"/><path d="M7 3c0 5 5 6 5 9s-5 4-5 9"/><path d="M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  relogio: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  etiqueta: '<path d="M3 4h8l10 10-8 8-10-10z"/><circle cx="7.5" cy="8.5" r="1.2"/>',
  certo: '<path d="M5 13l4 4L19 7"/>',
  alerta: '<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v1"/>'
};
var KIND_ICON = { "ataque simples": "espada", "básico": "orbe", "médio": "brilho", "ultimate": "estrela", "reação": "reacao", "provocar": "megafone", "provocar sutil": "olho", "passiva": "infinito", "habilidade": "brilho", "ataque": "espada" };
var ATTR_ICON = { poder: "martelo", destreza: "vento", inteligencia: "livro" };
var PAPEL_ICON = { Dano: "espada", Tank: "escudo", Suporte: "grupo" };
function ic(n) { return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">' + (ICON_PATHS[n] || "") + "</svg>"; }
function legenda() {
  var itens = [["espada", "Ataque simples"], ["orbe", "Básico"], ["brilho", "Médio"], ["estrela", "Ultimate"], ["reacao", "Reação"], ["megafone", "Provocar"], ["olho", "Provocar sutil"], ["cima", "Melhora"], ["infinito", "Passiva"], ["gota", "Custo em mana"], ["ampulheta", "Dano contínuo"], ["relogio", "Limite de uso"], ["etiqueta", "Estado aplicado"]];
  return '<div class="legend" role="group" aria-label="Legenda dos ícones">' + itens.map(function (i) { return "<span>" + ic(i[0]) + i[1] + "</span>"; }).join("") + "</div>";
}

function table(heads, rows) {
  return '<div class="scroll"><table><thead><tr>' + heads.map(function (h) { return "<th>" + h + "</th>"; }).join("") +
    "</tr></thead><tbody>" + rows.map(function (r) {
      return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody></table></div>";
}
function panel(titulo, html) { return '<section class="panel"><h3>' + titulo + "</h3>" + html + "</section>"; }
function costLabel(c) {
  if (c === "reação" || c === "passiva") return "";
  return '<span class="cost">' + ic("gota") + (typeof c === "number" ? c + " de mana" : c) + "</span>";
}
function spellItem(s, marco, extra) {
  return '<li class="sp"><span class="sico">' + ic(KIND_ICON[s.tipo] || "brilho") + '</span><div class="sbody"><div class="shead">' +
    (marco ? '<span class="marco">Nível ' + (marco + 1) + "</span>" : "") +
    '<span class="sname">' + s.nome + "</span>" + costLabel(s.custo) +
    '<span class="kind">' + s.tipo + "</span>" + (extra || "") + "</div>" + desc(s.texto) + flagsHTML(s) + "</div></li>";
}
/* libHTML (opcional, só do mestre) devolve o botão de liberar de cada feitiço. */
function bookCard(g, paraJogador, libHTML) {
  var a = ATTR[g.attr];
  var cor = g.papel === "Tank" ? "var(--tank)" : a.cor;
  var h = '<article class="book" style="--attr:' + cor + '"><header><h3>' + g.nome + '</h3><div class="meta">' +
    '<span class="tag" style="--attr:' + a.cor + '">' + ic(ATTR_ICON[g.attr]) + a.nome + "</span>" +
    '<span class="tag role">' + ic(PAPEL_ICON[g.papel]) + g.papel + "</span>" +
    '<span class="tag role">' + g.elem + "</span>" +
    (g.tier ? '<span class="tag leg">' + g.tier + "</span>" : "") +
    "<span>" + g.sub + "</span></div></header>";
  h += '<ul class="spells">' + g.spells.map(function (s) { return spellItem(s, s.marco, libHTML ? libHTML(s) : ""); }).join("") + "</ul>";
  if (!paraJogador && g.futuras && g.futuras.length) {
    h += '<div class="future"><h4>Habilidades futuras</h4><ul class="spells">' +
      g.futuras.map(function (f) { return spellItem(f, f.marco, libHTML ? libHTML(f) : ""); }).join("") + "</ul></div>";
  }
  if (g.nota && !paraJogador) h += '<p class="bnote">' + g.nota + "</p>";
  return h + "</article>";
}

/* ============================ VIEWS ============================ */

function viewRegras() {
  var h = '<div class="rules"><h1>Regras</h1><p class="lead">O essencial para jogar sem folhear anotações.</p>';

  h += "<h2>Atributos</h2>" + table(["Atributo", "Para que serve"], [
    ["<b>Poder</b>", "Ataque físico, fortalecimento, magias de dano, saltos, empurrar, aguentar pancada."],
    ["<b>Destreza</b>", "Furtividade, precisão, esquiva, mobilidade."],
    ["<b>Inteligência</b>", "Suporte, cura, controle, conhecimento, percepção."]
  ]);

  h += "<h2>Criar o personagem</h2>" + panel("Números", "<ul>" +
    "<li><b>Treino prévio:</b> distribua +5 pontos entre os atributos, no máximo +3 em um. Isso é feito antes de ver o grimório.</li>" +
    "<li><b>Vida:</b> 20.</li><li><b>Mana:</b> 10, mais 1 a cada 2 pontos de Inteligência.</li>" +
    "<li><b>Defesa:</b> 10 + Destreza.</li>" +
    "<li><b>Redução de dano:</b> igual ao Poder (o dano mínimo é sempre 1).</li>" +
    "<li><b>Deslocamento:</b> 6 casas por turno, mais 1 a cada 2 pontos de Destreza.</li>" +
    '<li>Ao subir de nível, veja a aba <a href="#niveis">Níveis</a>.</li></ul>');

  h += "<h2>Rolagens</h2>" + panel("Teste", "<p>Role d20 + atributo contra a dificuldade que o mestre define. Exemplo: um salto usa Poder, não Atletismo.</p>" +
    table(["Dificuldade", "Valor"], [["Fácil", "10"], ["Média", "15"], ["Difícil", "20"]]));

  h += "<h2>Combate</h2>" + panel("Como começar",
    "<ol><li>O mestre anuncia o combate e descreve a cena.</li>" +
    "<li><b>Iniciativa:</b> cada jogador rola d20 + Destreza. A ordem fica visível na mesa, do maior para o menor.</li>" +
    "<li>Em cada turno: 1 movimento e 1 ação. Depois de todos agirem, começa uma nova rodada na mesma ordem.</li></ol>");

  h += panel("Acertar e causar dano", "<p>São dois passos separados. Primeiro se verifica se acertou. Só depois se calcula o dano.</p>" +
    table(["Momento", "Rolagem", "Compara com"], [
      ["Acertou?", "d20 + ataque", "Defesa do alvo (jogador: 10 + Destreza; bandido: 10)"],
      ["Quanto de dano?", "dado de dano", "Nada. Se o alvo é jogador, subtrai o Poder dele (mínimo 1)."]
    ]) +
    "<p><b>Exemplo:</b> a Lia (Destreza +3, Poder +1) tem Defesa 13. O bandido rola 12 + 2 = 14 e acerta. Rola o dano: 1d6 + 1 = 5. Ela subtrai o Poder (1) e perde 4 de vida.</p>" +
    "");

  h += "<h2>Mana</h2>" + panel("Custos e recuperação", "<ul><li>Mana máxima: 10, mais 1 a cada 2 pontos de Inteligência.</li><li>Custos: 1 (básico), 2 (médio) e 4 (ultimate).</li><li>Recupera 1 por turno, ou tudo em um descanso.</li></ul>");

  h += "<h2>Deslocamento</h2>" + panel("Com mapa e sem mapa",
    "<ul><li><b>Com mapa:</b> 6 casas por turno (1 casa = 1,5 m). Perder 2 de deslocamento deixa o alvo com 4. Dobrar deixa com 12.</li>" +
    "<li><b>Sem diagonal:</b> o movimento é só na horizontal e na vertical, e cada passo reto custa 1 casa. A diagonal só vale para alcançar um alvo no combate, nunca para andar.</li><li><b>Teatro da mente:</b> use faixas de distância (corpo a corpo, perto, longe). “Perder deslocamento” vira gastar um movimento a mais para se aproximar.</li>" +
    "<li>Com deslocamento 0 o alvo fica imobilizado, mas ainda pode atacar e lançar feitiços.</li></ul>");

  h += "<h2>Dano contínuo</h2>" + panel(ic("ampulheta") + "Resistência a cada turno",
    "<p>Feitiços com dano contínuo (veneno, queimadura, sangramento) têm um aviso no card. A cada turno do alvo:</p>" +
    "<ol><li>No início do turno dele, o alvo rola a resistência indicada no card (por exemplo, Poder contra 12), se o efeito permitir.</li>" +
    "<li>Se passar, ele evita o dano daquele turno. Se falhar, sofre o dano normalmente.</li>" +
    "<li>Sugestão: se passar por 5 ou mais, o efeito termina.</li></ol>" +
    "<p>Alguns efeitos não podem ser resistidos. O card avisa quando for assim.</p>");

  if (MESTRE) h += MESTRE.regrasExtra();

  return h + "</div>";
}

function viewNiveis() {
  if (MESTRE) return MESTRE.niveis();
  var h = "<h1>Níveis e evolução</h1>" +
    '<p class="lead">Sem pontos de experiência. Todos os personagens sobem de nível juntos, quando o mestre anunciar. Ninguém fica para trás.</p>';

  h += "<h2>O que acontece ao subir de nível</h2>" +
    panel(ic("cima") + "Todo nível", "<ul><li>A Vida e a Mana voltam ao máximo, já com o novo máximo.</li><li>O personagem ganha +1 ponto de atributo, respeitando o limite do seu nível.</li><li>O grimório evolui (veja abaixo).</li></ul>") +
    panel(ic("brilho") + "Aprimorar um feitiço",
      "<p>Você escolhe um feitiço do seu grimório e um aprimoramento:</p>" +
      "<ul><li><b>Mais dano:</b> +1 dado de dano, ou +2 de dano fixo.</li><li><b>Mais barato:</b> -1 de mana (mínimo 1).</li><li><b>Mais alcance:</b> +1 alvo, ou uma área maior.</li><li><b>Mais duradouro:</b> +1 turno de duração.</li><li><b>Mais difícil de resistir:</b> +2 na dificuldade do teste que o feitiço impõe, ou +2 na rolagem de ataque dele.</li></ul>" +
      "<p>Cada feitiço recebe no máximo 2 aprimoramentos, e nunca o mesmo duas vezes. Um feitiço de 4 mana não pode custar menos de 3. O mestre aprova cada escolha.</p>") +
    panel(ic("espada") + "Nova habilidade",
      "<p>Em algum momento, o grimório ganha uma habilidade nova, já pronta. O mestre avisa quando isso acontecer.</p>") +
    panel(ic("estrela") + "Despertar do grimório",
      "<p>Em algum momento, você cria com o mestre um feitiço novo, ligado ao tema do seu grimório.</p>" +
      "<ul><li>Custa 4 de mana e só pode ser usado uma vez por combate.</li><li>Tem um efeito de impacto, na altura de um ultimate.</li><li>O mestre aprova o efeito para não quebrar o equilíbrio.</li></ul>");
  return h;
}

/* O jogador só vê o bônus depois de ter um personagem ligado à conta, e só o do próprio vilarejo. */
function bonusVilaJogador(v) {
  if (PUB.jogador && PUB.jogador.vila === v.nome && PUB.vilaBonus) return "<p><b>Seu bônus de origem:</b> " + esc(PUB.vilaBonus) + "</p>";
  return "";
}

function viewVilarejos() {
  var h = "<h1>Vilarejos</h1>" + '<p class="lead">Todo personagem é plebeu e vem de um dos quatro vilarejos. Cada um dá um pequeno bônus de origem.</p>' +
    (!MESTRE && !PUB.jogador ? '<div class="note"><p>O bônus de origem aparece aqui depois que o mestre ligar a sua conta ao seu personagem.</p></div>' : "") + '<div class="cols">';
  VILAREJOS.forEach(function (v) {
    h += '<section class="panel" style="border-left:8px solid ' + ATTR[v.attr].cor + '"><h3>' + v.nome + '</h3><p class="meta">' + v.tema + "</p><p>" + v.desc + "</p>" +
      (MESTRE ? MESTRE.vilaExtra(v) : bonusVilaJogador(v)) + "</section>";
  });
  h += "</div>" + (MESTRE ? MESTRE.vilaRodape() : "");
  return h;
}

/* ============================ MAPA ============================ */

var CONTINENTE = [[120,260],[150,190],[230,150],[300,110],[390,90],[470,70],[560,85],[650,70],[740,100],[820,150],[860,230],[850,300],[880,370],[860,450],[810,520],[740,560],[660,610],[560,630],[470,610],[390,630],[300,600],[220,560],[160,500],[120,430],[100,350]];
var ILHA = [[895,170],[935,155],[965,185],[960,225],[925,245],[890,225]];
var FLORESTA = [[140,270],[210,262],[252,312],[246,392],[200,432],[150,412],[125,340]];
var DESERTO = [[700,470],[780,445],[820,485],[795,512],[740,538],[690,512]];
var RIO = [[500,105],[490,190],[520,260],[500,335],[530,420],[510,500],[520,560],[516,628]];
var PICOS = [[240,185,13],[262,165,17],[286,150,16],[316,138,19],[346,128,17],[376,120,19],[408,112,16],[438,108,18],[468,100,15],[498,96,16],[528,100,13],[262,200,11],[334,170,12],[398,148,13],[452,134,13]];
var ESTRADAS = [
  [[500,335],[540,290],[590,235],[630,190]],
  [[500,335],[580,338],[670,322],[760,310],[848,300]],
  [[500,335],[450,272],[380,222],[330,200],[300,188]],
  [[500,335],[430,346],[340,352],[262,353],[232,352]],
  [[500,335],[492,400],[470,470],[445,525],[430,545]],
  [[630,190],[680,150],[725,108]]
];

function suave(pts, fechado) {
  var n = pts.length;
  var d = "M" + pts[0][0] + "," + pts[0][1];
  var total = fechado ? n : n - 1;
  for (var i = 0; i < total; i++) {
    var p1 = pts[i];
    var p2 = pts[(i + 1) % n];
    var p0 = fechado ? pts[(i - 1 + n) % n] : pts[Math.max(i - 1, 0)];
    var p3 = fechado ? pts[(i + 2) % n] : pts[Math.min(i + 2, n - 1)];
    var c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    var c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += " C" + c1x.toFixed(1) + "," + c1y.toFixed(1) + " " + c2x.toFixed(1) + "," + c2y.toFixed(1) + " " + p2[0] + "," + p2[1];
  }
  return d + (fechado ? "Z" : "");
}
function dentro(poly, x, y) {
  var c = false;
  for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    var xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) c = !c;
  }
  return c;
}
function gerador(seed) {
  var s = seed;
  return function () { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296; };
}
function pontosDentro(poly, n, seed) {
  var rnd = gerador(seed), out = [], t = 0;
  var xs = poly.map(function (p) { return p[0]; }), ys = poly.map(function (p) { return p[1]; });
  var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
  while (out.length < n && t < 5000) {
    t++;
    var x = minx + rnd() * (maxx - minx), y = miny + rnd() * (maxy - miny);
    if (dentro(poly, x, y)) out.push([Math.round(x), Math.round(y)]);
  }
  return out;
}

function terreno() {
  var h = "";
  var rnd = gerador(7), k = 0, t = 0;
  while (k < 30 && t < 900) {
    t++;
    var x = 20 + rnd() * 950, y = 20 + rnd() * 640;
    if (dentro(CONTINENTE, x, y) || dentro(ILHA, x, y) || (x < 280 && y < 90) || (x < 150 && y > 560)) continue;
    k++;
    h += '<path class="onda" d="M' + Math.round(x) + "," + Math.round(y) + " q6,-6 12,0 t12,0\"/>";
  }
  h += '<path class="terra" d="' + suave(CONTINENTE, true) + '"/>';
  h += '<path class="terra" d="' + suave(ILHA, true) + '"/>';
  h += '<path class="deserto" d="' + suave(DESERTO, true) + '"/>';
  pontosDentro(DESERTO, 26, 3).forEach(function (p) { h += '<circle class="duna" cx="' + p[0] + '" cy="' + p[1] + '" r="1.6"/>'; });
  h += '<path class="florestaarea" d="' + suave(FLORESTA, true) + '"/>';
  pontosDentro(FLORESTA, 34, 11).forEach(function (p) {
    h += '<path class="arvore" d="M' + (p[0] - 5) + "," + (p[1] + 5) + " L" + p[0] + "," + (p[1] - 8) + " L" + (p[0] + 5) + "," + (p[1] + 5) + 'Z"/>';
  });
  for (var i = 0; i < 10; i++) {
    var cx = 360 + (i % 5) * 26, cy = 562 + Math.floor(i / 5) * 18;
    h += '<rect class="' + (i % 2 ? "campo1" : "campo2") + '" x="' + cx + '" y="' + cy + '" width="22" height="14" rx="2"/>';
  }
  h += '<ellipse class="agua" cx="640" cy="425" rx="42" ry="24"/>';
  h += '<path class="rio" d="' + suave(RIO, false) + '"/>';
  PICOS.forEach(function (p) {
    h += '<path class="pico" d="M' + (p[0] - p[2]) + "," + (p[1] + p[2] * 0.8) + " L" + p[0] + "," + (p[1] - p[2]) + " L" + (p[0] + p[2]) + "," + (p[1] + p[2] * 0.8) + 'Z"/>';
  });
  ESTRADAS.forEach(function (e) { h += '<path class="estrada" d="' + suave(e, false) + '"/>'; });
  h += '<text class="reino" x="400" y="448" text-anchor="middle">REINO DE ALVORADA</text>';
  h += '<text class="mar-nome" x="925" y="470" text-anchor="middle">Mar das Brumas</text>';
  h += '<text class="titulo" x="28" y="52">Grimoria</text>';
  h += '<g class="rosa" transform="translate(75,605)"><circle r="28"/><path d="M0,-36 L6,0 L0,36 L-6,0Z"/><path d="M-36,0 L0,-6 L36,0 L0,6Z"/><text y="-44" text-anchor="middle">N</text></g>';
  return h;
}


var TIPO_NOME = { cidade: "Cidade", vilarejo: "Vilarejo", misterio: "Mistério", perigo: "Perigo", secreto: "Segredo" };
var filtroMapa = "todos", modoMesa = false, localSel = null, confirmarDelImg = 0;

/* O mestre tem a lista completa (LOCAIS, em mestre.js). O jogador recebe do servidor só os locais revelados. */
function listaLocais() { return souMestre() ? LOCAIS : (PUB.locais || []); }
function getRev() {
  var out = {};
  if (!souMestre()) { listaLocais().forEach(function (l) { out[l.id] = true; }); return out; }
  var saved = EST.rev;
  LOCAIS.forEach(function (l) { out[l.id] = saved && typeof saved[l.id] === "boolean" ? saved[l.id] : !!REV_PADRAO[l.id]; });
  return out;
}
function camadaMestre() { return souMestre() && mestreAberto && !modoMesa; }

function glifo(tipo) {
  if (tipo === "cidade") return '<circle class="m-bg" r="13"/><path class="m-ico" d="M-7,5 L-7,-2 L-3.5,-5 L0,-2 L3.5,-5 L7,-2 L7,5Z"/>';
  if (tipo === "vilarejo") return '<circle class="m-bg" r="10"/><path class="m-ico" d="M-5,2 L0,-5 L5,2 L5,6 L-5,6Z"/>';
  if (tipo === "perigo") return '<circle class="m-bg" r="11"/><text class="m-q" y="5" text-anchor="middle">!</text>';
  return '<circle class="m-bg" r="11"/><text class="m-q" y="5" text-anchor="middle">?</text>';
}

function locaisVisiveis() {
  var rev = getRev();
  return listaLocais().filter(function (l) {
    if (l.secreto && !camadaMestre()) return false;
    if (modoMesa && !rev[l.id]) return false;
    if (filtroMapa !== "todos" && l.tipo !== filtroMapa) return false;
    return true;
  });
}

function desenharMapa() {
  var svg = document.getElementById("mapaSvg");
  if (!svg) return;
  var rev = getRev();
  var h = terreno();
  if (camadaMestre()) {
    ROTAS_SECRETAS.forEach(function (r) { h += '<path class="rota" d="' + suave(r, false) + '"/>'; });
  }
  locaisVisiveis().forEach(function (l) {
    var cls = "marker t-" + l.tipo + (l.id === localSel ? " sel" : "") + (!modoMesa && !rev[l.id] && !l.secreto ? " oculto" : "");
    h += '<g class="' + cls + '" tabindex="0" role="button" aria-label="' + l.nome + '" data-id="' + l.id + '" transform="translate(' + l.x + "," + l.y + ')">' +
      '<circle class="m-hit" r="18"/>' + glifo(l.tipo) + '<text class="m-label" x="' + l.lab[0] + '" y="' + l.lab[1] + '" text-anchor="' + l.lab[2] + '">' + l.nome + "</text></g>";
  });
  svg.innerHTML = h;
  desenharDetalhe();
}

function introMapa() {
  return "<h3>Grimoria</h3>" +
    "<p>Grimoria é o mundo onde a magia nasce nos grimórios. O continente conhecido abriga o Reino de Alvorada, governado a partir de Alta Lumen, onde fica a Ordem dos Cavaleiros Mágicos.</p>" +
    "<p>Toque em um marcador para ver o que há ali." + (souMestre() ? " Os nomes são provisórios: troque pelos que combinarem mais com você." : "") + "</p>";
}

function imgUrl(id) { return API + "?a=img&id=" + encodeURIComponent(id); }

/* Cada local do mapa pode ter um cenário ligado (foto, grid e história). O mestre faz o vínculo; o jogador
   recebe só o id e a versão da foto dos locais já revelados. */
function cenarioDoLocal(l) {
  if (!souMestre()) return l.cenario ? { id: l.cenario, v: l.cv, nome: l.cenNome, resumo: l.cenResumo } : null;
  var id = (EST.locais_cen || {})[l.id], c = id ? acharEnvio(id) : null;
  return c ? { id: c.id, v: c.v, nome: c.nome, resumo: String(((EST.cenarios_info || {})[c.id] || {}).resumo || "") } : null;
}

function desenharDetalhe() {
  var box = document.getElementById("mapaDetalhe");
  if (!box) return;
  var l = null;
  listaLocais().forEach(function (x) { if (x.id === localSel) l = x; });
  var rev = getRev();
  if (!l || (l.secreto && !camadaMestre()) || (modoMesa && !rev[l.id])) { box.innerHTML = introMapa(); return; }
  var h = "<h3>" + l.nome + '</h3><div class="meta"><span class="tag role">' + TIPO_NOME[l.tipo] + "</span>" + (camadaMestre() ? '<span class="tag role">' + l.arco + "</span>" : "") + "</div>";
  var cen = cenarioDoLocal(l);
  if (cen) {
    var u = API + "?a=cena_img&id=" + encodeURIComponent(cen.id) + (cen.v ? "&v=" + cen.v : "");
    h += (cen.nome ? '<p class="meta"><span class="tag role">' + ic("pino") + esc(cen.nome) + "</span></p>" : "") +
      '<a href="' + u + '" target="_blank" rel="noopener"><img class="local-img" src="' + u + '" alt="' + esc(cen.nome || "Cenário de " + l.nome) + '"></a>' +
      (cen.resumo ? '<p class="resumo">' + esc(cen.resumo) + "</p>" : "");
  } else if (!souMestre()) {
    h += '<p class="mdica">Ainda não há nada para ver aqui.</p>';
  }
  if (souMestre() && !modoMesa) {
    if (!l.secreto) h += '<label class="rev-label"><input type="checkbox" class="rev" data-id="' + l.id + '"' + (rev[l.id] ? " checked" : "") + "> 1. Local visível no mapa dos jogadores</label>" +
      '<p class="mdica rev-dica">Mostra o ponto “' + esc(l.nome) + '” no mapa. Sem isso, o jogador nem sabe que o lugar existe.</p>';
    h += MESTRE.localExtra(l);
    if (l.ganchos.length) h += "<h4>Ganchos</h4><ul>" + l.ganchos.map(function (g) { return "<li>" + g + "</li>"; }).join("") + "</ul>";
    if (l.inimigos.length) h += "<h4>Inimigos (veja o Bestiário)</h4><p>" + l.inimigos.join(", ") + ".</p>";
    if (camadaMestre() && (l.segredo || l.inimigosSec)) {
      h += '<div class="note"><p><b>Segredo do mestre.</b>' + (l.ideia ? " <i>Ideia ainda não confirmada.</i>" : "") + "</p>";
      if (l.segredo) h += "<p>" + l.segredo + "</p>";
      if (l.inimigosSec) h += "<p><b>Inimigos secretos:</b> " + l.inimigosSec.join(", ") + ".</p>";
      h += "</div>";
    }
  }
  box.innerHTML = h;
}

function selecionarLocal(id) {
  localSel = id;
  document.querySelectorAll(".marker").forEach(function (m) { m.classList.toggle("sel", m.dataset.id === id); });
  desenharDetalhe();
  try {
    document.getElementById("mapaDetalhe").scrollIntoView({ block: "nearest", behavior: "smooth" });
  } catch (e) { /* sem rolagem: ignora */ }
}

function legendaMapa() {
  var itens = [["cidade", "Cidade"], ["vilarejo", "Vilarejo"], ["misterio", "Mistério"], ["perigo", "Perigo"]];
  if (camadaMestre()) itens.push(["secreto", "Segredo (mestre)"]);
  return '<div class="mlegenda" role="group" aria-label="Legenda do mapa">' + itens.map(function (i) {
    return '<span><svg class="lg t-' + i[0] + '" viewBox="-15 -15 30 30" width="26" height="26" aria-hidden="true">' + glifo(i[0]) + "</svg>" + i[1] + "</span>";
  }).join("") + "</div>";
}

function galeriaMapas() {
  var edita = souMestre() && !modoMesa;
  var lista = IMAGENS.filter(function (i) { return i.tipo === "mapa" && (edita || i.liberado); });
  var h = "<h2>Mapas</h2>";
  if (edita) {
    h += '<p class="mdica">Envie mapas e imagens da campanha. Os jogadores só veem os que você liberar.</p>' +
      '<p class="pj-botoes"><input type="file" accept="image/*" class="vh" id="mapaUp"><label class="btn" for="mapaUp">Enviar mapa</label></p>';
  }
  if (!lista.length) return h + '<div class="empty">' + (edita ? "Nenhum mapa enviado ainda." : "Nenhum mapa liberado ainda.") + "</div>";
  return h + '<div class="galeria">' + lista.map(function (i) {
    var t = '<figure class="panel gal-item"><a href="' + imgUrl(i.id) + '" target="_blank" rel="noopener"><img src="' + imgUrl(i.id) + '" alt="' + esc(i.titulo || "Mapa") + '" loading="lazy"></a>';
    if (edita) {
      t += '<input class="sorteio-in" type="text" maxlength="120" placeholder="Título do mapa" aria-label="Título do mapa" data-imgtit="' + i.id + '" value="' + esc(i.titulo) + '">' +
        '<label class="rev-label"><input type="checkbox" data-imglib="' + i.id + '"' + (i.liberado ? " checked" : "") + "> Liberado aos jogadores</label>" +
        '<button type="button" data-imgdel="' + i.id + '">' + (confirmarDelImg === i.id ? "Clique de novo para excluir" : "Excluir") + "</button>";
    } else if (i.titulo) {
      t += "<figcaption>" + esc(i.titulo) + "</figcaption>";
    }
    return t + "</figure>";
  }).join("") + "</div>";
}

function viewMapa() {
  var m = souMestre();
  var h = "<h1>Mapa de Grimoria</h1>" +
    '<p class="lead">' + (m ? "O mundo da campanha: o reino, os vilarejos e os mistérios que os jogadores podem explorar. Toque em um marcador para ver os detalhes."
      : "O mundo da campanha. Novos lugares aparecem aqui conforme vocês os descobrem. Toque em um marcador para ver os detalhes.") + "</p>";
  h += '<div class="controls"><div class="fgroup"><span>Mostrar</span><div class="chips" id="fMapa">' +
    [["todos", "Tudo"], ["cidade", "Cidades"], ["vilarejo", "Vilarejos"], ["misterio", "Mistérios"], ["perigo", "Perigos"]].map(function (t) {
      return '<button type="button" class="chip" data-mtipo="' + t[0] + '" aria-pressed="' + (filtroMapa === t[0]) + '">' + t[1] + "</button>";
    }).join("") + "</div></div></div>";
  if (m) {
    h += '<div class="controls"><button type="button" class="chip" id="btnMesa" aria-pressed="' + modoMesa + '">' + ic("grupo") + "Modo mesa</button>" +
      (modoMesa ? "" : '<button type="button" class="chip" id="btnMestre" aria-pressed="' + mestreAberto + '">' + ic("cadeado") + (mestreAberto ? "Ocultar a camada do mestre" : "Mostrar a camada do mestre") + "</button>") + "</div>";
    h += '<p class="mdica">' + (modoMesa
      ? "Modo mesa ligado: aparece só o que você marcou como revelado, sem ganchos nem segredos. Pode mostrar a tela aos jogadores."
      : "Marque “Local visível no mapa dos jogadores” em cada local conforme eles descobrirem. Os jogadores veem no site só os locais revelados. Os locais esmaecidos ainda não foram revelados.") + "</p>";
  }
  h += legendaMapa();
  h += '<div class="mapa-grid"><div class="mapa-box"><svg id="mapaSvg" viewBox="0 0 1000 680" role="img" aria-label="Mapa de Grimoria com o reino, os vilarejos e os mistérios"></svg></div>' +
    '<aside class="panel mapa-detalhe" id="mapaDetalhe" aria-live="polite"></aside></div>';
  h += galeriaMapas();
  if (camadaMestre()) h += "<h2>Roteiro por arco</h2>" + tabelaArcos();
  return h;
}

/* ============================ JOGADOR ============================ */

function viewInicioJogador() {
  var j = PUB.jogador;
  var h = "<h1>Olá, " + esc(USUARIO.nome) + "</h1>" +
    '<p class="lead">Bem-vindo à campanha. Aqui ficam as regras, o seu grimório e o mapa do que o grupo já descobriu. O mestre vai liberando o resto aos poucos.</p>';
  if (!j) {
    return h + '<div class="note"><p><b>Sua conta ainda não está ligada a um personagem.</b> Avise o mestre: ele liga a sua conta ao seu personagem na aba Jogadores.</p></div>' + atalhosJogador();
  }
  var url = j.img ? imgUrl(j.img) : "";
  h += '<div class="pj-form"><div class="pj-lado">' +
    (url ? '<img class="pj-avatar grande" src="' + url + '" alt="Imagem de ' + esc(j.personagem || j.nome || "personagem") + '">' : '<span class="pj-avatar grande vazio" aria-hidden="true">' + ic("grupo") + "</span>") +
    '</div><div class="pj-campos"><h2 style="margin-top:0">' + esc(j.personagem || "Personagem sem nome") + "</h2>";
  var campos = [["Jogador", j.nome], ["Vilarejo", j.vila], ["Altura", j.altura], ["Descrição", j.descricao], ["Sonho ou objetivo", j.sonho], ["Medo ou fraqueza", j.medo]];
  if (j.atrTravado) campos.push(["Atributos", ATRS.map(function (a) { return a[1] + " " + sinal(atrTotal(j, a[0])); }).join(", ")]);
  campos.forEach(function (c) { if (c[1]) h += '<p><b>' + c[0] + ":</b> " + esc(c[1]) + "</p>"; });
  if (PUB.vilaBonus) h += "<p><b>Bônus de origem:</b> " + esc(PUB.vilaBonus) + "</p>";
  return h + "</div></div>" + atalhosJogador();
}

function atalhosJogador() {
  return "<h2>Atalhos</h2>" + '<div class="cols">' +
    panel(ic("livro") + "Meu grimório", '<p>' + (PUB.grimorio ? "Veja as magias que você já desbloqueou." : "Seu grimório aparece aqui depois da cerimônia.") + '</p><p><a href="#meu-grimorio">Abrir</a></p>') +
    panel(ic("grupo") + "Perfil", '<p>Edite o nome, a descrição e o retrato do seu personagem.</p><p><a href="#perfil">Abrir</a></p>') +
    panel(ic("prancheta") + "Regras", '<p>Atributos, combate, mana e deslocamento.</p><p><a href="#regras">Abrir</a></p>') +
    panel(ic("bussola") + "Mapa", '<p>Os lugares que o grupo já descobriu.</p><p><a href="#mapa">Abrir</a></p>') + "</div>";
}

function viewMeuGrimorio() {
  var g = PUB.grimorio;
  if (!g) {
    return '<div class="lock"><h1>Meu grimório</h1><p>Seu grimório ainda não foi revelado. Ele aparece aqui depois da cerimônia, com as magias que o mestre for liberando.</p></div>';
  }
  var h = "<h1>Meu grimório</h1>" +
    '<p class="lead">As magias aparecem aqui conforme você as desbloqueia. Passe o mouse (ou toque) sobre a descrição de um feitiço para ver os valores mínimo e máximo dos dados.</p>' + legenda();
  h += '<div class="cer-card">' + bookCard(g, true) + "</div>";
  if (!g.spells.length) h += '<div class="empty">Nenhuma magia liberada ainda.</div>';
  return h;
}

/* ============================ PERFIL ============================ */

var perfilPend = {}, perfilMsg = "";
var ATRS = [["poder", "Poder"], ["destreza", "Destreza"], ["inteligencia", "Inteligência"]];
var VIDA_NIVEL = [20, 24, 28, 32, 36], LIM_NIVEL = [3, 3, 4, 4, 5];
var atrRasc = { poder: 0, destreza: 0, inteligencia: 0 };
function nivelJog(j) { return Math.max(1, Math.min(5, parseInt(j.nivel, 10) || 1)); }
function atrBase(j, k) { return parseInt(j.atr && j.atr[k], 10) || 0; }
function atrBonus(j, k) { return parseInt(j.bonus && j.bonus[k], 10) || 0; }
function atrTotal(j, k) { return atrBase(j, k) + atrBonus(j, k); }
/* Mana: 10, mais 1 a cada 2 pontos de Inteligência. */
function manaJog(j) { return 10 + Math.floor(atrTotal(j, "inteligencia") / 2); }
function sinal(n) { return (n >= 0 ? "+" : "") + n; }

function statCaixa(rot, v) { return '<div class="stat"><b>' + v + "</b>" + rot + "</div>"; }

/* Status do personagem: os números derivados seguem as regras (Defesa 10 + Destreza, redução de dano = Poder,
   deslocamento 6 + 1 a cada 2 de Destreza, mana 10 + 1 a cada 2 de Inteligência, Vida pelo nível). */
function statusHTML(j) {
  var n = nivelJog(j), dex = atrTotal(j, "destreza"), h = '<h2>Status</h2><section class="panel ficha">' +
    '<div class="stats">' + statCaixa("Nível", n) + statCaixa("Vida máx.", VIDA_NIVEL[n - 1]) + statCaixa("Mana", manaJog(j)) +
    statCaixa("Defesa", 10 + dex) + statCaixa("Redução de dano", atrTotal(j, "poder")) + statCaixa("Deslocamento", 6 + Math.floor(dex / 2)) + "</div>";
  if (!j.atrTravado) {
    var usado = atrRasc.poder + atrRasc.destreza + atrRasc.inteligencia, resta = 5 - usado;
    h += "<h3>Distribua os seus 5 pontos</h3>" +
      '<p class="mdica">Você tem <b>5 pontos</b> para dividir entre os três atributos, no máximo <b>+3</b> em cada. Isso representa o seu treino antes de receber o grimório. <b>Depois de salvar, não dá para mudar.</b></p>' +
      '<div class="atr-lista">' + ATRS.map(function (a) {
        return '<div class="atr-linha"><span class="atr-nome">' + a[1] + '</span><button type="button" data-atr-step="' + a[0] + '" data-d="-1" aria-label="Menos ' + a[1] + '"' + (atrRasc[a[0]] <= 0 ? " disabled" : "") + '>−</button>' +
          '<b class="atr-valor">' + sinal(atrRasc[a[0]]) + '</b><button type="button" data-atr-step="' + a[0] + '" data-d="1" aria-label="Mais ' + a[1] + '"' + (atrRasc[a[0]] >= 3 || resta <= 0 ? " disabled" : "") + ">+</button></div>";
      }).join("") + "</div>" +
      '<p role="status">Pontos restantes: <b>' + resta + "</b></p>" +
      '<p><button type="button" class="primary" id="perfilSalvarAtr"' + (resta === 0 ? "" : " disabled") + ">Salvar atributos</button></p></section>";
    return h;
  }
  var lim = LIM_NIVEL[n - 1];
  h += "<h3>Atributos</h3>" + '<div class="scroll"><table><thead><tr><th>Atributo</th><th>Base</th><th>Bônus</th><th>Total</th></tr></thead><tbody>' +
    ATRS.map(function (a) {
      var tot = atrTotal(j, a[0]);
      return "<tr><td><b>" + a[1] + "</b></td><td>" + sinal(atrBase(j, a[0])) + '</td><td><input class="sorteio-in num" type="number" min="-5" max="10" data-pbonus="' + a[0] + '" value="' + atrBonus(j, a[0]) + '" aria-label="Bônus de ' + a[1] + '"></td>' +
        "<td><b>" + sinal(tot) + "</b>" + (tot > lim ? ' <small class="tok-desl excede">acima do limite +' + lim + " do seu nível</small>" : "") + "</td></tr>";
    }).join("") + "</tbody></table></div>" +
    '<p class="mdica">A <b>base</b> foi definida na criação e não muda. O <b>bônus</b> é onde você anota os pontos que ganha ao subir de nível (+1 por nível, no máximo +' + lim + " no total em cada atributo, no seu nível). O mestre confere.</p></section>";
  return h;
}
var CAMPOS_PERFIL = [["personagem", "Nome do personagem", 60], ["altura", "Altura", 20], ["descricao", "Descrição", 2000], ["sonho", "Sonho ou objetivo", 2000], ["medo", "Medo ou fraqueza", 2000]];

function viewPerfil() {
  var j = PUB.jogador;
  if (!j) {
    return '<div class="lock"><h1>Perfil</h1><p>Sua conta ainda não está ligada a um personagem. Avise o mestre: depois que ele ligar, você edita o seu perfil aqui.</p></div>';
  }
  var url = j.img ? imgUrl(j.img) : "";
  var h = "<h1>Perfil</h1>" + '<p class="lead">Conte quem é o seu personagem. As mudanças são salvas sozinhas e o mestre vê tudo.</p>' +
    '<p id="perfilMsg" role="status" class="mdica">' + esc(perfilMsg) + "</p>" + statusHTML(j) + "<h2>Personagem</h2>";
  h += '<div class="pj-form"><div class="pj-lado">' +
    (url ? '<img class="pj-avatar grande" src="' + url + '" alt="Retrato de ' + esc(j.personagem || "personagem") + '">' : '<span class="pj-avatar grande vazio" aria-hidden="true">' + ic("grupo") + "</span>") +
    '<p class="pj-botoes"><input type="file" accept="image/*" class="vh" id="perfilImg"><label class="btn" for="perfilImg">' + (url ? "Trocar retrato" : "Escolher retrato") + "</label>" +
    (url ? '<button type="button" id="perfilImgDel">Remover</button>' : "") + "</p></div>";
  h += '<div class="pj-campos">';
  if (j.nome) h += "<p><b>Jogador:</b> " + esc(j.nome) + "</p>";
  if (j.vila) h += "<p><b>Vilarejo:</b> " + esc(j.vila) + "</p>";
  CAMPOS_PERFIL.forEach(function (c) {
    var v = esc(j[c[0]] || "");
    h += "<label>" + c[1] + (c[2] > 100
      ? '<textarea class="sorteio-in" rows="' + (c[0] === "descricao" ? 4 : 3) + '" maxlength="' + c[2] + '" data-pf="' + c[0] + '">' + v + "</textarea>"
      : '<input class="sorteio-in" type="text" maxlength="' + c[2] + '" data-pf="' + c[0] + '" value="' + v + '"' + (c[0] === "altura" ? ' placeholder="ex.: 1,72 m"' : "") + ">") + "</label>";
  });
  return h + '<p class="mdica">O nome do jogador, o vilarejo e o grimório são definidos pelo mestre.</p></div></div>';
}

function salvarPerfil(el) {
  var k = el.dataset.pf;
  PUB.jogador[k] = el.value;
  perfilPend[k] = el.value;
  adiar("perfil", function () {
    var c = perfilPend;
    perfilPend = {};
    gravar("perfil_salvar", { campos: c });
  });
}

function enviarRetrato(input) {
  var f = input.files && input.files[0];
  if (!f) return;
  perfilMsg = "Enviando o retrato…";
  renderizar();
  reduzirImagem(f, 480, 200000, function (erro, url) {
    if (erro) { perfilMsg = erro; renderizar(); return; }
    gravar("perfil_img", { dados: url }).then(function (r) {
      perfilMsg = r ? "Retrato salvo." : "Não foi possível salvar o retrato. Tente de novo.";
      if (r) PUB.jogador.img = r.id;
      renderizar();
    });
  });
}

/* Reduz a imagem no navegador antes de enviar, para caber no banco sem pesar. */
function reduzirImagem(f, max, limite, pronto) {
  if (!f || !/^image\//.test(f.type)) { pronto("Escolha um arquivo de imagem."); return; }
  var r = new FileReader();
  r.onerror = function () { pronto("Não consegui ler esse arquivo."); };
  r.onload = function () {
    var im = new Image();
    im.onerror = function () { pronto("Não consegui abrir essa imagem."); };
    im.onload = function () {
      var esc2 = Math.min(1, max / Math.max(im.width, im.height));
      var c = document.createElement("canvas");
      c.width = Math.max(1, Math.round(im.width * esc2));
      c.height = Math.max(1, Math.round(im.height * esc2));
      var x = c.getContext("2d");
      x.fillStyle = "#ffffff";
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(im, 0, 0, c.width, c.height);
      var q = 0.85, url = c.toDataURL("image/jpeg", q);
      while (url.length > limite && q > 0.4) { q -= 0.1; url = c.toDataURL("image/jpeg", q); }
      pronto(null, url);
    };
    im.src = r.result;
  };
  r.readAsDataURL(f);
}

/* ============================ TABULEIRO ============================ */

/* Animação: guarda onde cada token estava no último desenho. No desenho seguinte ele nasce na posição antiga e desliza
   (transição de CSS) até a nova. tabAnimFim adia redesenhos que cortariam a animação no meio. */
var posTokAnt = {}, posTokChave = "", tabAnimFim = 0, tabAdiado = null;
function agendarQuadro(fn) {
  if (window.requestAnimationFrame) window.requestAnimationFrame(function () { window.requestAnimationFrame(fn); });
  else setTimeout(fn, 20);
}

/* O movimento é só na horizontal e na vertical: cada passo reto custa 1 casa, então a distância é a SOMA das diferenças
   (andar 3 para a direita e 2 para cima custa 5). A diagonal não serve para andar. */
function distMov(x1, y1, x2, y2) { return Math.abs(x1 - x2) + Math.abs(y1 - y2); }

/* Casas que o token alcança, andando só na horizontal e na vertical, até o que resta de movimento. Todo token (inclusive
   o derrotado), menos armadilha, bloqueia: um não passa pelo outro. O custo é o tamanho do caminho livre mais curto. */
function celulasAlcance(tokens, t, resta, cols, rows) {
  /* Todo token, menos armadilha, bloqueia o caminho: o alcance contorna os tokens em vez de passar por eles. */
  var bloq = {}, vistos = {}, fila = [[t.x | 0, t.y | 0, 0]], out = [], passos = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  tokens.forEach(function (o) { if (o.id !== t.id && o.tipo !== "armadilha") bloq[(o.x | 0) + "," + (o.y | 0)] = true; });
  vistos[(t.x | 0) + "," + (t.y | 0)] = true;
  for (var i = 0; i < fila.length; i++) {
    var c = fila[i];
    if (c[2] >= resta) continue;
    for (var k = 0; k < passos.length; k++) {
      var nx = c[0] + passos[k][0], ny = c[1] + passos[k][1], ch = nx + "," + ny;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows || vistos[ch] || bloq[ch]) continue;
      vistos[ch] = true;
      fila.push([nx, ny, c[2] + 1]);
      out.push({ x: nx, y: ny, d: c[2] + 1 });
    }
  }
  return out;
}

var COR_TOKEN = { jogador: "#2a6fc9", aliado: "#2e8b57", inimigo: "#c0392b", armadilha: "#d9700f" };
var tabGeo = null;

function colNome(i) {
  var s = "";
  for (i = i + 1; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + ((i - 1) % 26)) + s;
  return s;
}
function coordNome(x, y) { return colNome(x) + (y + 1); }
function iniciais(nome) {
  var p = String(nome || "?").trim().split(/\s+/);
  return ((p[0] || "?").charAt(0) + (p.length > 1 ? p[p.length - 1].charAt(0) : (p[0] || "").charAt(1))).toUpperCase();
}
function corToken(t) { return /^#[0-9a-fA-F]{6}$/.test(t.cor || "") ? t.cor : (COR_TOKEN[t.tipo] || COR_TOKEN.inimigo); }

function tabuleiroHTML(src, alt) {
  return '<div class="tab-box"><div class="tab"><img id="tabImg" src="' + src + '" alt="' + esc(alt) + '"><svg id="tabSvg" class="tab-svg" role="img" aria-label="Grid do mapa"></svg></div>' +
    '<div class="zoom-ctl"><button type="button" data-zoom="mais" aria-label="Aproximar o mapa">+</button><button type="button" data-zoom="menos" aria-label="Afastar o mapa">−</button>' +
    '<button type="button" data-zoom="reset" aria-label="Voltar ao tamanho original">Ajustar</button><button type="button" data-zoom="cheia" aria-label="Tela cheia">⛶</button></div>' +
    '<div class="tab-hud" id="tabHud" aria-live="polite"></div><div class="gire-dica">Gire o aparelho para o modo paisagem</div></div>';
}

function desenharTabuleiro(cfg) {
  var img = document.getElementById("tabImg"), svg = document.getElementById("tabSvg");
  if (!img || !svg) return null;
  if (!img.complete || !img.naturalWidth) {
    img.onload = function () { desenharTabuleiro(cfg); };
    img.onerror = function () { svg.outerHTML = '<p class="tab-erro">Não consegui carregar a imagem deste mapa.</p>'; };
    return null;
  }
  /* Em plena animação, o redesenho espera ela terminar (senão o token "pularia" para o fim). */
  if (Date.now() < tabAnimFim && tabGeo) {
    clearTimeout(tabAdiado);
    tabAdiado = setTimeout(function () { desenharTabuleiro(cfg); }, tabAnimFim - Date.now() + 30);
    return tabGeo;
  }
  var W = img.naturalWidth, H = img.naturalHeight;
  var cols = Math.max(1, Math.min(200, cfg.cols || 20));
  var rows = Math.max(1, Math.min(200, cfg.rows || Math.round(cols * H / W)));
  var cw = W / cols, ch = H / rows, menor = Math.min(cw, ch), d = "", h = "", i, j;
  for (i = 1; i < cols; i++) d += "M" + (i * cw).toFixed(1) + " 0V" + H;
  for (j = 1; j < rows; j++) d += "M0 " + (j * ch).toFixed(1) + "H" + W;
  h += '<path class="tab-linha" d="' + d + '"/>';
  var fs = Math.max(8, menor * 0.26);
  for (i = 0; i < cols; i++) h += '<text class="tab-coord" x="' + (i * cw + fs * 0.3).toFixed(1) + '" y="' + (fs * 1.05).toFixed(1) + '" font-size="' + fs.toFixed(1) + '">' + colNome(i) + "</text>";
  for (j = 1; j < rows; j++) h += '<text class="tab-coord" x="' + (fs * 0.3).toFixed(1) + '" y="' + (j * ch + fs * 1.05).toFixed(1) + '" font-size="' + fs.toFixed(1) + '">' + (j + 1) + "</text>";
  /* Casas azuis: onde o token selecionado pode ir. */
  var alc = typeof cfg.alcance === "function" ? cfg.alcance(cols, rows) : (cfg.alcance || []);
  alc.forEach(function (c) {
    h += '<rect class="alc" data-ax="' + c.x + '" data-ay="' + c.y + '" data-ad="' + c.d + '" x="' + (c.x * cw).toFixed(1) + '" y="' + (c.y * ch).toFixed(1) + '" width="' + cw.toFixed(1) + '" height="' + ch.toFixed(1) + '" rx="' + (menor * 0.08).toFixed(1) + '"><title>' +
      coordNome(c.x, c.y) + ", " + c.d + (c.d === 1 ? " casa" : " casas") + "</title></rect>";
  });
  var r = menor * 0.38;
  var chaveCena = img.src || "", novosPos = {}, deslizar = [], durMax = 0, idxTok = 0;
  if (posTokChave !== chaveCena) { posTokAnt = {}; posTokChave = chaveCena; zoomTab = { z: 1, tx: 0, ty: 0 }; }
  (cfg.tokens || []).forEach(function (t) {
    var x = Math.max(0, Math.min(cols - 1, t.x | 0)), y = Math.max(0, Math.min(rows - 1, t.y | 0));
    var cls = "token" + (t.oculto ? " oculto" : "") + (t.morto ? " morto" : "") + (cfg.atual === t.id ? " atual" : "") + (cfg.meu && t.id === cfg.meu ? " meu" : "") + (cfg.sel === t.id ? " sel" : "");
    var forma = t.tipo === "armadilha"
      ? '<polygon points="0,' + (-r * 1.15).toFixed(1) + " " + (r * 1.15).toFixed(1) + ",0 0," + (r * 1.15).toFixed(1) + " " + (-r * 1.15).toFixed(1) + ',0" fill="' + corToken(t) + '"/>'
      : '<circle r="' + r.toFixed(1) + '" fill="' + corToken(t) + '"/>';
    var barra = "";
    if (cfg.mestre && t.vidaMax && t.tipo !== "armadilha") {
      var pc = Math.max(0, Math.min(1, (t.vida == null ? t.vidaMax : t.vida) / t.vidaMax)), bw = r * 1.8;
      barra = '<rect x="' + (-bw / 2).toFixed(1) + '" y="' + (r * 1.05).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (r * 0.22).toFixed(1) + '" fill="#000" fill-opacity=".6"/>' +
        '<rect x="' + (-bw / 2).toFixed(1) + '" y="' + (r * 1.05).toFixed(1) + '" width="' + (bw * pc).toFixed(1) + '" height="' + (r * 0.22).toFixed(1) + '" fill="' + (pc > 0.5 ? "#2e8b57" : pc > 0.25 ? "#d9a21f" : "#c0392b") + '"/>';
    }
    var px = (x + 0.5) * cw, py = (y + 0.5) * ch, ant = posTokAnt[t.id], estilo;
    var alvo = "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)";
    novosPos[t.id] = { px: px, py: py };
    if (ant && (Math.abs(ant.px - px) > 0.5 || Math.abs(ant.py - py) > 0.5)) {
      var dur = Math.min(0.9, 0.2 + 0.07 * Math.max(Math.abs(ant.px - px) / cw, Math.abs(ant.py - py) / ch));
      durMax = Math.max(durMax, dur);
      deslizar.push(t.id);
      estilo = "transform:translate(" + ant.px.toFixed(1) + "px," + ant.py.toFixed(1) + "px);transition-duration:" + dur.toFixed(2) + "s";
    } else {
      estilo = "transform:" + alvo + ";transition-duration:0s";
    }
    /* Foto do personagem no lugar das iniciais (as iniciais ficam por baixo, para o caso de a imagem não carregar). */
    var fotoSvg = "";
    if (t.foto && t.tipo !== "armadilha") {
      var cid = "cp" + (idxTok++);
      fotoSvg = '<clipPath id="' + cid + '"><circle r="' + r.toFixed(1) + '"/></clipPath>' +
        '<image href="' + API + "?a=img&amp;id=" + encodeURIComponent(t.foto) + '" x="' + (-r).toFixed(1) + '" y="' + (-r).toFixed(1) + '" width="' + (r * 2).toFixed(1) + '" height="' + (r * 2).toFixed(1) + '" preserveAspectRatio="xMidYMid slice" clip-path="url(#' + cid + ')"/>' +
        '<circle class="anel" r="' + r.toFixed(1) + '"/>';
    }
    /* O token selecionado ganha um halo que pulsa para fora: é a pista de que ele aguarda o destino. */
    var halo = cfg.sel === t.id ? '<circle class="halo" r="' + (r * 1.1).toFixed(1) + '"/>' : "";
    h += '<g class="' + cls + '" data-tok="' + esc(t.id) + '" data-alvo="' + alvo + '" style="' + estilo + '">' +
      "<title>" + esc(t.nome || "") + " (" + coordNome(x, y) + ")</title>" + halo + forma +
      '<text text-anchor="middle" dy=".35em" font-size="' + (r * 0.8).toFixed(1) + '">' + (t.tipo === "armadilha" ? "!" : esc(iniciais(t.nome))) + "</text>" + fotoSvg + barra + "</g>";
  });
  svg.setAttribute("viewBox", "0 0 " + W + " " + H);
  svg.innerHTML = h;
  posTokAnt = novosPos;
  if (deslizar.length) {
    tabAnimFim = Date.now() + durMax * 1000;
    agendarQuadro(function () {
      var gs = svg.querySelectorAll ? svg.querySelectorAll(".token") : [];
      for (var k = 0; k < gs.length; k++) {
        if (deslizar.indexOf(gs[k].getAttribute("data-tok")) !== -1) gs[k].style.transform = gs[k].getAttribute("data-alvo");
      }
    });
  }
  tabGeo = { W: W, H: H, cols: cols, rows: rows, cw: cw, ch: ch };
  var caixa = caixaTab();
  if (caixa) { if (caixa.style && caixa.style.setProperty) caixa.style.setProperty("--ar", (W / H).toFixed(4)); ligarZoom(caixa); aplicarZoom(false); }
  /* Roda a cada desenho, não só no primeiro: com a imagem já no cache o desenho é imediato, e é aqui que os
     controles (arrastar, clicar nas casas) são religados. */
  if (cfg.depois) cfg.depois();
  return tabGeo;
}

/* Casa do grid sob o ponteiro (mouse ou dedo). */
function celulaTab(svg, ev) {
  if (!tabGeo) return null;
  var rc = svg.getBoundingClientRect();
  if (!rc || !rc.width || !rc.height) return null;
  /* O retângulo já reflete o zoom e o deslocamento aplicados por CSS, então a conta vale com o mapa ampliado. */
  var x = (ev.clientX - rc.left) / rc.width * tabGeo.W, y = (ev.clientY - rc.top) / rc.height * tabGeo.H;
  return { x: Math.max(0, Math.min(tabGeo.cols - 1, Math.floor(x / tabGeo.cw))), y: Math.max(0, Math.min(tabGeo.rows - 1, Math.floor(y / tabGeo.ch))) };
}

/* ============================ ZOOM E TELA CHEIA ============================ */

/* Pinça com dois dedos para aproximar, e um dedo para mover o mapa ampliado. No computador: Ctrl + roda do mouse, arrastar
   e os botões + − Ajustar. O zoom é só visual (transform em CSS): o grid, os tokens e os cliques seguem a mesma conta. */
var zoomTab = { z: 1, tx: 0, ty: 0 };
var zoomGesto = false, zoomSuprimir = false;
var ZOOM_MAX = 6;

function caixaTab() { return document.querySelector ? document.querySelector(".tab-box") : null; }
function limiteZoom(z) { return Math.max(1, Math.min(ZOOM_MAX, z)); }
function origemTab(box) {
  var tab = box.querySelector(".tab"), r = box.getBoundingClientRect();
  return { x: r.left + (tab ? tab.offsetLeft : 0), y: r.top + (tab ? tab.offsetTop : 0) };
}

function aplicarZoom(suave) {
  var box = caixaTab(), tab = box && box.querySelector ? box.querySelector(".tab") : null;
  if (!box || !tab) return;
  var z = zoomTab.z, w = tab.offsetWidth || box.clientWidth, h = tab.offsetHeight || box.clientHeight;
  zoomTab.tx = Math.min(0, Math.max(w * (1 - z), zoomTab.tx));
  zoomTab.ty = Math.min(0, Math.max(h * (1 - z), zoomTab.ty));
  tab.classList.toggle("suave", !!suave);
  tab.style.transform = z === 1 ? "" : "translate(" + zoomTab.tx.toFixed(1) + "px," + zoomTab.ty.toFixed(1) + "px) scale(" + z.toFixed(3) + ")";
  box.classList.toggle("zoom", z > 1);
  var bt = box.querySelector('[data-zoom="reset"]');
  if (bt) bt.textContent = z === 1 ? "Ajustar" : String(z.toFixed(1)).replace(".", ",") + "×";
}

/* Muda o zoom mantendo fixo o ponto do mapa que está sob (cx, cy), em coordenadas da tela. */
function zoomPara(novo, cx, cy, suave) {
  var box = caixaTab();
  if (!box) return;
  var o = origemTab(box), z0 = zoomTab.z;
  novo = limiteZoom(novo);
  var px = (cx - o.x - zoomTab.tx) / z0, py = (cy - o.y - zoomTab.ty) / z0;
  zoomTab.z = novo;
  zoomTab.tx = (cx - o.x) - px * novo;
  zoomTab.ty = (cy - o.y) - py * novo;
  aplicarZoom(suave);
}

function zoomBotao(k) {
  var box = caixaTab();
  if (!box) return;
  var r = box.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  if (k === "mais") zoomPara(zoomTab.z * 1.5, cx, cy, true);
  else if (k === "menos") zoomPara(zoomTab.z / 1.5, cx, cy, true);
  else if (k === "reset") { zoomTab.z = 1; zoomTab.tx = 0; zoomTab.ty = 0; aplicarZoom(true); }
  else if (k === "cheia") { if (emTelaCheia(box)) sairTelaCheia(); else entrarTelaCheia(); }
}

function ligarZoom(box) {
  if (box.dataset && box.dataset.zoomLigado) return;
  if (box.dataset) box.dataset.zoomLigado = "1";
  var ptrs = {}, modo = null, ini = null, soltarTudo = false;
  function lista() { return Object.keys(ptrs).map(function (k) { return ptrs[k]; }); }
  function ignorar(ev) { return !!(ev.target && ev.target.closest && ev.target.closest(".zoom-ctl, .tab-hud")); }
  box.addEventListener("pointerdown", function (ev) {
    if (ignorar(ev) || (ev.pointerType === "mouse" && ev.button !== 0)) return;
    zoomSuprimir = false;
    if (soltarTudo) return;
    ptrs[ev.pointerId] = { x: ev.clientX, y: ev.clientY, token: !!(ev.target.closest && ev.target.closest(".token")) };
    var ps = lista();
    if (ps.length === 2) {
      var dx = ps[0].x - ps[1].x, dy = ps[0].y - ps[1].y;
      ini = { d: Math.max(1, Math.sqrt(dx * dx + dy * dy)), z: zoomTab.z, tx: zoomTab.tx, ty: zoomTab.ty, mx: (ps[0].x + ps[1].x) / 2, my: (ps[0].y + ps[1].y) / 2 };
      modo = "pinca"; zoomGesto = true; zoomSuprimir = true;
    } else if (ps.length === 1 && zoomTab.z > 1 && !ps[0].token) {
      modo = "toque"; ini = { x: ev.clientX, y: ev.clientY, tx: zoomTab.tx, ty: zoomTab.ty };
    }
  });
  box.addEventListener("pointermove", function (ev) {
    var p = ptrs[ev.pointerId];
    if (!p) return;
    p.x = ev.clientX; p.y = ev.clientY;
    if (modo === "pinca") {
      var ps = lista();
      if (ps.length < 2) return;
      var dx = ps[0].x - ps[1].x, dy = ps[0].y - ps[1].y, d = Math.sqrt(dx * dx + dy * dy);
      var mx = (ps[0].x + ps[1].x) / 2, my = (ps[0].y + ps[1].y) / 2, o = origemTab(box), z = limiteZoom(ini.z * d / ini.d);
      var px = (ini.mx - o.x - ini.tx) / ini.z, py = (ini.my - o.y - ini.ty) / ini.z;
      zoomTab.z = z; zoomTab.tx = (mx - o.x) - px * z; zoomTab.ty = (my - o.y) - py * z;
      aplicarZoom(false);
    } else if (modo === "toque" || modo === "arrasta") {
      var ddx = ev.clientX - ini.x, ddy = ev.clientY - ini.y;
      if (modo === "toque") {
        if (Math.sqrt(ddx * ddx + ddy * ddy) < 6) return; /* ainda é um toque: não é arrasto */
        modo = "arrasta"; zoomGesto = true; zoomSuprimir = true;
        try { box.setPointerCapture(ev.pointerId); } catch (e) { /* sem captura: ignora */ }
      }
      zoomTab.tx = ini.tx + ddx; zoomTab.ty = ini.ty + ddy;
      aplicarZoom(false);
    }
  });
  function fim(ev) {
    delete ptrs[ev.pointerId];
    var n = Object.keys(ptrs).length;
    if (modo === "pinca" && n < 2) { modo = null; soltarTudo = true; } /* o dedo que sobrou não vira arrasto */
    if (n === 0) { modo = null; soltarTudo = false; setTimeout(function () { zoomGesto = false; }, 60); setTimeout(function () { zoomSuprimir = false; }, 400); }
  }
  box.addEventListener("pointerup", fim);
  box.addEventListener("pointercancel", fim);
  /* Depois de pinçar ou arrastar o mapa, o "clique" que o navegador gera não deve mover nem selecionar nada. */
  box.addEventListener("click", function (ev) {
    if (zoomSuprimir && !ignorar(ev)) { ev.stopPropagation(); ev.preventDefault(); zoomSuprimir = false; }
  }, true);
  box.addEventListener("wheel", function (ev) {
    if (!ev.ctrlKey) return; /* só Ctrl + roda (ou pinça do touchpad); a roda sozinha continua rolando a página */
    ev.preventDefault();
    zoomPara(zoomTab.z * Math.exp(-ev.deltaY * 0.01), ev.clientX, ev.clientY, false);
  }, { passive: false });
}

/* Tela cheia: usa a API do navegador; onde ela não existe (iPhone), cobre a janela inteira com CSS.
   Tenta travar em paisagem (só Android permite); nos demais aparece a dica para girar o aparelho. */
function emTelaCheia(box) { return !!(box && (document.fullscreenElement === box || box.classList.contains("cheia"))); }
function travarPaisagem() {
  try {
    var p = window.screen && screen.orientation && screen.orientation.lock ? screen.orientation.lock("landscape") : null;
    if (p && p.catch) p.catch(function () { /* o aparelho não deixa travar: fica a dica de girar */ });
  } catch (e) { /* sem suporte: ignora */ }
}
function pseudoCheia(box) {
  box.classList.add("cheia", "tc");
  document.body.classList.add("sem-rolagem");
  travarPaisagem();
  zoomTab = { z: 1, tx: 0, ty: 0 };
  aplicarZoom(false);
  atualizarHud();
}
function entrarTelaCheia() {
  var box = caixaTab();
  if (!box) return;
  var req = box.requestFullscreen || box.webkitRequestFullscreen, r = null;
  if (req) { try { r = req.call(box); } catch (e) { r = null; } }
  if (r && r.then) {
    r.then(function () { box.classList.add("tc"); travarPaisagem(); zoomTab = { z: 1, tx: 0, ty: 0 }; aplicarZoom(false); atualizarHud(); }, function () { pseudoCheia(box); });
  } else pseudoCheia(box);
}
function sairTelaCheia() {
  var box = caixaTab();
  if (!box) return;
  if (document.fullscreenElement && document.exitFullscreen) { try { document.exitFullscreen(); } catch (e) { /* ignora */ } }
  box.classList.remove("cheia", "tc");
  document.body.classList.remove("sem-rolagem");
  try { if (window.screen && screen.orientation && screen.orientation.unlock) screen.orientation.unlock(); } catch (e) { /* ignora */ }
  zoomTab = { z: 1, tx: 0, ty: 0 };
  aplicarZoom(false);
}
document.addEventListener("fullscreenchange", function () {
  var box = caixaTab();
  if (box && !document.fullscreenElement && !box.classList.contains("cheia")) { box.classList.remove("tc"); zoomTab = { z: 1, tx: 0, ty: 0 }; }
  aplicarZoom(false);
});
window.addEventListener("resize", function () { aplicarZoom(false); });

/* Barra dentro da tela cheia (o card de combate fica fora do mapa e não aparece): turno atual e o botão principal. */
function atualizarHud() {
  var h = document.getElementById("tabHud");
  if (!h) return;
  h.innerHTML = MESTRE ? MESTRE.hudHTML() : hudJogador();
}
function hudJogador() {
  var a = acaoPub, cb = a && a.combate, h = "";
  if (cb && cb.fase === "turnos") {
    var t = meuTok(), atual = (cb.ordem.filter(function (o) { return o.id === cb.atual; })[0] || {}).nome;
    h += "<span>Rodada " + cb.rodada + " · " + (cb.minhaVez ? "<b>sua vez!</b>" + (t ? " restam " + Math.max(0, (t.desl || 6) - (t.gasto || 0)) + " casas" : "") : (atual ? "turno de " + esc(atual) : "…")) + "</span>";
    if (cb.minhaVez) h += '<button type="button" class="primary" id="fimTurno">Encerrar turno</button>';
  } else if (cb && cb.fase === "ini") {
    h += "<span>Iniciativa: " + (cb.euPreciso ? "role no painel (saia da tela cheia)" : "aguardando os outros") + "</span>";
  }
  if (acaoMsg) h += '<span class="' + (acaoMsgErro ? "erro" : "") + '">' + esc(acaoMsg) + "</span>";
  return h;
}

function listaTokensHTML(tokens, meu) {
  if (!tokens.length) return "";
  return '<ul class="tok-lista">' + tokens.map(function (t) {
    var turnos = acaoPub && acaoPub.combate && acaoPub.combate.fase === "turnos";
    var mov = turnos && meu && t.id === meu && t.desl ? ", deslocamento " + t.desl + ", restam " + Math.max(0, t.desl - (t.gasto || 0)) : "";
    return '<li><span class="tok-cor" style="background:' + corToken(t) + '"></span>' + esc(t.nome || "Sem nome") + (t.tipo === "armadilha" ? " (armadilha)" : "") + " <small>" + coordNome(t.x | 0, t.y | 0) + (meu && t.id === meu ? ", você" : "") + mov + "</small></li>";
  }).join("") + "</ul>";
}

/* ============================ AÇÃO (JOGADOR) ============================ */

var acaoPub = null, acaoJson = "", acaoTimer = null, acaoGer = 0, acaoRodando = false, acaoMsg = "", acaoMsgErro = true, movendoJog = false, selJog = false;

function meuTok() {
  var r = null;
  if (acaoPub && acaoPub.eu) (acaoPub.tokens || []).forEach(function (t) { if (t.id === acaoPub.eu) r = t; });
  return r;
}

/* O que o jogador pode fazer agora. O servidor confere de novo: isto só evita cliques inúteis. */
function podeMover() {
  var a = acaoPub, t = meuTok();
  if (!a || !a.ativo || !t || t.morto) return false;
  var cb = a.combate;
  if (cb && cb.fase === "ini") return false;
  if (cb && cb.fase === "turnos") return !!cb.minhaVez && (t.desl || 6) - (t.gasto || 0) > 0;
  return a.livre !== false;
}

function acaoCombateHTML() {
  var a = acaoPub, cb = a.combate;
  if (!cb) return '<p class="mdica">' + (a.livre === false ? "O mestre travou o movimento por enquanto." : (a.eu ? "Arraste o seu token para se mover." : "Seu personagem ainda não está no mapa.")) + "</p>";
  var h = '<section class="panel cmb"><h3>' + ic("espada") + "Combate</h3>";
  if (cb.fase === "ini") {
    h += "<p>Hora de rolar a <b>iniciativa</b> (d20 + Destreza).</p>";
    if (cb.euPreciso) {
      h += '<div class="controls"><button type="button" class="primary" id="iniRolar">Rolar d20 + Destreza</button></div>' +
        '<div class="controls"><label class="tok-num">Rolou o dado físico? Valor total <input class="sorteio-in num" type="number" min="-20" max="80" id="iniValor"></label><button type="button" id="iniDigitar">Usar este valor</button></div>';
    } else if (cb.euIni != null) {
      h += "<p>Sua iniciativa: <b>" + cb.euIni + "</b>.</p>";
    }
    h += "<p class=\"mdica\">" + (cb.pendentes.length ? "Aguardando: " + cb.pendentes.map(esc).join(", ") + "." : "Todos os jogadores já rolaram. O mestre vai começar os turnos.") + "</p></section>";
    return h;
  }
  h += "<p><b>Rodada " + cb.rodada + "</b></p>";
  h += '<ol class="cmb-ordem">' + cb.ordem.map(function (o) {
    return '<li class="' + (o.id === cb.atual ? "atual" : "") + (o.morto ? " morto" : "") + (o.id === a.eu ? " eu" : "") + '">' + esc(o.nome) + (o.v != null ? " <small>" + o.v + "</small>" : "") + (o.id === cb.atual ? " ◀" : "") + "</li>";
  }).join("") + "</ol>";
  var t = meuTok();
  if (cb.minhaVez) {
    h += '<p class="vez"><b>É a sua vez!</b>' + (t ? " Você ainda pode andar " + Math.max(0, (t.desl || 6) - (t.gasto || 0)) + " casas (de " + (t.desl || 6) + ")." : "") + "</p>" +
      '<div class="controls"><button type="button" class="primary" id="fimTurno">Encerrar turno</button></div>';
  } else {
    h += '<p class="mdica">' + (cb.atual ? "Turno de " + esc((cb.ordem.filter(function (o) { return o.id === cb.atual; })[0] || {}).nome || "alguém") + "." : (cb.atualOculto ? "Algo se move nas sombras…" : "")) + "</p>";
  }
  return h + "</section>";
}

function acaoLogHTML() {
  var ev = (acaoPub && acaoPub.eventos) || [];
  return ev.length ? '<ul class="tok-log">' + ev.slice().reverse().map(function (e) { return "<li>" + esc(e) + "</li>"; }).join("") + "</ul>" : "";
}

function viewAcaoJogador() {
  var a = acaoPub;
  if (!a) return "<h1>Ação</h1><p class=\"mdica\">Carregando…</p>";
  if (!a.ativo) return '<div class="lock"><h1>Ação</h1><p>Nenhum mapa ativo agora. Quando o mestre abrir uma cena, ela aparece aqui e se atualiza sozinha.</p></div>';
  if (a.modo === "foto") {
    var u = API + "?a=cena_img&v=" + encodeURIComponent(a.img);
    return "<h1>" + esc(a.titulo || "Cena atual") + '</h1><figure class="foto-cena"><a href="' + u + '" target="_blank" rel="noopener"><img src="' + u + '" alt="' + esc(a.titulo || "Cenário") + '"></a></figure>' +
      (a.resumo ? '<p class="resumo lead">' + esc(a.resumo) + "</p>" : "");
  }
  return "<h1>" + esc(a.titulo || "Cena atual") + "</h1>" + (a.resumo ? '<p class="resumo">' + esc(a.resumo) + "</p>" : "") + '<p class="mdica">Cada casa tem 1,5 m. O movimento é só na horizontal e na vertical (sem diagonal). O mapa se atualiza sozinho enquanto esta aba estiver aberta.</p>' +
    '<p id="acaoMsg" role="status" class="mdica' + (acaoMsgErro ? " tok-aviso" : "") + '">' + esc(acaoMsg) + "</p>" +
    '<div class="acao-mapa"><div>' + tabuleiroHTML(API + "?a=cena_img&v=" + encodeURIComponent(a.img), a.titulo || "Mapa da cena") + '</div><aside class="acao-lado"><div id="acaoCombate">' + acaoCombateHTML() + "</div></aside></div>" +
    listaTokensHTML(a.tokens || [], a.eu) + '<div id="acaoLog">' + acaoLogHTML() + "</div>";
}

function mostrarAcaoMsg(txt, erro) {
  acaoMsg = txt; acaoMsgErro = !!erro;
  var m = document.getElementById("acaoMsg");
  if (m) { m.textContent = txt; m.classList.toggle("tok-aviso", !!erro); }
  atualizarHud();
}

/* Casas azuis do próprio token: o que resta de deslocamento no turno; fora de combate, o deslocamento por movimento. */
function alcanceJogador(cols, rows) {
  var t = meuTok();
  if (!selJog || !t || !podeMover()) return [];
  var cb = acaoPub.combate, resta = cb && cb.fase === "turnos" ? Math.max(0, (t.desl || 6) - (t.gasto || 0)) : (t.desl || 6);
  return celulasAlcance(acaoPub.tokens, t, resta, cols, rows);
}

function desenharAcaoJogador() {
  if (!acaoPub || !acaoPub.ativo || acaoPub.modo === "foto") return;
  var cb = acaoPub.combate;
  if (selJog && !podeMover()) selJog = false;
  desenharTabuleiro({ cols: acaoPub.cols, rows: acaoPub.rows, tokens: acaoPub.tokens, meu: acaoPub.eu, atual: cb ? cb.atual : null, sel: selJog ? acaoPub.eu : null, alcance: alcanceJogador, depois: ligarCliqueJog });
}

/* Mover = clicar no próprio token (aparecem as casas azuis) e depois clicar numa casa azul. Não precisa arrastar. */
function ligarCliqueJog() {
  var svg = document.getElementById("tabSvg");
  if (!svg || !tabGeo) return;
  if (!meuTok() || !podeMover()) { selJog = false; svg.onclick = null; return; }
  svg.onclick = function (ev) {
    if (movendoJog) return;
    var alvo = ev.target.closest ? ev.target.closest(".alc") : null;
    if (alvo) { moverJogadorPara(parseInt(alvo.getAttribute("data-ax"), 10), parseInt(alvo.getAttribute("data-ay"), 10), parseInt(alvo.getAttribute("data-ad"), 10)); return; }
    var g = ev.target.closest ? ev.target.closest(".token") : null;
    var t = meuTok();
    selJog = !!(g && t && g.dataset.tok === acaoPub.eu && !selJog);
    if (selJog) {
      var cb = acaoPub.combate, resta = cb && cb.fase === "turnos" ? Math.max(0, (t.desl || 6) - (t.gasto || 0)) : (t.desl || 6);
      mostrarAcaoMsg("Escolha uma casa azul para se mover (até " + resta + (resta === 1 ? " casa" : " casas") + ").", false);
    } else mostrarAcaoMsg("", false);
    desenharAcaoJogador();
  };
}

/* O token já desliza na hora (otimista). Se o servidor recusar, ele volta e o motivo aparece. */
function moverJogadorPara(x, y, custo) {
  var t = meuTok();
  if (!t) return;
  /* O custo vem da casa azul clicada (caminho livre mais curto, contornando tokens); sem ele, usa a distância reta. */
  var casas = custo > 0 ? custo : distMov(x, y, t.x, t.y), cb = acaoPub.combate, turnos = !!(cb && cb.fase === "turnos");
  var antes = { x: t.x, y: t.y, gasto: t.gasto };
  t.x = x; t.y = y;
  if (turnos) t.gasto = (t.gasto || 0) + casas;
  selJog = false; movendoJog = true;
  mostrarAcaoMsg("Movendo para " + coordNome(x, y) + "…", false);
  desenharAcaoJogador();
  api("campo_op", { op: "mover", x: x, y: y }).then(function () {
    mostrarAcaoMsg(coordNome(antes.x, antes.y) + " → " + coordNome(x, y) + ", " + casas + (casas === 1 ? " casa." : " casas.") + (turnos ? " Restam " + Math.max(0, (t.desl || 6) - (t.gasto || 0)) + "." : ""), false);
  }, function (e) {
    t.x = antes.x; t.y = antes.y; t.gasto = antes.gasto;
    mostrarAcaoMsg(e.message, true);
    desenharAcaoJogador();
  }).then(function () { movendoJog = false; return buscarAcaoAgora(true); });
}

function acaoAtualizarUI(trocouTela) {
  if (trocouTela) { renderizar(); return; }
  var c = document.getElementById("acaoCombate");
  var f = document.activeElement;
  if (c && !(f && c.contains(f) && /^(INPUT|TEXTAREA)$/.test(f.tagName))) c.innerHTML = acaoCombateHTML();
  var l = document.querySelector(".tok-lista"), lista = listaTokensHTML(acaoPub.tokens || [], acaoPub.eu);
  if (l) l.outerHTML = lista || '<ul class="tok-lista"></ul>';
  var g = document.getElementById("acaoLog");
  if (g) g.innerHTML = acaoLogHTML();
  var m = document.getElementById("acaoMsg");
  if (m && !movendoJog) { m.textContent = acaoMsg; m.classList.toggle("tok-aviso", acaoMsgErro); }
  desenharAcaoJogador();
  atualizarHud();
}

function pararAcao() { clearTimeout(acaoTimer); acaoTimer = null; acaoRodando = false; acaoGer++; }
function iniciarAcao() { if (!acaoRodando) { acaoRodando = true; buscarAcao(++acaoGer); } }

/* Busca a cena. Em combate, a cada 2 s; fora dele, a cada 4 s. Só redesenha quando algo mudou. */
function buscarAcaoAgora(forcar) {
  return api("acao").then(function (a) {
    var j = JSON.stringify(a);
    if (j === acaoJson) { if (forcar) acaoAtualizarUI(false); return; }
    var troc = !acaoPub || acaoPub.ativo !== a.ativo || acaoPub.modo !== a.modo || acaoPub.img !== a.img || acaoPub.titulo !== a.titulo;
    acaoJson = j;
    acaoPub = a;
    acaoAtualizarUI(troc);
  }, function () { /* sem conexão: tenta de novo no próximo ciclo */ });
}
function buscarAcao(ger) {
  if (ger !== acaoGer || MESTRE || !USUARIO || rotaAtual() !== "acao") return;
  var depois = function () { if (ger === acaoGer) acaoTimer = setTimeout(function () { buscarAcao(ger); }, acaoPub && acaoPub.combate ? 2000 : 4000); };
  if (document.hidden || movendoJog) { depois(); return; }
  buscarAcaoAgora().then(depois);
}

function acaoOpJogador(op, dados) {
  return api("campo_op", extras({ op: op }, dados || {})).then(function () { acaoMsg = ""; return buscarAcaoAgora(true); }, function (e) { acaoMsg = e.message; return buscarAcaoAgora(true); });
}

/* ============================ CONTA ============================ */

var API = "api.php";
var USUARIO = null, EST = {}, PUB = {}, IMAGENS = [], CONTAS = [], MESTRE = null;
var app = document.getElementById("app");
var mestreAberto = false;
var modoConta = "entrar", contaMsg = "";

function souMestre() { return !!USUARIO && USUARIO.papel === "mestre"; }
function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
function opcoes(lista, atual, valorIdx) {
  return lista.map(function (o, i) {
    var v = valorIdx ? i : (typeof o === "string" ? o : o[0]);
    var t = typeof o === "string" ? o : o[0];
    return '<option value="' + esc(v) + '"' + (String(v) === String(atual) ? " selected" : "") + ">" + esc(t) + "</option>";
  }).join("");
}

function api(acao, dados) {
  var op = { credentials: "same-origin", headers: { "X-Grimoria": "1" } };
  if (dados !== undefined) { op.method = "POST"; op.headers["Content-Type"] = "application/json"; op.body = JSON.stringify(dados); }
  return fetch(API + "?a=" + encodeURIComponent(acao), op).then(function (r) {
    return r.text().then(function (t) {
      var j = null;
      try { j = JSON.parse(t); } catch (x) { j = null; }
      if (j === null) {
        /* Não veio JSON: mostra o começo da resposta (aviso do PHP, página de erro da hospedagem...). */
        var e1 = new Error("O servidor respondeu algo inesperado (HTTP " + r.status + "): " + t.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300));
        e1.status = r.status;
        throw e1;
      }
      if (!r.ok) { var e = new Error(j.erro || "Falha na conexão (" + r.status + ")."); e.status = r.status; throw e; }
      return j;
    });
  });
}

/* Gravações em andamento ficam visíveis no topo da página. */
var pendentes = 0, timers = {};
function statusSalvo(txt, cls) {
  var s = document.getElementById("salvo");
  if (s) { s.textContent = txt; s.className = "salvo " + cls; }
}
function gravar(acao, dados) {
  pendentes++;
  statusSalvo("Salvando…", "salvando");
  return api(acao, dados).then(function (r) {
    pendentes--;
    if (!pendentes) statusSalvo("Salvo", "ok");
    return r;
  }, function (e) {
    pendentes--;
    statusSalvo(e.status === 401 ? "Sessão expirada: entre de novo" : "Não salvou: " + e.message, "falha");
    return null;
  });
}
function adiar(chave, fn, ms) {
  clearTimeout(timers[chave]);
  timers[chave] = setTimeout(function () { delete timers[chave]; fn(); }, ms || 700);
}
window.addEventListener("beforeunload", function (e) {
  if (pendentes || Object.keys(timers).length) { e.preventDefault(); e.returnValue = ""; }
});

function viewConta() {
  var reg = modoConta === "registrar";
  return '<div class="conta"><h1>' + (reg ? "Criar conta" : "Entrar") + "</h1>" +
    '<p class="lead">' + (reg ? "Crie sua conta. Depois, o mestre liga ela ao seu personagem." : "Entre para ver as regras, o seu grimório e o mapa da campanha.") + "</p>" +
    '<form id="formConta" class="panel" novalidate>' +
    (reg ? '<label class="pj-obs-l">Seu nome<input class="sorteio-in" name="nome" autocomplete="name" maxlength="80" required></label>' : "") +
    '<label class="pj-obs-l">E-mail<input class="sorteio-in" type="email" name="email" autocomplete="email" maxlength="190" required></label>' +
    '<label class="pj-obs-l">Senha' + (reg ? " (pelo menos 8 caracteres)" : "") + '<input class="sorteio-in" type="password" name="senha" autocomplete="' + (reg ? "new-password" : "current-password") + '" required></label>' +
    '<p id="contaMsg" role="alert" class="conta-msg">' + esc(contaMsg) + "</p>" +
    '<button type="submit" class="primary" id="contaEnviar">' + (reg ? "Criar conta" : "Entrar") + "</button></form>" +
    "<p>" + (reg ? 'Já tem conta? <button type="button" class="link" id="irEntrar">Entrar</button>'
      : 'Primeira vez aqui? <button type="button" class="link" id="irRegistrar">Criar conta</button>') + "</p></div>";
}

function enviarConta(form) {
  var d = { email: form.email.value.trim(), senha: form.senha.value };
  if (form.nome) d.nome = form.nome.value.trim();
  var msg = document.getElementById("contaMsg"), bt = document.getElementById("contaEnviar");
  if (!d.email || !d.senha || (form.nome && !d.nome)) { msg.textContent = "Preencha todos os campos."; return; }
  bt.disabled = true;
  msg.textContent = "";
  api(modoConta === "registrar" ? "registrar" : "entrar", d).then(function () {
    contaMsg = "";
    carregar(true);
  }, function (e) {
    bt.disabled = false;
    msg.textContent = e.message;
  });
}

function montarTopo() {
  var c = document.getElementById("conta");
  if (!c) return;
  c.innerHTML = USUARIO ? '<span class="conta-nome" title="' + esc(USUARIO.email) + '">' + esc(USUARIO.nome) + (souMestre() ? " (mestre)" : "") + '</span><button type="button" id="sairBtn">Sair</button>' : "";
}

function carregarScript(src) {
  return new Promise(function (ok, falha) {
    var s = document.createElement("script");
    s.src = src;
    s.onload = ok;
    s.onerror = function () { falha(new Error("Não consegui carregar o conteúdo do mestre.")); };
    document.body.appendChild(s);
  });
}

function carregar(aposLogin) {
  app.innerHTML = '<p class="mdica">Carregando…</p>';
  api("inicio").then(function (d) {
    USUARIO = d.usuario;
    if (!USUARIO) {
      if (aposLogin) contaMsg = "A conta foi aceita, mas o servidor não manteve a sessão. Provável causa: a pasta de sessões do PHP na hospedagem não é gravável.";
      renderizar();
      return;
    }
    IMAGENS = d.imagens || [];
    if (USUARIO.papel === "mestre") {
      EST = d.estado || {};
      CONTAS = d.usuarios || [];
      return (MESTRE ? Promise.resolve() : carregarScript(API + "?a=mestre.js")).then(function () {
        MESTRE.iniciar(d);
        renderizar();
      });
    }
    PUB = { jogador: d.jogador, grimorio: d.grimorio, locais: d.locais || [], vilaBonus: d.vilaBonus || "" };
    renderizar();
  }).catch(function (e) {
    app.innerHTML = '<div class="lock"><h1>Sem conexão</h1><p>' + esc(e.message) + '</p><p><button type="button" class="primary" id="tentarDeNovo">Tentar de novo</button></p></div>';
  });
}

/* ============================ ROTEAMENTO ============================ */

var VIEWS = [
  ["inicio", "Início", "casa"], ["perfil", "Perfil", "grupo"], ["meu-grimorio", "Meu grimório", "livro"], ["acao", "Ação", "espada"], ["regras", "Regras", "prancheta"], ["niveis", "Níveis", "cima"],
  ["vilarejos", "Vilarejos", "pino"], ["mapa", "Mapa", "bussola"]
];
var VIEWFN = {
  "inicio": viewInicioJogador, "perfil": viewPerfil, "meu-grimorio": viewMeuGrimorio, "acao": viewAcaoJogador, "regras": viewRegras, "niveis": viewNiveis, "vilarejos": viewVilarejos, "mapa": viewMapa
};
function listaViews() { return MESTRE ? MESTRE.views : VIEWS; }

function rotaAtual() {
  var r = (location.hash || "").replace(/^#/, "");
  return listaViews().some(function (v) { return v[0] === r; }) ? r : "inicio";
}

/* Menu em grupos. Cada item é o id de uma aba, ou um grupo ({ g: nome, i: ids }) que abre uma lista. */
var NAV_JOGADOR = ["inicio", "perfil", "meu-grimorio", "acao", { g: "Guia", i: ["regras", "niveis", "vilarejos", "mapa"] }];
function navAtual() { return MESTRE ? MESTRE.nav : NAV_JOGADOR; }
function viewInfo(id) { var r = null; listaViews().forEach(function (v) { if (v[0] === id) r = v; }); return r; }
function linkNav(id, atual) {
  var v = viewInfo(id);
  return v ? '<a href="#' + id + '"' + (id === atual ? ' aria-current="page"' : "") + ">" + ic(v[2]) + v[1] + "</a>" : "";
}

function fecharMenus(tudo) {
  document.querySelectorAll("#nav .submenu").forEach(function (m) { m.hidden = true; });
  document.querySelectorAll("#nav .grupo-btn").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
  if (tudo) {
    var h = document.querySelector("header.top"), mb = document.getElementById("menuBtn");
    if (h) h.classList.remove("menu-aberto");
    if (mb) mb.setAttribute("aria-expanded", "false");
  }
}

function montarNav(atual) {
  document.getElementById("nav").innerHTML = USUARIO ? navAtual().map(function (n, k) {
    if (typeof n === "string") return "<li>" + linkNav(n, atual) + "</li>";
    return '<li class="grupo' + (n.i.indexOf(atual) !== -1 ? " ativo" : "") + '"><button type="button" class="grupo-btn" aria-haspopup="true" aria-expanded="false" data-grupo="' + k + '">' + n.g + ' <span aria-hidden="true">▾</span></button>' +
      '<ul class="submenu" hidden>' + n.i.map(function (id) { return "<li>" + linkNav(id, atual) + "</li>"; }).join("") + "</ul></li>";
  }).join("") : "";
  document.getElementById("menuBtn").hidden = !USUARIO;
  fecharMenus(true);
}

/* Com a imersão ou o combate ativos, a aba Ação usa a largura toda e o card de combate desce para baixo do mapa. */
function imersivoAtivo() {
  if (!USUARIO || rotaAtual() !== "acao") return false;
  if (MESTRE) return !!(acaoEst().ativo || CAMPO.combate);
  return !!(acaoPub && acaoPub.ativo);
}
function marcarImersivo() { app.classList.toggle("imersivo", imersivoAtivo()); }

function renderizar() {
  montarTopo();
  if (!USUARIO) {
    marcarImersivo();
    montarNav("");
    app.innerHTML = viewConta();
    document.title = (modoConta === "registrar" ? "Criar conta" : "Entrar") + " | Grimório do Mestre";
    return;
  }
  var r = rotaAtual();
  montarNav(r);
  if (MESTRE) MESTRE.antes(r);
  app.innerHTML = VIEWFN[r]();
  if (MESTRE) MESTRE.depois(r);
  if (r === "mapa") desenharMapa();
  marcarImersivo();
  if (r === "acao" && !MESTRE) { desenharAcaoJogador(); iniciarAcao(); }
  if (r !== "acao" && acaoRodando) pararAcao();
  document.title = (listaViews().filter(function (v) { return v[0] === r; })[0][1]) + " | Grimório do Mestre";
}

window.addEventListener("hashchange", function () { renderizar(); window.scrollTo(0, 0); });

/* ============================ EVENTOS ============================ */

app.addEventListener("change", function (e) {
  if (MESTRE) { MESTRE.change(e.target); return; }
  if (e.target.id === "perfilImg") enviarRetrato(e.target);
  else if (e.target.dataset && e.target.dataset.pf) salvarPerfil(e.target);
  else if (e.target.dataset && e.target.dataset.pbonus && PUB.jogador) {
    var j = PUB.jogador;
    j.bonus = j.bonus || {};
    j.bonus[e.target.dataset.pbonus] = Math.max(-5, Math.min(10, parseInt(e.target.value, 10) || 0));
    gravar("perfil_bonus", { bonus: j.bonus });
    renderizar();
  }
});

app.addEventListener("input", function (e) {
  if (MESTRE) { MESTRE.input(e.target); return; }
  if (e.target.dataset && e.target.dataset.pf) salvarPerfil(e.target);
});

app.addEventListener("submit", function (e) {
  if (e.target.id === "formConta") { e.preventDefault(); enviarConta(e.target); }
});

app.addEventListener("click", function (e) {
  var mk = e.target.closest ? e.target.closest(".marker") : null;
  if (mk && mk.dataset && mk.dataset.id) { selecionarLocal(mk.dataset.id); return; }
  var b = e.target.closest("button");
  if (!b) return;
  if (b.id === "irEntrar" || b.id === "irRegistrar") { modoConta = b.id === "irRegistrar" ? "registrar" : "entrar"; contaMsg = ""; renderizar(); return; }
  if (b.id === "tentarDeNovo") { carregar(); return; }
  if (b.dataset.zoom) { zoomBotao(b.dataset.zoom); return; }
  if (b.id === "iniRolar") { b.disabled = true; acaoOpJogador("ini", { rolar: true }); return; }
  if (b.id === "iniDigitar") {
    var vi = parseInt((document.getElementById("iniValor") || {}).value, 10);
    if (isNaN(vi)) { acaoMsg = "Digite o valor total da sua iniciativa (d20 + Destreza)."; acaoAtualizarUI(false); return; }
    b.disabled = true;
    acaoOpJogador("ini", { valor: vi });
    return;
  }
  if (b.id === "fimTurno") { b.disabled = true; acaoOpJogador("fim_turno"); return; }
  if (b.dataset.atrStep && PUB.jogador && !PUB.jogador.atrTravado) {
    var k = b.dataset.atrStep, d = parseInt(b.dataset.d, 10), soma = atrRasc.poder + atrRasc.destreza + atrRasc.inteligencia;
    var novo = atrRasc[k] + d;
    if (novo >= 0 && novo <= 3 && soma + d <= 5) atrRasc[k] = novo;
    renderizar();
    return;
  }
  if (b.id === "perfilSalvarAtr" && PUB.jogador && !PUB.jogador.atrTravado) {
    var copia = { poder: atrRasc.poder, destreza: atrRasc.destreza, inteligencia: atrRasc.inteligencia };
    if (copia.poder + copia.destreza + copia.inteligencia !== 5) return;
    b.disabled = true;
    gravar("perfil_atributos", { atr: copia }).then(function (r) {
      if (r) { PUB.jogador.atr = copia; PUB.jogador.atrTravado = true; perfilMsg = "Atributos salvos. A base agora está travada."; }
      else perfilMsg = "Não foi possível salvar os atributos. Veja o aviso no topo da página.";
      renderizar();
    });
    return;
  }
  if (b.id === "perfilImgDel" && PUB.jogador) {
    gravar("perfil_img_remover", {}).then(function (r) { if (r) { PUB.jogador.img = null; perfilMsg = "Retrato removido."; renderizar(); } });
    return;
  }
  if (MESTRE && MESTRE.click(b)) return;
  if (b.dataset.mtipo) {
    filtroMapa = b.dataset.mtipo;
    document.querySelectorAll("#fMapa .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.mtipo === filtroMapa)); });
    desenharMapa();
  }
});

app.addEventListener("keydown", function (e) {
  if ((e.key === "Enter" || e.key === " ") && e.target.classList && e.target.classList.contains("marker")) {
    e.preventDefault();
    selecionarLocal(e.target.dataset.id);
  }
});

document.getElementById("nav").addEventListener("click", function (e) {
  var b = e.target.closest ? e.target.closest(".grupo-btn") : null;
  if (b) {
    var abrir = b.getAttribute("aria-expanded") !== "true";
    fecharMenus();
    if (abrir) { b.setAttribute("aria-expanded", "true"); if (b.nextElementSibling) b.nextElementSibling.hidden = false; }
    return;
  }
  if (e.target.closest && e.target.closest("a")) fecharMenus(true);
});
document.getElementById("menuBtn").addEventListener("click", function () {
  var h = document.querySelector("header.top");
  if (!h) return;
  var aberto = h.classList.toggle("menu-aberto");
  document.getElementById("menuBtn").setAttribute("aria-expanded", String(aberto));
});
document.addEventListener("click", function (e) {
  if (!e.target.closest || !e.target.closest("#nav, #menuBtn")) fecharMenus();
});
document.addEventListener("keydown", function (e) { if (e.key === "Escape") fecharMenus(); });

document.getElementById("conta").addEventListener("click", function (e) {
  if (!e.target.closest || !e.target.closest("#sairBtn")) return;
  api("sair", {}).then(function () { location.hash = ""; location.reload(); }, function () { location.reload(); });
});

document.getElementById("themeBtn").addEventListener("click", function () {
  var root = document.documentElement;
  var escuro = root.getAttribute("data-theme") === "dark" ||
    (!root.getAttribute("data-theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.setAttribute("data-theme", escuro ? "light" : "dark");
});

carregar();
