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
    $marca = __DIR__ . '/.schema-v1';
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
const CHAVES_ESTADO = ['pend', 'zero', 'rev', 'sorteio', 'magias_lib', 'grim_pub', 'locais_pub'];

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

/* ============================ IMAGENS ============================ */

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
