# Grids e cenas de ação

> Combinado sobre as imagens de grid e a aba Ação. Documento vivo.

---

## 0. Cenários: onde tudo começa

Tudo parte da aba **Cenários** (só do mestre). Um cenário reúne, num lugar só:

- a **foto**: uma imagem para mostrar como é o lugar. **A foto não leva grid**;
- os **mapas de grid**: zero ou mais imagens **extras**, cada uma com as próprias colunas e linhas. É nelas que se combate. Um cenário pode ter vários (por exemplo, o convés e o porão), e cada mapa tem a prévia do grid sobre a imagem e o tamanho em metros. Linhas em branco = automático, com casas quadradas;
- dois textos: o **resumo** (descrição breve, que os jogadores leem) e a **descrição completa** (só o mestre vê: segredos, o que acontece, como os jogadores chegam);
- o **local no mapa** ao qual ele pertence (ver 0.1).

**Como montar:** crie o cenário com a foto. Para combater nele, abra o cenário e use **"Adicionar imagem de grid"**: escolha a imagem, o nome do mapa e as colunas e linhas. Dá para adicionar quantos mapas quiser, trocar a imagem de um mapa, ajustar o grid, renomear ou remover. Um cenário que é só para mostrar o lugar fica sem mapa de grid, e isso é normal.

Dali o mestre escolhe o que fazer:

- **Usar na Ação** (em cada mapa de grid): leva para a aba Ação com aquele mapa e o grid já configurados.
- **Mostrar só a foto aos jogadores:** os jogadores veem a foto e o resumo (sem grid, tokens nem combate). Serve para abrir uma cena, descrever o ambiente e só depois combater. Há o botão para esconder de novo.
- **Trocar a foto**, renomear ou excluir o cenário (isso apaga também os mapas de grid dele).

A aba **Ação** apenas **chama** um cenário já pronto: escolhe o **cenário**, o **mapa de grid** dele e "Como mostrar" (Grid e tokens, ou Só a foto). Sem mapa de grid, só dá para mostrar a foto, e o servidor recusa movimentos e combate. Os **tokens ficam por mapa de grid**: ao trocar de mapa e voltar, tudo continua onde estava.

> **Cenários criados antes desta versão:** quem já tinha colunas viram um cenário com a foto e um mapa de grid ("Mapa de grid", com a mesma imagem e as mesmas colunas). Os tokens que estavam em cena precisam ser colocados de novo.

### 0.0 Liberar aos jogadores

**Todo cenário nasce oculto.** Marque "Liberado aos jogadores" (no detalhe do cenário, ou no detalhe do local no mapa) para o jogador poder ver o **nome**, a **foto** e o **resumo** dele. Nada é liberado sozinho: criar, ligar a um local ou revelar o local não libera o cenário.

- **No mapa**, o jogador só vê o cenário de um local se o local estiver **revelado** e o cenário **liberado**. As duas coisas são necessárias, e o servidor confere as duas ao entregar a foto.
- **Ao vivo** é uma decisão à parte: enquanto você mostra um cenário na aba Ação (grid ou só a foto), os jogadores o veem mesmo que ele esteja oculto. Isso não o libera para o mapa.
- A lista de cenários mostra "Oculto" ou "Liberado" em cada cartão.

### 0.1 Vínculos entre o mapa e os cenários

Nada fica solto: cada local do mapa pode ter **um cenário**, e cada cenário fica em **um local**.

- O vínculo se faz nos dois sentidos: no detalhe de um local do mapa ("Cenário deste local") ou no detalhe do cenário ("Local no mapa").
- **Para o jogador:** quando o local for revelado no mapa, clicar nele mostra o **nome**, a **foto** e o **resumo** do cenário ligado. Locais não revelados não mostram nada. O nome do cenário também aparece. A descrição completa e o grid ficam só com o mestre. O servidor só entrega a foto de um cenário ligado a um local revelado (ou a cena ativa), e não aceita o pedido de nenhum outro.
- **Para o mestre:** o detalhe do local tem atalhos "Abrir o cenário", "Usar na Ação" e "Mostrar só a foto". O cenário mostra o nome do local na lista e tem "Ver no mapa".
- Excluir um cenário desfaz o vínculo.

