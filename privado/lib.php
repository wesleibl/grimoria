<?php
declare(strict_types=1);

/* ============================ CONFIG ============================ */

function lerEnv(string $arquivo): array
{
    $out = [];
    if (!is_readable($arquivo)) return $out;
    foreach (file($arquivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $linha) {
        $linha = trim($linha);
        if ($linha === '' || $linha[0] === '#') continue;
        $p = strpos($linha, '=');
        if ($p === false) continue;
        $v = trim(substr($linha, $p + 1));
        if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && substr($v, -1) === $v[0]) $v = substr($v, 1, -1);
        $out[trim(substr($linha, 0, $p))] = $v;
    }
    return $out;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo) return $pdo;
    $env = lerEnv(dirname(__DIR__) . '/.env');
    $dsn = 'mysql:host=' . ($env['db_host'] ?? 'localhost') . ';dbname=' . ($env['db_base'] ?? '') . ';charset=utf8mb4';
    $pdo = new PDO($dsn, $env['db_user'] ?? '', $env['db_pass'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    garantirSchema($pdo);
    return $pdo;
}

/* Cria as tabelas na primeira vez. O arquivo marcador evita repetir isso a cada requisição. */
function garantirSchema(PDO $pdo): void
{
    $marca = __DIR__ . '/.schema-v2';
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
    session_start();
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
const CHAVES_ESTADO = ['pend', 'zero', 'rev', 'sorteio', 'magias_lib', 'grim_pub', 'locais_pub', 'vilas_pub', 'acao', 'grids'];

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
    if ($img['tipo'] === 'avatar') return $jog && $img['ref'] === $jog['id'];
    if ($img['tipo'] === 'local') return in_array($img['ref'], $locaisPub, true);
    return false;
}

function idsLocaisPub(): array
{
    return array_values(array_filter(array_map(fn($l) => is_array($l) ? ($l['id'] ?? null) : null, lerEstado('locais_pub') ?? [])));
}

/* ============================ CENAS DE AÇÃO ============================ */

/* As imagens de grid ficam em misterio/{local}/grid/{cenario}.png. A pasta é bloqueada
   no .htaccess: elas só saem pelo api.php, e o jogador só recebe a cena ativa. */
const EXT_CENA = ['png' => 'image/png', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'webp' => 'image/webp', 'gif' => 'image/gif'];

function dirCenas(): string { return dirname(__DIR__) . '/misterio'; }

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

function listarCenasEnviadas(): array
{
    $out = [];
    foreach (db()->query('SELECT id, nome, colunas, linhas FROM cenas ORDER BY criado_em, id') as $r) {
        $out[] = ['id' => (int)$r['id'], 'nome' => $r['nome'], 'cols' => (int)$r['colunas'], 'rows' => $r['linhas'] === null ? null : (int)$r['linhas']];
    }
    return $out;
}

/* O que o jogador vê da aba Ação: sem nomes de pasta (podem ser spoiler) e sem os tokens ocultos. */
function acaoPublica(): array
{
    $a = lerEstado('acao') ?? [];
    if (empty($a['ativo'])) return ['ativo' => false];
    if (!empty($a['envio'])) {
        $c = cenaEnviada((int)$a['envio']);
        if (!$c) return ['ativo' => false];
        $g = ['cols' => $c['colunas'], 'rows' => $c['linhas']];
        $imgId = substr(md5('e' . $c['id'] . '-' . $c['ts']), 0, 12);
    } else {
        if (!arquivoCena($a['local'] ?? null, $a['cena'] ?? null)) return ['ativo' => false];
        $g = (lerEstado('grids') ?? [])[$a['local'] . '/' . $a['cena']] ?? [];
        $imgId = substr(md5($a['local'] . '/' . $a['cena']), 0, 12);
    }
    $tokens = [];
    foreach (($a['tokens'] ?? []) as $t) {
        if (!is_array($t) || !empty($t['oculto'])) continue;
        $ok = ['id', 'nome', 'tipo', 'cor', 'x', 'y', 'jog'];
        /* Deslocamento e movimento gasto só dos jogadores e aliados. Vida, defesa, efeito de armadilha e Destreza nunca saem. */
        if (in_array($t['tipo'] ?? '', ['jogador', 'aliado'], true)) array_push($ok, 'desl', 'gasto');
        $tokens[] = array_intersect_key($t, array_flip($ok));
    }
    return [
        'ativo' => true,
        'img' => $imgId,
        'titulo' => (string)($a['titulo'] ?? ''),
        'cols' => (int)($g['cols'] ?? 0),
        'rows' => (int)($g['rows'] ?? 0),
        'tokens' => $tokens,
    ];
}
