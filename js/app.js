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
  tesouro: '<path d="M4 10h16v10H4z"/><path d="M4 10a8 5 0 0116 0"/><path d="M12 13v3"/>',
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
  mochila: '<path d="M9 5a3 3 0 016 0"/><rect x="5" y="6" width="14" height="15" rx="4"/><path d="M9 13h6M9 17h6"/>',
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
    (g.reservado && !paraJogador ? '<span class="tag role" title="Fora do sorteio: o mestre entrega à mão">Reservado</span>' : "") +
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
    ["<b>Inteligência</b>", "Suporte, cura, controle, conhecimento, percepção e manter feitiços de efeito contínuo (barreiras, auras, invocações)."]
  ]);

  h += "<h2>Criar o personagem</h2>" + panel("Números", "<ul>" +
    "<li><b>Treino prévio:</b> distribua +5 pontos entre os atributos, no máximo +3 em um. Isso é feito antes de ver o grimório.</li>" +
    "<li><b>Vida:</b> 20.</li><li><b>Mana:</b> 10, mais 1 a cada 2 pontos de Inteligência.</li>" +
    "<li><b>Defesa:</b> 10 + Destreza.</li>" +
    "<li><b>Redução de dano:</b> 1 para cada 2 pontos de Poder (Poder 2 = 1, Poder 4 = 2; o dano mínimo é sempre 1).</li>" +
    "<li><b>Deslocamento:</b> 6 casas por turno, mais 1 a cada 2 pontos de Destreza.</li>" +
    '<li>Ao subir de nível, veja a aba <a href="#niveis">Níveis</a>.</li></ul>');

  h += "<h2>Rolagens</h2>" + panel("Teste", "<p>Role d20 + atributo contra a dificuldade que o mestre define. Exemplo: um salto usa Poder, não Atletismo.</p>" +
    table(["Dificuldade", "Valor"], [["Fácil", "10"], ["Média", "15"], ["Difícil", "20"]]) +
    "<p><b>Vantagem e desvantagem:</b> com vantagem, role dois d20 e fique com o maior. Com desvantagem, role dois e fique com o menor. Vantagens e desvantagens não se acumulam: se houver das duas, uma anula a outra.</p>");

  h += "<h2>Combate</h2>" + panel("Como começar",
    "<ol><li>O mestre anuncia o combate e descreve a cena.</li>" +
    "<li><b>Iniciativa:</b> cada jogador rola d20 + Destreza. A ordem fica visível na mesa, do maior para o menor.</li>" +
    "<li>Em cada turno: 1 movimento e 1 ação. Depois de todos agirem, começa uma nova rodada na mesma ordem.</li></ol>");

  h += panel("Acertar e causar dano", "<p>São dois passos separados. Primeiro se verifica se acertou. Só depois se calcula o dano.</p>" +
    table(["Momento", "Rolagem", "Compara com"], [
      ["Acertou?", "d20 + ataque", "Defesa do alvo (jogador: 10 + Destreza; bandido: 10)"],
      ["Quanto de dano?", "dado de dano", "Nada. Se o alvo é jogador, subtrai a redução de dano dele (1 para cada 2 de Poder; mínimo 1)."]
    ]) +
    "<p><b>Exemplo:</b> a Lia (Destreza +3, Poder +2) tem Defesa 13. O bandido rola 12 + 2 = 14 e acerta. Rola o dano: 1d6 + 1 = 5. Ela subtrai a redução de dano (Poder 2 = 1) e perde 4 de vida.</p>" +
    "");

  h += panel("Ataque com arma", "<p>Atacar com uma arma não gasta mana e usa a sua ação. Role d20 + <b>Poder</b> (arma corpo a corpo, pesada ou de duas mãos) ou d20 + <b>Destreza</b> (arma à distância, leve, de acuidade ou de arremesso) contra a Defesa do alvo. Se acertar, role o dado da arma (sem somar atributo, como nos feitiços). Você escolhe qual dos dois usar quando a arma for leve ou de acuidade.</p>");

  h += "<h2>Mana</h2>" + panel("Custos e recuperação", "<ul><li>Mana máxima: 10, mais 1 a cada 2 pontos de Inteligência.</li><li>Custo: cada feitiço mostra o próprio custo no card. Eles variam: alguns custam mais, outros menos.</li><li>Recupera 1 por turno em combate, ou tudo em um descanso.</li></ul>");

  h += "<h2>Vida, queda e descanso</h2>" + panel(ic("coracao") + "Cair a 0 de Vida",
    "<ol><li>Ao chegar a <b>0 de Vida</b>, o personagem <b>cai</b>: fica inconsciente, não age e não se move.</li>" +
    "<li>Ele tem <b>3 salvaguardas</b>. No início de cada turno dele, role um d20 (sem somar atributo): <b>10 ou mais</b> é um sucesso, <b>9 ou menos</b> é uma falha.</li>" +
    "<li><b>3 sucessos:</b> ele estabiliza. Continua caído, mas fora de perigo, e volta com 1 de Vida quando o combate acabar. <b>3 falhas:</b> o personagem morre.</li>" +
    "<li>Um <b>20</b> no d20 levanta o personagem na hora, com 1 de Vida. Um <b>1</b> conta como 2 falhas.</li>" +
    "<li>Sofrer dano enquanto está caído conta como 1 falha.</li>" +
    "<li>Qualquer cura (feitiço, poção, erva) levanta o personagem e zera as salvaguardas. O Kit de curandeiro estabiliza um aliado caído sem precisar de salvaguarda.</li></ol>") +
    panel(ic("ampulheta") + "Descanso",
      "<p>Um descanso é uma pausa longa fora de combate (uma noite no acampamento, numa estalagem ou em casa). Quem descansa recupera <b>toda a Vida e toda a Mana</b>. O mestre decide quando a situação permite descansar.</p>");

  h += "<h2>Deslocamento</h2>" + panel("Com mapa e sem mapa",
    "<ul><li><b>Com mapa:</b> 6 casas por turno (1 casa = 1,5 m). Perder 2 de deslocamento deixa o alvo com 4. Dobrar deixa com 12.</li>" +
    "<li><b>Sem diagonal:</b> o movimento é só na horizontal e na vertical, e cada passo reto custa 1 casa. A diagonal só vale para alcançar um alvo no combate, nunca para andar.</li><li><b>Teatro da mente:</b> use faixas de distância (corpo a corpo, perto, longe). “Perder deslocamento” vira gastar um movimento a mais para se aproximar.</li>" +
    "<li>Com deslocamento 0 o alvo fica imobilizado, mas ainda pode atacar e lançar feitiços.</li></ul>");

  h += "<h2>Itens e carga</h2>" + panel(ic("mochila") + "Inventário",
    "<ul><li><b>Capacidade:</b> 20 kg + 5 kg por ponto de Poder. Acima disso, você fica sobrecarregado: -1 de deslocamento a cada 5 kg a mais.</li>" +
    "<li><b>Equipado:</b> só os itens marcados como equipados dão bônus (Defesa, deslocamento, mana). Conta <b>uma</b> armadura e <b>um</b> escudo, o de maior Defesa.</li>" +
    "<li>Armaduras pesadas atrapalham o movimento (-1 de deslocamento).</li></ul>");

  h += "<h2>Dano contínuo</h2>" + panel(ic("ampulheta") + "Resistência a cada turno",
    "<p>Feitiços com dano contínuo (veneno, queimadura, sangramento) têm um aviso no card. A cada turno do alvo:</p>" +
    "<ol><li>No início do turno dele, o alvo rola a resistência indicada no card (por exemplo, Poder contra 12), se o efeito permitir.</li>" +
    "<li>Se passar, ele evita o dano daquele turno. Se falhar, sofre o dano normalmente.</li>" +
    "<li>Sugestão: se passar por 5 ou mais, o efeito termina.</li></ol>" +
    "<p>Alguns efeitos não podem ser resistidos. O card avisa quando for assim.</p>");

  if (MESTRE) h += MESTRE.regrasExtra();

  return h + "</div>";
}

/* ============================ CAMINHOS DE MANA ============================ */

/* Técnicas de mana: independentes do grimório (como o reforço do corpo e o encantamento de armas em Black Clover). O personagem aprende
   um caminho quando a história permitir, com a aprovação do mestre. As técnicas são um extra: não tiram nada do crescimento do grimório. */