### 0.2 Importar da pasta do servidor

Se já houver imagens em `misterio/{local}/grid/`, a aba Cenários tem "Importar da pasta do servidor": cada imagem importada vira um cenário (a imagem é a foto dele) e também o primeiro mapa de grid, com 20 colunas, que dá para ajustar depois.

---

## 1. Estrutura de pastas (só para importar)

As imagens ficam no servidor, em:

```
misterio/{local}/grid/{cenario}.png
```

Exemplo:

```
misterio/
  navio_silencioso/
    grid/
      conves.png
      porao.png
  mina_lacrada/
    grid/
      entrada.png
      camara.png
```

- `{local}` é o mapa (um dos lugares de mistério da campanha). `{cenario}` é a imagem dentro da pasta `grid`.
- Aceita `.png`, `.jpg` e `.webp`.
- Os nomes viram o texto da lista: `navio_silencioso` aparece como "Navio silencioso".
- Use só letras, números, espaço, `_`, `-` e `.` nos nomes.
- As imagens que já estão soltas em `misterio/` (por exemplo `navio_silencioso.png`) **não** aparecem na aba Ação. Elas precisam ser movidas para a estrutura acima.
- A pasta `misterio/` tem um `.htaccess` que bloqueia o acesso direto. As imagens só saem pelo `api.php`, e o jogador só recebe a cena que o mestre ativou.

---

## 2. Gerar as imagens SEM grid

O sistema desenha a grade por cima da imagem, na hora da ação. Motivos:

- A grade fica sempre alinhada com os tokens e com as coordenadas (A1, B3...).
- O mestre ajusta colunas e linhas por cenário, sem regerar a imagem.
- Geradores de imagem erram o tamanho das casas, e uma grade já desenhada se mistura com a do sistema.

**Prompt:** pedir vista de cima, sem grade, sem texto ou números e sem personagens.

---

## 3. Tamanho do grid

| Tipo de cena | Grid | Imagem sugerida |
|---|---|---|
| Padrão (a maioria) | **20 × 14** | 1600 × 1120 |
| Espaço pequeno (convés, corredor, câmara) | 16 × 11 | 1280 × 880 |
| Grande (campo aberto, cratera, floresta) | 24 × 16 ou 30 × 20 | 1920 × 1280 ou 2400 × 1600 |

- 1 casa = 1,5 m. Com 20 colunas o mapa tem 30 m de ponta a ponta.
- O deslocamento de 6 casas é cerca de 30% da largura num grid de 20 colunas.
- 20 × 14 comporta os 8 jogadores e vários inimigos.
- **Casas quadradas** dão o melhor resultado: manter a proporção da imagem igual à do grid (20:14 é o mesmo que 10:7). Se a imagem tiver outra proporção, o sistema calcula as linhas sozinho (`linhas = colunas × altura ÷ largura`) para manter as casas quadradas.
- Pelo menos **80 px por casa** na imagem.
- JPG ou WebP de até uns 2 MB, porque a imagem carrega no celular dos jogadores.

---

## 4. Aba Ação

**Mestre**
- Chama um cenário já criado na aba Cenários e escolhe um dos mapas de grid dele. O grid vem do mapa.
- Escolhe "Como mostrar": **Grid e tokens** ou **Só a foto**.
- Define um título, que é o único nome que o jogador vê (ele começa com o nome do cenário, e dá para trocar).
- Marca "Ao vivo" para os jogadores verem a cena.
- Tokens: adiciona todos os jogadores de uma vez, inimigos e aliados; muda nome, tipo e cor; marca como **oculto** (só o mestre vê).
- Move os tokens arrastando, ou tocando no token e depois na casa de destino. Mostra a distância em casas e metros. Nos turnos do combate, o token selecionado mostra em azul-claro até onde ainda pode ir.
- **Inimigos:** escolhe um inimigo do Bestiário e adiciona no grid (já vem com vida e defesa; nomes repetidos viram "Lobo de Mana 2"). Também há "Inimigo avulso". A barra de vida aparece só para o mestre.
- **Armadilhas ocultas:** token em losango laranja com "!", criado **escondido**. O mestre escreve o efeito (ex.: "2d6 de dano, Destreza contra 13"). Só aparece para os jogadores quando o mestre desmarca "Escondida". **Quando um jogador passa por uma armadilha (em qualquer casa do caminho, inclusive a final), só o mestre é avisado**: aparece uma faixa vermelha "⚠ ARMADILHA: *Nome* passou por *armadilha* (D4): *efeito*", o celular vibra, o aviso fica no registro e o painel da armadilha mostra "já acionada". O jogador **não** recebe nenhum aviso e a armadilha **continua escondida** para todos os jogadores (o mestre decide se e quando revelá-la).
- **Tokens ocultos:** qualquer token pode ficar oculto (esmaecido para o mestre, invisível para os jogadores).

