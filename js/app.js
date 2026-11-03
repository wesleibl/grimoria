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
    bonus: "+1 em testes de Poder para carregar, empurrar ou aguentar esforço.", gancho: "As plantações estão sendo atacadas por criaturas de mana.", attr: "poder" },
  { nome: "Porto Salgado", tema: "pesqueiro, comércio", desc: "Pessoas falantes e espertas, acostumadas com viajantes e contrabando.",
    bonus: "+1 em testes de Inteligência para negociar ou conseguir informação.", gancho: "Um navio misterioso atracou e ninguém desceu.", attr: "inteligencia" },
  { nome: "Floresta dos Cedros", tema: "caçadores, isolado", desc: "Rastreadores que vivem entre as árvores.",
    bonus: "+1 em testes de Destreza para furtividade e rastreio.", gancho: "Caçadores estão desaparecendo na mata.", attr: "destreza" },
  { nome: "Pedra Velha", tema: "mineradores, perto das ruínas", desc: "Gente teimosa e resistente, que já ouviu histórias do que existe nas minas.",
    bonus: "+1 em testes de Inteligência para ruínas, símbolos e magia antiga.", gancho: "Uma mina foi lacrada depois de um tremor estranho.", attr: "inteligencia" }
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
var KIND_ICON = { "ataque simples": "espada", "básico": "orbe", "médio": "brilho", "ultimate": "estrela", "reação": "reacao", "provocar": "megafone", "provocar sutil": "olho", "melhora de Aparar": "cima", "passiva": "infinito", "habilidade": "brilho", "ataque": "espada" };
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
  var h = '<div class="rules"><h1>Regras</h1><p class="lead">O essencial para mestrar sem folhear anotações.</p>';

  h += "<h2>Atributos</h2>" + table(["Atributo", "Para que serve"], [
    ["<b>Poder</b>", "Ataque físico, fortalecimento, magias de dano, saltos, empurrar, aguentar pancada."],
    ["<b>Destreza</b>", "Furtividade, precisão, esquiva, mobilidade."],
    ["<b>Inteligência</b>", "Suporte, cura, controle, conhecimento, percepção."]
  ]);

  h += "<h2>Criar o personagem</h2>" + panel("Números", "<ul>" +
    "<li><b>Treino prévio:</b> distribua +5 pontos entre os atributos, no máximo +3 em um. Isso é feito antes de ver o grimório.</li>" +
    "<li><b>Vida:</b> 20.</li><li><b>Mana:</b> 10, igual para todos.</li>" +
    "<li><b>Defesa:</b> 10 + Destreza.</li>" +
    "<li><b>Redução de dano:</b> igual ao Poder (o dano mínimo é sempre 1).</li>" +
    "<li><b>Deslocamento:</b> 6 casas por turno (opcional: 6 + Destreza).</li>" +
    '<li>Ao subir de nível, veja a aba <a href="#niveis">Níveis</a>.</li></ul>');

  h += "<h2>Rolagens</h2>" + panel("Teste", "<p>Role d20 + atributo contra a dificuldade que você define. Exemplo: um salto usa Poder, não Atletismo.</p>" +
    table(["Dificuldade", "Valor"], [["Fácil", "10"], ["Média", "15"], ["Difícil", "20"]]));

  h += "<h2>Combate</h2>" + panel("Como começar",
    "<ol><li>Anuncie o combate e descreva a cena.</li>" +
    "<li>Posicione todo mundo (corpo a corpo, perto, longe, ou no mapa).</li>" +
    "<li><b>Iniciativa:</b> cada jogador rola d20 + Destreza. Você rola um dado por tipo de inimigo (3 bandidos agem juntos).</li>" +
    "<li>Anote a ordem, do maior para o menor, de forma visível na mesa.</li>" +
    "<li>Em cada turno: 1 movimento e 1 ação. Depois de todos agirem, começa uma nova rodada na mesma ordem.</li></ol>");

  h += panel("Acertar e causar dano", "<p>São dois passos separados. Primeiro se verifica se acertou. Só depois se calcula o dano.</p>" +
    table(["Momento", "Rolagem", "Compara com"], [
      ["Acertou?", "d20 + ataque", "Defesa do alvo (jogador: 10 + Destreza; bandido: 10)"],
      ["Quanto de dano?", "dado de dano", "Nada. Se o alvo é jogador, subtrai o Poder dele (mínimo 1)."]
    ]) +
    "<p><b>Exemplo:</b> a Lia (Destreza +3, Poder +1) tem Defesa 13. O bandido rola 12 + 2 = 14 e acerta. Rola o dano: 1d6 + 1 = 5. Ela subtrai o Poder (1) e perde 4 de vida.</p>" +
    "<p>Os inimigos, por enquanto, não têm redução de dano. O dano do jogador vai inteiro para a vida do inimigo.</p>");

  h += "<h2>Mana</h2>" + panel("Custos e recuperação", "<ul><li>Custos: 1 (básico), 2 (médio) e 4 (ultimate).</li><li>Recupera 1 por turno, ou tudo em um descanso.</li></ul>");

  h += "<h2>Deslocamento</h2>" + panel("Com mapa e sem mapa",
    "<ul><li><b>Com mapa:</b> 6 casas por turno (1 casa = 1,5 m). Perder 2 de deslocamento deixa o alvo com 4. Dobrar deixa com 12.</li>" +
    "<li><b>Teatro da mente:</b> use faixas de distância (corpo a corpo, perto, longe). “Perder deslocamento” vira gastar um movimento a mais para se aproximar.</li>" +
    "<li>Com deslocamento 0 o alvo fica imobilizado, mas ainda pode atacar e lançar feitiços.</li></ul>");

  /* As reações dos tanks descrevem magias de grimórios específicos: só o mestre vê. */
  if (souMestre()) {
  h += "<h2>Os tanks</h2>" + '<p class="lead">Todo grimório tem pelo menos um ataque simples de 1 de mana. Os de tank têm também formas de proteger o grupo.</p>' +
    '<div class="cols">' +
    panel(ic("escudo") + "Muralha (Poder)", "<p>Reduz dano, absorve golpes e protege os aliados. Usa <b>Provocar</b>, <b>Interpor-se</b> e <b>Absorver</b>.</p>") +
    panel(ic("vento") + "Esquiva (Destreza)", "<p>Faz o inimigo errar e desvia ataques. Usa <b>Aparar</b>, <b>Refletir</b> e <b>Isca</b>.</p>") + "</div>";

  h += panel(ic("reacao") + "Aparar (ataques físicos)", "<ul>" +
    "<li><b>Quando:</b> um inimigo acerta um aliado perto de você, antes do dano.</li>" +
    "<li><b>Teste:</b> d20 + Destreza contra o total do ataque do inimigo. Empate favorece o tank.</li>" +
    "<li><b>Sucesso:</b> o ataque é cancelado. <b>Falha:</b> acerta o aliado normalmente.</li>" +
    "<li><b>Custo:</b> perde a ação do próximo turno (ainda pode se mover), mesmo se der certo. Sem custo de mana.</li>" +
    "<li>Só dá para tentar uma vez por rodada.</li></ul>");

  h += panel(ic("reacao") + "Refletir e Absorver (ataques mágicos)",
    "<p>Contra feitiços, cada tank tem uma reação, com punição alta se falhar.</p>" +
    table(["Custo do feitiço inimigo", "Dificuldade"], [["1 mana", "12"], ["2 mana", "15"], ["4 mana (ultimate)", "18"]]) +
    "<ul><li><b>Refletir (Destreza):</b> d20 + Destreza. Sucesso: o feitiço volta contra quem lançou.</li>" +
    "<li><b>Absorver (Poder):</b> d20 + Poder. Sucesso: o feitiço é anulado e o tank ganha Cargas iguais ao custo de mana dele (máximo 4). Cada Carga vira +1d4 de dano no próximo ataque, ou 1 de mana, ou +1 de redução de dano até o fim da rodada.</li>" +
    "<li><b>Falha nos dois:</b> o feitiço atinge o alvo normalmente, o tank perde o próximo turno inteiro e perde 2 de mana.</li>" +
    "<li>Se o feitiço tiver rolagem de ataque, pode comparar com o total do ataque em vez da dificuldade fixa.</li>" +
    "<li>Contra feitiços em área, só protege o próprio tank.</li></ul>");
  }

  h += "<h2>Dano contínuo</h2>" + panel(ic("ampulheta") + "Resistência a cada turno",
    "<p>Feitiços com dano contínuo (veneno, queimadura, sangramento) têm um aviso no card. A cada turno do alvo:</p>" +
    "<ol><li>No início do turno dele, o alvo rola a resistência indicada no card (por exemplo, Poder contra 12), se o efeito permitir.</li>" +
    "<li>Se passar, ele evita o dano daquele turno. Se falhar, sofre o dano normalmente.</li>" +
    "<li>Sugestão: se passar por 5 ou mais, o efeito termina.</li></ol>" +
    "<p>Alguns efeitos não podem ser resistidos. O card avisa quando for assim.</p>");

  h += "<h2>Combinações de magias</h2>" +
    '<div class="note"><p><b>Decisão do mestre.</b> As magias podem se misturar, mas só você decide se e quando isso acontece. É uma opção para deixar o combate mais criativo, não uma regra fixa.</p></div>' +
    panel(ic("etiqueta") + "Estados", "<p>Muitos feitiços deixam um estado no alvo, mostrado como etiqueta no card. Os estados são o ponto de partida das combinações.</p><p>Estados usados: Molhado, Chocado, Congelado, Lento, Em chamas, Envenenado, Sangrando, Preso, Cego, Atordoado, Silenciado, Enferrujado e Marcado.</p>") +
    table(["Combinação", "O que o mestre pode permitir"], [
      ["Molhado + choque", "Inimigos molhados também levam o choque quando outro inimigo próximo é atingido por um feitiço de raio. Exemplo: um inimigo molhado perto de um alvo chocado sofre metade do dano."],
      ["Molhado + gelo", "O alvo congela com mais facilidade (a dificuldade da resistência sobe em 2)."],
      ["Em chamas + vento", "O fogo se espalha para os inimigos próximos."],
      ["Em chamas + água", "A água apaga as chamas e cria vapor: quem estiver perto fica com -1 nas rolagens por 1 turno."],
      ["Envenenado + fogo", "A nuvem de veneno pega fogo e explode em área."],
      ["Preso + choque ou aço", "O metal conduz: o alvo preso sofre dano extra."],
      ["Terra + água", "Vira lama: os inimigos na área perdem 2 de deslocamento."]
    ]);

  if (souMestre()) h += "<h2>Dicas de mestre</h2>" + panel("Para o primeiro mestrado", "<ul>" +
    "<li>Se uma regra travar o jogo, decida rápido e ajuste depois.</li>" +
    "<li>Combate com vida baixa (15 a 20) e dano de 3 a 8 dura poucas rodadas.</li>" +
    "<li>Se ninguém perde vida, suba o dado de dano dos inimigos em um degrau (1d6 vira 1d8).</li>" +
    "<li>Pergunte sempre “o que você faz?” e descreva o resultado, não só os números.</li>" +
    "<li>Contra bandidos fracos, aparar quase nunca compensa. Contra chefes, compensa. Deixe o jogador decidir pelo risco.</li><li>Com 8 jogadores, combine um tempo curto por turno (cerca de 30 segundos) e peça que decidam a ação enquanto esperam a vez.</li></ul>");

  return h + "</div>";
}

