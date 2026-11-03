# Segurança e implantação

> Resultado da auditoria sobre "alguém ver o que é do mestre". Documento vivo.

---

## 1. O que protege o conteúdo do mestre

- **Todo o conteúdo secreto** (grimórios completos, bestiário, segredos, sorteio, anotações, ganchos, tokens ocultos) está em `privado/mestre.js`. O `api.php` só entrega esse arquivo a uma conta com papel de **mestre**. O `index.html` e o `js/app.js`, que qualquer um baixa, foram varridos: não têm nenhum desses textos.
- **Toda rota que muda algo** (`estado`, `jogador_*`, `img_*`, `cena_*`, `grid_*`, `cenas`, `campo`) exige conta de mestre. As rotas de jogador só mexem no **próprio** personagem.
- **O que o jogador recebe** é refiltrado **no servidor**, campo a campo (mapa, grimório, perfil, tokens), sem confiar na cópia montada pelo navegador do mestre. O cenário de um local só vai se estiver liberado.
- **Conta sem personagem ligado** (alguém de fora que só criou conta) não recebe mapa, cena nem imagens. Só vê o conteúdo geral das Regras. A própria conta pode criar o seu personagem (um por conta, nível 1, só com nome); ou o mestre liga a conta a um personagem na aba Jogadores. Só depois de ter personagem a conta recebe o que o mestre libera.
- **Papel de mestre** só se troca direto no banco (`UPDATE usuarios SET papel='mestre' ...`). Ninguém vira mestre pelo site.
- **Senhas** são guardadas com hash (`password_hash`). O login tem limite de tentativas **por sessão, por IP e por e-mail** (no banco, então descartar o cookie não escapa). O cadastro tem limite por IP.
- **Escrita** só com o cabeçalho `X-Grimoria` (bloqueia formulários de outros sites). O cookie de sessão é `HttpOnly` e `SameSite=Lax`.
- **Texto digitado pelos jogadores** (nome, descrição, sonho...) é escapado em toda tela. Além disso, o `.htaccess` define uma **política de conteúdo (CSP)** que só deixa rodar script do próprio site.
- **Imagens** enviadas são conferidas pelo conteúdo (só JPEG, PNG, WebP e GIF; nada de SVG) e servidas com `nosniff`.

---

## 2. O ponto mais importante: onde ficam os arquivos

A proteção da pasta `privado/`, do `.env`, dos `.md` e do `misterio/` depende do `.htaccess`. **Se a hospedagem não obedecer o `.htaccess`** (alguns painéis usam outro servidor), esses arquivos ficam **baixáveis por qualquer pessoa**, inclusive o `privado/mestre.js` (todo o conteúdo do mestre) e as credenciais do banco.

### Teste agora (30 segundos)
Abra no navegador, em aba anônima. **Todos devem dar erro (403 ou 404)**, nunca mostrar conteúdo:

- `https://SEU-SITE/.env`
- `https://SEU-SITE/privado/mestre.js`
- `https://SEU-SITE/privado/lib.php` (deve vir em branco ou erro, nunca código)
- `https://SEU-SITE/campanha.md` (se você enviou)
- `https://SEU-SITE/misterio/`

Se **qualquer um** abrir, a hospedagem ignora o `.htaccess`: use a opção B abaixo e **troque a senha do banco**.

### Opção A: tudo dentro da pasta do site (funciona só se o `.htaccess` valer)
```
public_html/            ← raiz pública
  index.html, api.php, js/, .htaccess
  privado/              ← lib.php, schema.sql, mestre.js, .htaccess
  .env
```

### Opção B (recomendada): a parte privada FORA da raiz pública
```
(pasta acima da raiz pública)/
  grimoria_privado/     ← lib.php, schema.sql, mestre.js  (renomeie a pasta "privado")
  .env.php              ← credenciais (veja abaixo)
public_html/            ← raiz pública
  index.html, api.php, js/, .htaccess
```
O `api.php` usa a pasta `grimoria_privado` automaticamente quando ela existe ao lado da raiz pública. Fora da raiz pública, nenhuma configuração do servidor pode expô-la.

### Formato `.env.php` (credenciais "à prova de erro")
Em vez de `.env`, crie `.env.php` com a primeira linha `<?php exit; ?>`:
```
<?php exit; ?>
db_host=...
db_base=...
db_user=...
db_pass=...
```
Se o servidor ignorar o `.htaccess` e alguém abrir o arquivo pela internet, o PHP executa, sai na primeira linha e não mostra nada. O site lê os dois formatos (`.env.php` tem prioridade).

---

## 3. O que NÃO enviar para o servidor

- `campanha.md`, `grids.md`, `seguranca.md` (anotações do mestre; o `.htaccess` bloqueia `.md`, mas não precisa nem subir).
- A pasta `.git`.
- As pastas `image/` e `players/` (as imagens são enviadas pelo próprio site, para o banco).
- `diagnostico.php`: **só use enquanto estiver resolvendo um problema e apague depois.** Ele nunca mostra senha, usuário, host nem nome do banco, e só funciona com `debug=1`.
- **`debug=1`** no arquivo de credenciais: remova assim que o site funcionar. Com ele ligado, qualquer visitante que provoque um erro vê detalhes técnicos.

---

## 4. Decisões de projeto (não são falhas, mas vale saber)

- **O jogador vê a foto dos outros personagens que estão como token no mapa no ar.** Fora disso, o retrato é só do dono e do mestre.
- **Token oculto do mestre**: os jogadores não o veem, mas durante o combate a mensagem "algo se move nas sombras" revela que **alguém** age. É proposital; se preferir que nada apareça, é uma linha para tirar.
- **Qualquer pessoa com o endereço pode criar conta.** Sem ser ligada a um personagem, ela não vê nada do jogo. Quem tem conta mas é de fora pode, no máximo, gastar o limite de cadastro.
- **Bloqueio por e-mail**: depois de 8 senhas erradas em 15 minutos, aquele e-mail fica bloqueado por um tempo (inclusive o seu, se alguém ficar tentando). É o preço de proteger a conta do mestre; o bloqueio passa sozinho.
- **Forçar HTTPS**: ative no painel da hospedagem ("forçar HTTPS"). Eu não coloquei o redirecionamento no `.htaccess` porque, se o servidor não informar que a conexão é segura, ele pode criar um laço infinito e derrubar o site.
- **Escolha uma senha forte para a conta de mestre** (a conta que você promove no banco). É a chave de tudo.

---

## 5. Se algum dia a senha do banco aparecer em público

Troque-a no painel da hospedagem e atualize o arquivo de credenciais. Como ela já foi colada numa conversa, **vale trocar agora**, por precaução.