### Deslocamento

```
deslocamento = 6 + floor(Destreza / 2) + ajuste
```

- A cada **2 pontos de Destreza**, +1 casa. Exemplos: Destreza 0 ou 1 = 6; Destreza 2 ou 3 = 7; Destreza 4 ou 5 = 8.
- **Ajuste** é manual, para condições como lento (-2) ou o dobro de movimento (+6).
- A Destreza dos jogadores vem do perfil, na aba **Jogadores** (campo Destreza). Para aliados e inimigos, é um campo do próprio token (o padrão é 0, ou seja, 6 casas).
- Cada token tem um contador **Gasto**: a cada movimento, soma as casas andadas. O mestre vê quantas casas restam e recebe um aviso em vermelho se o movimento passar do deslocamento. O sistema só avisa, não bloqueia: quem decide é o mestre.
- O botão **Novo turno** zera o gasto de todos. O campo Gasto também pode ser corrigido à mão (por exemplo, para desfazer um movimento).
- **O movimento é só na horizontal e na vertical.** Cada passo reto custa 1 casa, então o custo é a **soma** das casas andadas: 3 para a direita e 2 para cima custam 5. A **diagonal não serve para andar** (ela só vale para alcançar um alvo no combate, o que se resolve na mesa). O custo conta a distância entre a casa de origem e a de destino, sem conferir o caminho entre elas.
- Armadilhas não têm deslocamento.

**Jogador**
- Vê o mapa, o grid e os tokens visíveis (sem inimigos ocultos nem armadilhas escondidas).
- Vê o deslocamento e quantas casas ainda restam **do próprio personagem**. Nunca vê a Destreza, nem a vida e a defesa dos inimigos, nem o efeito das armadilhas.
- A tela se atualiza sozinha a cada 4 segundos, enquanto a aba estiver aberta.
- Não escolhe a cena: recebe a que o mestre ativou.
- O token do próprio personagem aparece com contorno amarelo.

---

## 4.1 Preparo e cena ao vivo

- **Preparo:** com "Cena ao vivo" desmarcado, só o mestre vê o mapa. É a hora de escolher o cenário, ajustar o grid e posicionar jogadores, inimigos e armadilhas.
- **Ao vivo:** o mestre marca "Cena ao vivo" e os jogadores online passam a ver o mapa e a mover o próprio token.
- **Tokens por cenário:** cada cenário guarda os próprios tokens e posições. Trocar de cena e voltar não perde nada. Trocar de cena encerra o combate.
- **Fora de combate**, o jogador se move livremente (sem limite de casas) enquanto a opção "Jogadores podem se mover fora de combate" estiver marcada. O mestre pode desmarcar para travar.
- O jogador **nunca** move token que não seja o dele. **Todo token, menos a armadilha, bloqueia:** um não passa pelo outro (nem para onde parar, nem no caminho). O servidor confere o caminho livre mais curto e recusa se não houver ("Não há caminho livre até lá") ou se a casa estiver ocupada.
- Os tokens **ocultos** do mestre não bloqueiam os jogadores (eles ainda não sabem que estão ali, e uma recusa os denunciaria). O **mestre** move qualquer token livremente, sem as travas.

### Como o jogador se move

