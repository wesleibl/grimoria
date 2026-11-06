<?php
declare(strict_types=1);

/* ============================ CONFIG ============================ */

function lerEnv(string $arquivo): array
{
    $out = [];
    if (!is_readable($arquivo)) return $out;
    foreach (file($arquivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $linha) {
        $linha = trim($linha);
        /* Aceita também o formato .env.php, cuja primeira linha é "<?php exit; ?>": se o servidor ignorar o .htaccess e alguém
           abrir o arquivo pela internet, o PHP executa, sai e não mostra nada. */
        if ($linha === '' || $linha[0] === '#' || str_starts_with($linha, '<?') || str_starts_with($linha, '?>')) continue;
        $p = strpos($linha, '=');
        if ($p === false) continue;
        $v = trim(substr($linha, $p + 1));
        if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && substr($v, -1) === $v[0]) $v = substr($v, 1, -1);
        $out[trim(substr($linha, 0, $p))] = $v;
    }
    return $out;
}

/* Onde fica o arquivo de credenciais: ao lado da pasta "privado" (ou "grimoria_privado"). Se a pasta privada estiver FORA da
   raiz pública do site, o arquivo também fica fora, e nada disso é alcançável pela internet. */
function caminhoEnv(): string
{
    $raiz = dirname(__DIR__);
    foreach (['/.env.php', '/.env'] as $nome) {
        if (is_file($raiz . $nome)) return $raiz . $nome;
    }
    return $raiz . '/.env';
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo) return $pdo;
    $env = lerEnv(caminhoEnv());
    $dsn = 'mysql:host=' . ($env['db_host'] ?? 'localhost') . ';dbname=' . ($env['db_base'] ?? '') . ';charset=utf8mb4';
    $pdo = new PDO($dsn, $env['db_user'] ?? '', $env['db_pass'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    garantirSchema($pdo);
    return $pdo;
}

/* ============================ LIMITE DE TENTATIVAS ============================ */

/* Conta as tentativas por IP e por e-mail no banco (não na sessão: quem descarta o cookie escaparia do limite).
   Fica na tabela estado, com chaves "lim:…" que a API nunca expõe a ninguém. */
function chaveLimite(string $tipo, string $id): string { return 'lim:' . substr(md5($tipo . '|' . $id), 0, 28); }

function tentativasRecentes(string $chave, int $janela): array
{
    $st = db()->prepare('SELECT valor FROM estado WHERE chave = ?');
    $st->execute([$chave]);
    $lista = json_decode((string)$st->fetchColumn(), true);
    return is_array($lista) ? array_values(array_filter($lista, fn($t) => is_int($t) && $t > time() - $janela)) : [];
}

function bloqueado(string $tipo, string $id, int $max, int $janela): bool
{
    return count(tentativasRecentes(chaveLimite($tipo, $id), $janela)) >= $max;
}

function anotarTentativa(string $tipo, string $id, int $janela): void
{
    $chave = chaveLimite($tipo, $id);
    $lista = tentativasRecentes($chave, $janela);
    $lista[] = time();
    db()->prepare('INSERT INTO estado (chave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = VALUES(valor)')->execute([$chave, json_encode($lista)]);
    /* De vez em quando, apaga contadores antigos para a tabela não crescer. */
    if (random_int(1, 25) === 1) db()->exec("DELETE FROM estado WHERE chave LIKE 'lim:%' AND atualizado_em < (NOW() - INTERVAL 1 DAY)");
}

function limparTentativas(string $tipo, string $id): void
{
    db()->prepare('DELETE FROM estado WHERE chave = ?')->execute([chaveLimite($tipo, $id)]);
}

function ipCliente(): string { return (string)($_SERVER['REMOTE_ADDR'] ?? '?'); }

/* Cria as tabelas na primeira vez. O arquivo marcador evita repetir isso a cada requisição. */
function garantirSchema(PDO $pdo): void
{
    $marca = __DIR__ . '/.schema-v3';
    if (is_file($marca)) return;
    $sql = file_get_contents(__DIR__ . '/schema.sql');
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $cmd) $pdo->exec($cmd);
    @file_put_contents($marca, date('c'));
}

/* ============================ RESPOSTAS ============================ */

