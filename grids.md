# Grids e cenas de ação

> Combinado sobre as imagens de grid e a aba Ação. Documento vivo.

---

## 0. Duas formas de ter cenários

1. **Enviar pelo site (mais simples):** na aba Ação, em "Novo cenário", preencha o nome, as colunas e as linhas, e escolha a imagem. Ela é reduzida no navegador (até 2400 px), enviada na hora e fica salva no banco de dados. Cada cenário enviado guarda o próprio grid, que dá para mudar depois, e também pode ser renomeado ou excluído ali mesmo.
2. **Pasta no servidor:** coloque arquivos em `misterio/{local}/grid/{cenario}.png` (item 1 abaixo). O grid de cada um fica salvo por cenário na aba Ação.

Os dois tipos aparecem no mesmo seletor "Cenário": os enviados no grupo "Enviados" e os de pasta em "Pasta: {local}". Deixe as **linhas em branco** para o site calcular e manter as casas quadradas.

---

## 1. Estrutura de pastas (opção 2)

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
- Escolhe o cenário (enviado pelo site ou de pasta) ou envia um novo, com o grid que quiser.
- Ajusta colunas e linhas do grid a qualquer momento. O ajuste fica salvo por cenário.
- Define um título, que é o único nome que o jogador vê (o nome da pasta pode ser spoiler).
- Marca "Mostrar aos jogadores" para ativar a cena.
- Tokens: adiciona todos os jogadores de uma vez, inimigos e aliados; muda nome, tipo e cor; marca como **oculto** (só o mestre vê).
- Move os tokens arrastando, ou tocando no token e depois na casa de destino. Mostra a distância em casas e metros.
- **Inimigos:** escolhe um inimigo do Bestiário e adiciona no grid (já vem com vida e defesa; nomes repetidos viram "Lobo de Mana 2"). Também há "Inimigo avulso". A barra de vida aparece só para o mestre.
- **Armadilhas ocultas:** token em losango laranja com "!", criado **escondido**. O mestre escreve o efeito (ex.: "2d6 de dano, Destreza contra 13"). Só aparece para os jogadores quando o mestre desmarca "Escondida". Quando um token pisa numa armadilha, o mestre recebe o aviso com o efeito, mesmo se ela estiver escondida.
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
- A **diagonal conta como 1 casa**. O custo conta a distância entre a casa de origem e a de destino, não o caminho.
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
- O jogador **nunca** arrasta token que não seja o dele. Não pode parar numa casa ocupada por outro token visível. Quem pisa numa armadilha escondida a revela para todos.

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

**Painel do token (mestre):** clicar num token, no mapa ou na lista, abre o painel com nome, cor, tipo, Destreza, ajuste, gasto, vida (atual e máxima), derrotado, oculto, duplicar e remover.

## 4.3 Perfil do jogador: status e atributos

- **Status mostrados:** Nível, Vida máx., Mana, Defesa (10 + Destreza), Redução de dano (= Poder) e Deslocamento (6 + 1 a cada 2 de Destreza). Vida e Mana vêm da tabela de níveis (Vida 20, 24, 28, 32, 36; Mana 10, 10, 12, 12, 14).
- **Criação:** o jogador distribui **+5 pontos** entre Poder, Destreza e Inteligência, no máximo **+3** em cada. Depois de **Salvar atributos**, a base fica **travada**.
- **Bônus:** um campo por atributo, sempre editável, para anotar os pontos ganhos ao subir de nível (+1 por nível). O total é base + bônus. Se passar do limite do nível (+3, +3, +4, +4, +5), aparece um aviso, e o mestre confere.
- **Mestre:** na aba Jogadores, "Ficha (atributos)" permite mudar o nível, a base e o bônus de qualquer jogador. Desmarcar "Atributos travados" apaga a base e devolve os 5 pontos para o jogador distribuir de novo (pede confirmação).
- A Destreza da ficha (base + bônus) é a que vale no deslocamento e na iniciativa.

---

## 5. Pendências

- Enviar os cenários pelo site (ou, se preferir pasta, reorganizar `misterio/` na estrutura do item 1 e subir a pasta para a hospedagem).
- Testar na hospedagem (o PHP da aba Ação ainda não foi executado).
- Cada jogador distribuir os 5 pontos no Perfil (sem isso, a Destreza é 0 e o deslocamento é 6).
- Vida atual dos jogadores (hoje só aparece a Vida máx.): ainda não é controlada pelo site.
- Possíveis evoluções: condições nos tokens (lento, preso...), área de efeito das armadilhas, áreas de feitiço, névoa de guerra (já previstas em `campanha.md`, seção 7).