var CAMINHOS = [
  { id: "reforco", nome: "Reforço de Mana", attr: "poder", ideia: "Mana espalhada pelo corpo: mais resistência e mais força nos golpes. Quem confia no físico.",
    combina: "Fortaleza, Reforço, Aço, Ira do Leão, Lâminas",
    tecnicas: [
      { nome: "Pele de Mana", custo: 1, tipo: "básico", texto: "Até o fim do seu próximo turno, +1 de redução de dano e +1 de Defesa." },
      { nome: "Punho de Mana", custo: 2, tipo: "médio", texto: "O seu próximo ataque (com arma ou sem) causa +1d6 de dano e empurra o alvo 1 casa." },
      { nome: "Corpo de Mana Pleno", custo: 4, tipo: "ultimate", texto: "Por 3 turnos, +2 de redução de dano e +2 de dano nos ataques corpo a corpo. Você não pode ser derrubado nem empurrado." }
    ]
  },
  { id: "zona", nome: "Zona de Mana", attr: "destreza", ideia: "Sentir a mana ao redor: criaturas, feitiços, armadilhas, golpes antes de acontecerem. Quem confia na percepção.",
    combina: "Sombras, Vento, Névoa, Espelho, Raios",
    tecnicas: [
      { nome: "Sentir Mana", custo: 1, tipo: "básico", texto: "Por 2 turnos, você percebe criaturas e feitiços ativos, mesmo escondidos ou invisíveis, até longe. Ninguém surpreende você." },
      { nome: "Antecipação", custo: 2, tipo: "médio", texto: "Por 2 turnos, os ataques à distância contra você têm -2 e você ganha +2 nos testes para evitar armadilhas e efeitos de área." },
      { nome: "Zona de Mana", custo: 4, tipo: "ultimate", texto: "Por 3 turnos, uma zona de 3 casas em volta de você: você e os aliados dentro dela ganham +2 de Defesa. Invisíveis e ilusões dentro da zona são revelados." }
    ]
  },
  { id: "encantamento", nome: "Encantamento", attr: "inteligencia", ideia: "Pôr mana nas armas e nas armaduras, as suas ou as dos aliados. Efeito que dura exige muito controle, por isso é de Inteligência.",
    combina: "Lâminas, Aço, Mercúrio, Fogo Régio, Gelo, qualquer grimório que aplique um estado",
    regra: "Só um encantamento ativo por vez (dois, se a Inteligência for 4 ou mais). Só vale em item equipado (marcado no Inventário).",
    tecnicas: [
      { nome: "Afiar com Mana", custo: 1, tipo: "básico", texto: "Por 3 turnos, a arma equipada (sua ou de um aliado perto) causa +1d4 de dano e conta como mágica." },
      { nome: "Reforçar Armadura", custo: 2, tipo: "médio", texto: "Por 3 turnos, a armadura ou o escudo equipado (seu ou de um aliado perto) dá +1 de Defesa e +1 de redução de dano." },
      { nome: "Imbuir", custo: 4, tipo: "ultimate", texto: "Por 3 turnos, uma arma equipada ganha o elemento do seu grimório: os ataques com ela causam +1d6 de dano e aplicam o estado que o grimório aplica (como Em chamas ou Molhado). O alvo faz teste de Inteligência contra 13 para evitar o estado." }
    ]
  }
];
function caminhoPorId(id) { var r = null; CAMINHOS.forEach(function (c) { if (c.id === id) r = c; }); return r; }
function caminhoCardHTML(c, qtd, mestre) {
  var a = ATTR[c.attr];
  var h = '<article class="book" style="--attr:' + a.cor + '"><header><h3>' + c.nome + '</h3><div class="meta"><span class="tag" style="--attr:' + a.cor + '">' + ic(ATTR_ICON[c.attr]) + a.nome + "</span><span>Caminho de mana</span></div></header><p>" + c.ideia + "</p>";
  var lista = typeof qtd === "number" ? c.tecnicas.slice(0, qtd) : c.tecnicas;
  h += '<ul class="spells">' + lista.map(function (t, i) { return spellItem(t, i + 1); }).join("") + "</ul>";
  if (c.regra && (typeof qtd !== "number" || qtd > 0)) h += '<p class="mdica"><b>Regra:</b> ' + c.regra + "</p>";
  if (typeof qtd !== "number") h += '<p class="mdica"><b>Combina com:</b> ' + c.combina + ".</p>";
  if (mestre && typeof CAMINHO_NOTAS !== "undefined" && CAMINHO_NOTAS[c.id]) h += '<p class="bnote">' + CAMINHO_NOTAS[c.id] + "</p>";
  return h + "</article>";
}
/* Texto de regra, igual para o jogador e para o mestre. */
function caminhosHTML(mestre) {
  var h = "<h2>Caminhos de mana</h2>" + panel(ic("brilho") + "Aprender uma técnica de mana",
    "<p>Além do grimório, um personagem pode aprender um <b>caminho de mana</b>: técnicas que não dependem do grimório (como reforçar o corpo ou encantar uma arma). Isso <b>não é sorteado</b>: acontece quando a história faz sentido (um mentor, um treino, ruínas antigas, um item raro) e o mestre aprova.</p>" +
    "<ul><li><b>Um caminho só</b> por personagem, a partir do nível 3.</li>" +
    "<li><b>As técnicas não substituem nada:</b> o grimório continua crescendo normalmente (aprimorar, nova habilidade, despertar). O caminho é um extra.</li>" +
    "<li><b>Ritmo:</b> a 1ª técnica pode vir a partir do nível 3, a 2ª a partir do nível 4 e a 3ª a partir do nível 5, sempre na ordem. Cada uma só depende de uma cena de aprendizado e da aprovação do mestre, então ele controla quando chega.</li>" +
    "<li>As técnicas gastam a mesma mana dos feitiços e funcionam mesmo sem usar o atributo do grimório.</li></ul>");
  return h + '<div class="grid">' + CAMINHOS.map(function (c) { return caminhoCardHTML(c, null, mestre); }).join("") + "</div>";
}
/* No Meu grimório, o jogador vê só as técnicas que já aprendeu. */
function meuCaminhoHTML(j) {
  var c = j && j.caminho ? caminhoPorId(j.caminho) : null;
  var q = Math.max(0, Math.min(3, parseInt(j && j.caminhoTec, 10) || 0));
  if (!c || !q) return "";
  return "<h2>Meu caminho de mana</h2>" + '<div class="cer-card">' + caminhoCardHTML(c, q, false) + "</div>";
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
  return h + caminhosHTML(false);
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

function criarPersonagemHTML() {
  return '<div class="note"><p><b>Você ainda não tem um personagem.</b> Dê um nome a ele para começar; depois você distribui os atributos e conta a sua história no Perfil.</p>' +
    '<p><label>Nome do personagem <input class="sorteio-in" type="text" id="novoPersonagem" maxlength="60" autocomplete="off"></label></p>' +
    '<p><button type="button" class="primary" id="criarPersonagem">Criar personagem</button> <span id="criarMsg" role="status" class="mdica"></span></p></div>';
}

function criarPersonagem() {
  var i = document.getElementById("novoPersonagem"), b = document.getElementById("criarPersonagem"), m = document.getElementById("criarMsg");
  var nome = i ? i.value.trim() : "";
  if (!nome) { if (m) m.textContent = "Dê um nome ao personagem."; return; }
  if (b.disabled) return;
  b.disabled = true;
  api("perfil_criar", { personagem: nome }).then(function () { carregar(); }, function (e) { b.disabled = false; if (m) m.textContent = e.message; });
}

function viewInicioJogador() {
  var j = PUB.jogador;
  var h = "<h1>Olá, " + esc(USUARIO.nome) + "</h1>" +
    '<p class="lead">Bem-vindo à campanha. Aqui ficam as regras, o seu grimório e o mapa do que o grupo já descobriu. O mestre vai liberando o resto aos poucos.</p>';
  if (!j) {
    return h + criarPersonagemHTML() + atalhosJogador();
  }
  if (!j.questionarioFeito) h += '<div class="note"><p><b>Falta responder o questionário do grimório.</b> São 5 perguntas rápidas, e o mestre usa as respostas na cerimônia. <a href="#perfil">Responder agora</a></p></div>';
  if (j.kit) h += '<div class="note"><p><b>Falta escolher o seu kit inicial.</b> Você monta a mochila do seu personagem uma única vez. <a href="#inventario">Escolher agora</a></p></div>';
  var url = j.img ? imgUrl(j.img) : "";
  h += '<div class="pj-form"><div class="pj-lado">' +
    (url ? '<img class="pj-avatar grande" src="' + url + '" alt="Imagem de ' + esc(j.personagem || j.nome || "personagem") + '">' : '<span class="pj-avatar grande vazio" aria-hidden="true">' + ic("grupo") + "</span>") +
    '</div><div class="pj-campos"><h2 style="margin-top:0">' + esc(j.personagem || "Personagem sem nome") + "</h2>";
  var campos = [["Jogador", j.nome], ["Vilarejo", j.vila], ["Altura", j.altura], ["Descrição", j.descricao], ["Sonho ou objetivo", j.sonho], ["Medo ou fraqueza", j.medo]];
  if (j.caminho && caminhoPorId(j.caminho)) campos.push(["Caminho de mana", caminhoPorId(j.caminho).nome + " (" + Math.max(0, Math.min(3, parseInt(j.caminhoTec, 10) || 0)) + " de 3 técnicas)"]);
  if (j.atrTravado) campos.push(["Atributos", ATRS.map(function (a) { return a[1] + " " + sinal(atrTotal(j, a[0])); }).join(", ")]);
  campos.forEach(function (c) { if (c[1]) h += '<p><b>' + c[0] + ":</b> " + esc(c[1]) + "</p>"; });
  if (PUB.vilaBonus) h += "<p><b>Bônus de origem:</b> " + esc(PUB.vilaBonus) + "</p>";
  return h + "</div></div>" + atalhosJogador();
}

function atalhosJogador() {
  return "<h2>Atalhos</h2>" + '<div class="cols">' +
    panel(ic("livro") + "Meu grimório", '<p>' + (PUB.grimorio ? "Veja as magias que você já desbloqueou." : "Seu grimório aparece aqui depois da cerimônia.") + '</p><p><a href="#meu-grimorio">Abrir</a></p>') +
    panel(ic("mochila") + "Inventário", '<p>Seus itens, moedas e equipamento.</p><p><a href="#inventario">Abrir</a></p>') +
    panel(ic("grupo") + "Perfil", '<p>Edite o nome, a descrição e o retrato do seu personagem.</p><p><a href="#perfil">Abrir</a></p>') +
    panel(ic("prancheta") + "Regras", '<p>Atributos, combate, mana e deslocamento.</p><p><a href="#regras">Abrir</a></p>') +
    panel(ic("bussola") + "Mapa", '<p>Os lugares que o grupo já descobriu.</p><p><a href="#mapa">Abrir</a></p>') + "</div>";
}

function viewMeuGrimorio() {
  var g = PUB.grimorio;
  if (!g) {
    return '<div class="lock"><h1>Meu grimório</h1><p>Seu grimório ainda não foi revelado. Ele aparece aqui depois da cerimônia, com as magias que o mestre for liberando.</p></div>' + meuCaminhoHTML(PUB.jogador);
  }
  var h = "<h1>Meu grimório</h1>" +
    '<p class="lead">As magias aparecem aqui conforme você as desbloqueia. Passe o mouse (ou toque) sobre a descrição de um feitiço para ver os valores mínimo e máximo dos dados.</p>' + legenda();
  h += '<div class="cer-card">' + bookCard(g, true) + "</div>";
  if (!g.spells.length) h += '<div class="empty">Nenhuma magia liberada ainda.</div>';
  return h + meuCaminhoHTML(PUB.jogador);
}

/* ============================ PERFIL ============================ */

/* O Perfil só salva quando o jogador aperta um botão: um para as informações do personagem e outro para os atributos.
   Enquanto isso, o que ele digita ou toca fica num RASCUNHO (perfilRasc, bonusRasc), que sobrevive a trocar de aba. */
var perfilMsg = "", perfilRasc = null, bonusRasc = null, salvandoInfo = false, salvandoBonus = false, infoMsg = "", bonusMsg = "";
var ATRS = [["poder", "Poder"], ["destreza", "Destreza"], ["inteligencia", "Inteligência"]];
var VIDA_NIVEL = [20, 24, 28, 32, 36], LIM_NIVEL = [3, 3, 4, 4, 5];
var atrRasc = { poder: 0, destreza: 0, inteligencia: 0 };
/* 1 de redução de dano para cada 2 pontos de Poder (arredonda para baixo). */
function reducaoDano(j) { return Math.max(0, Math.floor(atrTotal(j, "poder") / 2)); }
function nivelJog(j) { return Math.max(1, Math.min(5, parseInt(j.nivel, 10) || 1)); }
function atrBase(j, k) { return parseInt(j.atr && j.atr[k], 10) || 0; }
function atrBonus(j, k) { return parseInt(j.bonus && j.bonus[k], 10) || 0; }
function atrTotal(j, k) { return atrBase(j, k) + atrBonus(j, k); }
/* Mana: 10, mais 1 a cada 2 pontos de Inteligência. */
function manaJog(j) { return 10 + Math.floor(atrTotal(j, "inteligencia") / 2); }
function sinal(n) { return (n >= 0 ? "+" : "") + n; }

function statCaixa(rot, v) { return '<div class="stat"><b>' + v + "</b>" + rot + "</div>"; }

/* Status do personagem: os números derivados seguem as regras (Defesa 10 + Destreza, redução de dano = Poder / 2,
   deslocamento 6 + 1 a cada 2 de Destreza, mana 10 + 1 a cada 2 de Inteligência, Vida pelo nível). */
/* O que cada atributo faz (resumo das Regras, que são públicas). */
var ATR_DESC = {
  poder: "Força e dano. Reduz o dano que você recebe.",
  destreza: "Mira, esquiva e mobilidade. Sobe a Defesa e o deslocamento.",
  inteligencia: "Cura, controle e percepção. Sobe a mana."
};
function atrIcone(k) { return ic(ATTR_ICON[k]); }

/* Caixas com os números derivados (Defesa, mana...). Enquanto o jogador distribui os pontos, mostram a PRÉVIA do que ele escolheu. */
function statsHTML(ref) {
  var n = nivelJog(ref), dex = atrTotal(ref, "destreza");
  return '<div class="stats">' + statCaixa("Nível", n) + statCaixa("Vida máx.", VIDA_NIVEL[n - 1]) + statCaixa("Mana", manaJog(ref)) +
    statCaixa("Defesa", 10 + dex) + statCaixa("Redução de dano", reducaoDano(ref)) + statCaixa("Deslocamento", 6 + Math.floor(dex / 2)) + "</div>";
}

function atrCabeca(a) {
  return '<div class="atr-topo"><span class="atr-ic" aria-hidden="true">' + atrIcone(a[0]) + "</span><div><h4>" + a[1] + '</h4><p class="mdica">' + ATR_DESC[a[0]] + "</p></div></div>";
}

/* Status do personagem. Os números seguem as regras (Defesa 10 + Destreza, redução de dano = Poder / 2, deslocamento 6 + 1 a cada 2 de
   Destreza, mana 10 + 1 a cada 2 de Inteligência, Vida pelo nível). Feito para o celular: cartões grandes, botões de toque
   confortáveis e a barra de salvar sempre à vista. */
function statusHTML(j) {
  var n = nivelJog(j);
  if (!j.atrTravado) {
    var usado = atrRasc.poder + atrRasc.destreza + atrRasc.inteligencia, resta = 5 - usado;
    return '<h2>Status</h2><section class="panel ficha">' + statsHTML({ nivel: j.nivel, atr: atrRasc, bonus: {} }) +
      '<p class="mdica">Os números acima são a <b>prévia</b> do que você escolher abaixo.</p>' +
      "<h3>Distribua os seus 5 pontos</h3>" +
      '<p class="mdica">Divida <b>5 pontos</b> entre os três atributos, no máximo <b>+3</b> em cada. Isso é o seu treino antes de receber o grimório. <b>Depois de salvar, não dá para mudar.</b></p>' +
      '<div class="atr-cards">' + ATRS.map(function (a) {
        var v = atrRasc[a[0]];
        return '<section class="atr-card" style="--cor:var(--' + a[0] + ')">' + atrCabeca(a) +
          '<div class="atr-passo"><button type="button" class="step-btn" data-atr-step="' + a[0] + '" data-d="-1" aria-label="Tirar um ponto de ' + a[1] + '"' + (v <= 0 ? " disabled" : "") + ">−</button>" +
          '<div class="atr-grande" aria-live="polite">' + sinal(v) + "</div>" +
          '<button type="button" class="step-btn" data-atr-step="' + a[0] + '" data-d="1" aria-label="Pôr um ponto em ' + a[1] + '"' + (v >= 3 || resta <= 0 ? " disabled" : "") + ">+</button></div>" +
          '<div class="atr-pips" aria-hidden="true">' + [1, 2, 3].map(function (i) { return '<span class="' + (i <= v ? "on" : "") + '"></span>'; }).join("") + "</div></section>";
      }).join("") + "</div>" +
      '<div class="atr-barra" role="status"><span class="atr-resta">' + (resta === 0 ? "Tudo distribuído" : "Restam <b>" + resta + "</b> de 5") + "</span>" +
      '<button type="button" class="primary" id="perfilSalvarAtr"' + (resta === 0 ? "" : " disabled") + ">Salvar atributos</button></div></section>";
  }
  var lim = LIM_NIVEL[n - 1], jr = extras({}, j), sujo = bonusSujo();
  jr.bonus = bonusRasc || j.bonus;
  return '<h2>Status</h2><section class="panel ficha">' + statsHTML(jr) + (sujo ? '<p class="mdica">Os números acima mostram a <b>prévia</b> do bônus, que ainda não foi salvo.</p>' : "") + "<h3>Atributos</h3>" +
    '<div class="atr-cards">' + ATRS.map(function (a) {
      var tot = atrTotal(jr, a[0]), bonus = atrBonus(jr, a[0]);
      return '<section class="atr-card" style="--cor:var(--' + a[0] + ')">' + atrCabeca(a) +
        '<div class="atr-total"><span class="mdica">Total</span><div class="atr-grande">' + sinal(tot) + "</div></div>" +
        '<div class="atr-linhas"><div class="atr-base"><span class="mdica">Base (fixa)</span><b>' + sinal(atrBase(j, a[0])) + "</b></div>" +
        '<div class="atr-bonus"><span class="mdica">Bônus</span><div class="atr-passo pequeno">' +
        '<button type="button" class="step-btn" data-bonus-step="' + a[0] + '" data-d="-1" aria-label="Tirar um ponto de bônus de ' + a[1] + '"' + (bonus <= -5 || salvandoBonus ? " disabled" : "") + ">−</button>" +
        '<b class="atr-valor" aria-live="polite">' + sinal(bonus) + "</b>" +
        '<button type="button" class="step-btn" data-bonus-step="' + a[0] + '" data-d="1" aria-label="Pôr um ponto de bônus em ' + a[1] + '"' + (bonus >= 10 || salvandoBonus ? " disabled" : "") + ">+</button></div></div></div>" +
        (tot > lim ? '<p class="atr-aviso">Acima do limite de +' + lim + " do seu nível. O mestre confere.</p>" : "") + "</section>";
    }).join("") + "</div>" +
    '<p class="mdica">A <b>base</b> foi definida na criação e não muda. No <b>bônus</b> você anota os pontos que ganha ao subir de nível (+1 por nível, no máximo +' + lim + " no total em cada atributo, no seu nível). O mestre confere. <b>Aperte Salvar atributos</b> para valer.</p>" +
    '<div class="atr-barra"><span class="atr-estado' + (sujo ? " sujo" : "") + '" role="status">' + esc(salvandoBonus ? "Salvando…" : (sujo ? "Alterações não salvas" : (bonusMsg || "Tudo salvo"))) + "</span>" +
    '<button type="button" id="perfilDescartarBonus"' + (sujo && !salvandoBonus ? "" : " hidden") + ">Desfazer</button>" +
    '<button type="button" class="primary" id="perfilSalvarBonus"' + (sujo && !salvandoBonus ? "" : " disabled") + ">" + (salvandoBonus ? "Salvando…" : "Salvar atributos") + "</button></div></section>";
}

/* ============================ QUESTIONÁRIO DO GRIMÓRIO ============================ */

/* Só as PERGUNTAS ficam aqui. A tabela que liga as respostas aos grimórios está no arquivo do mestre: o jogador nunca a recebe. */
var QUESTOES = [
  { p: "Num combate, o que mais importa para você?", o: ["Derrubar os inimigos o mais rápido possível", "Segurar a linha e proteger quem está atrás", "Manter todo mundo de pé", "Decidir o que o inimigo consegue ou não fazer"] },
  { p: "Diante de um problema, você confia em…", o: ["Força e resistência", "Reflexos e precisão", "Cabeça e conhecimento"] },
  { p: "Qual cena chama mais a sua atenção?", o: ["Fogueira, trovão e luz do sol", "Uma forja ou um campo de batalha", "Floresta, chuva e mar", "Uma biblioteca à meia-noite"] },
  { p: "Numa luta, onde você fica?", o: ["Colado no inimigo", "A uma distância segura", "Sempre me movendo", "No meio do grupo, controlando o campo"] },
  { p: "Qual é o seu jeito de agir?", o: ["Tudo ou nada", "Planejo cada passo", "Cuido dos outros primeiro", "Me adapto na hora"] }
];
var qSel = [null, null, null, null, null], qMsg = "", qEnviando = false;
function qHTML(j) {
  if (!j || j.questionarioFeito) return "";
  var h = '<section class="panel questionario" id="qPainel"><h3>' + ic("estrela") + "Questionário do grimório</h3>" +
    "<p>Antes da cerimônia, responda com sinceridade, sem pensar no que seria mais forte: não existe resposta certa. O mestre usa o que você marcar para escolher o seu grimório. Você responde <b>uma vez</b>.</p>";
  QUESTOES.forEach(function (q, i) {
    h += '<fieldset class="pj-acesso"><legend>' + (i + 1) + ". " + esc(q.p) + "</legend><div class=\"q-ops\">";
    q.o.forEach(function (t, k) {
      var L = "ABCD".charAt(k), marcado = qSel[i] === L;
      h += '<label class="q-op' + (marcado ? " sel" : "") + '"><input type="radio" name="q' + i + '" data-q="' + i + '" value="' + L + '"' + (marcado ? " checked" : "") + "><span>" + esc(t) + "</span></label>";
    });
    h += "</div></fieldset>";
  });
  var prontas = qSel.every(function (x) { return x; });
  return h + '<p id="qMsg" role="status" class="mdica">' + esc(qMsg) + '</p><p><button type="button" class="primary" id="qEnviar"' + (prontas && !qEnviando ? "" : " disabled") + ">" + (qEnviando ? "Enviando…" : "Enviar respostas") + "</button></p></section>";
}
function qAtualizar() { var e = document.getElementById("qPainel"); if (e && PUB.jogador) e.outerHTML = qHTML(PUB.jogador); }
function qChange(el) {
  if (!el.dataset || el.dataset.q === undefined || !PUB.jogador || PUB.jogador.questionarioFeito) return false;
  qSel[parseInt(el.dataset.q, 10)] = el.value;
  qMsg = "";
  qAtualizar();
  return true;
}
function qClick(b) {
  if (b.id !== "qEnviar") return false;
  var j = PUB.jogador;
  if (!j || j.questionarioFeito || qEnviando || !qSel.every(function (x) { return x; })) return true;
  if (!window.confirm("Enviar as respostas? Você só responde uma vez.")) return true;
  qEnviando = true; qAtualizar();
  gravar("perfil_questionario", { respostas: qSel.slice() }).then(function (r) {
    qEnviando = false;
    if (r) { j.questionarioFeito = true; qMsg = ""; perfilMsg = "Respostas enviadas. O mestre vai usá-las na cerimônia do grimório."; renderizar(); }
    else { qMsg = "Não foi possível enviar. Veja o aviso no topo e tente de novo."; qAtualizar(); }
  });
  return true;
}

var CAMPOS_PERFIL = [["personagem", "Nome do personagem", 60], ["altura", "Altura", 20], ["descricao", "Descrição", 2000], ["sonho", "Sonho ou objetivo", 2000], ["medo", "Medo ou fraqueza", 2000]];

function viewPerfil() {
  var j = PUB.jogador;
  if (!j) {
    return "<h1>Perfil</h1>" + criarPersonagemHTML();
  }
  rascunhos();
  var url = j.img ? imgUrl(j.img) : "";
  var h = "<h1>Perfil</h1>" + '<p class="lead">Conte quem é o seu personagem. O que você muda só vale depois de apertar o botão <b>Salvar</b> de cada parte (atributos e informações), e o mestre vê tudo.</p>' +
    '<p id="perfilMsg" role="status" class="mdica">' + esc(perfilMsg) + "</p>" + qHTML(j) + statusHTML(j) + "<h2>Personagem</h2>";
  h += '<div class="pj-form"><div class="pj-lado">' +
    (url ? '<img class="pj-avatar grande" src="' + url + '" alt="Retrato de ' + esc(j.personagem || "personagem") + '">' : '<span class="pj-avatar grande vazio" aria-hidden="true">' + ic("grupo") + "</span>") +
    '<p class="pj-botoes"><input type="file" accept="image/*" class="vh" id="perfilImg"><label class="btn" for="perfilImg">' + (url ? "Trocar retrato" : "Escolher retrato") + "</label>" +
    (url ? '<button type="button" id="perfilImgDel">Remover</button>' : "") + "</p></div>";
  h += '<div class="pj-campos">';
  if (j.nome) h += "<p><b>Jogador:</b> " + esc(j.nome) + "</p>";
  if (j.vila) h += "<p><b>Vilarejo:</b> " + esc(j.vila) + "</p>";
  CAMPOS_PERFIL.forEach(function (c) {
    var v = esc(perfilRasc[c[0]] || "");
    h += "<label>" + c[1] + (c[2] > 100
      ? '<textarea class="sorteio-in" rows="' + (c[0] === "descricao" ? 4 : 3) + '" maxlength="' + c[2] + '" data-pf="' + c[0] + '">' + v + "</textarea>"
      : '<input class="sorteio-in" type="text" maxlength="' + c[2] + '" data-pf="' + c[0] + '" value="' + v + '"' + (c[0] === "altura" ? ' placeholder="ex.: 1,72 m"' : "") + ">") + "</label>";
  });
  var suja = infoSuja();
  return h + '<p class="mdica">O nome do jogador, o vilarejo e o grimório são definidos pelo mestre. A foto é salva assim que você a escolhe.</p>' +
    '<div class="atr-barra info-barra"><span id="infoEstado" class="atr-estado' + (suja ? " sujo" : "") + '" role="status">' + esc(suja ? "Alterações não salvas" : (infoMsg || "Tudo salvo")) + "</span>" +
    '<button type="button" id="perfilDescartarInfo"' + (suja ? "" : " hidden") + ">Descartar</button>" +
    '<button type="button" class="primary" id="perfilSalvarInfo"' + (suja ? "" : " disabled") + ">Salvar informações</button></div></div></div>";
}

function rascunhos() {
  var j = PUB.jogador;
  if (!j) return;
  if (perfilRasc === null) { perfilRasc = {}; CAMPOS_PERFIL.forEach(function (c) { perfilRasc[c[0]] = j[c[0]] || ""; }); }
  if (bonusRasc === null) bonusRasc = { poder: atrBonus(j, "poder"), destreza: atrBonus(j, "destreza"), inteligencia: atrBonus(j, "inteligencia") };
}
function infoSuja() {
  var j = PUB.jogador;
  return !!(j && perfilRasc && CAMPOS_PERFIL.some(function (c) { return (perfilRasc[c[0]] || "") !== (j[c[0]] || ""); }));
}
function bonusSujo() {
  var j = PUB.jogador;
  return !!(j && bonusRasc && ATRS.some(function (a) { return bonusRasc[a[0]] !== atrBonus(j, a[0]); }));
}
function perfilSujo() { return infoSuja() || bonusSujo(); }

/* Estado do botão "Salvar informações" e do aviso ao lado dele, sem refazer a tela (para não tirar o foco de quem digita). */
function atualizarBarraInfo() {
  var bt = document.getElementById("perfilSalvarInfo"), ds = document.getElementById("perfilDescartarInfo"), es = document.getElementById("infoEstado");
  var suja = infoSuja();
  if (bt) { bt.disabled = !suja || salvandoInfo; bt.textContent = salvandoInfo ? "Salvando…" : "Salvar informações"; }
  if (ds) ds.hidden = !suja || salvandoInfo;
  if (es) { es.textContent = salvandoInfo ? "Salvando…" : (suja ? "Alterações não salvas" : (infoMsg || "Tudo salvo")); es.classList.toggle("sujo", suja); }
}

function editarPerfil(el) {
  if (!perfilRasc) return;
  perfilRasc[el.dataset.pf] = el.value;
  infoMsg = "";
  atualizarBarraInfo();
}

function salvarInfo() {
  var j = PUB.jogador;
  if (!j || !perfilRasc || salvandoInfo || !infoSuja()) return;
  var copia = {};
  CAMPOS_PERFIL.forEach(function (c) { copia[c[0]] = perfilRasc[c[0]] || ""; });
  salvandoInfo = true;
  atualizarBarraInfo();
  gravar("perfil_salvar", { campos: copia }).then(function (r) {
    salvandoInfo = false;
    if (r) { CAMPOS_PERFIL.forEach(function (c) { j[c[0]] = copia[c[0]]; }); infoMsg = "Informações salvas."; }
    else infoMsg = "Não foi possível salvar. Veja o aviso no topo e tente de novo.";
    atualizarBarraInfo();
  });
}

function descartarInfo() {
  var j = PUB.jogador;
  if (!j || !perfilRasc) return;
  CAMPOS_PERFIL.forEach(function (c) { perfilRasc[c[0]] = j[c[0]] || ""; });
  infoMsg = "";
  renderizar();
}

function salvarBonus() {
  var j = PUB.jogador;
  if (!j || !bonusRasc || salvandoBonus || !bonusSujo()) return;
  var copia = { poder: bonusRasc.poder, destreza: bonusRasc.destreza, inteligencia: bonusRasc.inteligencia };
  salvandoBonus = true;
  bonusMsg = "";
  renderizar();
  gravar("perfil_bonus", { bonus: copia }).then(function (r) {
    salvandoBonus = false;
    if (r) { j.bonus = copia; bonusMsg = "Atributos salvos."; }
    else bonusMsg = "Não foi possível salvar. Veja o aviso no topo e tente de novo.";
    renderizar();
  });
}

function descartarBonus() {
  var j = PUB.jogador;
  if (!j) return;
  bonusRasc = { poder: atrBonus(j, "poder"), destreza: atrBonus(j, "destreza"), inteligencia: atrBonus(j, "inteligencia") };
  bonusMsg = "";
  renderizar();
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
  if (pendentes || Object.keys(timers).length || perfilSujo()) { e.preventDefault(); e.returnValue = ""; }
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
    perfilRasc = null; bonusRasc = null; infoMsg = ""; bonusMsg = ""; kitSel = {}; kitMsg = ""; qSel = [null, null, null, null, null]; qMsg = "";
    renderizar();
  }).catch(function (e) {
    app.innerHTML = '<div class="lock"><h1>Sem conexão</h1><p>' + esc(e.message) + '</p><p><button type="button" class="primary" id="tentarDeNovo">Tentar de novo</button></p></div>';
  });
}

