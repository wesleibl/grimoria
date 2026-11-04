<?php
declare(strict_types=1);

ini_set('display_errors', '0');
/* A pasta privada pode ficar FORA da raiz pública do site (grimoria_privado, ao lado da pasta pública). Se existir, é usada; do
   contrário vale a pasta "privado" ao lado deste arquivo. Fora da raiz pública, ninguém a alcança pela internet. */
define('PRIVADO', is_dir(dirname(__DIR__) . '/grimoria_privado') ? dirname(__DIR__) . '/grimoria_privado' : __DIR__ . '/privado');
require PRIVADO . '/lib.php';

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
        'GET acao' => acaoAcao(),
        'GET cenas' => acaoCenas(),
        'GET campo' => acaoCampo(),
        'POST campo_op' => acaoCampoOp(),
        'GET cena_img' => acaoCenaImg(),
        'POST cena_enviar' => acaoCenaEnviar(),
        'POST cena_editar' => acaoCenaEditar(),
        'POST cena_excluir' => acaoCenaExcluir(),
        'POST cena_importar' => acaoCenaImportar(),
        'POST grid_enviar' => acaoGridEnviar(),
        'POST grid_editar' => acaoGridEditar(),
        'POST grid_excluir' => acaoGridExcluir(),
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
        'POST perfil_criar' => acaoPerfilCriar(),
        'POST perfil_salvar' => acaoPerfilSalvar(),
        'POST perfil_atributos' => acaoPerfilAtributos(),
        'POST perfil_bonus' => acaoPerfilBonus(),
        'POST perfil_img' => acaoPerfilImg(),
        'POST perfil_img_remover' => acaoPerfilImgRemover(),
        default => erro('Ação desconhecida.', 404),
    };
} catch (Throwable $e) {
    error_log('grimoria: ' . $e->getMessage());
    /* Com debug=1 no .env, o erro real aparece na tela. Desligue depois de resolver. */
    $debug = (lerEnv(caminhoEnv())['debug'] ?? '') === '1';
    erro($debug ? get_class($e) . ': ' . $e->getMessage() . ' (' . basename($e->getFile()) . ':' . $e->getLine() . ')' : 'Erro no servidor. Tente de novo em instantes.', 500);
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
    if (bloqueado('cadastro-ip', ipCliente(), 10, 3600)) erro('Muitos cadastros deste endereço. Tente de novo mais tarde.', 429);
    try {
        /* Toda conta nasce como jogador. O papel de mestre é trocado direto no banco. */
        db()->prepare('INSERT INTO usuarios (nome, email, senha_hash) VALUES (?, ?, ?)')
            ->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT)]);
    } catch (PDOException $e) {
        if ($e->getCode() === '23000') erro('Já existe uma conta com esse e-mail.', 409);
        throw $e;
    }
    anotarTentativa('cadastro-ip', ipCliente(), 3600);
    session_regenerate_id(true);
    $_SESSION['uid'] = (int)db()->lastInsertId();
    session_write_close();
    responder(['ok' => true]);
}

