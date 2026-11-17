# Sons da sessão

Os 18 ambientes foram refeitos a partir de gravações de campo e efeitos reais, sem as camadas de ruído branco da primeira versão. As sete músicas são composições completas. Os dez sons de dados usam tomadas de dados sobre uma mesa. `privado/gerar_sons.js` contém a receita e monta os MP3 com FFmpeg; o site reproduz somente os arquivos prontos.

## Fontes CC0

- Músicas `m01` a `m07`: [Fantasy Song Pack Volume 1, troubadour](https://opengameart.org/content/fantasy-song-pack-volume-1). Na ordem: `back_to_nature`, `homestead`, `jaunt`, `springly_sprigs`, `bells_of_winter`, `fairy_lights`, `wandering_woodlands`.
- Dados: [Flem0527, dados sobre madeira](https://freesound.org/people/Flem0527/sounds/629982/), [andresix, várias rolagens](https://freesound.org/people/andresix/sounds/347806/), [Zaxtor99, pouso](https://freesound.org/people/Zaxtor99/sounds/147531/). Os acentos do 20 e do 1 naturais usam as fontes de taça e passos abaixo.
- [Floresta, greysound](https://freesound.org/people/greysound/sounds/547923/), [lareira, RyanKingArt](https://freesound.org/people/RyanKingArt/sounds/717579/), [conversa de taverna, dazzamoo](https://freesound.org/people/dazzamoo/sounds/651364/), [taverna, denkmal](https://freesound.org/people/denkmal/sounds/539811/), [grilos, JoelMcDaniel](https://freesound.org/people/JoelMcDaniel/sounds/829765/).
- [Caverna, corkob](https://freesound.org/people/corkob/sounds/392668/), [água, guidofm](https://freesound.org/people/guidofm/sounds/509174/), [mercado, SamuelGremaud](https://freesound.org/people/SamuelGremaud/sounds/545756/), [carruagem, Kraftaggregat](https://freesound.org/people/Kraftaggregat/sounds/737643/).
- [Bigorna, pablodavilla](https://freesound.org/people/pablodavilla/sounds/592111/), [correntes, Roxis_Boy](https://freesound.org/people/Roxis_Boy/sounds/401622/), [páginas, xkeril](https://freesound.org/people/xkeril/sounds/856497/), [sino, igroglaz](https://freesound.org/people/igroglaz/sounds/633208/).
- [Passos em pedra, Fission9](https://freesound.org/people/Fission9/sounds/521590/), [porta, soundofsong](https://freesound.org/people/soundofsong/sounds/647646/), [madeira, claretcanelon](https://freesound.org/people/claretcanelon/sounds/346140/), [taça, AardsReal](https://freesound.org/people/AardsReal/sounds/842180/).

As páginas dessas fontes declaram **CC0**. O gerador usa as prévias MP3 de alta qualidade do Freesound e os MP3 do OpenGameArt. Ele procura as fontes em `.audio-work/` com o número do som ou o nome da música, como `629982.mp3` e `homestead.mp3`. Essa pasta é temporária e não vai para o deploy. A lista de URLs das prévias pode ser obtida nas respectivas páginas.

```bash
node privado/gerar_sons.js caminho/para/ffmpeg
node privado/verificar_sons.js
node privado/auditar_sons.js caminho/para/ffmpeg
```

O deploy por Git leva `sons/`. Ao trocar novamente um MP3, aumente `SONS_ASSET_REV` em `privado/sons.php` e a versão `mesa` dos dados em `js/app.js`, pois o cache público dura 30 dias.
