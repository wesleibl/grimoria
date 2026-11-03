<?php
/* Página temporária de diagnóstico. Só funciona com debug=1 no .env. Apague este arquivo depois de usar. */
ini_set('display_errors', '1');
error_reporting(E_ALL);
header('Content-Type: text/plain; charset=utf-8');

function linha(string $nome, bool $ok, string $extra = ''): void { echo ($ok ? '[ok]   ' : '[FALHA] ') . $nome . ($extra !== '' ? ' -> ' . $extra : '') . "\n"; }

$envArq = __DIR__ . '/.env';
linha('.env existe e é legível', is_readable($envArq));
$env = [];
foreach (is_readable($envArq) ? file($envArq, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) : [] as $l) {
    $p = strpos($l, '=');
    if ($p !== false) $env[trim(substr($l, 0, $p))] = trim(substr($l, $p + 1));
}
if (($env['debug'] ?? '') !== '1') { echo "\nAdicione debug=1 no .env para usar esta página.\n"; exit; }

echo 'PHP ' . PHP_VERSION . "\n";
foreach (['pdo', 'pdo_mysql', 'mbstring', 'json', 'session', 'fileinfo', 'gd'] as $e) linha("extensão $e", extension_loaded($e), $e === 'gd' || $e === 'fileinfo' ? '(opcional)' : '');
foreach (['db_host', 'db_base', 'db_user', 'db_pass'] as $k) linha("chave $k no .env", ($env[$k] ?? '') !== '', $k === 'db_pass' ? '' : ($env[$k] ?? 'vazia'));

echo "\n";
$arq = __DIR__ . '/privado/lib.php';
linha('privado/lib.php existe', is_file($arq));
linha('privado/schema.sql existe', is_file(__DIR__ . '/privado/schema.sql'));
linha('pasta privado gravável (marcador do schema)', is_writable(__DIR__ . '/privado'), is_writable(__DIR__ . '/privado') ? '' : 'sem isso o schema roda a cada acesso (não é grave)');

echo "\nSessão: save_path = " . (session_save_path() ?: '(padrão)') . "\n";
linha('pasta de sessões gravável', is_writable(session_save_path() ?: sys_get_temp_dir()));

echo "\n";
try {
    $pdo = new PDO('mysql:host=' . ($env['db_host'] ?? '') . ';dbname=' . ($env['db_base'] ?? '') . ';charset=utf8mb4', $env['db_user'] ?? '', $env['db_pass'] ?? '', [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    linha('conexão com o MySQL', true, $pdo->query('SELECT VERSION()')->fetchColumn());
    $tabs = $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN);
    echo 'tabelas existentes: ' . ($tabs ? implode(', ', $tabs) : '(nenhuma)') . "\n";
    try {
        $pdo->exec('CREATE TABLE IF NOT EXISTS _teste_grimoria (id INT) ENGINE=InnoDB');
        $pdo->exec('DROP TABLE _teste_grimoria');
        linha('permissão para criar tabelas', true);
    } catch (Throwable $e) { linha('permissão para criar tabelas', false, $e->getMessage()); }
    foreach (array_filter(array_map('trim', explode(';', (string)@file_get_contents(__DIR__ . '/privado/schema.sql')))) as $cmd) {
        try { $pdo->exec($cmd); } catch (Throwable $e) { linha('schema: ' . substr($cmd, 0, 40) . '...', false, $e->getMessage()); }
    }
    echo 'tabelas depois do schema: ' . implode(', ', $pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN)) . "\n";
} catch (Throwable $e) {
    linha('conexão com o MySQL', false, $e->getMessage());
}

echo "\nCarregando privado/lib.php...\n";
try { require $arq; linha('lib.php carregou', true); } catch (Throwable $e) { linha('lib.php carregou', false, get_class($e) . ': ' . $e->getMessage() . ' (' . $e->getFile() . ':' . $e->getLine() . ')'); }