function viewNiveis() {
  var h = "<h1>Níveis e evolução</h1>" +
    '<p class="lead">Sem pontos de experiência. Todos os personagens sobem de nível juntos, em marcos da história. Assim ninguém fica para trás, e com 8 jogadores você não precisa controlar nada.</p>';

  h += "<h2>Tabela de níveis</h2>" + table(["Nível", "Quando sobem", "Vida máx.", "Mana máx.", "Atributos", "Limite por atributo", "Grimório"], [
    ["1", "Início (Sessão Zero e Sessão 1)", "20", "10", "+5 pontos para distribuir", "+3", "Feitiços iniciais"],
    ["2", "Fim da Sessão 1", "24", "10", "+1 ponto", "+3", "Aprimorar 1 feitiço"],
    ["3", "Meio do Arco 1", "28", "12", "+1 ponto", "+4", "Nova habilidade"],
    ["4", "Fim do Arco 1", "32", "12", "+1 ponto", "+4", "Aprimorar 1 feitiço"],
    ["5", "Fim do Arco 2", "36", "14", "+1 ponto", "+5", "Despertar do grimório"]
  ]) + "<p>No nível 5, cada personagem terá recebido 9 pontos de atributo no total. A Defesa (10 + Destreza) e a redução de dano (Poder) sobem junto com os atributos.</p>";

  h += "<h2>O que acontece ao subir de nível</h2>" +
    panel(ic("cima") + "Todo nível", "<ul><li>A Vida e a Mana voltam ao máximo, já com o novo máximo.</li><li>O personagem ganha +1 ponto de atributo, respeitando o limite da tabela.</li><li>O grimório evolui (veja abaixo).</li></ul>") +
    panel(ic("brilho") + "Aprimorar um feitiço (níveis 2 e 4)",
      "<p>O jogador escolhe um feitiço do grimório e um aprimoramento:</p>" +
      "<ul><li><b>Mais dano:</b> +1 dado de dano, ou +2 de dano fixo.</li><li><b>Mais barato:</b> -1 de mana (mínimo 1).</li><li><b>Mais alcance:</b> +1 alvo, ou uma área maior.</li><li><b>Mais duradouro:</b> +1 turno de duração.</li><li><b>Mais difícil de resistir:</b> +2 na dificuldade do teste que o feitiço impõe, ou +2 na rolagem de ataque dele.</li></ul>" +
      "<p>Cada feitiço recebe no máximo 2 aprimoramentos, e nunca o mesmo duas vezes. Um feitiço de 4 mana não pode custar menos de 3. Você aprova cada escolha.</p>") +
    panel(ic("espada") + "Nova habilidade (nível 3)",
      "<p>No nível 3, todo grimório ganha uma habilidade nova, já pronta. Ela aparece no card, marcada como Nível 3, e custa 2 ou 3 de mana.</p>" +
      "<p>Os tanks ganham uma habilidade a cada nível (veja abaixo), então a do nível 3 deles é uma das que já estão na lista.</p>") +
    panel(ic("estrela") + "Despertar do grimório (nível 5)",
      "<p>Cada jogador cria com você um feitiço novo, ligado ao tema do grimório dele.</p>" +
      "<ul><li>Custa 4 de mana e só pode ser usado uma vez por combate.</li><li>Tem um efeito de impacto, na altura de um ultimate.</li><li>Você aprova o efeito para não quebrar o equilíbrio.</li></ul>" +
      "<p><b>Ideias de exemplo:</b> Chamas: Sol Ardente (os inimigos próximos sofrem 3d6 e ficam em chamas). Luz Curativa: Aurora (cura total de um aliado e remove todos os estados negativos). Gelo: Inverno Absoluto (os inimigos próximos ficam congelados por 1 turno).</p>");

  /* Daqui para baixo: habilidades futuras dos tanks e números dos inimigos, só para o mestre. */
  if (!souMestre()) return h;
  var tanks = GRIMORIOS.filter(function (g) { return g.papel === "Tank"; });
  h += "<h2>Os tanks evoluem de outro jeito</h2>" +
    '<p>Os tanks já têm habilidades futuras prontas. Cada marco vira um nível: o Marco 1 chega no nível 2, o Marco 2 no nível 3, e assim por diante. Eles não aprimoram feitiços. No nível 5, os tanks que ainda não receberam uma habilidade futura (Aço e Névoa) fazem o Despertar.</p>' +
    table(["Grimório", "Nível 2", "Nível 3", "Nível 4", "Nível 5"], tanks.map(function (g) {
      var f = g.futuras || [];
      return [g.nome, f[0] ? f[0].nome : "-", f[1] ? f[1].nome : "-", f[2] ? f[2].nome : "-", f[3] ? f[3].nome : "Despertar do grimório"];
    }));

  h += "<h2>Inimigos por nível</h2>" +
    "<p>Uma referência para criar inimigos novos. Os valores são para 4 jogadores (aplique as regras do Bestiário para 8).</p>" +
    table(["Nível", "Ataque", "Defesa", "Dano típico", "Capanga (Vida)", "Normal (Vida)", "Chefe (Vida)"], [
      ["1", "+2 a +3", "10 a 13", "1d6 + 1 a 1d8 + 1", "6 a 10", "16 a 18", "-"],
      ["2", "+3 a +4", "11 a 14", "1d6 + 2 a 1d8 + 2", "12 a 14", "22 a 26", "50 a 60"],
      ["3", "+4 a +5", "12 a 15", "1d8 + 2 a 1d10 + 2", "8 a 16", "28 a 40", "65 a 80"],
      ["4", "+5 a +6", "13 a 15", "1d8 + 3 a 2d6 + 2", "14 a 18", "28 a 45", "80 a 90"],
      ["5", "+6 a +8", "14 a 17", "2d6 + 3 a 3d6 + 3", "20", "40", "110 a 150"]
    ]);

  h += "<h2>Dicas</h2>" + panel("Para a mesa",
    "<ul><li>Suba todos juntos, mesmo se alguém faltar a uma sessão.</li><li>Anuncie o marco no fim da sessão, para os jogadores escolherem o aprimoramento em casa.</li><li>Se o grupo estiver forte demais, não suba o nível: aumente a dificuldade dos desafios.</li><li>Os números desta tabela são um ponto de partida. Ajuste depois da Sessão 1.</li></ul>");
  return h;
}

