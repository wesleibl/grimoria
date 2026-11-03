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
const CHAVES_ESTADO = ['pend', 'zero', 'rev', 'sorteio', 'magias_lib', 'grim_pub', 'locais_pub', 'vilas_pub', 'acao', 'grids', 'cena_tokens'];

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

/* Constantes usadas pelo api.php. Ficam aqui porque um "const" só vale depois da linha em que aparece,
   e o api.php executa a ação antes de chegar ao fim do arquivo. */
/* O jogador edita só estes campos do próprio personagem. Observações, moralidade,
   grimório e vilarejo continuam nas mãos do mestre. */
const CAMPOS_PERFIL = ['personagem' => 60, 'altura' => 20, 'descricao' => 2000, 'sonho' => 2000, 'medo' => 2000];
const ATRIBUTOS = ['poder', 'destreza', 'inteligencia'];

/* ============================ CAMPO: POSIÇÕES E COMBATE ============================ */

/* As posições dos tokens e o combate ficam numa chave só ('campo'), que SÓ o servidor altera, dentro de uma
   transação com bloqueio. Assim o mestre e vários jogadores podem agir ao mesmo tempo sem se sobrescrever.
   Estrutura: pos {id: {x, y, gasto}}, combate {fase: ini|turnos, rodada, turno, ini {id: {v, modo}}, ordem [id]},
   revelados {id: true} (armadilhas acionadas), eventos [{t, txt, pub}], v (versão). */
function campoPadrao(array $c): array
{
    return $c + ['pos' => [], 'combate' => null, 'revelados' => [], 'eventos' => [], 'v' => 0];
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

function campoEvento(array &$c, string $txt, ?string $pub = null): void
{
    $c['eventos'][] = ['t' => time(), 'txt' => $txt, 'pub' => $pub];
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
                foreach ((array)($c['remover'] ?? []) as $id) unset($campo['pos'][(string)$id], $campo['revelados'][(string)$id]);
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
                if ($x < 0 || $y < 0 || $x >= (int)($a['cols'] ?? 200) || $y >= (int)($a['rows'] ?? 200)) erro('Esse lugar fica fora do mapa.');
                $casas = max(abs($x - $pos['x']), abs($y - $pos['y']));
                if ($casas === 0) return;
                if ($fase === 'turnos') {
                    if ($atual !== $meu) erro('Não é a sua vez.', 409);
                    $resta = (int)($eu['desl'] ?? 6) - (int)($pos['gasto'] ?? 0);
                    if ($casas > $resta) erro('Deslocamento insuficiente: restam ' . max(0, $resta) . ' casas.', 409);
                } elseif (!($a['livre'] ?? true)) {
                    erro('O mestre travou o movimento por enquanto.', 409);
                }
                foreach ($tokens as $id => $t) {
                    if ((string)$id === $meu || ($t['tipo'] ?? '') === 'armadilha' || !tokenVisivel($t, $campo) || !empty($t['morto'])) continue;
                    $p = $campo['pos'][(string)$id] ?? null;
                    if ($p && $p['x'] === $x && $p['y'] === $y) erro('Essa casa está ocupada.', 409);
                }
                $campo['pos'][$meu]['x'] = $x;
                $campo['pos'][$meu]['y'] = $y;
                if ($fase === 'turnos') $campo['pos'][$meu]['gasto'] = (int)($pos['gasto'] ?? 0) + $casas;
                foreach ($tokens as $id => $t) {
                    $p = $campo['pos'][(string)$id] ?? null;
                    if (($t['tipo'] ?? '') !== 'armadilha' || !$p || $p['x'] !== $x || $p['y'] !== $y) continue;
                    $campo['revelados'][(string)$id] = true;
                    $casa = nomeColuna($x) . ($y + 1);
                    campoEvento($campo, ($eu['nome'] ?? 'Jogador') . ' pisou em ' . ($t['nome'] ?? 'armadilha') . " ($casa)" . (!empty($t['efeito']) ? ': ' . $t['efeito'] : '') . '.', ($eu['nome'] ?? 'Jogador') . ' acionou uma armadilha!');
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
    $campo = campoLer();
    $tokens = [];
    $vis = [];
    $euId = null;
    foreach (($a['tokens'] ?? []) as $t) {
        if (!is_array($t) || !isset($t['id'])) continue;
        $id = (string)$t['id'];
        $p = $campo['pos'][$id] ?? null;
        if (!$p || !tokenVisivel($t, $campo)) continue;
        $o = array_intersect_key($t, array_flip(['id', 'nome', 'tipo', 'cor', 'jog', 'morto']));
        $o['x'] = (int)$p['x'];
        $o['y'] = (int)$p['y'];
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
        'img' => $imgId,
        'titulo' => (string)($a['titulo'] ?? ''),
        'cols' => (int)($g['cols'] ?? 0),
        'rows' => (int)($g['rows'] ?? 0),
        'livre' => (bool)($a['livre'] ?? true),
        'eu' => $euId,
        'tokens' => $tokens,
        'combate' => $combate,
        'eventos' => array_slice($eventos, -8),
    ];
}
