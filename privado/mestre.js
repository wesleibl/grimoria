"use strict";
/* Conteúdo do mestre. O servidor só entrega este arquivo a contas com papel de mestre. */

var GRIMORIOS = [
  { nome: "Grimório da Fortaleza", attr: "poder", papel: "Tank", sub: "tank Muralha", tier: "",
    spells: [
      sp("Impacto Sólido", 1, "ataque simples", "d20 + Poder, dano 1d6. Se acertar, ganha +1 de redução de dano até o início do próximo turno."),
      sp("Chamado da Fortaleza", 2, "provocar", "Até o início do seu próximo turno, os inimigos próximos precisam atacar você. Nesse período, você ganha +1 de redução de dano."),
      sp("Absorver", "reação", "reação", "Contra um ataque mágico. d20 + Poder contra a dificuldade do feitiço (12, 15 ou 18). Sucesso: o feitiço é anulado e você ganha Cargas iguais ao custo de mana dele (máximo 4). Falha: o feitiço atinge o alvo, você perde o próximo turno inteiro e 2 de mana."),
      sp("Bastião Inabalável", 4, "ultimate", "Por 3 turnos, você ganha +3 de redução de dano e os aliados próximos ganham +2.")
    ],
    futuras: [
      fu(1, "Interpor-se", 1, "reação", "Quando um inimigo acerta um aliado perto de você, você recebe o golpe no lugar dele e reduz o dano pela sua redução de dano +1. Uma vez por rodada."),
      fu(2, "Pele de Ferro", 2, "médio", "Por 2 turnos, +2 de redução de dano e você não pode ser empurrado nem derrubado."),
      fu(3, "Descarga", 2, "médio", "Gasta todas as Cargas. d20 + Poder, dano 1d6 mais 1d4 por Carga gasta."),
      fu(4, "Última Muralha", "passiva", "passiva", "Uma vez por combate, ao cair a 0 de Vida, você fica com 1, ganha 2 Cargas e os aliados próximos ganham +1 nas rolagens por 1 rodada.")
    ],
    nota: "Cargas: 1 Carga vira +1d4 de dano no próximo ataque, ou 1 de mana, ou +1 de redução de dano até o fim da rodada." },

  { nome: "Grimório do Espelho", attr: "destreza", papel: "Suporte", sub: "espelhos no campo", tier: "",
    spells: [
      sp("Estilhaço", 1, "ataque simples", "d20 + Destreza, dano 1d6. O ataque pode partir de você ou de um espelho seu."),
      sp("Espelho", 1, "básico", "Cria um espelho (Vida 6) numa casa a até 6 casas de você. No máximo 2 ativos: um terceiro desfaz o mais antigo."),
      sp("Passo Refletido", 2, "médio", "Você, ou um aliado ao lado de um espelho seu, é teletransportado para outro espelho seu."),
      sp("Refletir", "reação", "reação", "Contra um ataque mágico, com um espelho seu a até 2 casas do alvo. Custa 1 de mana. d20 + Destreza contra a dificuldade do feitiço (12, 15 ou 18). Sucesso: o feitiço volta contra quem lançou. Falha: o feitiço atinge o alvo e o espelho quebra (sem perder turno nem mana extra). Uma vez por rodada."),
      sp("Salão dos Espelhos", 4, "ultimate", "Por 3 turnos, numa área: os aliados dentro têm -2 para serem acertados e os inimigos dentro têm -2 nas rolagens de ataque. Quem errar um ataque contra um aliado sofre 1d4 de volta.")
    ],
    futuras: [
      fu(1, "Cópia", 2, "médio", "Cria uma cópia de você ou de um aliado por 2 turnos. O primeiro ataque contra o original vai para a cópia, que some."),
      fu(2, "Raio Refletido", 3, "médio", "d20 + Destreza, dano 2d6 em todos os inimigos na linha entre dois espelhos seus."),
      fu(3, "Espelho Perfeito", 4, "ultimate", "Uma vez por combate. Por 1 rodada, todo feitiço inimigo contra você ou aliados próximos é refletido sem teste, mas você não age no próximo turno.", { limite: "1 uso por combate" })
    ],
    nota: "Frágil por natureza: os espelhos têm só 6 de Vida e é preciso posicioná-los antes. O dano vem do posicionamento (Raio Refletido) e a proteção é à distância, sem receber o golpe. Feitiços em área só protegem você mesmo." },

  { nome: "Grimório de Chamas", attr: "poder", papel: "Dano", sub: "dano e fogo contínuo", tier: "",
    spells: [
      sp("Faísca", 1, "ataque simples", "d20 + Poder, dano 1d6."),
      sp("Chama Persistente", 2, "médio", "d20 + Poder, dano 1d4. Se acertar, o alvo fica em chamas e sofre 2 de dano por turno durante 2 turnos.", { aplica: ["Em chamas"], dot: dotRes("Destreza", 12) }),
      sp("Muralha de Fogo", 2, "médio", "Cria uma barreira por 2 turnos. Quem atravessar sofre 1d6. Não precisa de rolagem de ataque."),
      sp("Explosão Solar", 4, "ultimate", "Todos os inimigos próximos fazem teste contra a Defesa. Quem for atingido sofre 2d8.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Luz Curativa", attr: "inteligencia", papel: "Suporte", sub: "suporte e cura", tier: "",
    spells: [
      sp("Raio de Luz", 1, "ataque simples", "d20 + Inteligência, dano 1d4. Se acertar, um aliado próximo recupera 1 de vida."),
      sp("Toque Calmo", 1, "básico", "Cura 1d6 de vida em um aliado."),
      sp("Escudo de Luz", 2, "médio", "O aliado ganha +2 de Defesa até o fim da próxima rodada."),
      sp("Bênção Radiante", 4, "ultimate", "Cura 1d8 em até 4 aliados e dá +1 em todas as rolagens deles por 2 turnos.")
    ],
    futuras: [
      fu(2, "Segunda Chance", 3, "reação", "Quando um aliado a até 6 casas fosse cair a 0 de Vida, ele fica com 1d6 de vida em vez disso, sem cair e sem salvaguardas.", { limite: "1 uso por combate" }),
      fu(3, "Purificação", 2, "médio", "Remove todos os estados negativos de um aliado e cura 1d4.")
    ],
    nota: "Qualquer cura já levanta quem está a 0 de Vida; a Segunda Chance é diferente porque impede a queda. A Purificação limpa tudo em um só aliado, enquanto o Florescer (Raízes) limpa um estado em dois." },

  { nome: "Grimório de Sombras", attr: "destreza", papel: "Suporte", sub: "furtividade", tier: "",
    spells: [
      sp("Farpa Sombria", 1, "ataque simples", "d20 + Destreza, dano 1d4."),
      sp("Passo Sombrio", 1, "básico", "Fica invisível até atacar ou até o fim da próxima rodada."),
      sp("Lâmina Oculta", 2, "médio", "d20 + Destreza, dano 1d8. Se o alvo não te viu, o dano dobra."),
      sp("Eclipse", 4, "ultimate", "Todos os inimigos próximos ficam cegos por 2 turnos (-3 nas rolagens de ataque).")
    ], futuras: [], nota: "Eclipse é forte para 4 de mana. Se virar problema, limite a 1 uso por combate." },

  { nome: "Grimório de Vento", attr: "destreza", papel: "Suporte", sub: "mobilidade, posicionamento e dano leve", tier: "",
    spells: [
      sp("Rajada Cortante", 1, "básico", "d20 + Destreza, dano 1d6, alcance longo. Quem for atingido é empurrado 1 casa."),
      sp("Passo do Vento", 2, "médio", "Move até o dobro do deslocamento e ganha +2 de Defesa até a próxima rodada."),
      sp("Cortina de Vento", 2, "médio", "Por 2 turnos, os ataques à distância contra você e os aliados próximos têm -2."),
      sp("Corrente Ascendente", 4, "ultimate", "Por 2 turnos, você e os aliados próximos voam: ignoram o terreno, ganham +2 de deslocamento e os inimigos têm -2 para acertá-los. Nesse tempo, a sua Rajada Cortante causa +1d4 de dano.")
    ],
    futuras: [
      fu(2, "Impulso", 2, "médio", "Um aliado se move o dobro do deslocamento e o próximo ataque dele ganha +2 na rolagem."),
      fu(3, "Ventania", 3, "médio", "d20 + Destreza contra cada inimigo próximo, dano 1d6 em quem for atingido. Os atingidos são empurrados 2 casas e fazem teste de Poder contra 14: quem falhar cai.")
    ],
    nota: "Híbrido: suporte de posicionamento com um pouco de dano. A Ventania faz menos dano que o Tornado de Quatro Folhas (Espírito Celeste) e a Cortina é menor que a do Redemoinho, para o lendário continuar acima." },

  { nome: "Grimório de Correntes", attr: "inteligencia", papel: "Suporte", sub: "controle", tier: "",
    spells: [
      sp("Chicote de Corrente", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Laço", 1, "básico", "Teste de Inteligência contra a Defesa do inimigo. Se acertar, o alvo perde 3 de deslocamento."),
      sp("Prisão de Aço", 2, "médio", "Prende um inimigo por 1 turno (ele não age). Teste de Inteligência contra a Defesa dele."),
      sp("Jaula Total", 4, "ultimate", "Prende até 3 inimigos por 1 turno.", { limite: "1 uso por combate" })
    ], futuras: [], nota: "Jaula Total é muito forte, por isso já vale 1 uso por combate." },

  { nome: "Grimório de Reforço", attr: "poder", papel: "Dano", sub: "fortalecimento", tier: "",
    spells: [
      sp("Soco Reforçado", 1, "ataque simples", "d20 + Poder, dano 1d6."),
      sp("Punho Pesado", 1, "básico", "O próximo ataque físico causa +1d6 de dano."),
      sp("Golpe Duplo", 2, "médio", "Ataca duas vezes o mesmo alvo: d20 + Poder para cada ataque, dano 1d4 em cada um."),
      sp("Fúria Titânica", 4, "ultimate", "Por 3 turnos, +2 em todas as rolagens de Poder e +2 de dano.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Lâminas", attr: "destreza", papel: "Dano", sub: "dano corpo a corpo e precisão", tier: "",
    spells: [
      sp("Corte Veloz", 1, "ataque simples", "d20 + Destreza, dano 1d6."),
      sp("Lâmina Conjurada", 1, "básico", "Cria uma lâmina de mana na mão. Até o fim do combate, seus ataques corpo a corpo causam +1 de dano. Recriar a lâmina não gasta mana de novo."),
      sp("Chuva de Lâminas", 2, "médio", "Lança lâminas em até 3 inimigos próximos: d20 + Destreza contra cada um, dano 1d4 em quem for atingido."),
      sp("Dança das Mil Lâminas", 4, "ultimate", "d20 + Destreza contra todos os inimigos próximos, dano 2d6 em quem for atingido. Se acertar 3 ou mais, você ganha +2 de Defesa até o fim da próxima rodada.")
    ], futuras: [], nota: "Um grimório de dano direto, sem controle nem proteção. Frágil de perto: depende de acertar primeiro." },

  { nome: "Grimório de Água", attr: "inteligencia", papel: "Suporte", sub: "controle e suporte", tier: "",
    spells: [
      sp("Jato D’água", 1, "básico", "d20 + Inteligência, dano 1d6 e empurra o alvo 1 casa."),
      sp("Maré Protetora", 2, "médio", "Um aliado ganha 1d6 de vida temporária e remove um estado negativo. Se o aliado já estiver Molhado, ganha +1d4 de vida temporária. Depois, ele fica Molhado.", { aplica: ["Molhado"] }),
      sp("Dilúvio", 4, "ultimate", "Todos os inimigos próximos fazem teste de Poder contra 13. Quem falhar sofre 1d4, é arrastado 3 casas e cai (-2 de Defesa até o fim da próxima rodada).")
    ], futuras: [], nota: "Prepara o Molhado para os outros: Raios (o choque se espalha), Gelo (congela com mais facilidade) e Planta (Semente Vital cura +1). Tem cura leve e remoção de estados, mas pouco dano. Atenção: a Bolha é controle sem teste de acerto (só o teste de respiração depois), então use com moderação em chefes." },

  { nome: "Grimório de Raios", attr: "destreza", papel: "Dano", sub: "dano e velocidade", tier: "",
    spells: [
      sp("Choque", 1, "básico", "d20 + Destreza, dano 1d6. O alvo fica Eletrizado. Se já estava Eletrizado, faz um teste de Poder contra 13; se falhar, fica Atordoado por 1 turno."),
      sp("Relâmpago Veloz", 2, "médio", "Age duas vezes neste turno. O segundo feitiço custa +1 de mana.", { limite: "1 uso por combate" }),
      sp("Passo Relâmpago", 2, "médio", "Teleporta até 4 casas em linha reta. O primeiro inimigo no caminho sofre 1d6 e fica Eletrizado.", { aplica: ["Eletrizado"] }),
      sp("Tempestade Trovejante", 4, "ultimate", "d20 + Destreza contra até 3 inimigos, dano 1d10 em quem for atingido. Quem já estava Eletrizado faz um teste de Poder contra 13; se falhar, fica Atordoado por 1 turno.")
    ],
    futuras: [
      fu(2, "Corrente Elétrica", 2, "médio", "d20 + Destreza, dano 1d8. O raio salta para outro inimigo próximo, que sofre metade do dano. Cada alvo Eletrizado faz um teste de Poder contra 13; se algum ficar Atordoado, você ganha 1 de mana temporário (até o fim do combate).", { aplica: ["Eletrizado"] }),
      fu(3, "Reflexo Elétrico", "reação", "reação", "Quando um inimigo te atacar corpo a corpo, ele faz um teste de Destreza contra 13. Se falhar, sofre 1d4 e fica Eletrizado.", { aplica: ["Eletrizado"] })
    ],
    nota: "Regra do Eletrizado: um alvo Eletrizado que sofrer dano de raio faz um teste de Poder contra 13; se falhar, fica Atordoado por 1 turno. O atordoamento dura só 1 turno para não virar controle sem teste." },

  { nome: "Grimório de Terra", attr: "inteligencia", papel: "Suporte", sub: "defesa e controle", tier: "",
    spells: [
      sp("Estaca de Pedra", 1, "básico", "d20 + Inteligência, dano 1d6."),
      sp("Muro de Terra", 2, "médio", "Cria uma barreira que bloqueia a passagem por 2 turnos (Vida 10)."),
      sp("Terremoto", 4, "ultimate", "Os inimigos próximos sofrem 1d6. Quem falhar em um teste de Destreza contra 12 fica caído: deslocamento 0 e -2 de Defesa até o fim da próxima rodada.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Ilusão", attr: "inteligencia", papel: "Suporte", sub: "furtividade e engano", tier: "",
    spells: [
      sp("Lâmina Ilusória", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Miragem", 1, "básico", "Cria uma cópia falsa. O primeiro ataque do inimigo vai nela."),
      sp("Voz Enganosa", 2, "médio", "Um inimigo faz teste de Inteligência contra 13. Se falhar, ataca outro inimigo ou perde o turno."),
      sp("Mundo Falso", 4, "ultimate", "Todos os inimigos próximos erram automaticamente o próximo ataque.", { limite: "1 uso por combate" })
    ], futuras: [], nota: "Mundo Falso é forte demais, por isso já vale 1 uso por combate. Se ainda assim pesar, faça só até 2 inimigos errarem." },

  { nome: "Grimório Antimagia", attr: "poder", papel: "Suporte", sub: "lendário", tier: "lendário", reservado: true,
    spells: [
      sp("Corte Nulo", 1, "básico", "d20 + Poder, dano 1d6. Cancela um efeito mágico ativo no alvo."),
      sp("Barreira Anulante", 2, "médio", "O próximo feitiço inimigo contra você ou um aliado é cancelado."),
      sp("Espada do Demônio", 4, "ultimate", "Por 3 turnos, seus ataques ignoram a Defesa mágica e causam +1d8 de dano.")
    ], futuras: [], nota: "Estilo Asta. Sugestão: só 1 card no baralho, ou nenhum, reservado para um momento da história. Também serve para quebrar a marca." },

  { nome: "Grimório de Veneno", attr: "destreza", papel: "Dano", sub: "dano contínuo", tier: "",
    spells: [
      sp("Dardo Tóxico", 1, "básico", "d20 + Destreza, dano 1d4 e o alvo fica envenenado (1 de dano por turno, 2 turnos)."),
      sp("Névoa Verde", 2, "médio", "Nuvem em área por 2 turnos. Quem estiver dentro sofre 1 de dano por turno e -1 nas rolagens."),
      sp("Antídoto Reverso", 4, "ultimate", "Todos os inimigos envenenados sofrem 2d6 de uma vez e o veneno é renovado.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Gravidade", attr: "inteligencia", papel: "Suporte", sub: "controle", tier: "",
    spells: [
      sp("Esmagar", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Peso Morto", 1, "básico", "Teste de Inteligência contra a Defesa do alvo. Se acertar, ele perde 2 de deslocamento e -1 na Defesa."),
      sp("Inversão", 2, "médio", "Um alvo é jogado para cima e cai, sofrendo 1d8. Teste de Destreza contra 13 para sofrer metade."),
      sp("Singularidade", 4, "ultimate", "Puxa todos os inimigos próximos para um ponto, causa 1d6 e eles perdem a próxima ação.")
    ], futuras: [], nota: "" },

  { nome: "Grimório do Tempo", attr: "inteligencia", papel: "Suporte", sub: "suporte e controle", tier: "",
    spells: [
      sp("Pulso Temporal", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Pausa", 1, "básico", "Um aliado ou inimigo faz seu próximo teste com vantagem ou desvantagem (rola 2 dados, fica com o melhor ou pior)."),
      sp("Retrocesso", 2, "médio", "Um aliado refaz a última rolagem dele."),
      sp("Parada no Tempo", 4, "ultimate", "Um inimigo escolhido perde a próxima rodada inteira.", { limite: "1 uso por combate" })
    ], futuras: [], nota: "Parada no Tempo vale 1 uso por combate. Retrocesso refaz o teste de um tank que falhou no Absorver, ou o Refletir do Espelho." },

  { nome: "Grimório de Espíritos", attr: "inteligencia", papel: "Suporte", sub: "conjuração", tier: "",
    spells: [
      sp("Toque Espectral", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Servo Etéreo", 1, "básico", "Invoca um espírito (Vida 5, Defesa 10) que ataca com +2, dano 1d4 no fim do seu turno. Dura até ser derrotado. No máximo 2 espíritos ativos: um terceiro desfaz o mais antigo."),
      sp("Guardião Espiritual", 2, "médio", "O espírito se coloca ao lado de um aliado. Até o fim da próxima rodada, ele reduz em 1d4 todo dano sofrido, em até 2 golpes."),
      sp("Legião Fantasma", 4, "ultimate", "Invoca 3 espíritos reforçados (Vida 8, Defesa 10, ataque +3, dano 1d6) por 3 turnos, ignorando o limite de 2. Quando acaba, eles somem.")
    ],
    futuras: [
      fu(2, "Possessão Benigna", 3, "médio", "Um espírito entra em um aliado por 2 turnos: ele ganha +2 em todas as rolagens e +2 de dano. Você não pode invocar outro espírito nesse período."),
      fu(3, "Sacrifício Espiritual", 1, "reação", "Um espírito seu é desfeito. Escolha: um aliado próximo cura 1d6, ou os inimigos ao lado do espírito sofrem 1d6.")
    ],
    nota: "O limite de 2 espíritos mantém a mesa ágil; só a Legião Fantasma passa dele, e por pouco tempo. O Sacrifício Espiritual dá uso a espíritos que iam cair de qualquer jeito." },

  { nome: "Grimório de Sangue", attr: "poder", papel: "Dano", sub: "risco e recompensa", tier: "",
    spells: [
      sp("Corte Escarlate", "1 ou 3 de Vida", "básico", "d20 + Poder, dano 1d8. Pode pagar com 3 de Vida em vez de 1 de mana."),
      sp("Pacto Rubro", 2, "médio", "Perde 3 de Vida e recupera 2 de mana."),
      sp("Frenesi", 4, "ultimate", "Por 3 turnos, você recupera 2 de Vida por acerto e os alvos atingidos sangram (1 de dano por turno durante 2 turnos).", { aplica: ["Sangrando"], dot: dotRes("Poder", 12) })
    ], futuras: [], nota: "Arriscado: vida baixa é perigo. Cuidado com novatos." },

  { nome: "Grimório do Gelo", attr: "destreza", papel: "Dano", sub: "dano e lentidão", elem: "Gelo", tier: "",
    spells: [
      sp("Estaca de Gelo", 1, "ataque simples", "d20 + Destreza, dano 1d6."),
      sp("Geada", 1, "básico", "O chão sob um inimigo próximo congela. Ele faz teste de Destreza contra 12 ou perde 2 de deslocamento.", { aplica: ["Lento"] }),
      sp("Congelar", 2, "médio", "d20 + Destreza contra a Defesa do alvo, dano 1d4. Se acertar, o alvo fica congelado: deslocamento 0 e -2 de Defesa até o fim da próxima rodada. Um ataque de fogo contra ele quebra o gelo.", { aplica: ["Congelado"] }),
      sp("Nevasca", 4, "ultimate", "Os inimigos próximos sofrem 1d6 e ficam com -2 nas rolagens de ataque por 2 turnos.", { aplica: ["Lento"] })
    ], futuras: [], nota: "Combina com Água: um alvo molhado congela com mais facilidade (decisão do mestre)." },

  { nome: "Grimório da Luz Vingativa", attr: "poder", papel: "Dano", sub: "dano e retribuição", elem: "Luz", tier: "",
    spells: [
      sp("Lança Radiante", 1, "ataque simples", "d20 + Poder, dano 1d6."),
      sp("Marca da Retribuição", 1, "básico", "Marca um inimigo até o fim do combate (uma marca por vez). Na próxima vez que ele causar dano a um aliado, mesmo que a vida temporária absorva, ele sofre 1d6 de dano radiante (uma vez).", { aplica: ["Marcado"] }),
      sp("Julgamento", 2, "médio", "d20 + Poder, dano 1d8. Contra um inimigo que já feriu um aliado neste combate, o dano é 2d6."),
      sp("Sol da Sentença", 4, "ultimate", "Todos os inimigos próximos fazem teste de Poder contra 13. Quem falhar sofre 2d6; quem passar sofre metade. Cada aliado ferido neste combate recupera 1d4 de vida.")
    ], futuras: [], nota: "O oposto da Luz Curativa: em vez de curar, pune quem machuca o grupo." },

  { nome: "Grimório das Raízes", attr: "inteligencia", papel: "Suporte", sub: "cura e controle", elem: "Planta", tier: "",
    spells: [
      sp("Espinho", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Semente Vital", 1, "básico", "Um aliado recupera 2 de vida no início de cada turno dele, por 2 turnos. Se o aliado estiver Molhado, recupera +1 por turno."),
      sp("Raízes Prendedoras", 2, "médio", "Teste de Inteligência contra a Defesa do alvo. Se acertar, raízes prendem as pernas dele por 2 turnos: ele não pode se mover e sofre 1 de dano por turno. No início de cada turno dele, faz um teste de Poder contra 13 para se soltar.", { aplica: ["Preso"] }),
      sp("Floresta Viva", 4, "ultimate", "Por 3 turnos, uma floresta cobre a área: os aliados recuperam 1d4 de vida por turno e os inimigos dentro dela perdem 2 de deslocamento.")
    ],
    futuras: [
      fu(2, "Círculo de Espinhos", 2, "médio", "Cria um círculo de espinhos ao seu redor por 2 turnos: os inimigos que entrarem sofrem 1d6 e perdem 2 de deslocamento. Fogo queima o círculo."),
      fu(3, "Florescer", 3, "médio", "Cura 1d6 em até 2 aliados próximos e remove um estado negativo de cada um (Envenenado, Em chamas ou Lento).")
    ],
    nota: "Preso prende o movimento; só tira a ação se o feitiço disser o que foi preso. Fogo queima as raízes: um alvo Em chamas se solta das Raízes Prendedoras, e o Círculo de Espinhos some." },

  { nome: "Grimório do Som", attr: "inteligencia", papel: "Dano", sub: "dano e silêncio", elem: "Som", tier: "",
    spells: [
      sp("Estrondo", 1, "ataque simples", "d20 + Inteligência, dano 1d6."),
      sp("Eco", 1, "básico", "O seu próximo feitiço de dano causa +1d4 de dano."),
      sp("Silêncio", 2, "médio", "Teste de Inteligência contra a Defesa do alvo. Se acertar, ele não pode lançar feitiços por 1 turno.", { aplica: ["Silenciado"] }),
      sp("Sinfonia Destrutiva", 4, "ultimate", "Os inimigos próximos sofrem 2d6 e fazem teste de Inteligência contra 13. Quem falhar fica atordoado e perde a próxima ação.", { aplica: ["Atordoado"] })
    ], futuras: [], nota: "Bom contra os inimigos que usam magia, como o Lobo de Mana." },

  { nome: "Grimório da Ferrugem", attr: "inteligencia", papel: "Dano", sub: "corrosão", elem: "Metal", tier: "",
    spells: [
      sp("Corroer", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Oxidar", 1, "básico", "Teste de Inteligência contra a Defesa do alvo. Se acertar, a Defesa dele cai em 1 até o fim do combate (acumula até -3).", { aplica: ["Enferrujado"] }),
      sp("Carcomer", 2, "médio", "d20 + Inteligência contra a Defesa do alvo, dano 1d6. Se ele já estiver enferrujado, a Defesa dele cai em mais 1.", { aplica: ["Enferrujado"] }),
      sp("Desmoronar", 4, "ultimate", "d20 + Inteligência contra a Defesa do alvo, dano 3d6. Contra um alvo enferrujado, o dano é 4d6.")
    ], futuras: [], nota: "Excelente contra inimigos de armadura e contra quem usa Correntes ou Aço." },

  { nome: "Grimório da Sorte", attr: "inteligencia", papel: "Suporte", sub: "sorte e acaso", elem: "Acaso", tier: "",
    spells: [
      sp("Moeda Giratória", 1, "ataque simples", "d20 + Inteligência, dano 1d4. Role um d6 extra: com 6, o dano dobra."),
      sp("Dado do Destino", 1, "básico", "Role d6 e aplique em um alvo: 1 a 2, -1 no próximo teste dele; 3 a 4, nada acontece; 5 a 6, +1 no próximo teste dele."),
      sp("Aposta Alta", 2, "médio", "Role d6. Com 1 a 3, você perde 1 de mana. Com 4 a 6, o grupo ganha +2 em todas as rolagens até o fim da rodada."),
      sp("Jackpot", 4, "ultimate", "Role 2d6. Com 2 a 4, nada acontece e você perde 1 de mana. Com 5 a 9, os aliados recuperam 2 de mana. Com 10 a 12, os aliados recuperam 4 de mana e os inimigos próximos perdem a próxima ação.")
    ], futuras: [], nota: "Divertido e arriscado. Ótimo para quem gosta de torcer pelo dado." },

  { nome: "Grimório do Aço", attr: "poder", papel: "Tank", sub: "tank Muralha", elem: "Metal", tier: "",
    spells: [
      sp("Martelada", 1, "ataque simples", "d20 + Poder, dano 1d6. Se acertar, o alvo fica com -1 no próximo ataque dele."),
      sp("Ímã de Guerra", 2, "provocar", "Puxa até 2 inimigos próximos para perto de você. Até o início do seu próximo turno, eles precisam atacar você."),
      sp("Revidar", 1, "reação", "Quando um inimigo corpo a corpo acerta você, ele sofre 1d4 de dano de volta. Uma vez por rodada."),
      sp("Muralha de Aço", 4, "ultimate", "Por 3 turnos, +4 de redução de dano e deslocamento 0. Os inimigos que atacarem você sofrem 1d4.")
    ],
    futuras: [
      fu(1, "Corrente de Resgate", 2, "médio", "Puxa um aliado distante para perto de você e coloca você entre ele e o inimigo mais próximo."),
      fu(2, "Fundição", 2, "médio", "Remove um estado negativo (preso, congelado, enferrujado) de você ou de um aliado perto."),
      fu(3, "Colosso", 4, "ultimate", "Por 2 turnos, você vira um gigante de aço: +1d6 de dano nos seus ataques, +3 de redução de dano, e os aliados próximos ganham +1 de redução de dano.", { limite: "1 uso por combate" })
    ],
    nota: "Mais agressivo que a Fortaleza: pune quem ataca, em vez de absorver magia." },

  { nome: "Grimório da Névoa", attr: "destreza", papel: "Tank", sub: "tank Esquiva", elem: "Água", tier: "",
    spells: [
      sp("Gota Veloz", 1, "ataque simples", "d20 + Destreza, dano 1d6.", { aplica: ["Molhado"] }),
      sp("Silhueta de Névoa", 2, "provocar sutil", "Uma silhueta de névoa copia você. Até o início do seu próximo turno, os ataques inimigos contra qualquer alvo que não seja você têm -2."),
      sp("Desvanecer", 1, "reação", "Quando um inimigo erra um ataque contra você, você se move até 3 casas e ganha +1 de Defesa até o início do próximo turno."),
      sp("Maré de Névoa", 4, "ultimate", "Por 3 turnos, uma névoa cobre o campo: os aliados ganham +2 de Defesa e os inimigos têm -2 nas rolagens de ataque.")
    ],
    futuras: [
      fu(1, "Cortina de Névoa", 2, "médio", "Bloqueia a linha de visão entre o seu grupo e os inimigos por 2 turnos: ataques à distância contra o grupo têm -3."),
      fu(2, "Chuva Fina", 2, "médio", "Apaga o fogo sobre você e os aliados próximos e dá +1 de redução de dano a todos até o fim da rodada.", { aplica: ["Molhado"] }),
      fu(3, "Oceano Calmo", 4, "ultimate", "Os aliados recuperam 1d6 de vida e ganham +2 de Defesa por 2 turnos.", { limite: "1 uso por combate" })
    ],
    nota: "Evita golpes sem precisar parar de agir. Molhado combina com Raios (decisão do mestre)." },

  /* ===== Grimórios lendários de referência (base nos capitães e membros mais fortes dos esquadrões do anime). Reservados: o mestre entrega à mão, não entram no sorteio. ===== */
  { nome: "Grimório do Breu", attr: "poder", papel: "Dano", sub: "escuridão que consome magia", elem: "Escuridão", tier: "lendário", reservado: true,
    spells: [
      sp("Corte Escuro", 1, "ataque simples", "d20 + Poder, dano 1d8. O alvo perde 1 de mana, se tiver."),
      sp("Manto de Breu", 2, "médio", "Por 2 turnos, seus ataques causam +1d4 de dano e ignoram 1 de redução de dano."),
      sp("Fenda Dimensional", 3, "médio", "d20 + Poder, dano 2d8 em uma linha de 6 casas. O corte atravessa barreiras e as destrói."),
      sp("Noite Sem Fim", 5, "ultimate", "Os inimigos próximos sofrem 3d6. Por 2 turnos, o campo fica em breu: os feitiços dos inimigos custam +1 de mana e os seus ataques causam +1d6.")
    ], futuras: [],
    nota: "Base: Yami Sukehiro, capitão do Black Bull (magia da escuridão). Referência: o capitão que luta com escuridão e corta magia. Não anula feitiço como a Antimagia: consome mana e quebra barreira." },

  { nome: "Grimório da Árvore-Mundo", attr: "inteligencia", papel: "Suporte", sub: "floresta ancestral que protege e prende", elem: "Floresta", tier: "lendário", reservado: true,
    spells: [
      sp("Broto Guardião", 1, "ataque simples", "d20 + Inteligência, dano 1d6. Um broto prende o alvo: -2 de deslocamento."),
      sp("Muralha de Raízes", 2, "médio", "Uma barreira de raízes bloqueia a passagem por 3 turnos (Vida 15)."),
      sp("Copa Protetora", 3, "médio", "Por 2 turnos, os aliados próximos ganham +2 de Defesa e 1d6 de vida temporária."),
      sp("Árvore-Mundo", 5, "ultimate", "Por 3 turnos, uma árvore gigante cobre o campo: os aliados recuperam 1d6 de vida por turno e ganham +2 de Defesa. Os inimigos próximos ficam presos por raízes por 1 turno (teste de Poder contra 15).")
    ], futuras: [],
    nota: "Base: William Vangeance, capitão do Golden Dawn (magia da Árvore-Mundo). Efeito contínuo e poderoso: exige muito controle, por isso é de Inteligência." },

  { nome: "Grimório do Espírito Celeste", attr: "destreza", papel: "Dano", sub: "espírito do vento em pacto", elem: "Espírito do Vento", tier: "lendário", reservado: true,
    spells: [
      sp("Lâmina Celeste", 1, "ataque simples", "d20 + Destreza, dano 1d8, alcance longo."),
      sp("Passo do Espírito", 2, "médio", "Por 2 turnos, +2 de Defesa e +2 de deslocamento."),
      sp("Tornado de Quatro Folhas", 3, "médio", "d20 + Destreza contra cada inimigo próximo, dano 2d6 em quem for atingido. Os atingidos são empurrados 2 casas."),
      sp("Armadura do Espírito", 5, "ultimate", "Por 3 turnos, você voa, ganha +2 nas rolagens de ataque e +1d8 de dano em todos os ataques.")
    ], futuras: [],
    nota: "Base: Yuno, do Golden Dawn (espírito do vento). O mais forte da Alvorada: um pacto com um espírito do vento. Mais ofensivo que o Grimório de Vento." },

  { nome: "Grimório do Fogo Régio", attr: "poder", papel: "Dano", sub: "chama nobre e armadura de brasas", elem: "Fogo Régio", tier: "lendário", reservado: true,
    spells: [
      sp("Chama Régia", 1, "ataque simples", "d20 + Poder, dano 1d8. O alvo fica em chamas.", { aplica: ["Em chamas"] }),
      sp("Armadura de Brasas", 2, "médio", "Por 2 turnos, +2 de redução de dano. Quem acerta você corpo a corpo sofre 1d4 de fogo."),
      sp("Lança de Fogo Real", 3, "médio", "d20 + Poder, dano 2d8 em todos os inimigos em uma linha de até 6 casas.", { aplica: ["Em chamas"] }),
      sp("Coroa Solar", 5, "ultimate", "Os inimigos próximos sofrem 3d8 e ficam em chamas.", { aplica: ["Em chamas"] })
    ], futuras: [],
    nota: "Base: Fuegoleon Vermillion, capitão do Crimson Lion (magia de fogo). A versão nobre do Grimório de Chamas: mais defesa e mais área." },

  { nome: "Grimório da Ira do Leão", attr: "poder", papel: "Dano", sub: "mana no corpo, sem feitiço de longe", elem: "Fúria", tier: "lendário", reservado: true,
    spells: [
      sp("Garras de Mana", 1, "ataque simples", "d20 + Poder, dano 1d8, corpo a corpo."),
      sp("Corpo Transbordante", 2, "médio", "Por 2 turnos, +1d6 de dano nos ataques corpo a corpo e +2 de redução de dano."),
      sp("Salto do Leão", 3, "médio", "Salta até 8 casas e cai sobre um inimigo: d20 + Poder, dano 2d8. Os inimigos ao lado sofrem 1d6."),
      sp("Fúria Absoluta", 5, "ultimate", "Por 3 turnos, +2d4 de dano e você não pode ser derrubado, empurrado nem controlado.")
    ], futuras: [],
    nota: "Base: Mereoleona Vermillion, do Crimson Lion (fogo e mana no corpo). Quase sem magia à distância: usa a mana no próprio corpo. Imbatível de perto." },

  { nome: "Grimório dos Espinhos", attr: "destreza", papel: "Dano", sub: "espinhos que ferem e prendem", elem: "Espinhos", tier: "lendário", reservado: true,
    spells: [
      sp("Espinho", 1, "ataque simples", "d20 + Destreza, dano 1d6. O alvo sangra (1 de dano no próximo turno dele)."),
      sp("Chicote de Espinhos", 2, "médio", "d20 + Destreza, dano 1d6. Se acertar, o alvo fica preso por 1 turno.", { aplica: ["Preso"] }),
      sp("Jardim de Espinhos", 3, "médio", "Uma área de 3 × 3 casas fica coberta de espinhos por 2 turnos: quem entrar ou começar ali o turno sofre 1d6 e perde 2 de deslocamento."),
      sp("Coroa de Rosas", 5, "ultimate", "d20 + Destreza contra cada inimigo próximo, dano 2d8 em quem for atingido. Quem for atingido fica preso por 1 turno.", { aplica: ["Preso"] })
    ], futuras: [],
    nota: "Base: Charlotte Roselei, capitã do Blue Rose (magia de espinhos). Controle de área e dano ao longo do tempo." },

  { nome: "Grimório do Corte Irrestrito", attr: "destreza", papel: "Dano", sub: "cortes que não respeitam defesa", elem: "Corte", tier: "lendário", reservado: true,
    spells: [
      sp("Corte Fino", 1, "ataque simples", "d20 + Destreza, dano 1d8."),
      sp("Dança do Louva-a-Deus", 2, "médio", "d20 + Destreza contra até 2 inimigos, dano 1d8 em cada um."),
      sp("Corte Sem Defesa", 3, "médio", "d20 + Destreza contra metade da Defesa do alvo (arredondada para baixo), dano 2d8."),
      sp("Mil Cortes", 5, "ultimate", "d20 + Destreza contra todos os inimigos próximos, dano 2d8 em quem for atingido, mais 1 de dano por inimigo atingido.")
    ], futuras: [],
    nota: "Base: Jack the Ripper, capitão do Green Mantis (magia de corte). Só ataque: nenhuma defesa, nenhum suporte. Frágil se for pego." },

  { nome: "Grimório dos Sonhos", attr: "inteligencia", papel: "Suporte", sub: "sono, pesadelo e mundo onírico", elem: "Sonho", tier: "lendário", reservado: true,
    spells: [
      sp("Cochilo", 1, "ataque simples", "d20 + Inteligência, dano 1d6 psíquico. O alvo perde 3 de deslocamento."),
      sp("Pesadelo", 2, "médio", "Um inimigo faz teste de Inteligência contra 14. Se falhar, ataca um aliado dele ou perde o turno."),
      sp("Refúgio Onírico", 3, "médio", "Um aliado some para o mundo dos sonhos até o início do seu próximo turno: nenhum ataque o alcança. Ao voltar, recupera 1d6 de vida."),
      sp("Sono Profundo", 5, "ultimate", "Os inimigos próximos fazem teste de Inteligência contra 14. Quem falhar dorme por 1 turno (acorda se sofrer dano).")
    ], futuras: [],
    nota: "Base: Dorothy Unsworth, capitã do Coral Peacock (magia dos sonhos). Controle poderoso, mas nenhum dano alto. Tem 'resistência por sonho' contra o seu próprio feitiço de sono." },

  { nome: "Grimório do Redemoinho", attr: "poder", papel: "Tank", sub: "vórtice que protege e puxa", elem: "Vórtice", tier: "lendário", reservado: true,
    spells: [
      sp("Giro Defensivo", 1, "ataque simples", "d20 + Poder, dano 1d6. Empurra o alvo 1 casa."),
      sp("Escudo de Vórtice", 2, "provocar", "Até o início do seu próximo turno, os inimigos próximos precisam atacar você, e ataques à distância contra você são desviados (-3)."),
      sp("Vórtice Devorador", 3, "médio", "Puxa todos os inimigos próximos para junto de você. Eles sofrem 1d6 e perdem 2 de deslocamento."),
      sp("Muralha de Vórtice", 5, "ultimate", "Por 3 turnos, feitiços e ataques à distância contra você ou contra aliados próximos são desviados, e você ganha +4 de redução de dano.")
    ], futuras: [],
    nota: "Base: Kaiser Granvorka, capitão do Purple Orca (magia de vórtice). O 'escudo definitivo': a melhor proteção contra ataques à distância e magia de projétil." },

  { nome: "Grimório da Pintura", attr: "inteligencia", papel: "Suporte", sub: "cria o que desenha", elem: "Pintura", tier: "lendário", reservado: true,
    spells: [
      sp("Traço Rápido", 1, "ataque simples", "d20 + Inteligência, dano 1d6."),
      sp("Tela Viva", 2, "médio", "Desenha uma barreira ou um objeto simples que dura 3 turnos (Vida 8)."),
      sp("Cópia Pintada", 3, "médio", "Cria uma cópia desenhada de um aliado ou de você: Vida 8, Defesa 12, ataca com +3 e dano 1d6. Dura até ser derrotada."),
      sp("Galeria de Obras", 5, "ultimate", "Por 3 turnos, você mantém até 3 criações ao mesmo tempo (barreiras ou cópias), e cada uma age no seu turno.")
    ], futuras: [],
    nota: "Base: Rill Boismortier, capitão do Aqua Deer (magia da pintura). Muita coisa para controlar ao mesmo tempo: depende de Inteligência alta." },

  { nome: "Grimório do Mercúrio", attr: "poder", papel: "Dano", sub: "metal líquido que corta e protege", elem: "Metal líquido", tier: "lendário", reservado: true,
    spells: [
      sp("Gota de Mercúrio", 1, "ataque simples", "d20 + Poder, dano 1d8."),
      sp("Lâmina Líquida", 2, "médio", "d20 + Poder, dano 1d8. O golpe ignora a redução de dano do alvo."),
      sp("Escudo de Mercúrio", 3, "médio", "Cria um escudo (Vida 12) por 2 turnos. O primeiro feitiço ou ataque à distância que o atingir é refletido ao atacante."),
      sp("Rei Prateado", 5, "ultimate", "d20 + Poder contra todos os inimigos em uma linha de 8 casas, dano 2d10 em quem for atingido. Quem for atingido perde 2 de deslocamento.")
    ], futuras: [],
    nota: "Base: Nozel Silva, capitão do Silver Eagle (magia de mercúrio). Equilibra ataque e defesa. A elite da nobreza usa." }
];

var ELEM_EXISTENTES = {
  "Grimório da Fortaleza": "Terra", "Grimório do Espelho": "Reflexo", "Grimório de Chamas": "Fogo", "Grimório de Luz Curativa": "Luz",
  "Grimório de Sombras": "Sombra", "Grimório de Vento": "Vento", "Grimório de Correntes": "Metal", "Grimório de Reforço": "Corpo",
  "Grimório de Água": "Água", "Grimório de Raios": "Raio", "Grimório de Terra": "Terra", "Grimório de Ilusão": "Mente",
  "Grimório Antimagia": "Antimagia", "Grimório de Veneno": "Veneno", "Grimório de Gravidade": "Cosmos", "Grimório do Tempo": "Cosmos",
  "Grimório de Espíritos": "Espírito", "Grimório de Sangue": "Sangue", "Grimório de Lâminas": "Lâmina"
};
var EXTRAS_EXISTENTES = {
  "Dardo Tóxico": { aplica: ["Envenenado"], dot: dotRes("Poder", 12) },
  "Névoa Verde": { aplica: ["Envenenado"], dot: dotSem() },
  "Antídoto Reverso": { aplica: ["Envenenado"], dot: dotRes("Poder", 12) },
  "Jato D’água": { aplica: ["Molhado"] },
  "Dilúvio": { aplica: ["Molhado"] },
  "Choque": { aplica: ["Eletrizado"] },
  "Tempestade Trovejante": { aplica: ["Eletrizado"] },
  "Laço": { aplica: ["Lento"] },
  "Peso Morto": { aplica: ["Lento"] },
  "Prisão de Aço": { aplica: ["Preso"] },
  "Jaula Total": { aplica: ["Preso"] },
  "Eclipse": { aplica: ["Cego"] },
  "Muralha de Fogo": { aplica: ["Em chamas"] }
};
var NIVEL3 = {
  "Grimório de Chamas": fu(2, "Lança Incandescente", 3, "médio", "d20 + Poder, dano 2d6 em todos os inimigos em uma linha de até 4 casas.", { aplica: ["Em chamas"] }),
  "Grimório de Sombras": fu(2, "Fundir-se", 2, "médio", "Você entra na sombra de uma criatura e sai de outra sombra a até 6 casas, invisível até atacar."),
  "Grimório de Correntes": fu(2, "Elo de Aço", 2, "médio", "Liga você a um aliado por 2 turnos: o dano que ele sofrer é dividido entre vocês dois."),
  "Grimório de Reforço": fu(2, "Salto Demolidor", 3, "médio", "Salta até 6 casas e cai sobre um inimigo: d20 + Poder, dano 2d6. Os inimigos ao lado do alvo sofrem 1d6."),
  "Grimório de Água": fu(2, "Bolha", 2, "médio", "Prende um alvo numa bolha por 1 turno. Um aliado dentro não age, faz os testes de defesa com vantagem e recupera 1d4 de vida. Um inimigo dentro não age, fica Molhado e, no início do turno dele, faz um teste de Poder contra 13 para prender a respiração; se falhar, sofre 1d4 de dano.", { aplica: ["Molhado"] }),
  "Grimório de Terra": fu(2, "Armadilha de Pedra", 2, "médio", "Esconde uma armadilha em uma casa. O primeiro inimigo que pisar nela sofre 2d6 e fica preso por 1 turno.", { aplica: ["Preso"] }),
  "Grimório de Ilusão": fu(2, "Pânico", 2, "médio", "Um inimigo faz teste de Inteligência contra 13. Se falhar, ele se afasta o máximo que puder dos jogadores até o fim do próximo turno dele."),
  "Grimório Antimagia": fu(2, "Zona Nula", 3, "médio", "Cria uma área por 2 turnos onde nenhum feitiço pode ser lançado e os estados mágicos são removidos de quem estiver dentro."),
  "Grimório de Veneno": fu(2, "Veneno Paralisante", 2, "médio", "d20 + Destreza, dano 1d4. Se acertar, o alvo faz teste de Poder contra 13 ou fica com deslocamento 0 por 1 turno.", { aplica: ["Lento"] }),
  "Grimório de Gravidade": fu(2, "Leveza Forçada", 2, "médio", "Teste de Inteligência contra a Defesa do alvo. Se acertar, o inimigo flutua por 1 turno, com deslocamento 0 e -3 de Defesa."),
  "Grimório do Tempo": fu(2, "Eco do Tempo", 2, "médio", "Um aliado repete o último feitiço de 1 mana que usou, sem gastar mana."),
  "Grimório de Lâminas": fu(2, "Corte Perfurante", 2, "médio", "d20 + Destreza, dano 1d8. O golpe ignora a redução de dano do alvo."),
  "Grimório de Sangue": fu(2, "Lâmina de Sangue", 2, "médio", "d20 + Poder, dano 2d6. Você pode pagar 3 de Vida para causar +1d6."),
  "Grimório do Gelo": fu(2, "Lança Gélida", 3, "médio", "d20 + Destreza, dano 2d6. Se o alvo estiver lento ou molhado, ele fica congelado por 1 turno.", { aplica: ["Congelado"] }),
  "Grimório da Luz Vingativa": fu(2, "Escudo Penitente", 2, "médio", "Um aliado ganha +2 de Defesa até o fim da próxima rodada. Quem o atacar sofre 1d4 de dano radiante."),
  "Grimório do Som": fu(2, "Onda Sonora", 2, "médio", "Os inimigos em um cone de 3 casas sofrem 1d6 e são empurrados 1 casa."),
  "Grimório da Ferrugem": fu(2, "Podridão de Metal", 2, "médio", "Um inimigo perde a redução de dano e fica com -2 de Defesa por 2 turnos.", { aplica: ["Enferrujado"] }),
  "Grimório da Sorte": fu(2, "Moeda ao Ar", 2, "médio", "Jogue uma moeda. Cara: o seu próximo feitiço custa 1 de mana a menos. Coroa: custa 1 a mais.")
};
GRIMORIOS.forEach(function (g) {
  if (!g.elem) g.elem = ELEM_EXISTENTES[g.nome] || "Outro";
  if (NIVEL3[g.nome]) g.futuras = (g.futuras || []).concat([NIVEL3[g.nome]]);
  g.spells.concat(g.futuras || []).forEach(function (s) { extras(s, EXTRAS_EXISTENTES[s.nome]); });
});
var ELEMS = [];
GRIMORIOS.forEach(function (g) { if (ELEMS.indexOf(g.elem) === -1) ELEMS.push(g.elem); });
ELEMS.sort(function (a, b) { return a.localeCompare(b, "pt"); });

/* Famílias para o FILTRO da aba Grimórios: 5 elementos e alguns outros tipos, em vez dos 30 elementos detalhados. O elemento detalhado (g.elem) continua
   no card e é ele que o sorteio usa para não repetir elemento entre os jogadores. */
var FAMILIAS_ELEM = ["Fogo", "Água", "Planta", "Terra", "Ar"];
var FAMILIAS_TIPO = ["Luz", "Sombra e mente", "Corpo e metal", "Tempo e espaço", "Outros"];
var FAMILIA = {
  "Grimório de Chamas": "Fogo", "Grimório do Fogo Régio": "Fogo",
  "Grimório de Água": "Água", "Grimório da Névoa": "Água", "Grimório do Gelo": "Água",
  "Grimório das Raízes": "Planta", "Grimório da Árvore-Mundo": "Planta", "Grimório dos Espinhos": "Planta", "Grimório de Veneno": "Planta",
  "Grimório de Terra": "Terra", "Grimório da Fortaleza": "Terra",
  "Grimório de Vento": "Ar", "Grimório do Espírito Celeste": "Ar", "Grimório de Raios": "Ar", "Grimório do Redemoinho": "Ar", "Grimório do Som": "Ar",
  "Grimório de Luz Curativa": "Luz", "Grimório da Luz Vingativa": "Luz",
  "Grimório de Sombras": "Sombra e mente", "Grimório do Breu": "Sombra e mente", "Grimório de Ilusão": "Sombra e mente", "Grimório dos Sonhos": "Sombra e mente",
  "Grimório de Reforço": "Corpo e metal", "Grimório de Sangue": "Corpo e metal", "Grimório da Ira do Leão": "Corpo e metal", "Grimório do Aço": "Corpo e metal",
  "Grimório de Correntes": "Corpo e metal", "Grimório da Ferrugem": "Corpo e metal", "Grimório de Lâminas": "Corpo e metal", "Grimório do Corte Irrestrito": "Corpo e metal",
  "Grimório do Mercúrio": "Corpo e metal", "Grimório do Espelho": "Corpo e metal",
  "Grimório do Tempo": "Tempo e espaço", "Grimório de Gravidade": "Tempo e espaço"
};
GRIMORIOS.forEach(function (g) { g.fam = FAMILIA[g.nome] || "Outros"; });

var FASES = ["Sessão 1", "Arco 1: Vale das Colheitas", "Arco 1: Porto Salgado", "Arco 1: Floresta dos Cedros", "Arco 1: Pedra Velha", "Arco 2", "Arco final"];
function mo(nome, fase, tipo, nivel, vida, def, atq, dano, mana, habs, comp, dica, e) {
  return extras({ nome: nome, fase: fase, tipo: tipo, nivel: nivel, vida: vida, defesa: def, ataque: atq, dano: dano, mana: mana, habs: habs || [], comp: comp || "", dica: dica || "" }, e);
}
var INIMIGOS = [
  /* Sessão 1 */
  mo("Bandido do Reino", "Sessão 1", "capanga", "1", 10, 10, "+2", "1d6 + 1 (média 4,5)", "-", [],
    "Ataca o jogador mais próximo. Foge se ficar com 3 de vida ou menos.",
    "Com 8 jogadores, use de 6 a 8 bandidos."),
  mo("Capitão Bandido", "Sessão 1", "normal", "1", 18, 12, "+3", "1d8 + 1 (média 5,5)", "-", [
    sp("Grito de Comando", "passiva", "passiva", "No primeiro turno dele, os bandidos próximos ganham +1 nas rolagens de ataque até o próximo turno do capitão.")
  ], "Fica atrás dos capangas. Se ficar sozinho, foge.",
    "Bom para liderar o encontro dos bandidos."),
  mo("Corvo de Mana", "Sessão 1", "capanga", "1", 6, 12, "+2", "1d4 + 1 (média 3,5)", "-", [
    sp("Bicada Distraída", "passiva", "passiva", "Se acertar, o alvo fica com -1 no próximo ataque dele.")
  ], "Voa e ataca quem está mais longe dos aliados.",
    "Bom para encher o campo e testar a mira dos jogadores."),
  mo("Lobo de Mana", "Sessão 1", "normal", "1", 16, 13, "+3", "1d8 + 1 (média 5,5)", "6", [
    sp("Uivo Sombrio", 2, "habilidade", "Todos os jogadores fazem teste de Inteligência contra 12. Quem falhar fica atordoado e perde a próxima ação.", { aplica: ["Atordoado"] })
  ], "Usa o uivo no primeiro turno e depois ataca quem tem menos vida.",
    "Com 8 jogadores, use dois lobos, ou um lobo com 32 de vida."),

  /* Arco 1: Vale das Colheitas */
  mo("Espantalho de Mana", "Arco 1: Vale das Colheitas", "normal", "2", 22, 11, "+3", "1d8 + 1 (média 5,5)", "4", [
    sp("Olhar Vazio", 2, "habilidade", "Um jogador faz teste de Inteligência contra 12 ou perde o turno de medo."),
    sp("Palha Seca", "passiva", "passiva", "Fraco a fogo: o dano de fogo contra ele causa +1d4 e o deixa em chamas (2 de dano por turno, 2 turnos). Quem estiver ao lado dele também sofre 1d4.")
  ], "Fica parado até alguém se aproximar da plantação. Depois ataca o mais próximo.",
    "Bom para ensinar o estado em chamas e as combinações de magias."),
  mo("Javali de Mana", "Arco 1: Vale das Colheitas", "normal", "2", 26, 12, "+4", "1d10 + 1 (média 6,5)", "-", [
    sp("Investida", "passiva", "passiva", "Se andar 3 ou mais casas antes de atacar, causa +1d6 de dano e o alvo faz teste de Poder contra 12 ou cai.")
  ], "Sempre se afasta antes de investir. Dá para provocar com um tank.",
    "Um tank com Chamado da Fortaleza ou Ímã de Guerra brilha aqui."),
  mo("Devorador de Colheitas", "Arco 1: Vale das Colheitas", "chefe", "2 a 3", 60, 13, "+5", "2d6 + 2 (média 9)", "8", [
    sp("Mordida Voraz", "passiva", "passiva", "Recupera metade do dano que causar."),
    sp("Rugido Faminto", 2, "habilidade", "Todos os jogadores próximos fazem teste de Poder contra 13 ou ficam com -2 nas rolagens por 1 turno."),
    sp("Cavar", 2, "habilidade", "Some no chão e volta no próximo turno em outro lugar, atacando de surpresa com +1d6 de dano.")
  ], "Cava para escapar de quem o cerca. Com metade da vida, solta o rugido sempre que puder.",
    "Prender ou provocar impede que ele fuja cavando."),

  /* Arco 1: Porto Salgado */
  mo("Marujo Afogado", "Arco 1: Porto Salgado", "capanga", "2", 12, 10, "+3", "1d6 + 1 (média 4,5)", "-", [
    sp("Corpo Encharcado", "passiva", "passiva", "Está molhado: é atingido com mais facilidade por choque (decisão do mestre).", { aplica: ["Molhado"] }),
    sp("Arrastar", "passiva", "passiva", "Se acertar, o alvo faz teste de Poder contra 11 ou perde 2 de deslocamento.", { aplica: ["Lento"] })
  ], "Avança devagar, em grupo, sem recuar.",
    "Com 8 jogadores, use de 6 a 8 marujos. Ótimo para testar Raios contra inimigos molhados."),
  mo("Caranguejo Blindado", "Arco 1: Porto Salgado", "normal", "2", 24, 15, "+3", "1d8 (média 4,5)", "-", [
    sp("Pinça Prendedora", "passiva", "passiva", "Se acertar, o alvo fica preso até passar em um teste de Poder contra 12 (um teste por turno).", { aplica: ["Preso"] })
  ], "Defende e agarra quem estiver sozinho.",
    "A Defesa alta e a redução de dano pedem Poder alto ou feitiços sem rolagem de ataque.", { red: 2 }),
  mo("Polvo da Maré", "Arco 1: Porto Salgado", "elite", "2 a 3", 36, 13, "+4", "1d8 + 1 (média 5,5)", "6", [
    sp("Tentáculos", "passiva", "passiva", "Ataca duas vezes por turno, em alvos diferentes."),
    sp("Tinta Negra", 2, "habilidade", "Os alvos na área fazem teste de Destreza contra 12 ou ficam cegos (-3 nas rolagens de ataque) até o fim da próxima rodada.", { aplica: ["Cego"] })
  ], "Prefere ficar na água e puxar alvos para perto.",
    "Bom para a primeira luta contra um elite."),
  mo("Serpente das Marés", "Arco 1: Porto Salgado", "chefe", "3", 65, 14, "+5", "2d6 + 2 (média 9)", "10", [
    sp("Enrolar", 2, "habilidade", "d20 + 5 contra um alvo. Se acertar, o alvo fica preso por 2 turnos e sofre 1d6 por turno.", { aplica: ["Preso"], dot: dotRes("Poder", 13) }),
    sp("Onda", 4, "habilidade", "Todos os jogadores próximos fazem teste de Poder contra 13 ou são arrastados 3 casas e ficam molhados.", { aplica: ["Molhado"] })
  ], "Começa escondida na água. Usa Enrolar no jogador mais frágil.",
    "Quem tiver Antimagia ou Correntes pode libertar o aliado preso."),

  /* Arco 1: Floresta dos Cedros */
  mo("Aranha Tecelã", "Arco 1: Floresta dos Cedros", "normal", "3", 22, 13, "+4", "1d6 + 2 (média 5,5)", "4", [
    sp("Veneno", "passiva", "passiva", "Se acertar, o alvo fica envenenado (1 de dano por turno, 2 turnos).", { aplica: ["Envenenado"], dot: dotRes("Poder", 12) }),
    sp("Teia", 2, "habilidade", "Um alvo faz teste de Destreza contra 13 ou fica preso por 1 turno.", { aplica: ["Preso"] })
  ], "Prende primeiro, ataca depois.",
    "Bom para treinar o lembrete de dano contínuo."),
  mo("Raposa Sombria", "Arco 1: Floresta dos Cedros", "normal", "2 a 3", 18, 14, "+4", "1d6 + 2 (média 5,5)", "2", [
    sp("Passo Sombrio", 1, "habilidade", "Fica invisível até atacar. O primeiro ataque dela depois de invisível causa o dobro de dano.")
  ], "Ataca o jogador com a menor Defesa.",
    "Boa para pressionar o Suporte do grupo."),
  mo("Árvore Desperta", "Arco 1: Floresta dos Cedros", "elite", "3", 40, 12, "+4", "1d10 + 2 (média 7,5)", "4", [
    sp("Raízes", 2, "habilidade", "Um alvo faz teste de Destreza contra 13 ou fica preso por 1 turno.", { aplica: ["Preso"] }),
    sp("Regenerar", "passiva", "passiva", "Recupera 3 de vida no início de cada turno dela, a não ser que tenha sofrido dano de fogo desde o turno anterior.")
  ], "Fica imóvel. Só ataca quem está perto.",
    "Um combate de posição: quem tem fogo vira a estrela."),
  mo("Cervo Ancestral", "Arco 1: Floresta dos Cedros", "chefe", "3", 70, 14, "+5", "2d6 + 2 (média 9)", "10", [
    sp("Chifres Radiantes", 2, "habilidade", "d20 + 5, dano 2d6. O alvo faz teste de Destreza contra 13 ou fica cego por 1 turno.", { aplica: ["Cego"] }),
    sp("Chamado da Mata", 4, "habilidade", "Invoca 2 Raposas Sombrias.")
  ], "Mantém distância e usa o chamado cedo.",
    "A mata foi corrompida: o cervo não é mau, está sofrendo."),

  /* Arco 1: Pedra Velha */
  mo("Morcego-Cristal", "Arco 1: Pedra Velha", "capanga", "3", 8, 12, "+3", "1d4 + 1 (média 3,5)", "-", [
    sp("Guincho", "passiva", "passiva", "Se acertar, o alvo faz teste de Inteligência contra 12 ou fica atordoado (perde a próxima ação).", { aplica: ["Atordoado"] })
  ], "Voa em bando e ataca de cima.",
    "Com 8 jogadores, use de 8 a 10 morcegos."),
  mo("Verme das Rochas", "Arco 1: Pedra Velha", "normal", "3", 28, 12, "+4", "1d10 + 1 (média 6,5)", "4", [
    sp("Emboscada", "passiva", "passiva", "Surge do chão: no primeiro turno, ataca com vantagem (role dois dados e fique com o melhor)."),
    sp("Rocha Cuspida", 1, "habilidade", "d20 + 4, dano 1d6, alcance longo.")
  ], "Foge para o chão quando ferido e volta em outro ponto.",
    "Ensina os jogadores a vigiarem o chão."),
  mo("Golem de Entulho", "Arco 1: Pedra Velha", "elite", "3 a 4", 45, 14, "+5", "2d6 + 1 (média 8)", "6", [
    sp("Pedregulho", 2, "habilidade", "d20 + 5, dano 2d6, alcance longo."),
    sp("Ponto Fraco", "passiva", "passiva", "Feitiços do Grimório do Som e do Grimório de Gravidade causam +1d6 de dano nele.")
  ], "Avança em linha reta e esmaga o mais próximo.",
    "Um bom lugar para os grimórios de Som e Gravidade brilharem.", { red: 2 }),
  mo("Guardião das Ruínas", "Arco 1: Pedra Velha", "chefe", "4", 80, 15, "+6", "2d8 + 2 (média 11)", "12", [
    sp("Runa de Selamento", 2, "habilidade", "Um jogador faz teste de Inteligência contra 14 ou fica com -2 em todas as rolagens por 2 turnos."),
    sp("Colapso", 4, "habilidade", "Os jogadores próximos sofrem 2d6 (teste de Destreza contra 13 para sofrer metade)."),
    sp("Selo Antigo", "passiva", "passiva", "Tem redução de dano 3 contra ataques físicos. Feitiços ignoram essa redução.")
  ], "Protege a entrada da mina. Fica parado até perder metade da vida, quando começa a usar o colapso.",
    "É a explicação do tremor que lacrou a mina.", { red: 3 }),

  /* Arco 2 */
  mo("Elemental Instável", "Arco 2", "normal", "4", 30, 13, "+5", "1d8 + 2 (média 6,5)", "8", [
    sp("Forma Instável", "passiva", "passiva", "No início do turno dele, role d4: 1 fogo (o ataque deixa em chamas), 2 água (molhado), 3 raio (eletrizado), 4 gelo (lento).")
  ], "Ataca o mais próximo, trocando de forma a cada turno.",
    "Perfeito para testar as combinações de magias."),
  mo("Bandoleiro Veterano", "Arco 2", "normal", "4", 30, 14, "+5", "1d8 + 3 (média 7,5)", "-", [
    sp("Golpe Sujo", "passiva", "passiva", "Uma vez por combate, o alvo faz teste de Destreza contra 13 ou perde 2 de deslocamento e fica com -1 de Defesa por 1 turno."),
    sp("Voz de Comando", "passiva", "passiva", "Capangas próximos ganham +1 nas rolagens de ataque.")
  ], "Usa o terreno e protege os capangas.",
    "Um inimigo humano sem magia, para variar."),
  mo("Mago Renegado", "Arco 2", "normal", "4", 28, 13, "+5", "1d8 + 2 (feitiço)", "10", [
    sp("Feitiços de um grimório", "passiva", "passiva", "Escolha um grimório do catálogo e use 2 dos feitiços dele: um de 1 mana e um de 2 mana. Troque o grimório a cada mago para variar.")
  ], "Fica longe e usa o feitiço de controle primeiro.",
    "Deixa os jogadores verem como é enfrentar o poder de um grimório."),
  mo("Quimera de Mana", "Arco 2", "chefe", "4", 60, 15, "+6", "2d8 + 2 (média 11)", "12", [
    sp("Três cabeças", "passiva", "passiva", "Cada cabeça tem 20 de Vida e Defesa 14, e pode ser atacada à parte. Cada cabeça viva faz um ataque especial por turno. Uma cabeça derrotada para de atacar."),
    sp("Cabeça de Fogo", "passiva", "ataque", "Sopro em cone: 2d6 e o alvo fica em chamas (2 de dano por turno, 2 turnos).", { aplica: ["Em chamas"], dot: dotRes("Destreza", 13) }),
    sp("Cabeça de Raio", "passiva", "ataque", "d20 + 6 contra um alvo, dano 2d6 e o alvo fica eletrizado.", { aplica: ["Eletrizado"] }),
    sp("Cabeça de Gelo", "passiva", "ataque", "Um alvo faz teste de Destreza contra 13 ou fica lento e com -2 de Defesa até o fim da próxima rodada.", { aplica: ["Lento"] })
  ], "Usa todas as cabeças vivas a cada turno.",
    "Com 8 jogadores, dobre a Vida do corpo e de cada cabeça (40 cada): todos têm algo para atacar."),

  /* Arco final */
  mo("Titã Corrompido", "Arco final", "chefe", "5", 120, 16, "+7", "3d6 + 3 (média 13,5)", "16", [
    sp("Pisada Sísmica", 2, "habilidade", "Os jogadores próximos fazem teste de Destreza contra 14 ou caem (-2 de Defesa até o fim da próxima rodada) e sofrem 2d6."),
    sp("Punho Colossal", 4, "habilidade", "d20 + 7 contra um alvo, dano 4d6. O alvo faz teste de Poder contra 15 ou é arremessado 4 casas."),
    sp("Corpo de Pedra", "passiva", "passiva", "Redução de dano 3. Um ataque de Antimagia (Corte Nulo) remove a redução por 1 rodada.")
  ], "Usa a pisada quando os jogadores se juntam e o punho no tank.",
    "Um combate longo, para fechar o arco antes do final.", { red: 3 }),

  /* Segredos da organização (aparecem na aba Mestre) */
  mo("Capanga Marcado", "Segredo", "capanga", "2 a 4", 14, 12, "+4", "1d8 + 2 (média 6,5)", "-", [
    sp("Marca", "passiva", "passiva", "Tem a marca da organização. Em vez de derrotá-lo, os jogadores podem libertá-lo (dificuldade 12). Se libertado, solta a arma e desmaia.")
  ], "Luta sem medo e sem recuar.",
    "Com 8 jogadores, use de 6 a 8. Bom para mostrar a marca pela primeira vez.", { segredo: true }),
  mo("Fera Marcada", "Segredo", "normal", "3 a 4", 30, 13, "+5", "1d10 + 2 (média 7,5)", "-", [
    sp("Fúria Marcada", "passiva", "passiva", "Com metade da vida, ganha +1d4 de dano e a marca brilha. Se a marca for quebrada, a fera se acalma.")
  ], "Ataca o mais próximo, sem estratégia.",
    "Uma criatura que parece normal, mas tem a marca escondida.", { segredo: true }),
  mo("Cavaleiro Controlado", "Segredo", "elite", "4", 45, 15, "+6", "2d6 + 2 (média 9)", "8", [
    sp("Feitiços de um grimório", "passiva", "passiva", "Escolha um grimório do catálogo e use 2 dos feitiços dele."),
    sp("Olhos Vazios", "passiva", "passiva", "Não fala. Só reage se alguém disser o nome de quem ele já foi (+2 no teste de libertar).")
  ], "Protege uma área e não recua.",
    "Um membro da ordem, para mostrar que o problema já está lá dentro.", { segredo: true }),
  mo("Infiltrado (modelo de chefe)", "Segredo", "chefe", "3 a 5", 60, 14, "+6", "2d6 + 3 (média 10)", "12", [
    sp("Grimório do infiltrado", "passiva", "passiva", "Escolha um grimório do catálogo e use os 4 feitiços dele."),
    sp("Máscara", "passiva", "passiva", "No primeiro combate, usa só o ataque simples e o feitiço de apoio. Revela o resto no terceiro momento."),
    sp("Elo da Marca", 4, "habilidade", "Todos os marcados próximos ganham +2 nas rolagens por 2 turnos.")
  ], "Revela o poder aos poucos.",
    "Use este modelo para os 5 infiltrados e mude o grimório de cada um.", { segredo: true }),
  mo("Grande Mago Dominado", "Segredo", "chefe", "5", 110, 16, "+7", "2d8 + 3 (média 12)", "16", [
    sp("Dois grimórios", "passiva", "passiva", "Usa feitiços de dois grimórios do catálogo (um de Dano e um de Suporte)."),
    sp("Dominado", "passiva", "passiva", "O objetivo é libertá-lo, não matá-lo. Com metade da vida, os jogadores podem tentar quebrar a marca."),
    sp("Fúria da Marca", 4, "habilidade", "Quando a marca é atacada, ele solta uma onda: 2d6 em todos os jogadores próximos.")
  ], "Luta sem emoção e para quando a marca é quebrada.",
    "É o grande mago que a organização queria controlar.", { segredo: true }),
  mo("Líder da Organização (modelo)", "Segredo", "chefe", "5", 150, 17, "+8", "3d8 + 3 (média 16,5)", "20", [
    sp("Ritual de Controle", 4, "habilidade", "Prepara por 3 turnos. Se concluir o ritual sobre um personagem vulnerável (marca no estágio 3), ele é controlado. Os jogadores interrompem atacando o líder ou quebrando a marca."),
    sp("Mestre dos Grimórios", "passiva", "passiva", "Usa os 4 feitiços de três grimórios do catálogo à sua escolha."),
    sp("Defesa Final", "passiva", "passiva", "Com 1/3 da vida, invoca 2 Capangas Marcados por turno.")
  ], "A detalhar quando você definir o líder.",
    "Este é só um modelo de números. O líder e o plano dele ainda estão em aberto.", { segredo: true })
];

var LISTAS = {
  pend: [
    ["Escrever o roteiro da Sessão 1 (abertura, cerimônia, primeiro combate)", false],
    ["Todo grimório tem um feitiço de dano de 1 mana (ataque simples)", true],
    ["Ajustar os bônus dos vilarejos (equilibrar Poder, Destreza e Inteligência)", false],
    ["Aba Sorteio criada (sorteio dirigido, selos e modo cerimônia)", true],
    ["Aba Jogadores criada (perfil, moralidade e observações)", true],
    ["Preencher o perfil de cada jogador nas chamadas individuais", false],
    ["Fazer o sorteio e as chamadas individuais de cada jogador", false],
    ["Definir regras de reação e turno completas (iniciativa já anotada)", false],
    ["Criar os cards de grimório para imprimir", false],
    ["Criar a ficha de personagem para imprimir", false],
    ["Nome, símbolo e líder da organização inimiga", false],
    ["Criar os 5 infiltrados (fachada, pistas, grimório)", false],
    ["Nome da ordem de cavaleiros e quem a comanda", false],
    ["Bestiário por fase da campanha (30 inimigos)", true],
    ["Níveis e evolução definidos (revisar depois da Sessão 1)", true],
    ["Mapa de Grimoria criado", true],
    ["Decidir os segredos dos mistérios sem resposta (Lago, Torre, Cemitério)", false],
    ["Mesa de mapa com grid (etapa 1)", false],
    ["Grimórios de tank criados (Fortaleza, Aço e Névoa)", true],
    ["Sessão Zero montada", true],
    ["Regras de quebrar a marca anotadas", true]
  ],
  zero: [
    ["Fichas de personagem impressas (ou espaço para anotar à mão)", false],
    ["Dados físicos: pelo menos um d20 por jogador, e d4, d6, d8, d10", false],
    ["Cards de grimório prontos para a Sessão 1", false],
    ["Resumo do sistema em 1 página", false],
    ["Os 4 vilarejos descritos em 2 ou 3 linhas cada", false],
    ["Lista de linhas e véus para anotar", false]
  ]
};

/* ============================ ESTADO ============================ */

var filtro = { attr: "todos", papel: "todos", elem: "todos", q: "" };

function salvarEstado(k) { adiar("est-" + k, function () { gravar("estado", { chave: k, valor: EST[k] }); }, 400); }

function getChecks(key) {
  var saved = EST[key];
  return LISTAS[key].map(function (it, i) {
    return saved && typeof saved[i] === "boolean" ? saved[i] : it[1];
  });
}
function setCheck(key, i, v) {
  var cur = getChecks(key);
  cur[i] = v;
  EST[key] = cur;
  salvarEstado(key);
}
function checklist(key) {
  var st = getChecks(key);
  return '<ul class="check">' + LISTAS[key].map(function (it, i) {
    return '<li><label><input type="checkbox" class="chk" data-key="' + key + '" data-i="' + i + '"' + (st[i] ? " checked" : "") + '><span>' + it[0] + "</span></label></li>";
  }).join("") + "</ul>";
}

function setRev(id, v) {
  var cur = getRev();
  cur[id] = v;
  EST.rev = cur;
  salvarEstado("rev");
  sincronizarPub();
}

/* Os jogadores nunca recebem este arquivo. O que eles podem ver é copiado para o servidor
   em versões filtradas: grim_pub (só as magias liberadas) e locais_pub (só os locais revelados, sem segredos). */
function grimPub() {
  var out = {}, lib = EST.magias_lib || {};
  GRIMORIOS.forEach(function (g) {
    var nomes = lib[g.nome] || [];
    out[g.nome] = { nome: g.nome, attr: g.attr, papel: g.papel, elem: g.elem, sub: g.sub, tier: g.tier,
      spells: g.spells.concat(g.futuras || []).filter(function (s) { return nomes.indexOf(s.nome) !== -1; }) };
  });
  return out;
}
function locaisPub() {
  var rev = getRev(), lig = EST.locais_cen || {};
  return LOCAIS.filter(function (l) { return !l.secreto && rev[l.id]; }).map(function (l) {
    var o = { id: l.id, nome: l.nome, tipo: l.tipo, x: l.x, y: l.y, lab: l.lab }, c = lig[l.id] ? acharEnvio(lig[l.id]) : null;
    if (c && cenLiberado(c.id)) {
      o.cenario = c.id; o.cv = c.v; o.cenNome = c.nome;
      var rs = String(infoCen(c.id).resumo || "").trim();
      if (rs) o.cenResumo = rs;
    }
    return o;
  });
}
function sincronizarPub() {
  [["grim_pub", grimPub()], ["locais_pub", locaisPub()], ["vilas_pub", BONUS_VILA]].forEach(function (p) {
    if (JSON.stringify(EST[p[0]]) !== JSON.stringify(p[1])) { EST[p[0]] = p[1]; salvarEstado(p[0]); }
  });
}

/* ============================ IMPORTAR DO NAVEGADOR ============================ */

var importMsg = "";
function temDadosLocais() {
  try {
    if (localStorage.getItem("bc-importado")) return false;
    return ["bc-pend", "bc-zero", "bc-rev", "bc-sorteio", "bc-jogs"].some(function (k) { return localStorage.getItem(k) !== null; });
  } catch (e) { return false; }
}
function lerLocal(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }

/* Traz para a conta o que a versão antiga do site guardava só no navegador. */
function importarLocal() {
  var falhas = 0, tarefas = [];
  function conta(r) { if (!r) falhas++; return r; }
  [["bc-pend", "pend"], ["bc-zero", "zero"], ["bc-rev", "rev"], ["bc-sorteio", "sorteio"]].forEach(function (p) {
    var v = lerLocal(p[0]);
    if (v === null) return;
    EST[p[1]] = v;
    tarefas.push(gravar("estado", { chave: p[1], valor: v }).then(conta));
  });
  sorteio = null;
  var lj = lerLocal("bc-jogs");
  (Array.isArray(lj) ? lj : []).forEach(function (j) {
    if (!j || !j.id || achaJog(j.id)) return;
    var foto = "";
    try { foto = localStorage.getItem("bc-jogimg-" + j.id) || ""; } catch (e) { foto = ""; }
    delete j.temImg;
    jogs.push(j);
    var t = gravar("jogador_salvar", { jogador: j }).then(conta);
    if (foto) {
      t = t.then(function (r) { return r ? gravar("img_enviar", { tipo: "avatar", ref: j.id, dados: foto }).then(conta) : null; }).then(function (r) {
        if (!r) return null;
        j.img = r.id;
        IMAGENS.push({ id: r.id, tipo: "avatar", ref: j.id, titulo: "", liberado: false });
        return gravar("jogador_salvar", { jogador: j }).then(conta);
      });
    }
    tarefas.push(t);
  });
  importMsg = "Importando…";
  renderizar();
  Promise.all(tarefas).then(function () {
    sincronizarPub();
    if (falhas) { importMsg = "Parte dos dados não foi importada (" + falhas + " falhas). Tente de novo."; }
    else {
      try { localStorage.setItem("bc-importado", new Date().toISOString()); } catch (e) { /* sem armazenamento: ignora */ }
      importMsg = "Dados importados para a sua conta.";
    }
    renderizar();
  });
}

function viewInicio() {
  var tanks = GRIMORIOS.filter(function (g) { return g.papel === "Tank"; }).length;
  return '<h1>Campanha de Black Clover</h1>' +
    '<p class="lead">Tudo o que já definimos para a sua primeira mesa, num lugar só. Plebeus de vilarejo, grimórios sorteados e um sistema simples de três atributos.</p>' +
    '<div class="stats">' +
    '<div class="stat"><b>' + GRIMORIOS.length + '</b>grimórios</div>' +
    '<div class="stat"><b>' + tanks + '</b>de tank</div>' +
    '<div class="stat"><b>' + FAMILIAS_ELEM.length + '</b>elementos</div>' +
    '<div class="stat"><b>' + INIMIGOS.length + '</b>inimigos</div>' +
    '<div class="stat"><b>' + VILAREJOS.length + '</b>vilarejos</div>' +
    '<div class="stat"><b>8</b>jogadores</div></div>' +
    '<div class="cols">' +
    panel("O conceito", "<ul><li>Mundo inspirado em Black Clover, com magia e cavaleiros mágicos.</li><li>Todo personagem é um plebeu de vilarejo.</li><li>O grimório é sorteado em um evento com cards físicos.</li><li>Rolagens são presenciais, com dados físicos.</li></ul>") +
    panel("O sistema", "<ul><li>Três atributos: Poder, Destreza e Inteligência.</li><li>Rolagem: d20 + atributo contra uma dificuldade.</li><li>Vida 20, Mana 10 + 1 a cada 2 de Inteligência, Defesa 10 + Destreza.</li><li>Poder reduz o dano que você recebe.</li></ul>") +
    panel("Atalhos", '<ul><li><a href="#regras">Regras e combate</a></li><li><a href="#grimorios">Os grimórios</a></li><li><a href="#mapa">Mapa de Grimoria</a></li><li><a href="#sorteio">Sorteio dos grimórios (mestre)</a></li><li><a href="#jogadores">Anotações dos jogadores (mestre)</a></li><li><a href="#sessao-zero">Roteiro da Sessão Zero</a></li><li><a href="#mestre">Segredos da campanha (modo mestre)</a></li></ul>') +
    "</div>" +
    "<h2>Pendências</h2>" +
    '<section class="panel"><p>Suas marcações ficam salvas na sua conta.</p>' + checklist("pend") + "</section>" +
    (temDadosLocais() || importMsg ? "<h2>Dados da versão antiga</h2>" + panel(ic("alerta") + "Importar deste navegador",
      "<p>Este navegador tem marcações, sorteio ou jogadores salvos pela versão antiga do site, que guardava tudo só no aparelho. Importe para a sua conta para não perder nada.</p>" +
      '<p><button type="button" class="primary" id="importarLocal"' + (importMsg === "Importando…" ? " disabled" : "") + ">Importar para a conta</button></p>" +
      '<p role="status" class="mdica">' + esc(importMsg) + "</p>") : "");
}

function viewGrimorios() {
  var papeis = ["todos", "Dano", "Tank", "Suporte"];
  var h = "<h1>Grimórios</h1>" +
    '<div class="note"><p><b>Liberação.</b> Cada jogador vê só o próprio grimório, depois que você marcar “Revelar o grimório” no perfil dele (aba Jogadores). Dentro do grimório, ele vê só os feitiços marcados como <b>Liberada</b>.</p></div>' +
    '<p class="lead">Cada grimório tem um papel (Dano, Tank ou Suporte, que inclui cura, controle e utilidade) e feitiços com custos de mana variados. Cada grimório ganha uma nova habilidade no nível 3, e os tanks ganham uma a cada nível (veja a aba Níveis). Passe o mouse (ou toque) sobre a descrição de um feitiço para ver os valores mínimo e máximo dos dados.</p>' +
    legenda() + '<div class="controls"><input type="search" id="busca" placeholder="Buscar por nome ou feitiço" aria-label="Buscar grimório" value="' + filtro.q.replace(/"/g, "&quot;") + '"></div>' +
    '<div class="controls">' +
    '<div class="fgroup"><span>Atributo</span><div class="chips" id="fAttr">' +
    [["todos", "Todos"], ["poder", "Poder"], ["destreza", "Destreza"], ["inteligencia", "Inteligência"]].map(function (a) {
      return '<button type="button" class="chip" data-attr="' + a[0] + '" aria-pressed="' + (filtro.attr === a[0]) + '">' + (ATTR_ICON[a[0]] ? ic(ATTR_ICON[a[0]]) : "") + a[1] + "</button>";
    }).join("") + "</div></div>" +
    '<div class="fgroup"><span>Papel</span><div class="chips" id="fPapel">' +
    papeis.map(function (p) {
      return '<button type="button" class="chip" data-papel="' + p + '" aria-pressed="' + (filtro.papel === p) + '">' + (PAPEL_ICON[p] ? ic(PAPEL_ICON[p]) : "") + (p === "todos" ? "Todos" : p) + "</button>";
    }).join("") + "</div></div></div>" +
    '<div class="controls"><div class="fgroup"><span>Elemento</span><div class="chips" id="fElem">' +
    ["todos"].concat(FAMILIAS_ELEM).map(function (e) {
      return '<button type="button" class="chip" data-elem="' + e + '" aria-pressed="' + (filtro.elem === e) + '">' + (e === "todos" ? "Todos" : e) + "</button>";
    }).join("") + "</div></div></div>" +
    '<div class="controls"><div class="fgroup"><span>Outros tipos</span><div class="chips" id="fTipo">' +
    FAMILIAS_TIPO.map(function (e) {
      return '<button type="button" class="chip" data-elem="' + e + '" aria-pressed="' + (filtro.elem === e) + '">' + e + "</button>";
    }).join("") + "</div></div></div>" +
    '<p id="contagem" role="status"></p><div class="grid" id="grid"></div>';
  return h;
}

function desenharGrimorios() {
  var q = filtro.q.trim().toLowerCase();
  var lista = GRIMORIOS.filter(function (g) {
    if (filtro.attr !== "todos" && g.attr !== filtro.attr) return false;
    if (filtro.papel !== "todos" && g.papel !== filtro.papel) return false;
    if (filtro.elem !== "todos" && g.fam !== filtro.elem) return false;
    if (q) {
      var tudo = (g.nome + " " + g.sub + " " + g.elem + " " + g.spells.concat(g.futuras || []).map(function (s) { return s.nome + " " + s.texto + " " + (s.aplica || []).join(" ") + (s.dot ? " dano contínuo resistência" : ""); }).join(" ")).toLowerCase();
      if (tudo.indexOf(q) === -1) return false;
    }
    return true;
  });
  var grid = document.getElementById("grid");
  if (!grid) return;
  document.getElementById("contagem").textContent = lista.length + " de " + GRIMORIOS.length + " grimórios";
  grid.innerHTML = lista.length ? lista.map(cardComLib).join("") : '<div class="empty" style="grid-column:1/-1">Nenhum grimório com esses filtros. Limpe a busca ou escolha “Todos”.</div>';
}

function magiasLib(g) { return (EST.magias_lib || {})[g.nome] || []; }
function cardComLib(g) {
  var lib = magiasLib(g), todas = g.spells.concat(g.futuras || []);
  var donos = (jogs || []).filter(function (j) { return j.grim === g.nome; });
  var h = '<div class="lib-wrap"><div class="lib-barra">' +
    "<span>" + (donos.length ? donos.map(function (j) {
      return "<b>" + esc(j.personagem || j.nome || "Jogador") + "</b> " + (j.grimRev ? "(revelado)" : "(ainda não revelado)");
    }).join(", ") : "Sem dono") + "</span>" +
    "<span>" + lib.length + " de " + todas.length + " liberadas</span>" +
    '<span class="lib-acoes"><button type="button" data-libini="' + esc(g.nome) + '">Liberar as iniciais</button>' +
    '<button type="button" data-libnada="' + esc(g.nome) + '"' + (lib.length ? "" : " disabled") + ">Ocultar todas</button></span></div>";
  return h + bookCard(g, false, function (s) {
    var on = lib.indexOf(s.nome) !== -1;
    return '<button type="button" class="lib" data-lib-g="' + esc(g.nome) + '" data-lib-s="' + esc(s.nome) + '" aria-pressed="' + on + '" title="' +
      (on ? "O dono do grimório vê este feitiço. Clique para ocultar." : "Oculto para o dono. Clique para liberar.") + '">' + ic(on ? "olho" : "cadeado") + (on ? "Liberada" : "Oculta") + "</button>";
  }) + "</div>";
}
function mudarLib(gn, nomes) {
  EST.magias_lib = EST.magias_lib || {};
  EST.magias_lib[gn] = nomes;
  salvarEstado("magias_lib");
  sincronizarPub();
  desenharGrimorios();
}
function acoesLib(b) {
  var g;
  if (b.dataset.libG !== undefined) {
    g = achar(b.dataset.libG);
    if (!g) return true;
    var lib = magiasLib(g).slice(), i = lib.indexOf(b.dataset.libS);
    if (i === -1) lib.push(b.dataset.libS); else lib.splice(i, 1);
    mudarLib(g.nome, lib);
    return true;
  }
  if (b.dataset.libini !== undefined) {
    g = achar(b.dataset.libini);
    if (!g) return true;
    var atual = magiasLib(g).slice();
    g.spells.forEach(function (s) { if (atual.indexOf(s.nome) === -1) atual.push(s.nome); });
    mudarLib(g.nome, atual);
    return true;
  }
  if (b.dataset.libnada !== undefined) { mudarLib(b.dataset.libnada, []); return true; }
  return false;
}

var filtroBest = "todos";

function monstroCard(m) {
  var v8 = m.tipo === "capanga" ? "use o dobro de unidades" : "8 jogadores: " + (m.vida * 2);
  var h = '<article class="panel monstro"><h3>' + m.nome + '</h3><div class="meta"><span class="tag role">' + m.tipo + '</span><span class="tag role">Nível ' + m.nivel + "</span></div>" +
    '<div class="stat-line">' +
    "<span>" + ic("coracao") + "<b>Vida</b> " + m.vida + " <small>(" + v8 + ")</small></span>" +
    "<span>" + ic("escudo") + "<b>Defesa</b> " + m.defesa + "</span>" +
    "<span>" + ic("espada") + "<b>Ataque</b> " + m.ataque + "</span>" +
    (m.mana && m.mana !== "-" ? "<span>" + ic("gota") + "<b>Mana</b> " + m.mana + "</span>" : "") +
    (m.red ? "<span>" + ic("escudo") + "<b>Redução de dano</b> " + m.red + "</span>" : "") +
    "</div>" + desc("<b>Dano:</b> " + m.dano);
  if (m.habs.length) h += '<ul class="spells">' + m.habs.map(function (x) { return spellItem(x); }).join("") + "</ul>";
  if (m.comp) h += "<p><b>Comportamento:</b> " + m.comp + "</p>";
  if (m.dica) h += '<p class="bnote">' + m.dica + "</p>";
  return h + dropsHTML(m) + "</article>";
}

function viewBestiario() {
  var publicos = INIMIGOS.filter(function (m) { return !m.segredo; }).length;
  return "<h1>Bestiário</h1>" +
    '<p class="lead">Os inimigos seguem a história da campanha, do primeiro encontro ao arco final. Cada um mostra o nível de jogador em que funciona melhor. Os agentes da organização ficam na aba Mestre, para não estragar a surpresa.</p>' +
    panel(ic("grupo") + "Para 4 ou para 8 jogadores",
      "<p>Os números dos cards são para 4 jogadores. Com 8 jogadores, ajuste assim (o valor de Vida para 8 já aparece ao lado):</p>" +
      "<ul><li><b>Capangas:</b> use o dobro de unidades.</li><li><b>Normais e elites:</b> dobre a Vida.</li><li><b>Chefes:</b> dobre a Vida e dê uma ação extra por turno (uma ação menor, como um ataque simples).</li></ul>") +
    '<div class="controls"><div class="fgroup"><span>Fase</span><div class="chips" id="fFase">' +
    ["todos"].concat(FASES).map(function (f) {
      return '<button type="button" class="chip" data-fase="' + f + '" aria-pressed="' + (filtroBest === f) + '">' + (f === "todos" ? "Todos" : f) + "</button>";
    }).join("") + "</div></div></div>" +
    dropSeletorHTML() + '<p id="contaBest" role="status">' + publicos + " inimigos neste bestiário.</p>" +
    '<div id="listaMonstros"></div>' +
    panel("Notas", "<ul><li>Como o jogador subtrai a redução de dano (1 para cada 2 de Poder) do dano, os inimigos precisam de dano um pouco mais alto do que parece. Se ninguém perde vida, suba o dado de dano um degrau.</li><li>Se o combate estiver fácil demais, aumente a Vida ou o Ataque. Se estiver difícil, reduza a Defesa.</li><li>Alguns inimigos têm redução de dano. Ela se aplica antes de tirar a Vida, e o dano mínimo continua sendo 1.</li><li>Para outros níveis, veja a tabela de referência na aba Níveis.</li></ul>");
}

function desenharBestiario() {
  var cont = document.getElementById("listaMonstros");
  if (!cont) return;
  var fases = filtroBest === "todos" ? FASES : [filtroBest];
  var h = "";
  fases.forEach(function (f) {
    var lista = INIMIGOS.filter(function (m) { return m.fase === f && !m.segredo; });
    if (!lista.length) return;
    h += "<h2>" + f + "</h2>" + '<div class="cols">' + lista.map(monstroCard).join("") + "</div>";
  });
  cont.innerHTML = h;
}

function viewSessaoZero() {
  return "<h1>Sessão Zero</h1>" +
    '<p class="lead">Com 8 jogadores, reserve de 75 a 90 minutos antes da Sessão 1. Ela não revela nada da organização nem da marca. Só prepara a mesa e cria os personagens.</p>' +
    "<div class=\"rules\">" +
    panel("Boas-vindas e tom (5 min)", "<ul><li>Explique a ideia: Black Clover, com magia e aventura, todos plebeus de vilarejo.</li><li>Combine o tom: aventura com momentos sérios e leves, sem terror pesado.</li><li>Diga que é sua primeira vez mestrando e que você vai ajustar regras no caminho.</li></ul>") +
    panel("O sistema em 5 minutos", "<ul><li>Três atributos: Poder, Destreza, Inteligência.</li><li>Rolagem: d20 + atributo contra uma dificuldade (fácil 10, média 15, difícil 20).</li><li>O inimigo acerta se rolar a sua Defesa (10 + Destreza) ou mais. O Poder reduz o dano.</li><li>Mana 10, mais 1 a cada 2 pontos de Inteligência. Feitiços custam 1, 2 ou 4.</li><li>Regra de ouro: se algo travar, o mestre decide rápido e ajusta depois.</li></ul>") +
    panel("Acordos de mesa (10 min)", "<ul><li><b>Linhas e véus:</b> o que não pode aparecer, e o que acontece só “fora da cena”.</li><li><b>Segurança:</b> qualquer pessoa pode pedir uma pausa, sem explicar.</li><li><b>Drama de personagem:</b> diga “durante a campanha, algum personagem pode ser tentado, enganado, ferido ou perder o controle por um tempo. Isso é parte da história, não punição. Vocês topam?”</li><li><b>Cooperativo:</b> sem jogador contra jogador de verdade.</li><li>Celular guardado durante as cenas.</li><li>Como lidar com ausências.</li><li>Ninguém lê material do mestre.</li></ul>") +
    panel("Criar o personagem (30 min)", "<p>Com 8 jogadores, deixe 2 por vilarejo: eles criam juntos e já nascem com um laço.</p><ol><li>Escolher o vilarejo e anotar o bônus.</li><li>Nome, idade, um sonho e um medo.</li><li>Distribuir +5 pontos (máximo +3 em um), <b>antes de ver o grimório</b>.</li><li>Anotar Vida 20, Mana 10 + 1 a cada 2 de Inteligência, Defesa 10 + Destreza e redução de dano = Poder ÷ 2 (arredondado para baixo).</li><li>Deixar o grimório em branco para a revelação.</li></ol>") +
    panel("Laços entre os personagens (5 min)", "<ul><li>Quem do grupo você já conhecia de passagem?</li><li>Do que você mais se orgulha no seu vilarejo?</li><li>Do que você tem medo na cerimônia do grimório?</li></ul><p>Use as respostas como ganchos na Sessão 1.</p>") +
    panel("Expectativas e perguntas (5 min)", "<ul><li>O que cada um espera: ação, mistério, humor?</li><li>Alguma dúvida de regra?</li><li>Regra de ouro: se algo incomodar, fale na hora.</li></ul>") +
    "</div>" +
    "<h2>Depois da Sessão Zero</h2>" + panel("Transição", "<p>Faça um intervalo curto. Comece a Sessão 1 com a cena de abertura de cada vilarejo e siga até a cerimônia do grimório.</p>") +
    "<h2>Checklist do mestre</h2>" + '<section class="panel">' + checklist("zero") + "</section>";
}

function viewMestre() {
  if (!mestreAberto) {
    return '<div class="lock"><h1>Área do mestre</h1>' +
      "<p>Esta seção tem os segredos da campanha: a organização inimiga, os infiltrados, a marca e o final. Abra só quando nenhum jogador estiver olhando a tela.</p>" +
      '<p><button type="button" class="primary" id="abrirMestre">Revelar segredos</button></p></div>';
  }
  var h = '<h1>Segredos da campanha</h1><div class="note"><p><b>Spoilers.</b> Não compartilhe o link desta página com os jogadores.</p><p><button type="button" id="fecharMestre">Ocultar de novo</button></p></div>';

  h += "<h2>Estrutura</h2>" + panel("Cinco passos",
    "<ol><li><b>Sessão 1 (cerimônia):</b> os jogadores recebem os grimórios e algo dá errado. A ordem chega tarde.</li>" +
    "<li><b>Primeiro arco (vilarejos):</b> cada jogador resolve o problema do seu vilarejo. Parecem problemas separados.</li>" +
    "<li><b>Segundo arco (conexão):</b> descobrem que tudo vem da mesma ameaça. A ordem não percebeu por estar concentrada demais na capital.</li>" +
    "<li><b>Arco final:</b> a organização ataca, a ordem sozinha não dá conta, e os jogadores lideram grupos de aliados.</li>" +
    "<li><b>Epílogo:</b> cerimônia de nomeação. A ordem se divide em esquadrões e cada jogador recebe o seu.</li></ol>");

  h += "<h2>A ordem única e os esquadrões</h2>" + panel("Ideia central",
    "<ul><li>Hoje existe um só grupo de cavaleiros mágicos protegendo o reino. Não há esquadrões.</li>" +
    "<li>Os vilarejos sofrem ameaças e a ordem chega tarde ou não chega.</li>" +
    "<li>Todos os magos poderosos estão numa só ordem: controlar poucos é controlar o reino. A divisão em esquadrões é a resposta ao plano da organização.</li>" +
    "<li>Um capitão-geral tradicionalista resiste à divisão. Não precisa ser vilão: pode ter medo com razão e mudar de ideia.</li>" +
    "<li>A ordem pode ter preconceito de que só nobres são cavaleiros. Isso pesa quando os plebeus provam o contrário.</li>" +
    "<li>Cada esquadrão pode herdar a identidade do vilarejo do jogador: proteger o povo, caçar criaturas, explorar ruínas, cuidar de informação e comércio.</li><li>Com 8 jogadores, serão 8 esquadrões: dois por vilarejo de origem, cada um com um foco diferente.</li></ul>");

  h += "<h2>A organização inimiga</h2>" + panel("Objetivo",
    "<p>Querem <b>controlar os grandes magos poderosos</b>. Os problemas dos quatro vilarejos são obra deles. Eles aproveitam a fraqueza da ordem centralizada, e os infiltrados oferecem ajuda justamente nesses momentos.</p>") +
    table(["Infiltrado", "Fachada", "Ligado a", "Segredo"], [
      ["1", "Curandeiro ou fazendeiro que ajuda após o ataque", "Vale das Colheitas", "A criatura foi solta de propósito"],
      ["2", "Comerciante ou capitão que traz informações", "Porto Salgado", "O navio misterioso é dele"],
      ["3", "Caçador-guia que oferece ajuda na mata", "Floresta dos Cedros", "Os caçadores sumiram por ordem dele"],
      ["4", "Estudioso de ruínas e magia antiga", "Pedra Velha", "Quer o que está na mina lacrada"],
      ["5", "Cavaleiro da ordem que apoia os jogadores", "Dentro da ordem", "Explica por que a ordem nunca percebe nada"],
      ["Líder", "Só aparece no arco final", "-", "Cérebro do plano"]
    ]) +
    panel("Regra dos 3 momentos", "<ol><li><b>Ajuda:</b> o infiltrado ajuda de verdade e ganha confiança.</li><li><b>Pista pequena:</b> algo estranho, quase despercebido.</li><li><b>Revelação:</b> a máscara cai num arco posterior.</li></ol>") +
    panel("Pistas e dicas", "<ul><li>Um símbolo ou detalhe repetido em todos (uma marca no pulso, um anel).</li><li>Chegam sempre logo depois do problema, nunca antes.</li><li>Sabem de algo que não deveriam saber. Nunca usam o grimório na frente dos jogadores.</li><li>Se um jogador desconfiar cedo, deixe. Revele um infiltrado por arco.</li><li>Deixe pelo menos um NPC inocente, para a mesa não ficar paranoica.</li><li>Se os infiltrados forem controlados, os jogadores podem libertá-los em vez de derrotá-los.</li></ul>");

  h += "<h2>A marca</h2>" + panel("Como funciona",
    "<p>A organização faz um ritual com quem está <b>marcado</b>. Só quem tem a marca pode ser controlado. A marca parece algo legal e dá um pequeno poder: é a isca. Um jogador pode ser marcado se aceitar.</p>" +
    table(["Estágio", "O que acontece"], [
      ["1. Presente", "Só vantagens. Parece uma honra."],
      ["2. Sussurros", "A marca “puxa” o personagem. Você pode sugerir ações ou criar dilemas."],
      ["3. Vulnerável", "O personagem pode ser alvo do ritual. Só é controlado se o ritual for concluído."]
    ]) +
    "<p><b>Vantagem da isca (escolha uma, modesta):</b> +1 de mana máxima; ou refazer uma rolagem por sessão; ou +1 em um atributo, só para feitiços.</p>") +
    panel("Cuidados com o jogador marcado", "<ul><li>Avise na Sessão Zero que um personagem pode ser tentado ou dominado, sem dar detalhes.</li><li>A escolha de aceitar a marca é do jogador.</li><li>Evite tirar o controle do personagem por muito tempo: prefira uma cena curta.</li><li>Converse em particular com o jogador marcado.</li></ul>");

  h += "<h2>Quebrar a marca</h2>" + panel("Dificuldade por estágio", table(["Estágio", "Dificuldade", "Observação"], [
    ["1. Presente", "12", "Fácil, mas o personagem pode não querer"],
    ["2. Sussurros", "15", "Exige ajuda de alguém"],
    ["3. Vulnerável", "18", "Só com esforço do grupo"],
    ["Ritual concluído", "20", "Várias etapas, ver “Libertar um controlado”"]
  ])) +
    panel("Formas de quebrar", "<ol>" +
    "<li><b>Antimagia (Corte Nulo):</b> d20 + Poder contra a dificuldade. Custa 1 de mana, mais 2 por estágio acima do primeiro. O alvo precisa aceitar e estar perto.</li>" +
    "<li><b>Ritual contrário:</b> 2 ou mais personagens, um local especial (ruínas, templo, a mina) e um item raro. Cada um rola d20 + Inteligência e vale o melhor resultado somado ao segundo. Falha: o estágio avança em 1.</li>" +
    "<li><b>Aliado de confiança:</b> alguém que o personagem ama o chama de volta. Roleplay, com +2 se for uma boa cena. Funciona melhor nos estágios 1 e 2.</li>" +
    "<li><b>Derrotar a fonte:</b> quebrar o infiltrado ou o objeto do elo desfaz as marcas ligadas a ele. Bom para fechar um arco.</li>" +
    "<li><b>Escolha do próprio personagem:</b> teste de Inteligência contra a dificuldade, com +2 se tiver motivo emocional forte.</li></ol>") +
    panel("Libertar um controlado", "<ol><li>Combate para enfraquecer (reduzir a vida pela metade, sem matar).</li><li>Quebrar o elo por um dos métodos acima durante o combate.</li><li>Cena de reencontro: o personagem acorda sem lembrar parte do que fez.</li></ol>") +
    panel("Se falhar", "<ul><li>O estágio avança, ou a marca “se alimenta” e causa 1d4 de dano ao portador.</li><li>Se o grupo falhar várias vezes, ofereça um novo caminho (item, aliado, local) em vez de travar a história.</li></ul>");

  h += "<h2>Inimigos secretos</h2>" + dropSeletorHTML() + "<p>Os agentes e os controlados pela organização. Os números são para 4 jogadores (veja a regra para 8 no Bestiário).</p>" + '<div class="cols">' + INIMIGOS.filter(function (m) { return m.segredo; }).map(monstroCard).join("") + "</div>";

  h += "<h2>Decisões em aberto</h2>" + panel("A definir", "<ul><li>Nome e símbolo da organização, e a aparência da marca (discreta ou chamativa).</li><li>Qual é a vantagem real da marca.</li><li>Quem é o líder e o que ele quer, além de controlar os magos.</li><li>Quem se redime, se alguém.</li><li>Nome da ordem, quem a comanda e quem nomeia os esquadrões.</li><li>Os grimórios dos infiltrados (usar os já criados).</li></ul>");
  return h;
}

var ROTAS_SECRETAS = [
  [[935,195],[918,225],[895,258],[872,285],[848,300]],
  [[848,300],[770,250],[690,210],[630,190]]
];

function lo(id, nome, tipo, x, y, lab, arco, pub, e) {
  return extras({ id: id, nome: nome, tipo: tipo, x: x, y: y, lab: lab, arco: arco, pub: pub, ganchos: [], inimigos: [] }, e);
}

var LOCAIS = [
  lo("alta-lumen", "Alta Lumen", "cidade", 630, 190, [0, -20, "middle"], "Arco 2",
    "A capital do Reino de Alvorada. Lá ficam o palácio e a sede da Ordem dos Cavaleiros Mágicos, o único grupo de cavaleiros mágicos do reino. Quase todos os grandes magos vivem aqui.",
    { ganchos: ["A Ordem chega tarde aos vilarejos: por quê?", "O preconceito dos cavaleiros contra plebeus", "A cerimônia final de nomeação dos esquadrões"],
      segredo: "É onde está o infiltrado da Ordem (o quinto), que apoia os jogadores e explica por que a Ordem nunca percebe nada. O Capitão-Geral tradicionalista também está aqui: ele pode já estar controlado ou ser o próximo alvo.",
      inimigosSec: ["Cavaleiro Controlado"] }),
  lo("encruzilhada", "Encruzilhada", "cidade", 500, 335, [0, 30, "middle"], "Sessão 1",
    "A cidade onde as quatro estradas dos vilarejos se encontram. Aqui acontece a cerimônia dos grimórios: um livro flutuante se abre e cada jovem recebe o seu grimório.",
    { ganchos: ["A viagem de cada vilarejo até a cidade", "O ritual de revelação dos grimórios", "Algo dá errado na noite do ritual: o primeiro combate"],
      inimigos: ["Bandido do Reino", "Capitão Bandido", "Corvo de Mana", "Lobo de Mana"],
      segredo: "Os infiltrados passam por aqui. Um cavaleiro da Ordem acompanha a cerimônia e oferece ajuda, o que pode ser a primeira pista.", ideia: true }),
  lo("vale", "Vale das Colheitas", "vilarejo", 430, 545, [0, -18, "middle"], "Arco 1",
    "Um vilarejo agrícola e pacífico, cercado de plantações. Os moradores são fortes de tanto trabalhar na terra.",
    { ganchos: ["As plantações estão sendo atacadas por criaturas de mana"],
      inimigos: ["Espantalho de Mana", "Javali de Mana", "Devorador de Colheitas"],
      segredo: "A criatura foi solta de propósito pelo primeiro infiltrado (o curandeiro ou fazendeiro que ajuda depois do ataque)." }),
  lo("porto", "Porto Salgado", "vilarejo", 848, 300, [-16, -14, "end"], "Arco 1",
    "Um vilarejo pesqueiro e de comércio, cheio de viajantes e contrabando. As pessoas são falantes e espertas.",
    { ganchos: ["Um navio misterioso atracou ao largo e ninguém desceu"],
      inimigos: ["Marujo Afogado", "Caranguejo Blindado", "Polvo da Maré", "Serpente das Marés"],
      segredo: "O navio é do segundo infiltrado (o comerciante ou capitão). Os marinheiros são pessoas marcadas." }),
  lo("floresta", "Floresta dos Cedros", "vilarejo", 232, 352, [0, -18, "middle"], "Arco 1",
    "Um vilarejo de caçadores, isolado entre as árvores. Os moradores são rastreadores.",
    { ganchos: ["Caçadores estão desaparecendo na mata"],
      inimigos: ["Aranha Tecelã", "Raposa Sombria", "Árvore Desperta", "Cervo Ancestral"],
      segredo: "Os caçadores sumiram por ordem do terceiro infiltrado (o caçador-guia que oferece ajuda na mata)." }),
  lo("pedra", "Pedra Velha", "vilarejo", 300, 188, [0, 28, "middle"], "Arco 1",
    "Um vilarejo de mineradores, perto das ruínas. A gente é teimosa e resistente, e já ouviu histórias do que existe nas minas.",
    { ganchos: ["Uma mina foi lacrada depois de um tremor estranho"],
      inimigos: ["Morcego-Cristal", "Verme das Rochas", "Golem de Entulho", "Guardião das Ruínas"],
      segredo: "O quarto infiltrado (o estudioso de ruínas) quer o que está dentro da mina lacrada." }),

  lo("campos", "Campos Atacados", "perigo", 478, 492, [16, 5, "start"], "Arco 1",
    "Plantações destruídas durante a noite. Os fazendeiros falam de pegadas enormes e de um barulho de coisa sendo cavada.",
    { ganchos: ["Montar uma emboscada à noite", "Seguir as pegadas até a toca"],
      inimigos: ["Javali de Mana", "Devorador de Colheitas"],
      segredo: "A toca do Devorador fica sob os campos, perto da Fenda de Mana que o atraiu.", ideia: true }),
  lo("navio", "Navio Silencioso", "misterio", 895, 258, [0, -18, "middle"], "Arco 1",
    "Um navio que atracou ao largo de Porto Salgado e de onde ninguém desceu. À noite, as luzes acendem sozinhas.",
    { ganchos: ["Investigar de barco à noite", "Conversar com os pescadores", "Descobrir de onde o navio veio"],
      inimigos: ["Marujo Afogado", "Serpente das Marés"],
      segredo: "A tripulação é formada por pessoas marcadas. Ideia: o navio faz a ponte entre a Ilha Nebulosa e o continente.", ideia: true }),
  lo("clareira", "Clareira do Cervo", "misterio", 175, 372, [-16, 5, "end"], "Arco 1",
    "No fundo da mata, uma clareira onde os caçadores desapareceram. Há rastros de um cervo gigante.",
    { ganchos: ["Seguir os rastros", "Encontrar o último acampamento dos caçadores"],
      inimigos: ["Cervo Ancestral", "Raposa Sombria"],
      segredo: "É onde os caçadores foram marcados num ritual. O cervo foi corrompido e agora sofre.", ideia: true }),
  lo("mina", "Mina Lacrada", "misterio", 342, 150, [-16, 4, "end"], "Arco 1",
    "Uma mina lacrada depois de um tremor estranho. Os mineiros juram que algo se mexe lá dentro.",
    { ganchos: ["Abrir o selo da mina", "Descobrir o que causou o tremor"],
      inimigos: ["Morcego-Cristal", "Verme das Rochas", "Golem de Entulho"],
      segredo: "Dentro está a Câmara Selada, que o estudioso quer usar.", ideia: true }),
  lo("ruinas", "Ruínas Antigas", "misterio", 402, 132, [0, 32, "middle"], "Arco 1",
    "Ruínas de uma civilização de magos, cobertas de símbolos que ninguém sabe ler. Um guardião protege a entrada.",
    { ganchos: ["Decifrar os símbolos", "Passar pelo guardião"],
      inimigos: ["Guardião das Ruínas"],
      segredo: "Os símbolos descrevem um ritual de controle de magos, a origem da marca.", ideia: true }),
  lo("cemiterio", "Cemitério de Grimórios", "misterio", 480, 112, [0, -20, "middle"], "Livre",
    "Onde repousam os grimórios dos magos que morreram. Lendas dizem que alguns ainda acordam quando alguém se aproxima.",
    { ganchos: ["Um jogador que perdeu o grimório", "Encontrar um grimório lendário (como o Antimagia)"],
      segredo: "Pode ser onde o Antimagia estava guardado, reservado para um momento-chave da história.", ideia: true }),
  lo("lago", "Lago Espelhado", "misterio", 640, 425, [0, 40, "middle"], "Livre",
    "Um lago tão parado que reflete o céu como um espelho. Dizem que quem olha o próprio reflexo vê o grimório que vai receber.",
    { ganchos: ["Uma cena de revelação para um jogador", "Um desafio ligado ao Grimório do Espelho"],
      segredo: "Sem segredo definido. Preencha como quiser.", ideia: true }),
  lo("torre", "Torre Quebrada", "misterio", 725, 108, [16, 5, "start"], "Arco 2",
    "Uma torre partida ao meio, na costa norte. A lenda diz que o primeiro grimório nasceu ali.",
    { ganchos: ["A história do primeiro mago", "Uma relíquia que a organização procura"],
      segredo: "Pode ter relação com o líder da organização ou com a origem da marca (a decidir).", ideia: true }),
  lo("ilha", "Ilha Nebulosa", "misterio", 935, 195, [0, -20, "middle"], "Arco 2",
    "Uma ilha escondida pela névoa, a leste. Os pescadores não se aproximam: navios que entram na névoa voltam sem lembrar de nada.",
    { ganchos: ["Uma expedição para entrar na névoa", "Descobrir quem vive ali"],
      segredo: "Ideia: é o Santuário da organização. Dali saem os marcados e é onde o líder prepara o ritual de controle.", ideia: true }),
  lo("cratera", "Cratera Silenciosa", "perigo", 755, 492, [0, 28, "middle"], "Arco final",
    "Uma cratera enorme no sudeste. Nenhum pássaro voa perto, e ninguém sabe o que a abriu.",
    { ganchos: ["Explorar a borda da cratera", "Um tremor que cresce a cada noite"],
      inimigos: ["Titã Corrompido"],
      segredo: "O Titã Corrompido dorme aqui. A organização pode despertá-lo como arma no arco final.", ideia: true }),

  lo("fenda", "Fenda de Mana", "secreto", 405, 505, [-16, -3, "end"], "Arco 1",
    "Um lugar que os jogadores ainda não conhecem.",
    { segredo: "Uma fenda escondida sob os campos do Vale, de onde vaza mana pura. Foi aqui que o primeiro infiltrado soltou a criatura.", ideia: true, secreto: true }),
  lo("camara", "Câmara Selada", "secreto", 330, 172, [18, 20, "start"], "Arco 2",
    "Um lugar que os jogadores ainda não conhecem.",
    { segredo: "Uma câmara sob a mina com um altar antigo. O estudioso quer usá-lo para fortalecer o ritual de controle.", ideia: true, secreto: true })
];

var REV_PADRAO = { "alta-lumen": true, "encruzilhada": true, "vale": true, "porto": true, "floresta": true, "pedra": true };
var ARCOS = ["Sessão 1", "Arco 1", "Arco 2", "Arco final", "Livre"];
function tabelaArcos() {
  return table(["Fase", "Locais"], ARCOS.map(function (a) {
    var ls = LOCAIS.filter(function (l) { return l.arco === a && (!l.secreto || camadaMestre()); });
    return [a, ls.map(function (l) { return l.nome; }).join(", ") || "-"];
  }));
}

/* ============================ SORTEIO ============================ */

var VAGAS_SORTEIO = ["cura", "tank", "tank", "suporte", "suporte", "dano", "dano", "dano"];
var VAGA_NOME = { tank: "Tank", cura: "Cura", suporte: "Suporte", dano: "Dano" };
var NOMES_CURA = ["Grimório de Luz Curativa", "Grimório das Raízes"];
var SELO_CORES = [["Vermelho", "#c0392b"], ["Azul", "#2a6fc9"], ["Verde", "#2e8b57"], ["Dourado", "#b8921f"], ["Roxo", "#7e57c2"], ["Prata", "#6f7b88"], ["Laranja", "#d9700f"], ["Turquesa", "#13899a"]];
var SELO_SIMBOLOS = [["Estrela", "estrela"], ["Brilho", "brilho"], ["Orbe", "orbe"], ["Olho", "olho"], ["Gota", "gota"], ["Vento", "vento"], ["Livro", "livro"], ["Escudo", "escudo"]];
var VILAS_PADRAO = ["Vale das Colheitas", "Vale das Colheitas", "Porto Salgado", "Porto Salgado", "Floresta dos Cedros", "Floresta dos Cedros", "Pedra Velha", "Pedra Velha"];
var sorteio = null, sorteioMsg = "", confirmarRefazer = false, confirmarApagar = false;
var cer = { ativa: false, i: 0, rev: false };

function achar(nome) { var r = null; GRIMORIOS.forEach(function (g) { if (g.nome === nome) r = g; }); return r; }
function embaralhar(a) {
  var b = a.slice();
  for (var i = b.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = b[i]; b[i] = b[j]; b[j] = t; }
  return b;
}
function escolher(lista) { return lista[Math.floor(Math.random() * lista.length)]; }

function novoSorteio() {
  var jog = [];
  for (var i = 0; i < 8; i++) jog.push({ nome: "Jogador " + (i + 1), vila: VILAS_PADRAO[i], cor: i, simb: i, vaga: "", grim: "" });
  return { jog: jog, res: [] };
}
function carregarSorteio() {
  var s = null;
  s = EST.sorteio ? JSON.parse(JSON.stringify(EST.sorteio)) : null;
  if (s && s.jog && s.jog.length === 8) { s.res = s.res || []; return s; }
  return novoSorteio();
}
function salvarSorteio() { EST.sorteio = sorteio; salvarEstado("sorteio"); }
function garantirSorteio() { if (sorteio === null) sorteio = carregarSorteio(); }
function sorteioFeito() { return sorteio.jog.every(function (p) { return p.grim; }); }

function poolDaVaga(vaga) {
  return GRIMORIOS.filter(function (g) {
    if (g.nome === "Grimório Antimagia" || g.reservado) return false;
    var cura = NOMES_CURA.indexOf(g.nome) !== -1;
    if (vaga === "tank") return g.papel === "Tank";
    if (vaga === "cura") return cura;
    if (vaga === "suporte") return g.papel === "Suporte" && !cura;
    return g.papel === "Dano";
  });
}
function atributosOk(lista) {
  var c = { poder: 0, destreza: 0, inteligencia: 0 };
  lista.forEach(function (g) { c[g.attr]++; });
  return c.poder >= 2 && c.destreza >= 2 && c.inteligencia >= 2;
}

function sortearGrupo() {
  for (var t = 0; t < 20000; t++) {
    /* Começa pela Cura (só há 2 opções) e vai filtrando elementos repetidos a cada vaga. */
    var res = [], nomes = {}, elems = {}, ok = true;
    for (var i = 0; i < VAGAS_SORTEIO.length; i++) {
      var opc = poolDaVaga(VAGAS_SORTEIO[i]).filter(function (g) { return !nomes[g.nome] && !elems[g.elem]; });
      if (!opc.length) { ok = false; break; }
      var g = escolher(opc);
      nomes[g.nome] = true; elems[g.elem] = true;
      res.push({ vaga: VAGAS_SORTEIO[i], g: g });
    }
    if (ok && atributosOk(res.map(function (x) { return x.g; }))) return res;
  }
  return null;
}

function sortearReservas(usados) {
  var nomes = {}, elems = {}, out = [];
  usados.forEach(function (g) { nomes[g.nome] = true; elems[g.elem] = true; });
  ["dano", "suporte"].forEach(function (vaga) {
    var pool = poolDaVaga(vaga).filter(function (g) { return !nomes[g.nome]; });
    var pref = pool.filter(function (g) { return !elems[g.elem]; });
    var lista = pref.length ? pref : pool;
    if (!lista.length) return;
    var g = escolher(lista);
    nomes[g.nome] = true; elems[g.elem] = true; out.push(g.nome);
  });
  return out;
}

function refazerJogador(i) {
  var p = sorteio.jog[i];
  var vaga = p.vaga || "dano";
  var usados = {}, elemsUsados = {}, outros = [];
  sorteio.jog.forEach(function (q, k) {
    if (k !== i && q.grim) { var g = achar(q.grim); usados[g.nome] = true; elemsUsados[g.elem] = true; outros.push(g); }
  });
  var pool = poolDaVaga(vaga).filter(function (g) { return !usados[g.nome] && g.nome !== p.grim; });
  var estrito = pool.filter(function (g) { return !elemsUsados[g.elem] && atributosOk(outros.concat([g])); });
  var lista = estrito, relaxou = false;
  if (!lista.length) lista = pool.filter(function (g) { return !elemsUsados[g.elem]; });
  if (!lista.length) { lista = pool; relaxou = true; }
  if (!lista.length) return "Não há mais grimórios disponíveis para a vaga de " + VAGA_NOME[vaga] + ".";
  var novo = escolher(lista);
  p.grim = novo.nome;
  sorteio.res = sorteio.res.filter(function (n) { return n !== novo.nome; });
  salvarSorteio();
  return "Novo grimório sorteado para " + p.nome + (relaxou ? ". As travas de elemento tiveram que ser relaxadas." : ".");
}

function seloHTML(cor, simb, grande, id) {
  var c = SELO_CORES[cor] || SELO_CORES[0], s = SELO_SIMBOLOS[simb] || SELO_SIMBOLOS[0];
  return '<span class="selo' + (grande ? " grande" : "") + '"' + (id ? ' id="' + id + '"' : "") + ' style="--selo:' + c[1] + '" title="Selo ' + c[0] + ", " + s[0] + '">' + ic(s[1]) + "</span>";
}

function checagemHTML() {
  var itens = [];
  function item(ok, txt) { itens.push('<li class="' + (ok ? "ck-ok" : "ck-aviso") + '">' + ic(ok ? "certo" : "alerta") + "<span>" + txt + "</span></li>"); }
  if (sorteioFeito()) {
    var gs = sorteio.jog.map(function (p) { return achar(p.grim); });
    var vagas = {};
    sorteio.jog.forEach(function (p) { vagas[p.vaga] = (vagas[p.vaga] || 0) + 1; });
    item((vagas.tank || 0) >= 2 && (vagas.cura || 0) >= 1, "Tanks: " + (vagas.tank || 0) + ". Cura: " + (vagas.cura || 0) + ". Suporte: " + (vagas.suporte || 0) + ". Dano: " + (vagas.dano || 0) + ".");
    var at = { poder: 0, destreza: 0, inteligencia: 0 };
    gs.forEach(function (g) { at[g.attr]++; });
    item(atributosOk(gs), "Poder: " + at.poder + ". Destreza: " + at.destreza + ". Inteligência: " + at.inteligencia + ".");
    var el = {}, rep = [];
    gs.forEach(function (g) { if (el[g.elem]) rep.push(g.elem); el[g.elem] = true; });
    item(!rep.length, rep.length ? "Elementos repetidos: " + rep.join(", ") + "." : "Nenhum elemento se repete.");
  } else {
    itens.push('<li class="ck-aviso">' + ic("alerta") + "<span>O sorteio ainda não foi feito.</span></li>");
  }
  var vilas = {};
  sorteio.jog.forEach(function (p) { vilas[p.vila] = (vilas[p.vila] || 0) + 1; });
  var okVilas = VILAREJOS.every(function (v) { return vilas[v.nome] === 2; });
  item(okVilas, okVilas ? "Dois jogadores em cada vilarejo." : "Vilarejos: " + VILAREJOS.map(function (v) { return v.nome + " " + (vilas[v.nome] || 0); }).join(", ") + ".");
  var selos = {}, dup = false;
  sorteio.jog.forEach(function (p) { var k = p.cor + "-" + p.simb; if (selos[k]) dup = true; selos[k] = true; });
  item(!dup, dup ? "Dois jogadores têm o mesmo selo." : "Todos os selos são diferentes.");
  return '<ul class="check-lista">' + itens.join("") + "</ul>";
}

function textoSorteio() {
  var linhas = ["SORTEIO DOS GRIMÓRIOS (secreto)", ""];
  sorteio.jog.forEach(function (p, i) {
    var g = p.grim ? achar(p.grim) : null;
    linhas.push((i + 1) + ". " + p.nome + " | " + p.vila + " | selo " + SELO_CORES[p.cor][0] + " " + SELO_SIMBOLOS[p.simb][0] + " | " +
      (g ? g.nome + " (" + VAGA_NOME[p.vaga] + ", " + ATTR[g.attr].nome + ", " + g.elem + ")" : "sem sorteio"));
  });
  linhas.push("");
  linhas.push("Reservas: " + (sorteio.res.length ? sorteio.res.join(", ") : "nenhuma"));
  linhas.push("Antimagia: reservado para a história.");
  return linhas.join("\n");
}

function cartaoJogador(p, i) {
  var g = p.grim ? achar(p.grim) : null;
  var h = '<section class="panel jog"><h3>Jogador ' + (i + 1) + "</h3>" +
    '<label>Nome<input class="sorteio-in" type="text" maxlength="40" data-j="' + i + '" data-campo="nome" value="' + esc(p.nome) + '"></label>' +
    '<label>Vilarejo<select class="sorteio-in" data-j="' + i + '" data-campo="vila">' + opcoes(VILAREJOS.map(function (v) { return v.nome; }), p.vila, false) + "</select></label>" +
    '<div class="selo-linha"><label>Cor<select class="sorteio-in" data-j="' + i + '" data-campo="cor">' + opcoes(SELO_CORES.map(function (c) { return c[0]; }), p.cor, true) + "</select></label>" +
    '<label>Símbolo<select class="sorteio-in" data-j="' + i + '" data-campo="simb">' + opcoes(SELO_SIMBOLOS.map(function (c) { return c[0]; }), p.simb, true) + "</select></label>" +
    seloHTML(p.cor, p.simb, false, "selo" + i) + "</div>" +
    '<div class="resultado">';
  if (g) {
    h += "<p><b>" + g.nome + '</b></p><div class="meta"><span class="tag role">' + VAGA_NOME[p.vaga] + '</span><span class="tag" style="--attr:' + ATTR[g.attr].cor + '">' + ic(ATTR_ICON[g.attr]) + ATTR[g.attr].nome + '</span><span class="tag role">' + g.elem + "</span></div>" +
      '<p><button type="button" data-refazer="' + i + '">Refazer só este</button></p>';
  } else {
    h += '<p class="mdica">Ainda sem grimório.</p>';
  }
  return h + "</div></section>";
}

function viewSorteio() {
  if (!mestreAberto) {
    return '<div class="lock"><h1>Sorteio dos grimórios</h1>' +
      "<p>Esta aba mostra o resultado secreto do sorteio. Abra só quando nenhum jogador estiver olhando a tela.</p>" +
      '<p><button type="button" class="primary" id="abrirMestre">Revelar o sorteio</button></p></div>';
  }
  garantirSorteio();
  if (cer.ativa) return viewCerimonia();
  var tudo = sorteioFeito();
  var h = "<h1>Sorteio dos grimórios</h1>" +
    '<p class="lead">Um sorteio dirigido e secreto: cada jogador recebe um resultado aleatório, mas o grupo sai equilibrado. O resultado só é revelado na cerimônia.</p>';
  h += '<div class="note"><p><b>Guarde uma cópia.</b> O resultado fica salvo na sua conta de mestre. Mesmo assim, copie o texto no fim da página e guarde no papel ou em outro lugar.</p></div>';
  h += panel(ic("estrela") + "Como o sorteio funciona",
    "<ul><li><b>8 vagas:</b> 2 de Tank, 1 de Cura, 2 de Suporte e 3 de Dano. Os jogadores não sabem disso.</li>" +
    "<li><b>Sem elemento repetido</b> no grupo, para as combinações de magias funcionarem.</li>" +
    "<li><b>Pelo menos 2 de cada atributo</b> (Poder, Destreza e Inteligência).</li>" +
    "<li>O <b>Antimagia fica de fora</b>, reservado para a história.</li>" +
    "<li>São sorteados também <b>2 reservas</b> (1 de Dano e 1 de Suporte), para o caso de alguém faltar.</li></ul>");
  h += '<div class="controls"><button type="button" class="primary" id="sortear">' +
    (tudo ? (confirmarRefazer ? "Clique de novo para refazer tudo" : "Refazer o sorteio inteiro") : "Sortear os grimórios") + "</button>" +
    '<button type="button" id="abrirCer"' + (tudo ? "" : " disabled") + ">" + ic("grupo") + "Modo cerimônia</button></div>";
  h += '<p id="sorteioMsg" role="status" class="mdica">' + esc(sorteioMsg) + "</p>";
  h += "<h2>Jogadores</h2>" + '<div class="cols">' + sorteio.jog.map(cartaoJogador).join("") + "</div>";
  h += "<h2>Conferência</h2>" + '<section class="panel" id="sorteioChecagem">' + checagemHTML() + "</section>";
  h += "<h2>Reservas</h2>" + panel(ic("livro") + "Para o caso de alguém faltar",
    sorteio.res.length ? "<ul>" + sorteio.res.map(function (n) { var g = achar(n); return "<li><b>" + n + "</b> (" + g.papel + ", " + ATTR[g.attr].nome + ", " + g.elem + ")</li>"; }).join("") + "</ul><p>Se a vaga que sair for de Tank ou de Cura, use “Refazer só este” no jogador dessa vaga.</p>" : "<p>Os reservas aparecem depois do sorteio.</p>");
  h += "<h2>Resultado em texto</h2>" + '<p><button type="button" id="copiarSorteio">Copiar resultado</button></p>' +
    '<textarea class="sorteio-texto" id="sorteioTexto" rows="14" readonly>' + esc(tudo ? textoSorteio() : "O sorteio ainda não foi feito.") + "</textarea>";
  h += '<p><button type="button" id="apagarSorteio">' + (confirmarApagar ? "Clique de novo para apagar tudo" : "Apagar o sorteio e os dados") + "</button></p>";
  return h;
}

function ordemCerimonia() {
  var idx = sorteio.jog.map(function (p, i) { return i; });
  var ordV = VILAREJOS.map(function (v) { return v.nome; });
  idx.sort(function (a, b) {
    var d = ordV.indexOf(sorteio.jog[a].vila) - ordV.indexOf(sorteio.jog[b].vila);
    return d !== 0 ? d : a - b;
  });
  return idx;
}

function viewCerimonia() {
  var ordem = ordemCerimonia(), n = ordem.length;
  var i = Math.max(0, Math.min(cer.i, n - 1));
  var p = sorteio.jog[ordem[i]], g = achar(p.grim);
  var h = '<div class="cer-topo"><span>' + (i + 1) + " de " + n + '</span><button type="button" id="cerSair">Sair do modo cerimônia</button></div>';
  h += '<section class="panel cer">' + seloHTML(p.cor, p.simb, true) + "<h2>" + esc(p.nome) + "</h2><p>" + esc(p.vila) + "</p>";
  if (!cer.rev) h += '<p class="mdica">O grimório está virado para baixo.</p><p><button type="button" class="primary" id="cerRev">Revelar o grimório</button></p>';
  else h += '<div class="cer-card">' + bookCard(g, true) + "</div>";
  h += "</section>";
  h += '<div class="controls"><button type="button" id="cerPrev"' + (i === 0 ? " disabled" : "") + '>Anterior</button><button type="button" id="cerNext"' + (i === n - 1 ? " disabled" : "") + ">Próximo</button></div>";
  return h;
}

function salvarCampo(el) {
  var i = parseInt(el.dataset.j, 10), campo = el.dataset.campo;
  if (isNaN(i) || !sorteio || !sorteio.jog[i]) return;
  var v = el.value;
  if (campo === "cor" || campo === "simb") v = parseInt(v, 10) || 0;
  sorteio.jog[i][campo] = v;
  salvarSorteio();
  var s = document.getElementById("selo" + i);
  if (s) {
    var p = sorteio.jog[i];
    s.style.setProperty("--selo", (SELO_CORES[p.cor] || SELO_CORES[0])[1]);
    s.innerHTML = ic((SELO_SIMBOLOS[p.simb] || SELO_SIMBOLOS[0])[1]);
  }
  var c = document.getElementById("sorteioChecagem");
  if (c) c.innerHTML = checagemHTML();
  var t = document.getElementById("sorteioTexto");
  if (t && sorteioFeito()) t.value = textoSorteio();
}

function acoesSorteio(b) {
  var id = b.id;
  var ehSorteio = id === "sortear" || id === "abrirCer" || id === "copiarSorteio" || id === "apagarSorteio" || id === "cerSair" || id === "cerRev" || id === "cerPrev" || id === "cerNext" || b.dataset.refazer !== undefined;
  if (!ehSorteio) return false;
  garantirSorteio();
  if (id === "sortear") {
    if (sorteioFeito() && !confirmarRefazer) {
      confirmarRefazer = true;
      sorteioMsg = "Isso apaga o resultado atual. Clique de novo para confirmar.";
      renderizar();
      setTimeout(function () { confirmarRefazer = false; }, 6000);
      return true;
    }
    confirmarRefazer = false;
    var res = sortearGrupo();
    if (!res) { sorteioMsg = "Não foi possível montar um grupo com as travas. Tente de novo."; renderizar(); return true; }
    var ordem = embaralhar(res);
    sorteio.jog.forEach(function (p, i) { p.vaga = ordem[i].vaga; p.grim = ordem[i].g.nome; });
    sorteio.res = sortearReservas(ordem.map(function (x) { return x.g; }));
    salvarSorteio();
    sorteioMsg = "Sorteio feito. O resultado está salvo na sua conta.";
    renderizar();
    return true;
  }
  if (b.dataset.refazer !== undefined) {
    sorteioMsg = refazerJogador(parseInt(b.dataset.refazer, 10));
    renderizar();
    return true;
  }
  if (id === "abrirCer") { cer.ativa = true; cer.i = 0; cer.rev = false; renderizar(); window.scrollTo(0, 0); return true; }
  if (id === "cerSair") { cer.ativa = false; renderizar(); window.scrollTo(0, 0); return true; }
  if (id === "cerRev") { cer.rev = true; renderizar(); return true; }
  if (id === "cerPrev") { cer.i = Math.max(0, cer.i - 1); cer.rev = false; renderizar(); window.scrollTo(0, 0); return true; }
  if (id === "cerNext") { cer.i = Math.min(7, cer.i + 1); cer.rev = false; renderizar(); window.scrollTo(0, 0); return true; }
  if (id === "copiarSorteio") {
    var ta = document.getElementById("sorteioTexto"), msg = document.getElementById("sorteioMsg");
    if (ta) ta.select();
    var ok = function () { if (msg) msg.textContent = "Resultado copiado."; };
    var falha = function () { if (msg) msg.textContent = "Não consegui copiar sozinho. O texto está selecionado: copie com Ctrl+C ou pelo menu do celular."; };
    try { navigator.clipboard.writeText(textoSorteio()).then(ok, falha); } catch (e) { falha(); }
    return true;
  }
  if (id === "apagarSorteio") {
    if (!confirmarApagar) {
      confirmarApagar = true;
      sorteioMsg = "Isso apaga o sorteio, os nomes e os selos. Clique de novo para confirmar.";
      renderizar();
      setTimeout(function () { confirmarApagar = false; }, 6000);
      return true;
    }
    confirmarApagar = false;
    sorteio = novoSorteio();
    salvarSorteio();
    sorteioMsg = "Tudo foi apagado.";
    renderizar();
    return true;
  }
  return false;
}

/* ============================ JOGADORES ============================ */

var MORAL_ETICA = [["leal", "Leal"], ["neutro", "Neutro"], ["caotico", "Caótico"]];
var MORAL_LINHAS = ["bom", "neutro", "mau"];
var jogs = null, jogSel = null, jogMsg = "", confirmarExcluirJog = false, confirmarDelObs = "";

function idNovo() { return "j" + Date.now().toString(36) + Math.floor(Math.random() * 46656).toString(36); }
function moralNome(etica, moral) {
  if (!etica || !moral) return "";
  if (etica === "neutro" && moral === "neutro") return "Neutro";
  var e = { leal: "Leal", neutro: "Neutro", caotico: "Caótico" }[etica];
  var m = { bom: "bom", neutro: "neutro", mau: "mau" }[moral];
  return e + " e " + m;
}
function novoJog(extra) {
  return extras({ id: idNovo(), nome: "", personagem: "", vila: "", altura: "", descricao: "", sonho: "", medo: "", etica: "", moral: "", obs: [], img: null, nivel: 1, atr: null, bonus: null, atrTravado: false, grim: "", grimRev: false, criado: new Date().toISOString() }, extra);
}
/* Texto digitado é gravado alguns instantes depois da última tecla; o resto, na hora.
   Só vão os campos alterados (chaves), para não apagar o que o jogador editou no Perfil dele.
   Sem chaves, vai o perfil inteiro (jogador novo). */
var jogSujos = {};
function salvarJog(j, agora, chaves) {
  var sujo = jogSujos[j.id] || (jogSujos[j.id] = {});
  (chaves || Object.keys(j)).forEach(function (k) { if (k !== "id" && k !== "usuario") sujo[k] = true; });
  var f = function () {
    var campos = { id: j.id };
    Object.keys(jogSujos[j.id] || {}).forEach(function (k) { campos[k] = j[k] === undefined ? null : j[k]; });
    delete jogSujos[j.id];
    return gravar("jogador_salvar", { jogador: campos });
  };
  if (!agora) { adiar("jog-" + j.id, f); return null; }
  clearTimeout(timers["jog-" + j.id]);
  delete timers["jog-" + j.id];
  return f();
}
function garantirJogs() { if (jogs === null) jogs = []; }
/* Quem já tem este grimório (outro jogador que não `exceto`), ou null. Cada jogador tem um grimório só. */
function donoGrim(nome, exceto) { var r = null; (jogs || []).forEach(function (q) { if (q.grim === nome && q.id !== exceto) r = q; }); return r; }
function achaJog(id) { var r = null; (jogs || []).forEach(function (j) { if (j.id === id) r = j; }); return r; }
function getImg(id) { var j = achaJog(id); return j && j.img ? imgUrl(j.img) : ""; }
function contaNome(uid) {
  var r = null;
  CONTAS.forEach(function (c) { if (c.id === uid) r = c; });
  return r;
}

function dataBr(iso) {
  try { return new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }); } catch (e) { return String(iso).slice(0, 10); }
}

function avatarJog(j, grande) {
  var url = getImg(j.id);
  var cls = "pj-avatar" + (grande ? " grande" : "");
  if (url) return '<img class="' + cls + '" src="' + url + '" alt="Imagem de ' + esc(j.personagem || j.nome || "jogador") + '">';
  return '<span class="' + cls + ' vazio" aria-hidden="true">' + ic("grupo") + "</span>";
}

function cardJog(j) {
  var tags = "";
  if (j.vila) tags += '<span class="tag role">' + esc(j.vila) + "</span>";
  if (j.altura) tags += '<span class="tag role">' + esc(j.altura) + "</span>";
  if (j.etica && j.moral) tags += '<span class="tag role">' + moralNome(j.etica, j.moral) + "</span>";
  var c = j.usuario ? contaNome(j.usuario) : null;
  tags += '<span class="tag role">' + ic("cadeado") + (c ? "Conta: " + esc(c.nome) : "Sem conta") + "</span>";
  if (j.grim) tags += '<span class="tag role">' + ic("livro") + (j.grimRev ? "Grimório revelado" : "Grimório oculto") + "</span>";
  var n = (j.obs || []).length;
  return '<button type="button" class="pj-card" data-jid="' + j.id + '">' + avatarJog(j, false) +
    '<span class="pj-info"><b>' + esc(j.personagem || "Sem nome de personagem") + "</b><small>" + esc(j.nome || "Jogador sem nome") + '</small><span class="meta">' + tags + "</span>" +
    "<small>" + n + (n === 1 ? " observação" : " observações") + "</small></span></button>";
}

function moralGrid(j) {
  var h = '<div class="moral-grid" role="group" aria-label="Moralidade">';
  MORAL_LINHAS.forEach(function (l) {
    MORAL_ETICA.forEach(function (c) {
      var sel = j.etica === c[0] && j.moral === l;
      h += '<button type="button" data-etica="' + c[0] + '" data-moral="' + l + '" aria-pressed="' + sel + '">' + moralNome(c[0], l) + "</button>";
    });
  });
  return h + "</div>";
}

function viewJogadores() {
  if (!mestreAberto) {
    return '<div class="lock"><h1>Jogadores</h1>' +
      "<p>Esta aba tem as suas anotações sobre cada jogador: sonhos, medos e observações. Abra só quando nenhum jogador estiver olhando a tela.</p>" +
      '<p><button type="button" class="primary" id="abrirMestre">Abrir as anotações</button></p></div>';
  }
  garantirJogs();
  if (jogSel) {
    var atual = achaJog(jogSel);
    if (atual) return viewJogador(atual);
    jogSel = null;
  }
  var h = "<h1>Jogadores</h1>" +
    '<p class="lead">Um perfil para cada jogador: imagem, descrição, sonho, medo, moralidade e observações que você vai somando a cada sessão.</p>' +
    '<div class="note"><p><b>Tudo fica salvo na sua conta.</b> As anotações, as observações e as imagens vão para o banco de dados. Os jogadores não veem nada desta aba.</p></div>' +
    '<div class="controls"><button type="button" class="primary" id="novoJog">Adicionar jogador</button>' +
    '<button type="button" id="importarJog">Importar do sorteio</button>' +
    '<button type="button" id="copiarJogs"' + (jogs.length ? "" : " disabled") + ">Copiar anotações</button>" +
    '<button type="button" id="expPerfis"' + (jogs.length ? "" : " disabled") + ' title="Descrição, sonho, medo, moralidade e respostas do questionário de todos, num texto só">Copiar perfis</button>' +
    '<button type="button" id="expPerfisTxt"' + (jogs.length ? "" : " disabled") + ">Baixar perfis (.txt)</button></div>" +
    '<p id="jogMsg" role="status" class="mdica">' + esc(jogMsg) + "</p>";
  if (!jogs.length) {
    h += '<div class="empty">Nenhum jogador ainda. Adicione um por um, ou importe os nomes e vilarejos do sorteio.</div>';
  } else {
    h += '<div class="pj-lista">' + jogs.map(cardJog).join("") + "</div>";
  }
  h += "<h2>Contas cadastradas</h2>" + '<p class="mdica">Cada jogador cria a própria conta na tela de entrada. Depois, abra o perfil do personagem e escolha a conta dele. A lista se atualiza sempre que você abre esta aba.</p>';
  var contas = CONTAS.filter(function (c) { return c.papel !== "mestre"; });
  if (!contas.length) return h + '<div class="empty">Nenhuma conta de jogador ainda.</div>';
  return h + table(["Nome", "E-mail", "Personagem"], contas.map(function (c) {
    var j = null;
    jogs.forEach(function (q) { if (q.usuario === c.id) j = q; });
    return [esc(c.nome), esc(c.email), j ? esc(j.personagem || j.nome || "Sem nome") : "<i>Sem personagem</i>"];
  }));
}

function viewJogador(j) {
  var h = '<div class="cer-topo"><button type="button" id="voltarJog">Voltar à lista</button>' +
    '<button type="button" id="expPerfil" title="Descrição, sonho, medo, moralidade e respostas do questionário, num texto só">Copiar perfil</button><button type="button" id="expPerfilTxt">Baixar perfil (.txt)</button>' +
    '<button type="button" id="excluirJog">' + (confirmarExcluirJog ? "Clique de novo para excluir" : "Excluir jogador") + "</button></div>";
  h += "<h1>" + esc(j.personagem || j.nome || "Novo jogador") + "</h1>";
  h += '<p id="jogMsg" role="status" class="mdica">' + esc(jogMsg) + "</p>";
  h += '<div class="pj-form"><div class="pj-lado">' + avatarJog(j, true) +
    '<p class="pj-botoes"><input type="file" accept="image/*" class="vh" id="jogImg"><label class="btn" for="jogImg">' + (getImg(j.id) ? "Trocar imagem" : "Escolher imagem") + "</label>" +
    (getImg(j.id) ? '<button type="button" id="removerImg">Remover</button>' : "") + "</p>" +
    '<p class="mdica">A imagem é reduzida e salva na sua conta. O jogador vê o próprio retrato.</p></div>';
  h += '<div class="pj-campos">' +
    '<label>Nome do jogador<input class="sorteio-in" type="text" maxlength="60" data-jf="nome" value="' + esc(j.nome) + '"></label>' +
    '<label>Nome do personagem<input class="sorteio-in" type="text" maxlength="60" data-jf="personagem" value="' + esc(j.personagem) + '"></label>' +
    '<label>Vilarejo<select class="sorteio-in" data-jf="vila"><option value="">Sem vilarejo</option>' + opcoes(VILAREJOS.map(function (v) { return v.nome; }), j.vila, false) + "</select></label>" +
    '<label>Altura<input class="sorteio-in" type="text" maxlength="20" placeholder="ex.: 1,72 m" data-jf="altura" value="' + esc(j.altura || "") + '"></label>' +
    fichaJog(j) + questionarioJog(j) +
    '<label>Descrição<textarea class="sorteio-in" rows="4" data-jf="descricao">' + esc(j.descricao) + "</textarea></label>" +
    '<label>Sonho ou objetivo<textarea class="sorteio-in" rows="3" data-jf="sonho">' + esc(j.sonho) + "</textarea></label>" +
    '<label>Medo ou fraqueza<textarea class="sorteio-in" rows="3" data-jf="medo">' + esc(j.medo) + "</textarea></label>" +
    acessoJog(j) +
    '<div class="pj-moral"><p class="pj-rotulo">Moralidade' + (j.etica && j.moral ? ": <b>" + moralNome(j.etica, j.moral) + "</b>" : "") + "</p>" + moralGrid(j) +
    '<p class="mdica">Toque de novo na opção escolhida para limpar.</p></div></div></div>';
  h += '<p><button type="button" data-invir="' + j.id + '">' + ic("mochila") + " Ver e editar o inventário (" + (j.inv || []).length + ")</button></p>";
  h += "<h2>Observações</h2>" +
    '<section class="panel"><label class="pj-obs-l">Contexto (opcional, por exemplo: Sessão 1)<input class="sorteio-in" type="text" maxlength="60" id="obsRotulo"></label>' +
    '<label class="pj-obs-l">Nova observação<textarea class="sorteio-in" rows="3" id="obsTexto"></textarea></label>' +
    '<button type="button" class="primary" id="addObs">Adicionar observação</button></section>';
  var obs = (j.obs || []).slice().sort(function (a, b) { return a.data < b.data ? 1 : -1; });
  if (!obs.length) h += '<div class="empty">Ainda sem observações.</div>';
  obs.forEach(function (o) {
    h += '<article class="panel pj-obs"><div class="pj-obs-topo"><span>' + (o.rotulo ? "<b>" + esc(o.rotulo) + "</b> " : "") + "<small>" + dataBr(o.data) + "</small></span>" +
      '<button type="button" data-delobs="' + o.id + '">' + (confirmarDelObs === o.id ? "Clique de novo" : "Excluir") + "</button></div>" +
      '<textarea class="sorteio-in" rows="3" data-obs="' + o.id + '" aria-label="Observação">' + esc(o.texto) + "</textarea></article>";
  });
  return h;
}

/* Ficha do jogador, editável pelo mestre: nível, base (travada para o jogador depois de salva) e bônus. */
function fichaJog(j) {
  var n = nivelJog(j);
  return '<fieldset class="pj-acesso"><legend>Ficha (atributos)</legend>' +
    '<label>Nível<select class="sorteio-in" data-jf="nivel">' + [1, 2, 3, 4, 5].map(function (v) { return '<option value="' + v + '"' + (v === n ? " selected" : "") + ">Nível " + v + "</option>"; }).join("") + "</select></label>" +
    '<div class="scroll"><table><thead><tr><th>Atributo</th><th>Base</th><th>Bônus</th><th>Total</th></tr></thead><tbody>' + ATRS.map(function (a) {
      return "<tr><td>" + a[1] + '</td><td><input class="sorteio-in num" type="number" min="0" max="10" data-jatr="' + a[0] + '" value="' + atrBase(j, a[0]) + '"></td>' +
        '<td><input class="sorteio-in num" type="number" min="-5" max="10" data-jbonus="' + a[0] + '" value="' + atrBonus(j, a[0]) + '"></td><td><b>' + sinal(atrTotal(j, a[0])) + "</b></td></tr>";
    }).join("") + "</tbody></table></div>" +
    '<label>Caminho de mana<select class="sorteio-in" data-jf="caminho"><option value="">Nenhum</option>' + CAMINHOS.map(function (c) { return '<option value="' + c.id + '"' + (j.caminho === c.id ? " selected" : "") + ">" + c.nome + "</option>"; }).join("") + "</select></label>" +
    '<label>Técnicas aprendidas<select class="sorteio-in" data-jf="caminhoTec">' + [0, 1, 2, 3].map(function (v) { return '<option value="' + v + '"' + (String(j.caminhoTec || 0) === String(v) ? " selected" : "") + ">" + v + " de 3</option>"; }).join("") + "</select></label>" +
    '<label class="rev-label"><input type="checkbox" data-jtrav="1"' + (j.atrTravado ? " checked" : "") + '> Atributos travados (o jogador não altera mais a base)</label>' +
    '<p class="mdica">Defesa ' + (10 + atrTotal(j, "destreza")) + ", redução de dano " + reducaoDano(j) + ", deslocamento " + (6 + Math.floor(atrTotal(j, "destreza") / 2)) + ", vida " + VIDA_NIVEL[n - 1] + ", mana " + manaJog(j) + '. Desmarque “travados” para o jogador redistribuir os 5 pontos, se precisar corrigir.</p></fieldset>';
}

function acessoJog(j) {
  var outros = {};
  jogs.forEach(function (q) { if (q.usuario && q.id !== j.id) outros[q.usuario] = q.personagem || q.nome || "outro personagem"; });
  var contas = CONTAS.filter(function (c) { return c.papel !== "mestre"; });
  return '<fieldset class="pj-acesso"><legend>Acesso do jogador</legend>' +
    '<label>Conta do jogador<select class="sorteio-in" data-jconta="1"><option value="">Nenhuma</option>' +
    contas.map(function (c) {
      return '<option value="' + c.id + '"' + (j.usuario === c.id ? " selected" : "") + ">" + esc(c.nome + " (" + c.email + ")" + (outros[c.id] ? ", ligada a " + outros[c.id] : "")) + "</option>";
    }).join("") + "</select></label>" +
    '<label>Grimório<select class="sorteio-in" data-jf="grim"><option value="">Sem grimório</option>' + GRIMORIOS.map(function (g) {
      var dono = donoGrim(g.nome, j.id);
      return '<option value="' + esc(g.nome) + '"' + (g.nome === j.grim ? " selected" : "") + (dono ? " disabled" : "") + ">" + esc(g.nome) + (dono ? " (já com " + esc(dono.personagem || dono.nome || "outro jogador") + ")" : "") + "</option>";
    }).join("") + "</select></label>" +
    '<label class="rev-label"><input type="checkbox" data-jgrimrev="1"' + (j.grimRev ? " checked" : "") + (j.grim ? "" : " disabled") + "> Revelar o grimório ao jogador</label>" +
    '<p class="mdica">O jogador vê só o próprio perfil (sem as observações nem a moralidade) e o próprio grimório, com os feitiços que você liberar na aba Grimórios.</p></fieldset>';
}

function vincularConta(el) {
  var j = achaJog(jogSel);
  if (!j) return;
  var uid = el.value ? parseInt(el.value, 10) : null;
  jogs.forEach(function (q) { if (uid && q.usuario === uid) q.usuario = null; });
  j.usuario = uid;
  /* Grava o perfil antes, para o vínculo achar o jogador no banco. */
  var antes = salvarJog(j, true, []) || Promise.resolve(true);
  antes.then(function (r) { if (r) gravar("jogador_vincular", { id: j.id, usuario: uid }); });
}

/* Respostas do questionário do grimório, em linhas de texto (usado nos textos copiados). */
function linhasQuestionario(j) {
  var r = j.questionario && j.questionario.r;
  if (!r || !r.length) return ["Questionário do grimório: (não respondido)"];
  var out = ["Questionário do grimório:"];
  r.forEach(function (letra, i) {
    var q = typeof QUESTOES !== "undefined" ? QUESTOES[i] : null, k = "ABCD".indexOf(letra);
    out.push((i + 1) + ". " + (q ? q.p : "Pergunta " + (i + 1)) + " " + letra + (q && q.o[k] ? ") " + q.o[k] : ""));
  });
  return out;
}

/* Texto único de cada personagem: vilarejo, descrição, sonho, medo e moralidade. */
function textoPerfis(lista) {
  var out = [];
  lista.forEach(function (j) {
    out.push("PERSONAGEM: " + (j.personagem || "Sem nome") + (j.nome ? " (jogador: " + j.nome + ")" : ""));
    out.push("Vilarejo: " + (j.vila || "(não definido)"));
    out.push("Descrição: " + (j.descricao || "(não preenchida)"));
    out.push("Sonho ou objetivo: " + (j.sonho || "(não preenchido)"));
    out.push("Medo ou fraqueza: " + (j.medo || "(não preenchido)"));
    out.push("Moralidade: " + (j.etica && j.moral ? moralNome(j.etica, j.moral) : "(não definida)"));
    linhasQuestionario(j).forEach(function (l) { out.push(l); });
    out.push("");
  });
  return out.join("\n").replace(/\s+$/, "") + "\n";
}
function exportarPerfis(b) {
  var um = b.id === "expPerfil" || b.id === "expPerfilTxt", baixar = /Txt$/.test(b.id);
  var j = um && jogSel ? achaJog(jogSel) : null;
  var lista = um ? (j ? [j] : []) : jogs;
  var msg = document.getElementById("jogMsg");
  if (!lista.length) { if (msg) msg.textContent = "Não há perfil para exportar."; return; }
  var texto = textoPerfis(lista);
  if (baixar) {
    try {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([texto], { type: "text/plain;charset=utf-8" }));
      a.download = um ? "perfil-" + String(j.personagem || "personagem").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + ".txt" : "perfis-dos-jogadores.txt";
      document.body.appendChild(a); a.click(); a.remove();
      if (msg) msg.textContent = "Arquivo gerado.";
    } catch (e) { if (msg) msg.textContent = "Não consegui gerar o arquivo. Use o botão de copiar."; }
    return;
  }
  var ok = function () { if (msg) msg.textContent = (um ? "Perfil" : lista.length + " perfis") + " copiado" + (um ? "" : "s") + "."; };
  var falha = function () { if (msg) msg.textContent = "Não consegui copiar sozinho. Tente o botão de baixar o arquivo."; };
  try { navigator.clipboard.writeText(texto).then(ok, falha); } catch (e) { falha(); }
}

function textoJogs() {
  var out = ["ANOTAÇÕES DOS JOGADORES", ""];
  jogs.forEach(function (j, i) {
    out.push((i + 1) + ". " + (j.personagem || "Sem nome") + " (jogador: " + (j.nome || "sem nome") + ")");
    if (j.vila) out.push("Vilarejo: " + j.vila);
    if (j.altura) out.push("Altura: " + j.altura);
    if (j.etica && j.moral) out.push("Moralidade: " + moralNome(j.etica, j.moral));
    if (j.descricao) out.push("Descrição: " + j.descricao);
    if (j.sonho) out.push("Sonho ou objetivo: " + j.sonho);
    if (j.medo) out.push("Medo ou fraqueza: " + j.medo);
    if (j.questionario && j.questionario.r) linhasQuestionario(j).forEach(function (l) { out.push(l); });
    (j.obs || []).slice().sort(function (a, b) { return a.data < b.data ? -1 : 1; }).forEach(function (o) {
      out.push("- " + dataBr(o.data) + (o.rotulo ? " [" + o.rotulo + "]" : "") + ": " + o.texto);
    });
    out.push("");
  });
  return out.join("\n");
}

function salvarCampoJog(el) {
  if (!jogSel || !jogs) return;
  var j = achaJog(jogSel);
  if (!j) return;
  if (el.dataset.jf) {
    if (el.dataset.jf === "grim" && el.value && donoGrim(el.value, j.id)) {
      /* Um grimório por jogador: recusa e volta para o que ele tinha. */
      jogMsg = "O " + el.value + " já está com " + (donoGrim(el.value, j.id).personagem || "outro jogador") + ". Cada jogador tem um grimório só.";
      renderizar();
      return;
    }
    j[el.dataset.jf] = el.value;
    if (el.dataset.jf === "grim") {
      if (!el.value) j.grimRev = false;
      salvarJog(j, true, ["grim", "grimRev"]);
      var cb = document.querySelector("[data-jgrimrev]");
      if (cb) { cb.disabled = !el.value; cb.checked = !!j.grimRev; }
      return;
    }
    salvarJog(j, false, [el.dataset.jf]);
  }
  else if (el.dataset.obs) {
    (j.obs || []).forEach(function (o) { if (o.id === el.dataset.obs) o.texto = el.value; });
    salvarJog(j, false, ["obs"]);
  }
}

function importarImagem(input) {
  var f = input.files && input.files[0];
  var j = achaJog(jogSel);
  if (!f || !j) return;
  jogMsg = "Enviando a imagem…";
  renderizar();
  reduzirImagem(f, 480, 200000, function (erro, url) {
    if (erro) { jogMsg = erro; renderizar(); return; }
    gravar("img_enviar", { tipo: "avatar", ref: j.id, dados: url }).then(function (r) {
      if (!r) { jogMsg = "Não foi possível salvar a imagem. Tente de novo."; renderizar(); return; }
      IMAGENS = IMAGENS.filter(function (i) { return !(i.tipo === "avatar" && i.ref === j.id); });
      IMAGENS.push({ id: r.id, tipo: "avatar", ref: j.id, titulo: "", liberado: false });
      j.img = r.id;
      salvarJog(j, true, ["img"]);
      jogMsg = "Imagem salva.";
      renderizar();
    });
  });
}

function acoesJog(b) {
  var id = b.id;
  var lista = ["novoJog", "importarJog", "voltarJog", "excluirJog", "addObs", "removerImg", "copiarJogs", "expPerfis", "expPerfisTxt", "expPerfil", "expPerfilTxt"];
  var ehJog = lista.indexOf(id) !== -1 || b.dataset.jid !== undefined || b.dataset.delobs !== undefined || b.dataset.moral !== undefined;
  if (!ehJog) return false;
  garantirJogs();
  var j = jogSel ? achaJog(jogSel) : null;
  if (id !== "excluirJog") confirmarExcluirJog = false;
  if (b.dataset.delobs === undefined) confirmarDelObs = "";

  if (id === "novoJog") {
    var n = novoJog();
    jogs.push(n); salvarJog(n, true);
    jogSel = n.id; jogMsg = "Jogador criado. As mudanças são salvas sozinhas.";
    renderizar(); window.scrollTo(0, 0); return true;
  }
  if (id === "importarJog") {
    garantirSorteio();
    var novos = 0;
    sorteio.jog.forEach(function (p) {
      var existe = jogs.some(function (q) { return q.nome === p.nome && q.vila === p.vila; });
      if (!existe) { var q = novoJog({ nome: p.nome, vila: p.vila }); jogs.push(q); salvarJog(q, true); novos++; }
    });
    jogMsg = novos ? novos + " jogadores importados do sorteio (nome e vilarejo, sem o grimório)." : "Os jogadores do sorteio já estão na lista.";
    renderizar(); return true;
  }
  if (b.dataset.jid !== undefined) { jogSel = b.dataset.jid; jogMsg = ""; renderizar(); window.scrollTo(0, 0); return true; }
  if (id === "voltarJog") { jogSel = null; jogMsg = ""; renderizar(); window.scrollTo(0, 0); return true; }
  if (id === "excluirJog" && j) {
    if (!confirmarExcluirJog) { confirmarExcluirJog = true; jogMsg = "Isso apaga o jogador, a imagem e as observações. Clique de novo para confirmar."; renderizar(); return true; }
    confirmarExcluirJog = false;
    jogs = jogs.filter(function (q) { return q.id !== j.id; });
    clearTimeout(timers["jog-" + j.id]);
    delete timers["jog-" + j.id];
    IMAGENS = IMAGENS.filter(function (i) { return !(i.tipo === "avatar" && i.ref === j.id); });
    gravar("jogador_excluir", { id: j.id });
    jogSel = null; jogMsg = "Jogador excluído.";
    renderizar(); window.scrollTo(0, 0); return true;
  }
  if (id === "removerImg" && j) {
    if (j.img) gravar("img_excluir", { id: j.img });
    IMAGENS = IMAGENS.filter(function (i) { return i.id !== j.img; });
    j.img = null;
    salvarJog(j, true, ["img"]); jogMsg = "Imagem removida."; renderizar(); return true;
  }
  if (b.dataset.moral !== undefined && j) {
    var igual = j.etica === b.dataset.etica && j.moral === b.dataset.moral;
    j.etica = igual ? "" : b.dataset.etica;
    j.moral = igual ? "" : b.dataset.moral;
    salvarJog(j, true, ["etica", "moral"]); renderizar(); return true;
  }
  if (id === "addObs" && j) {
    var t = document.getElementById("obsTexto"), rt = document.getElementById("obsRotulo");
    var texto = t ? t.value.trim() : "";
    if (!texto) { jogMsg = "Escreva a observação antes de adicionar."; renderizar(); return true; }
    j.obs = j.obs || [];
    j.obs.push({ id: idNovo(), data: new Date().toISOString(), rotulo: rt ? rt.value.trim() : "", texto: texto });
    salvarJog(j, true, ["obs"]); jogMsg = "Observação adicionada.";
    renderizar(); return true;
  }
  if (b.dataset.delobs !== undefined && j) {
    if (confirmarDelObs !== b.dataset.delobs) { confirmarDelObs = b.dataset.delobs; renderizar(); return true; }
    j.obs = (j.obs || []).filter(function (o) { return o.id !== b.dataset.delobs; });
    confirmarDelObs = "";
    salvarJog(j, true, ["obs"]); jogMsg = "Observação excluída.";
    renderizar(); return true;
  }
  if (id === "expPerfis" || id === "expPerfisTxt" || id === "expPerfil" || id === "expPerfilTxt") { exportarPerfis(b); return true; }
  if (id === "copiarJogs") {
    var msg = document.getElementById("jogMsg");
    var texto2 = textoJogs();
    var ok = function () { if (msg) msg.textContent = "Anotações copiadas."; };
    var falha = function () { if (msg) msg.textContent = "Não consegui copiar sozinho. Tente de novo em um navegador que permita copiar."; };
    try { navigator.clipboard.writeText(texto2).then(ok, falha); } catch (e) { falha(); }
    return true;
  }
  return false;
}

/* ============================ IMAGENS DO MAPA ============================ */

function enviarImagem(input, tipo, ref) {
  var f = input.files && input.files[0];
  if (!f) return;
  var max = tipo === "mapa" ? 2400 : 1600, limite = tipo === "mapa" ? 2600000 : 1200000;
  statusSalvo("Preparando a imagem…", "salvando");
  reduzirImagem(f, max, limite, function (erro, url) {
    if (erro) { statusSalvo(erro, "falha"); return; }
    var titulo = tipo === "mapa" ? f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ") : "";
    gravar("img_enviar", { tipo: tipo, ref: ref, titulo: titulo, dados: url }).then(function (r) {
      if (!r) return;
      if (tipo !== "mapa") IMAGENS = IMAGENS.filter(function (i) { return !(i.tipo === tipo && i.ref === ref); });
      IMAGENS.push({ id: r.id, tipo: tipo, ref: ref, titulo: titulo, liberado: false });
      renderizar();
    });
  });
}

function acharImg(id) { var r = null; IMAGENS.forEach(function (i) { if (i.id === id) r = i; }); return r; }

function excluirImg(id) {
  if (confirmarDelImg !== id) {
    confirmarDelImg = id;
    renderizar();
    setTimeout(function () { if (confirmarDelImg === id) { confirmarDelImg = 0; renderizar(); } }, 6000);
    return;
  }
  confirmarDelImg = 0;
  gravar("img_excluir", { id: id }).then(function (r) {
    if (!r) return;
    IMAGENS = IMAGENS.filter(function (i) { return i.id !== id; });
    renderizar();
  });
}

/* ============================ CONTEÚDO SÓ DO MESTRE ============================ */

function viewNiveisMestre() {
  var h = "<h1>Níveis e evolução</h1>" +
    '<p class="lead">Sem pontos de experiência. Todos os personagens sobem de nível juntos, em marcos da história. Assim ninguém fica para trás, e com 8 jogadores você não precisa controlar nada.</p>';

  h += "<h2>Tabela de níveis</h2>" + table(["Nível", "Quando sobem", "Vida máx.", "Atributos", "Limite por atributo", "Grimório"], [
    ["1", "Início (Sessão Zero e Sessão 1)", "20", "+5 pontos para distribuir", "+3", "Feitiços iniciais"],
    ["2", "Fim da Sessão 1", "24", "+1 ponto", "+3", "Aprimorar 1 feitiço"],
    ["3", "Meio do Arco 1", "28", "+1 ponto", "+4", "Nova habilidade"],
    ["4", "Fim do Arco 1", "32", "+1 ponto", "+4", "Aprimorar 1 feitiço"],
    ["5", "Fim do Arco 2", "36", "+1 ponto", "+5", "Despertar do grimório"]
  ]) + "<p>No nível 5, cada personagem terá recebido 9 pontos de atributo no total. A Defesa (10 + Destreza), a redução de dano (Poder ÷ 2) e a mana (10 + 1 a cada 2 de Inteligência) sobem junto com os atributos.</p>";

  h += "<h2>O que acontece ao subir de nível</h2>" +
    panel(ic("cima") + "Todo nível", "<ul><li>A Vida e a Mana voltam ao máximo, já com o novo máximo.</li><li>O personagem ganha +1 ponto de atributo, respeitando o limite da tabela.</li><li>O grimório evolui (veja abaixo).</li></ul>") +
    panel(ic("brilho") + "Aprimorar um feitiço (níveis 2 e 4)",
      "<p>O jogador escolhe um feitiço do grimório e um aprimoramento:</p>" +
      "<ul><li><b>Mais dano:</b> +1 dado de dano, ou +2 de dano fixo.</li><li><b>Mais barato:</b> -1 de mana (mínimo 1).</li><li><b>Mais alcance:</b> +1 alvo, ou uma área maior.</li><li><b>Mais duradouro:</b> +1 turno de duração.</li><li><b>Mais difícil de resistir:</b> +2 na dificuldade do teste que o feitiço impõe, ou +2 na rolagem de ataque dele.</li></ul>" +
      "<p>Cada feitiço recebe no máximo 2 aprimoramentos, e nunca o mesmo duas vezes. Um feitiço de 4 mana não pode custar menos de 3. Você aprova cada escolha.</p>") +
    panel(ic("espada") + "Nova habilidade (nível 3)",
      "<p>No nível 3, todo grimório ganha uma habilidade nova, já pronta. Ela aparece no card, marcada como Nível 3, com o custo indicado.</p>" +
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
  h += caminhosHTML(true);
  return h;
}


function regrasExtraMestre() {
  var h = "";
  h += "<h2>Os tanks</h2>" + '<p class="lead">Todo grimório tem pelo menos um ataque simples de 1 de mana. Os de tank têm também formas de proteger o grupo.</p>' +
    '<div class="cols">' +
    panel(ic("escudo") + "Muralha (Poder)", "<p>Reduz dano, absorve golpes e protege os aliados. Usa <b>Provocar</b>, <b>Interpor-se</b> e <b>Absorver</b>.</p>") +
    panel(ic("vento") + "Esquiva (Destreza)", "<p>Faz o inimigo errar e reposiciona o grupo. Usa <b>Silhueta</b>, <b>Desvanecer</b> e névoa (Grimório da Névoa).</p>") + "</div>";

  h += panel(ic("reacao") + "Refletir e Absorver (ataques mágicos)",
    "<p>Contra feitiços, cada tank tem uma reação, com punição alta se falhar.</p>" +
    table(["Custo do feitiço inimigo", "Dificuldade"], [["1 mana", "12"], ["2 mana", "15"], ["4 mana (ultimate)", "18"]]) +
    "<ul><li><b>Refletir (Espelho, Destreza):</b> d20 + Destreza, com um espelho seu a até 2 casas do alvo. Sucesso: o feitiço volta contra quem lançou. Falha: o espelho quebra (sem perder turno).</li>" +
    "<li><b>Absorver (Poder):</b> d20 + Poder. Sucesso: o feitiço é anulado e o tank ganha Cargas iguais ao custo de mana dele (máximo 4). Cada Carga vira +1d4 de dano no próximo ataque, ou 1 de mana, ou +1 de redução de dano até o fim da rodada.</li>" +
    "<li><b>Falha no Absorver:</b> o feitiço atinge o alvo normalmente, o tank perde o próximo turno inteiro e perde 2 de mana.</li>" +
    "<li>Se o feitiço tiver rolagem de ataque, pode comparar com o total do ataque em vez da dificuldade fixa.</li>" +
    "<li>Contra feitiços em área, só protege o próprio tank.</li></ul>");

  h += "<h2>Combinações de magias</h2>" +
    '<div class="note"><p><b>Decisão do mestre.</b> As magias podem se misturar, mas só você decide se e quando isso acontece. É uma opção para deixar o combate mais criativo, não uma regra fixa.</p></div>' +
    panel(ic("etiqueta") + "Estados", "<p>Muitos feitiços deixam um estado no alvo, mostrado como etiqueta no card. Os estados são o ponto de partida das combinações.</p><p>Estados usados: Molhado, Eletrizado, Congelado, Lento, Em chamas, Envenenado, Sangrando, Preso, Cego, Atordoado, Silenciado, Enferrujado e Marcado.</p>") +
    table(["Combinação", "O que o mestre pode permitir"], [
      ["Molhado + choque", "Inimigos molhados também levam o choque quando outro inimigo próximo é atingido por um feitiço de raio. Exemplo: um inimigo molhado perto de um alvo eletrizado sofre metade do dano."],
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
  return h;
}

var GANCHOS_VILA = {"Vale das Colheitas": "As plantações estão sendo atacadas por criaturas de mana.", "Porto Salgado": "Um navio misterioso atracou e ninguém desceu.", "Floresta dos Cedros": "Caçadores estão desaparecendo na mata.", "Pedra Velha": "Uma mina foi lacrada depois de um tremor estranho."};
var BONUS_VILA = {"Vale das Colheitas": "+1 em testes de Poder para carregar, empurrar ou aguentar esforço.", "Porto Salgado": "+1 em testes de Inteligência para negociar ou conseguir informação.", "Floresta dos Cedros": "+1 em testes de Destreza para furtividade e rastreio.", "Pedra Velha": "+1 em testes de Inteligência para ruínas, símbolos e magia antiga."};
function vilaExtraMestre(v) { return "<p><b>Bônus:</b> " + BONUS_VILA[v.nome] + "</p><p><b>Gancho:</b> " + GANCHOS_VILA[v.nome] + "</p>"; }
function vilaRodapeMestre() {
  return panel("Para equilibrar", "<p>Hoje são +1 em Poder, +1 em Destreza e +2 em Inteligência (Porto Salgado e Pedra Velha). Se quiser, troque um dos bônus de Inteligência por Poder ou Destreza.</p>");
}

/* ============================ MAPA ↔ CENÁRIO ============================ */

function localDoCenario(id) {
  var lig = EST.locais_cen || {}, r = null;
  Object.keys(lig).forEach(function (k) { if (lig[k] === id) r = k; });
  return r;
}

/* Liga (ou desliga) um local a um cenário. Cada local tem um cenário; cada cenário fica em um local. */
function vincularLocal(localId, cenId) {
  var lig = EST.locais_cen = EST.locais_cen || {};
  if (cenId) Object.keys(lig).forEach(function (k) { if (lig[k] === cenId) delete lig[k]; });
  if (cenId && localId) lig[localId] = cenId; else if (localId) delete lig[localId];
  salvarEstado("locais_cen");
  sincronizarPub();
}

/* Bloco que aparece no detalhe de um local do mapa, só para o mestre. */
function localExtraMestre(l) {
  var id = (EST.locais_cen || {})[l.id], c = id ? acharEnvio(id) : null;
  var h = '<label class="pj-obs-l">Cenário deste local<select class="sorteio-in" data-loccen="' + l.id + '"><option value="">Nenhum</option>' +
    ENVIADAS.map(function (e) { return '<option value="' + e.id + '"' + (c && c.id === e.id ? " selected" : "") + ">" + esc(e.nome) + "</option>"; }).join("") + "</select></label>";
  if (!ENVIADAS.length) h += '<p class="mdica">Você ainda não tem cenários. Crie na aba Cenários e volte aqui para ligar.</p>';
  else if (!c) h += '<p class="mdica">Ligue um cenário para os jogadores verem a foto ao clicar neste local, depois de revelado.</p>';
  if (c) h += '<label class="rev-label"><input type="checkbox" data-cenlib="' + c.id + '"' + (cenLiberado(c.id) ? " checked" : "") + "> 2. Mostrar o cenário (nome, foto e resumo) ao clicar neste local</label>" +
    '<p class="mdica rev-dica">' + (cenLiberado(c.id) ? "Quem clicar neste local (já visível no mapa) vê o nome, a foto e o resumo do cenário." : "Desmarcado: mesmo com o local visível, quem clicar nele não vê nada do cenário. Marque quando quiser mostrar o lugar.") + "</p>";
  if (c) h += '<div class="controls"><button type="button" data-cenir="' + c.id + '">Abrir o cenário</button><button type="button" data-cenusar="' + c.id + '">Usar na Ação</button><button type="button" data-cenfoto="' + c.id + '">Mostrar só a foto</button></div>' +
    '<p class="mdica">Os jogadores veem só a foto, e só quando o local estiver revelado. A história e o grid ficam com você.</p>';
  return h;
}

/* ============================ CENÁRIOS ============================ */

var cenSel = 0, cenMsg = "", confirmarDelCen = false;

function infoCen(id) { var i = EST.cenarios_info || {}; return i[id] || {}; }

/* Todo cenário nasce oculto. Só depois de liberado o jogador pode ver a foto, o nome e o resumo (no mapa). */
function cenLiberado(id) { return !!infoCen(id).liberado; }
function setCenLiberado(id, v) {
  var info = (EST.cenarios_info = EST.cenarios_info || {})[id] || (EST.cenarios_info[id] = {});
  info.liberado = !!v;
  salvarEstado("cenarios_info");
  sincronizarPub();
}
function statusCen(c) {
  var a = acaoEst();
  if (!a.ativo || a.envio !== c.id) return "";
  return a.modo === "foto" || !gridAtivo(a) ? "Foto na tela dos jogadores" : "Imersão ativa (grid)";
}

function novoCenarioHTML() {
  return '<section class="panel"><h3>' + ic("brilho") + "Novo cenário</h3>" +
    '<p class="mdica">A foto serve para mostrar como é o lugar, e não leva grid. Para combater, depois de criar o cenário você adiciona uma ou mais imagens de grid a ele. Preencha tudo e escolha a foto por último, porque o envio começa assim que você a escolhe.</p>' +
    '<div class="acao-ctl"><label>Nome<input class="sorteio-in" type="text" maxlength="120" id="cenaNome" placeholder="ex.: Convés do navio"></label></div>' +
    '<label class="pj-obs-l">Resumo (os jogadores leem)<textarea class="sorteio-in" rows="2" maxlength="400" id="cenaResumo" placeholder="Uma descrição curta do lugar, do que dá para ver e sentir."></textarea></label>' +
    '<label class="pj-obs-l">Descrição completa (só você vê)<textarea class="sorteio-in" rows="3" id="cenaHist" placeholder="O que há aqui, segredos, o que acontece, como os jogadores chegam…"></textarea></label>' +
    '<p><input type="file" accept="image/*" class="vh" id="cenaUp"><label class="btn primary-btn" for="cenaUp">Escolher a foto e criar</label></p>' +
    '<p role="status" class="mdica">' + esc(upMsg) + "</p></section>";
}

function cenCardsHTML() {
  if (!ENVIADAS.length) return '<div class="empty">Nenhum cenário ainda. Crie o primeiro acima.</div>';
  return '<div class="cen-lista">' + ENVIADAS.map(function (c) {
    var st = statusCen(c);
    return '<button type="button" class="cen-card' + (cenSel === c.id ? " sel" : "") + '" data-cenabrir="' + c.id + '">' +
      '<img src="' + cenaImgUrl({ envio: c.id }) + '" alt="" loading="lazy">' +
      "<b>" + esc(c.nome) + "</b><small>" + (gridsDe(c).length ? gridsDe(c).length + (gridsDe(c).length === 1 ? " mapa de grid" : " mapas de grid") : "Só imagem") + (localDoCenario(c.id) ? " · " + esc((LOCAIS.filter(function (l) { return l.id === localDoCenario(c.id); })[0] || {}).nome || "") : "") + "</small>" + '<span class="tag role">' + (cenLiberado(c.id) ? "Liberado" : "Oculto") + "</span>" + (st ? '<span class="tag leg">' + st + "</span>" : "") + "</button>";
  }).join("") + "</div>";
}

var gridSel = 0, gridMsg = "", confirmarDelGrid = 0;

function gridsHTML(c) {
  var gs = gridsDe(c), h = "<h3>" + ic("estrela") + "Mapas de grid</h3>" +
    '<p class="mdica">A foto acima é só para mostrar o lugar. Para combater, adicione uma imagem de mapa e defina as colunas e as linhas dela. Você pode ter vários mapas no mesmo cenário (por exemplo, o convés e o porão).</p>';
  if (!gs.length) h += '<div class="empty">Este cenário ainda não tem mapa de grid.</div>';
  else {
    h += '<div class="gm-lista">' + gs.map(function (g) {
      return '<div class="gm-linha' + (gridSel === g.id ? " sel" : "") + '"><img class="gm-thumb" src="' + gridUrl(g) + '" alt="" loading="lazy">' +
        '<input class="sorteio-in gm-nome" type="text" maxlength="120" data-gnome="' + g.id + '" value="' + esc(g.nome) + '" aria-label="Nome do mapa">' +
        '<label class="tok-num">Colunas <input class="sorteio-in num" type="number" min="1" max="200" data-gcols="' + g.id + '" value="' + g.cols + '"></label>' +
        '<label class="tok-num">Linhas <input class="sorteio-in num" type="number" min="1" max="200" data-grows="' + g.id + '" value="' + (g.rows || "") + '" placeholder="auto"></label>' +
        '<button type="button" data-gabrir="' + g.id + '">Ver prévia</button>' +
        '<button type="button" class="primary" data-gusar="' + g.id + '">Usar na Ação</button>' +
        '<input type="file" accept="image/*" class="vh" id="gTroca' + g.id + '" data-gtroca="' + g.id + '"><label class="btn" for="gTroca' + g.id + '">Trocar a imagem</label>' +
        '<button type="button" data-gexcluir="' + g.id + '">' + (confirmarDelGrid === g.id ? "Clique de novo para remover" : "Remover") + "</button></div>";
    }).join("") + "</div>";
    var sel = gridSel ? acharGrid(c, gridSel) : null;
    if (sel) h += '<p class="tok-desl" id="cenGridInfo"></p>' + tabuleiroHTML(gridUrl(sel), sel.nome);
  }
  h += '<div class="acao-ctl"><label>Nome do novo mapa<input class="sorteio-in" type="text" maxlength="120" id="gridNome" placeholder="ex.: Convés"></label>' +
    '<label>Colunas<input class="sorteio-in num" type="number" min="1" max="200" id="gridCols" value="20"></label>' +
    '<label>Linhas<input class="sorteio-in num" type="number" min="1" max="200" id="gridRows" placeholder="auto"></label>' +
    '<span><input type="file" accept="image/*" class="vh" id="gridUp"><label class="btn primary-btn" for="gridUp">Adicionar imagem de grid</label></span></div>' +
    '<p role="status" class="mdica">' + esc(gridMsg || "Deixe as linhas em branco para o site calcular e manter as casas quadradas.") + "</p>";
  return h;
}

function cenDetalheHTML() {
  var c = cenSel ? acharEnvio(cenSel) : null;
  if (!c) return "";
  var a = acaoEst(), noar = a.ativo && a.envio === c.id, st = statusCen(c), lk = localDoCenario(c.id);
  return '<section class="panel cen-det"><h3>' + esc(c.nome) + (st ? ' <span class="tag leg">' + st + "</span>" : "") + "</h3>" +
    '<label class="rev-label"><input type="checkbox" data-cenlib="' + c.id + '"' + (cenLiberado(c.id) ? " checked" : "") + "> Liberado aos jogadores</label>" +
    '<p class="mdica">' + (cenLiberado(c.id) ? "Os jogadores veem o nome, a foto e o resumo deste cenário ao clicar no local dele no mapa (se o local estiver revelado)." : "Oculto: os jogadores só o veem enquanto a imersão estiver ativa neste cenário. No mapa, ele só aparece depois de liberado.") + "</p>" +
    '<div class="acao-ctl"><label>Nome<input class="sorteio-in" type="text" maxlength="120" data-cenanome="' + c.id + '" value="' + esc(c.nome) + '"></label>' +
    '<label>Local no mapa<select class="sorteio-in" data-cenloc="' + c.id + '"><option value="">Nenhum</option>' +
    LOCAIS.map(function (l) { return '<option value="' + l.id + '"' + (lk === l.id ? " selected" : "") + ">" + esc(l.nome) + "</option>"; }).join("") + "</select></label>" +
    (lk ? '<button type="button" data-vermapa="' + lk + '">Ver no mapa</button>' : "") + "</div>" +
    (lk ? '<p class="mdica">Quando o local for revelado no mapa, os jogadores veem a foto deste cenário ao clicar nele.</p>' : "") +
    '<label class="pj-obs-l">Resumo (os jogadores leem)<textarea class="sorteio-in" rows="3" maxlength="400" data-cenresumo="' + c.id + '" placeholder="Uma descrição curta do lugar, do que dá para ver e sentir.">' + esc(infoCen(c.id).resumo || "") + "</textarea></label>" +
    '<p class="mdica">O resumo aparece para os jogadores no mapa (quando o local estiver revelado) e quando você mostra o cenário na tela deles.</p>' +
    '<label class="pj-obs-l">Descrição completa (só você vê)<textarea class="sorteio-in" rows="5" data-cenhist="' + c.id + '" placeholder="O que há aqui, segredos, o que acontece, como os jogadores chegam…">' + esc(infoCen(c.id).historia || "") + "</textarea></label>" +
    "<h3>Foto</h3>" + '<figure class="foto-cena"><img src="' + fotoUrl(c) + '" alt="' + esc(c.nome) + '"></figure>' +
    '<p><input type="file" accept="image/*" class="vh" id="cenaTroca" data-troca="' + c.id + '"><label class="btn" for="cenaTroca">Trocar a foto</label></p>' +
    gridsHTML(c) +
    '<div class="controls">' +
    (noar && (a.modo === "foto" || !gridAtivo(a)) ? '<button type="button" data-cenesconder="' + c.id + '">Esconder a foto dos jogadores</button>' : '<button type="button" data-cenfoto="' + c.id + '">Mostrar só a foto aos jogadores</button>') +
    '<button type="button" data-cenexcluir="' + c.id + '">' + (confirmarDelCen ? "Clique de novo para excluir" : "Excluir cenário") + "</button></div></section>";
}

function importarPastaHTML() {
  var arqs = [];
  (CENAS || []).forEach(function (l) { l.cenas.forEach(function (c) { arqs.push([l.local, c]); }); });
  if (!arqs.length) return "";
  return "<h2>Importar da pasta do servidor</h2>" + '<details class="panel"><summary>Há ' + arqs.length + ' imagem(ns) em misterio/{local}/grid/</summary>' +
    '<p class="mdica">Cada imagem importada vira um cenário (a imagem é a foto dele) e também o primeiro mapa de grid, com 20 colunas, que você pode ajustar depois.</p>' +
    '<ul class="cmb-lista">' + arqs.map(function (p) {
      return '<li><span class="cmb-nome">' + esc(nomeBonito(p[0])) + " › " + esc(nomeBonito(p[1])) + '</span><button type="button" data-impl="' + esc(p[0]) + '" data-impc="' + esc(p[1]) + '">Importar</button></li>';
    }).join("") + "</ul></details>";
}

function viewCenarios() {
  if (CENAS === null) carregarCenas();
  var h = "<h1>Cenários</h1>" + '<p class="lead">Cada cenário tem uma foto, o grid (colunas e linhas) e a sua história, que só você vê. Na aba Ação você chama o grid já pronto. Aqui você também pode mostrar só a foto aos jogadores.</p>';
  if (CENAS === null) return h + '<p class="mdica">Procurando os cenários…</p>';
  if (cenMsg) h += '<p role="status" class="mdica">' + esc(cenMsg) + "</p>";
  return h + novoCenarioHTML() + "<h2>Seus cenários</h2>" + '<div id="cenCards">' + cenCardsHTML() + '</div><div id="cenDetalhe">' + cenDetalheHTML() + "</div>" + importarPastaHTML();
}

function infoGridCen() {
  var s = document.getElementById("cenGridInfo");
  if (!s || !tabGeo) return;
  s.innerHTML = "Grid: <b>" + tabGeo.cols + " colunas × " + tabGeo.rows + " linhas</b> (" + String(tabGeo.cols * 1.5).replace(".", ",") + " × " + String(tabGeo.rows * 1.5).replace(".", ",") + " m)";
}
function desenharCenPreview() {
  var c = cenSel ? acharEnvio(cenSel) : null, g = c && gridSel ? acharGrid(c, gridSel) : null;
  if (!g) return;
  var geo = desenharTabuleiro({ cols: g.cols, rows: g.rows, tokens: [], mestre: true, depois: infoGridCen });
  if (geo) infoGridCen();
}

function enviarCenario(input) {
  var f = input.files && input.files[0];
  if (!f) return;
  var nome = document.getElementById("cenaNome").value.trim() || nomeBonito(f.name);
  var hist = document.getElementById("cenaHist").value, resumo = document.getElementById("cenaResumo").value;
  upMsg = "Preparando a imagem…";
  renderizar();
  reduzirImagem(f, 2400, 2600000, function (erro, url) {
    if (erro) { upMsg = erro; renderizar(); return; }
    upMsg = "Enviando…";
    renderizar();
    gravar("cena_enviar", { nome: nome, dados: url }).then(function (r) {
      if (!r) { upMsg = "Não foi possível enviar o cenário. Tente de novo."; renderizar(); return; }
      ENVIADAS.push({ id: r.id, nome: r.nome, v: Math.floor(Date.now() / 1000), grids: [] });
      if (hist.trim() || resumo.trim()) { (EST.cenarios_info = EST.cenarios_info || {})[r.id] = { historia: hist, resumo: resumo }; salvarEstado("cenarios_info"); }
      cenSel = r.id; gridSel = 0; gridMsg = "";
      upMsg = "Cenário “" + r.nome + "” criado. Agora adicione um mapa de grid, se for combater nele.";
      renderizar();
    });
  });
}

function enviarGrid(input) {
  var f = input.files && input.files[0], c = cenSel ? acharEnvio(cenSel) : null;
  if (!f || !c) return;
  var nome = document.getElementById("gridNome").value.trim() || nomeBonito(f.name);
  var cols = parseInt(document.getElementById("gridCols").value, 10) || 20;
  var rows = parseInt(document.getElementById("gridRows").value, 10) || null;
  cols = Math.max(1, Math.min(200, cols));
  if (rows && (rows < 1 || rows > 200)) rows = null;
  gridMsg = "Preparando a imagem…";
  renderizar();
  reduzirImagem(f, 2400, 2600000, function (erro, url) {
    if (erro) { gridMsg = erro; renderizar(); return; }
    gridMsg = "Enviando…";
    renderizar();
    gravar("grid_enviar", { cena: c.id, nome: nome, cols: cols, rows: rows, dados: url }).then(function (r) {
      if (!r) { gridMsg = "Não foi possível enviar o mapa. Tente de novo."; renderizar(); return; }
      c.grids = gridsDe(c).concat([{ id: r.id, nome: r.nome, cols: cols, rows: rows, v: Math.floor(Date.now() / 1000) }]);
      gridSel = r.id;
      gridMsg = "Mapa “" + r.nome + "” adicionado (" + cols + " colunas). Ajuste as colunas e as linhas na lista, se quiser.";
      renderizar();
    });
  });
}

function trocarImagemGrid(input) {
  var f = input.files && input.files[0], id = parseInt(input.dataset.gtroca, 10), g = achaGridPorId(id);
  if (!f || !g) return;
  gridMsg = "Enviando a nova imagem…";
  renderizar();
  reduzirImagem(f, 2400, 2600000, function (erro, url) {
    if (erro) { gridMsg = erro; renderizar(); return; }
    gravar("grid_editar", { id: id, dados: url }).then(function (r) {
      gridMsg = r ? "Imagem do mapa trocada." : "Não foi possível trocar a imagem. Tente de novo.";
      if (r) g.v = Math.floor(Date.now() / 1000);
      renderizar();
    });
  });
}

function trocarFotoCenario(input) {
  var f = input.files && input.files[0], id = parseInt(input.dataset.troca, 10), c = acharEnvio(id);
  if (!f || !c) return;
  cenMsg = "Enviando a nova foto…";
  renderizar();
  reduzirImagem(f, 2400, 2600000, function (erro, url) {
    if (erro) { cenMsg = erro; renderizar(); return; }
    gravar("cena_editar", { id: id, dados: url }).then(function (r) {
      cenMsg = r ? "Foto trocada." : "Não foi possível trocar a foto. Tente de novo.";
      if (r) { c.v = Math.floor(Date.now() / 1000); sincronizarPub(); }
      renderizar();
    });
  });
}

function inputCenarios(el) {
  var d = el.dataset, c, g;
  if ((d.gnome || d.gcols || d.grows) && (g = achaGridPorId(parseInt(d.gnome || d.gcols || d.grows, 10)))) {
    var n = parseInt(el.value, 10), valido = n >= 1 && n <= 200;
    if (d.gnome) g.nome = el.value;
    else if (d.gcols) g.cols = valido ? n : g.cols;
    else g.rows = valido ? n : null;
    adiar("grid-" + g.id, function () { gravar("grid_editar", { id: g.id, nome: g.nome, cols: g.cols, rows: g.rows }); }, 400);
    if (!d.gnome && gridSel === g.id) desenharCenPreview();
    var cards = document.getElementById("cenCards");
    if (cards) cards.innerHTML = cenCardsHTML();
    return true;
  }
  if (d.cenhist || d.cenresumo) {
    var id = d.cenhist || d.cenresumo, info = (EST.cenarios_info = EST.cenarios_info || {})[id] || (EST.cenarios_info[id] = {});
    if (d.cenhist) info.historia = el.value; else { info.resumo = el.value.slice(0, 400); sincronizarPub(); }
    salvarEstado("cenarios_info");
    return true;
  }
  return false;
}

function mostrarFotoCenario(id) {
  var a = acaoEst(), c = acharEnvio(id);
  if (!c) return;
  if (a.envio !== id) selecionarNaAcao(id, gridsDe(c).length ? gridsDe(c)[0].id : 0);
  if (CAMPO.combate) campoOp("encerrar");
  a.modo = "foto"; a.ativo = true; a.titulo = c.nome;
  salvarAcao();
  cenMsg = "Os jogadores estão vendo só a foto de “" + c.nome + "”.";
  renderizar();
}

function clickCenarios(b) {
  var d = b.dataset, a = acaoEst(), c, g;
  if (d.cenabrir) { cenSel = parseInt(d.cenabrir, 10); confirmarDelCen = false; confirmarDelGrid = 0; gridMsg = ""; gridSel = gridsDe(acharEnvio(cenSel)).length ? gridsDe(acharEnvio(cenSel))[0].id : 0; renderizar(); window.scrollTo(0, document.getElementById("cenDetalhe") ? document.getElementById("cenDetalhe").offsetTop - 80 : 0); return true; }
  if (d.cenfoto) { mostrarFotoCenario(parseInt(d.cenfoto, 10)); return true; }
  if (d.vermapa) { localSel = d.vermapa; location.hash = "#mapa"; return true; }
  if (d.cenesconder) { a.ativo = false; salvarAcao(); cenMsg = "A foto foi escondida dos jogadores."; renderizar(); return true; }
  if (d.gabrir) { gridSel = parseInt(d.gabrir, 10); confirmarDelGrid = 0; renderizar(); return true; }
  if (d.gusar && (g = achaGridPorId(parseInt(d.gusar, 10)))) {
    var dono = null;
    ENVIADAS.forEach(function (x) { if (acharGrid(x, g.id)) dono = x; });
    selecionarNaAcao(dono.id, g.id);
    a.modo = "grid";
    salvarAcao();
    location.hash = "#acao";
    return true;
  }
  if (d.gexcluir && (g = achaGridPorId(parseInt(d.gexcluir, 10)))) {
    if (confirmarDelGrid !== g.id) {
      confirmarDelGrid = g.id;
      b.textContent = "Clique de novo para remover";
      setTimeout(function () { if (confirmarDelGrid === g.id) { confirmarDelGrid = 0; var x = document.querySelector('[data-gexcluir="' + g.id + '"]'); if (x) x.textContent = "Remover"; } }, 6000);
      return true;
    }
    confirmarDelGrid = 0;
    var gid = g.id;
    gravar("grid_excluir", { id: gid }).then(function (r) {
      if (!r) return;
      ENVIADAS.forEach(function (x) { x.grids = gridsDe(x).filter(function (y) { return y.id !== gid; }); });
      if (EST.cena_tokens) { delete EST.cena_tokens["g:" + gid]; salvarEstado("cena_tokens"); }
      if (a.grid === gid) {
        campoOp("pos", { remover: a.tokens.map(function (x) { return x.id; }) });
        if (CAMPO.combate) campoOp("encerrar");
        a.grid = 0; a.modo = "foto"; a.ativo = false; a.tokens = []; tokSel = null;
        salvarAcao();
      }
      if (gridSel === gid) gridSel = 0;
      gridMsg = "Mapa removido.";
      renderizar();
    });
    return true;
  }
  if (d.cenusar) {
    var cu = acharEnvio(parseInt(d.cenusar, 10)), g0 = gridsDe(cu)[0];
    if (!g0) {
      cenSel = cu.id; gridSel = 0;
      cenMsg = "Este cenário ainda não tem mapa de grid. Adicione uma imagem de grid abaixo para usar na Ação.";
      location.hash = "#cenarios";
      renderizar();
      return true;
    }
    selecionarNaAcao(cu.id, g0.id);
    a.modo = "grid";
    salvarAcao();
    location.hash = "#acao";
    return true;
  }
  if (d.cenexcluir && (c = acharEnvio(parseInt(d.cenexcluir, 10)))) {
    if (!confirmarDelCen) {
      confirmarDelCen = true;
      b.textContent = "Clique de novo para excluir";
      setTimeout(function () { confirmarDelCen = false; var x = document.querySelector("[data-cenexcluir]"); if (x) x.textContent = "Excluir cenário"; }, 6000);
      return true;
    }
    confirmarDelCen = false;
    var id = c.id;
    gravar("cena_excluir", { id: id }).then(function (r) {
      if (!r) return;
      ENVIADAS = ENVIADAS.filter(function (x) { return x.id !== id; });
      if (EST.cena_tokens) { delete EST.cena_tokens["e:" + id]; salvarEstado("cena_tokens"); }
      if (EST.cenarios_info) { delete EST.cenarios_info[id]; salvarEstado("cenarios_info"); }
      var lk = localDoCenario(id);
      if (lk) vincularLocal(lk, 0);
      if (a.envio === id) {
        campoOp("pos", { remover: a.tokens.map(function (x) { return x.id; }) });
        if (CAMPO.combate) campoOp("encerrar");
        a.envio = 0; a.ativo = false; a.tokens = []; tokSel = null;
        salvarAcao();
      }
      cenSel = 0;
      cenMsg = "Cenário excluído.";
      renderizar();
    });
    return true;
  }
  if (d.impl) {
    b.disabled = true;
    gravar("cena_importar", { local: d.impl, cena: d.impc, nome: nomeBonito(d.impc) }).then(function (r) {
      if (!r) { b.disabled = false; return; }
      var agora = Math.floor(Date.now() / 1000);
      ENVIADAS.push({ id: r.id, nome: r.nome, v: agora, grids: [{ id: r.grid, nome: "Mapa de grid", cols: 20, rows: null, v: agora }] });
      cenSel = r.id; gridSel = r.grid;
      cenMsg = "“" + r.nome + "” importado.";
      renderizar();
    });
    return true;
  }
  return false;
}

/* ============================ AÇÃO ============================ */

var CENAS = null, ENVIADAS = [], cenasMsg = "", tokSel = null, confirmarLimpar = false, upMsg = "";
/* Posições e combate vêm do servidor (campo), que é quem manda: o mestre e os jogadores agem ao mesmo tempo. */
var CAMPO = { pos: {}, combate: null, revelados: {}, acionadas: {}, eventos: [], v: 0 };
var campoTimer = null, campoGer = 0, campoRodando = false, arrastando = false;
var TIPOS_TOKEN = [["jogador", "Jogador"], ["aliado", "Aliado"], ["inimigo", "Inimigo"]];

function nomeBonito(n) { return String(n).replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/^./, function (c) { return c.toUpperCase(); }); }
function acaoEst() { var a = EST.acao || (EST.acao = {}); a.tokens = a.tokens || []; return a; }
function acharEnvio(id) { var r = null; ENVIADAS.forEach(function (c) { if (c.id === id) r = c; }); return r; }
/* Grid do cenário ativo: o de um cenário enviado fica na própria linha dele; o de uma pasta, em EST.grids. */
function gridDe(a) { return gridAtivo(a) || {}; }

function cenaImgUrl(a) {
  var c = a.envio ? acharEnvio(a.envio) : null;
  if (!c) return "";
  var g = a.grid ? acharGrid(c, a.grid) : null;
  return g ? gridUrl(g) : fotoUrl(c);
}

function gridsDe(c) { return (c && c.grids) || []; }
function acharGrid(c, id) { var r = null; gridsDe(c).forEach(function (g) { if (g.id === id) r = g; }); return r; }
function gridAtivo(a) { var c = a.envio ? acharEnvio(a.envio) : null; return c && a.grid ? acharGrid(c, a.grid) : null; }
function gridTexto(g) { return g ? g.cols + " × " + (g.rows || "auto") : ""; }
function fotoUrl(c) { return API + "?a=cena_img&id=" + encodeURIComponent(c.id) + (c.v ? "&v=" + c.v : ""); }
function gridUrl(g) { return API + "?a=cena_img&grid=" + encodeURIComponent(g.id) + (g.v ? "&v=" + g.v : ""); }
function achaGridPorId(id) { var r = null; ENVIADAS.forEach(function (c) { var g = acharGrid(c, id); if (g) r = g; }); return r; }

function acharTok(id) { var r = null; acaoEst().tokens.forEach(function (t) { if (t.id === id) r = t; }); return r; }

/* Deslocamento: 6 casas, mais 1 a cada 2 pontos de Destreza. "aj" é um ajuste manual (por exemplo, -2 se estiver lento).
   Jogadores ligados a um perfil usam a Destreza do perfil (aba Jogadores); os outros usam a do próprio token. */
function tokDex(t) {
  var j = t.jog ? achaJog(t.jog) : null;
  if (j) return j.atr ? atrTotal(j, "destreza") : (parseInt(j.destreza, 10) || 0);
  var v = parseInt(t.dex, 10);
  return isNaN(v) ? 0 : v;
}
function deslTok(t) {
  /* Jogador ligado a um perfil: soma o que está equipado no inventário e tira a sobrecarga (mesmos números da ficha dele). */
  var j = t.jog ? achaJog(t.jog) : null, itens = 0;
  if (j && j.atr) { var st = invStats(j); itens = st.desl - st.pen; }
  return Math.max(0, 6 + Math.floor(tokDex(t) / 2) + itens + (parseInt(t.aj, 10) || 0));
}
function movel(t) { return t.tipo !== "armadilha"; }

/* Grava a cena. O deslocamento vai calculado junto, para o jogador ver o do próprio personagem sem conhecer a Destreza. */
/* Grava a cena (sem as posições, que ficam no campo). O deslocamento vai calculado junto, para o jogador ver o do
   próprio personagem sem conhecer a Destreza. Também vai o tamanho do grid, que o servidor usa para conferir os movimentos. */
function salvarAcao() {
  var a = acaoEst();
  a.tokens.forEach(function (t) { if (movel(t)) t.desl = deslTok(t); });
  a.livre = true; /* a opção de travar o movimento fora de combate foi substituída pelo botão de imersão */
  if (tabGeo) { a.cols = tabGeo.cols; a.rows = tabGeo.rows; }
  else { var gg = gridDe(a); if (gg.cols) a.cols = gg.cols; if (gg.rows) a.rows = gg.rows; }
  var copia = JSON.parse(JSON.stringify(a));
  copia.tokens.forEach(function (t) { delete t.x; delete t.y; delete t.gasto; });
  adiar("est-acao", function () { gravar("estado", { chave: "acao", valor: copia }); }, 400);
}

function aplicarCampo() {
  var pos = CAMPO.pos || {};
  acaoEst().tokens.forEach(function (t) {
    var p = pos[t.id];
    if (p) { t.x = p.x; t.y = p.y; t.gasto = p.gasto || 0; }
    else if (t.x == null) { t.x = 0; t.y = 0; t.gasto = 0; }
  });
}

function campoOp(op, dados) {
  return gravar("campo_op", extras({ op: op }, dados || {})).then(function (r) {
    if (r && r.campo) { CAMPO = r.campo; aplicarCampo(); }
    return r;
  });
}

function enviarPos(lista, extra) {
  var pos = {};
  lista.forEach(function (t) { pos[t.id] = { x: t.x | 0, y: t.y | 0, gasto: parseInt(t.gasto, 10) || 0 }; });
  return campoOp("pos", extras({ pos: pos }, extra || {}));
}

function revelado(t) { return !!(CAMPO.revelados || {})[t.id]; }
function acionada(t) { return !!(CAMPO.acionadas || {})[t.id]; }

/* Quando um jogador passa por uma armadilha, só o mestre fica sabendo: o aviso aparece em destaque e fica no registro. */
var eventosVistos = {};
function chaveEvento(e) { return e.t + "|" + e.txt; }
function marcarEventosVistos() { (CAMPO.eventos || []).forEach(function (e) { eventosVistos[chaveEvento(e)] = true; }); }
function avisarArmadilhas() {
  var novos = (CAMPO.eventos || []).filter(function (e) { return e.alerta && !eventosVistos[chaveEvento(e)]; });
  marcarEventosVistos();
  if (!novos.length) return;
  infoTok("⚠ ARMADILHA: " + novos.map(function (e) { return e.txt; }).join(" | "), true, false);
  try { if (navigator.vibrate) navigator.vibrate([120, 60, 120]); } catch (e) { /* sem vibração: ignora */ }
}
function atualId() {
  var cb = CAMPO.combate;
  return cb && cb.fase === "turnos" ? (cb.ordem || [])[cb.turno] || null : null;
}

function carregarCenas() {
  cenasMsg = "";
  var rota = function () { var r = rotaAtual(); if (r === "acao" || r === "cenarios") renderizar(); };
  api("cenas").then(function (r) {
    CENAS = r.cenas || [];
    ENVIADAS = r.enviadas || [];
    rota();
  }, function (e) {
    CENAS = [];
    cenasMsg = e.message;
    rota();
  });
}

function casaLivre(tipo) {
  var a = acaoEst(), cols = tabGeo ? tabGeo.cols : 20, rows = tabGeo ? tabGeo.rows : 15, ocup = {};
  a.tokens.forEach(function (t) { ocup[t.x + "," + t.y] = true; });
  for (var n = 0; n < cols * rows; n++) {
    var i = tipo === "jogador" || tipo === "aliado" ? n : cols * rows - 1 - n;
    var x = i % cols, y = Math.floor(i / cols);
    if (!ocup[x + "," + y]) return { x: x, y: y };
  }
  return { x: 0, y: 0 };
}
function novoTok(nome, tipo, extra) {
  var c = casaLivre(tipo);
  var t = extras({ id: "t" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36), nome: nome, tipo: tipo, cor: COR_TOKEN[tipo], x: c.x, y: c.y, oculto: false, gasto: 0 }, extra);
  acaoEst().tokens.push(t);
  return t;
}

function nomeUnico(base) {
  var usados = acaoEst().tokens.map(function (t) { return t.nome; });
  if (usados.indexOf(base) === -1) return base;
  for (var n = 2; ; n++) if (usados.indexOf(base + " " + n) === -1) return base + " " + n;
}

/* Os tokens pertencem a um mapa de grid, não ao cenário: cada mapa guarda os seus. */
function valorCena(a) { return a.grid ? "g:" + a.grid : ""; }

/* Chama um cenário (e um dos seus mapas de grid) na Ação. Cada mapa guarda os próprios tokens:
   o convés continua montado quando você volta do porão. Sem mapa de grid, só dá para mostrar a foto. */
function selecionarNaAcao(envioId, gridId) {
  var a = acaoEst(), antiga = valorCena(a);
  envioId = envioId || 0; gridId = gridId || 0;
  if (a.envio === envioId && (a.grid || 0) === gridId) return;
  EST.cena_tokens = EST.cena_tokens || {};
  if (antiga) EST.cena_tokens[antiga] = { tokens: a.tokens };
  a.envio = envioId; a.grid = gridId; a.local = ""; a.cena = "";
  a.ativo = false; a.modo = gridId ? "grid" : "foto"; tokSel = null;
  var c = envioId ? acharEnvio(envioId) : null;
  a.titulo = c ? c.nome : "";
  var nova = valorCena(a);
  a.tokens = (nova && (EST.cena_tokens[nova] || {}).tokens) || [];
  aplicarCampo();
  if (CAMPO.combate) campoOp("encerrar");
  salvarEstado("cena_tokens");
  salvarAcao();
}

function selecionarTok(id) {
  tokSel = id;
  var sv = document.getElementById("tabSvg");
  if (sv && sv.classList) sv.classList.toggle("esperando", !!id);
  document.querySelectorAll("#tabSvg .token").forEach(function (n) { n.classList.toggle("sel", n.dataset.tok === id); });
  var p = document.getElementById("tokPainel");
  if (p) p.innerHTML = tokPainelHTML();
  var l = document.getElementById("tokLista");
  if (l) l.innerHTML = tokListaHTML();
}

function tokListaHTML() {
  var tokens = acaoEst().tokens, atual = atualId();
  if (!tokens.length) return '<div class="empty">Nenhum token ainda. Adicione os jogadores, os inimigos e as armadilhas da cena.</div>';
  return '<div class="tok-chips">' + tokens.map(function (t) {
    var oculto = t.oculto && !revelado(t);
    return '<button type="button" class="tok-chip' + (tokSel === t.id ? " sel" : "") + (t.morto ? " morto" : "") + (oculto ? " oculto" : "") + (atual === t.id ? " atual" : "") + '" data-tsel="' + t.id + '">' +
      '<span class="tok-cor" style="background:' + corToken(t) + '"></span>' + (t.tipo === "armadilha" ? "! " : "") + esc(t.nome || "Sem nome") + " <small>" + coordNome(t.x | 0, t.y | 0) + "</small></button>";
  }).join("") + "</div>";
}

function tokPainelHTML() {
  var t = tokSel ? acharTok(tokSel) : null;
  if (!t) return '<section class="panel"><h3>Token</h3><p class="mdica">Clique num token no mapa ou na lista para editar.</p></section>';
  var trap = t.tipo === "armadilha";
  var h = '<section class="panel tok-painel"><h3>' + (trap ? ic("alerta") : "") + esc(t.nome || "Token") + "</h3>" +
    '<div class="tok-cab"><input type="color" data-tcor="' + t.id + '" value="' + corToken(t) + '" aria-label="Cor"><input class="sorteio-in" type="text" maxlength="40" data-tnome="' + t.id + '" value="' + esc(t.nome) + '" aria-label="Nome do token"></div>';
  if (trap) {
    h += '<label>Efeito<input class="sorteio-in" type="text" maxlength="200" data-tefeito="' + t.id + '" value="' + esc(t.efeito || "") + '" placeholder="ex.: 2d6 de dano, Destreza contra 13"></label>' +
      '<label class="rev-label"><input type="checkbox" data-toculto="' + t.id + '"' + (t.oculto && !revelado(t) ? " checked" : "") + "> Escondida" + (acionada(t) ? " (já acionada)" : "") + "</label>";
  } else {
    var jog = t.jog ? achaJog(t.jog) : null, gasto = parseInt(t.gasto, 10) || 0;
    h += '<label>Tipo<select class="sorteio-in" data-ttipo="' + t.id + '">' + TIPOS_TOKEN.map(function (o) {
      return '<option value="' + o[0] + '"' + (t.tipo === o[0] ? " selected" : "") + ">" + o[1] + "</option>";
    }).join("") + "</select></label>" +
      '<div class="tok-grade">' +
      '<label class="tok-num">Destreza ' + (jog ? '<b title="Vem do perfil do jogador">' + tokDex(t) + "</b>" : '<input class="sorteio-in num" type="number" min="-5" max="30" data-tdex="' + t.id + '" value="' + (parseInt(t.dex, 10) || 0) + '">') + "</label>" +
      '<label class="tok-num" title="Ajuste manual do deslocamento, por exemplo -2 se estiver lento">Ajuste <input class="sorteio-in num" type="number" min="-10" max="10" data-taj="' + t.id + '" value="' + (parseInt(t.aj, 10) || 0) + '"></label>' +
      '<label class="tok-num" title="Casas já andadas neste turno">Gasto <input class="sorteio-in num" type="number" min="0" max="99" data-tgasto="' + t.id + '" value="' + gasto + '"></label></div>' +
      '<p class="tok-desl" id="tokDesl"></p>' +
      '<div class="tok-grade"><label class="tok-num">Vida <input class="sorteio-in num" type="number" min="0" max="999" data-tvida="' + t.id + '" value="' + (t.vida == null ? (t.vidaMax || "") : t.vida) + '"></label>' +
      '<label class="tok-num">Máx. <input class="sorteio-in num" type="number" min="0" max="999" data-tvidamax="' + t.id + '" value="' + (t.vidaMax || "") + '"></label>' +
      (t.defesa ? '<span class="tok-desl">Def <b>' + esc(t.defesa) + "</b></span>" : "") + "</div>" +
      '<div class="tok-vida-btn">' + [-5, -1, 1, 5].map(function (d) { return '<button type="button" data-vdelta="' + d + '">' + (d > 0 ? "+" : "−") + Math.abs(d) + "</button>"; }).join("") + "</div>" +
      '<label class="rev-label"><input type="checkbox" data-tmorto="' + t.id + '"' + (t.morto ? " checked" : "") + "> Derrotado (sai dos turnos)</label>" +
      '<label class="rev-label"><input type="checkbox" data-toculto="' + t.id + '"' + (t.oculto ? " checked" : "") + "> Oculto dos jogadores</label>";
  }
  return h + '<div class="controls"><button type="button" data-tdup="' + t.id + '">Duplicar</button><button type="button" data-tdel="' + t.id + '">Remover</button></div></section>';
}

function atualizarDesl(t) {
  var s = document.getElementById("tokDesl");
  if (!s || tokSel !== t.id) return;
  var d = deslTok(t), gasto = parseInt(t.gasto, 10) || 0;
  if (!emTurnos()) {
    s.className = "tok-desl";
    s.innerHTML = "Deslocamento <b>" + d + "</b> casas por turno (6 + 1 a cada 2 de Destreza, mais itens equipados e carga). Só conta durante os turnos do combate.";
    return;
  }
  s.className = "tok-desl" + (gasto > d ? " excede" : "");
  s.innerHTML = "Deslocamento <b>" + d + "</b> (6 + 1 a cada 2 de Destreza, mais itens e carga), restam <b>" + Math.max(0, d - gasto) + "</b>.";
}

function combatentes() {
  return acaoEst().tokens.filter(function (t) { return (t.tipo === "jogador" || t.tipo === "aliado" || t.tipo === "inimigo") && !t.morto; });
}

function combatePainelHTML() {
  var cb = CAMPO.combate, a = acaoEst();
  var h = '<section class="panel cmb"><h3>' + ic("espada") + "Combate</h3>";
  if (!cb) {
    return h + '<p class="mdica">Ao iniciar, os jogadores rolam a iniciativa (d20 + Destreza) e a ordem de turnos aparece para todos.</p>' +
      '<button type="button" class="primary" id="cmbIniciar">Iniciar combate</button>' +
      (a.ativo ? "" : '<p class="mdica">A imersão está desligada: você pode iniciar o combate, mas os jogadores só o veem (e rolam a iniciativa) depois que você ativá-la.</p>') + "</section>";
  }
  var ini = cb.ini || {};
  if (cb.fase === "ini") {
    h += '<p class="mdica">Iniciativa: os jogadores rolam ou digitam o valor deles. Você define a dos inimigos.</p><ul class="cmb-lista">' + combatentes().map(function (t) {
      var v = ini[t.id];
      return '<li><span class="tok-cor" style="background:' + corToken(t) + '"></span><span class="cmb-nome">' + esc(t.nome) + (t.oculto ? " (oculto)" : "") + "</span>" +
        '<input class="sorteio-in num" type="number" min="-20" max="80" data-cini="' + t.id + '" value="' + (v ? v.v : "") + '" placeholder="–" aria-label="Iniciativa de ' + esc(t.nome) + '">' +
        '<button type="button" data-crolar="' + t.id + '">Rolar</button></li>';
    }).join("") + "</ul>" +
      '<div class="controls"><button type="button" id="cmbRolarInim">Rolar inimigos e aliados</button><button type="button" class="primary" id="cmbComecar">Começar os turnos</button><button type="button" id="cmbEncerrar">Cancelar</button></div>' +
      '<p class="mdica">Quem ficar sem iniciativa age por último.</p></section>';
    return h;
  }
  h += "<p><b>Rodada " + cb.rodada + '</b></p><ol class="cmb-ordem">' + (cb.ordem || []).map(function (id, i) {
    var t = acharTok(id);
    if (!t) return "";
    var v = ini[id] ? ini[id].v : "–";
    return '<li class="' + (i === cb.turno ? "atual" : "") + (t.morto ? " morto" : "") + '"><button type="button" class="link" data-tsel="' + id + '">' + esc(t.nome) + "</button> <small>" + v + "</small>" + (i === cb.turno ? " ◀" : "") + "</li>";
  }).join("") + "</ol>" +
    '<div class="controls"><button type="button" class="primary" id="cmbProximo">Próximo turno</button><button type="button" id="cmbRecalc" title="Inclui quem entrou depois e tira os derrotados, sem perder o turno atual">Recalcular ordem</button><button type="button" id="cmbEncerrar">Encerrar combate</button></div></section>';
  return h;
}

function logHTML() {
  var ev = (CAMPO.eventos || []).slice(-8).reverse();
  if (!ev.length) return "";
  return '<h2>Registro</h2><ul class="tok-log">' + ev.map(function (e) {
    var hora = "";
    try { hora = new Date(e.t * 1000).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); } catch (x) { hora = ""; }
    return "<li><small>" + hora + "</small> " + esc(e.txt) + "</li>";
  }).join("") + '</ul><p><button type="button" id="logLimpar">Limpar registro</button></p>';
}

function emEdicao(id) {
  var c = document.getElementById(id), f = document.activeElement;
  return !!(c && f && c.contains(f) && /^(INPUT|TEXTAREA|SELECT)$/.test(f.tagName));
}

function renderAcaoUI() {
  marcarImersivo();
  atualizarHud();
  var c = document.getElementById("combatePainel");
  if (c && !emEdicao("combatePainel")) c.innerHTML = combatePainelHTML();
  var p = document.getElementById("tokPainel");
  if (p && !emEdicao("tokPainel")) { p.innerHTML = tokPainelHTML(); var t = tokSel ? acharTok(tokSel) : null; if (t) atualizarDesl(t); }
  var l = document.getElementById("tokLista");
  if (l) l.innerHTML = tokListaHTML();
  var g = document.getElementById("campoLog");
  if (g) g.innerHTML = logHTML();
  desenharAcaoMestre();
}
function redesenharTokens() { renderAcaoUI(); }

/* Enquanto a aba Ação está aberta, busca o campo a cada 2,5 s para ver o que os jogadores fizeram. */
function iniciarCampoPoll() { if (!campoRodando) { campoRodando = true; pollCampo(++campoGer); } }
function pararCampoPoll() { clearTimeout(campoTimer); campoTimer = null; campoRodando = false; campoGer++; }
function pollCampo(ger) {
  if (ger !== campoGer || rotaAtual() !== "acao") { campoRodando = false; return; }
  var depois = function () { if (ger === campoGer) campoTimer = setTimeout(function () { pollCampo(ger); }, 2500); };
  if (document.hidden || arrastando || pendentes || Object.keys(timers).length) { depois(); return; }
  api("campo").then(function (r) {
    if (ger !== campoGer || !r.campo || r.campo.v === CAMPO.v) return;
    CAMPO = r.campo;
    aplicarCampo();
    renderAcaoUI();
    avisarArmadilhas();
  }, function () { /* sem conexão: tenta de novo no próximo ciclo */ }).then(depois);
}

function viewAcaoMestre() {
  if (CENAS === null) carregarCenas();
  var a = acaoEst();
  var h = "<h1>Ação</h1>" + '<p class="lead">Chame um cenário já criado na aba Cenários, escolha o mapa de grid e como mostrar, e posicione os tokens. O grid (colunas e linhas) vem do mapa de grid.</p>';
  if (CENAS === null) return h + '<p class="mdica">Procurando os cenários…</p>';
  if (!ENVIADAS.length) return h + '<div class="note"><p><b>Você ainda não tem cenários.</b> Crie o primeiro na aba <a href="#cenarios">Cenários</a>, com foto, resumo e mapas de grid.</p></div>';
  var env = a.envio ? acharEnvio(a.envio) : null, grids = gridsDe(env), g = gridAtivo(a);
  h += '<div class="acao-ctl"><label>Cenário<select class="sorteio-in" data-acao="cenario"><option value="">Escolha…</option>' +
    ENVIADAS.map(function (c) { return '<option value="e:' + c.id + '"' + (a.envio === c.id ? " selected" : "") + ">" + esc(c.nome) + "</option>"; }).join("") + "</select></label>" +
    (grids.length ? '<label>Mapa de grid<select class="sorteio-in" data-acao="grid">' + (g ? "" : '<option value="">Escolha…</option>') + grids.map(function (x) { return '<option value="' + x.id + '"' + (g && g.id === x.id ? " selected" : "") + ">" + esc(x.nome) + " (" + gridTexto(x) + ")</option>"; }).join("") + "</select></label>" : "") +
    '<button type="button" id="acaoRecarregar">Atualizar lista</button></div>';
  if (!env) return h + '<div class="empty">Escolha um cenário.</div>';
  var foto = a.modo === "foto" || !g;
  h += '<div class="acao-ctl">' +
    '<label>Como mostrar<select class="sorteio-in" data-acao="modo"><option value="grid"' + (foto ? "" : " selected") + (g ? "" : " disabled") + '>Grid e tokens</option><option value="foto"' + (foto ? " selected" : "") + ">Só a foto</option></select></label>" +
    '<button type="button" class="chip acao-imersao" id="imersao" aria-pressed="' + !!a.ativo + '">' + ic(a.ativo ? "olho" : "cadeado") + (a.ativo ? "Desativar imersão" : "Ativar imersão") + "</button>" +
    '<label>Título para os jogadores<input class="sorteio-in" type="text" maxlength="80" data-acao="titulo" value="' + esc(a.titulo || "") + '" placeholder="Cena atual"></label>' +
    '<span class="tok-desl">Grid: <b>' + (g ? gridTexto(g) : "sem mapa de grid") + '</b></span><button type="button" data-cenir="' + env.id + '">Editar o cenário</button></div>' +
    '<p class="mdica" id="imersaoInfo">' + (a.ativo ? (foto ? "Imersão ativa: os jogadores estão vendo a foto." : "Imersão ativa: os jogadores veem o mapa e movem o personagem deles. Fora de combate, a movimentação é livre; no combate, só na vez de cada um.") : "Imersão desligada: só você vê esta cena. Você pode montar o mapa, e até iniciar o combate, sem os jogadores verem.") + "</p>";
  if (foto) {
    return h + '<p class="mdica">' + (!grids.length ? "Este cenário ainda não tem mapa de grid, então só dá para mostrar a foto. Para combater, adicione uma imagem de grid na aba Cenários." : (!g ? "Escolha um mapa de grid acima para usar o grid e os tokens." : "Os jogadores veem só a foto, sem grid nem tokens. Mude “Como mostrar” para “Grid e tokens” quando for combater.")) + "</p>" +
      '<figure class="foto-cena"><img src="' + fotoUrl(env) + '" alt="' + esc(env.nome) + '"></figure>';
  }
  h += '<p class="mdica" id="tokInfo" role="status">' + esc(INFO_PADRAO) + "</p>";
  h += '<div class="acao-mapa"><div>' + tabuleiroHTML(gridUrl(g), g.nome) + '</div><aside class="acao-lado"><div id="combatePainel"></div><div id="tokPainel"></div></aside></div>';
  h += '<div class="controls">' +
    '<button type="button" class="primary" id="tokJogadores">Adicionar jogadores</button>' +
    '<button type="button" id="tokAliado">Adicionar aliado</button>' +
    '<button type="button" id="tokArmadilha">' + ic("alerta") + "Adicionar armadilha</button>" +
    '<button type="button" id="tokTurno">Zerar movimentos</button>' +
    '<button type="button" class="perigo" id="acaoReset">Resetar ação</button></div>';
  h += '<div class="controls"><label class="tok-best">Inimigo do Bestiário <select class="sorteio-in" id="tokBestSel">' + FASES.map(function (f) {
    var lista = INIMIGOS.map(function (m, i) { return [m, i]; }).filter(function (p) { return p[0].fase === f; });
    return lista.length ? '<optgroup label="' + esc(f) + '">' + lista.map(function (p) {
      return '<option value="' + p[1] + '">' + esc(p[0].nome) + " (vida " + p[0].vida + ", def " + p[0].defesa + ")</option>";
    }).join("") + "</optgroup>" : "";
  }).join("") + '</select></label><button type="button" id="tokBest">Adicionar no grid</button>' +
    '<button type="button" id="tokInimigo">Inimigo avulso</button>' +
    '<button type="button" id="tokSemInimigos">Remover inimigos</button>' +
    '<button type="button" id="tokLimpar">' + (confirmarLimpar ? "Clique de novo para remover todos" : "Remover todos") + "</button></div>" +
    '<p class="mdica">Os tokens são salvos por mapa de grid: ao trocar de mapa e voltar, tudo continua onde estava. Tokens ocultos e armadilhas escondidas aparecem só para você. A vida e a defesa dos inimigos nunca vão para os jogadores.</p>' +
    '<div id="tokLista"></div><div id="campoLog"></div>';
  return h;
}

function desenharAcaoMestre() {
  var a = acaoEst(), g = gridDe(a);
  var tokens = a.tokens.map(function (t) {
    var c = extras({}, t), j = t.jog ? achaJog(t.jog) : null;
    c.oculto = !!t.oculto && !revelado(t);
    if (j && j.img) c.foto = j.img; /* foto do personagem no lugar das iniciais */
    return c;
  });
  /* Nos turnos, o token selecionado mostra em azul até onde ainda pode ir. */
  var alcance = function (cols, rows) {
    var t = tokSel ? acharTok(tokSel) : null;
    if (!t || !movel(t) || !emTurnos()) return [];
    return celulasAlcance(a.tokens, t, Math.max(0, deslTok(t) - (parseInt(t.gasto, 10) || 0)), cols, rows);
  };
  desenharTabuleiro({ cols: g.cols, rows: g.rows, tokens: tokens, sel: tokSel, atual: atualId(), alcance: alcance, mestre: true, depois: ligarArraste });
}

var INFO_PADRAO = "Clique num token para selecioná-lo; depois clique na casa de destino (ou arraste o token). Cada casa tem 1,5 m. O movimento é só na horizontal e na vertical: o custo é a soma das casas andadas, sem diagonal.";
var ultimaInfo = "";
function infoTok(txt, aviso, espera) {
  ultimaInfo = txt;
  atualizarHud();
  var p = document.getElementById("tokInfo");
  if (!p) return;
  p.textContent = txt;
  p.classList.toggle("tok-aviso", !!aviso);
  p.classList.toggle("aguardando", !!espera);
}

/* Barra da tela cheia (mestre): o aviso atual e o botão do turno. */
function hudMestre() {
  var h = ultimaInfo ? "<span>" + esc(ultimaInfo) + "</span>" : "";
  if (emTurnos()) {
    var t = acharTok(atualId() || "");
    h += "<span>Rodada " + CAMPO.combate.rodada + (t ? " · turno de " + esc(t.nome) : "") + '</span><button type="button" class="primary" id="cmbProximo">Próximo turno</button>';
  }
  return h;
}

/* Faixa de destaque: o token está selecionado e o mapa aguarda o destino. */
function avisarSelecao(t) {
  infoTok((t.nome || "Token") + " selecionado em " + coordNome(t.x, t.y) +
    (movel(t) && emTurnos() ? " (deslocamento " + deslTok(t) + ", já gastou " + (parseInt(t.gasto, 10) || 0) + ")" : "") +
    ". Aguardando o destino: clique numa casa do mapa, ou arraste o token. Esc cancela.", false, true);
}

function limparSelecao() {
  tokSel = null;
  renderAcaoUI();
  infoTok(INFO_PADRAO);
}

/* Prévia da casa sob o mouse enquanto um token está selecionado, com a distância. */
function mostrarHover(svg, c) {
  if (!svg.querySelector || !document.createElementNS || !tabGeo) return;
  var hv = svg.querySelector(".hoverCell");
  if (!hv) {
    hv = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    hv.setAttribute("class", "hoverCell");
    svg.appendChild(hv);
  }
  hv.setAttribute("x", (c.x * tabGeo.cw).toFixed(1));
  hv.setAttribute("y", (c.y * tabGeo.ch).toFixed(1));
  hv.setAttribute("width", tabGeo.cw.toFixed(1));
  hv.setAttribute("height", tabGeo.ch.toFixed(1));
  hv.style.display = "";
}
function esconderHover(svg) {
  var hv = svg.querySelector ? svg.querySelector(".hoverCell") : null;
  if (hv) hv.style.display = "none";
}

function emTurnos() { return !!(CAMPO.combate && CAMPO.combate.fase === "turnos"); }

function textoDistancia(t, ox, oy, c) {
  var casas = distMov(c.x, c.y, ox, oy);
  var s = (t.nome || "Token") + ": " + coordNome(ox, oy) + " → " + coordNome(c.x, c.y) + ", " + casas + (casas === 1 ? " casa" : " casas") + " (" + String(casas * 1.5).replace(".", ",") + " m).";
  var aviso = false;
  if (movel(t) && emTurnos()) {
    var d = deslTok(t), total = (parseInt(t.gasto, 10) || 0) + casas;
    if (total > d) { s += " Excede o deslocamento de " + d + " em " + (total - d) + "."; aviso = true; }
    else s += " Restam " + (d - total) + " de " + d + ".";
  }
  return [s, aviso, casas];
}

function armadilhasEm(c, exceto) {
  return acaoEst().tokens.filter(function (t) { return t.tipo === "armadilha" && t.id !== exceto.id && (t.x | 0) === c.x && (t.y | 0) === c.y; });
}

function moverTok(t, c, ox, oy, desdeArrasto) {
  var r = textoDistancia(t, ox, oy, c), txt = r[0], aviso = r[1];
  /* Ao arrastar, o token já está na casa onde foi solto: o redesenho não deve levá-lo de volta à origem para deslizar. */
  if (desdeArrasto && tabGeo) posTokAnt[t.id] = { px: (c.x + 0.5) * tabGeo.cw, py: (c.y + 0.5) * tabGeo.ch };
  if (movel(t) && emTurnos()) t.gasto = (parseInt(t.gasto, 10) || 0) + r[2];
  t.x = c.x;
  t.y = c.y;
  enviarPos([t]);
  renderAcaoUI();
  if (movel(t)) {
    armadilhasEm(c, t).forEach(function (a) {
      txt += " ARMADILHA em " + coordNome(c.x, c.y) + ": " + (a.nome || "sem nome") + (a.efeito ? " (" + a.efeito + ")" : "") + (a.oculto && !revelado(a) ? " [estava escondida]" : "") + ".";
      aviso = true;
    });
  }
  infoTok(txt, aviso);
}

/* Arrastar com mouse ou dedo. Também dá para tocar num token e depois na casa de destino. */
function ligarArraste() {
  var svg = document.getElementById("tabSvg");
  if (!svg || !tabGeo) return;
  svg.classList.add("editavel");
  svg.classList.toggle("esperando", !!tokSel);
  var arr = null, toque = null;
  svg.onpointerdown = function (ev) {
    var g = ev.target.closest ? ev.target.closest(".token") : null;
    if (!g) {
      /* Toque numa casa vazia: só vira movimento ao soltar, sem arrasto (assim dá para arrastar o mapa ampliado). */
      toque = tokSel ? { x: ev.clientX, y: ev.clientY } : null;
      return;
    }
    toque = null;
    var t = acharTok(g.dataset.tok);
    if (!t) return;
    ev.preventDefault();
    var jaSel = tokSel === t.id;
    selecionarTok(t.id);
    arr = { t: t, g: g, ox: t.x, oy: t.y, c: null, jaSel: jaSel };
    arrastando = true;
    svg.classList.add("drag");
    try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* sem captura: ignora */ }
    avisarSelecao(t);
  };
  svg.onpointermove = function (ev) {
    if (!arr) {
      /* Sem arrastar: se há token selecionado, destaca a casa sob o mouse e mostra a distância. */
      var sel = tokSel ? acharTok(tokSel) : null;
      if (!sel) return;
      var hc = celulaTab(svg, ev);
      if (!hc) return;
      mostrarHover(svg, hc);
      var rh = textoDistancia(sel, sel.x, sel.y, hc);
      infoTok(rh[0], rh[1], true);
      return;
    }
    var c = celulaTab(svg, ev);
    if (!c) return;
    arr.c = c;
    arr.g.style.transform = "translate(" + ((c.x + 0.5) * tabGeo.cw).toFixed(1) + "px," + ((c.y + 0.5) * tabGeo.ch).toFixed(1) + "px)";
    var r = textoDistancia(arr.t, arr.ox, arr.oy, c);
    infoTok(r[0], r[1]);
  };
  svg.onpointerup = svg.onpointercancel = function (ev) {
    if (!arr) {
      var tq = toque;
      toque = null;
      if (tq && ev && ev.type === "pointerup" && !zoomGesto && Math.abs(ev.clientX - tq.x) < 8 && Math.abs(ev.clientY - tq.y) < 8) {
        var sel = tokSel ? acharTok(tokSel) : null, c = celulaTab(svg, ev);
        if (sel && c && (c.x !== sel.x || c.y !== sel.y)) { esconderHover(svg); moverTok(sel, c, sel.x, sel.y); }
      }
      return;
    }
    var a2 = arr;
    arr = null;
    arrastando = false;
    svg.classList.remove("drag");
    if (a2.c && (a2.c.x !== a2.ox || a2.c.y !== a2.oy)) { moverTok(a2.t, a2.c, a2.ox, a2.oy, true); return; }
    /* Clicar de novo no token já selecionado (sem arrastar) cancela a seleção. */
    if (!a2.c && a2.jaSel) limparSelecao();
  };
  svg.onpointerleave = function () { esconderHover(svg); };
}

function redesenharTokens() {
  var tb = document.getElementById("tokTabela");
  if (tb) tb.innerHTML = tokensHTML(acaoEst());
  desenharAcaoMestre();
}

function changeAcao(el) {
  var d = el.dataset, a = acaoEst(), t;
  if (d.acao === "cenario") {
    var id = el.value.indexOf("e:") === 0 ? parseInt(el.value.slice(2), 10) : 0, ce = id ? acharEnvio(id) : null;
    selecionarNaAcao(id, ce && gridsDe(ce).length ? gridsDe(ce)[0].id : 0);
    renderizar();
    return true;
  }
  if (d.acao === "grid") { selecionarNaAcao(a.envio, parseInt(el.value, 10) || 0); renderizar(); return true; }
  if (d.acao === "modo") {
    a.modo = el.value === "grid" && gridAtivo(a) ? "grid" : "foto";
    if (a.modo === "foto" && CAMPO.combate) campoOp("encerrar");
    salvarAcao();
    renderizar();
    return true;
  }
  if (d.tcor && (t = acharTok(d.tcor))) { t.cor = el.value; salvarAcao(); renderAcaoUI(); return true; }
  if (d.ttipo && (t = acharTok(d.ttipo))) {
    if (t.cor === COR_TOKEN[t.tipo]) t.cor = COR_TOKEN[el.value];
    t.tipo = el.value;
    salvarAcao();
    redesenharTokens();
    return true;
  }
  if (d.toculto && (t = acharTok(d.toculto))) {
    t.oculto = el.checked;
    /* Esconder de novo uma armadilha já acionada também apaga o "acionada" do servidor. */
    if (t.tipo === "armadilha" && el.checked) campoOp("revelar", { id: t.id, valor: false });
    salvarAcao();
    renderAcaoUI();
    return true;
  }
  if (d.tmorto && (t = acharTok(d.tmorto))) { t.morto = el.checked; salvarAcao(); renderAcaoUI(); return true; }
  if (d.cini) {
    var vn = parseInt(el.value, 10);
    if (!isNaN(vn)) campoOp("ini", { id: d.cini, valor: vn }).then(renderAcaoUI);
    return true;
  }
  return false;
}

function inputAcao(el) {
  var d = el.dataset, t;
  function chips() { var l = document.getElementById("tokLista"); if (l) l.innerHTML = tokListaHTML(); }
  if (d.acao === "titulo") { acaoEst().titulo = el.value; salvarAcao(); return true; }
  if (d.tnome && (t = acharTok(d.tnome))) { t.nome = el.value; salvarAcao(); chips(); desenharAcaoMestre(); return true; }
  if (d.tefeito && (t = acharTok(d.tefeito))) { t.efeito = el.value; salvarAcao(); return true; }
  if (d.tdex && (t = acharTok(d.tdex))) { t.dex = parseInt(el.value, 10) || 0; salvarAcao(); atualizarDesl(t); return true; }
  if (d.taj && (t = acharTok(d.taj))) { t.aj = parseInt(el.value, 10) || 0; salvarAcao(); atualizarDesl(t); return true; }
  if (d.tgasto && (t = acharTok(d.tgasto))) {
    t.gasto = Math.max(0, parseInt(el.value, 10) || 0);
    atualizarDesl(t);
    adiar("pos-" + t.id, function () { enviarPos([t]); }, 400);
    return true;
  }
  if (d.tvida && (t = acharTok(d.tvida))) { t.vida = Math.max(0, parseInt(el.value, 10) || 0); salvarAcao(); desenharAcaoMestre(); return true; }
  if (d.tvidamax && (t = acharTok(d.tvidamax))) { t.vidaMax = Math.max(0, parseInt(el.value, 10) || 0) || null; if (t.vidaMax && t.vida == null) t.vida = t.vidaMax; salvarAcao(); desenharAcaoMestre(); return true; }
  if (d.cenanome) {
    var ce = acharEnvio(parseInt(d.cenanome, 10));
    if (ce) { ce.nome = el.value; sincronizarPub(); adiar("cenanome-" + ce.id, function () { gravar("cena_editar", { id: ce.id, nome: ce.nome }); }, 600); }
    return true;
  }
  return false;
}

/* Recomeça a ação do mapa atual. Só mexe na ação: o cenário, os mapas de grid e os tokens guardados de outros mapas ficam como estão. */
function resetarAcao() {
  var a = acaoEst(), n = a.tokens.length;
  var ok = window.confirm("Resetar a ação deste mapa?\n\n" +
    "• Remove todos os tokens (" + n + (n === 1 ? " token" : " tokens") + ": jogadores, aliados, inimigos e armadilhas)\n" +
    "• Encerra o combate e apaga o registro de acontecimentos\n" +
    "• Desliga a imersão (os jogadores deixam de ver a cena)\n\n" +
    "O cenário, os mapas de grid e os tokens de outros mapas não são afetados.\nNão dá para desfazer.");
  if (!ok) return;
  var ids = a.tokens.map(function (x) { return x.id; });
  a.tokens = [];
  tokSel = null;
  a.ativo = false;
  if (EST.cena_tokens && valorCena(a)) { delete EST.cena_tokens[valorCena(a)]; salvarEstado("cena_tokens"); }
  salvarAcao();
  campoOp("resetar", { remover: ids }).then(function () {
    renderAcaoUI();
    infoTok("Ação resetada: sem tokens, sem combate e com a imersão desligada.");
  });
  renderizar();
}

function clickAcao(b) {
  var a = acaoEst(), t;
  if (b.id === "acaoRecarregar") { CENAS = null; renderizar(); return true; }
  if (b.id === "imersao") { a.ativo = !a.ativo; salvarAcao(); renderizar(); return true; }
  if (b.id === "acaoReset") { resetarAcao(); return true; }
  if (b.dataset.tsel) {
    selecionarTok(b.dataset.tsel);
    desenharAcaoMestre();
    var ts = acharTok(b.dataset.tsel);
    if (ts) avisarSelecao(ts);
    return true;
  }
  if (b.dataset.cenir) { cenSel = parseInt(b.dataset.cenir, 10); location.hash = "#cenarios"; return true; }
  /* --- tokens --- */
  if (b.id === "tokJogadores") {
    var novos = [];
    (jogs || []).forEach(function (j) {
      if (a.tokens.some(function (t) { return t.jog === j.id; })) return;
      novos.push(novoTok(nomeUnico(j.personagem || j.nome || "Jogador"), "jogador", { jog: j.id }));
    });
    infoTok(novos.length ? novos.length + " jogadores adicionados." : "Todos os jogadores já estão no mapa.");
    if (novos.length) { enviarPos(novos); salvarAcao(); }
    renderAcaoUI();
    return true;
  }
  if (b.id === "tokBest") {
    var m = INIMIGOS[parseInt(document.getElementById("tokBestSel").value, 10)];
    if (!m) return true;
    t = novoTok(nomeUnico(m.nome), "inimigo", { vida: m.vida, vidaMax: m.vida, defesa: String(m.defesa), bestiario: m.nome });
    tokSel = t.id;
    infoTok(m.nome + " adicionado (vida " + m.vida + ", defesa " + m.defesa + "). Com 8 jogadores, veja a regra de escala no Bestiário.");
    enviarPos([t]); salvarAcao(); renderAcaoUI();
    return true;
  }
  if (b.id === "tokInimigo" || b.id === "tokAliado") {
    var tipo = b.id === "tokInimigo" ? "inimigo" : "aliado";
    t = novoTok(nomeUnico(tipo === "inimigo" ? "Inimigo" : "Aliado"), tipo);
    tokSel = t.id;
    enviarPos([t]); salvarAcao(); renderAcaoUI();
    return true;
  }
  if (b.id === "tokArmadilha") {
    t = novoTok(nomeUnico("Armadilha"), "armadilha", { oculto: true, efeito: "" });
    tokSel = t.id;
    infoTok("Armadilha escondida criada. Arraste até a casa certa e escreva o efeito. Só você a vê até alguém pisar nela ou você desmarcar “Escondida”.");
    enviarPos([t]); salvarAcao(); renderAcaoUI();
    return true;
  }
  if (b.id === "tokTurno") {
    a.tokens.forEach(function (x) { x.gasto = 0; });
    infoTok("Os movimentos de todos foram zerados.");
    campoOp("pos", { zerar: true }).then(renderAcaoUI);
    return true;
  }
  if (b.dataset.tdup && (t = acharTok(b.dataset.tdup))) {
    var c = casaLivre(t.tipo);
    var cp = extras({}, t);
    cp.id = "t" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36);
    cp.nome = nomeUnico(String(t.nome).replace(/ \d+$/, ""));
    cp.x = c.x; cp.y = c.y; cp.gasto = 0; delete cp.jog;
    a.tokens.push(cp);
    tokSel = cp.id;
    enviarPos([cp]); salvarAcao(); renderAcaoUI();
    return true;
  }
  if (b.dataset.vdelta && tokSel && (t = acharTok(tokSel))) {
    var max = t.vidaMax || 0, atual = t.vida == null ? max : t.vida;
    if (!max) { infoTok("Defina a vida máxima do token para usar os botões de vida."); return true; }
    t.vida = Math.max(0, Math.min(max, atual + parseInt(b.dataset.vdelta, 10)));
    t.morto = t.vida === 0;
    salvarAcao();
    renderAcaoUI();
    return true;
  }
  if (b.id === "tokSemInimigos") {
    var fora = a.tokens.filter(function (x) { return x.tipo === "inimigo"; }).map(function (x) { return x.id; });
    a.tokens = a.tokens.filter(function (x) { return x.tipo !== "inimigo"; });
    if (tokSel && fora.indexOf(tokSel) !== -1) tokSel = null;
    if (fora.length) campoOp("pos", { remover: fora });
    salvarAcao(); renderAcaoUI();
    return true;
  }
  if (b.id === "tokLimpar") {
    if (!confirmarLimpar) {
      confirmarLimpar = true;
      b.textContent = "Clique de novo para remover todos";
      setTimeout(function () { confirmarLimpar = false; var x = document.getElementById("tokLimpar"); if (x) x.textContent = "Remover todos"; }, 6000);
      return true;
    }
    confirmarLimpar = false;
    campoOp("pos", { remover: a.tokens.map(function (x) { return x.id; }) });
    a.tokens = [];
    tokSel = null;
    salvarAcao();
    renderAcaoUI();
    return true;
  }
  if (b.dataset.tdel) {
    a.tokens = a.tokens.filter(function (x) { return x.id !== b.dataset.tdel; });
    if (tokSel === b.dataset.tdel) tokSel = null;
    campoOp("pos", { remover: [b.dataset.tdel] });
    salvarAcao(); renderAcaoUI();
    return true;
  }
  /* --- combate --- */
  var ops = { cmbIniciar: "iniciar", cmbRolarInim: "ini_inimigos", cmbComecar: "comecar", cmbRecalc: "comecar", cmbProximo: "proximo", cmbEncerrar: "encerrar", logLimpar: "limpar_log" };
  if (ops[b.id]) {
    campoOp(ops[b.id]).then(function () {
      var at = atualId();
      if (b.id === "cmbProximo" && at) tokSel = at;
      renderAcaoUI();
    });
    return true;
  }
  if (b.dataset.crolar) {
    campoOp("ini", { id: b.dataset.crolar, rolar: true }).then(renderAcaoUI);
    return true;
  }
  return false;
}

var ultimaRota = "";
function atualizarJogadores() {
  if (jogSel || Object.keys(jogSujos).length) return;
  api("inicio").then(function (d) {
    if (jogSel || Object.keys(jogSujos).length || !d.jogadores) return;
    jogs = d.jogadores;
    CONTAS = d.usuarios || CONTAS;
    if ((rotaAtual() === "jogadores" && !jogSel) || rotaAtual() === "itens") renderizar();
    /* O deslocamento dos jogadores depende dos itens equipados: ao abrir a Ação, recalcula com os inventários atuais. */
    if (rotaAtual() === "acao" && EST.acao) { salvarAcao(); renderAcaoUI(); }
  }, function () { /* sem conexão: fica com a lista que já tem */ });
}

/* ============================ DROPS DO BESTIÁRIO ============================ */

/* Possíveis drops de cada inimigo. dr(id, %) aponta para um item do catálogo (D&D 5e ou Black Clover); dt(texto, %) é um drop livre.
   A chance vem em múltiplos de 5%, e a tela mostra o d20 equivalente (as rolagens são feitas na mesa, com dados físicos). */
function dr(id, pct) { return { id: id, pct: pct }; }
function dt(txt, pct) { return { txt: txt, pct: pct }; }
var DROPS = {
  "Bandido do Reino": [dt("1d6 pratas", 100), dr("dnd-adaga", 30), dr("dnd-racao", 50)],
  "Capitão Bandido": [dt("2d6 de ouro", 100), dr("dnd-espada-curta", 50), dr("dnd-pocao-cura", 20), dt("Chave do esconderijo dos bandidos (gancho)", 50)],
  "Corvo de Mana": [dr("bc-pena-corvo", 50)],
  "Lobo de Mana": [dr("bc-presa-lobo", 75), dr("bc-pele-lobo", 40)],
  "Espantalho de Mana": [dr("bc-palha-mana", 50), dr("bc-pedra-mana", 15)],
  "Javali de Mana": [dr("bc-couro-javali", 60), dr("dnd-racao", 80)],
  "Devorador de Colheitas": [dr("bc-coracao-devorador", 100), dr("bc-pedra-mana", 100), dr("bc-erva-curativa", 75), dr("bc-tonico-forca", 50)],
  "Marujo Afogado": [dt("1d6 cobres salgados", 100), dr("dnd-corda", 30), dr("bc-frasco-nevoa", 15)],
  "Caranguejo Blindado": [dr("bc-carapaca", 60)],
  "Polvo da Maré": [dr("bc-frasco-nevoa", 30), dr("bc-pedra-mana", 25)],
  "Serpente das Marés": [dr("bc-escama-serpente", 100), dr("bc-pedra-mana", 60), dr("bc-anel-reserva", 25)],
  "Aranha Tecelã": [dr("bc-seda-aranha", 75), dr("bc-antidoto-folha-azul", 25)],
  "Raposa Sombria": [dr("bc-pelo-sombrio", 50), dr("bc-manto-cinzento", 10)],
  "Árvore Desperta": [dr("bc-erva-curativa", 60), dr("bc-botas-leves", 15)],
  "Cervo Ancestral": [dr("bc-galhada", 100), dr("bc-botas-leves", 40), dr("bc-vassoura", 20)],
  "Morcego-Cristal": [dr("bc-cristal-fragmento", 60)],
  "Verme das Rochas": [dt("Minério bruto (vale 5 po)", 60), dr("bc-pedra-mana", 25)],
  "Golem de Entulho": [dr("bc-pedra-mana", 40), dr("bc-cristal-fragmento", 75), dr("bc-cinto-grimorio", 10)],
  "Guardião das Ruínas": [dr("bc-nucleo-guardiao", 100), dr("bc-pedra-comunicacao", 40), dr("bc-cinto-grimorio", 30), dr("bc-anel-reserva", 20)],
  "Elemental Instável": [dr("bc-pedra-mana", 50), dr("bc-elixir-mana", 20)],
  "Bandoleiro Veterano": [dt("3d6 de ouro", 100), dr("dnd-espada-longa", 40), dr("bc-algema-anulante", 10)],
  "Mago Renegado": [dr("bc-elixir-mana", 35), dr("bc-luva-conducao", 15), dr("bc-anel-reserva", 10), dt("Páginas rasgadas de um grimório (gancho)", 50)],
  "Quimera de Mana": [dr("bc-elixir-mana", 100), dr("bc-luva-conducao", 30), dr("bc-espada-condutora", 25), dr("bc-bolsa-sem-fundo", 25)],
  "Titã Corrompido": [dr("bc-elixir-mana", 100), dr("bc-pagina-grimorio", 50), dr("bc-pingente-purificador", 25)],
  "Capanga Marcado": [dt("Pista: emblema da marca no pescoço", 100)],
  "Fera Marcada": [dt("Pista: pelo com a marca queimada", 100)],
  "Cavaleiro Controlado": [dr("bc-algema-anulante", 30), dt("Pista: insígnia de esquadrão alterada", 75)],
  "Infiltrado (modelo de chefe)": [dr("bc-pagina-grimorio", 20), dt("Carta cifrada da organização (pista)", 75)],
  "Grande Mago Dominado": [dr("bc-pingente-purificador", 40), dr("bc-elixir-mana", 60)]
};
var dropAlvo = "", dropMsg = "";
function itemDoCatalogo(id) {
  var r = null;
  (EST.itens || []).forEach(function (i) { if (i.id === id) r = i; });
  if (!r) catalogoPadrao().forEach(function (i) { if (i.id === id) r = i; });
  return r;
}
function d20De(pct) { return pct >= 100 ? "sempre" : "d20 ≥ " + Math.max(2, 21 - Math.round(pct / 5)); }
function dropsHTML(m) {
  var l = DROPS[m.nome];
  if (!l || !l.length) return "";
  var podeDar = (jogs || []).length > 0;
  var h = '<div class="drops"><p class="pj-rotulo">' + ic("tesouro") + "Possíveis drops</p><ul>";
  l.forEach(function (d) {
    var it = d.id ? itemDoCatalogo(d.id) : null;
    if (d.id && !it) return;
    var nome = it ? it.nome : d.txt;
    h += "<li><span><b>" + esc(nome) + "</b>" + (it && it.raridade !== "comum" ? ' <span class="tag leg">' + esc(it.raridade) + "</span>" : "") +
      (it && it.fase && !itemNaFase(it) ? ' <span class="tag role" title="Pensado para uma fase mais adiantada">adiantado</span>' : "") +
      '</span> <small>' + d.pct + "% · " + d20De(d.pct) + "</small>" +
      (it && podeDar ? ' <button type="button" class="mini" data-dropdar="' + esc(d.id) + '">Dar</button>' : "") + "</li>";
  });
  return h + "</ul></div>";
}
function dropSeletorHTML() {
  var l = jogs || [];
  if (!l.length) return "";
  if (!dropAlvo || !achaJog(dropAlvo)) dropAlvo = l[0].id;
  return '<div class="controls"><label>Entregar drops a <select class="sorteio-in" id="dropJog">' + l.map(function (j) {
    return '<option value="' + j.id + '"' + (j.id === dropAlvo ? " selected" : "") + ">" + esc(j.personagem || j.nome || "Sem nome") + "</option>";
  }).join("") + '</select></label><span id="dropMsg" role="status" class="mdica">' + esc(dropMsg) + "</span></div>";
}
function acoesDrops(b) {
  var id = b.dataset.dropdar;
  if (!id) return false;
  var it = itemDoCatalogo(id), jog = achaJog(dropAlvo);
  if (!it || !jog) return true;
  b.disabled = true;
  var antes = invJogId;
  invJogId = jog.id;
  invOp("add", { item: invDeTemplate(it, 1, true) }).then(function (r) {
    invJogId = antes;
    b.disabled = false;
    if (r) { jog.inv = r.inv; jog.moedas = r.moedas; dropMsg = it.nome + " → " + (jog.personagem || jog.nome || "jogador") + "."; }
    else dropMsg = "Não foi possível entregar. Veja o aviso no topo.";
    var m = document.getElementById("dropMsg"); if (m) m.textContent = dropMsg;
  });
  return true;
}

/* Notas do mestre sobre os caminhos de mana. Ficam AQUI (arquivo que só o mestre recebe), nunca no app.js público. */
var CAMINHO_NOTAS = {
  reforco: "O Grimório de Reforço faz isto melhor e mais forte. Para quem não tem o grimório, é um jeito de não ficar para trás no corpo a corpo. Não deixe empilhar com Pele de Pedra ou Fúria Titânica: vale o maior bônus.",
  zona: "Boa para cenas de infiltração e de armadilha: dá ao jogador o que o Mundo Falso e as Sombras tiram do inimigo. O último efeito não anula magia: só mostra o que está escondido.",
  encantamento: "É o que liga os itens ao sistema: usa o campo de equipado do Inventário e o catálogo de armas. Imbuir combina com os estados (Molhado, Lento, Preso). Mantenha o limite de encantamentos ativos para não virar um buff permanente do grupo."
};

/* ============================ QUESTIONÁRIO DO GRIMÓRIO (resultado) ============================ */

/* Cada resposta soma pontos aos grimórios do grupo dela (peso da pergunta: 2, 2, 2, 2, 1), ajustado pelo tamanho do grupo: peso × raiz(tamanho do grupo ÷ tamanho médio dos grupos da pergunta), para um grupo pequeno não dominar. Esta tabela SÓ existe aqui, no arquivo do
   mestre: o jogador responde às perguntas (app.js) e nunca vê o que cada resposta vale nem o resultado. Só entram os grimórios do sorteio. */
var QUESTIONARIO_PONTOS = [
  { peso: 2, g: {
    A: ["Chamas", "Reforço", "Sangue", "Luz Vingativa", "Lâminas", "Raios", "Veneno", "Gelo", "Som", "Ferrugem"],
    B: ["Fortaleza", "Aço", "Névoa"],
    C: ["Luz Curativa", "Espíritos", "Espelho"],
    D: ["Correntes", "Água", "Ilusão", "Gravidade", "Tempo", "Terra", "Sorte", "Sombras", "Vento", "Raízes"] } },
  { peso: 2, g: {
    A: ["Chamas", "Reforço", "Sangue", "Luz Vingativa", "Fortaleza", "Aço"],
    B: ["Lâminas", "Raios", "Veneno", "Gelo", "Espelho", "Névoa", "Sombras", "Vento"],
    C: ["Som", "Ferrugem", "Luz Curativa", "Raízes", "Correntes", "Água", "Ilusão", "Gravidade", "Tempo", "Espíritos", "Terra", "Sorte"] } },
  { peso: 2, g: {
    A: ["Chamas", "Raios", "Luz Vingativa", "Luz Curativa"],
    B: ["Reforço", "Aço", "Lâminas", "Fortaleza", "Ferrugem", "Correntes"],
    C: ["Raízes", "Veneno", "Água", "Vento", "Gelo", "Névoa", "Terra"],
    D: ["Ilusão", "Sombras", "Tempo", "Gravidade", "Som", "Espíritos", "Espelho", "Sorte", "Sangue"] } },
  { peso: 2, g: {
    A: ["Lâminas", "Reforço", "Sangue", "Fortaleza", "Aço", "Espelho"],
    B: ["Chamas", "Raios", "Gelo", "Veneno", "Som", "Ferrugem", "Luz Vingativa", "Água", "Ilusão", "Raízes"],
    C: ["Sombras", "Vento", "Névoa", "Espelho", "Raios", "Tempo"],
    D: ["Luz Curativa", "Correntes", "Gravidade", "Terra", "Espíritos", "Sorte"] } },
  { peso: 1, g: {
    A: ["Sangue", "Sorte", "Raios", "Chamas", "Reforço", "Aço"],
    B: ["Ferrugem", "Tempo", "Gravidade", "Veneno", "Correntes", "Terra", "Raízes"],
    C: ["Luz Curativa", "Fortaleza", "Espelho", "Névoa", "Água", "Espíritos"],
    D: ["Sombras", "Vento", "Gelo", "Lâminas", "Som", "Luz Vingativa", "Sorte", "Ilusão"] } }
];
/* Devolve os grimórios do sorteio ordenados por pontos (null se o jogador ainda não respondeu). */
function questionarioResultado(j) {
  var r = j && j.questionario && j.questionario.r;
  if (!r || r.length !== QUESTIONARIO_PONTOS.length) return null;
  var lista = GRIMORIOS.filter(function (g) { return !g.reservado; }).map(function (g) { return { nome: grimCurto(g.nome), grim: g.nome, pontos: 0 }; });
  r.forEach(function (letra, i) {
    var q = QUESTIONARIO_PONTOS[i], grupo = q.g[letra] || [], letras = Object.keys(q.g), tot = 0;
    letras.forEach(function (l) { tot += q.g[l].length; });
    var peso = q.peso * Math.sqrt(grupo.length / (tot / letras.length));
    lista.forEach(function (x) { if (grupo.indexOf(x.nome) !== -1) x.pontos += peso; });
  });
  lista.forEach(function (x) { x.pontos = Math.round(x.pontos * 100) / 100; });
  return lista.sort(function (a, b) { return b.pontos - a.pontos || a.nome.localeCompare(b.nome, "pt"); });
}
function pontosTxt(p) { return String(Math.round(p * 10) / 10).replace(".", ","); }
function questionarioJog(j) {
  var res = questionarioResultado(j);
  var h = '<fieldset class="pj-acesso"><legend>Questionário do grimório</legend>';
  if (!res) return h + '<p class="mdica">O jogador ainda não respondeu. Ele vê as 5 perguntas no Perfil, e só você vê o resultado.</p></fieldset>';
  /* Quem já está com outro jogador sai da lista principal e aparece só no aviso embaixo. */
  var tomados = [], livres = [];
  res.forEach(function (x) {
    var dono = (jogs || []).filter(function (q) { return q.grim === x.grim && q.id !== j.id; })[0];
    if (dono) tomados.push({ x: x, dono: dono }); else livres.push(x);
  });
  var topo = livres.length ? livres[0].pontos : 0, empatados = livres.filter(function (x) { return Math.abs(x.pontos - topo) < 0.005; });
  h += '<p class="mdica">Respostas: ' + j.questionario.r.map(function (l, i) { return (i + 1) + l; }).join(" · ") + ". Só aparecem os grimórios que ainda estão livres." +
    (empatados.length > 1 ? " <b>Empate no topo entre " + empatados.length + " grimórios:</b> o jogador escolhe, ou você sorteia." : "") + "</p>";
  h += '<div class="scroll"><table><thead><tr><th>Grimório</th><th>Pontos</th><th></th></tr></thead><tbody>' + livres.slice(0, Math.max(6, empatados.length)).map(function (x) {
    return "<tr><td><b>" + esc(x.nome) + "</b>" + (x.grim === j.grim ? " (já é o dele)" : "") + "</td><td>" + pontosTxt(x.pontos) + '</td><td><button type="button" data-qgrim="' + esc(x.grim) + '"' + (x.grim === j.grim ? " disabled" : "") + ">Dar este grimório</button></td></tr>";
  }).join("") + "</tbody></table></div>";
  if (tomados.length) h += '<p class="mdica">Já escolhidos (fora da lista): ' + tomados.slice(0, 8).map(function (t) { return esc(t.x.nome) + " (" + pontosTxt(t.x.pontos) + ", com " + esc(t.dono.personagem || t.dono.nome || "outro jogador") + ")"; }).join(", ") + ".</p>";
  h += '<p><button type="button" data-qreset="1">Apagar as respostas (o jogador responde de novo)</button></p>';
  return h + "</fieldset>";
}
function acoesQuestionario(b) {
  var d = b.dataset;
  if (d.qgrim === undefined && d.qreset === undefined) return false;
  var j = achaJog(jogSel);
  if (!j) return true;
  if (d.qgrim) {
    if (donoGrim(d.qgrim, j.id)) { jogMsg = "Esse grimório já está com outro jogador."; renderizar(); return true; }
    j.grim = d.qgrim; salvarJog(j, true, ["grim"]); renderizar(); return true;
  }
  if (window.confirm("Apagar as respostas? O jogador poderá responder de novo.")) { j.questionario = null; salvarJog(j, true, ["questionario"]); renderizar(); }
  return true;
}

/* ============================ ITENS ============================ */

/* Catálogo do mestre (EST.itens). Os itens de Black Clover trazem uma descrição secreta e os grimórios com que combinam; isso só
   existe aqui, no arquivo do mestre, e o servidor tira esses campos antes de entregar um inventário ao jogador. */
function ibc(id, cat, nome, raridade, fase, efeito, desc, mestre, sinergia, peso, valor, x) {
  return extras({ id: "bc-" + id, origem: "bc", cat: cat, nome: nome, raridade: raridade, fase: fase || "", efeito: efeito, desc: desc, mestre: mestre, sinergia: sinergia || [], peso: peso || 0, valor: valor || 0 }, x);
}
var ITENS_BC = [
  ibc("pedra-mana", "consumivel", "Pedra de Mana", "incomum", "", "Restaura 2 de mana", "Cristal azul que se desfaz em luz quando é apertado. Usá-lo gasta uma ação.",
    "Barato de dar, mas muda o ritmo do combate. Brilha com ultimates (4 mana): Gravidade, Tempo e Espíritos conseguem lançar o ultimate duas vezes em combates longos. Evite dar mais de 2 por sessão.", ["Gravidade", "Tempo", "Espíritos", "Água"], 0.1, ouro(25)),
  ibc("elixir-mana", "consumivel", "Elixir de Mana", "raro", "Arco 2", "Restaura 4 de mana", "Frasco grosso e morno, com cheiro de ervas queimadas. Gasta uma ação.",
    "Quase um ultimate de graça. Com Raios, dá para encadear Relâmpago Veloz (age duas vezes) e depois lançar Tempestade Trovejante no mesmo combate.", ["Raios", "Tempo", "Gravidade"], 0.3, ouro(120)),
  ibc("erva-curativa", "consumivel", "Erva Curativa do Reino", "comum", "", "Cura 1d6 de vida", "Folha amarga, mascada ou posta sobre o ferimento. Vendida em qualquer vilarejo.",
    "Item de reposição. Faz o grupo sem Luz Curativa continuar em pé; cuidado para não tirar a graça do suporte do grupo, se houver um.", ["Luz Curativa"], 0.05, ouro(5)),
  ibc("tonico-forca", "consumivel", "Tônico de Força Bruta", "incomum", "", "+2 nas rolagens de Poder por uma cena", "Líquido espesso e avermelhado que aquece o corpo todo.",
    "Soma com Fúria Titânica (Reforço) e com Frenesi (Sangue): fica forte demais. Se o jogador tiver um desses, peça que escolha um dos dois efeitos.", ["Reforço", "Sangue"], 0.3, ouro(30)),
  ibc("antidoto-folha-azul", "consumivel", "Antídoto de Folha-Azul", "incomum", "", "Encerra um veneno ativo", "Pasta azulada feita pelos curandeiros de Pedra Velha.",
    "Anula o veneno do Grimório de Veneno inimigo e dos bichos do bestiário. Contra Antídoto Reverso (Veneno), só funciona no alvo escolhido.", ["Veneno"], 0.1, ouro(20)),
  ibc("frasco-nevoa", "consumivel", "Frasco de Névoa", "incomum", "", "Névoa por 2 turnos: quem está dentro não é visto de longe", "Vidro fino com fumaça cinzenta presa dentro. Quebrado no chão, a névoa se espalha.",
    "Ferramenta de fuga. Com Sombras (Passo Sombrio) o personagem some sem teste; com Vento a névoa é espalhada de propósito. Ótimo para cenas de infiltração.", ["Sombras", "Ilusão", "Vento"], 0.2, ouro(25)),
  ibc("anel-reserva", "magico", "Anel de Reserva de Mana", "raro", "Arco 1: Porto Salgado", "+2 de mana máxima", "Aro de prata fosca com uma pedra azul escura. Esquenta quando o dono está sem mana.",
    "Máximo 1 por jogador. Forte com feitiços de 1 mana repetidos: Raios (Relâmpago Veloz), Lâminas (Corte Veloz / Lâmina Conjurada). Com Sangue vira combo com Pacto Rubro: mana sobrando para ultimates.", ["Raios", "Lâminas", "Sangue"], 0.1, ouro(250), { mana: 2 }),
  ibc("luva-conducao", "magico", "Luva de Condução", "raro", "Arco 2", "+1 nas rolagens de ataque de feitiço (d20 + atributo)", "Luva de couro com fios de metal bordados no dorso, que conduzem a mana até os dedos.",
    "Muito boa em feitiços com vários alvos: Chuva de Lâminas (Lâminas) e Tempestade Trovejante (Raios) rolam um ataque por alvo, então o +1 vale várias vezes. Em Vento, vale para Rajada repetida. Não deixe empilhar com outro bônus de ataque.", ["Lâminas", "Vento", "Raios"], 0.3, ouro(300)),
  ibc("espada-condutora", "arma", "Espada Condutora de Mana", "raro", "Arco 2", "Dano 1d8 cortante · +1 de dano se gastar 1 mana antes do golpe", "Lâmina escura com veios azuis. Responde à mana do dono.",
    "O +1 soma com Lâmina Conjurada, então o corpo a corpo de Lâminas fica pesado: considere que não empilha. Corte Perfurante (Lâminas) e Punho Pesado (Reforço) funcionam bem com ela.", ["Lâminas", "Reforço"], lb(3), ouro(400)),
  ibc("botas-leves", "magico", "Botas de Passo Leve", "incomum", "Arco 1: Floresta dos Cedros", "+1 de deslocamento", "Botas finas, silenciosas, feitas por caçadores da Floresta dos Cedros.",
    "Para quem já anda muito, combina com Passo do Vento (dobra o deslocamento) e Relâmpago Veloz (age duas vezes). Dá vantagem em testes de furtividade em terreno de floresta se quiser.", ["Vento", "Raios", "Sombras"], 0.6, ouro(80), { desl: 1 }),
  ibc("manto-cinzento", "magico", "Manto Cinzento", "incomum", "Arco 1: Porto Salgado", "Vantagem em furtividade quando há pouca luz", "Capa que absorve a luz ao redor e confunde o olhar.",
    "Dá o bônus de cenário a quem já é furtivo. Com Passo Sombrio e Lâmina Oculta (o dano dobra se o alvo não viu) o jogador vira um assassino; deixe isso para cenas de infiltração, não para qualquer combate.", ["Sombras", "Ilusão"], 0.8, ouro(150)),
  ibc("escudo-cristal", "armadura", "Escudo de Cristal Rúnico", "raro", "Arco 2", "Defesa +1 · uma vez por combate, anula um feitiço de 1 mana dirigido ao dono", "Escudo de cristal liso, com runas apagadas na borda.",
    "Funciona bem com tanks (Terra, Reforço). Não conta como Barreira Anulante (Antimagia): não cancele feitiços de 2 ou 4 mana.", ["Terra", "Reforço", "Antimagia"], lb(8), ouro(350), { def: 1 }),
  ibc("cinto-grimorio", "armadura", "Cinto Porta-Grimório", "incomum", "", "Protege o grimório: roubá-lo exige Destreza 15", "Cinto de couro grosso com um estojo trancado para o grimório.",
    "Gancho: a organização infiltrada pode tentar tomar grimórios. Dá ao jogador uma chance de reagir. Antimagia (Corte Nulo) pode abrir o estojo à força.", ["Antimagia"], 0.5, ouro(60)),
  ibc("vassoura", "magico", "Vassoura de Viagem", "raro", "Arco 1: Floresta dos Cedros", "Voa sobre obstáculos e vazios · 1 mana por cena", "Vassoura de cabo escuro, comum entre os cavaleiros mágicos.",
    "Com Vento (Passo do Vento) o alcance dobra e vira o transporte do grupo; com Gravidade, inimigos no ar sofrem Inversão. Cuidado: ignora terreno e pode pular o cenário que você montou.", ["Vento", "Gravidade", "Raios"], 2, ouro(500)),
  ibc("bolsa-sem-fundo", "magico", "Bolsa Sem Fundo", "raro", "Arco 2", "Guarda até 50 kg sem pesar na carga", "Bolsa discreta, mais funda por dentro do que por fora.",
    "Zera o controle de peso do inventário. Use com moderação; se o jogador a perder, o conteúdo some junto.", [], 1, ouro(450)),
  ibc("algema-anulante", "ferramenta", "Algema Anuladora", "raro", "Arco 2", "Quem a veste não consegue lançar feitiços · romper exige Poder 18", "Algemas de ferro negro gravadas com marcas antigas.",
    "Usada para prender magos. Corte Nulo (Antimagia) cancela o efeito por 1 turno. Pode ser mais uma pista sobre a organização, que sabe fabricá-las.", ["Antimagia"], lb(5), ouro(300)),
  ibc("pedra-comunicacao", "magico", "Pedras Gêmeas de Comunicação", "incomum", "Arco 1: Pedra Velha", "Permite falar com quem tem a pedra gêmea, a qualquer distância no reino", "Duas pedras lisas que vibram quando uma delas é segurada.",
    "Boa para dividir o grupo e criar tensão. Se uma pedra for tomada, o inimigo ouve tudo.", [], 0.2, ouro(180)),
  ibc("pingente-purificador", "magico", "Pingente Purificador", "lendário", "Arco final", "+2 em testes para resistir a controle mental", "Pingente de cristal puro que fica quente perto de magia que corrompe.",
    "Reduz em 3 a dificuldade de quebrar a marca de um aliado (ver 6.3 da campanha). Melhor combinação: Antimagia (Corte Nulo) para quebrar e Luz Curativa para cuidar do estágio avançado. Entregar só perto do arco final.", ["Antimagia", "Luz Curativa"], 0.1, ouro(900)),
  ibc("pagina-grimorio", "tesouro", "Página de Grimório Perdida", "lendário", "Arco final", "Pode se tornar um feitiço novo", "Folha antiga, com símbolos que mudam quando se olha por muito tempo.",
    "Recompensa para o “Despertar do grimório” (aba Níveis): o jogador cria com você um feitiço de 4 mana ligado ao tema do grimório dele. Aprove o efeito para não quebrar o equilíbrio.", [], 0.05, 0),
  ibc("presa-lobo", "tesouro", "Presa de Lobo de Mana", "comum", "Sessão 1", "Material de criatura", "Dente longo que ainda guarda um pouco de brilho azul.",
    "Dropa do Lobo de Mana (bestiário). Gancho: um artesão de Pedra Velha troca 3 presas por um amuleto simples (+1 de deslocamento).", [], 0.1, ouro(8)),
  ibc("pena-corvo", "tesouro", "Pena de Corvo de Mana", "comum", "Sessão 1", "Material de criatura", "Pena negra com um brilho azulado na ponta.",
    "Material barato. Gancho: o vendedor de Pedra Velha paga bem por penas para fazer flechas leves.", [], 0.01, ouro(2)),
  ibc("pele-lobo", "tesouro", "Pele de Lobo de Mana", "comum", "Sessão 1", "Material de criatura", "Pele grossa e quente, ainda com um leve brilho de mana.",
    "Vende bem em Porto Salgado ou serve de matéria-prima para um manto simples.", [], 1, ouro(12)),
  ibc("palha-mana", "tesouro", "Palha Impregnada de Mana", "comum", "Arco 1: Vale das Colheitas", "Material de criatura", "Feixe de palha que ainda vibra de leve.",
    "Componente de poções simples. Um curandeiro do Vale paga por ela.", [], 0.2, ouro(5)),
  ibc("couro-javali", "tesouro", "Couro de Javali de Mana", "comum", "Arco 1: Vale das Colheitas", "Material de criatura", "Couro duro, difícil de furar.",
    "Dá para trocar por uma armadura de couro reforçada com um artesão do Vale.", [], 3, ouro(15)),
  ibc("coracao-devorador", "tesouro", "Coração do Devorador de Colheitas", "raro", "Arco 1: Vale das Colheitas", "Material raro", "Coração enorme, que pulsa devagar mesmo depois da derrota.",
    "Troféu do primeiro chefe. Gancho: o Vale oferece uma recompensa pública e a gratidão do vilarejo.", [], 2, ouro(60)),
  ibc("carapaca", "tesouro", "Carapaça de Caranguejo Blindado", "incomum", "Arco 1: Porto Salgado", "Material de criatura", "Placa dura, azul-acinzentada, quase impossível de quebrar à mão.",
    "O ferreiro do porto faz um escudo com duas carapaças (Defesa +1). Vira peça de equipamento sem você precisar inventar item novo.", [], 2, ouro(20)),
  ibc("escama-serpente", "tesouro", "Escama da Serpente das Marés", "raro", "Arco 1: Porto Salgado", "Material raro", "Escama grande como uma mão, que muda de cor com a luz.",
    "Prova de que o chefe do porto caiu. Pode virar amuleto com um artesão do porto.", [], 0.3, ouro(80)),
  ibc("seda-aranha", "tesouro", "Fio de Seda de Aranha Tecelã", "incomum", "Arco 1: Floresta dos Cedros", "Material de criatura", "Novelo de fios finos, leves e muito resistentes.",
    "Vale como corda leve (aguenta uma pessoa) ou armadilha. Rende boas cenas de improviso.", [], 0.2, ouro(10)),
  ibc("pelo-sombrio", "tesouro", "Pelo da Raposa Sombria", "incomum", "Arco 1: Floresta dos Cedros", "Material de criatura", "Pelos escuros que quase não refletem luz.",
    "Pista para o Manto Cinzento: um alfaiate da Floresta troca 4 tufos por um manto.", ["Sombras", "Ilusão"], 0.05, ouro(12)),
  ibc("galhada", "tesouro", "Galhada do Cervo Ancestral", "raro", "Arco 1: Floresta dos Cedros", "Material raro", "Galhada clara e fria, coberta de musgo que não morre.",
    "Troféu do chefe da Floresta. Os caçadores respeitam quem a carrega.", [], 4, ouro(100)),
  ibc("cristal-fragmento", "tesouro", "Fragmento de Cristal", "comum", "Arco 1: Pedra Velha", "Material de criatura", "Pedaço de cristal azul das minas.",
    "Pode ser trocado por uma Pedra de Mana com o ferreiro de Pedra Velha (3 fragmentos).", [], 0.1, ouro(6)),
  ibc("nucleo-guardiao", "tesouro", "Núcleo do Guardião das Ruínas", "raro", "Arco 1: Pedra Velha", "Material raro", "Esfera de pedra com inscrições que ainda se acendem de vez em quando.",
    "Pista para o mistério das ruínas. Defina com o grupo o que ele revela quando estudado.", [], 3, ouro(120)),
  ibc("emblema-vila", "tesouro", "Emblema do Vilarejo", "comum", "Sessão 1", "Prova de origem", "Pingente de madeira com o símbolo do vilarejo do personagem.",
    "Ligue à Origem do personagem (aba Vilarejos): NPCs do vilarejo ajudam quem mostra o emblema. Também é um bom gancho de roubo ou perda.", [], 0.05, 0)
];
function catalogoPadrao() {
  return ITENS_BASE.concat(ITENS_BC).map(function (i) { return JSON.parse(JSON.stringify(i)); });
}

var itensAba = "catalogo", itFiltro = { q: "", cat: "todas", origem: "todas", soFase: false }, itEdit = null, itMsg = "", itDel = "";
function listaItens() { return EST.itens || (EST.itens = []); }
function salvarItens() { salvarEstado("itens"); }
function achaItem(id) { var r = null; listaItens().forEach(function (i) { if (i.id === id) r = i; }); return r; }
function idxFase(f) { return FASES.indexOf(f); }
function itemNaFase(i) { return !EST.progresso || !i.fase || idxFase(i.fase) <= idxFase(EST.progresso); }
function itemIdNovo() { return "c" + Date.now().toString(36) + Math.floor(Math.random() * 46656).toString(36); }

function mesclarPadrao() {
  var tem = {};
  listaItens().forEach(function (i) { tem[i.id] = true; });
  var novos = catalogoPadrao().filter(function (i) { return !tem[i.id]; });
  novos.forEach(function (i) { listaItens().push(i); });
  salvarItens();
  itMsg = novos.length ? novos.length + " itens adicionados ao catálogo." : "O catálogo já tem todos os itens padrão.";
}

function itensFiltrados() {
  var q = itFiltro.q.trim().toLowerCase();
  return listaItens().filter(function (i) {
    if (itFiltro.cat !== "todas" && i.cat !== itFiltro.cat) return false;
    if (itFiltro.origem !== "todas" && (i.origem || "custom") !== itFiltro.origem) return false;
    if (itFiltro.soFase && !itemNaFase(i)) return false;
    return !q || (i.nome + " " + (i.efeito || "") + " " + (i.desc || "") + " " + (i.mestre || "")).toLowerCase().indexOf(q) !== -1;
  });
}

function origemNome(o) { return { dnd: "D&D 5e", bc: "Black Clover", custom: "Seu" }[o || "custom"] || "Seu"; }

function itCampo(rot, f, id, v, tipo, extra) {
  return "<label>" + rot + '<input class="sorteio-in" type="' + tipo + '" data-itf="' + f + '" data-itid="' + id + '" value="' + esc(v) + '"' + (extra || "") + "></label>";
}

function itemCatalogoHTML(i) {
  var edit = itEdit === i.id;
  var tags = '<span class="tag role">' + esc(catNome(i.cat)) + '</span><span class="tag role">' + origemNome(i.origem) + "</span>";
  if (i.raridade && i.raridade !== "comum") tags += '<span class="tag leg">' + esc(i.raridade) + "</span>";
  if (i.fase) tags += '<span class="tag role">' + ic("ampulheta") + esc(i.fase) + "</span>";
  tags += '<span class="tag role">' + ic("mochila") + pesoTxt(i.peso) + " · " + valorTxt(i.valor) + "</span>" + modsTags(i);
  var h = '<article class="panel item-cat"><h3>' + esc(i.nome) + '</h3><div class="meta item-tags">' + tags + "</div>";
  if (!itemNaFase(i)) h += '<p class="item-alerta aviso">' + ic("alerta") + "<span>Adiantado: a campanha está em " + esc(EST.progresso) + ".</span></p>";
  if (i.efeito) h += "<p><b>" + esc(i.efeito) + "</b></p>";
  if (i.desc) h += "<p>" + esc(i.desc) + "</p>";
  if (i.mestre) h += '<p class="item-segredo">' + ic("cadeado") + "<span><b>Só mestre:</b> " + esc(i.mestre) + "</span></p>";
  if ((i.sinergia || []).length) h += '<p class="mdica">Sinergia: ' + esc(i.sinergia.join(", ")) + "</p>";
  if (edit) {
    h += '<div class="item-grade">' + itCampo("Nome", "nome", i.id, i.nome, "text", ' maxlength="80"') +
      '<label>Categoria<select class="sorteio-in" data-itf="cat" data-itid="' + i.id + '">' + CATS_ITEM.map(function (c) { return '<option value="' + c[0] + '"' + (c[0] === i.cat ? " selected" : "") + ">" + c[1] + "</option>"; }).join("") + "</select></label>" +
      '<label>Raridade<select class="sorteio-in" data-itf="raridade" data-itid="' + i.id + '">' + RARID_ITEM.map(function (c) { return '<option value="' + c + '"' + (c === (i.raridade || "comum") ? " selected" : "") + ">" + c + "</option>"; }).join("") + "</select></label>" +
      itCampo("Peso (kg)", "peso", i.id, i.peso || 0, "number", ' min="0" step="0.05"') + itCampo("Valor (ouro)", "valor", i.id, (i.valor || 0) / 100, "number", ' min="0" step="0.01"') +
      itCampo("Defesa (equipado)", "def", i.id, i.def || 0, "number", ' min="-10" max="10"') + itCampo("Deslocamento (equipado)", "desl", i.id, i.desl || 0, "number", ' min="-10" max="10"') + itCampo("Mana máxima (equipado)", "mana", i.id, i.mana || 0, "number", ' min="-10" max="10"') + "</div>" +
      itCampo("Efeito ou dano (resumo)", "efeito", i.id, i.efeito || "", "text", ' maxlength="200"') +
      '<label>Descrição (o jogador vê)<textarea class="sorteio-in" rows="3" data-itf="desc" data-itid="' + i.id + '">' + esc(i.desc || "") + "</textarea></label>" +
      '<fieldset class="pj-acesso item-mestre"><legend>' + ic("cadeado") + 'Só o mestre vê</legend><label>Descrição secreta (ex.: forte quando usado com tal magia)<textarea class="sorteio-in" rows="4" data-itf="mestre" data-itid="' + i.id + '">' + esc(i.mestre || "") + "</textarea></label>" +
      itCampo("Grimórios com sinergia (vírgula)", "sinergia", i.id, (i.sinergia || []).join(", "), "text", ' list="listaGrim"') +
      '<label>Fase da campanha<select class="sorteio-in" data-itf="fase" data-itid="' + i.id + '"><option value="">Qualquer fase</option>' + opcoes(FASES, i.fase || "", false) + "</select></label></fieldset>" +
      '<p><button type="button" class="primary" data-itfim="1">Concluir edição</button></p>';
  } else {
    var jogadores = (jogs || []);
    h += '<div class="controls"><button type="button" data-itedit="' + i.id + '">Editar</button>' +
      (jogadores.length ? '<select class="sorteio-in" data-itdarsel="' + i.id + '" aria-label="Dar a qual jogador">' + jogadores.map(function (j) { return '<option value="' + j.id + '">' + esc(j.personagem || j.nome || "Sem nome") + "</option>"; }).join("") + '</select><button type="button" class="primary" data-itdar="' + i.id + '">Dar ao jogador</button>' : '<span class="mdica">Cadastre jogadores para entregar.</span>') +
      '<button type="button" data-itdel="' + i.id + '">' + (itDel === i.id ? "Clique de novo para excluir" : "Excluir") + "</button></div>";
  }
  return h + "</article>";
}

function itCatalogoListaHTML() {
  var l = itensFiltrados();
  if (!listaItens().length) return '<div class="empty">O catálogo está vazio. Carregue os itens padrão (D&amp;D 5e e Black Clover) ou crie o seu.</div>';
  if (!l.length) return '<div class="empty">Nenhum item com esse filtro.</div>';
  return '<p id="itConta" role="status" class="mdica">' + l.length + " de " + listaItens().length + ' itens.</p><div class="cols">' + l.map(itemCatalogoHTML).join("") + "</div>";
}

function itCatalogoHTML() {
  var h = '<div class="controls"><button type="button" class="primary" id="itNovo">Novo item</button><button type="button" id="itPadrao">Carregar itens padrão</button></div>' +
    '<p id="itMsg" role="status" class="mdica">' + esc(itMsg) + "</p>" +
    '<div class="controls"><input type="search" id="itBusca" placeholder="Buscar por nome, efeito ou nota" aria-label="Buscar itens" value="' + esc(itFiltro.q) + '">' +
    '<div class="fgroup"><span>Categoria</span><div class="chips" id="itCats">' + [["todas", "Todas"]].concat(CATS_ITEM).map(function (c) {
      return '<button type="button" class="chip" data-itcat="' + c[0] + '" aria-pressed="' + (itFiltro.cat === c[0]) + '">' + c[1] + "</button>";
    }).join("") + '</div></div><div class="fgroup"><span>Origem</span><div class="chips" id="itOrig">' + [["todas", "Todas"], ["dnd", "D&D 5e"], ["bc", "Black Clover"], ["custom", "Seus"]].map(function (c) {
      return '<button type="button" class="chip" data-itorig="' + c[0] + '" aria-pressed="' + (itFiltro.origem === c[0]) + '">' + c[1] + "</button>";
    }).join("") + '</div></div><label class="rev-label"><input type="checkbox" id="itSoFase"' + (itFiltro.soFase ? " checked" : "") + "> Só o que já faz sentido na fase atual</label></div>";
  return h + '<div id="itLista">' + itCatalogoListaHTML() + "</div>";
}

function itJogadoresHTML() {
  if (!jogs || !jogs.length) return '<div class="empty">Nenhum jogador cadastrado ainda.</div>';
  if (!invJogId || !achaJog(invJogId)) invJogId = jogs[0].id;
  var d = achaJog(invJogId);
  var h = '<div class="controls"><div class="fgroup"><span>Jogador</span><div class="chips" id="itJogs">' + jogs.map(function (j) {
    return '<button type="button" class="chip" data-itjog="' + j.id + '" aria-pressed="' + (j.id === invJogId) + '">' + esc(j.personagem || j.nome || "Sem nome") + "</button>";
  }).join("") + "</div></div></div>";
  h += '<p class="mdica">' + esc(d.personagem || d.nome || "") + (d.grim ? " · Grimório: " + esc(d.grim) : " · sem grimório") + ". O jogador vê os mesmos itens, menos o que está marcado “Só mestre”.</p>" +
    '<p class="mdica">Kit inicial: ' + (d.kitFeito ? "já escolhido. " + '<button type="button" data-kitlib="1">Liberar para escolher de novo</button>' : "ainda não escolhido pelo jogador.") + "</p>";
  return h + invCorpoHTML(d, true);
}

function viewItens() {
  if (!mestreAberto) {
    return '<div class="lock"><h1>Itens</h1><p>Esta aba tem as notas secretas dos itens e o inventário de cada jogador. Abra só quando nenhum jogador estiver olhando a tela.</p>' +
      '<p><button type="button" class="primary" id="abrirMestre">Abrir os itens</button></p></div>';
  }
  garantirJogs();
  var h = "<h1>Itens</h1>" + '<p class="lead">O catálogo é só seu: itens de D&amp;D 5e e de Black Clover, cada um com uma descrição secreta. O jogador só vê o que entrar no inventário dele, sem as suas notas, e pode mexer no próprio inventário. Você também pode mexer no de qualquer um.</p>' +
    '<datalist id="listaGrim">' + GRIMORIOS.map(function (g) { return '<option value="' + esc(grimCurto(g.nome)) + '">'; }).join("") + "</datalist>" +
    '<section class="panel"><h3>' + ic("ampulheta") + "Progresso da campanha</h3>" +
    '<label>Fase atual<select class="sorteio-in" id="itProgresso"><option value="">Não definida</option>' + opcoes(FASES, EST.progresso || "", false) + "</select></label>" +
    '<p class="mdica">Os itens que pedem uma fase mais adiantada ganham um aviso, no catálogo e no inventário do jogador. Assim você nota quando algo forte demais chegou cedo.</p>' + itProgressoResumo() + "</section>" +
    '<div class="controls"><div class="chips" id="itAbas"><button type="button" class="chip" data-itaba="catalogo" aria-pressed="' + (itensAba === "catalogo") + '">Catálogo</button>' +
    '<button type="button" class="chip" data-itaba="jogadores" aria-pressed="' + (itensAba === "jogadores") + '">Inventário dos jogadores</button></div></div>';
  return h + (itensAba === "catalogo" ? itCatalogoHTML() : itJogadoresHTML());
}

/* Conferência geral: itens adiantados e jogadores sobrecarregados, em todos os inventários. */
function itProgressoResumo() {
  if (!EST.progresso || !jogs) return "";
  var av = [];
  jogs.forEach(function (j) {
    var nome = j.personagem || j.nome || "Sem nome";
    (j.inv || []).forEach(function (i) { if (i.fase && idxFase(i.fase) > idxFase(EST.progresso)) av.push(nome + " tem " + i.nome + " (pensado para " + i.fase + ")."); });
    if (invPeso(j) > invCapacidade(j)) av.push(nome + " está acima da carga sugerida (" + pesoTxt(invPeso(j)) + " de " + pesoTxt(invCapacidade(j)) + ").");
  });
  if (!av.length) return '<p class="item-alerta ok">' + ic("certo") + "<span>Tudo certo: nenhum jogador tem item adiantado para " + esc(EST.progresso) + ".</span></p>";
  return '<div class="item-alerta aviso">' + ic("alerta") + "<span><b>Para conferir:</b><br>" + av.map(esc).join("<br>") + "</span></div>";
}

function acoesItens(b) {
  var d = b.dataset;
  if (b.id === "itNovo") {
    var n = { id: itemIdNovo(), origem: "custom", cat: "outro", nome: "Novo item", raridade: "comum", fase: "", efeito: "", desc: "", mestre: "", sinergia: [], peso: 0, valor: 0 };
    listaItens().unshift(n);
    itEdit = n.id; itensAba = "catalogo"; itFiltro = { q: "", cat: "todas", origem: "todas", soFase: false };
    salvarItens(); renderizar();
    return true;
  }
  if (b.id === "itPadrao") { mesclarPadrao(); renderizar(); return true; }
  if (d.itaba) { itensAba = d.itaba; renderizar(); return true; }
  if (d.itjog) { invJogId = d.itjog; invCat = "todas"; invQ = ""; renderizar(); return true; }
  if (d.itcat) { itFiltro.cat = d.itcat; renderizar(); return true; }
  if (d.itorig) { itFiltro.origem = d.itorig; renderizar(); return true; }
  if (d.itedit) { itEdit = d.itedit; renderizar(); return true; }
  if (d.itfim !== undefined) { itEdit = null; renderizar(); return true; }
  if (d.itdel) {
    if (itDel !== d.itdel) { itDel = d.itdel; renderizar(); return true; }
    EST.itens = listaItens().filter(function (i) { return i.id !== d.itdel; });
    itDel = ""; itEdit = null; salvarItens(); renderizar();
    return true;
  }
  if (d.itdar) {
    var item = achaItem(d.itdar), sel = document.querySelector('[data-itdarsel="' + d.itdar + '"]');
    var jog = sel ? achaJog(sel.value) : null;
    if (!item || !jog) return true;
    b.disabled = true;
    invJogId = jog.id;
    invOp("add", { item: invDeTemplate(item, 1, true) }).then(function (r) {
      b.disabled = false;
      if (r) { jog.inv = r.inv; jog.moedas = r.moedas; itMsg = item.nome + " foi para o inventário de " + (jog.personagem || jog.nome || "jogador") + "."; }
      else itMsg = "Não foi possível entregar. Veja o aviso no topo.";
      var m = document.getElementById("itMsg"); if (m) m.textContent = itMsg;
    });
    return true;
  }
  if (d.kitlib) {
    var jk = achaJog(invJogId);
    if (jk && window.confirm("Liberar o kit inicial de novo? Os itens que ele já tem continuam, e o jogador ganha mais uma escolha (só os itens que ele escolher; as moedas e os itens fixos não se repetem).")) {
      invOp("kit_liberar").then(function (r) { if (r) { jk.kitFeito = false; renderizar(); } });
    }
    return true;
  }
  if (d.invir) { invJogId = d.invir; itensAba = "jogadores"; location.hash = "#itens"; renderizar(); return true; }
  return false;
}

function changeItens(el) {
  var d = el.dataset || {};
  if (el.id === "itProgresso") { EST.progresso = el.value; salvarEstado("progresso"); renderizar(); return true; }
  if (el.id === "itSoFase") { itFiltro.soFase = el.checked; renderizar(); return true; }
  if (d.itf) {
    var i = achaItem(d.itid);
    if (!i) return true;
    var v = el.value;
    if (d.itf === "peso") v = Math.max(0, Number(v) || 0);
    else if (d.itf === "valor") v = Math.max(0, Math.round((Number(v) || 0) * 100));
    else if (d.itf === "def" || d.itf === "desl" || d.itf === "mana") v = Math.max(-10, Math.min(10, parseInt(v, 10) || 0));
    else if (d.itf === "sinergia") v = v.split(",").map(function (x) { return x.trim(); }).filter(Boolean);
    else if (d.itf === "nome" && !v.trim()) { el.value = i.nome; return true; }
    i[d.itf] = v;
    salvarItens();
    return true;
  }
  return false;
}
function inputItens(el) {
  if (el.id === "itBusca") { itFiltro.q = el.value; var l = document.getElementById("itLista"); if (l) l.innerHTML = itCatalogoListaHTML(); return true; }
  return false;
}

/* ============================ LIGAÇÃO COM O APP ============================ */

VIEWFN.inicio = viewInicio;
VIEWFN.grimorios = viewGrimorios;
VIEWFN.bestiario = viewBestiario;
VIEWFN.sorteio = viewSorteio;
VIEWFN.jogadores = viewJogadores;
VIEWFN["sessao-zero"] = viewSessaoZero;
VIEWFN.mestre = viewMestre;
VIEWFN.acao = viewAcaoMestre;
VIEWFN.itens = viewItens;
VIEWFN.cenarios = viewCenarios;

MESTRE = {
  /* Menu em grupos (a barra tinha itens demais). Cada item é o id de uma aba, ou um grupo com seus ids. */
  nav: ["inicio", { g: "Jogar", i: ["acao", "cenarios", "itens"] }, { g: "Mundo", i: ["mapa", "vilarejos", "bestiario"] }, { g: "Regras", i: ["regras", "niveis", "grimorios"] }, { g: "Mesa", i: ["jogadores", "sorteio", "sessao-zero", "mestre"] }],
  niveis: viewNiveisMestre,
  localExtra: localExtraMestre,
  hudHTML: hudMestre,
  regrasExtra: regrasExtraMestre,
  vilaExtra: vilaExtraMestre,
  vilaRodape: vilaRodapeMestre,
  views: [
    ["inicio", "Início", "casa"], ["regras", "Regras", "prancheta"], ["niveis", "Níveis", "cima"], ["grimorios", "Grimórios", "livro"], ["bestiario", "Bestiário", "pata"],
    ["vilarejos", "Vilarejos", "pino"], ["mapa", "Mapa", "bussola"], ["cenarios", "Cenários", "bussola"], ["acao", "Ação", "espada"], ["itens", "Itens", "mochila"], ["sorteio", "Sorteio", "estrela"], ["jogadores", "Jogadores", "grupo"], ["sessao-zero", "Sessão Zero", "grupo"], ["mestre", "Mestre", "cadeado"]
  ],

  iniciar: function (d) {
    jogs = d.jogadores || [];
    sorteio = null;
    if (d.campo) CAMPO = d.campo;
    marcarEventosVistos(); /* o histórico que já existe ao entrar não dispara aviso */
    /* Os cenários precisam estar carregados antes de sincronizar o mapa dos jogadores, ou os vínculos se perderiam. */
    ENVIADAS = d.enviadas || [];
    aplicarCampo();
    sincronizarPub();
  },

  antes: function (r) {
    if (r !== "sorteio") cer.ativa = false;
    if ((r === "jogadores" || r === "itens" || r === "acao") && ultimaRota !== r) atualizarJogadores();
    if (r !== "acao" && campoRodando) pararCampoPoll();
    ultimaRota = r;
  },

  depois: function (r) {
    if (r === "grimorios") desenharGrimorios();
    if (r === "bestiario") desenharBestiario();
    if (r === "acao") { renderAcaoUI(); iniciarCampoPoll(); }
    if (r === "cenarios") desenharCenPreview();
  },

  change: function (el) {
    var d = el.dataset || {};
    if (el.id === "dropJog") { dropAlvo = el.value; return; }
    if (changeItens(el)) return;
    if (el.id === "cenaUp") { enviarCenario(el); return; }
    if (el.id === "cenaTroca") { trocarFotoCenario(el); return; }
    if (el.id === "gridUp") { enviarGrid(el); return; }
    if (el.dataset.gtroca) { trocarImagemGrid(el); return; }
    if (changeAcao(el)) return;
    if (el.classList.contains("chk")) setCheck(d.key, parseInt(d.i, 10), el.checked);
    else if (el.classList.contains("rev")) { setRev(d.id, el.checked); desenharMapa(); }
    else if (d.campo !== undefined) salvarCampo(el);
    else if (d.jatr || d.jbonus) {
      var jf = achaJog(jogSel);
      if (jf) {
        var cp = d.jatr ? "atr" : "bonus", ka = d.jatr || d.jbonus;
        jf[cp] = jf[cp] || {};
        jf[cp][ka] = parseInt(el.value, 10) || 0;
        if (cp === "atr" && !jf.atrTravado) jf.atrTravado = true;
        salvarJog(jf, true, [cp, "atrTravado"]);
        if (EST.acao) salvarAcao();
        renderizar();
      }
    }
    else if (d.jtrav !== undefined) {
      var jt = achaJog(jogSel);
      if (jt) {
        if (!el.checked && !window.confirm("Destravar apaga a base atual e o jogador distribui os 5 pontos de novo. Continuar?")) { el.checked = true; return; }
        jt.atrTravado = el.checked;
        /* Destravar devolve os 5 pontos para o jogador distribuir de novo. */
        if (!el.checked) jt.atr = null;
        salvarJog(jt, true, ["atrTravado", "atr"]);
        renderizar();
      }
    }
    else if (d.jf || d.obs) salvarCampoJog(el);
    else if (el.id === "jogImg") importarImagem(el);
    else if (d.jconta !== undefined) vincularConta(el);
    else if (d.jgrimrev !== undefined) {
      var j = achaJog(jogSel);
      if (j) { j.grimRev = el.checked; salvarJog(j, true, ["grimRev"]); }
    }
    else if (d.cenlib) { setCenLiberado(parseInt(d.cenlib, 10), el.checked); renderizar(); }
    else if (d.loccen) { vincularLocal(d.loccen, el.value ? parseInt(el.value, 10) : 0); renderizar(); }
    else if (d.cenloc) {
      var cid = parseInt(d.cenloc, 10), antigo = localDoCenario(cid);
      if (antigo) vincularLocal(antigo, 0);
      if (el.value) vincularLocal(el.value, cid);
      renderizar();
    }
    else if (el.id === "mapaUp") enviarImagem(el, "mapa", "");
    else if (d.imglib) {
      var im = acharImg(parseInt(d.imglib, 10));
      if (im) { im.liberado = el.checked; gravar("img_editar", { id: im.id, liberado: im.liberado }); }
    }
  },

  input: function (el) {
    var d = el.dataset || {};
    if (inputItens(el)) return;
    if (inputCenarios(el)) return;
    if (inputAcao(el)) return;
    if (el.id === "busca") { filtro.q = el.value; desenharGrimorios(); }
    if (d.jf || d.obs) salvarCampoJog(el);
    if (d.imgtit) {
      var im = acharImg(parseInt(d.imgtit, 10));
      if (im) { im.titulo = el.value; adiar("imgtit-" + im.id, function () { gravar("img_editar", { id: im.id, titulo: im.titulo }); }); }
    }
  },

  click: function (b) {
    if (acoesQuestionario(b)) return true;
    if (acoesDrops(b)) return true;
    if (acoesItens(b)) return true;
    if (clickCenarios(b)) return true;
    if (clickAcao(b)) return true;
    if (acoesSorteio(b)) return true;
    if (acoesJog(b)) return true;
    if (acoesLib(b)) return true;
    if (b.dataset.imgdel) { excluirImg(parseInt(b.dataset.imgdel, 10)); return true; }
    if (b.id === "importarLocal") { importarLocal(); return true; }
    if (b.id === "abrirMestre") { mestreAberto = true; renderizar(); return true; }
    if (b.id === "fecharMestre") { mestreAberto = false; renderizar(); window.scrollTo(0, 0); return true; }
    if (b.id === "btnMesa") { modoMesa = !modoMesa; renderizar(); return true; }
    if (b.id === "btnMestre") { mestreAberto = !mestreAberto; renderizar(); return true; }
    if (b.dataset.attr) {
      filtro.attr = b.dataset.attr;
      document.querySelectorAll("#fAttr .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.attr === filtro.attr)); });
      desenharGrimorios();
      return true;
    }
    if (b.dataset.papel) {
      filtro.papel = b.dataset.papel;
      document.querySelectorAll("#fPapel .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.papel === filtro.papel)); });
      desenharGrimorios();
      return true;
    }
    if (b.dataset.elem) {
      filtro.elem = b.dataset.elem;
      document.querySelectorAll("#fElem .chip, #fTipo .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.elem === filtro.elem)); });
      desenharGrimorios();
      return true;
    }
    if (b.dataset.fase) {
      filtroBest = b.dataset.fase;
      document.querySelectorAll("#fFase .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.fase === filtroBest)); });
      desenharBestiario();
      return true;
    }
    return false;
  }
};

/* Esc cancela a seleção do token na aba Ação. */
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && tokSel && rotaAtual() === "acao" && MESTRE) limparSelecao();
});