function acaoEntrar(): never
{
    $c = corpo();
    $email = mb_strtolower(trim((string)($c['email'] ?? '')));
    $senha = (string)($c['senha'] ?? '');
    $falhas = $_SESSION['falhas'] ?? [];
    $falhas = array_filter($falhas, fn($t) => $t > time() - 600);
    /* Além do limite da sessão, há um no banco por IP e por e-mail: quem descarta o cookie não escapa dele. */
    if (count($falhas) >= 5 || bloqueado('login-ip', ipCliente(), 30, 900) || bloqueado('login-email', $email, 8, 900)) erro('Muitas tentativas. Espere alguns minutos e tente de novo.', 429);
    $st = db()->prepare('SELECT id, senha_hash FROM usuarios WHERE email = ?');
    $st->execute([$email]);
    $u = $st->fetch();
    if (!$u || !password_verify($senha, $u['senha_hash'])) {
        $falhas[] = time();
        $_SESSION['falhas'] = $falhas;
        anotarTentativa('login-ip', ipCliente(), 900);
        anotarTentativa('login-email', $email, 900);
        usleep(400000);
        erro('E-mail ou senha incorretos.', 401);
    }
    if (password_needs_rehash($u['senha_hash'], PASSWORD_DEFAULT)) {
        db()->prepare('UPDATE usuarios SET senha_hash = ? WHERE id = ?')->execute([password_hash($senha, PASSWORD_DEFAULT), $u['id']]);
    }
    limparTentativas('login-email', $email);
    session_regenerate_id(true);
    $_SESSION = ['uid' => (int)$u['id']];
    session_write_close();
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
            'enviadas' => listarCenasEnviadas(),
            'campo' => campoLer(),
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
    /* Conta que ainda não foi ligada a um personagem pelo mestre (alguém de fora que só criou conta) não recebe mapa, cena
       nem imagens: só o conteúdo geral das Regras. */
    $ligado = $jog !== null;
    responder([
        'usuario' => $u,
        'jogador' => $jog ? array_intersect_key($jog, array_flip(['id', 'nome', 'personagem', 'vila', 'altura', 'descricao', 'sonho', 'medo', 'img', 'atr', 'bonus', 'nivel', 'atrTravado'])) : null,
        'grimorio' => $grim ? grimParaJogador($grim, (string)$jog['grim']) : null,
        'locais' => $ligado ? locaisParaJogador(lerEstado('locais_pub') ?? []) : [],
        /* Só o bônus do vilarejo do próprio personagem, e só depois de a conta estar ligada a ele. */
        'vilaBonus' => $jog ? ((lerEstado('vilas_pub') ?? [])[$jog['vila'] ?? ''] ?? '') : '',
        'imagens' => $ligado ? listarImagens(fn($i) => jogadorPodeVer($i, $jog, $locaisPub)) : [],
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
    readfile(PRIVADO . '/mestre.js');
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
    salvarCamposJogador($id, $j, true);
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
    $jogImg = $u['papel'] === 'mestre' ? null : jogadorDoUsuario($u['id']);
    if ($u['papel'] !== 'mestre' && (!$jogImg || !jogadorPodeVer($img, $jogImg, idsLocaisPub()))) erro('Imagem não liberada.', 403);
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
    [$mime, $bin] = decodificarImagem($c['dados'] ?? '');
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

/* ============================ PERFIL DO JOGADOR ============================ */


function jogadorDaConta(): array
{
    $u = exigirLogin();
    $jog = jogadorDoUsuario($u['id']);
    if (!$jog) erro('Sua conta ainda não está ligada a um personagem.', 409);
    return $jog;
}

/* Conta nova cria o próprio personagem (nível 1, atributos ainda por distribuir). Uma conta, um personagem. */
function acaoPerfilCriar(): never
{
    $u = exigirLogin();
    if ($u['papel'] === 'mestre') erro('A conta de mestre não cria personagem aqui.', 403);
    if (jogadorDoUsuario($u['id'])) erro('Você já tem um personagem.', 409);
    $nome = trim(mb_substr((string)(corpo()['personagem'] ?? ''), 0, CAMPOS_PERFIL['personagem']));
    if ($nome === '') erro('Dê um nome ao seu personagem.');
    $id = 'p' . bin2hex(random_bytes(8));
    $json = json_encode(['nome' => $u['nome'], 'personagem' => $nome, 'nivel' => 1], JSON_UNESCAPED_UNICODE);
    try {
        db()->prepare('INSERT INTO jogadores (id, dados, usuario_id) VALUES (?, ?, ?)')->execute([$id, $json, $u['id']]);
    } catch (PDOException $e) {
        erro('Você já tem um personagem.', 409); /* chave única de usuario_id: dois cliques ao mesmo tempo */
    }
    responder(['ok' => true]);
}

function acaoPerfilSalvar(): never
{
    $jog = jogadorDaConta();
    $campos = [];
    foreach ((array)(corpo()['campos'] ?? []) as $k => $v) {
        if (!isset(CAMPOS_PERFIL[$k])) continue;
        $campos[$k] = mb_substr((string)$v, 0, CAMPOS_PERFIL[$k]);
    }
    if ($campos) salvarCamposJogador($jog['id'], $campos, false);
    responder(['ok' => true]);
}

/* Criação: 5 pontos entre os 3 atributos, no máximo 3 em cada. Depois de salvar, a base fica travada
   (só o mestre destrava). */
function acaoPerfilAtributos(): never
{
    $jog = jogadorDaConta();
    if (!empty($jog['atrTravado'])) erro('Seus atributos já foram salvos e não podem mais ser alterados. Peça ao mestre se precisar corrigir.', 409);
    $in = (array)(corpo()['atr'] ?? []);
    $atr = [];
    $soma = 0;
    foreach (ATRIBUTOS as $k) {
        $v = (int)($in[$k] ?? 0);
        if ($v < 0 || $v > 3) erro('Cada atributo recebe de 0 a 3 pontos.');
        $atr[$k] = $v;
        $soma += $v;
    }
    if ($soma !== 5) erro('Distribua exatamente 5 pontos.');
    salvarCamposJogador($jog['id'], ['atr' => $atr, 'atrTravado' => true], false);
    responder(['ok' => true]);
}

/* Bônus de evolução (pontos ganhos ao subir de nível): o jogador anota e corrige à vontade, como numa ficha. */
function acaoPerfilBonus(): never
{
    $jog = jogadorDaConta();
    $in = (array)(corpo()['bonus'] ?? []);
    $bonus = [];
    foreach (ATRIBUTOS as $k) $bonus[$k] = max(-5, min(10, (int)($in[$k] ?? 0)));
    salvarCamposJogador($jog['id'], ['bonus' => $bonus], false);
    responder(['ok' => true]);
}

function acaoPerfilImg(): never
{
    $jog = jogadorDaConta();
    [$mime, $bin] = decodificarImagem(corpo()['dados'] ?? '');
    $pdo = db();
    $pdo->prepare("INSERT INTO imagens (tipo, ref, mime, dados) VALUES ('avatar', ?, ?, ?)")->execute([$jog['id'], $mime, $bin]);
    $novo = (int)$pdo->lastInsertId();
    $pdo->prepare("DELETE FROM imagens WHERE tipo = 'avatar' AND ref = ? AND id <> ?")->execute([$jog['id'], $novo]);
    salvarCamposJogador($jog['id'], ['img' => $novo], false);
    responder(['id' => $novo]);
}

function acaoPerfilImgRemover(): never
{
    $jog = jogadorDaConta();
    db()->prepare("DELETE FROM imagens WHERE tipo = 'avatar' AND ref = ?")->execute([$jog['id']]);
    salvarCamposJogador($jog['id'], ['img' => null], false);
    responder(['ok' => true]);
}

/* ============================ AÇÃO (GRID) ============================ */

function acaoAcao(): never
{
    $u = exigirLogin();
    if ($u['papel'] === 'mestre') responder(['acao' => lerEstado('acao'), 'grids' => lerEstado('grids')]);
    $jog = jogadorDoUsuario($u['id']);
    if (!$jog) responder(['ativo' => false]); /* conta sem personagem ligado não vê a cena */
    responder(acaoPublica($jog['id']));
}

function acaoCampo(): never
{
    exigirMestre();
    responder(['campo' => campoLer()]);
}

function acaoCampoOp(): never
{
    $u = exigirLogin();
    $c = corpo();
    $op = (string)($c['op'] ?? '');
    if ($u['papel'] === 'mestre') responder(['campo' => campoOpMestre($op, $c)]);
    campoOpJogador($u, $op, $c);
}

function acaoCenas(): never
{
    exigirMestre();
    responder(['cenas' => listarCenas(), 'enviadas' => listarCenasEnviadas()]);
}

function servirImagem(string $mime, string $dados): never
{
    header('Content-Type: ' . $mime);
    header('Cache-Control: private, max-age=300');
    header('X-Content-Type-Options: nosniff');
    echo $dados;
    exit;
}

/* ?id=N é a foto do cenário N. ?grid=N é um mapa de grid. O jogador recebe só a foto de um cenário liberado e ligado a um
   local revelado, ou o que o mestre colocou ao vivo (a foto, ou o mapa de grid ativo). */
function acaoCenaImg(): never
{
    $u = exigirLogin();
    $foto = (int)($_GET['id'] ?? 0);
    $grid = (int)($_GET['grid'] ?? 0);
    if ($u['papel'] !== 'mestre') {
        if (!jogadorDoUsuario($u['id'])) erro('Nenhuma imagem disponível.', 404); /* conta sem personagem ligado */
        $a = lerEstado('acao') ?? [];
        $vivo = !empty($a['ativo']) ? (int)($a['envio'] ?? 0) : 0;
        if ($foto && !cenaLiberadaJogador($foto)) $foto = 0;
        if ($grid && !($vivo && ($a['modo'] ?? 'grid') !== 'foto' && (int)($a['grid'] ?? 0) === $grid)) $grid = 0;
        if (!$foto && !$grid && $vivo) {
            if (($a['modo'] ?? 'grid') !== 'foto' && !empty($a['grid'])) $grid = (int)$a['grid']; else $foto = $vivo;
        }
    }
    if ($grid) {
        $g = gridCena($grid, null, true);
        if (!$g) erro('Mapa não encontrado.', 404);
        servirImagem($g['mime'], $g['dados']);
    }
    if ($foto) {
        $c = cenaEnviada($foto, true);
        if (!$c) erro('Cenário não encontrado.', 404);
        servirImagem($c['mime'], $c['dados']);
    }
    erro('Nenhuma imagem disponível.', 404);
}

/* Sem colunas (0) o cenário não tem grid: é só uma imagem. */
function limiteColunas(mixed $v): int
{
    $n = (int)$v;
    return $n < 1 ? 0 : min(200, $n);
}

function limiteGrid(mixed $v, bool $aceitaVazio): ?int
{
    if (($v === null || $v === '') && $aceitaVazio) return null;
    $n = (int)$v;
    return $n >= 1 && $n <= 200 ? $n : ($aceitaVazio ? null : 20);
}

function acaoCenaEnviar(): never
{
    exigirMestre();
    $c = corpo();
    $nome = mb_substr(trim((string)($c['nome'] ?? '')), 0, 120) ?: 'Cenário';
    [$mime, $bin] = decodificarImagem($c['dados'] ?? '');
    $pdo = db();
    $pdo->prepare('INSERT INTO cenas (nome, mime, dados, colunas, linhas) VALUES (?, ?, ?, 0, NULL)')->execute([$nome, $mime, $bin]);
    responder(['id' => (int)$pdo->lastInsertId(), 'nome' => $nome]);
}

function acaoCenaEditar(): never
{
    exigirMestre();
    $c = corpo();
    $id = (int)($c['id'] ?? 0);
    $pdo = db();
    if (!empty($c['dados'])) {
        [$mime, $bin] = decodificarImagem($c['dados']);
        $pdo->prepare('UPDATE cenas SET mime = ?, dados = ?, criado_em = NOW() WHERE id = ?')->execute([$mime, $bin, $id]);
    }
    if (array_key_exists('nome', $c)) $pdo->prepare('UPDATE cenas SET nome = ? WHERE id = ?')->execute([mb_substr(trim((string)$c['nome']), 0, 120) ?: 'Cenário', $id]);
    responder(['ok' => true]);
}

function acaoCenaExcluir(): never
{
    exigirMestre();
    $id = (int)(corpo()['id'] ?? 0);
    $pdo = db();
    $pdo->prepare('DELETE FROM cena_grids WHERE cena_id = ?')->execute([$id]);
    $pdo->prepare('DELETE FROM cenas WHERE id = ?')->execute([$id]);
    responder(['ok' => true]);
}

/* Traz uma imagem de misterio/{local}/grid/ para dentro dos cenários (banco de dados). */
function acaoCenaImportar(): never
{
    exigirMestre();
    $c = corpo();
    $arq = arquivoCena($c['local'] ?? null, $c['cena'] ?? null);
    if (!$arq) erro('Imagem não encontrada na pasta.', 404);
    if (filesize($arq) > 8_000_000) erro('A imagem é grande demais (máximo 8 MB).');
    $bin = (string)file_get_contents($arq);
    $mime = @getimagesizefromstring($bin)['mime'] ?? '';
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) erro('Formato de imagem não aceito.');
    $nome = mb_substr(trim((string)($c['nome'] ?? '')), 0, 120) ?: 'Cenário';
    $pdo = db();
    /* A pasta se chama "grid": a imagem vira a foto do cenário e também o primeiro mapa de grid dele. */
    $pdo->beginTransaction();
    $pdo->prepare('INSERT INTO cenas (nome, mime, dados, colunas, linhas) VALUES (?, ?, ?, 0, NULL)')->execute([$nome, $mime, $bin]);
    $id = (int)$pdo->lastInsertId();
    $pdo->prepare('INSERT INTO cena_grids (cena_id, nome, mime, dados, colunas, linhas) VALUES (?, ?, ?, ?, ?, NULL)')->execute([$id, 'Mapa de grid', $mime, $bin, 20]);
    $gid = (int)$pdo->lastInsertId();
    $pdo->commit();
    responder(['id' => $id, 'nome' => $nome, 'grid' => $gid]);
}


/* ============================ MAPAS DE GRID DO CENÁRIO ============================ */

function acaoGridEnviar(): never
{
    exigirMestre();
    $c = corpo();
    $cena = (int)($c['cena'] ?? 0);
    if (!cenaEnviada($cena)) erro('Cenário não encontrado.', 404);
    [$mime, $bin] = decodificarImagem($c['dados'] ?? '');
    $nome = mb_substr(trim((string)($c['nome'] ?? '')), 0, 120) ?: 'Mapa de grid';
    $pdo = db();
    $pdo->prepare('INSERT INTO cena_grids (cena_id, nome, mime, dados, colunas, linhas) VALUES (?, ?, ?, ?, ?, ?)')
        ->execute([$cena, $nome, $mime, $bin, limiteColunas($c['cols'] ?? 20) ?: 20, limiteGrid($c['rows'] ?? null, true)]);
    responder(['id' => (int)$pdo->lastInsertId(), 'nome' => $nome]);
}

function acaoGridEditar(): never
{
    exigirMestre();
    $c = corpo();
    $id = (int)($c['id'] ?? 0);
    $pdo = db();
    if (!empty($c['dados'])) {
        [$mime, $bin] = decodificarImagem($c['dados']);
        $pdo->prepare('UPDATE cena_grids SET mime = ?, dados = ?, criado_em = NOW() WHERE id = ?')->execute([$mime, $bin, $id]);
    }
    if (array_key_exists('nome', $c)) $pdo->prepare('UPDATE cena_grids SET nome = ? WHERE id = ?')->execute([mb_substr(trim((string)$c['nome']), 0, 120) ?: 'Mapa de grid', $id]);
    if (array_key_exists('cols', $c)) $pdo->prepare('UPDATE cena_grids SET colunas = ? WHERE id = ?')->execute([limiteColunas($c['cols']) ?: 20, $id]);
    if (array_key_exists('rows', $c)) $pdo->prepare('UPDATE cena_grids SET linhas = ? WHERE id = ?')->execute([limiteGrid($c['rows'], true), $id]);
    responder(['ok' => true]);
}

function acaoGridExcluir(): never
{
    exigirMestre();
    db()->prepare('DELETE FROM cena_grids WHERE id = ?')->execute([(int)(corpo()['id'] ?? 0)]);
    responder(['ok' => true]);
}