1. **Clica no próprio token.** Ele fica destacado (pulsando) e as casas que ele alcança aparecem em **azul-claro**. Dá para passar o mouse numa casa azul e ver a coordenada e a distância. Clicar de novo no token cancela.
2. **Clica numa casa azul.** Só nesse momento o movimento acontece e **conta** o deslocamento. Selecionar o token não gasta nada. Não precisa arrastar.
3. O token **desliza** até a casa, com uma animação curta (mais longa quanto maior a distância, no máximo 0,9 s). Os outros jogadores veem o mesmo deslize quando a tela deles atualiza. Quem prefere menos movimento no sistema (configuração do aparelho) vê o token pular direto.
4. A mensagem acima do mapa mostra a origem, o destino e quanto resta. Se o servidor recusar (casa ocupada, não é a vez, falta deslocamento), o token **volta** para onde estava e o motivo aparece em vermelho.

**O que é "alcançável":** as casas que dá para chegar andando só na horizontal e na vertical, **contornando os tokens**, até o que resta de deslocamento. Sem obstáculos o alcance é um losango; com tokens no caminho ele se deforma (a casa logo atrás de um inimigo custa mais, e quem está cercado não tem para onde ir). O **custo é o tamanho do caminho livre mais curto**, não a distância reta, e é esse custo que desconta do deslocamento. Todo token bloqueia, **inclusive o derrotado**, menos a armadilha. Em **combate**, o alcance é o que resta no turno e diminui a cada movimento. **Fora de combate**, o alcance é o deslocamento do personagem **por movimento**, e dá para se mover quantas vezes quiser; o servidor também confere esse limite.

## 4.2 Combate por turnos

1. **Iniciar combate** (mestre): os jogadores veem o painel de iniciativa.
2. **Iniciativa = d20 + Destreza.** O jogador tem duas opções: **Rolar** (o servidor rola e soma a Destreza da ficha, que o jogador não vê) ou **digitar o valor total** do dado físico. Depois de definida, o jogador não troca. O mestre pode mudar qualquer uma. "Rolar inimigos e aliados" faz uma rolagem por tipo de inimigo (3 bandidos agem juntos).
3. **Começar os turnos** (mestre): a ordem é do maior para o menor. Empate: maior Destreza, depois jogador antes de aliado antes de inimigo. Quem ficou sem iniciativa age por último.
4. **Cada turno:** 1 movimento e 1 ação. O jogador só move o token na própria vez, até o deslocamento que resta. O servidor confere cada movimento. A ação (ataque, magia) é combinada na mesa, com os dados físicos.
5. **Encerrar turno:** o jogador da vez ou o mestre. O contador de movimento do próximo a agir zera. Quando todos agiram, começa a rodada seguinte.
6. **Recalcular ordem:** inclui quem entrou depois (reforços) e tira os derrotados, sem perder o turno atual.
7. **Derrotado:** o token fica cinza e sai dos turnos. Zerar a vida pelos botões −5 −1 +1 +5 marca como derrotado.
8. Inimigos ocultos agem normalmente, mas para os jogadores aparece "algo se move nas sombras".
9. O jogador vê a ordem, de quem é o turno e um registro dos acontecimentos públicos. A tela dele se atualiza a cada 2 s em combate (4 s fora dele).

**Token selecionado (mestre):** é fácil ver que um token está aguardando o destino:

- o token ganha um **halo que pulsa para fora**, e o cursor no mapa vira uma **mira**;
- uma **faixa em destaque** acima do mapa diz "*Nome* selecionado em C3. Aguardando o destino: clique numa casa do mapa, ou arraste o token. Esc cancela.";
- ao passar o mouse numa casa, ela é **destacada** e a faixa mostra a distância ("C3 → G3, 4 casas (6 m)");
- **clicar de novo no token, ou apertar Esc**, cancela a seleção;
- nos turnos do combate, as casas alcançáveis aparecem em azul-claro.

**Foto no token:** se o personagem tem **foto salva** no perfil, o token mostra a foto (recortada em círculo) no lugar das iniciais. Quem não tem foto (inimigos, aliados, personagens sem foto) continua com as iniciais. Os outros jogadores veem a foto dos personagens que estão no mapa; fora disso, o retrato continua só do dono e do mestre.

