<?php
declare(strict_types=1);

require __DIR__ . '/privado/lib.php';

iniciarSessao();

$acao = (string)($_GET['a'] ?? '');
$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/* Só login, cadastro e saída mexem na sessão. As outras ações a liberam logo,
   para várias requisições (como as imagens da galeria) não ficarem em fila. */
if (!in_array($acao, ['registrar', 'entrar', 'sair'], true)) session_write_close();

/* Toda escrita exige este cabeçalho. Um formulário de outro site não consegue enviá-lo, o que bloqueia CSRF. */
if ($metodo === 'POST' && ($_SERVER['HTTP_X_GRIMORIA'] ?? '') !== '1') erro('Requisição inválida.', 400);

try {
    match ("$metodo $acao") {
        'GET inicio' => acaoInicio(),
        'GET mestre.js' => acaoMestreJs(),
        'GET img' => acaoImg(),
        'POST registrar' => acaoRegistrar(),
        'POST entrar' => acaoEntrar(),
        'POST sair' => acaoSair(),
        'POST estado' => acaoEstado(),
        'POST jogador_salvar' => acaoJogadorSalvar(),
        'POST jogador_excluir' => acaoJogadorExcluir(),
        'POST jogador_vincular' => acaoJogadorVincular(),
        'POST img_enviar' => acaoImgEnviar(),
        'POST img_editar' => acaoImgEditar(),
        'POST img_excluir' => acaoImgExcluir(),
        default => erro('Ação desconhecida.', 404),
    };
} catch (PDOException $e) {
    error_log('grimoria: ' . $e->getMessage());
    erro('Erro no banco de dados. Tente de novo em instantes.', 500);
}

/* ============================ CONTA ============================ */

function acaoRegistrar(): never
{
    $c = corpo();
    $nome = trim((string)($c['nome'] ?? ''));
    $email = mb_strtolower(trim((string)($c['email'] ?? '')));
    $senha = (string)($c['senha'] ?? '');
    if ($nome === '' || mb_strlen($nome) > 80) erro('Informe um nome de até 80 letras.');
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 190) erro('Informe um e-mail válido.');
    if (strlen($senha) < 8) erro('A senha precisa ter pelo menos 8 caracteres.');
    try {
        /* Toda conta nasce como jogador. O papel de mestre é trocado direto no banco. */
        db()->prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
            ->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT)]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') erro('Já existe uma conta com esse e-mail.', 409);
        throw $e;
    }
    session_regenerate_id(true);
    $_SESSION['uid'] = (int)db()->lastInsertId();
    responder(['ok' => true]);
}

function acaoEntrar(): never
{
    $c = corpo();
    $email = mb_strtolower(trim((string)($c['email'] ?? '')));
    $senha = (string)($c['senha'] ?? '');
    $falhas = $_SESSION['falhas'] ?? [];
    $falhas = array_filter($falhas, fn($t) => $t > time() - 600);
    if (count($falhas) >= 5) erro('Muitas tentativas. Espere alguns minutos e tente de novo.', 429);
    $st = db()->prepare('SELECT id, senha_hash FROM usuarios WHERE email = ?');
    $st->execute([$email]);
    $u = $st->fetch();
    if (!$u || !password_verify($senha, $u['senha_hash'])) {
        $falhas[] = time();
        $_SESSION['falhas'] = $falhas;
        usleep(400000);
        erro('E-mail ou senha incorretos.', 401);
    }
    if (password_needs_rehash($u['senha_hash'], PASSWORD_DEFAULT)) {
        db()->prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?')->execute([password_hash($senha, PASSWORD_DEFAULT), $u['id']]);
    }
    session_regenerate_id(true);
    $_SESSION = ['uid' => (int)$u['id']];
    responder(['ok' => true]);
}

function acaoSair(): never
{
    $_SESSION = [];
    session_destroy();
    responder(['ok' => true]);
}

/* ============================ CARGA INICIAL ============================ */