/* ============================ INVENTÁRIO ============================ */

/* A mesma lista serve ao jogador (aba Inventário) e ao mestre (aba Itens). O jogador mexe só no próprio inventário; o mestre, no de
   qualquer um. Cada alteração vai ao servidor como uma operação pequena (inv_op): assim os dois podem editar ao mesmo tempo. */
var CATS_ITEM = [["arma", "Arma"], ["armadura", "Armadura e escudo"], ["aventura", "Equipamento"], ["ferramenta", "Ferramenta"], ["consumivel", "Consumível"], ["magico", "Item mágico"], ["tesouro", "Tesouro"], ["outro", "Outro"]];
var RARID_ITEM = ["comum", "incomum", "raro", "lendário"];
function catNome(c) { var r = "Outro"; CATS_ITEM.forEach(function (x) { if (x[0] === c) r = x[1]; }); return r; }

/* Preços em cobre (1 ouro = 100 cobres; 1 prata = 10 cobres) e pesos em kg (as tabelas do 5e são em libras: 1 lb = 0,45 kg). */
function ouro(n) { return Math.round(n * 100); }
function prata(n) { return Math.round(n * 10); }
function lb(n) { return Math.round(n * 0.45 * 100) / 100; }
function ib(id, cat, nome, efeito, peso, valor, desc, x) {
  return extras({ id: "dnd-" + id, origem: "dnd", cat: cat, nome: nome, efeito: efeito || "", peso: peso || 0, valor: valor || 0, raridade: "comum", desc: desc || "", fase: "", mestre: "", sinergia: [] }, x);
}
var ADAPT_ARM = " Adaptação do 5e: aqui a Defesa é 10 + Destreza, então a armadura soma um bônus fixo. O mestre pode ajustar.";
/* Equipamento básico do D&D 5e (SRD), em português e adaptado ao sistema da campanha. */
var ITENS_BASE = [
  ib("adaga", "arma", "Adaga", "Dano 1d4 perfurante · leve, arremesso", lb(1), ouro(2)),
  ib("bordao", "arma", "Bordão", "Dano 1d6 contundente · versátil (1d8)", lb(4), prata(2)),
  ib("clava", "arma", "Clava", "Dano 1d4 contundente · leve", lb(2), prata(1)),
  ib("lanca", "arma", "Lança", "Dano 1d6 perfurante · arremesso, versátil", lb(3), ouro(1)),
  ib("machadinha", "arma", "Machadinha", "Dano 1d6 cortante · leve, arremesso", lb(2), ouro(5)),
  ib("maca", "arma", "Maça", "Dano 1d6 contundente", lb(4), ouro(5)),
  ib("arco-curto", "arma", "Arco curto", "Dano 1d6 perfurante · à distância", lb(2), ouro(25)),
  ib("besta-leve", "arma", "Besta leve", "Dano 1d8 perfurante · à distância, recarga", lb(5), ouro(25)),
  ib("funda", "arma", "Funda", "Dano 1d4 contundente · à distância", 0, prata(1)),
  ib("dardo", "arma", "Dardo", "Dano 1d4 perfurante · arremesso", lb(0.25), 5),
  ib("espada-curta", "arma", "Espada curta", "Dano 1d6 perfurante · leve, acuidade", lb(2), ouro(10)),
  ib("espada-longa", "arma", "Espada longa", "Dano 1d8 cortante · versátil (1d10)", lb(3), ouro(15)),
  ib("montante", "arma", "Montante", "Dano 2d6 cortante · pesada, duas mãos", lb(6), ouro(50)),
  ib("cimitarra", "arma", "Cimitarra", "Dano 1d6 cortante · leve, acuidade", lb(3), ouro(25)),
  ib("rapieira", "arma", "Rapieira", "Dano 1d8 perfurante · acuidade", lb(2), ouro(25)),
  ib("machado-grande", "arma", "Machado grande", "Dano 1d12 cortante · pesada, duas mãos", lb(7), ouro(30)),
  ib("machado-batalha", "arma", "Machado de batalha", "Dano 1d8 cortante · versátil (1d10)", lb(4), ouro(10)),
  ib("martelo-guerra", "arma", "Martelo de guerra", "Dano 1d8 contundente · versátil (1d10)", lb(2), ouro(15)),
  ib("macaestrela", "arma", "Maça estrela", "Dano 1d8 perfurante", lb(4), ouro(15)),
  ib("alabarda", "arma", "Alabarda", "Dano 1d10 cortante · pesada, alcance", lb(6), ouro(20)),
  ib("arco-longo", "arma", "Arco longo", "Dano 1d8 perfurante · à distância, pesada", lb(2), ouro(50)),
  ib("besta-pesada", "arma", "Besta pesada", "Dano 1d10 perfurante · à distância, pesada", lb(18), ouro(50)),
  ib("flechas", "arma", "Flechas (20)", "Munição para arco", lb(1), ouro(1)),
  ib("virotes", "arma", "Virotes (20)", "Munição para besta", lb(1.5), ouro(1)),
  ib("acolchoada", "armadura", "Armadura acolchoada", "Defesa +1 (leve)", lb(8), ouro(5), "Tecido grosso e acolchoado." + ADAPT_ARM, { def: 1 }),
  ib("couro", "armadura", "Armadura de couro", "Defesa +1 (leve)", lb(10), ouro(10), "Couro curtido e endurecido." + ADAPT_ARM, { def: 1 }),
  ib("couro-batido", "armadura", "Couro batido", "Defesa +1 (leve)", lb(13), ouro(45), "Couro reforçado com rebites." + ADAPT_ARM, { def: 1 }),
  ib("gibao-peles", "armadura", "Gibão de peles", "Defesa +2 (média)", lb(12), ouro(10), "Peles e couro grosso." + ADAPT_ARM, { def: 2 }),
  ib("camisa-malha", "armadura", "Camisa de malha", "Defesa +2 (média)", lb(20), ouro(50), "Anéis de metal sob a roupa." + ADAPT_ARM, { def: 2 }),
  ib("peitoral", "armadura", "Peitoral", "Defesa +2 (média)", lb(20), ouro(400), "Placa de metal só no tronco." + ADAPT_ARM, { def: 2 }),
  ib("cota-malha", "armadura", "Cota de malha", "Defesa +3 (pesada) · atrapalha o movimento", lb(55), ouro(75), "Malha completa. Pesada e barulhenta." + ADAPT_ARM, { def: 3, desl: -1 }),
  ib("placas", "armadura", "Armadura de placas", "Defesa +3 (pesada) · atrapalha o movimento", lb(65), ouro(1500), "Placas de aço articuladas." + ADAPT_ARM, { def: 3, desl: -1 }),
  ib("escudo", "armadura", "Escudo", "Defesa +1", lb(6), ouro(10), "Segurado numa das mãos." + ADAPT_ARM, { def: 1 }),
  ib("mochila", "aventura", "Mochila", "Carrega pequenos itens", lb(5), ouro(2)),
  ib("saco-dormir", "aventura", "Saco de dormir", "", lb(7), ouro(1)),
  ib("corda", "aventura", "Corda de cânhamo (15 m)", "Aguenta uma pessoa; rompe com Poder 17", lb(10), ouro(1)),
  ib("tocha", "aventura", "Tocha", "Luz por 1 hora (6 m) · 1 de dano de fogo se usada como arma", lb(1), 1),
  ib("racao", "aventura", "Ração (1 dia)", "Comida seca para um dia", lb(2), prata(5)),
  ib("cantil", "aventura", "Cantil", "Guarda 2 litros de líquido", lb(5), ouro(2)),
  ib("pederneira", "aventura", "Pederneira e isqueiro", "Acende fogo", lb(1), prata(5)),
  ib("lanterna", "aventura", "Lanterna coberta", "Luz por 6 horas com 1 frasco de óleo", lb(2), ouro(5)),
  ib("oleo", "aventura", "Frasco de óleo", "Alimenta lanterna; arremessado e aceso causa 1d4 de fogo", lb(1), prata(1)),
  ib("barraca", "aventura", "Barraca (2 pessoas)", "", lb(20), ouro(2)),
  ib("pe-cabra", "aventura", "Pé de cabra", "Vantagem para forçar portas e baús", lb(5), ouro(2)),
  ib("martelo", "aventura", "Martelo", "", lb(3), ouro(1)),
  ib("pitoes", "aventura", "Pitão de ferro", "", lb(0.25), 5),
  ib("corrente", "aventura", "Corrente (3 m)", "", lb(10), ouro(5)),
  ib("espelho", "aventura", "Espelho de aço", "", lb(0.5), ouro(5)),
  ib("cadeado", "aventura", "Cadeado", "Dificuldade 15 para arrombar", lb(1), ouro(10)),
  ib("algemas", "aventura", "Algemas", "Poder 20 para romper", lb(6), ouro(2)),
  ib("aljava", "aventura", "Aljava", "Guarda 20 flechas ou virotes", lb(1), ouro(1)),
  ib("cobertor", "aventura", "Cobertor", "", lb(3), prata(5)),
  ib("bolsa", "aventura", "Algibeira", "Guarda moedas e pequenos itens", lb(1), prata(5)),
  ib("frasco", "aventura", "Frasco de vidro", "", lb(0.5), ouro(1)),
  ib("vela", "aventura", "Vela", "Luz fraca por 1 hora", 0, 1),
  ib("giz", "aventura", "Giz", "", 0, 1),
  ib("pergaminho", "aventura", "Pergaminho (folha)", "", 0, prata(1)),
  ib("tinta", "aventura", "Tinta e pena", "", 0, ouro(10)),
  ib("lupa", "aventura", "Lupa", "Vantagem para examinar detalhes", 0, ouro(100)),
  ib("kit-curandeiro", "ferramenta", "Kit de curandeiro", "10 usos · estabiliza um aliado caído sem teste", lb(3), ouro(5)),
  ib("ferramentas-ladrao", "ferramenta", "Ferramentas de ladrão", "Arrombar fechaduras e desarmar armadilhas", lb(1), ouro(25)),
  ib("kit-herbalismo", "ferramenta", "Kit de herbalismo", "Reconhecer plantas e preparar ervas", lb(3), ouro(5)),
  ib("ferramentas-ferreiro", "ferramenta", "Ferramentas de ferreiro", "Forjar e consertar metal", lb(8), ouro(20)),
  ib("kit-disfarce", "ferramenta", "Kit de disfarce", "", lb(3), ouro(25)),
  ib("kit-veneno", "ferramenta", "Kit de venenos", "Preparar e aplicar venenos", lb(2), ouro(50)),
  ib("ferramentas-navegador", "ferramenta", "Ferramentas de navegador", "", lb(2), ouro(25)),
  ib("utensilios-cozinha", "ferramenta", "Utensílios de cozinha", "", lb(8), ouro(1)),
  ib("alaude", "ferramenta", "Alaúde", "Instrumento musical", lb(2), ouro(35)),
  ib("dados", "ferramenta", "Jogo de dados", "", 0, prata(1)),
  ib("baralho", "ferramenta", "Baralho", "", 0, prata(5)),
  ib("pocao-cura", "consumivel", "Poção de cura", "Cura 2d4 + 2 de vida", lb(0.5), ouro(50), "Líquido vermelho que brilha levemente."),
  ib("antitoxina", "consumivel", "Antitoxina", "Vantagem contra veneno por 1 hora", 0, ouro(50)),
  ib("agua-benta", "consumivel", "Água benta", "Arremessada: 2d6 radiante contra mortos-vivos", lb(1), ouro(25)),
  ib("fogo-alquimico", "consumivel", "Fogo alquímico", "Arremessado: 1d4 de fogo por turno até apagar", lb(1), ouro(50)),
  ib("acido", "consumivel", "Frasco de ácido", "Arremessado: 2d6 de dano ácido", lb(1), ouro(25)),
  ib("abrolhos", "consumivel", "Abrolhos (saco)", "Cobrem 1,5 m: quem passa perde deslocamento e sofre 1 de dano", lb(2), ouro(1))
];
function itemBase(id) { var r = null; ITENS_BASE.forEach(function (i) { if (i.id === id) r = i; }); return r; }

