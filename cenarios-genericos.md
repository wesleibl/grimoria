# Cenários genéricos: prompts de imagem

Os 18 cenários abaixo já foram criados na aba **Cenários** (ocultos, com resumo e notas do mestre) e esperam só a imagem. Eles aparecem com uma imagem provisória escura que diz "Imagem aguardando".

Como usar:

1. Gere uma imagem por cenário com o prompt (já inclui o estilo base).
2. Proporção **16:9** (paisagem), como as imagens de `misterio/` (cerca de 1700×930).
3. Em **Cenários**, abra o cenário e use **Trocar a foto**.
4. Para combater nele, use **Adicionar imagem de grid** (ver `grids.md`). Para o grid, peça a mesma cena em vista de cima (veja "Versão para grid" no fim).

## Estilo base (já incluído em todos os prompts)

> detailed fantasy environment concept art, painterly anime-influenced illustration, rich textures, warm lantern light against cool shadows, volumetric light rays, muted earthy palette with moss green, stone grey and warm wood browns, wide 16:9 establishing shot at eye level, empty scene with no characters, no text, no watermark, no frame

Dica: gere o primeiro e use-o como referência de estilo nos próximos (Midjourney: `--sref`; Stable Diffusion: IP-Adapter). Todos são **cenas vazias**, sem pessoas, para o mestre colocar os tokens por cima.

## Prompts

| # | Cenário | Prompt (cole o estilo base no fim) |
|---|---|---|
| 1 | Caverna Comum | natural limestone cave interior, narrow entrance with daylight behind, stalactites and stalagmites, shallow underground pool, scattered bones and old campfire ashes, damp mossy rock, a low side tunnel leading into darkness |
| 2 | Sala de Pedra | empty square stone chamber, thick wooden reinforced door, iron torch sconces with burning torches, dusty flagstone floor with drag marks, a locked wooden chest in the corner, cobwebs, cracked walls |
| 3 | Taverna | cozy medieval tavern main hall, big stone fireplace with a roaring fire, long wooden tables and benches, barrels stacked behind a counter, small stage in a corner, hanging lanterns, mugs on tables, warm golden light |
| 4 | Pousada | roadside inn at dusk, two-story timber and stone building, lit windows, hanging wooden sign, stable and hay cart on the side, dirt road in front, smoke from the chimney, lanterns by the door |
| 5 | Quarto de Pousada | small inn bedroom, two simple beds with wool blankets, wooden chest at the foot of a bed, oil lamp on a nightstand, small window showing a night street, rough plank floor, rug, door with an iron latch |
| 6 | Estrada de Terra | winding dirt road through farmland and a light forest, deep cart wheel ruts, wooden fence, a broken wagon wheel by the roadside, distant hills, late afternoon sun, wildflowers on the verge |
| 7 | Praça do Mercado | village market square, colorful cloth-covered stalls with baskets of fruit, fish and fabrics, stone well in the center, cobblestones, timber houses around, a notice board, crates and sacks, bright morning light |
| 8 | Ferraria | blacksmith workshop interior, glowing forge, heavy anvil with a half-finished sword, hammers and tongs on the wall, swords and axes on racks, quenching barrel, sparks floating, hot orange light against dark beams |
| 9 | Cripta | ancient crypt, rows of stone sarcophagi, burial niches in the walls, a cold unlit altar, thick cobwebs, cracked stone floor, faint pale blue glow from the far end, mist at floor level |
| 10 | Esgoto | brick sewer tunnel with a dark water channel in the middle, narrow stone walkways on both sides, arched ceiling, rusty iron grate, dripping pipes, faint light from a drain above, gang symbols scratched on a wall |
| 11 | Acampamento | forest campsite at dusk, stone-ringed campfire with glowing embers, log seats, two canvas tents, bedrolls, cooking pot on a tripod, supplies in crates, trees around, fireflies, last orange light through the leaves |
| 12 | Biblioteca | old library hall, tall bookshelves to the ceiling with a rolling ladder, reading tables with open books and candles, a globe, dust motes in light from tall arched windows, a locked iron-barred section at the back |
| 13 | Cabana na Floresta | small log cabin in a dense forest clearing, smoke from a stone chimney, herbs drying under the porch roof, chopped firewood stack, a lantern by the door, small garden, a narrow path leading in, soft green light |
| 14 | Capela | small stone village chapel interior, wooden pews, an altar with lit candles, a stained glass window casting colored light on the floor, stone arches, an offering box, a narrow stair going down behind the altar |
| 15 | Beco da Cidade | narrow cobblestone alley at night between tall timber-framed houses, a single glowing lantern, wet stones reflecting light, crates and barrels, rooftops overhead with laundry lines, a half-open service door, fog |
| 16 | Porão de Armazém | warehouse cellar, stacked wooden crates and barrels, hanging oil lamp, sacks of grain, stone arches, a trapdoor in the ceiling with a ladder, rope coils, damp floor, shadows between the stacks |
| 17 | Cela de Prisão | stone dungeon cell, iron-barred door, straw bedding on the floor, a tiny high window with a ray of light, rusty chains on the wall, a wooden bucket, a ring of keys hanging on a hook in the corridor outside |
| 18 | Salão Nobre | noble banquet hall, long polished dining table set with plates and goblets, iron chandelier with many candles, tapestries on stone walls, a large fireplace, tall arched windows with heavy curtains, rich red and gold accents |

## Versão para grid (vista de cima)

Para usar em combate, gere a mesma cena em vista de cima e troque o começo do prompt e o estilo por:

> top-down battle map of [cenário], orthographic bird's-eye view, no perspective, clear open floor space for movement, readable obstacles and cover, painterly fantasy battle map style, no characters, no text, no grid lines, no watermark

Troque `[cenário]` pelo nome em inglês (por exemplo "a medieval tavern interior"). Depois configure colunas e linhas em **Adicionar imagem de grid**.