function acaoInicio(): never
{
    $u = usuarioAtual();
    if (!$u) responder(['usuario' => null]);
    if ($u['papel'] === 'mestre') {
        responder([
            'usuario' => $u,
            'estado' => todoEstado(),
            'jogadores' => listarJogadores(),
            'usuarios' => db()->query('SELECT id, nome, email, papel FROM usuarios ORDER BY nome')->fetchAll(),
            'imagens' => listarImagens(),
        ]);
    }
    /* O jogador recebe só o que foi liberado: o próprio perfil, o próprio grimório revelado
       (com as magias liberadas) e os locais revelados do mapa. */
    $jog = jogadorDoUsuario($u['id']);
    $grim = null;
    if ($jog && !empty($jog['grimRev']) && !empty($jog['grim'])) {
        $grim = (lerEstado('grim_pub') ?? [])[$jog['grim']] ?? null;
    }
    $locaisPub = idsLocaisPub();
    responder([
        'usuario' => $u,
        'jogador' => $jog ? array_intersect_key($jog, array_flip(['id', 'nome', 'personagem', 'vila', 'altura', 'descricao', 'sonho', 'medo', 'img'])) : null,
        'grimorio' => $grim,
        'locais' => lerEstado('locais_pub') ?? [],
        'imagens' => listarImagens(fn($i) => jogadorPodeVer($i, $jog, $locaisPub)),
    ]);
}

/* O conteúdo secreto (grimórios, bestiário, segredos, sorteio, anotações) só sai daqui para o mestre. */
function acaoMestreJs(): never
{
    $u = usuarioAtual();
    if (!$u || $u['papel'] !== 'mestre') {
        http_response_code(403);
        header('Content-Type: application/javascript; charset=utf-8');
        echo '/* acesso negado */';
        exit;
    }
    header('Content-Type: application/javascript; charset=utf-8');
    header('Cache-Control: private, no-store');
    readfile(__DIR__ . '/privado/mestre.js');
    exit;
}

/* ============================ ESTADO DO MESTRE ============================ */

function acaoEstado(): never
{
    exigirMestre();
    $c = corpo();
    $chave = (string)($c['chave'] ?? '');
    if (!in_array($chave, CHAVES_ESTADO, true)) erro('Chave inválida.');
    $valor = json_encode($c['valor'] ?? null, JSON_UNESCAPED_UNICODE);
    if (strlen($valor) > 4_000_000) erro('Dados grandes demais.');
    db()->prepare('INSERT INTO estado (chave, valor) VALUES (?, ?) ON DUPLICATE KEY UPDATE valor = VALUES(valor)')->execute([$chave, $valor]);
    responder(['ok' => true]);
}

/* ============================ JOGADORES ============================ */

function idValido(mixed $id): string
{
    $id = (string)$id;
    if (!preg_match('/^[A-Za-z0-9_-]{4,40}$/', $id)) erro('Identificador inválido.');
    return $id;
}

function acaoJogadorSalvar(): never
{
    exigirMestre();
    $j = corpo()['jogador'] ?? null;
    if (!is_array($j)) erro('Jogador inválido.');
    $id = idValido($j['id'] ?? '');
    unset($j['id'], $j['usuario']);
    $dados = json_encode($j, JSON_UNESCAPED_UNICODE);
    if (strlen($dados) > 2_000_000) erro('Anotações grandes demais.');
    db()->prepare('INSERT INTO jogadores (id, dados) VALUES (?, ?) ON DUPLICATE KEY UPDATE dados = VALUES(dados)')->execute([$id, $dados]);
    responder(['ok' => true]);
}

function acaoJogadorExcluir(): never
{
    exigirMestre();
    $id = idValido(corpo()['id'] ?? '');
    db()->prepare('DELETE FROM jogadores WHERE id = ?')->execute([$id]);
    db()->prepare("DELETE FROM imagens WHERE tipo = 'avatar' AND ref = ?")->execute([$id]);
    responder(['ok' => true]);
}