function valorTxt(c) {
  c = parseInt(c, 10) || 0;
  if (!c) return "sem valor";
  if (c % 100 === 0) return c / 100 + " po";
  if (c % 10 === 0) return c / 10 + " pp";
  return c + " pc";
}
function pesoTxt(p) { p = Number(p) || 0; return (Math.round(p * 100) / 100).toString().replace(".", ",") + " kg"; }
/* Efeitos de um item enquanto equipado: Defesa, Deslocamento e Mana (positivo é bônus, negativo atrapalha). */
function modsItem(i) { return { def: parseInt(i.def, 10) || 0, desl: parseInt(i.desl, 10) || 0, mana: parseInt(i.mana, 10) || 0 }; }
function modsTags(i) {
  var m = modsItem(i), h = "";
  [["def", "Defesa"], ["desl", "Deslocamento"], ["mana", "Mana"]].forEach(function (c) {
    if (m[c[0]]) h += '<span class="tag ' + (m[c[0]] > 0 ? "buff" : "pena") + '">' + (m[c[0]] > 0 ? "▲ " : "▼ ") + c[1] + " " + sinal(m[c[0]]) + "</span>";
  });
  return h;
}
function pesoItemTxt(i) {
  var q = parseInt(i.qtd, 10) || 0, p = Number(i.peso) || 0;
  return p ? pesoTxt(p) + (q > 1 ? " cada · " + pesoTxt(p * q) + " no total" : "") : "sem peso";
}
/* Números do personagem com o que está equipado e a carga. Sobrecarga (sugerida): -1 de deslocamento a cada 5 kg acima da capacidade. */
function invStats(d) {
  var dex = d ? atrTotal(d, "destreza") : 0;
  var s = { defBase: 10 + dex, deslBase: 6 + Math.floor(dex / 2), manaBase: d ? manaJog(d) : 10, def: 0, desl: 0, mana: 0, peso: invPeso(d), cap: invCapacidade(d), pen: 0, fontes: [] };
  /* Só vale UMA armadura de corpo e UM escudo (o de maior Defesa). O resto equipado não soma, para não empilhar proteção. */
  var corpo = null, escudo = null, ignorados = [];
  invLista(d).forEach(function (i) {
    if (!i.equip) return;
    var m = modsItem(i);
    if (i.cat === "armadura") {
      var ehEscudo = /escudo|broquel/i.test(i.nome || "");
      var atual = ehEscudo ? escudo : corpo;
      if (!atual) { if (ehEscudo) escudo = i; else corpo = i; }
      else if (m.def > modsItem(atual).def) { ignorados.push(atual.nome); if (ehEscudo) escudo = i; else corpo = i; }
      else ignorados.push(i.nome);
      return;
    }
    if (m.def || m.desl || m.mana) { s.def += m.def; s.desl += m.desl; s.mana += m.mana; s.fontes.push(i.nome); }
  });
  [corpo, escudo].forEach(function (i) {
    if (!i) return;
    var m = modsItem(i);
    s.def += m.def; s.desl += m.desl; s.mana += m.mana;
    if (m.def || m.desl || m.mana) s.fontes.push(i.nome);
  });
  s.ignorados = ignorados;
  if (s.peso > s.cap) s.pen = Math.ceil((s.peso - s.cap) / 5);
  s.defTotal = s.defBase + s.def;
  s.deslTotal = Math.max(0, s.deslBase + s.desl - s.pen);
  s.manaTotal = s.manaBase + s.mana;
  return s;
}
function grimCurto(n) { return String(n || "").replace(/^Grimório (de |do |da |das |dos )?/, ""); }
function invDono() { return MESTRE ? (typeof achaJog === "function" ? achaJog(invJogId) : null) : PUB.jogador; }
function invLista(d) { return (d && d.inv) || []; }
function invAchar(id) { var r = null; invLista(invDono()).forEach(function (i) { if (i.id === id) r = i; }); return r; }
function invPeso(d) { var t = 0; invLista(d).forEach(function (i) { t += (Number(i.peso) || 0) * (parseInt(i.qtd, 10) || 0); }); return t; }
function invCapacidade(d) { return 20 + 5 * Math.max(0, d ? atrTotal(d, "poder") : 0); }
function invOp(op, dados) {
  var corpo = extras({ op: op }, dados || {});
  if (MESTRE) corpo.jogador = invJogId;
  return gravar("inv_op", corpo);
}