function viewVilarejos() {
  var h = "<h1>Vilarejos</h1>" + '<p class="lead">Todo personagem é plebeu e escolhe um dos quatro. Com 8 jogadores, a sugestão é 2 por vilarejo, o que já cria laços entre os personagens. Cada um dá um pequeno bônus de origem.</p><div class="cols">';
  VILAREJOS.forEach(function (v) {
    h += '<section class="panel" style="border-left:8px solid ' + ATTR[v.attr].cor + '"><h3>' + v.nome + '</h3><p class="meta">' + v.tema + "</p><p>" + v.desc + "</p>" +
      "<p><b>Bônus:</b> " + v.bonus + "</p><p><b>Gancho:</b> " + v.gancho + "</p></section>";
  });
  h += "</div>";
  if (souMestre()) h += panel("Para equilibrar", "<p>Hoje são +1 em Poder, +1 em Destreza e +2 em Inteligência (Porto Salgado e Pedra Velha). Se quiser, troque um dos bônus de Inteligência por Poder ou Destreza.</p>");
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
    "<p>Grimoria é o mundo onde a magia nasce nos grimórios. O continente conhecido abriga o Reino de Alvorada, governado a partir de Alta Lumen, onde fica a Ordem dos Cavaleiros Mágicos, o único grupo de cavaleiros mágicos que protege o reino inteiro.</p>" +
    "<p>Toque em um marcador para ver o que há ali." + (souMestre() ? " Os nomes são provisórios: troque pelos que combinarem mais com você." : "") + "</p>";
}

