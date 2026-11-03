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

## 5. Pendências

- Enviar os cenários pelo site (ou, se preferir pasta, reorganizar `misterio/` na estrutura do item 1 e subir a pasta para a hospedagem).
- Testar na hospedagem (o PHP da aba Ação ainda não foi executado).
- Preencher a **Destreza** de cada jogador na aba Jogadores (sem isso, o deslocamento de todos é 6).
- Possíveis evoluções: condições nos tokens (lento, preso...), área de efeito das armadilhas, áreas de feitiço, névoa de guerra (já previstas em `campanha.md`, seção 7).