var invJogId = null, invCat = "todas", invQ = "", invAbertos = {}, invMsg = "";

function campoItem(rot, ifld, id, v, tipo, extra) {
  return "<label>" + rot + '<input class="sorteio-in" type="' + tipo + '" data-ifld="' + ifld + '" data-iid="' + id + '" value="' + esc(v) + '"' + (extra || "") + "></label>";
}

function itemHTML(it, mestre, dono) {
  var id = it.id, aberto = !!invAbertos[id], q = parseInt(it.qtd, 10) || 0;
  var tags = '<span class="tag role">' + esc(catNome(it.cat)) + "</span>";
  if (it.raridade && it.raridade !== "comum") tags += '<span class="tag leg">' + esc(it.raridade) + "</span>";
  var h = '<article class="item' + (it.equip ? " equip" : "") + '" data-iid="' + id + '"><div class="item-topo">' +
    '<label class="item-eq" title="Marcar como equipado/em uso"><input type="checkbox" data-ieq="' + id + '"' + (it.equip ? " checked" : "") + '><span class="vh">Equipado</span><span aria-hidden="true">' + ic("escudo") + "</span></label>" +
    '<button type="button" class="item-nome" data-itog="' + id + '" aria-expanded="' + aberto + '"><b>' + esc(it.nome) + "</b>" + (it.efeito ? "<small>" + esc(it.efeito) + "</small>" : "") + "</button>" +
    '<span class="item-qtd"><button type="button" data-iqtd="' + id + '" data-d="-1" aria-label="Diminuir quantidade">−</button><b id="q-' + id + '">' + q + '</b><button type="button" data-iqtd="' + id + '" data-d="1" aria-label="Aumentar quantidade">+</button></span></div>';
  tags += '<span class="tag role">' + ic("mochila") + pesoItemTxt(it) + "</span>" + modsTags(it);
  h += '<div class="meta item-tags" id="it-tags-' + id + '">' + tags + "</div>";
  if (mestre && it.mestre) h += '<p class="item-segredo">' + ic("cadeado") + "<span><b>Só mestre:</b> " + esc(it.mestre) + "</span></p>";
  if (mestre) {
    var alertas = invAlertasItem(it, dono);
    alertas.forEach(function (a) { h += '<p class="item-alerta ' + a[0] + '">' + ic(a[0] === "ok" ? "certo" : "alerta") + "<span>" + esc(a[1]) + "</span></p>"; });
  }
  h += '<div class="item-corpo" id="ic-' + id + '"' + (aberto ? "" : " hidden") + ">" +
    '<div class="item-grade">' +
    campoItem("Nome", "nome", id, it.nome, "text", ' maxlength="80"') +
    '<label>Categoria<select class="sorteio-in" data-ifld="cat" data-iid="' + id + '">' + CATS_ITEM.map(function (c) { return '<option value="' + c[0] + '"' + (c[0] === it.cat ? " selected" : "") + ">" + c[1] + "</option>"; }).join("") + "</select></label>" +
    campoItem("Peso (kg, cada)", "peso", id, it.peso || 0, "number", ' min="0" step="0.05"') +
    campoItem("Valor (ouro, cada)", "valor", id, (it.valor || 0) / 100, "number", ' min="0" step="0.01"') +
    campoItem("Defesa (equipado)", "def", id, it.def || 0, "number", ' min="-10" max="10"') +
    campoItem("Deslocamento (equipado)", "desl", id, it.desl || 0, "number", ' min="-10" max="10"') +
    campoItem("Mana máxima (equipado)", "mana", id, it.mana || 0, "number", ' min="-10" max="10"') +
    "</div>" +
    campoItem("Efeito ou dano (resumo)", "efeito", id, it.efeito || "", "text", ' maxlength="200"') +
    '<label>Descrição<textarea class="sorteio-in" rows="3" maxlength="1500" data-ifld="desc" data-iid="' + id + '">' + esc(it.desc || "") + "</textarea></label>" +
    '<label>' + (mestre ? "Nota do jogador" : "Minhas anotações sobre este item") + '<textarea class="sorteio-in" rows="2" maxlength="1000" data-ifld="nota" data-iid="' + id + '">' + esc(it.nota || "") + "</textarea></label>";
  if (mestre) {
    h += '<fieldset class="pj-acesso item-mestre"><legend>' + ic("cadeado") + "Só o mestre vê</legend>" +
      '<label>Descrição secreta (por exemplo: forte quando usado com tal magia)<textarea class="sorteio-in" rows="3" maxlength="2000" data-ifld="mestre" data-iid="' + id + '">' + esc(it.mestre || "") + "</textarea></label>" +
      campoItem("Grimórios com sinergia (separe por vírgula)", "sinergia", id, (it.sinergia || []).join(", "), "text", ' list="listaGrim"') +
      '<label>Fase da campanha em que faz sentido aparecer<select class="sorteio-in" data-ifld="fase" data-iid="' + id + '"><option value="">Qualquer fase</option>' + opcoes(FASES, it.fase || "", false) + "</select></label></fieldset>";
  } else if (it.desc) {
    /* a descrição já aparece no campo acima */
  }
  return h + '<p><button type="button" data-idel="' + id + '">Remover do inventário</button></p></div></article>';
}