function imagemDe(tipo, ref) {
  var r = null;
  IMAGENS.forEach(function (i) { if (i.tipo === tipo && i.ref === ref) r = i; });
  return r;
}
function imgUrl(id) { return API + "?a=img&id=" + encodeURIComponent(id); }

function desenharDetalhe() {
  var box = document.getElementById("mapaDetalhe");
  if (!box) return;
  var l = null;
  listaLocais().forEach(function (x) { if (x.id === localSel) l = x; });
  var rev = getRev();
  if (!l || (l.secreto && !camadaMestre()) || (modoMesa && !rev[l.id])) { box.innerHTML = introMapa(); return; }
  var h = "<h3>" + l.nome + '</h3><div class="meta"><span class="tag role">' + TIPO_NOME[l.tipo] + "</span>" + (souMestre() ? '<span class="tag role">' + l.arco + "</span>" : "") + "</div>";
  h += "<p>" + l.pub + "</p>";
  var im = imagemDe("local", l.id);
  if (im) h += '<a href="' + imgUrl(im.id) + '" target="_blank" rel="noopener"><img class="local-img" src="' + imgUrl(im.id) + '" alt="Imagem de ' + esc(l.nome) + '"></a>';
  if (souMestre() && !modoMesa) {
    if (!l.secreto) h += '<label class="rev-label"><input type="checkbox" class="rev" data-id="' + l.id + '"' + (rev[l.id] ? " checked" : "") + "> Revelado aos jogadores</label>";
    h += '<p class="pj-botoes"><input type="file" accept="image/*" class="vh" id="localImg" data-local="' + l.id + '"><label class="btn" for="localImg">' + (im ? "Trocar imagem" : "Adicionar imagem") + "</label>" +
      (im ? '<button type="button" data-imgdel="' + im.id + '">' + (confirmarDelImg === im.id ? "Clique de novo" : "Remover imagem") + "</button>" : "") + "</p>";
    if (im) h += '<p class="mdica">A imagem aparece para os jogadores junto com o local, quando ele estiver revelado.</p>';
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
      : "Marque “Revelado aos jogadores” em cada local conforme eles descobrirem. Os jogadores veem no site só os locais revelados. Os locais esmaecidos ainda não foram revelados.") + "</p>";
  }
  h += legendaMapa();
  h += '<div class="mapa-grid"><div class="mapa-box"><svg id="mapaSvg" viewBox="0 0 1000 680" role="img" aria-label="Mapa de Grimoria com o reino, os vilarejos e os mistérios"></svg></div>' +
    '<aside class="panel mapa-detalhe" id="mapaDetalhe" aria-live="polite"></aside></div>';
  h += galeriaMapas();
  if (m && !modoMesa) h += "<h2>Roteiro por arco</h2>" + tabelaArcos();
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
  campos.forEach(function (c) { if (c[1]) h += '<p><b>' + c[0] + ":</b> " + esc(c[1]) + "</p>"; });
  return h + "</div></div>" + atalhosJogador();
}

