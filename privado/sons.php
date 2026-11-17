<?php
declare(strict_types=1);

/* Só estes IDs podem ser reproduzidos. Nomes e sugestões ficam privados ao mestre. */
const SONS_CATALOGO = [
    'm01' => ['tipo' => 'musica', 'arquivo' => 'musica/m01.mp3', 'dur' => 166, 'nome' => 'De volta à natureza', 'tags' => ['floresta', 'viagem'], 'cenarios' => []],
    'm02' => ['tipo' => 'musica', 'arquivo' => 'musica/m02.mp3', 'dur' => 146, 'nome' => 'Aconchego da estalagem', 'tags' => ['acolhedor', 'folk'], 'cenarios' => ['Taverna', 'Pousada', 'Quarto de Pousada']],
    'm03' => ['tipo' => 'musica', 'arquivo' => 'musica/m03.mp3', 'dur' => 143, 'nome' => 'Caminhos e encontros', 'tags' => ['viagem', 'exploração'], 'cenarios' => ['Estrada de Terra', 'Praça do Mercado', 'Acampamento', 'Cabana na Floresta']],
    'm04' => ['tipo' => 'musica', 'arquivo' => 'musica/m04.mp3', 'dur' => 141, 'nome' => 'Pedra e ferro', 'tags' => ['trabalho', 'pedra'], 'cenarios' => ['Sala de Pedra', 'Ferraria', 'Porão de Armazém', 'Cela de Prisão']],
    'm05' => ['tipo' => 'musica', 'arquivo' => 'musica/m05.mp3', 'dur' => 149, 'nome' => 'Sob a terra', 'tags' => ['tensão', 'mistério'], 'cenarios' => ['Caverna Comum', 'Cripta', 'Esgoto']],
    'm06' => ['tipo' => 'musica', 'arquivo' => 'musica/m06.mp3', 'dur' => 159, 'nome' => 'Salões e segredos', 'tags' => ['solene', 'mistério'], 'cenarios' => ['Biblioteca', 'Capela', 'Salão Nobre']],
    'm07' => ['tipo' => 'musica', 'arquivo' => 'musica/m07.mp3', 'dur' => 166, 'nome' => 'Intriga noturna', 'tags' => ['suspense', 'cidade'], 'cenarios' => ['Beco da Cidade']],
    'a01' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a01.mp3', 'dur' => 32, 'nome' => 'Bosque tranquilo', 'tags' => ['bosque', 'aves'], 'cenarios' => []],
    'a02' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a02.mp3', 'dur' => 32, 'nome' => 'Caverna: goteiras e eco', 'tags' => ['caverna', 'água'], 'cenarios' => ['Caverna Comum']],
    'a03' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a03.mp3', 'dur' => 32, 'nome' => 'Sala de Pedra: tochas e porta', 'tags' => ['pedra', 'tochas'], 'cenarios' => ['Sala de Pedra']],
    'a04' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a04.mp3', 'dur' => 32, 'nome' => 'Taverna: lareira e salão', 'tags' => ['lareira', 'gente'], 'cenarios' => ['Taverna']],
    'a05' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a05.mp3', 'dur' => 32, 'nome' => 'Pousada: salão e lareira', 'tags' => ['pousada', 'lareira'], 'cenarios' => ['Pousada']],
    'a06' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a06.mp3', 'dur' => 32, 'nome' => 'Quarto de Pousada: noite calma', 'tags' => ['quarto', 'noite'], 'cenarios' => ['Quarto de Pousada']],
    'a07' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a07.mp3', 'dur' => 32, 'nome' => 'Estrada de Terra: aves e carroça', 'tags' => ['estrada', 'pássaros'], 'cenarios' => ['Estrada de Terra']],
    'a08' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a08.mp3', 'dur' => 32, 'nome' => 'Praça do Mercado: feira', 'tags' => ['mercado', 'passos'], 'cenarios' => ['Praça do Mercado']],
    'a09' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a09.mp3', 'dur' => 32, 'nome' => 'Ferraria: fogo e bigorna', 'tags' => ['forja', 'martelo'], 'cenarios' => ['Ferraria']],
    'a10' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a10.mp3', 'dur' => 32, 'nome' => 'Cripta: ar frio e goteiras', 'tags' => ['cripta', 'tensão'], 'cenarios' => ['Cripta']],
    'a11' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a11.mp3', 'dur' => 32, 'nome' => 'Esgoto: água e ratos', 'tags' => ['esgoto', 'água'], 'cenarios' => ['Esgoto']],
    'a12' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a12.mp3', 'dur' => 32, 'nome' => 'Acampamento: fogueira e grilos', 'tags' => ['fogueira', 'mata'], 'cenarios' => ['Acampamento']],
    'a13' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a13.mp3', 'dur' => 32, 'nome' => 'Biblioteca: páginas e madeira', 'tags' => ['silêncio', 'livros'], 'cenarios' => ['Biblioteca']],
    'a14' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a14.mp3', 'dur' => 32, 'nome' => 'Cabana na Floresta: lenha e aves', 'tags' => ['floresta', 'lareira'], 'cenarios' => ['Cabana na Floresta']],
    'a15' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a15.mp3', 'dur' => 32, 'nome' => 'Capela: sino e páginas', 'tags' => ['capela', 'sinos'], 'cenarios' => ['Capela']],
    'a16' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a16.mp3', 'dur' => 32, 'nome' => 'Beco da Cidade: vozes e passos', 'tags' => ['beco', 'passos'], 'cenarios' => ['Beco da Cidade']],
    'a17' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a17.mp3', 'dur' => 32, 'nome' => 'Porão de Armazém: madeira e ecos', 'tags' => ['porão', 'madeira'], 'cenarios' => ['Porão de Armazém']],
    'a18' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a18.mp3', 'dur' => 32, 'nome' => 'Cela de Prisão: correntes e goteiras', 'tags' => ['cela', 'correntes'], 'cenarios' => ['Cela de Prisão']],
    'a19' => ['tipo' => 'ambiente', 'arquivo' => 'ambiente/a19.mp3', 'dur' => 32, 'nome' => 'Salão Nobre: lareira e taças', 'tags' => ['salão', 'nobre'], 'cenarios' => ['Salão Nobre']],
    'e01' => ['tipo' => 'efeito', 'arquivo' => 'efeito/e01.mp3', 'dur' => 2, 'nome' => 'Sino distante', 'tags' => ['sino'], 'cenarios' => []],
];
const SONS_ASSET_REV = 3;
function somVersao(array $s): int { return (int)$s['v'] * 10 + SONS_ASSET_REV; }

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
    $out = ['v' => somVersao($s), 'agora_ms' => (int)round(microtime(true) * 1000), 'musica' => null, 'ambiente' => null, 'efeito' => null, 'efeito_vol' => (int)$s['efeito_vol'],
        'volumes' => ['musica' => (int)($s['musica']['vol'] ?? 70), 'ambiente' => (int)($s['ambiente']['vol'] ?? 70)]];
    foreach (['musica', 'ambiente'] as $camada) {
        $t = $s[$camada];
        $id = is_array($t) ? (string)($t['id'] ?? '') : '';
        if (!$id || !isset(SONS_CATALOGO[$id]) || SONS_CATALOGO[$id]['tipo'] !== $camada) continue;
        $cat = SONS_CATALOGO[$id];
        $out[$camada] = ['id' => $id, 'arquivo' => 'sons/' . $cat['arquivo'] . '?v=' . SONS_ASSET_REV, 'dur' => (int)$cat['dur'], 'estado' => $t['estado'] ?? null,
            'inicio_ms' => (int)($t['inicio_ms'] ?? 0), 'pos_pausa_ms' => (int)($t['pos_pausa_ms'] ?? 0), 'vol' => (int)($t['vol'] ?? 70), 'loop' => ($t['loop'] ?? true) !== false];
    }
    $e = $s['efeito'];
    if (is_array($e) && isset(SONS_CATALOGO[$e['id'] ?? '']) && SONS_CATALOGO[$e['id']]['tipo'] === 'efeito') {
        $out['efeito'] = ['n' => (int)($e['n'] ?? 0), 'arquivo' => 'sons/' . SONS_CATALOGO[$e['id']]['arquivo'] . '?v=' . SONS_ASSET_REV, 't_ms' => (int)($e['t_ms'] ?? 0)];
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
                    $t = ['id' => $id, 'estado' => 'tocando', 'inicio_ms' => $agora, 'pos_pausa_ms' => 0, 'vol' => (int)($t['vol'] ?? 70), 'loop' => ($c['loop'] ?? true) !== false];
                } elseif ($op === 'som_pausar') {
                    if (empty($t['id']) || ($t['estado'] ?? null) !== 'tocando') erro('Não há faixa tocando nesta camada.', 409);
                    $dur = (int)SONS_CATALOGO[$t['id']]['dur'] * 1000;
                    $t['pos_pausa_ms'] = ($t['loop'] ?? true) === false ? max(0, min($dur, $agora - (int)$t['inicio_ms'])) : (($agora - (int)$t['inicio_ms']) % $dur + $dur) % $dur;
                    $t['estado'] = 'pausado';
                } elseif ($op === 'som_retomar') {
                    if (empty($t['id']) || ($t['estado'] ?? null) !== 'pausado') erro('Não há faixa pausada nesta camada.', 409);
                    $t['inicio_ms'] = $agora - (int)($t['pos_pausa_ms'] ?? 0);
                    $t['estado'] = 'tocando';
                } elseif ($op === 'som_parar') {
                    $t = ['id' => null, 'estado' => null, 'vol' => (int)($t['vol'] ?? 70), 'loop' => true];
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