/* Conferências do mestre para um item na mão de um jogador. Devolve [["ok"|"aviso", texto]]. */
function invAlertasItem(it, dono) {
  var out = [];
  if (!dono) return out;
  if (dono.grim && (it.sinergia || []).indexOf(grimCurto(dono.grim)) !== -1) out.push(["ok", "Sinergia: combina com o Grimório de " + grimCurto(dono.grim) + " deste jogador."]);
  if (typeof FASES !== "undefined" && it.fase && EST.progresso) {
    var a = FASES.indexOf(it.fase), b = FASES.indexOf(EST.progresso);
    if (a > b && b !== -1) out.push(["aviso", "Adiantado: pensado para " + it.fase + " e a campanha está em " + EST.progresso + "."]);
  }
  return out;
}

function invResumoHTML(d, mestre) {
  var st = invStats(d), n = invLista(d).length, m = d.moedas || {};
  var pct = Math.min(100, Math.round(st.peso / st.cap * 100)), sobre = st.peso > st.cap;
  var h = '<section class="panel inv-resumo" id="invResumo"><h3>' + ic("mochila") + "Resumo</h3>" +
    '<div class="carga"><div class="carga-topo"><span><b>Carga atual:</b> <span class="' + (sobre ? "inv-sobre" : "") + '">' + pesoTxt(st.peso) + "</span> de " + pesoTxt(st.cap) + " <small>(capacidade: 20 kg + 5 kg por ponto de Poder)</small></span><span>" + n + (n === 1 ? " item" : " itens") + "</span></div>" +
    '<div class="carga-barra" role="img" aria-label="Carga ' + pct + ' por cento da capacidade"><span class="' + (sobre ? "sobre" : (pct >= 80 ? "quase" : "")) + '" style="width:' + pct + '%"></span></div></div>' +
    (st.ignorados.length ? '<p class="item-alerta aviso">' + ic("alerta") + "<span>Só conta uma armadura e um escudo. Não estão somando: " + esc(st.ignorados.join(", ")) + ".</span></p>" : "") +
    (sobre ? '<p class="item-alerta aviso">' + ic("alerta") + "<span>Sobrecarregado: " + pesoTxt(st.peso - st.cap) + " acima da capacidade. Regra sugerida: −" + st.pen + " de deslocamento (−1 a cada 5 kg acima). O mestre decide.</span></p>" : "") +
    '<h4 class="inv-sub">Equipado agora</h4><div class="stats inv-stats">' +
    statEquip("Defesa", st.defTotal, st.def, "") + statEquip("Deslocamento", st.deslTotal, st.desl - st.pen, " casas") + statEquip("Mana máxima", st.manaTotal, st.mana, "") + "</div>" +
    '<p class="mdica">' + (st.fontes.length ? "Efeitos vindos de: " + esc(st.fontes.join(", ")) + "." : "Nenhum item equipado altera os seus números. Marque o escudo ao lado de um item para equipá-lo.") + " A base usa a sua ficha (Defesa 10 + Destreza, deslocamento 6 + 1 a cada 2 de Destreza).</p>" +
    '<div class="inv-moedas"><label>Ouro<input class="sorteio-in num" type="number" min="0" data-imoeda="po" value="' + (m.po || 0) + '"></label>' +
    '<label>Prata<input class="sorteio-in num" type="number" min="0" data-imoeda="pp" value="' + (m.pp || 0) + '"></label>' +
    '<label>Cobre<input class="sorteio-in num" type="number" min="0" data-imoeda="pc" value="' + (m.pc || 0) + '"></label></div></section>';
  return h;
}
function statEquip(rot, total, delta, un) {
  return '<div class="stat"><b>' + total + (un || "") + '</b>' + rot + (delta ? ' <small class="' + (delta > 0 ? "buff-txt" : "pena-txt") + '">' + (delta > 0 ? "▲ " : "▼ ") + sinal(delta) + "</small>" : "") + "</div>";
}

function invListaHTML(d, mestre) {
  var q = invQ.trim().toLowerCase();
  var lista = invLista(d).filter(function (i) {
    if (invCat !== "todas" && i.cat !== invCat) return false;
    return !q || (i.nome + " " + (i.efeito || "") + " " + (i.desc || "")).toLowerCase().indexOf(q) !== -1;
  });
  if (!invLista(d).length) return '<div class="empty">Inventário vazio. Adicione um item abaixo.</div>';
  if (!lista.length) return '<div class="empty">Nenhum item com esse filtro.</div>';
  /* Equipados primeiro; dentro de cada grupo, a ordem em que foram adicionados. */
  lista = lista.map(function (i, k) { return [i, k]; }).sort(function (a, b) { return (b[0].equip ? 1 : 0) - (a[0].equip ? 1 : 0) || a[1] - b[1]; }).map(function (p) { return p[0]; });
  return '<div class="item-lista">' + lista.map(function (i) { return itemHTML(i, mestre, d); }).join("") + "</div>";
}

