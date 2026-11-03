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
      fu(1, "Interpor-se", 1, "reação", "Quando um inimigo acerta um aliado perto de você, você recebe o golpe no lugar dele e reduz o dano pelo Poder +1. Uma vez por rodada."),
      fu(2, "Pele de Ferro", 2, "médio", "Por 2 turnos, +2 de redução de dano e você não pode ser empurrado nem derrubado."),
      fu(3, "Descarga", 2, "médio", "Gasta todas as Cargas. d20 + Poder, dano 1d6 mais 1d4 por Carga gasta."),
      fu(4, "Última Muralha", "passiva", "passiva", "Uma vez por combate, ao cair a 0 de Vida, você fica com 1, ganha 2 Cargas e os aliados próximos ganham +1 nas rolagens por 1 rodada.")
    ],
    nota: "Cargas: 1 Carga vira +1d4 de dano no próximo ataque, ou 1 de mana, ou +1 de redução de dano até o fim da rodada." },

  { nome: "Grimório do Espelho", attr: "destreza", papel: "Tank", sub: "tank Esquiva", tier: "",
    spells: [
      sp("Corte Rápido", 1, "ataque simples", "d20 + Destreza, dano 1d6. Se acertar, ganha +1 de Defesa até o início do próximo turno."),
      sp("Aparar", "reação", "reação", "Quando um inimigo acerta um aliado perto de você, antes do dano, role d20 + Destreza contra o total do ataque dele (empate favorece você). Sucesso: o ataque é cancelado. Falha: acerta o aliado normalmente. Em ambos os casos, você perde a ação do próximo turno (ainda pode se mover)."),
      sp("Refletir", "reação", "reação", "Contra um ataque mágico. d20 + Destreza contra a dificuldade do feitiço (12, 15 ou 18). Sucesso: o feitiço volta contra quem lançou. Falha: o feitiço atinge o alvo, você perde o próximo turno inteiro e 2 de mana."),
      sp("Dança dos Reflexos", 4, "ultimate", "Por 3 turnos, +3 de Defesa. Todo inimigo que errar um ataque contra você sofre 1d6 de contra-ataque.")
    ],
    futuras: [
      fu(1, "Passo Evasivo", 2, "médio", "+2 de Defesa até o fim da próxima rodada e troca de lugar com um aliado perto de você."),
      fu(2, "Isca", 2, "provocar sutil", "Escolha um inimigo. Até o próximo turno dele, os ataques dele contra qualquer alvo que não seja você têm -3. Você ganha +1 de Defesa."),
      fu(3, "Contra-golpe", "reação", "melhora de Aparar", "Se você aparar com margem de 5 ou mais, ataca o inimigo de graça: d20 + Destreza, dano 1d6."),
      fu(4, "Espelho Perfeito", 4, "ultimate", "Uma vez por combate. Por 1 rodada, todo feitiço inimigo contra você ou aliados próximos é refletido sem teste, mas você não age no próximo turno.")
    ],
    nota: "Aparar e Refletir só funcionam uma vez por rodada, porque custam o próximo turno. Feitiços em área só protegem você mesmo." },

  { nome: "Grimório de Chamas", attr: "poder", papel: "Dano", sub: "dano e fogo contínuo", tier: "",
    spells: [
      sp("Faísca", 1, "ataque simples", "d20 + Poder, dano 1d6."),
      sp("Chama Persistente", 2, "médio", "d20 + Poder, dano 1d4. Se acertar, o alvo fica em chamas e sofre 2 de dano por turno durante 2 turnos.", { aplica: ["Em chamas"], dot: dotRes("Destreza", 12) }),
      sp("Muralha de Fogo", 2, "médio", "Cria uma barreira por 2 turnos. Quem atravessar sofre 1d6. Não precisa de rolagem de ataque."),
      sp("Explosão Solar", 4, "ultimate", "Todos os inimigos próximos fazem teste contra a Defesa. Quem for atingido sofre 2d8.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Luz Curativa", attr: "inteligencia", papel: "Suporte", sub: "suporte e cura", tier: "",
    spells: [
      sp("Raio de Luz", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Toque Calmo", 1, "básico", "Cura 1d6 de vida em um aliado."),
      sp("Escudo de Luz", 2, "médio", "O aliado ganha +2 de Defesa até o fim da próxima rodada."),
      sp("Bênção Radiante", 4, "ultimate", "Cura 1d8 em todos os aliados e dá +1 em todas as rolagens deles por 2 turnos.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Sombras", attr: "destreza", papel: "Suporte", sub: "furtividade", tier: "",
    spells: [
      sp("Farpa Sombria", 1, "ataque simples", "d20 + Destreza, dano 1d4."),
      sp("Passo Sombrio", 1, "básico", "Fica invisível até atacar ou até o fim da próxima rodada."),
      sp("Lâmina Oculta", 2, "médio", "d20 + Destreza, dano 1d8. Se o alvo não te viu, o dano dobra."),
      sp("Eclipse", 4, "ultimate", "Todos os inimigos próximos ficam cegos por 2 turnos (-3 nas rolagens de ataque).")
    ], futuras: [], nota: "Eclipse é forte para 4 de mana. Se virar problema, limite a 1 uso por combate." },

  { nome: "Grimório de Vento", attr: "destreza", papel: "Suporte", sub: "mobilidade e precisão", tier: "",
    spells: [
      sp("Rajada", 1, "básico", "d20 + Destreza, dano 1d6, alcance longo."),
      sp("Passo do Vento", 2, "médio", "Move até o dobro do deslocamento e ganha +2 de Defesa até a próxima rodada."),
      sp("Corrente Ascendente", 4, "ultimate", "Por 2 turnos, você e os aliados próximos voam: ignoram o terreno e os inimigos corpo a corpo têm -3 para acertá-los.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Correntes", attr: "inteligencia", papel: "Suporte", sub: "controle", tier: "",
    spells: [
      sp("Chicote de Corrente", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Laço", 1, "básico", "Teste de Inteligência contra a Defesa do inimigo. Se acertar, o alvo perde 3 de deslocamento."),
      sp("Prisão de Aço", 2, "médio", "Prende um inimigo por 1 turno (ele não age). Teste de Inteligência contra a Defesa dele."),
      sp("Jaula Total", 4, "ultimate", "Prende até 3 inimigos por 1 turno.")
    ], futuras: [], nota: "Jaula Total é muito forte. Se virar problema, limite a 1 uso por combate." },

  { nome: "Grimório de Reforço", attr: "poder", papel: "Dano", sub: "fortalecimento", tier: "",
    spells: [
      sp("Soco Reforçado", 1, "ataque simples", "d20 + Poder, dano 1d6."),
      sp("Punho Pesado", 1, "básico", "O próximo ataque físico causa +1d6 de dano."),
      sp("Golpe Duplo", 2, "médio", "Ataca duas vezes o mesmo alvo: d20 + Poder para cada ataque, dano 1d4 em cada um."),
      sp("Fúria Titânica", 4, "ultimate", "Por 3 turnos, +2 em todas as rolagens de Poder e +2 de dano.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Água", attr: "inteligencia", papel: "Suporte", sub: "controle e suporte", tier: "",
    spells: [
      sp("Jato D’água", 1, "básico", "d20 + Inteligência, dano 1d4 e empurra o alvo 1 casa."),
      sp("Maré Protetora", 2, "médio", "Um aliado ganha 1d6 de vida temporária."),
      sp("Dilúvio", 4, "ultimate", "Todos os inimigos próximos fazem teste de Poder contra 13. Quem falhar é arrastado 3 casas e cai (-2 de Defesa até o fim da próxima rodada).")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Raios", attr: "destreza", papel: "Dano", sub: "dano e velocidade", tier: "",
    spells: [
      sp("Choque", 1, "básico", "d20 + Destreza, dano 1d6."),
      sp("Relâmpago Veloz", 3, "médio", "Age duas vezes neste turno, mas só pode usar feitiços de 1 mana.", { limite: "1 uso por combate" }),
      sp("Tempestade Trovejante", 4, "ultimate", "d20 + Destreza contra até 3 inimigos, dano 1d10 em quem for atingido.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Terra", attr: "poder", papel: "Suporte", sub: "defesa e controle", tier: "",
    spells: [
      sp("Estaca de Pedra", 1, "básico", "d20 + Poder, dano 1d6."),
      sp("Muro de Terra", 2, "médio", "Cria uma barreira que bloqueia a passagem por 2 turnos (Vida 10)."),
      sp("Terremoto", 4, "ultimate", "Os inimigos próximos sofrem 1d6. Quem falhar em um teste de Destreza contra 12 fica caído: deslocamento 0 e -2 de Defesa até o fim da próxima rodada.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Ilusão", attr: "inteligencia", papel: "Suporte", sub: "furtividade e engano", tier: "",
    spells: [
      sp("Lâmina Ilusória", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Miragem", 1, "básico", "Cria uma cópia falsa. O primeiro ataque do inimigo vai nela."),
      sp("Voz Enganosa", 2, "médio", "Um inimigo faz teste de Inteligência contra 13. Se falhar, ataca outro inimigo ou perde o turno."),
      sp("Mundo Falso", 4, "ultimate", "Todos os inimigos próximos erram automaticamente o próximo ataque.")
    ], futuras: [], nota: "Mundo Falso é forte demais. Limite a 1 uso por combate, ou faça só até 2 inimigos errarem." },

  { nome: "Grimório Antimagia", attr: "poder", papel: "Suporte", sub: "lendário", tier: "lendário",
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
      sp("Parada no Tempo", 4, "ultimate", "Um inimigo escolhido perde a próxima rodada inteira.")
    ], futuras: [], nota: "" },

  { nome: "Grimório de Espíritos", attr: "inteligencia", papel: "Suporte", sub: "conjuração", tier: "",
    spells: [
      sp("Toque Espectral", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Servo Etéreo", 1, "básico", "Invoca um espírito (Vida 5, Defesa 10) que ataca com +2, dano 1d4. Dura até ser derrotado."),
      sp("Guardião Espiritual", 2, "médio", "Um aliado ganha +1d4 de redução de dano no próximo golpe."),
      sp("Legião Fantasma", 4, "ultimate", "Invoca 3 espíritos por 3 turnos.")
    ], futuras: [], nota: "Legião Fantasma gera muitos ataques. Se a mesa ficar lenta, limite a 2 espíritos." },

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
      sp("Marca da Retribuição", 1, "básico", "Marca um inimigo. Na próxima vez que ele ferir um aliado, ele sofre 1d6 de dano radiante (uma vez).", { aplica: ["Marcado"] }),
      sp("Julgamento", 2, "médio", "d20 + Poder, dano 1d8. Contra um inimigo que já feriu um aliado neste combate, o dano é 2d6."),
      sp("Sol da Sentença", 4, "ultimate", "Todos os inimigos próximos sofrem 2d6. Cada aliado ferido neste combate recupera 1d4 de vida.")
    ], futuras: [], nota: "O oposto da Luz Curativa: em vez de curar, pune quem machuca o grupo." },

  { nome: "Grimório das Raízes", attr: "inteligencia", papel: "Suporte", sub: "cura e controle", elem: "Natureza", tier: "",
    spells: [
      sp("Espinho", 1, "ataque simples", "d20 + Inteligência, dano 1d4."),
      sp("Semente Vital", 1, "básico", "Um aliado recupera 1 de vida no início de cada turno dele, por 3 turnos."),
      sp("Raízes Prendedoras", 2, "médio", "Teste de Inteligência contra a Defesa do alvo. Se acertar, ele fica preso por 2 turnos e sofre 1 de dano por turno enquanto preso.", { aplica: ["Preso"], dot: dotRes("Poder", 12) }),
      sp("Floresta Viva", 4, "ultimate", "Por 3 turnos, uma floresta cobre a área: os aliados recuperam 1d4 de vida por turno e os inimigos dentro dela perdem 2 de deslocamento.")
    ], futuras: [], nota: "Fogo queima as raízes. Água faz a Semente Vital curar mais (decisão do mestre)." },

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
      sp("Jackpot", 4, "ultimate", "Role 2d6. Com 2 a 4, nada acontece e você perde 2 de mana. Com 5 a 9, os aliados recuperam 2 de mana. Com 10 a 12, os aliados recuperam 4 de mana e os inimigos próximos perdem a próxima ação.")
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
    nota: "Evita golpes sem precisar parar de agir. Molhado combina com Raios (decisão do mestre)." }
];

var ELEM_EXISTENTES = {
  "Grimório da Fortaleza": "Terra", "Grimório do Espelho": "Reflexo", "Grimório de Chamas": "Fogo", "Grimório de Luz Curativa": "Luz",
  "Grimório de Sombras": "Sombra", "Grimório de Vento": "Vento", "Grimório de Correntes": "Metal", "Grimório de Reforço": "Corpo",
  "Grimório de Água": "Água", "Grimório de Raios": "Raio", "Grimório de Terra": "Terra", "Grimório de Ilusão": "Mente",
  "Grimório Antimagia": "Antimagia", "Grimório de Veneno": "Veneno", "Grimório de Gravidade": "Cosmos", "Grimório do Tempo": "Cosmos",
  "Grimório de Espíritos": "Espírito", "Grimório de Sangue": "Sangue"
};
var EXTRAS_EXISTENTES = {
  "Dardo Tóxico": { aplica: ["Envenenado"], dot: dotRes("Poder", 12) },
  "Névoa Verde": { aplica: ["Envenenado"], dot: dotSem() },
  "Antídoto Reverso": { aplica: ["Envenenado"], dot: dotRes("Poder", 12) },
  "Jato D’água": { aplica: ["Molhado"] },
  "Dilúvio": { aplica: ["Molhado"] },
  "Choque": { aplica: ["Chocado"] },
  "Tempestade Trovejante": { aplica: ["Chocado"] },
  "Laço": { aplica: ["Lento"] },
  "Peso Morto": { aplica: ["Lento"] },
  "Prisão de Aço": { aplica: ["Preso"] },
  "Jaula Total": { aplica: ["Preso"] },
  "Eclipse": { aplica: ["Cego"] },
  "Muralha de Fogo": { aplica: ["Em chamas"] }
};
var NIVEL3 = {
  "Grimório de Chamas": fu(2, "Lança Incandescente", 3, "médio", "d20 + Poder, dano 2d6 em todos os inimigos em uma linha de até 4 casas.", { aplica: ["Em chamas"] }),
  "Grimório de Luz Curativa": fu(2, "Segunda Chance", 3, "médio", "Um aliado que caiu a 0 de Vida volta com 1d6 de vida.", { limite: "1 uso por combate" }),
  "Grimório de Sombras": fu(2, "Fundir-se", 2, "médio", "Você entra na sombra de uma criatura e sai de outra sombra a até 6 casas, invisível até atacar."),
  "Grimório de Vento": fu(2, "Impulso", 2, "médio", "Um aliado se move o dobro do deslocamento e o próximo ataque dele ganha +2 na rolagem."),
  "Grimório de Correntes": fu(2, "Elo de Aço", 2, "médio", "Liga você a um aliado por 2 turnos: o dano que ele sofrer é dividido entre vocês dois."),
  "Grimório de Reforço": fu(2, "Salto Demolidor", 3, "médio", "Salta até 6 casas e cai sobre um inimigo: d20 + Poder, dano 2d6. Os inimigos ao lado do alvo sofrem 1d6."),
  "Grimório de Água": fu(2, "Bolha", 2, "médio", "Prende um alvo numa bolha por 1 turno. Um aliado dentro não sofre dano, mas não age. Um inimigo dentro não age e fica molhado.", { aplica: ["Molhado"] }),
  "Grimório de Raios": fu(2, "Corrente Elétrica", 2, "médio", "d20 + Destreza, dano 1d8. O raio salta para outro inimigo próximo, que sofre metade do dano.", { aplica: ["Chocado"] }),
  "Grimório de Terra": fu(2, "Armadilha de Pedra", 2, "médio", "Esconde uma armadilha em uma casa. O primeiro inimigo que pisar nela sofre 2d6 e fica preso por 1 turno.", { aplica: ["Preso"] }),
  "Grimório de Ilusão": fu(2, "Pânico", 2, "médio", "Um inimigo faz teste de Inteligência contra 13. Se falhar, ele se afasta o máximo que puder dos jogadores até o fim do próximo turno dele."),
  "Grimório Antimagia": fu(2, "Zona Nula", 3, "médio", "Cria uma área por 2 turnos onde nenhum feitiço pode ser lançado e os estados mágicos são removidos de quem estiver dentro."),
  "Grimório de Veneno": fu(2, "Veneno Paralisante", 2, "médio", "d20 + Destreza, dano 1d4. Se acertar, o alvo faz teste de Poder contra 13 ou fica com deslocamento 0 por 1 turno.", { aplica: ["Lento"] }),
  "Grimório de Gravidade": fu(2, "Leveza Forçada", 2, "médio", "Teste de Inteligência contra a Defesa do alvo. Se acertar, o inimigo flutua por 1 turno, com deslocamento 0 e -3 de Defesa."),
  "Grimório do Tempo": fu(2, "Eco do Tempo", 2, "médio", "Um aliado repete o último feitiço de 1 mana que usou, sem gastar mana."),
  "Grimório de Espíritos": fu(2, "Possessão Benigna", 3, "médio", "Um espírito entra em um aliado por 2 turnos: ele ganha +2 em todas as rolagens e +2 de dano. Você não pode invocar outro espírito nesse período."),
  "Grimório de Sangue": fu(2, "Lâmina de Sangue", 2, "médio", "d20 + Poder, dano 2d6. Você pode pagar 3 de Vida para causar +1d6."),
  "Grimório do Gelo": fu(2, "Lança Gélida", 3, "médio", "d20 + Destreza, dano 2d6. Se o alvo estiver lento ou molhado, ele fica congelado por 1 turno.", { aplica: ["Congelado"] }),
  "Grimório da Luz Vingativa": fu(2, "Escudo Penitente", 2, "médio", "Um aliado ganha +2 de Defesa até o fim da próxima rodada. Quem o atacar sofre 1d4 de dano radiante."),
  "Grimório das Raízes": fu(2, "Círculo de Espinhos", 2, "médio", "Cria um círculo de espinhos ao seu redor por 2 turnos: os inimigos que entrarem sofrem 1d6 e perdem 2 de deslocamento."),
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
    sp("Forma Instável", "passiva", "passiva", "No início do turno dele, role d4: 1 fogo (o ataque deixa em chamas), 2 água (molhado), 3 raio (chocado), 4 gelo (lento).")
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
    sp("Cabeça de Raio", "passiva", "ataque", "d20 + 6 contra um alvo, dano 2d6 e o alvo fica chocado.", { aplica: ["Chocado"] }),
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
    ["Grimórios de tank criados (Fortaleza e Espelho)", true],
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
  var rev = getRev();
  return LOCAIS.filter(function (l) { return !l.secreto && rev[l.id]; }).map(function (l) {
    return { id: l.id, nome: l.nome, tipo: l.tipo, x: l.x, y: l.y, lab: l.lab, pub: l.pub };
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
    '<div class="stat"><b>' + ELEMS.length + '</b>elementos</div>' +
    '<div class="stat"><b>' + INIMIGOS.length + '</b>inimigos</div>' +
    '<div class="stat"><b>' + VILAREJOS.length + '</b>vilarejos</div>' +
    '<div class="stat"><b>8</b>jogadores</div></div>' +
    '<div class="cols">' +
    panel("O conceito", "<ul><li>Mundo inspirado em Black Clover, com magia e cavaleiros mágicos.</li><li>Todo personagem é um plebeu de vilarejo.</li><li>O grimório é sorteado em um evento com cards físicos.</li><li>Rolagens são presenciais, com dados físicos.</li></ul>") +
    panel("O sistema", "<ul><li>Três atributos: Poder, Destreza e Inteligência.</li><li>Rolagem: d20 + atributo contra uma dificuldade.</li><li>Vida 20, Mana 10, Defesa 10 + Destreza.</li><li>Poder reduz o dano que você recebe.</li></ul>") +
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
    '<p class="lead">Cada grimório tem um papel (Dano, Tank ou Suporte, que inclui cura, controle e utilidade) e feitiços de 1, 2 e 4 de mana. Cada grimório ganha uma nova habilidade no nível 3, e os tanks ganham uma a cada nível (veja a aba Níveis). Passe o mouse (ou toque) sobre a descrição de um feitiço para ver os valores mínimo e máximo dos dados.</p>' +
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
    ["todos"].concat(ELEMS).map(function (e) {
      return '<button type="button" class="chip" data-elem="' + e + '" aria-pressed="' + (filtro.elem === e) + '">' + (e === "todos" ? "Todos" : e) + "</button>";
    }).join("") + "</div></div></div>" +
    '<p id="contagem" role="status"></p><div class="grid" id="grid"></div>';
  return h;
}

function desenharGrimorios() {
  var q = filtro.q.trim().toLowerCase();
  var lista = GRIMORIOS.filter(function (g) {
    if (filtro.attr !== "todos" && g.attr !== filtro.attr) return false;
    if (filtro.papel !== "todos" && g.papel !== filtro.papel) return false;
    if (filtro.elem !== "todos" && g.elem !== filtro.elem) return false;
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
  return h + "</article>";
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
    '<p id="contaBest" role="status">' + publicos + " inimigos neste bestiário.</p>" +
    '<div id="listaMonstros"></div>' +
    panel("Notas", "<ul><li>Como o jogador subtrai o Poder do dano, os inimigos precisam de dano um pouco mais alto do que parece. Se ninguém perde vida, suba o dado de dano um degrau.</li><li>Se o combate estiver fácil demais, aumente a Vida ou o Ataque. Se estiver difícil, reduza a Defesa.</li><li>Alguns inimigos têm redução de dano. Ela se aplica antes de tirar a Vida, e o dano mínimo continua sendo 1.</li><li>Para outros níveis, veja a tabela de referência na aba Níveis.</li></ul>");
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
    panel("O sistema em 5 minutos", "<ul><li>Três atributos: Poder, Destreza, Inteligência.</li><li>Rolagem: d20 + atributo contra uma dificuldade (fácil 10, média 15, difícil 20).</li><li>O inimigo acerta se rolar a sua Defesa (10 + Destreza) ou mais. O Poder reduz o dano.</li><li>Mana 10 para todos. Feitiços custam 1, 2 ou 4.</li><li>Regra de ouro: se algo travar, o mestre decide rápido e ajusta depois.</li></ul>") +
    panel("Acordos de mesa (10 min)", "<ul><li><b>Linhas e véus:</b> o que não pode aparecer, e o que acontece só “fora da cena”.</li><li><b>Segurança:</b> qualquer pessoa pode pedir uma pausa, sem explicar.</li><li><b>Drama de personagem:</b> diga “durante a campanha, algum personagem pode ser tentado, enganado, ferido ou perder o controle por um tempo. Isso é parte da história, não punição. Vocês topam?”</li><li><b>Cooperativo:</b> sem jogador contra jogador de verdade.</li><li>Celular guardado durante as cenas.</li><li>Como lidar com ausências.</li><li>Ninguém lê material do mestre.</li></ul>") +
    panel("Criar o personagem (30 min)", "<p>Com 8 jogadores, deixe 2 por vilarejo: eles criam juntos e já nascem com um laço.</p><ol><li>Escolher o vilarejo e anotar o bônus.</li><li>Nome, idade, um sonho e um medo.</li><li>Distribuir +5 pontos (máximo +3 em um), <b>antes de ver o grimório</b>.</li><li>Anotar Vida 20, Mana 10, Defesa 10 + Destreza e redução de dano igual ao Poder.</li><li>Deixar o grimório em branco para a revelação.</li></ol>") +
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

  h += "<h2>Inimigos secretos</h2>" + "<p>Os agentes e os controlados pela organização. Os números são para 4 jogadores (veja a regra para 8 no Bestiário).</p>" + '<div class="cols">' + INIMIGOS.filter(function (m) { return m.segredo; }).map(monstroCard).join("") + "</div>";

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
    "Um vilarejo agrícola e pacífico, cercado de plantações. Os moradores são fortes de tanto trabalhar na terra (+1 em Poder para esforço).",
    { ganchos: ["As plantações estão sendo atacadas por criaturas de mana"],
      inimigos: ["Espantalho de Mana", "Javali de Mana", "Devorador de Colheitas"],
      segredo: "A criatura foi solta de propósito pelo primeiro infiltrado (o curandeiro ou fazendeiro que ajuda depois do ataque)." }),
  lo("porto", "Porto Salgado", "vilarejo", 848, 300, [-16, -14, "end"], "Arco 1",
    "Um vilarejo pesqueiro e de comércio, cheio de viajantes e contrabando. As pessoas são falantes e espertas (+1 em Inteligência para negociar e conseguir informação).",
    { ganchos: ["Um navio misterioso atracou ao largo e ninguém desceu"],
      inimigos: ["Marujo Afogado", "Caranguejo Blindado", "Polvo da Maré", "Serpente das Marés"],
      segredo: "O navio é do segundo infiltrado (o comerciante ou capitão). Os marinheiros são pessoas marcadas." }),
  lo("floresta", "Floresta dos Cedros", "vilarejo", 232, 352, [0, -18, "middle"], "Arco 1",
    "Um vilarejo de caçadores, isolado entre as árvores. Os moradores são rastreadores (+1 em Destreza para furtividade e rastreio).",
    { ganchos: ["Caçadores estão desaparecendo na mata"],
      inimigos: ["Aranha Tecelã", "Raposa Sombria", "Árvore Desperta", "Cervo Ancestral"],
      segredo: "Os caçadores sumiram por ordem do terceiro infiltrado (o caçador-guia que oferece ajuda na mata)." }),
  lo("pedra", "Pedra Velha", "vilarejo", 300, 188, [0, 28, "middle"], "Arco 1",
    "Um vilarejo de mineradores, perto das ruínas. A gente é teimosa e resistente, e já ouviu histórias do que existe nas minas (+1 em Inteligência para ruínas, símbolos e magia antiga).",
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
    "Ruínas de uma civilização de magos, cobertas de símbolos que ninguém sabe ler. O bônus de Pedra Velha ajuda a decifrar. Um guardião protege a entrada.",
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
    if (g.nome === "Grimório Antimagia") return false;
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
    '<button type="button" id="copiarJogs"' + (jogs.length ? "" : " disabled") + ">Copiar anotações</button></div>" +
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
    fichaJog(j) +
    '<label>Descrição<textarea class="sorteio-in" rows="4" data-jf="descricao">' + esc(j.descricao) + "</textarea></label>" +
    '<label>Sonho ou objetivo<textarea class="sorteio-in" rows="3" data-jf="sonho">' + esc(j.sonho) + "</textarea></label>" +
    '<label>Medo ou fraqueza<textarea class="sorteio-in" rows="3" data-jf="medo">' + esc(j.medo) + "</textarea></label>" +
    acessoJog(j) +
    '<div class="pj-moral"><p class="pj-rotulo">Moralidade' + (j.etica && j.moral ? ": <b>" + moralNome(j.etica, j.moral) + "</b>" : "") + "</p>" + moralGrid(j) +
    '<p class="mdica">Toque de novo na opção escolhida para limpar.</p></div></div></div>';
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
    '<label class="rev-label"><input type="checkbox" data-jtrav="1"' + (j.atrTravado ? " checked" : "") + '> Atributos travados (o jogador não altera mais a base)</label>' +
    '<p class="mdica">Defesa ' + (10 + atrTotal(j, "destreza")) + ", redução de dano " + atrTotal(j, "poder") + ", deslocamento " + (6 + Math.floor(atrTotal(j, "destreza") / 2)) + ", vida " + VIDA_NIVEL[n - 1] + ", mana " + MANA_NIVEL[n - 1] + '. Desmarque “travados” para o jogador redistribuir os 5 pontos, se precisar corrigir.</p></fieldset>';
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
    '<label>Grimório<select class="sorteio-in" data-jf="grim"><option value="">Sem grimório</option>' + opcoes(GRIMORIOS.map(function (g) { return g.nome; }), j.grim || "", false) + "</select></label>" +
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
  var lista = ["novoJog", "importarJog", "voltarJog", "excluirJog", "addObs", "removerImg", "copiarJogs"];
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


function regrasExtraMestre() {
  var h = "";
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
  return h;
}

var GANCHOS_VILA = {"Vale das Colheitas": "As plantações estão sendo atacadas por criaturas de mana.", "Porto Salgado": "Um navio misterioso atracou e ninguém desceu.", "Floresta dos Cedros": "Caçadores estão desaparecendo na mata.", "Pedra Velha": "Uma mina foi lacrada depois de um tremor estranho."};
var BONUS_VILA = {"Vale das Colheitas": "+1 em testes de Poder para carregar, empurrar ou aguentar esforço.", "Porto Salgado": "+1 em testes de Inteligência para negociar ou conseguir informação.", "Floresta dos Cedros": "+1 em testes de Destreza para furtividade e rastreio.", "Pedra Velha": "+1 em testes de Inteligência para ruínas, símbolos e magia antiga."};
function vilaExtraMestre(v) { return "<p><b>Bônus:</b> " + BONUS_VILA[v.nome] + "</p><p><b>Gancho:</b> " + GANCHOS_VILA[v.nome] + "</p>"; }
function vilaRodapeMestre() {
  return panel("Para equilibrar", "<p>Hoje são +1 em Poder, +1 em Destreza e +2 em Inteligência (Porto Salgado e Pedra Velha). Se quiser, troque um dos bônus de Inteligência por Poder ou Destreza.</p>");
}

/* ============================ AÇÃO ============================ */

var CENAS = null, ENVIADAS = [], cenasMsg = "", tokSel = null, confirmarLimpar = false, confirmarDelCena = false, upMsg = "";
/* Posições e combate vêm do servidor (campo), que é quem manda: o mestre e os jogadores agem ao mesmo tempo. */
var CAMPO = { pos: {}, combate: null, revelados: {}, eventos: [], v: 0 };
var campoTimer = null, campoGer = 0, campoRodando = false, arrastando = false;
var TIPOS_TOKEN = [["jogador", "Jogador"], ["aliado", "Aliado"], ["inimigo", "Inimigo"]];

function nomeBonito(n) { return String(n).replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/^./, function (c) { return c.toUpperCase(); }); }
function acaoEst() { var a = EST.acao || (EST.acao = {}); a.tokens = a.tokens || []; return a; }
function acharEnvio(id) { var r = null; ENVIADAS.forEach(function (c) { if (c.id === id) r = c; }); return r; }
/* Grid do cenário ativo: o de um cenário enviado fica na própria linha dele; o de uma pasta, em EST.grids. */
function gridDe(a) {
  if (a.envio) return acharEnvio(a.envio) || {};
  var g = EST.grids || (EST.grids = {}), k = a.local && a.cena ? a.local + "/" + a.cena : "";
  if (!k) return {};
  return g[k] || (g[k] = {});
}
function cenaImgUrl(a) {
  return API + "?a=cena_img&" + (a.envio ? "id=" + encodeURIComponent(a.envio) : "local=" + encodeURIComponent(a.local) + "&cena=" + encodeURIComponent(a.cena));
}
function acharTok(id) { var r = null; acaoEst().tokens.forEach(function (t) { if (t.id === id) r = t; }); return r; }

/* Deslocamento: 6 casas, mais 1 a cada 2 pontos de Destreza. "aj" é um ajuste manual (por exemplo, -2 se estiver lento).
   Jogadores ligados a um perfil usam a Destreza do perfil (aba Jogadores); os outros usam a do próprio token. */
function tokDex(t) {
  var j = t.jog ? achaJog(t.jog) : null;
  if (j) return j.atr ? atrTotal(j, "destreza") : (parseInt(j.destreza, 10) || 0);
  var v = parseInt(t.dex, 10);
  return isNaN(v) ? 0 : v;
}
function deslTok(t) { return Math.max(0, 6 + Math.floor(tokDex(t) / 2) + (parseInt(t.aj, 10) || 0)); }
function movel(t) { return t.tipo !== "armadilha"; }

/* Grava a cena. O deslocamento vai calculado junto, para o jogador ver o do próprio personagem sem conhecer a Destreza. */
/* Grava a cena (sem as posições, que ficam no campo). O deslocamento vai calculado junto, para o jogador ver o do
   próprio personagem sem conhecer a Destreza. Também vai o tamanho do grid, que o servidor usa para conferir os movimentos. */
function salvarAcao() {
  var a = acaoEst();
  a.tokens.forEach(function (t) { if (movel(t)) t.desl = deslTok(t); });
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
function atualId() {
  var cb = CAMPO.combate;
  return cb && cb.fase === "turnos" ? (cb.ordem || [])[cb.turno] || null : null;
}

function carregarCenas() {
  cenasMsg = "";
  api("cenas").then(function (r) {
    CENAS = r.cenas || [];
    ENVIADAS = r.enviadas || [];
    if (rotaAtual() === "acao") renderizar();
  }, function (e) {
    CENAS = [];
    cenasMsg = e.message;
    if (rotaAtual() === "acao") renderizar();
  });
}

/* Primeira casa livre: jogadores e aliados a partir do canto de cima à esquerda, o resto a partir do canto oposto. */
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

function valorCena(a) { return a.envio ? "e:" + a.envio : (a.local && a.cena ? "p:" + a.local + "/" + a.cena : ""); }

function selecionarTok(id) {
  tokSel = id;
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
      '<label class="rev-label"><input type="checkbox" data-toculto="' + t.id + '"' + (t.oculto && !revelado(t) ? " checked" : "") + "> Escondida" + (t.oculto && revelado(t) ? " (já acionada)" : "") + "</label>";
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
  s.className = "tok-desl" + (gasto > d ? " excede" : "");
  s.innerHTML = "Deslocamento <b>" + d + "</b> (6 + 1 a cada 2 de Destreza), restam <b>" + Math.max(0, d - gasto) + "</b>.";
}

function combatentes() {
  return acaoEst().tokens.filter(function (t) { return (t.tipo === "jogador" || t.tipo === "aliado" || t.tipo === "inimigo") && !t.morto; });
}

function combatePainelHTML() {
  var cb = CAMPO.combate, a = acaoEst();
  var h = '<section class="panel cmb"><h3>' + ic("espada") + "Combate</h3>";
  if (!cb) {
    return h + '<p class="mdica">Ao iniciar, os jogadores rolam a iniciativa (d20 + Destreza) e a ordem de turnos aparece para todos.</p>' +
      '<button type="button" class="primary" id="cmbIniciar"' + (a.ativo ? "" : " disabled") + ">Iniciar combate</button>" +
      (a.ativo ? "" : '<p class="mdica">Coloque a cena ao vivo para iniciar.</p>') + "</section>";
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
  }, function () { /* sem conexão: tenta de novo no próximo ciclo */ }).then(depois);
}

function viewAcaoMestre() {
  if (CENAS === null) carregarCenas();
  var a = acaoEst();
  var h = "<h1>Ação</h1>" + '<p class="lead">Escolha o cenário, ajuste o grid e posicione os tokens. Os jogadores veem a cena na aba Ação deles quando você marcar “Mostrar aos jogadores”.</p>';
  if (CENAS === null) return h + '<p class="mdica">Procurando os cenários…</p>';

  h += "<h2>Novo cenário</h2>" + '<section class="panel"><p class="mdica">Preencha o nome e o grid e depois escolha a imagem: ela é enviada na hora e fica salva na sua conta. Gere a imagem sem grade, pois o site desenha o grid por cima.</p>' +
    '<div class="acao-ctl"><label>Nome do cenário<input class="sorteio-in" type="text" maxlength="120" id="cenaNome" placeholder="ex.: Convés do navio"></label>' +
    '<label>Colunas<input class="sorteio-in num" type="number" min="1" max="200" id="cenaCols" value="20"></label>' +
    '<label>Linhas<input class="sorteio-in num" type="number" min="1" max="200" id="cenaRows" placeholder="auto"></label>' +
    '<span><input type="file" accept="image/*" class="vh" id="cenaUp"><label class="btn primary-btn" for="cenaUp">Escolher imagem e enviar</label></span></div>' +
    '<p role="status" class="mdica">' + esc(upMsg) + "</p></section>";

  var opts = '<option value="">Escolha…</option>';
  if (ENVIADAS.length) opts += '<optgroup label="Enviados">' + ENVIADAS.map(function (c) { return '<option value="e:' + c.id + '"' + (valorCena(a) === "e:" + c.id ? " selected" : "") + ">" + esc(c.nome) + "</option>"; }).join("") + "</optgroup>";
  CENAS.forEach(function (l) {
    opts += '<optgroup label="Pasta: ' + esc(nomeBonito(l.local)) + '">' + l.cenas.map(function (c) {
      var v = "p:" + l.local + "/" + c;
      return '<option value="' + esc(v) + '"' + (valorCena(a) === v ? " selected" : "") + ">" + esc(nomeBonito(c)) + "</option>";
    }).join("") + "</optgroup>";
  });
  h += "<h2>Cena</h2>" + '<div class="acao-ctl"><label>Cenário<select class="sorteio-in" data-acao="cenario">' + opts + "</select></label>" +
    '<button type="button" id="acaoRecarregar">Atualizar lista</button></div>';
  if (!ENVIADAS.length && !CENAS.length) {
    h += '<div class="empty">Nenhum cenário ainda. Envie uma imagem acima' + (cenasMsg ? ". " + esc(cenasMsg) : ", ou coloque arquivos em misterio/{local}/grid/{cenario}.png no servidor") + ".</div>";
  }
  var env = a.envio ? acharEnvio(a.envio) : null;
  var ok = env || (!a.envio && CENAS.some(function (l) { return l.local === a.local && l.cenas.indexOf(a.cena) !== -1; }));
  if (!ok) return h + '<div class="empty">Escolha um cenário.</div>';
  var g = gridDe(a);
  h += '<div class="acao-ctl">' +
    '<label class="rev-label acao-ativo"><input type="checkbox" data-acao="ativo"' + (a.ativo ? " checked" : "") + "> Cena ao vivo (os jogadores veem e movem o personagem)</label>" +
    '<label class="rev-label"><input type="checkbox" data-acao="livre"' + (a.livre === false ? "" : " checked") + "> Jogadores podem se mover fora de combate</label>" +
    '<label>Título para os jogadores<input class="sorteio-in" type="text" maxlength="80" data-acao="titulo" value="' + esc(a.titulo || "") + '" placeholder="Cena atual"></label>' +
    '<label>Colunas<input class="sorteio-in num" type="number" min="1" max="200" data-grid="cols" value="' + (g.cols || 20) + '"></label>' +
    '<label>Linhas<input class="sorteio-in num" type="number" min="1" max="200" data-grid="rows" value="' + (g.rows || "") + '" placeholder="auto"></label>' +
    (env ? '<label>Nome do cenário<input class="sorteio-in" type="text" maxlength="120" data-cenanome="' + env.id + '" value="' + esc(env.nome) + '"></label>' +
      '<button type="button" id="cenaDel">' + (confirmarDelCena ? "Clique de novo para excluir" : "Excluir este cenário") + "</button>" : "") + "</div>";
  h += '<p class="mdica">Deixe as linhas em branco para o site calcular e manter as casas quadradas.</p>';
  h += '<p class="mdica" id="tokInfo" role="status">Arraste um token para movê-lo, ou toque nele e depois na casa de destino. Cada casa tem 1,5 m e a diagonal conta como 1 casa.</p>';
  h += '<div class="acao-mapa"><div>' + tabuleiroHTML(cenaImgUrl(a), env ? env.nome : nomeBonito(a.cena)) + '</div><aside class="acao-lado"><div id="combatePainel"></div><div id="tokPainel"></div></aside></div>';
  h += '<div class="controls">' +
    '<button type="button" class="primary" id="tokJogadores">Adicionar jogadores</button>' +
    '<button type="button" id="tokAliado">Adicionar aliado</button>' +
    '<button type="button" id="tokArmadilha">' + ic("alerta") + "Adicionar armadilha</button>" +
    '<button type="button" id="tokTurno">Zerar movimentos</button></div>';
  h += '<div class="controls"><label class="tok-best">Inimigo do Bestiário <select class="sorteio-in" id="tokBestSel">' + FASES.map(function (f) {
    var lista = INIMIGOS.map(function (m, i) { return [m, i]; }).filter(function (p) { return p[0].fase === f; });
    return lista.length ? '<optgroup label="' + esc(f) + '">' + lista.map(function (p) {
      return '<option value="' + p[1] + '">' + esc(p[0].nome) + " (vida " + p[0].vida + ", def " + p[0].defesa + ")</option>";
    }).join("") + "</optgroup>" : "";
  }).join("") + '</select></label><button type="button" id="tokBest">Adicionar no grid</button>' +
    '<button type="button" id="tokInimigo">Inimigo avulso</button>' +
    '<button type="button" id="tokSemInimigos">Remover inimigos</button>' +
    '<button type="button" id="tokLimpar">' + (confirmarLimpar ? "Clique de novo para remover todos" : "Remover todos") + "</button></div>" +
    '<p class="mdica">Os tokens são salvos por cenário: ao trocar de cena e voltar, tudo continua onde estava. Tokens ocultos e armadilhas escondidas aparecem só para você. A vida e a defesa dos inimigos nunca vão para os jogadores.</p>' +
    '<div id="tokLista"></div><div id="campoLog"></div>';
  return h;
}

function enviarCenario(input) {
  var f = input.files && input.files[0];
  if (!f) return;
  var nome = document.getElementById("cenaNome").value.trim() || nomeBonito(f.name);
  var cols = parseInt(document.getElementById("cenaCols").value, 10) || 20;
  var rows = parseInt(document.getElementById("cenaRows").value, 10) || null;
  upMsg = "Preparando a imagem…";
  renderizar();
  reduzirImagem(f, 2400, 2600000, function (erro, url) {
    if (erro) { upMsg = erro; renderizar(); return; }
    upMsg = "Enviando…";
    renderizar();
    gravar("cena_enviar", { nome: nome, cols: cols, rows: rows, dados: url }).then(function (r) {
      if (!r) { upMsg = "Não foi possível enviar o cenário. Tente de novo."; renderizar(); return; }
      ENVIADAS.push({ id: r.id, nome: r.nome, cols: Math.max(1, Math.min(200, cols)), rows: rows && rows >= 1 && rows <= 200 ? rows : null });
      var a = acaoEst();
      a.envio = r.id; a.local = ""; a.cena = ""; a.ativo = false; tokSel = null;
      salvarAcao();
      upMsg = "Cenário “" + r.nome + "” enviado e selecionado.";
      renderizar();
    });
  });
}

function desenharAcaoMestre() {
  var a = acaoEst(), g = gridDe(a);
  var tokens = a.tokens.map(function (t) { var c = extras({}, t); c.oculto = !!t.oculto && !revelado(t); return c; });
  desenharTabuleiro({ cols: g.cols, rows: g.rows, tokens: tokens, sel: tokSel, atual: atualId(), mestre: true, depois: ligarArraste });
}

function infoTok(txt, aviso) {
  var p = document.getElementById("tokInfo");
  if (!p) return;
  p.textContent = txt;
  p.classList.toggle("tok-aviso", !!aviso);
}

function textoDistancia(t, ox, oy, c) {
  var casas = Math.max(Math.abs(c.x - ox), Math.abs(c.y - oy));
  var s = (t.nome || "Token") + ": " + coordNome(ox, oy) + " → " + coordNome(c.x, c.y) + ", " + casas + (casas === 1 ? " casa" : " casas") + " (" + String(casas * 1.5).replace(".", ",") + " m).";
  var aviso = false;
  if (movel(t)) {
    var d = deslTok(t), total = (parseInt(t.gasto, 10) || 0) + casas;
    if (total > d) { s += " Excede o deslocamento de " + d + " em " + (total - d) + "."; aviso = true; }
    else s += " Restam " + (d - total) + " de " + d + ".";
  }
  return [s, aviso, casas];
}

function armadilhasEm(c, exceto) {
  return acaoEst().tokens.filter(function (t) { return t.tipo === "armadilha" && t.id !== exceto.id && (t.x | 0) === c.x && (t.y | 0) === c.y; });
}

function moverTok(t, c, ox, oy) {
  var r = textoDistancia(t, ox, oy, c), txt = r[0], aviso = r[1];
  if (movel(t)) t.gasto = (parseInt(t.gasto, 10) || 0) + r[2];
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
  var arr = null;
  svg.onpointerdown = function (ev) {
    var g = ev.target.closest ? ev.target.closest(".token") : null;
    if (!g) {
      var sel = tokSel ? acharTok(tokSel) : null, c = celulaTab(svg, ev);
      if (sel && c && (c.x !== sel.x || c.y !== sel.y)) moverTok(sel, c, sel.x, sel.y);
      return;
    }
    var t = acharTok(g.dataset.tok);
    if (!t) return;
    ev.preventDefault();
    selecionarTok(t.id);
    arr = { t: t, g: g, ox: t.x, oy: t.y, c: null };
    arrastando = true;
    try { svg.setPointerCapture(ev.pointerId); } catch (e) { /* sem captura: ignora */ }
    infoTok((t.nome || "Token") + " selecionado em " + coordNome(t.x, t.y) + (movel(t) ? ". Deslocamento " + deslTok(t) + ", já gastou " + (parseInt(t.gasto, 10) || 0) + "." : ".") + " Arraste, ou toque na casa de destino.");
  };
  svg.onpointermove = function (ev) {
    if (!arr) return;
    var c = celulaTab(svg, ev);
    if (!c) return;
    arr.c = c;
    arr.g.setAttribute("transform", "translate(" + ((c.x + 0.5) * tabGeo.cw).toFixed(1) + "," + ((c.y + 0.5) * tabGeo.ch).toFixed(1) + ")");
    var r = textoDistancia(arr.t, arr.ox, arr.oy, c);
    infoTok(r[0], r[1]);
  };
  svg.onpointerup = svg.onpointercancel = function () {
    if (!arr) return;
    var a2 = arr;
    arr = null;
    arrastando = false;
    if (a2.c && (a2.c.x !== a2.ox || a2.c.y !== a2.oy)) moverTok(a2.t, a2.c, a2.ox, a2.oy);
  };
}

function redesenharTokens() {
  var tb = document.getElementById("tokTabela");
  if (tb) tb.innerHTML = tokensHTML(acaoEst());
  desenharAcaoMestre();
}

function changeAcao(el) {
  var d = el.dataset, a = acaoEst(), t;
  if (d.acao === "cenario") {
    var v = el.value, antiga = valorCena(a);
    /* Cada cenário guarda os próprios tokens: o convés continua montado quando você volta do porão. */
    EST.cena_tokens = EST.cena_tokens || {};
    if (antiga) EST.cena_tokens[antiga] = { tokens: a.tokens };
    a.envio = 0; a.local = ""; a.cena = ""; a.ativo = false; tokSel = null;
    if (v.indexOf("e:") === 0) a.envio = parseInt(v.slice(2), 10);
    else if (v.indexOf("p:") === 0) { var k = v.slice(2), p = k.indexOf("/"); a.local = k.slice(0, p); a.cena = k.slice(p + 1); }
    a.tokens = (v && (EST.cena_tokens[v] || {}).tokens) || [];
    aplicarCampo();
    if (CAMPO.combate) campoOp("encerrar");
    confirmarDelCena = false;
    salvarEstado("cena_tokens");
    salvarAcao();
    renderizar();
    return true;
  }
  if (d.acao === "ativo") { a.ativo = el.checked; salvarAcao(); renderAcaoUI(); return true; }
  if (d.acao === "livre") { a.livre = el.checked; salvarAcao(); return true; }
  if (d.grid) {
    var g = gridDe(a), n = parseInt(el.value, 10);
    var valido = n >= 1 && n <= 200;
    if (a.envio) {
      if (d.grid === "cols") g.cols = valido ? n : 20; else g.rows = valido ? n : null;
      var c = g;
      adiar("cena-" + c.id, function () { gravar("cena_editar", { id: c.id, cols: c.cols, rows: c.rows }); }, 400);
    } else {
      if (valido) g[d.grid] = n; else delete g[d.grid];
      salvarEstado("grids");
    }
    desenharAcaoMestre();
    salvarAcao();
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
    if (ce) { ce.nome = el.value; adiar("cenanome-" + ce.id, function () { gravar("cena_editar", { id: ce.id, nome: ce.nome }); }, 600); }
    return true;
  }
  return false;
}

function clickAcao(b) {
  var a = acaoEst(), t;
  if (b.id === "acaoRecarregar") { CENAS = null; renderizar(); return true; }
  if (b.dataset.tsel) { selecionarTok(b.dataset.tsel); desenharAcaoMestre(); return true; }
  if (b.id === "cenaDel" && a.envio) {
    if (!confirmarDelCena) {
      confirmarDelCena = true;
      b.textContent = "Clique de novo para excluir";
      setTimeout(function () { confirmarDelCena = false; var x = document.getElementById("cenaDel"); if (x) x.textContent = "Excluir este cenário"; }, 6000);
      return true;
    }
    confirmarDelCena = false;
    var id = a.envio;
    gravar("cena_excluir", { id: id }).then(function (r) {
      if (!r) return;
      ENVIADAS = ENVIADAS.filter(function (c) { return c.id !== id; });
      if (EST.cena_tokens) { delete EST.cena_tokens["e:" + id]; salvarEstado("cena_tokens"); }
      campoOp("pos", { remover: a.tokens.map(function (x) { return x.id; }) });
      if (CAMPO.combate) campoOp("encerrar");
      a.envio = 0; a.ativo = false; a.tokens = []; tokSel = null;
      salvarAcao();
      upMsg = "Cenário excluído.";
      renderizar();
    });
    return true;
  }
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
    if (rotaAtual() === "jogadores" && !jogSel) renderizar();
  }, function () { /* sem conexão: fica com a lista que já tem */ });
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

MESTRE = {
  niveis: viewNiveisMestre,
  regrasExtra: regrasExtraMestre,
  vilaExtra: vilaExtraMestre,
  vilaRodape: vilaRodapeMestre,
  views: [
    ["inicio", "Início", "casa"], ["regras", "Regras", "prancheta"], ["niveis", "Níveis", "cima"], ["grimorios", "Grimórios", "livro"], ["bestiario", "Bestiário", "pata"],
    ["vilarejos", "Vilarejos", "pino"], ["mapa", "Mapa", "bussola"], ["acao", "Ação", "espada"], ["sorteio", "Sorteio", "estrela"], ["jogadores", "Jogadores", "grupo"], ["sessao-zero", "Sessão Zero", "grupo"], ["mestre", "Mestre", "cadeado"]
  ],

  iniciar: function (d) {
    jogs = d.jogadores || [];
    sorteio = null;
    if (d.campo) CAMPO = d.campo;
    aplicarCampo();
    sincronizarPub();
  },

  antes: function (r) {
    if (r !== "sorteio") cer.ativa = false;
    if (r === "jogadores" && ultimaRota !== "jogadores") atualizarJogadores();
    if (r !== "acao" && campoRodando) pararCampoPoll();
    ultimaRota = r;
  },

  depois: function (r) {
    if (r === "grimorios") desenharGrimorios();
    if (r === "bestiario") desenharBestiario();
    if (r === "acao") { renderAcaoUI(); iniciarCampoPoll(); }
  },

  change: function (el) {
    var d = el.dataset || {};
    if (el.id === "cenaUp") { enviarCenario(el); return; }
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
    else if (el.id === "mapaUp") enviarImagem(el, "mapa", "");
    else if (el.id === "localImg") enviarImagem(el, "local", d.local);
    else if (d.imglib) {
      var im = acharImg(parseInt(d.imglib, 10));
      if (im) { im.liberado = el.checked; gravar("img_editar", { id: im.id, liberado: im.liberado }); }
    }
  },

  input: function (el) {
    var d = el.dataset || {};
    if (inputAcao(el)) return;
    if (el.id === "busca") { filtro.q = el.value; desenharGrimorios(); }
    if (d.jf || d.obs) salvarCampoJog(el);
    if (d.imgtit) {
      var im = acharImg(parseInt(d.imgtit, 10));
      if (im) { im.titulo = el.value; adiar("imgtit-" + im.id, function () { gravar("img_editar", { id: im.id, titulo: im.titulo }); }); }
    }
  },

  click: function (b) {
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
      document.querySelectorAll("#fElem .chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.elem === filtro.elem)); });
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