function responder(mixed $dados, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($dados, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function erro(string $msg, int $status = 400): never { responder(['erro' => $msg], $status); }

function corpo(): array
{
    $j = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($j) ? $j : [];
}

/* ============================ SESSÃO ============================ */

function iniciarSessao(): void
{
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    session_name('grimoria');
    session_set_cookie_params(['lifetime' => 60 * 60 * 24 * 30, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax', 'secure' => $https]);
    ini_set('session.gc_maxlifetime', (string)(60 * 60 * 24 * 30));
    /* Usa sempre uma pasta própria para as sessões: a da hospedagem pode ser imposta pelo painel e não persistir os dados. */
    foreach ([PRIVADO . '/sessoes', sys_get_temp_dir() . '/grimoria_sessoes'] as $dir) {
        if (!is_dir($dir)) @mkdir($dir, 0700, true);
        if (is_dir($dir) && is_writable($dir)) { session_save_path($dir); break; }
    }
    if (!session_start()) erro('Não foi possível iniciar a sessão no servidor.', 500);
}

/* Lê a conta do banco a cada requisição, para a troca de papel feita no banco valer na hora. */
function usuarioAtual(): ?array
{
    static $u = false;
    if ($u !== false) return $u;
    $u = null;
    if (empty($_SESSION['uid'])) return null;
    $st = db()->prepare('SELECT id, nome, email, papel FROM usuarios WHERE id = ?');
    $st->execute([$_SESSION['uid']]);
    $u = $st->fetch() ?: null;
    if ($u) $u['id'] = (int)$u['id'];
    return $u;
}

function exigirLogin(): array
{
    $u = usuarioAtual();
    if (!$u) erro('Faça login para continuar.', 401);
    return $u;
}

function exigirMestre(): array
{
    $u = exigirLogin();
    if ($u['papel'] !== 'mestre') erro('Só o mestre pode fazer isso.', 403);
    return $u;
}

/* ============================ ESTADO ============================ */

/* Chaves que o mestre pode gravar. As que terminam em _pub são cópias filtradas que os jogadores leem. */
const CHAVES_ESTADO = ['pend', 'zero', 'rev', 'sorteio', 'magias_lib', 'grim_pub', 'locais_pub', 'vilas_pub', 'acao', 'grids', 'cena_tokens', 'cenarios_info', 'locais_cen', 'itens', 'progresso'];

function lerEstado(string $chave): mixed
{
    $st = db()->prepare('SELECT valor FROM estado WHERE chave = ?');
    $st->execute([$chave]);
    $v = $st->fetchColumn();
    return $v === false ? null : json_decode($v, true);
}

function todoEstado(): array
{
    $out = [];
    foreach (db()->query('SELECT chave, valor FROM estado') as $r) {
        if (in_array($r['chave'], CHAVES_ESTADO, true)) $out[$r['chave']] = json_decode($r['valor'], true);
    }
    return $out;
}

/* ============================ JOGADORES ============================ */

function listarJogadores(): array
{
    $out = [];
    foreach (db()->query('SELECT id, dados, usuario_id FROM jogadores ORDER BY criado_em, id') as $r) {
        $j = json_decode($r['dados'], true) ?: [];
        $j['id'] = $r['id'];
        $j['usuario'] = $r['usuario_id'] === null ? null : (int)$r['usuario_id'];
        $out[] = $j;
    }
    return $out;
}

function jogadorDoUsuario(int $uid): ?array
{
    $st = db()->prepare('SELECT id, dados FROM jogadores WHERE usuario_id = ?');
    $st->execute([$uid]);
    $r = $st->fetch();
    if (!$r) return null;
    $j = json_decode($r['dados'], true) ?: [];
    $j['id'] = $r['id'];
    return $j;
}

/* Grava só os campos recebidos, mantendo o resto. Assim a edição do jogador no Perfil
   e a do mestre na aba Jogadores não se apagam uma à outra. */
function salvarCamposJogador(string $id, array $campos, bool $criar): bool
{
    $pdo = db();
    $pdo->beginTransaction();
    $st = $pdo->prepare('SELECT dados FROM jogadores WHERE id = ? FOR UPDATE');
    $st->execute([$id]);
    $atual = $st->fetchColumn();
    if ($atual === false && !$criar) { $pdo->rollBack(); return false; }
    $dados = $atual === false ? [] : (json_decode($atual, true) ?: []);
    foreach ($campos as $k => $v) $dados[$k] = $v;
    $json = json_encode((object)$dados, JSON_UNESCAPED_UNICODE);
    if (strlen($json) > 2_000_000) { $pdo->rollBack(); erro('Anotações grandes demais.'); }
    $pdo->prepare('INSERT INTO jogadores (id, dados) VALUES (?, ?) ON DUPLICATE KEY UPDATE dados = VALUES(dados)')->execute([$id, $json]);
    $pdo->commit();
    return true;
}

/* ============================ FILTROS PARA O JOGADOR ============================ */

/* As cópias "_pub" são montadas pelo navegador do mestre. Aqui o servidor confere de novo, campo a campo, antes de entregar:
   assim uma cópia antiga, ou com algo a mais por engano, nunca vaza. */
function locaisParaJogador(array $lista): array
{
    $ok = array_flip(['id', 'nome', 'tipo', 'x', 'y', 'lab', 'cenario', 'cv', 'cenNome', 'cenResumo']);
    $info = lerEstado('cenarios_info') ?? [];
    $out = [];
    foreach ($lista as $l) {
        if (!is_array($l)) continue;
        $l = array_intersect_key($l, $ok);
        /* O cenário de um local só vai se estiver liberado (a caixa "Mostrar o cenário ao clicar"). */
        if (!empty($l['cenario']) && empty($info[(int)$l['cenario']]['liberado'])) {
            unset($l['cenario'], $l['cv'], $l['cenNome'], $l['cenResumo']);
        }
        $out[] = $l;
    }
    return $out;
}

function grimParaJogador(array $g, string $nome): array
{
    $lib = (lerEstado('magias_lib') ?? [])[$nome] ?? [];
    $campos = array_flip(['nome', 'custo', 'tipo', 'texto', 'aplica', 'dot', 'limite', 'marco']);
    $spells = [];
    foreach (($g['spells'] ?? []) as $s) {
        if (is_array($s) && in_array($s['nome'] ?? '', $lib, true)) $spells[] = array_intersect_key($s, $campos);
    }
    return ['nome' => $nome, 'attr' => $g['attr'] ?? '', 'papel' => $g['papel'] ?? '', 'elem' => $g['elem'] ?? '', 'sub' => $g['sub'] ?? '', 'tier' => $g['tier'] ?? '', 'spells' => $spells];
}

/* ============================ IMAGENS ============================ */

/* Lê uma imagem enviada como data URL e devolve [mime, bytes]. */
function decodificarImagem(mixed $dataUrl): array
{
    if (!preg_match('#^data:image/[a-z+]+;base64,(.+)$#s', (string)$dataUrl, $m)) erro('Imagem inválida.');
    $bin = base64_decode($m[1], true);
    if ($bin === false || strlen($bin) > 8_000_000) erro('A imagem é grande demais (máximo 8 MB).');
    $info = @getimagesizefromstring($bin);
    $mime = $info['mime'] ?? '';
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) erro('Formato de imagem não aceito.');
    return [$mime, $bin];
}

function listarImagens(?callable $filtro = null): array
{
    $out = [];
    foreach (db()->query('SELECT id, tipo, ref, titulo, liberado, criado_em FROM imagens ORDER BY criado_em, id') as $r) {
        $r['id'] = (int)$r['id'];
        $r['liberado'] = (bool)$r['liberado'];
        if (!$filtro || $filtro($r)) $out[] = $r;
    }
    return $out;
}

/* Regras de quem vê qual imagem: o mestre vê tudo; o jogador vê mapas liberados,
   o próprio retrato e as imagens dos locais já revelados. */
function jogadorPodeVer(array $img, ?array $jog, array $locaisPub): bool
{
    if ($img['tipo'] === 'mapa') return (bool)$img['liberado'];
    /* O retrato é do dono, e também dos personagens que aparecem como token na cena que está no ar (o jogador vê os
       outros pelo token). Fora disso, só o dono. */
    if ($img['tipo'] === 'avatar') return ($jog && $img['ref'] === $jog['id']) || avatarEmCena((string)$img['ref']);
    if ($img['tipo'] === 'local') return in_array($img['ref'], $locaisPub, true);
    return false;
}

function avatarEmCena(string $jogId): bool
{
    $a = lerEstado('acao') ?? [];
    if (empty($a['ativo']) || ($a['modo'] ?? 'grid') === 'foto') return false;
    $campo = campoLer();
    foreach (($a['tokens'] ?? []) as $t) {
        if (is_array($t) && ($t['jog'] ?? null) === $jogId && ($t['tipo'] ?? '') === 'jogador' && isset($t['id'], $campo['pos'][(string)$t['id']]) && tokenVisivel($t, $campo)) return true;
    }
    return false;
}

/* id da imagem de retrato de cada personagem (jogadores.dados.img), para mostrar no token no lugar das iniciais. */
function fotosJogadores(array $ids): array
{
    $ids = array_values(array_unique(array_filter($ids, 'is_string')));
    if (!$ids) return [];
    $st = db()->prepare('SELECT id, dados FROM jogadores WHERE id IN (' . implode(',', array_fill(0, count($ids), '?')) . ')');
    $st->execute($ids);
    $out = [];
    foreach ($st->fetchAll() as $r) {
        $img = (int)((json_decode((string)$r['dados'], true) ?: [])['img'] ?? 0);
        if ($img > 0) $out[$r['id']] = $img;
    }
    return $out;
}

function idsLocaisPub(): array
{
    return array_values(array_filter(array_map(fn($l) => is_array($l) ? ($l['id'] ?? null) : null, lerEstado('locais_pub') ?? [])));
}

/* ============================ CENAS DE AÇÃO ============================ */

/* As imagens de grid ficam em misterio/{local}/grid/{cenario}.png. A pasta é bloqueada
   no .htaccess: elas só saem pelo api.php, e o jogador só recebe a cena ativa. */
const EXT_CENA = ['png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'webp' => 'image/webp', 'gif' => 'image/gif'];

function dirCenas(): string
{
    $junto = dirname(__DIR__) . '/misterio';
    return is_dir($junto) ? $junto : dirname($_SERVER['SCRIPT_FILENAME'] ?? __FILE__) . '/misterio';
}

function nomeSeguro(mixed $n): bool
{
    return is_string($n) && preg_match('/^[A-Za-z0-9][A-Za-z0-9 _.-]{0,100}$/', $n) === 1 && !str_contains($n, '..');
}

function listarCenas(): array
{
    $out = [];
    $base = dirCenas();
    if (!is_dir($base)) return $out;
    foreach (scandir($base) as $local) {
        if (!nomeSeguro($local) || !is_dir("$base/$local/grid")) continue;
        $cenas = [];
        foreach (scandir("$base/$local/grid") as $arq) {
            $ext = strtolower(pathinfo($arq, PATHINFO_EXTENSION));
            if (nomeSeguro($arq) && isset(EXT_CENA[$ext]) && is_file("$base/$local/grid/$arq")) $cenas[] = $arq;
        }
        if ($cenas) $out[] = ['local' => $local, 'cenas' => $cenas];
    }
    return $out;
}

function arquivoCena(mixed $local, mixed $cena): ?string
{
    if (!nomeSeguro($local) || !nomeSeguro($cena)) return null;
    if (!isset(EXT_CENA[strtolower(pathinfo($cena, PATHINFO_EXTENSION))])) return null;
    $arq = realpath(dirCenas() . "/$local/grid/$cena");
    $base = realpath(dirCenas());
    if ($arq === false || $base === false || !str_starts_with($arq, $base . DIRECTORY_SEPARATOR) || !is_file($arq)) return null;
    return $arq;
}

/* Cenários enviados pelo site ficam na tabela cenas, com o grid (colunas e linhas) de cada um. */
function cenaEnviada(int $id, bool $comDados = false): ?array
{
    $st = db()->prepare('SELECT id, nome, mime, colunas, linhas, UNIX_TIMESTAMP(criado_em) AS ts' . ($comDados ? ', dados' : '') . ' FROM cenas WHERE id = ?');
    $st->execute([$id]);
    return $st->fetch() ?: null;
}

/* Cada cenário tem uma foto (sem grid) e zero ou mais mapas de grid, que são imagens extras com as próprias colunas e linhas. */
function gridCena(int $id, ?int $cena = null, bool $comDados = false): ?array
{
    $sql = 'SELECT id, cena_id, nome, mime, colunas, linhas, UNIX_TIMESTAMP(criado_em) AS ts' . ($comDados ? ', dados' : '') . ' FROM cena_grids WHERE id = ?';
    $par = [$id];
    if ($cena !== null) { $sql .= ' AND cena_id = ?'; $par[] = $cena; }
    $st = db()->prepare($sql);
    $st->execute($par);
    return $st->fetch() ?: null;
}

function listarCenasEnviadas(): array
{
    $grids = [];
    foreach (db()->query('SELECT id, cena_id, nome, colunas, linhas, UNIX_TIMESTAMP(criado_em) AS ts FROM cena_grids ORDER BY criado_em, id') as $g) {
        $grids[(int)$g['cena_id']][] = ['id' => (int)$g['id'], 'nome' => $g['nome'], 'cols' => (int)$g['colunas'], 'rows' => $g['linhas'] === null ? null : (int)$g['linhas'], 'v' => (int)$g['ts']];
    }
    $out = [];
    foreach (db()->query('SELECT id, nome, UNIX_TIMESTAMP(criado_em) AS ts FROM cenas ORDER BY criado_em, id') as $r) {
        /* v muda quando a imagem é trocada, para o navegador não mostrar a antiga guardada. */
        $out[] = ['id' => (int)$r['id'], 'nome' => $r['nome'], 'v' => (int)$r['ts'], 'grids' => $grids[(int)$r['id']] ?? []];
    }
    return $out;
}

/* Constantes usadas pelo api.php. Ficam aqui porque um "const" só vale depois da linha em que aparece,
   e o api.php executa a ação antes de chegar ao fim do arquivo. */
/* O jogador edita só estes campos do próprio personagem. Observações, moralidade,
   grimório e vilarejo continuam nas mãos do mestre. */
const CAMPOS_PERFIL = ['personagem' => 60, 'altura' => 20, 'descricao' => 2000, 'sonho' => 2000, 'medo' => 2000];
const ATRIBUTOS = ['poder', 'destreza', 'inteligencia'];
/* Questionário do grimório: quantas alternativas (A, B, C, D) cada uma das 5 perguntas tem. O servidor só guarda as respostas; a tabela de pontos fica no arquivo do mestre. */
const QUESTIONARIO_OPCOES = [4, 3, 4, 4, 4];

/* ============================ INVENTÁRIO ============================ */

/* Cada jogador tem 'inv' (lista de itens) e 'moedas' dentro do próprio registro. As alterações chegam como operações pequenas
   (adicionar, mudar campos de um item, remover, moedas), aplicadas aqui dentro de uma transação com bloqueio: jogador e mestre
   podem mexer ao mesmo tempo sem apagar o trabalho um do outro. Os campos 'mestre', 'sinergia' e 'fase' são SEGREDO do mestre:
   o jogador não os grava e nunca os recebe. */
const CATS_ITEM = ['arma', 'armadura', 'aventura', 'ferramenta', 'consumivel', 'magico', 'tesouro', 'outro'];
const RARID_ITEM = ['comum', 'incomum', 'raro', 'lendário'];
const MAX_ITENS = 300;
const CAMPOS_ITEM_MESTRE = ['mestre', 'sinergia', 'fase'];

function itemAplicar(array $item, array $campos, bool $mestre): array
{
    $txt = ['nome' => 80, 'efeito' => 200, 'desc' => 1500, 'nota' => 1000, 'ref' => 40, 'motivo' => 300];
    foreach ($campos as $k => $v) {
        if (isset($txt[$k])) { $item[$k] = mb_substr(trim((string)$v), 0, $txt[$k]); continue; }
        switch ($k) {
            case 'cat': $item['cat'] = in_array($v, CATS_ITEM, true) ? $v : 'outro'; break;
            case 'raridade': $item['raridade'] = in_array($v, RARID_ITEM, true) ? $v : 'comum'; break;
            case 'qtd': $item['qtd'] = max(0, min(9999, (int)$v)); break;
            case 'peso': $item['peso'] = round(max(0.0, min(9999.0, (float)$v)), 2); break;
            case 'valor': $item['valor'] = max(0, min(100000000, (int)$v)); break;
            case 'equip': $item['equip'] = (bool)$v; break;
            case 'def': case 'desl': case 'mana': $item[$k] = max(-10, min(10, (int)$v)); break; /* bônus (ou penalidade) enquanto equipado */
            case 'mestre': if ($mestre) $item['mestre'] = mb_substr(trim((string)$v), 0, 2000); break;
            case 'fase': if ($mestre) $item['fase'] = mb_substr(trim((string)$v), 0, 60); break;
            case 'sinergia':
                if ($mestre) {
                    $l = [];
                    foreach ((array)$v as $g) { $g = mb_substr(trim((string)$g), 0, 40); if ($g !== '') $l[] = $g; }
                    $item['sinergia'] = array_slice(array_values(array_unique($l)), 0, 20);
                }
                break;
        }
    }
    return $item;
}

/* O jogador recebe o inventário sem os segredos do mestre. */
function invVisivel(array $inv, bool $mestre): array
{
    /* Item com quantidade 0 não aparece (e sai do banco na próxima alteração). */
    $inv = array_filter($inv, fn($i) => is_array($i) && (int)($i['qtd'] ?? 1) > 0);
    if ($mestre) return array_values($inv);
    $out = [];
    foreach ($inv as $i) $out[] = array_diff_key($i, array_flip(CAMPOS_ITEM_MESTRE));
    return $out;
}

function moedasLimpas(mixed $m): array
{
    $m = is_array($m) ? $m : [];
    $out = [];
    foreach (['po', 'pp', 'pc'] as $k) $out[$k] = max(0, min(999999999, (int)($m[$k] ?? 0)));
    return $out;
}

function inventarioOp(string $jogId, string $op, array $c, bool $mestre): array
{
    $pdo = db();
    $pdo->beginTransaction();
    $st = $pdo->prepare('SELECT dados FROM jogadores WHERE id = ? FOR UPDATE');
    $st->execute([$jogId]);
    $atual = $st->fetchColumn();
    if ($atual === false) { $pdo->rollBack(); erro('Jogador não encontrado.', 404); }
    $dados = json_decode($atual, true) ?: [];
    $inv = array_values(array_filter((array)($dados['inv'] ?? []), 'is_array'));
    $moedas = moedasLimpas($dados['moedas'] ?? []);

    if ($op === 'add') {
        if (count($inv) >= MAX_ITENS) { $pdo->rollBack(); erro('Inventário cheio (máximo ' . MAX_ITENS . ' itens).'); }
        $campos = (array)($c['item'] ?? []);
        /* Só o mestre cria item do zero. O jogador só adiciona item da lista básica (que vem com "ref"). */
        if (!$mestre && trim((string)($campos['ref'] ?? '')) === '') { $pdo->rollBack(); erro('Só o mestre pode criar itens manualmente.', 403); }
        $item = itemAplicar(['id' => bin2hex(random_bytes(6)), 'nome' => '', 'cat' => 'outro', 'qtd' => 1, 'peso' => 0, 'valor' => 0, 'equip' => false], $campos, $mestre);
        if ($item['nome'] === '') { $pdo->rollBack(); erro('Dê um nome ao item.'); }
        $inv[] = $item;
    } elseif ($op === 'add_lote') {
        /* Vários itens de uma vez, com o motivo e, se o jogador quiser, o desconto do valor nas moedas (1 po = 10 pp = 100 pc). */
        $lista = array_values(array_filter((array)($c['itens'] ?? []), 'is_array'));
        if (!$lista || count($lista) > 30) { $pdo->rollBack(); erro('Escolha de 1 a 30 itens.'); }
        if (count($inv) + count($lista) > MAX_ITENS) { $pdo->rollBack(); erro('Inventário cheio (máximo ' . MAX_ITENS . ' itens).'); }
        $motivo = mb_substr(trim((string)($c['motivo'] ?? '')), 0, 300);
        if (!$mestre && mb_strlen($motivo) < 3) { $pdo->rollBack(); erro('Escreva o motivo de pegar esses itens.'); }
        $novos = [];
        $custo = 0;
        foreach ($lista as $campos) {
            if (!$mestre && trim((string)($campos['ref'] ?? '')) === '') { $pdo->rollBack(); erro('Só o mestre pode criar itens manualmente.', 403); }
            $item = itemAplicar(['id' => bin2hex(random_bytes(6)), 'nome' => '', 'cat' => 'outro', 'qtd' => 1, 'peso' => 0, 'valor' => 0, 'equip' => false], $campos, $mestre);
            if ($item['nome'] === '') { $pdo->rollBack(); erro('Item sem nome.'); }
            if ((int)$item['qtd'] < 1) $item['qtd'] = 1;
            if ($motivo !== '') $item['motivo'] = $motivo;
            $custo += (int)$item['valor'] * (int)$item['qtd'];
            $novos[] = $item;
        }
        if (!empty($c['descontar'])) {
            $total = $moedas['po'] * 100 + $moedas['pp'] * 10 + $moedas['pc'];
            if ($custo > $total) { $pdo->rollBack(); erro('Moedas insuficientes: o total é ' . $custo . ' pc (100 pc = 1 po) e você tem ' . $total . ' pc.'); }
            $resto = $total - $custo;
            $moedas = ['po' => intdiv($resto, 100), 'pp' => intdiv($resto % 100, 10), 'pc' => $resto % 10];
        }
        $inv = array_merge($inv, $novos);
    } elseif ($op === 'set' || $op === 'del') {
        $id = (string)($c['id'] ?? '');
        $achou = false;
        foreach ($inv as $k => $i) {
            if (($i['id'] ?? '') !== $id) continue;
            $achou = true;
            if ($op === 'del') { unset($inv[$k]); break; }
            $novo = itemAplicar($i, (array)($c['campos'] ?? []), $mestre);
            /* O jogador não aumenta a quantidade de um item (é o mesmo que ganhar item) sem dizer o motivo. */
            if (!$mestre && (int)($novo['qtd'] ?? 0) > (int)($i['qtd'] ?? 0)) {
                $motivo = mb_substr(trim((string)($c['motivo'] ?? '')), 0, 300);
                if (mb_strlen($motivo) < 3) { $pdo->rollBack(); erro('Escreva o motivo de ganhar mais deste item.'); }
                $novo['motivo'] = $motivo;
            }
            if ($novo['nome'] === '') $novo['nome'] = $i['nome'] ?? 'Item';
            /* Quantidade 0 = o item acabou: sai do inventário em vez de ficar como "×0". */
            if ((int)($novo['qtd'] ?? 1) <= 0) unset($inv[$k]); else $inv[$k] = $novo;
            break;
        }
        if (!$achou) { $pdo->rollBack(); erro('Esse item não existe mais. Atualize a página.', 409); }
    } elseif ($op === 'moedas') {
        $antes = $moedas['po'] * 100 + $moedas['pp'] * 10 + $moedas['pc'];
        $moedas = moedasLimpas($c['moedas'] ?? []);
        $depois = $moedas['po'] * 100 + $moedas['pp'] * 10 + $moedas['pc'];
        /* Ganhar dinheiro exige motivo (gastar não). Cada mudança fica registrada para o mestre ver. */
        $motivo = mb_substr(trim((string)($c['motivo'] ?? '')), 0, 300);
        if (!$mestre && $depois > $antes && mb_strlen($motivo) < 3) { $pdo->rollBack(); erro('Escreva o motivo de ganhar dinheiro.'); }
        if ($depois !== $antes) {
            $log = array_values(array_filter((array)($dados['moedasLog'] ?? []), 'is_array'));
            $log[] = ['em' => date('c'), 'por' => $mestre ? 'mestre' : 'jogador', 'de' => $antes, 'para' => $depois, 'motivo' => $motivo];
            $dados['moedasLog'] = array_slice($log, -30);
        }
    } elseif ($op === 'kit_liberar' && $mestre) {
        $dados['kitFeito'] = false;
    } else {
        $pdo->rollBack();
        erro('Operação inválida.');
    }

    /* Também limpa itens que ficaram com quantidade 0 de antes. */
    $dados['inv'] = array_values(array_filter($inv, fn($i) => (int)($i['qtd'] ?? 1) > 0));
    $dados['moedas'] = $moedas;
    $json = json_encode((object)$dados, JSON_UNESCAPED_UNICODE);
    if (strlen($json) > 2_000_000) { $pdo->rollBack(); erro('Dados grandes demais.'); }
    $pdo->prepare('UPDATE jogadores SET dados = ? WHERE id = ?')->execute([$json, $jogId]);
    $pdo->commit();
    $out = ['inv' => invVisivel($dados['inv'], $mestre), 'moedas' => $moedas, 'kitFeito' => !empty($dados['kitFeito'])];
    if ($mestre) $out['moedasLog'] = array_values((array)($dados['moedasLog'] ?? []));
    return $out;
}

/* ============================ KIT INICIAL ============================ */

/* Depois de criar o personagem, o jogador monta o próprio kit UMA vez: itens fixos + escolhas por grupo. O servidor confere tudo
   (quem manda o que quer não passa da lista) e marca 'kitFeito'; o mestre pode liberar de novo. Valores em cobre (100 = 1 ouro), pesos em kg. */
function kitIt(string $id, string $cat, string $nome, string $efeito, float $peso, int $valor, int $qtd = 1, string $desc = '', array $x = []): array
{
    return ['id' => $id, 'cat' => $cat, 'nome' => $nome, 'efeito' => $efeito, 'peso' => $peso, 'valor' => $valor, 'qtd' => $qtd, 'desc' => $desc] + $x;
}
function kitInicial(): array
{
    $arm = 'Adaptação do 5e: a Defesa é 10 + Destreza, então a proteção soma um bônus fixo.';
    return [
        'moedas' => ['po' => 10, 'pp' => 0, 'pc' => 0],
        'fixos' => [
            kitIt('mochila', 'aventura', 'Mochila', 'Carrega pequenos itens', 2.25, 200),
            kitIt('saco-dormir', 'aventura', 'Saco de dormir', '', 3.15, 100),
            kitIt('cantil', 'aventura', 'Cantil', 'Guarda 2 litros de líquido', 2.25, 200),
            kitIt('racao', 'aventura', 'Ração (1 dia)', 'Comida seca para um dia', 0.9, 50, 3),
            kitIt('pederneira', 'aventura', 'Pederneira e isqueiro', 'Acende fogo', 0.45, 50),
            kitIt('emblema', 'tesouro', 'Emblema do Vilarejo', 'Prova de origem', 0.05, 0, 1, 'Pingente de madeira com o símbolo do seu vilarejo. Gente de lá confia em quem o mostra.'),
        ],
        'grupos' => [
            /* Plebeus de vilarejo, num mundo onde o grimório é a arma de verdade: nada de espada de cavaleiro. São ferramentas de trabalho
               de cada canto de Grimoria, e o jogador pode seguir sem arma. */
            ['id' => 'arma', 'nome' => 'Arma ou ferramenta de trabalho (opcional)', 'min' => 0, 'max' => 1, 'itens' => [
                kitIt('adaga', 'arma', 'Adaga', 'Dano 1d4 perfurante · leve, arremesso', 0.45, 200),
                kitIt('faca-caca', 'arma', 'Faca de caça', 'Dano 1d4 cortante · leve', 0.45, 200, 1, 'Comum entre os caçadores da Floresta dos Cedros.'),
                kitIt('foice', 'arma', 'Foice', 'Dano 1d4 cortante · leve', 0.9, 100, 1, 'Ferramenta de colheita do Vale das Colheitas.'),
                kitIt('machadinha', 'arma', 'Machadinha de lenha', 'Dano 1d6 cortante · leve, arremesso', 0.9, 500),
                kitIt('forcado', 'arma', 'Forcado', 'Dano 1d6 perfurante · versátil', 1.8, 100, 1, 'Ferramenta de fazenda, boa para manter a distância.'),
                kitIt('arpao', 'arma', 'Arpão', 'Dano 1d6 perfurante · arremesso', 1.8, 100, 1, 'Usado pelos pescadores de Porto Salgado.'),
                kitIt('picareta', 'arma', 'Picareta de mineiro', 'Dano 1d6 perfurante · versátil (1d8)', 4.5, 200, 1, 'Ferramenta das minas de Pedra Velha.'),
                kitIt('marreta', 'arma', 'Marreta de pedreiro', 'Dano 1d8 contundente · duas mãos', 4.5, 200),
                kitIt('bordao', 'arma', 'Bordão', 'Dano 1d6 contundente · versátil (1d8)', 1.8, 20, 1, 'Cajado de viajante. Também serve de apoio na estrada.'),
                kitIt('arco-caca', 'arma', 'Arco de caça com 20 flechas', 'Dano 1d6 perfurante · à distância', 1.35, 2600),
                kitIt('funda', 'arma', 'Funda com pedras', 'Dano 1d4 contundente · à distância', 0.45, 10),
            ]],
            ['id' => 'protecao', 'nome' => 'Proteção (opcional)', 'min' => 0, 'max' => 1, 'itens' => [
                kitIt('acolchoada', 'armadura', 'Armadura acolchoada', 'Defesa +1 (leve)', 3.6, 500, 1, $arm, ['def' => 1]),
                kitIt('couro', 'armadura', 'Armadura de couro', 'Defesa +1 (leve)', 4.5, 1000, 1, $arm, ['def' => 1]),
                kitIt('gibao', 'armadura', 'Gibão de peles', 'Defesa +2 (média)', 5.4, 1000, 1, $arm, ['def' => 2]),
                kitIt('escudo', 'armadura', 'Escudo', 'Defesa +1', 2.7, 1000, 1, $arm, ['def' => 1]),
            ]],
            ['id' => 'equip', 'nome' => 'Equipamento e ferramentas', 'min' => 0, 'max' => 4, 'itens' => [
                kitIt('corda', 'aventura', 'Corda de cânhamo (15 m)', 'Aguenta uma pessoa', 4.5, 100),
                kitIt('tocha', 'aventura', 'Tocha', 'Luz por 1 hora (6 m)', 0.45, 1, 3),
                kitIt('lanterna', 'aventura', 'Lanterna coberta com óleo', 'Luz por 6 horas', 1.35, 600),
                kitIt('pe-cabra', 'aventura', 'Pé de cabra', 'Vantagem para forçar portas e baús', 2.25, 200),
                kitIt('barraca', 'aventura', 'Barraca (2 pessoas)', '', 9.0, 200),
                kitIt('espelho', 'aventura', 'Espelho de aço', '', 0.23, 500),
                kitIt('kit-curandeiro', 'ferramenta', 'Kit de curandeiro', '10 usos · estabiliza um aliado caído', 1.35, 500),
                kitIt('ferr-ladrao', 'ferramenta', 'Ferramentas de ladrão', 'Arrombar fechaduras e desarmar armadilhas', 0.45, 2500),
                kitIt('herbalismo', 'ferramenta', 'Kit de herbalismo', 'Reconhecer plantas e preparar ervas', 1.35, 500),
                kitIt('alaude', 'ferramenta', 'Alaúde', 'Instrumento musical', 0.9, 3500),
                kitIt('baralho', 'ferramenta', 'Baralho', '', 0.0, 50),
                kitIt('pergaminho', 'aventura', 'Pergaminho, tinta e pena', '', 0.1, 1100),
                kitIt('estojo-grimorio', 'aventura', 'Estojo de grimório', 'Protege o grimório da chuva, do fogo leve e de mãos ligeiras', 0.5, 600, 1, 'Estojo de couro com fecho, feito para um livro de mana.'),
            ]],
            ['id' => 'consumivel', 'nome' => 'Consumíveis', 'min' => 0, 'max' => 2, 'itens' => [
                kitIt('pedra-mana', 'consumivel', 'Pedra de Mana', 'Restaura 2 de mana (gasta uma ação)', 0.1, 2500, 1, 'Cristal azul que se desfaz em luz quando é apertado.'),
                kitIt('pocao-cura', 'consumivel', 'Poção de cura', 'Cura 2d4 + 2 de vida', 0.23, 5000, 1, 'Líquido vermelho que brilha levemente.'),
                kitIt('antitoxina', 'consumivel', 'Antitoxina', 'Vantagem contra veneno por 1 hora', 0.0, 5000),
                kitIt('fogo-alquimico', 'consumivel', 'Fogo alquímico', 'Arremessado: 1d4 de fogo por turno até apagar', 0.45, 5000),
                kitIt('abrolhos', 'consumivel', 'Abrolhos (saco)', 'Quem passa perde deslocamento e sofre 1 de dano', 0.9, 100),
            ]],
        ],
    ];
}

/* Converte uma entrada do kit em item de inventário. */
function kitParaItem(array $k): array
{
    return itemAplicar(['id' => bin2hex(random_bytes(6)), 'nome' => '', 'cat' => 'outro', 'qtd' => 1, 'peso' => 0, 'valor' => 0, 'equip' => false],
        ['nome' => $k['nome'], 'cat' => $k['cat'], 'efeito' => $k['efeito'], 'desc' => $k['desc'], 'peso' => $k['peso'], 'valor' => $k['valor'], 'qtd' => $k['qtd'], 'ref' => 'kit-' . $k['id'], 'def' => $k['def'] ?? 0, 'desl' => $k['desl'] ?? 0, 'mana' => $k['mana'] ?? 0, 'equip' => isset($k['def'])], false);
}

function kitEscolher(string $jogId, array $ids): array
{
    $kit = kitInicial();
    $ids = array_values(array_unique(array_map('strval', $ids)));
    $porGrupo = [];
    $escolhidos = [];
    foreach ($kit['grupos'] as $g) {
        $porGrupo[$g['id']] = 0;
        foreach ($g['itens'] as $it) {
            if (in_array($it['id'], $ids, true)) { $porGrupo[$g['id']]++; $escolhidos[] = $it; }
        }
    }
    if (count($escolhidos) !== count($ids)) erro('Algum item escolhido não está no kit.');
    foreach ($kit['grupos'] as $g) {
        $n = $porGrupo[$g['id']];
        if ($n < $g['min'] || $n > $g['max']) erro('Grupo "' . $g['nome'] . '": escolha de ' . $g['min'] . ' a ' . $g['max'] . '.');
    }
    $pdo = db();
    $pdo->beginTransaction();
    $st = $pdo->prepare('SELECT dados FROM jogadores WHERE id = ? FOR UPDATE');
    $st->execute([$jogId]);
    $atual = $st->fetchColumn();
    if ($atual === false) { $pdo->rollBack(); erro('Jogador não encontrado.', 404); }
    $dados = json_decode($atual, true) ?: [];
    if (!empty($dados['kitFeito'])) { $pdo->rollBack(); erro('Você já escolheu o seu kit inicial. Peça ao mestre para liberar de novo.', 409); }
    $inv = array_values(array_filter((array)($dados['inv'] ?? []), 'is_array'));
    /* Se o mestre liberar o kit de novo, os itens fixos e as moedas não se repetem: só entram as novas escolhas. */
    $refs = array_column($inv, 'ref');
    foreach ($kit['fixos'] as $it) { if (!in_array('kit-' . $it['id'], $refs, true)) $inv[] = kitParaItem($it); }
    foreach ($escolhidos as $it) $inv[] = kitParaItem($it);
    $m = moedasLimpas($dados['moedas'] ?? []);
    if (empty($dados['kitMoedas'])) {
        foreach ($kit['moedas'] as $k => $v) $m[$k] = min(999999999, $m[$k] + $v);
        $dados['kitMoedas'] = true;
    }
    $dados['inv'] = $inv;
    $dados['moedas'] = $m;
    $dados['kitFeito'] = true;
    $pdo->prepare('UPDATE jogadores SET dados = ? WHERE id = ?')->execute([json_encode((object)$dados, JSON_UNESCAPED_UNICODE), $jogId]);
    $pdo->commit();
    return ['inv' => invVisivel($inv, false), 'moedas' => $m, 'kitFeito' => true];
}

/* ============================ CAMPO: POSIÇÕES E COMBATE ============================ */

/* As posições dos tokens e o combate ficam numa chave só ('campo'), que SÓ o servidor altera, dentro de uma
   transação com bloqueio. Assim o mestre e vários jogadores podem agir ao mesmo tempo sem se sobrescrever.
   Estrutura: pos {id: {x, y, gasto}}, combate {fase: ini|turnos, rodada, turno, ini {id: {v, modo}}, ordem [id]},
   revelados {id: true} (armadilhas reveladas pelo mestre aos jogadores), acionadas {id: true} (armadilhas por onde um
   jogador passou; só o mestre sabe), eventos [{t, txt, pub, alerta}], v (versão). */
function campoPadrao(array $c): array
{
    return $c + ['pos' => [], 'combate' => null, 'revelados' => [], 'acionadas' => [], 'eventos' => [], 'v' => 0];
}

function campoLer(): array
{
    $c = lerEstado('campo');
    return campoPadrao(is_array($c) ? $c : []);
}

function campoAtualizar(callable $fn): array
{
    $pdo = db();
    $pdo->prepare("INSERT IGNORE INTO estado (chave, valor) VALUES ('campo', '{}')")->execute();
    $pdo->beginTransaction();
    $st = $pdo->prepare("SELECT valor FROM estado WHERE chave = 'campo' FOR UPDATE");
    $st->execute();
    $c = json_decode((string)$st->fetchColumn(), true);
    $c = campoPadrao(is_array($c) ? $c : []);
    /* erro() encerra o script: a transação aberta é desfeita sozinha, sem gravar nada. */
    $fn($c);
    $c['v'] = (int)$c['v'] + 1;
    $pdo->prepare("UPDATE estado SET valor = ? WHERE chave = 'campo'")->execute([json_encode($c, JSON_UNESCAPED_UNICODE)]);
    $pdo->commit();
    return $c;
}

/* pub = texto que os jogadores veem (null = só o mestre). alerta = o mestre recebe um aviso em destaque. */
function campoEvento(array &$c, string $txt, ?string $pub = null, bool $alerta = false): void
{
    $c['eventos'][] = ['t' => time(), 'txt' => $txt, 'pub' => $pub, 'alerta' => $alerta];
    $c['eventos'] = array_slice($c['eventos'], -30);
}

function tokensAcao(): array
{
    $out = [];
    foreach ((lerEstado('acao')['tokens'] ?? []) as $t) {
        if (is_array($t) && isset($t['id'])) $out[(string)$t['id']] = $t;
    }
    return $out;
}

function tokenVisivel(array $t, array $campo): bool
{
    return empty($t['oculto']) || !empty($campo['revelados'][(string)$t['id']]);
}

function nomeColuna(int $i): string
{
    $s = '';
    for ($n = $i + 1; $n > 0; $n = intdiv($n - 1, 26)) $s = chr(65 + (($n - 1) % 26)) . $s;
    return $s;
}

function dexToken(array $t): int
{
    if (!empty($t['jog'])) {
        $st = db()->prepare('SELECT dados FROM jogadores WHERE id = ?');
        $st->execute([(string)$t['jog']]);
        $d = json_decode((string)$st->fetchColumn(), true);
        /* Destreza total = base da criação + bônus da ficha. Perfis antigos usavam um campo "destreza" solto. */
        if (isset($d['atr'])) return (int)($d['atr']['destreza'] ?? 0) + (int)($d['bonus']['destreza'] ?? 0);
        return (int)($d['destreza'] ?? 0);
    }
    return (int)($t['dex'] ?? 0);
}

/* A rolagem acontece no servidor: o jogador nunca precisa conhecer a Destreza (que só o mestre vê) e ninguém troca o resultado. */
function iniRolada(array $t): array
{
    $d = random_int(1, 20);
    return ['v' => $d + dexToken($t), 'd20' => $d, 'modo' => 'rolado'];
}

function iniDigitada(mixed $v): array
{
    $n = (int)$v;
    if ($n < -20 || $n > 80) erro('Valor de iniciativa fora do esperado.');
    return ['v' => $n, 'modo' => 'digitado'];
}

function ordemIniciativa(array $tokens, array $ini): array
{
    $rank = ['jogador' => 0, 'aliado' => 1, 'inimigo' => 2];
    $lista = [];
    foreach ($tokens as $id => $t) {
        if (!isset($rank[$t['tipo'] ?? '']) || !empty($t['morto'])) continue;
        $lista[] = ['id' => (string)$id, 'v' => $ini[$id]['v'] ?? -99, 'dex' => dexToken($t), 'r' => $rank[$t['tipo']], 'n' => (string)($t['nome'] ?? '')];
    }
    usort($lista, fn($a, $b) => [$b['v'], $b['dex'], $a['r'], $a['n']] <=> [$a['v'], $a['dex'], $b['r'], $b['n']]);
    return array_column($lista, 'id');
}

/* Caminho mais curto andando só na horizontal e na vertical, sem passar por casas bloqueadas (todo token, menos armadilhas).
   Devolve as casas do caminho (sem a de partida), ou null se não houver caminho. A busca tenta primeiro andar na horizontal
   em direção ao destino, então o caminho escolhido é determinístico (é nele que se confere se passou por armadilhas). */
function rotaMinima(int $x0, int $y0, int $x1, int $y1, int $cols, int $rows, array $bloq): ?array
{
    if ($x0 === $x1 && $y0 === $y1) return [];
    $pais = ["$x0,$y0" => null];
    $fila = [[$x0, $y0]];
    for ($i = 0; $i < count($fila); $i++) {
        [$x, $y] = $fila[$i];
        $dx = $x1 <=> $x;
        $dy = $y1 <=> $y;
        foreach ([[$x + $dx, $y], [$x, $y + $dy], [$x - $dx, $y], [$x, $y - $dy]] as [$nx, $ny]) {
            $k = "$nx,$ny";
            if ($nx < 0 || $ny < 0 || $nx >= $cols || $ny >= $rows || array_key_exists($k, $pais) || isset($bloq[$k])) continue;
            $pais[$k] = "$x,$y";
            if ($nx === $x1 && $ny === $y1) {
                $rota = [];
                for ($c = $k; $c !== "$x0,$y0"; $c = $pais[$c]) {
                    [$cx, $cy] = array_map('intval', explode(',', $c));
                    array_unshift($rota, [$cx, $cy]);
                }
                return $rota;
            }
            $fila[] = [$nx, $ny];
        }
    }
    return null;
}

function avancarTurno(array &$campo, array $tokens): void
{
    $ordem = $campo['combate']['ordem'] ?? [];
    $n = count($ordem);
    if ($n === 0) return;
    $turno = (int)$campo['combate']['turno'];
    $rod = (int)$campo['combate']['rodada'];
    for ($k = 0; $k < $n; $k++) {
        $turno++;
        if ($turno >= $n) { $turno = 0; $rod++; }
        if (isset($tokens[$ordem[$turno]]) && empty($tokens[$ordem[$turno]]['morto'])) break;
    }
    $campo['combate']['turno'] = $turno;
    $campo['combate']['rodada'] = $rod;
    $id = $ordem[$turno];
    if (isset($campo['pos'][$id])) $campo['pos'][$id]['gasto'] = 0;
    $nome = (string)($tokens[$id]['nome'] ?? '?');
    $vis = isset($tokens[$id]) && tokenVisivel($tokens[$id], $campo);
    campoEvento($campo, "Rodada $rod: turno de $nome.", $vis ? "Rodada $rod: turno de $nome." : "Rodada $rod: algo se move nas sombras.");
}

/* Operações do mestre. Devolve o campo atualizado. */
function campoOpMestre(string $op, array $c): array
{
    $tokens = tokensAcao();
    return campoAtualizar(function (array &$campo) use ($op, $c, $tokens): void {
        switch ($op) {
            case 'pos':
                foreach ((array)($c['pos'] ?? []) as $id => $p) {
                    if (!is_array($p)) continue;
                    $id = (string)$id;
                    $campo['pos'][$id] = [
                        'x' => max(0, min(199, (int)($p['x'] ?? 0))),
                        'y' => max(0, min(199, (int)($p['y'] ?? 0))),
                        'gasto' => max(0, (int)($p['gasto'] ?? ($campo['pos'][$id]['gasto'] ?? 0))),
                    ];
                }
                foreach ((array)($c['remover'] ?? []) as $id) unset($campo['pos'][(string)$id], $campo['revelados'][(string)$id], $campo['acionadas'][(string)$id]);
                if (!empty($c['zerar'])) foreach ($campo['pos'] as $id => $_) $campo['pos'][$id]['gasto'] = 0;
                break;
            case 'revelar':
                $id = (string)($c['id'] ?? '');
                if (!empty($c['valor'])) $campo['revelados'][$id] = true; else unset($campo['revelados'][$id]);
                break;
            case 'iniciar':
                $campo['combate'] = ['fase' => 'ini', 'rodada' => 1, 'turno' => 0, 'ini' => [], 'ordem' => []];
                foreach ($campo['pos'] as $id => $_) $campo['pos'][$id]['gasto'] = 0;
                campoEvento($campo, 'Combate iniciado: rolem a iniciativa.', 'Combate iniciado! Rolem a iniciativa.');
                break;
            case 'ini':
                if (!$campo['combate']) erro('Não há combate em andamento.', 409);
                $id = (string)($c['id'] ?? '');
                if (!isset($tokens[$id])) erro('Token não encontrado.', 404);
                $campo['combate']['ini'][$id] = !empty($c['rolar']) ? iniRolada($tokens[$id]) : iniDigitada($c['valor'] ?? null);
                break;
            case 'ini_inimigos':
                if (!$campo['combate']) erro('Não há combate em andamento.', 409);
                /* Uma rolagem por tipo de inimigo, como na regra de iniciativa: 3 bandidos agem juntos. */
                $grupos = [];
                foreach ($tokens as $id => $t) {
                    if (!in_array($t['tipo'] ?? '', ['inimigo', 'aliado'], true) || !empty($t['morto']) || isset($campo['combate']['ini'][$id])) continue;
                    $g = ($t['tipo'] ?? '') . '|' . ($t['bestiario'] ?? preg_replace('/ \d+$/', '', (string)($t['nome'] ?? '')));
                    $grupos[$g] ??= iniRolada($t);
                    $campo['combate']['ini'][$id] = $grupos[$g];
                }
                break;
            case 'comecar':
                if (!$campo['combate']) erro('Não há combate em andamento.', 409);
                $antigo = ($campo['combate']['fase'] ?? '') === 'turnos' ? ($campo['combate']['ordem'][$campo['combate']['turno']] ?? null) : null;
                $ordem = ordemIniciativa($tokens, $campo['combate']['ini'] ?? []);
                if (!$ordem) erro('Não há ninguém no mapa para entrar no combate.', 409);
                $campo['combate']['ordem'] = $ordem;
                $campo['combate']['fase'] = 'turnos';
                $i = $antigo === null ? false : array_search($antigo, $ordem, true);
                if ($i !== false) {
                    $campo['combate']['turno'] = $i;
                } else {
                    $campo['combate']['turno'] = 0;
                    $campo['combate']['rodada'] = 1;
                    foreach ($campo['pos'] as $id => $_) $campo['pos'][$id]['gasto'] = 0;
                    $nome = (string)($tokens[$ordem[0]]['nome'] ?? '?');
                    campoEvento($campo, "Rodada 1: turno de $nome.", isset($tokens[$ordem[0]]) && tokenVisivel($tokens[$ordem[0]], $campo) ? "Rodada 1: turno de $nome." : 'Rodada 1: algo se move nas sombras.');
                }
                break;
            case 'proximo':
                if (($campo['combate']['fase'] ?? '') !== 'turnos') erro('Os turnos ainda não começaram.', 409);
                avancarTurno($campo, $tokens);
                break;
            case 'encerrar':
                $campo['combate'] = null;
                foreach ($campo['pos'] as $id => $_) $campo['pos'][$id]['gasto'] = 0;
                campoEvento($campo, 'Combate encerrado.', 'Combate encerrado.');
                break;
            case 'limpar_log':
                $campo['eventos'] = [];
                break;
            case 'resetar':
                /* Zera a ação do mapa atual: tira os tokens informados (e as armadilhas acionadas deles), encerra o combate
                   e apaga o registro. Os tokens de outros mapas não são tocados. */
                foreach ((array)($c['remover'] ?? []) as $id) unset($campo['pos'][(string)$id], $campo['revelados'][(string)$id], $campo['acionadas'][(string)$id]);
                $campo['combate'] = null;
                $campo['eventos'] = [];
                break;
            default:
                erro('Operação desconhecida.', 404);
        }
    });
}

/* Operações do jogador: só o próprio personagem, e o servidor confere cada regra. */
function campoOpJogador(array $u, string $op, array $c): never
{
    $jog = jogadorDoUsuario($u['id']);
    if (!$jog) erro('Sua conta ainda não está ligada a um personagem.', 409);
    $a = lerEstado('acao') ?? [];
    if (empty($a['ativo'])) erro('Nenhuma cena ativa.', 409);
    if (($a['modo'] ?? 'grid') === 'foto') erro('Esta cena é só uma imagem.', 409);
    if (empty($a['envio']) || empty($a['grid']) || !gridCena((int)$a['grid'], (int)$a['envio'])) erro('Esta cena não tem grid.', 409);
    $tokens = tokensAcao();
    $meu = null;
    foreach ($tokens as $id => $t) {
        if (($t['jog'] ?? null) === $jog['id'] && ($t['tipo'] ?? '') === 'jogador') $meu = (string)$id;
    }
    if ($meu === null) erro('Seu personagem não está no mapa.', 409);
    $eu = $tokens[$meu];

    campoAtualizar(function (array &$campo) use ($op, $c, $a, $tokens, $meu, $eu): void {
        $fase = $campo['combate']['fase'] ?? null;
        $atual = $fase === 'turnos' ? ($campo['combate']['ordem'][$campo['combate']['turno']] ?? null) : null;
        switch ($op) {
            case 'ini':
                if ($fase !== 'ini') erro('A iniciativa não está sendo rolada agora.', 409);
                if (isset($campo['combate']['ini'][$meu])) erro('Você já definiu a sua iniciativa.', 409);
                $campo['combate']['ini'][$meu] = !empty($c['rolar']) ? iniRolada($eu) : iniDigitada($c['valor'] ?? null);
                break;
            case 'fim_turno':
                if ($fase !== 'turnos' || $atual !== $meu) erro('Não é a sua vez.', 409);
                avancarTurno($campo, $tokens);
                break;
            case 'mover':
                if ($fase === 'ini') erro('Aguarde: a iniciativa ainda está sendo definida.', 409);
                if (!empty($eu['morto'])) erro('Seu personagem está fora de combate.', 409);
                $pos = $campo['pos'][$meu] ?? null;
                if (!$pos) erro('Posição desconhecida. Avise o mestre.', 409);
                $x = (int)($c['x'] ?? -1);
                $y = (int)($c['y'] ?? -1);
                $cols = (int)($a['cols'] ?? 200);
                $rows = (int)($a['rows'] ?? 200);
                if ($x < 0 || $y < 0 || $x >= $cols || $y >= $rows) erro('Esse lugar fica fora do mapa.');
                if ($x === (int)$pos['x'] && $y === (int)$pos['y']) return;
                if ($fase === 'turnos') {
                    if ($atual !== $meu) erro('Não é a sua vez.', 409);
                } elseif (!($a['livre'] ?? true)) {
                    erro('O mestre travou o movimento por enquanto.', 409);
                }
                /* Todo token, menos armadilha, bloqueia: um não passa pelo outro. Tokens ocultos não bloqueiam (o jogador ainda
                   não sabe que estão ali, e uma recusa o denunciaria). */
                $bloq = [];
                foreach ($tokens as $id => $t) {
                    if ((string)$id === $meu || ($t['tipo'] ?? '') === 'armadilha' || !tokenVisivel($t, $campo)) continue;
                    $p = $campo['pos'][(string)$id] ?? null;
                    if ($p) $bloq[(int)$p['x'] . ',' . (int)$p['y']] = true;
                }
                if (isset($bloq["$x,$y"])) erro('Essa casa está ocupada.', 409);
                /* Só horizontal e vertical, contornando os tokens: o custo é o tamanho do caminho livre mais curto. */
                $rota = rotaMinima((int)$pos['x'], (int)$pos['y'], $x, $y, $cols, $rows, $bloq);
                if ($rota === null) erro('Não há caminho livre até lá: há tokens no meio do caminho.', 409);
                $casas = count($rota);
                $resta = (int)($eu['desl'] ?? 6) - ($fase === 'turnos' ? (int)($pos['gasto'] ?? 0) : 0);
                if ($casas > $resta) {
                    erro(($fase === 'turnos' ? 'Deslocamento insuficiente: restam ' . max(0, $resta) . ' casas' : 'Longe demais: você anda até ' . max(0, $resta) . ' casas por movimento') .
                        ' (o caminho livre até lá tem ' . $casas . ').', 409);
                }
                $campo['pos'][$meu]['x'] = $x;
                $campo['pos'][$meu]['y'] = $y;
                if ($fase === 'turnos') $campo['pos'][$meu]['gasto'] = (int)($pos['gasto'] ?? 0) + $casas;
                /* Armadilha em qualquer casa do caminho (inclusive a final): SÓ o mestre é avisado. Para os jogadores nada
                   muda: a armadilha continua escondida e não aparece mensagem. */
                $avisadas = [];
                foreach ($rota as [$rx, $ry]) {
                    foreach ($tokens as $id => $t) {
                        $p = $campo['pos'][(string)$id] ?? null;
                        if (($t['tipo'] ?? '') !== 'armadilha' || !$p || (int)$p['x'] !== $rx || (int)$p['y'] !== $ry || isset($avisadas[(string)$id])) continue;
                        $avisadas[(string)$id] = true;
                        $campo['acionadas'][(string)$id] = true;
                        $casa = nomeColuna($rx) . ($ry + 1);
                        campoEvento($campo, ($eu['nome'] ?? 'Jogador') . ' passou por ' . ($t['nome'] ?? 'armadilha') . " ($casa)" . (!empty($t['efeito']) ? ': ' . $t['efeito'] : '') . '.', null, true);
                    }
                }
                break;
            default:
                erro('Operação desconhecida.', 404);
        }
    });
    responder(['ok' => true]);
}

/* ============================ CENA PÚBLICA (JOGADOR) ============================ */

/* O que o jogador vê da aba Ação: sem nomes de pasta (podem ser spoiler), sem tokens ocultos e sem dados do mestre. */
function acaoPublica(?string $jogId = null): array
{
    $a = lerEstado('acao') ?? [];
    if (empty($a['ativo']) || empty($a['envio'])) return ['ativo' => false];
    $c = cenaEnviada((int)$a['envio']);
    if (!$c) return ['ativo' => false];
    /* "Grid e tokens" precisa de um mapa de grid do cenário. Sem ele, só a foto. */
    $grid = ($a['modo'] ?? 'grid') === 'foto' || empty($a['grid']) ? null : gridCena((int)$a['grid'], (int)$c['id']);
    /* Só o resumo do cenário vai para o jogador. A descrição completa fica com o mestre. */
    $resumo = mb_substr((string)((lerEstado('cenarios_info') ?? [])[(int)$c['id']]['resumo'] ?? ''), 0, 600);
    if (!$grid) {
        return ['ativo' => true, 'modo' => 'foto', 'img' => substr(md5('e' . $c['id'] . '-' . $c['ts']), 0, 12), 'titulo' => (string)($a['titulo'] ?? ''), 'resumo' => $resumo];
    }
    $g = ['cols' => $grid['colunas'], 'rows' => $grid['linhas']];
    $imgId = substr(md5('g' . $grid['id'] . '-' . $grid['ts']), 0, 12);
    $campo = campoLer();
    $tokens = [];
    $vis = [];
    $euId = null;
    $fotos = fotosJogadores(array_map(fn($t) => is_array($t) && ($t['tipo'] ?? '') === 'jogador' ? ($t['jog'] ?? null) : null, $a['tokens'] ?? []));
    foreach (($a['tokens'] ?? []) as $t) {
        if (!is_array($t) || !isset($t['id'])) continue;
        $id = (string)$t['id'];
        $p = $campo['pos'][$id] ?? null;
        if (!$p || !tokenVisivel($t, $campo)) continue;
        $o = array_intersect_key($t, array_flip(['id', 'nome', 'tipo', 'cor', 'jog', 'morto']));
        $o['x'] = (int)$p['x'];
        $o['y'] = (int)$p['y'];
        if (($t['tipo'] ?? '') === 'jogador' && isset($fotos[$t['jog'] ?? ''])) $o['foto'] = $fotos[$t['jog']];
        /* Deslocamento e movimento gasto só dos jogadores e aliados. Vida, defesa, efeito de armadilha e Destreza nunca saem. */
        if (in_array($t['tipo'] ?? '', ['jogador', 'aliado'], true)) {
            $o['desl'] = (int)($t['desl'] ?? 6);
            $o['gasto'] = (int)($p['gasto'] ?? 0);
        }
        $tokens[] = $o;
        $vis[$id] = $o;
        if ($jogId !== null && ($t['jog'] ?? null) === $jogId && ($t['tipo'] ?? '') === 'jogador') $euId = $id;
    }

    $combate = null;
    $cb = $campo['combate'];
    if (is_array($cb)) {
        $fase = $cb['fase'] ?? 'ini';
        $ini = is_array($cb['ini'] ?? null) ? $cb['ini'] : [];
        $atualId = $fase === 'turnos' ? ($cb['ordem'][$cb['turno']] ?? null) : null;
        $ordem = [];
        if ($fase === 'turnos') {
            foreach (($cb['ordem'] ?? []) as $id) {
                if (!isset($vis[$id])) continue;
                $ordem[] = ['id' => $id, 'nome' => $vis[$id]['nome'] ?? '', 'tipo' => $vis[$id]['tipo'] ?? '', 'v' => $ini[$id]['v'] ?? null, 'morto' => !empty($vis[$id]['morto'])];
            }
        }
        $pendentes = [];
        if ($fase === 'ini') {
            foreach ($vis as $id => $o) if (($o['tipo'] ?? '') === 'jogador' && !isset($ini[$id])) $pendentes[] = $o['nome'] ?? '';
        }
        $combate = [
            'fase' => $fase,
            'rodada' => (int)($cb['rodada'] ?? 1),
            'ordem' => $ordem,
            'atual' => $atualId !== null && isset($vis[$atualId]) ? $atualId : null,
            'atualOculto' => $atualId !== null && !isset($vis[$atualId]),
            'minhaVez' => $euId !== null && $atualId === $euId,
            'euPreciso' => $fase === 'ini' && $euId !== null && !isset($ini[$euId]),
            'euIni' => $euId !== null ? ($ini[$euId]['v'] ?? null) : null,
            'pendentes' => $pendentes,
        ];
    }
    $eventos = [];
    foreach ($campo['eventos'] as $e) if (!empty($e['pub'])) $eventos[] = $e['pub'];

    return [
        'ativo' => true,
        'modo' => 'grid',
        'img' => $imgId,
        'titulo' => (string)($a['titulo'] ?? ''),
        'resumo' => $resumo,
        'cols' => (int)($g['cols'] ?? 0),
        'rows' => (int)($g['rows'] ?? 0),
        'livre' => (bool)($a['livre'] ?? true),
        'eu' => $euId,
        'tokens' => $tokens,
        'combate' => $combate,
        'eventos' => array_slice($eventos, -8),
    ];
}

/* O jogador só vê a foto de um cenário se ele foi liberado E está ligado a um local já revelado no mapa,
   ou se for a cena que o mestre colocou ao vivo. Todo cenário nasce oculto. */
function cenaLiberadaJogador(int $id): bool
{
    $liberado = !empty((lerEstado('cenarios_info') ?? [])[$id]['liberado']);
    foreach ($liberado ? (lerEstado('locais_pub') ?? []) : [] as $l) {
        if (is_array($l) && (int)($l['cenario'] ?? 0) === $id) return true;
    }
    $a = lerEstado('acao') ?? [];
    return !empty($a['ativo']) && (int)($a['envio'] ?? 0) === $id;
}