function invFiltroHTML() {
  return '<div class="controls"><input type="search" id="invBusca" placeholder="Buscar no inventário" aria-label="Buscar no inventário" value="' + esc(invQ) + '">' +
    '<div class="chips" id="invCats">' + [["todas", "Todas"]].concat(CATS_ITEM).map(function (c) {
      return '<button type="button" class="chip" data-invcat="' + c[0] + '" aria-pressed="' + (invCat === c[0]) + '">' + c[1] + "</button>";
    }).join("") + "</div></div>";
}

/* Formulários para adicionar: do equipamento básico (jogador e mestre), do catálogo do mestre e item manual (os dois só do mestre). */
function invAdicionarHTML(mestre) {
  var h = "<h2>Adicionar item</h2>";
  var grupos = CATS_ITEM.map(function (c) {
    var l = ITENS_BASE.filter(function (i) { return i.cat === c[0]; });
    return l.length ? '<optgroup label="' + c[1] + '">' + l.map(function (i) { return '<option value="' + i.id + '">' + esc(i.nome) + "</option>"; }).join("") + "</optgroup>" : "";
  }).join("");
  h += '<section class="panel"><h3>' + ic("prancheta") + "Equipamento básico (D&amp;D 5e)</h3>" +
    '<div class="inv-add"><label>Item<select class="sorteio-in" id="invBase">' + grupos + '</select></label>' +
    '<label>Quantidade<input class="sorteio-in num" type="number" min="1" max="999" value="1" id="invBaseQtd"></label>' +
    '<button type="button" class="primary" id="invAddBase">Adicionar</button></div></section>';
  if (mestre) {
    var cat = EST.itens || [];
    h += '<section class="panel"><h3>' + ic("estrela") + "Do seu catálogo (com as notas secretas)</h3>" +
      (cat.length ? '<div class="inv-add"><label>Item<select class="sorteio-in" id="invCatSel">' + cat.map(function (i) { return '<option value="' + esc(i.id) + '">' + esc(i.nome) + "</option>"; }).join("") + "</select></label>" +
        '<label>Quantidade<input class="sorteio-in num" type="number" min="1" max="999" value="1" id="invCatQtd"></label><button type="button" class="primary" id="invAddCat">Adicionar</button></div>'
        : '<p class="mdica">O catálogo está vazio. Abra a aba Catálogo e carregue os itens padrão.</p>') + "</section>";
  }
  if (mestre) {
  h += '<section class="panel"><h3>' + ic("etiqueta") + "Criar item manualmente</h3>" +
      '<div class="item-grade"><label>Nome<input class="sorteio-in" id="invNNome" type="text" maxlength="80"></label>' +
      '<label>Categoria<select class="sorteio-in" id="invNCat">' + CATS_ITEM.map(function (c) { return '<option value="' + c[0] + '">' + c[1] + "</option>"; }).join("") + "</select></label>" +
      '<label>Quantidade<input class="sorteio-in num" id="invNQtd" type="number" min="1" max="9999" value="1"></label>' +
      '<label>Peso (kg, cada)<input class="sorteio-in num" id="invNPeso" type="number" min="0" step="0.05" value="0"></label>' +
      '<label>Valor (ouro, cada)<input class="sorteio-in num" id="invNValor" type="number" min="0" step="0.01" value="0"></label></div>' +
      '<label>Efeito ou dano (resumo)<input class="sorteio-in" id="invNEfeito" type="text" maxlength="200"></label>' +
      '<label>Descrição<textarea class="sorteio-in" rows="3" id="invNDesc" maxlength="1500"></textarea></label>' +
      '<p><button type="button" class="primary" id="invAddNovo">Criar e adicionar</button></p></section>';
  }
  return h;
}

function invCorpoHTML(d, mestre) {
  return invResumoHTML(d, mestre) + '<p id="invMsg" role="status" class="mdica">' + esc(invMsg) + "</p>" + invFiltroHTML() +
    '<div id="invLista">' + invListaHTML(d, mestre) + "</div>" + invAdicionarHTML(mestre);
}

/* ----- Kit inicial: o jogador monta o próprio kit uma vez, logo depois de criar o personagem. A lista vem do servidor (PUB.jogador.kit). ----- */
var kitSel = {}, kitMsg = "", kitSalvando = false;
function kitContagem(g) { var n = 0; g.itens.forEach(function (i) { if (kitSel[i.id]) n++; }); return n; }
function kitPronto(j) { return j.kit.grupos.every(function (g) { var n = kitContagem(g); return n >= g.min && n <= g.max; }); }
function kitItemTxt(i) {
  var q = i.qtd || 1, p = (Number(i.peso) || 0) * q;
  return "<b>" + esc(i.nome) + (q > 1 ? " ×" + q : "") + "</b>" + (i.efeito ? "<small>" + esc(i.efeito) + "</small>" : "") +
    '<small class="kit-peso">' + (p ? pesoTxt(p) : "sem peso") + "</small>" + (modsTags(i) ? '<span class="meta">' + modsTags(i) + "</span>" : "");
}
function kitCarga(j) {
  var t = 0;
  j.kit.fixos.forEach(function (i) { t += (Number(i.peso) || 0) * (i.qtd || 1); });
  j.kit.grupos.forEach(function (g) { g.itens.forEach(function (i) { if (kitSel[i.id]) t += (Number(i.peso) || 0) * (i.qtd || 1); }); });
  return t;
}
function kitHTML(j) {
  if (!j || !j.kit) return "";
  var k = j.kit;
  var h = '<section class="panel kit" id="kitPainel"><h3>' + ic("estrela") + "Escolha o seu kit inicial</h3>" +
    '<p>Você só escolhe <b>uma vez</b>. Os itens fixos já vêm, e o resto é por sua conta, dentro do limite de cada grupo. Depois, você muda tudo no inventário.</p>' +
    '<p class="mdica"><b>Já vem com:</b> ' + k.fixos.map(function (i) { return esc(i.nome) + (i.qtd > 1 ? " ×" + i.qtd : ""); }).join(", ") + " e " + k.moedas.po + " po.</p>";
  k.grupos.forEach(function (g) {
    var n = kitContagem(g);
    h += '<fieldset class="pj-acesso"><legend>' + esc(g.nome) + " <span class=\"kit-cont" + (n >= g.min && n <= g.max ? " ok" : "") + '">' + n + " de " + g.max + (g.min ? " (obrigatório)" : "") + "</span></legend><div class=\"kit-grade\">";
    g.itens.forEach(function (i) {
      var marcado = !!kitSel[i.id], cheio = !marcado && n >= g.max;
      h += '<label class="kit-op' + (marcado ? " sel" : "") + (cheio ? " cheio" : "") + '"><input type="checkbox" data-kit="' + i.id + '" data-kitg="' + g.id + '"' + (marcado ? " checked" : "") + (cheio ? " disabled" : "") + "><span>" + kitItemTxt(i) + "</span></label>";
    });
    h += "</div></fieldset>";
  });
  var kc = kitCarga(j), kcap = invCapacidade(j);
  h += '<p class="kit-carga' + (kc > kcap ? " inv-sobre" : "") + '"><b>Carga do kit:</b> ' + pesoTxt(kc) + " de " + pesoTxt(kcap) + " de capacidade" + (kc > kcap ? ". Acima do limite: você ficaria sobrecarregado." : ".") + "</p>";
  return h + '<p id="kitMsg" role="status" class="mdica">' + esc(kitMsg) + '</p><p><button type="button" class="primary" id="kitConfirmar"' + (kitPronto(j) && !kitSalvando ? "" : " disabled") + ">" + (kitSalvando ? "Salvando…" : "Confirmar kit") + "</button></p></section>";
}
function kitAtualizar() { var e = document.getElementById("kitPainel"); if (e && PUB.jogador) e.outerHTML = kitHTML(PUB.jogador); }
function kitChange(el) {
  if (!el.dataset || !el.dataset.kit || !PUB.jogador || !PUB.jogador.kit) return false;
  kitSel[el.dataset.kit] = el.checked;
  kitMsg = "";
  kitAtualizar();
  return true;
}
function kitClick(b) {
  if (b.id !== "kitConfirmar") return false;
  var j = PUB.jogador;
  if (!j || !j.kit || kitSalvando || !kitPronto(j)) return true;
  var escolhas = Object.keys(kitSel).filter(function (id) { return kitSel[id]; });
  if (!window.confirm("Confirmar este kit? Você só escolhe uma vez.")) return true;
  kitSalvando = true; kitAtualizar();
  gravar("perfil_kit", { escolhas: escolhas }).then(function (r) {
    kitSalvando = false;
    if (r) { j.inv = r.inv; j.moedas = r.moedas; j.kitFeito = true; j.kit = null; kitMsg = ""; invMsg = "Kit inicial entregue. Bom jogo!"; renderizar(); }
    else { kitMsg = "Não foi possível salvar o kit. Veja o aviso no topo."; kitAtualizar(); }
  });
  return true;
}

function viewInventario() {
  var j = PUB.jogador;
  if (!j) return "<h1>Inventário</h1>" + criarPersonagemHTML();
  return "<h1>Inventário</h1>" + kitHTML(j) + '<p class="lead">Tudo o que o seu personagem carrega. Você edita à vontade, e o mestre vê e também pode mexer. Marque o escudo ao lado do item para destacar o que está equipado.</p>' + invCorpoHTML(j, false);
}

function invRedesenharLista() {
  var d = invDono(), el = document.getElementById("invLista"), r = document.getElementById("invResumo");
  if (el) el.innerHTML = invListaHTML(d, !!MESTRE);
  if (r) r.outerHTML = invResumoHTML(d, !!MESTRE);
}
function invAtualizarTags(it) {
  var t = document.getElementById("it-tags-" + it.id);
  if (!t) return;
  var tags = '<span class="tag role">' + esc(catNome(it.cat)) + "</span>";
  if (it.raridade && it.raridade !== "comum") tags += '<span class="tag leg">' + esc(it.raridade) + "</span>";
  t.innerHTML = tags + '<span class="tag role">' + ic("mochila") + pesoItemTxt(it) + "</span>" + modsTags(it);
}
function invAtualizarResumo() {
  var r = document.getElementById("invResumo");
  if (r) r.outerHTML = invResumoHTML(invDono(), !!MESTRE);
}
function invMsgSet(t) { invMsg = t; var m = document.getElementById("invMsg"); if (m) m.textContent = t; }

function invAplicar(r) {
  var d = invDono();
  if (r && d) { d.inv = r.inv; d.moedas = r.moedas; }
  return !!r;
}