**Zoom e tela cheia (celular):**

- **Pinça com dois dedos** no mapa para aproximar e afastar (até 6×). Com o mapa ampliado, **um dedo arrasta** o mapa. Tocar em tokens e casas continua funcionando com o zoom, e o toque que termina um arrasto não move nada.
- Sem zoom, **a página rola normalmente** quando o dedo está sobre o mapa.
- No canto do mapa há os botões **+**, **−**, **Ajustar** (volta ao tamanho original) e **⛶ Tela cheia**. No computador também vale **Ctrl + roda do mouse** (ou a pinça do touchpad) e arrastar com o mouse.
- **Tela cheia:** o mapa ocupa a tela toda e o aparelho é travado em **paisagem** quando o sistema permite (Android). No iPhone o sistema não deixa travar: aparece o aviso "Gire o aparelho para o modo paisagem". Uma **barra embaixo do mapa** mostra o essencial, já que o card de combate fica fora do mapa: para o jogador, o turno e o botão **Encerrar turno** (e as mensagens); para o mestre, o aviso atual e o botão **Próximo turno**. Sair: botão ⛶ de novo, ou o gesto do sistema.

**Resetar ação (mestre):** o botão **Resetar ação** (vermelho, na aba Ação) recomeça a ação do mapa atual, depois de um **popup de confirmação** que lista o que acontece:

- remove **todos os tokens** do mapa (jogadores, aliados, inimigos e armadilhas, inclusive as já acionadas);
- **encerra o combate** e apaga o registro de acontecimentos;
- **desliga a imersão** (os jogadores deixam de ver a cena enquanto você monta a próxima).

**Não** mexe no cenário, nos mapas de grid, nem nos tokens guardados em outros mapas. Cancelar o popup não muda nada. Não dá para desfazer.

**Painel do token (mestre):** clicar num token, no mapa ou na lista, abre o painel com nome, cor, tipo, Destreza, ajuste, gasto, vida (atual e máxima), derrotado, oculto, duplicar e remover.

## 4.3 Perfil do jogador: status e atributos

- **Status mostrados:** Nível, Vida máx., Mana, Defesa (10 + Destreza), Redução de dano (= Poder) e Deslocamento (6 + 1 a cada 2 de Destreza). A tabela de níveis completa fica só para o mestre. A **Vida** vem do nível (20, 24, 28, 32, 36). A **Mana** é 10 + 1 a cada 2 pontos de Inteligência.
- **Criação:** o jogador distribui **+5 pontos** entre Poder, Destreza e Inteligência, no máximo **+3** em cada. Depois de **Salvar atributos**, a base fica **travada**.
- **Bônus:** um campo por atributo, sempre editável, para anotar os pontos ganhos ao subir de nível (+1 por nível). O total é base + bônus. Se passar do limite do nível (+3, +3, +4, +4, +5), aparece um aviso, e o mestre confere.
- **Mestre:** na aba Jogadores, "Ficha (atributos)" permite mudar o nível, a base e o bônus de qualquer jogador. Desmarcar "Atributos travados" apaga a base e devolve os 5 pontos para o jogador distribuir de novo (pede confirmação).
- A Destreza da ficha (base + bônus) é a que vale no deslocamento e na iniciativa.

---

## 5. Pendências

- Criar os cenários na aba Cenários (foto, resumo, descrição), adicionar as imagens de grid dos que vão ter combate e ligar cada cenário ao seu local no mapa (por exemplo, a Pedra Velha).
- Testar na hospedagem (o PHP da aba Ação ainda não foi executado).
- Cada jogador distribuir os 5 pontos no Perfil (sem isso, a Destreza é 0 e o deslocamento é 6).
- Vida atual dos jogadores (hoje só aparece a Vida máx.): ainda não é controlada pelo site.
- Possíveis evoluções: condições nos tokens (lento, preso...), área de efeito das armadilhas, áreas de feitiço, névoa de guerra (já previstas em `campanha.md`, seção 7).