function atalhosJogador() {
  return "<h2>Atalhos</h2>" + '<div class="cols">' +
    panel(ic("livro") + "Meu grimório", '<p>' + (PUB.grimorio ? "Veja as magias que você já desbloqueou." : "Seu grimório aparece aqui depois da cerimônia.") + '</p><p><a href="#meu-grimorio">Abrir</a></p>') +
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
    PUB = { jogador: d.jogador, grimorio: d.grimorio, locais: d.locais || [] };
    renderizar();
  }).catch(function (e) {
    app.innerHTML = '<div class="lock"><h1>Sem conexão</h1><p>' + esc(e.message) + '</p><p><button type="button" class="primary" id="tentarDeNovo">Tentar de novo</button></p></div>';
  });
}

/* ============================ ROTEAMENTO ============================ */

var VIEWS = [
  ["inicio", "Início", "casa"], ["meu-grimorio", "Meu grimório", "livro"], ["regras", "Regras", "prancheta"], ["niveis", "Níveis", "cima"],
  ["vilarejos", "Vilarejos", "pino"], ["mapa", "Mapa", "bussola"]
];
var VIEWFN = {
  "inicio": viewInicioJogador, "meu-grimorio": viewMeuGrimorio, "regras": viewRegras, "niveis": viewNiveis, "vilarejos": viewVilarejos, "mapa": viewMapa
};
function listaViews() { return MESTRE ? MESTRE.views : VIEWS; }

function rotaAtual() {
  var r = (location.hash || "").replace(/^#/, "");
  return listaViews().some(function (v) { return v[0] === r; }) ? r : "inicio";
}

function montarNav(atual) {
  document.getElementById("nav").innerHTML = USUARIO ? listaViews().map(function (v) {
    return '<li><a href="#' + v[0] + '"' + (v[0] === atual ? ' aria-current="page"' : "") + ">" + ic(v[2]) + v[1] + "</a></li>";
  }).join("") : "";
}

function renderizar() {
  montarTopo();
  if (!USUARIO) {
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
  document.title = (listaViews().filter(function (v) { return v[0] === r; })[0][1]) + " | Grimório do Mestre";
}

window.addEventListener("hashchange", function () { renderizar(); window.scrollTo(0, 0); });

/* ============================ EVENTOS ============================ */

app.addEventListener("change", function (e) {
  if (MESTRE) MESTRE.change(e.target);
});

app.addEventListener("input", function (e) {
  if (MESTRE) MESTRE.input(e.target);
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