function acaoJogadorVincular(): never
{
    exigirMestre();
    $c = corpo();
    $id = idValido($c['id'] ?? '');
    $uid = isset($c['usuario']) && $c['usuario'] !== null && $c['usuario'] !== '' ? (int)$c['usuario'] : null;
    $pdo = db();
    if ($uid !== null) {
        $st = $pdo->prepare('SELECT id FROM usuarios WHERE id = ?');
        $st->execute([$uid]);
        if (!$st->fetch()) erro('Conta não encontrada.', 404);
    }
    $pdo->beginTransaction();
    /* Uma conta fica ligada a um só personagem: tira de quem tinha antes. */
    if ($uid !== null) $pdo->prepare('UPDATE jogadores SET usuario_id = NULL WHERE usuario_id = ? AND id <> ?')->execute([$uid, $id]);
    $pdo->prepare('UPDATE jogadores SET usuario_id = ? WHERE id = ?')->execute([$uid, $id]);
    $pdo->commit();
    responder(['ok' => true]);
}

/* ============================ IMAGENS ============================ */

function acaoImg(): never
{
    $u = exigirLogin();
    $id = (int)($_GET['id'] ?? 0);
    $st = db()->prepare('SELECT id, tipo, ref, liberado, mime, dados FROM imagens WHERE id = ?');
    $st->execute([$id]);
    $img = $st->fetch();
    if (!$img) erro('Imagem não encontrada.', 404);
    if ($u['papel'] !== 'mestre' && !jogadorPodeVer($img, jogadorDoUsuario($u['id']), idsLocaisPub())) erro('Imagem não liberada.', 403);
    header('Content-Type: ' . $img['mime']);
    header('Cache-Control: private, max-age=600');
    header('X-Content-Type-Options: nosniff');
    echo $img['dados'];
    exit;
}

function acaoImgEnviar(): never
{
    exigirMestre();
    $c = corpo();
    $tipo = (string)($c['tipo'] ?? '');
    if (!in_array($tipo, ['avatar', 'mapa', 'local'], true)) erro('Tipo de imagem inválido.');
    $ref = $tipo === 'mapa' ? '' : idValido($c['ref'] ?? '');
    $titulo = mb_substr(trim((string)($c['titulo'] ?? '')), 0, 120);
    if (!preg_match('#^data:image/[a-z+]+;base64,(.+)$#s', (string)($c['dados'] ?? ''), $m)) erro('Imagem inválida.');
    $bin = base64_decode($m[1], true);
    if ($bin === false || strlen($bin) > 8_000_000) erro('A imagem é grande demais (máximo 8 MB).');
    $info = @getimagesizefromstring($bin);
    $mime = $info['mime'] ?? '';
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) erro('Formato de imagem não aceito.');
    $pdo = db();
    $pdo->prepare('INSERT INTO imagens (tipo, ref, titulo, mime, dados) VALUES (?, ?, ?, ?, ?)')->execute([$tipo, $ref, $titulo, $mime, $bin]);
    $novo = (int)$pdo->lastInsertId();
    /* Retrato e imagem de local são únicos: a nova substitui a antiga. */
    if ($tipo !== 'mapa') $pdo->prepare('DELETE FROM imagens WHERE tipo = ? AND ref = ? AND id <> ?')->execute([$tipo, $ref, $novo]);
    responder(['id' => $novo]);
}

function acaoImgEditar(): never
{
    exigirMestre();
    $c = corpo();
    $id = (int)($c['id'] ?? 0);
    if (array_key_exists('titulo', $c)) db()->prepare('UPDATE imagens SET titulo = ? WHERE id = ?')->execute([mb_substr(trim((string)$c['titulo']), 0, 120), $id]);
    if (array_key_exists('liberado', $c)) db()->prepare('UPDATE imagens SET liberado = ? WHERE id = ?')->execute([$c['liberado'] ? 1 : 0, $id]);
    responder(['ok' => true]);
}

function acaoImgExcluir(): never
{
    exigirMestre();
    db()->prepare('DELETE FROM imagens WHERE id = ?')->execute([(int)(corpo()['id'] ?? 0)]);
    responder(['ok' => true]);
}
