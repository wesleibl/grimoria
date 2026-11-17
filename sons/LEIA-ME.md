# Sons da sessão

Os 18 ambientes `a02` a `a19` e as seis trilhas `m02` a `m07` foram sintetizados originalmente para os cenários genéricos. O código de geração está em `privado/gerar_sons.js` e exige Node e FFmpeg apenas durante o preparo. `m01`, `a01` e `e01` são exemplos anteriores mantidos para sessões que já os usam.

Os sons físicos de dados `d01`, `d02`, `d03` e `d06` a `d10` vêm do pacote [Casino Audio de Kenney](https://opengameart.org/content/54-casino-sound-effects-cards-dice-chips), distribuído sob **CC0**. Foram convertidos de OGG para MP3 mono, com filtro de graves/agudos e ajuste de volume. `d04` (20 natural) e `d05` (1 natural) são alertas sintéticos originais. Crédito a Kenney é opcional pela licença, mas está registrado aqui para rastreabilidade.

Mantenha os nomes neutros e os IDs da lista branca em `privado/sons.php`; o deploy por Git já leva a pasta `sons/` no `git pull`.

Prepare os arquivos em MP3, sem metadados, até cerca de 3 MB por faixa. Para música use estéreo a 128 kb/s; para ambiente e efeitos use mono a 96 kb/s. O loop deve ter 30 a 180 segundos e começo e fim compatíveis para a emenda.

```bash
ffmpeg -i entrada.wav -ac 2 -b:a 128k -ar 44100 -map_metadata -1 -af loudnorm=I=-18:TP=-1.5 musica/m08.mp3
ffmpeg -i entrada.wav -ac 1 -b:a 96k -ar 44100 -map_metadata -1 -af loudnorm=I=-18:TP=-1.5 ambiente/a20.mp3
ffmpeg -i entrada.wav -ac 1 -b:a 96k -ar 44100 -map_metadata -1 -af "afade=t=in:d=0.05,afade=t=out:st=1.95:d=0.05,loudnorm=I=-18:TP=-1.5" efeito/e02.mp3
```

Depois de copiar uma nova faixa, registre seu ID, tipo, caminho relativo, duração, rótulo, tags e cenários no catálogo privado. Não reutilize o mesmo nome de arquivo para áudio diferente: o cache é de 30 dias. Para cenários adicionais, acrescente entradas por agrupamento (taverna, cidade, ferraria, floresta, caverna, locais solenes, porto, água, ruínas e combate). O jogador recebe somente o ID e o caminho neutro da faixa ativa.
