<?php
/* Página TEMPORÁRIA de diagnóstico. Só funciona com debug=1 no arquivo de credenciais e NUNCA mostra senha, usuário, host nem
   nome do banco: só "ok" ou "FALHA". Apague este arquivo do servidor assim que o site funcionar. */
ini_set('display_errors', '0');
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');

function linha(string $nome, bool $ok, string $extra = ''): void { echo ($ok ? '[ok]   ' : '[FALHA] ') . $nome . ($extra !== '' ? ' -> ' . $extra : '') . "\n"; }

/* Procura o arquivo de credenciais nos mesmos lugares que o site usa. */
$raizes = [is_dir(dirname(__DIR__) . '/grimoria_privado') ? dirname(__DIR__) : __DIR__];
$envArq = null;
foreach ($raizes as $r) foreach (['/.env.php', '/.env'] as $n) if ($envArq === null && is_file($r . $n)) $envArq = $r . $n;
$env = [];
foreach ($envArq && is_readable($envArq) ? file($envArq, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [] as $l) {
    $l = trim($l);
    if ($l === '' || $l[0] === '#' || str_starts_with($l, '<?') || str_starts_with($l, '?>')) continue;
    $p = strpos($l, '=');
    if ($p !== false) $env[trim(substr($l, 0, $p))] = trim(substr($l, $p + 1));
}
if (($env['debug'] ?? '') !== '1') { echo "Diagnóstico desligado. (Adicione debug=1 nas credenciais para usar esta página, e remova depois.)\n"; exit; }

$privado = is_dir(dirname(__DIR__) . '/grimoria_privado') ? dirname(__DIR__) . '/grimoria_privado' : __DIR__ . '/privado';
echo 'PHP ' . PHP_VERSION . "\n";
linha('arquivo de credenciais encontrado', $envArq !== null, $envArq !== null ? basename($envArq) : '');
foreach (['pdo', 'pdo_mysql', 'mbstring', 'json', 'session', 'fileinfo'] as $e) linha("extensão $e", extension_loaded($e));
foreach (['db_host', 'db_base', 'db_user', 'db_pass'] as $k) linha("chave $k preenchida", ($env[$k] ?? '') !== '');
linha('pasta privada encontrada', is_dir($privado), basename($privado));
linha('lib.php existe', is_file($privado . '/lib.php'));
linha('schema.sql existe', is_file($privado . '/schema.sql'));
linha('mestre.js existe', is_file($privado . '/mestre.js'));
linha('pasta privada gravável (marcador do schema; opcional)', is_writable($privado));
linha('pasta de sessões gravável', is_writable(session_save_path() ?: sys_get_temp_dir()));

echo "\n";
try {
    $pdo = new PDO('mysql:host=' . ($env['db_host'] ?? '') . ';dbname=' . ($env['db_base'] ?? '') . ';charset=utf8mb4', $env['db_user'] ?? '', $env['db_pass'] ?? '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    linha('conexão com o MySQL', true, 'versão ' . $pdo->query('SELECT VERSION()')->fetchColumn());
    $tabs = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    echo 'tabelas: ' . ($tabs ? implode(', ', $tabs) : '(nenhuma)') . "\n";
    try {
        $pdo->exec('CREATE TABLE IF NOT EXISTS _teste_grimoria (id INT) ENGINE=InnoDB');
        $pdo->exec('DROP TABLE _teste_grimoria');
        linha('permissão para criar tabelas', true);
    } catch (Throwable $e) { linha('permissão para criar tabelas', false, 'o usuário do banco não pode criar tabelas'); }
    $sql = (string)@file_get_contents($privado . '/schema.sql');
    foreach (array_filter(array_map('trim', explode(';', $sql))) as $cmd) {
        try { $pdo->exec($cmd); } catch (Throwable $e) { linha('schema: ' . substr($cmd, 0, 40) . '…', false, 'erro ao executar'); }
    }
    echo 'tabelas depois do schema: ' . implode(', ', $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN)) . "\n";
} catch (Throwable $e) {
    /* A mensagem do driver pode conter o host e o usuário: mostra só a categoria do erro. */
    $m = $e->getMessage();
    $causa = str_contains($m, 'Access denied') ? 'usuário ou senha recusados' : (str_contains($m, 'Unknown database') ? 'banco de dados não existe' : (str_contains($m, 'getaddrinfo') || str_contains($m, 'php_network') || str_contains($m, 'Connection refused') || str_contains($m, 'timed out') ? 'não foi possível alcançar o servidor do banco (host errado, ou a hospedagem só aceita conexão de dentro dela)' : 'erro de conexão'));
    linha('conexão com o MySQL', false, $causa);
}
