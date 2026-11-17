<?php
declare(strict_types=1);

/* Só estes IDs podem ser reproduzidos. Acrescente as faixas definitivas depois de preparar os MP3 em sons/.
   Exemplo: 'm02' => ['tipo'=>'musica', 'arquivo'=>'musica/m02.mp3', 'dur'=>90, ...]. */
const SONS_CATALOGO = [
    'm01' => ['tipo' => 'musica', 'arquivo' => 'musica/m01.mp3', 'dur' => 32, 'nome' => 'Trilha de teste', 'tags' => ['exploração'], 'cenarios' => ['Estrada de Terra', 'Acampamento', 'Cabana na Floresta']],
    'a01' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a01.mp3', 'dur' => 32, 'nome' => 'Ambiente de teste', 'tags' => ['natureza'], 'cenarios' => ['Estrada de Terra', 'Acampamento', 'Cabana na Floresta']],
    'e01' => ['tipo' => 'efeito', 'arquivo' => 'efeito/e01.mp3', 'dur' => 2, 'nome' => 'Efeito de teste', 'tags' => ['sinal'], 'cenarios' => []],
];

function somCatalogoPublico(): array
{
    $out = [];
    foreach (SONS_CATALOGO as $id => $s) $out[] = ['id' => $id] + $s;
    return $out;
}

function somFaixa(string $id, ?string $tipo = null): array
{
    if (!preg_match('/^[a-z]\d{2,3}$/D', $id) || !isset(SONS_CATALOGO[$id])) erro('Som desconhecido.');
    $s = SONS_CATALOGO[$id];
    if ($tipo !== null && $s['tipo'] !== $tipo) erro('Som incompatível com esta camada.');
    /* privado/ pode ser copiado para fora da raiz pública no deploy. */
    $raizPublica = dirname((string)($_SERVER['SCRIPT_FILENAME'] ?? dirname(__DIR__) . '/api.php'));
    if (!is_file($raizPublica . '/sons/' . $s['arquivo'])) erro('Arquivo de som indisponível.', 409);
    return $s;
}

function somPadrao(array $s): array
{
    $s += ['v' => 0, 'musica' => null, 'ambiente' => null, 'efeito' => null, 'efeito_vol' => 80, 'ultimo_op_ms' => 0];
    return $s;
}

function somLer(): array { return somPadrao((array)(lerEstado('som') ?? [])); }

function somPublico(array $s): array
{
    $s = somPadrao($s);
    $out = ['v' => (int)$s['v'], 'agora_ms' => (int)round(microtime(true) * 1000), 'musica' => null, 'ambiente' => null, 'efeito' => null, 'efeito_vol' => (int)$s['efeito_vol'],
        'volumes' => ['musica' => (int)($s['musica']['vol'] ?? 70), 'ambiente' => (int)($s['ambiente']['vol'] ?? 70)]];
    foreach (['musica', 'ambiente'] as $camada) {
        $t = $s[$camada];
        $id = is_array($t) ? (string)($t['id'] ?? '') : '';
        if (!$id || !isset(SONS_CATALOGO[$id]) || SONS_CATALOGO[$id]['tipo'] !== $camada) continue;
        $cat = SONS_CATALOGO[$id];
        $out[$camada] = ['id' => $id, 'arquivo' => 'sons/' . $cat['arquivo'], 'dur' => (int)$cat['dur'], 'estado' => $t['estado'] ?? null,
            'inicio_ms' => (int)($t['inicio_ms'] ?? 0), 'pos_pausa_ms' => (int)($t['pos_pausa_ms'] ?? 0), 'vol' => (int)($t['vol'] ?? 70)];
    }
    $e = $s['efeito'];
    if (is_array($e) && isset(SONS_CATALOGO[$e['id'] ?? '']) && SONS_CATALOGO[$e['id']]['tipo'] === 'efeito') {
        $out['efeito'] = ['n' => (int)($e['n'] ?? 0), 'arquivo' => 'sons/' . SONS_CATALOGO[$e['id']]['arquivo'], 't_ms' => (int)($e['t_ms'] ?? 0)];
    }
    return $out;
}

function somOperar(string $op, array $c): array
{
    $pdo = db();
    $pdo->prepare("INSERT IGNORE INTO estado (chave, valor) VALUES ('som', '{}')")->execute();
    $pdo->beginTransaction();
    try {
        $st = $pdo->query("SELECT valor FROM estado WHERE chave = 'som' FOR UPDATE");
        $s = somPadrao((array)(json_decode((string)$st->fetchColumn(), true) ?? []));
        $agora = (int)round(microtime(true) * 1000);
        if ($agora - (int)$s['ultimo_op_ms'] < 300) erro('Espere um instante antes de mudar o som.', 429);
        $camada = (string)($c['camada'] ?? '');
        if ($op === 'som_efeito') {
            $id = (string)($c['id'] ?? '');
            somFaixa($id, 'efeito');
            $s['efeito'] = ['n' => (int)($s['efeito']['n'] ?? 0) + 1, 'id' => $id, 't_ms' => $agora];
        } else {
            if (!in_array($camada, ['musica', 'ambiente', 'efeito'], true)) erro('Camada de som inválida.');
            if ($op === 'som_volume') {
                $vol = $c['vol'] ?? null;
                if (!is_int($vol) || $vol < 0 || $vol > 100) erro('Volume inválido.');
                if ($camada === 'efeito') $s['efeito_vol'] = $vol;
                else { $s[$camada] = is_array($s[$camada]) ? $s[$camada] : ['id' => null, 'estado' => null]; $s[$camada]['vol'] = $vol; }
            } else {
                if ($camada === 'efeito') erro('Use o disparo de efeito para esta camada.');
                $t = is_array($s[$camada]) ? $s[$camada] : ['id' => null, 'estado' => null, 'vol' => 70];
                if ($op === 'som_tocar') {
                    $id = (string)($c['id'] ?? '');
                    somFaixa($id, $camada);
                    $t = ['id' => $id, 'estado' => 'tocando', 'inicio_ms' => $agora, 'pos_pausa_ms' => 0, 'vol' => (int)($t['vol'] ?? 70)];
                } elseif ($op === 'som_pausar') {
                    if (empty($t['id']) || ($t['estado'] ?? null) !== 'tocando') erro('Não há faixa tocando nesta camada.', 409);
                    $dur = (int)SONS_CATALOGO[$t['id']]['dur'] * 1000;
                    $t['pos_pausa_ms'] = (($agora - (int)$t['inicio_ms']) % $dur + $dur) % $dur;
                    $t['estado'] = 'pausado';
                } elseif ($op === 'som_retomar') {
                    if (empty($t['id']) || ($t['estado'] ?? null) !== 'pausado') erro('Não há faixa pausada nesta camada.', 409);
                    $t['inicio_ms'] = $agora - (int)($t['pos_pausa_ms'] ?? 0);
                    $t['estado'] = 'tocando';
                } elseif ($op === 'som_parar') {
                    $t = ['id' => null, 'estado' => null, 'vol' => (int)($t['vol'] ?? 70)];
                } else erro('Operação de som inválida.', 404);
                $s[$camada] = $t;
            }
        }
        $s['v'] = (int)$s['v'] + 1;
        $s['ultimo_op_ms'] = $agora;
        $pdo->prepare("UPDATE estado SET valor = ? WHERE chave = 'som'")->execute([json_encode($s, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR)]);
        $pdo->commit();
        return somPublico($s);
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $e;
    }
}
