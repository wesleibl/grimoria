# Sons da sessão

Os arquivos `m01`, `a01`, `e01` e os cinco sons dos dados são exemplos **sintetizados originalmente** para validar o sistema. Substitua-os por faixas com licença adequada antes de usar música definitiva. Mantenha os nomes neutros e os IDs da lista branca em `privado/sons.php`; o deploy por Git já leva a pasta `sons/` no `git pull`.

Prepare os arquivos em MP3, sem metadados, até cerca de 3 MB por faixa. Para música use estéreo a 128 kb/s; para ambiente e efeitos use mono a 96 kb/s. O loop deve ter 30 a 180 segundos e começo e fim compatíveis para a emenda.

```bash
ffmpeg -i entrada.wav -ac 2 -b:a 128k -ar 44100 -map_metadata -1 -af loudnorm=I=-18:TP=-1.5 musica/m02.mp3
ffmpeg -i entrada.wav -ac 1 -b:a 96k -ar 44100 -map_metadata -1 -af loudnorm=I=-18:TP=-1.5 ambiente/a02.mp3
ffmpeg -i entrada.wav -ac 1 -b:a 96k -ar 44100 -map_metadata -1 -af "afade=t=in:d=0.05,afade=t=out:st=1.95:d=0.05,loudnorm=I=-18:TP=-1.5" efeito/e02.mp3
```

Depois de copiar uma nova faixa, registre seu ID, tipo, caminho relativo, duração, rótulo, tags e cenários no catálogo privado. Não reutilize o mesmo nome de arquivo para áudio diferente: o cache é de 30 dias. Para cenários adicionais, acrescente entradas por agrupamento (taverna, cidade, ferraria, floresta, caverna, locais solenes, porto, água, ruínas e combate). O jogador recebe somente o ID e o caminho neutro da faixa ativa.