function invAdicionar(item, nomeMsg) {
  invOp("add", { item: item }).then(function (r) {
    if (invAplicar(r)) { invMsg = nomeMsg + " adicionado."; renderizar(); } else invMsgSet("Não foi possível adicionar. Veja o aviso no topo.");
  });
}
function invDeTemplate(t, qtd, mestre) {
  var item = { nome: t.nome, cat: t.cat, efeito: t.efeito || "", desc: t.desc || "", peso: t.peso || 0, valor: t.valor || 0, raridade: t.raridade || "comum", ref: String(t.id || "").slice(0, 40), qtd: qtd, def: t.def || 0, desl: t.desl || 0, mana: t.mana || 0 };
  if (mestre) { item.mestre = t.mestre || ""; item.sinergia = t.sinergia || []; item.fase = t.fase || ""; }
  return item;
}
function num(id, dflt) { var e = document.getElementById(id); var v = e ? parseFloat(String(e.value).replace(",", ".")) : NaN; return isNaN(v) ? dflt : v; }

/* Cliques do inventário. Devolve true se tratou o clique. */
function invClick(b) {
  if (kitClick(b)) return true;
  var d = b.dataset;
  if (d.itog) {
    var corpo = document.getElementById("ic-" + d.itog), abrir = corpo ? corpo.hidden : false;
    if (corpo) corpo.hidden = !abrir;
    invAbertos[d.itog] = abrir;
    b.setAttribute("aria-expanded", String(abrir));
    return true;
  }
  if (d.iqtd) {
    var it = invAchar(d.iqtd);
    if (!it) return true;
    var q = Math.max(0, Math.min(9999, (parseInt(it.qtd, 10) || 0) + parseInt(d.d, 10)));
    if (q === (parseInt(it.qtd, 10) || 0)) return true;
    if (q === 0) {
      /* Acabou: o item sai do inventário (o servidor também remove quando a quantidade chega a 0). */
      invOp("set", { id: it.id, campos: { qtd: 0 } }).then(function (r) {
        if (invAplicar(r)) { invMsg = it.nome + ": acabou, saiu do inventário."; renderizar(); }
        else invMsgSet("Não foi possível atualizar a quantidade. Veja o aviso no topo.");
      });
      return true;
    }
    it.qtd = q;
    var qe = document.getElementById("q-" + d.iqtd);
    if (qe) qe.textContent = q;
    invAtualizarResumo(); invAtualizarTags(it);
    invOp("set", { id: it.id, campos: { qtd: q } });
    return true;
  }
  if (d.idel) {
    var del = invAchar(d.idel);
    if (!del) return true;
    if (!window.confirm("Remover " + del.nome + " do inventário?")) return true;
    invOp("del", { id: d.idel }).then(function (r) { if (invAplicar(r)) { invMsg = del.nome + " removido."; renderizar(); } });
    return true;
  }
  if (d.invcat) { invCat = d.invcat; document.querySelectorAll("#invCats .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.invcat === invCat)); }); invRedesenharLista(); return true; }
  if (b.id === "invAddBase") {
    var t = itemBase((document.getElementById("invBase") || {}).value);
    if (t) invAdicionar(invDeTemplate(t, Math.max(1, Math.min(999, Math.round(num("invBaseQtd", 1)))), false), t.nome);
    return true;
  }
  if (b.id === "invAddCat" && MESTRE) {
    var id = (document.getElementById("invCatSel") || {}).value, tc = null;
    (EST.itens || []).forEach(function (i) { if (i.id === id) tc = i; });
    if (tc) invAdicionar(invDeTemplate(tc, Math.max(1, Math.min(999, Math.round(num("invCatQtd", 1)))), true), tc.nome);
    return true;
  }
  if (b.id === "invAddNovo" && MESTRE) {
    var nome = ((document.getElementById("invNNome") || {}).value || "").trim();
    if (!nome) { invMsgSet("Dê um nome ao item."); return true; }
    invAdicionar({ nome: nome, cat: (document.getElementById("invNCat") || {}).value, qtd: Math.max(1, Math.round(num("invNQtd", 1))), peso: Math.max(0, num("invNPeso", 0)),
      valor: Math.max(0, Math.round(num("invNValor", 0) * 100)), efeito: (document.getElementById("invNEfeito") || {}).value || "", desc: (document.getElementById("invNDesc") || {}).value || "" }, nome);
    return true;
  }
  return false;
}

/* Mudanças em campos do inventário (ao sair do campo). */
function invChange(el) {
  if (kitChange(el)) return true;
  var d = el.dataset || {};
  if (d.ieq !== undefined && d.ieq !== "") {
    var it = invAchar(d.ieq);
    if (!it) return true;
    it.equip = el.checked;
    invOp("set", { id: it.id, campos: { equip: el.checked } });
    invAtualizarResumo();
    var card = el.closest(".item");
    if (card) card.classList.toggle("equip", el.checked);
    return true;
  }
  if (d.imoeda) {
    var dono = invDono();
    if (!dono) return true;
    var m = extras({ po: 0, pp: 0, pc: 0 }, dono.moedas || {});
    m[d.imoeda] = Math.max(0, Math.min(999999999, parseInt(el.value, 10) || 0));
    dono.moedas = m;
    invOp("moedas", { moedas: m });
    return true;
  }
  if (d.ifld) {
    var item = invAchar(d.iid);
    if (!item) return true;
    var campo = d.ifld, v = el.value, envio;
    if (campo === "peso") { v = Math.max(0, Number(v) || 0); }
    else if (campo === "valor") { v = Math.max(0, Math.round((Number(v) || 0) * 100)); }
    else if (campo === "def" || campo === "desl" || campo === "mana") { v = Math.max(-10, Math.min(10, parseInt(v, 10) || 0)); el.value = v; }
    else if (campo === "nome" && !String(v).trim()) { el.value = item.nome; return true; }
    else if (campo === "sinergia") { v = String(v).split(",").map(function (x) { return x.trim(); }).filter(Boolean); }
    item[campo] = v;
    envio = v;
    invOp("set", { id: item.id, campos: (function () { var o = {}; o[campo] = envio; return o; })() });
    if (campo === "nome") { var nb = document.querySelector('.item[data-iid="' + item.id + '"] .item-nome b'); if (nb) nb.textContent = v; }
    if (campo === "peso" || campo === "def" || campo === "desl" || campo === "mana" || campo === "cat") { invAtualizarResumo(); invAtualizarTags(item); }
    if (campo === "cat" || campo === "efeito" || campo === "mestre" || campo === "sinergia" || campo === "fase") { /* atualiza o cabeçalho na próxima vez que a lista for desenhada */ }
    return true;
  }
  return false;
}

function invInput(el) {
  if (el.id === "invBusca") { invQ = el.value; var l = document.getElementById("invLista"); if (l) l.innerHTML = invListaHTML(invDono(), !!MESTRE); return true; }
  return false;
}

/* ============================ ROTEAMENTO ============================ */

var VIEWS = [
  ["inicio", "Início", "casa"], ["perfil", "Perfil", "grupo"], ["meu-grimorio", "Meu grimório", "livro"], ["inventario", "Inventário", "mochila"], ["acao", "Ação", "espada"], ["regras", "Regras", "prancheta"], ["niveis", "Níveis", "cima"],
  ["vilarejos", "Vilarejos", "pino"], ["mapa", "Mapa", "bussola"]
];
var VIEWFN = {
  "inicio": viewInicioJogador, "perfil": viewPerfil, "meu-grimorio": viewMeuGrimorio, "inventario": viewInventario, "acao": viewAcaoJogador, "regras": viewRegras, "niveis": viewNiveis, "vilarejos": viewVilarejos, "mapa": viewMapa
};
function listaViews() { return MESTRE ? MESTRE.views : VIEWS; }

function rotaAtual() {
  var r = (location.hash || "").replace(/^#/, "");
  return listaViews().some(function (v) { return v[0] === r; }) ? r : "inicio";
}

/* Menu em grupos. Cada item é o id de uma aba, ou um grupo ({ g: nome, i: ids }) que abre uma lista. */
var NAV_JOGADOR = ["inicio", "perfil", "meu-grimorio", "inventario", "acao", { g: "Guia", i: ["regras", "niveis", "vilarejos", "mapa"] }];
function navAtual() { return MESTRE ? MESTRE.nav : NAV_JOGADOR; }
function viewInfo(id) { var r = null; listaViews().forEach(function (v) { if (v[0] === id) r = v; }); return r; }
function linkNav(id, atual) {
  var v = viewInfo(id);
  var aviso = id === "perfil" && !MESTRE && perfilSujo() ? ' <span class="pt" title="Alterações não salvas no Perfil" aria-label="Alterações não salvas">●</span>' : "";
  return v ? '<a href="#' + id + '"' + (id === atual ? ' aria-current="page"' : "") + ">" + ic(v[2]) + v[1] + aviso + "</a>" : "";
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
  if (qChange(e.target)) return;
  if (invChange(e.target)) return;
  if (MESTRE) { MESTRE.change(e.target); return; }
  if (e.target.id === "perfilImg") enviarRetrato(e.target);
  else if (e.target.dataset && e.target.dataset.pf) editarPerfil(e.target);

});

app.addEventListener("input", function (e) {
  if (invInput(e.target)) return;
  if (MESTRE) { MESTRE.input(e.target); return; }
  if (e.target.dataset && e.target.dataset.pf) editarPerfil(e.target);
});

app.addEventListener("submit", function (e) {
  if (e.target.id === "formConta") { e.preventDefault(); enviarConta(e.target); }
});

app.addEventListener("click", function (e) {
  var mk = e.target.closest ? e.target.closest(".marker") : null;
  if (mk && mk.dataset && mk.dataset.id) { selecionarLocal(mk.dataset.id); return; }
  var b = e.target.closest("button");
  if (!b) return;
  if (qClick(b)) return;
  if (invClick(b)) return;
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
  if (b.dataset.bonusStep && PUB.jogador && PUB.jogador.atrTravado && !salvandoBonus) {
    /* O toque muda só o rascunho (a tela atualiza na hora). Nada é enviado até apertar "Salvar atributos". */
    rascunhos();
    bonusRasc[b.dataset.bonusStep] = Math.max(-5, Math.min(10, bonusRasc[b.dataset.bonusStep] + parseInt(b.dataset.d, 10)));
    bonusMsg = "";
    renderizar();
    return;
  }
  if (b.id === "criarPersonagem") { criarPersonagem(); return; }
  if (b.id === "perfilSalvarBonus") { salvarBonus(); return; }
  if (b.id === "perfilDescartarBonus") { descartarBonus(); return; }
  if (b.id === "perfilSalvarInfo") { salvarInfo(); return; }
  if (b.id === "perfilDescartarInfo") { descartarInfo(); return; }
  if (b.id === "perfilSalvarAtr" && PUB.jogador && !PUB.jogador.atrTravado) {
    var copia = { poder: atrRasc.poder, destreza: atrRasc.destreza, inteligencia: atrRasc.inteligencia };
    if (copia.poder + copia.destreza + copia.inteligencia !== 5) return;
    if (!window.confirm("Salvar estes atributos?\n\nPoder " + sinal(copia.poder) + ", Destreza " + sinal(copia.destreza) + ", Inteligência " + sinal(copia.inteligencia) + "\n\nDepois de salvar, a base fica travada e só o mestre pode mudar.")) return;
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
