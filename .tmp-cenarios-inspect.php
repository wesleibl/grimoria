<?php
declare(strict_types=1);
require 'privado/lib.php';
$nomes = ['Caverna Comum', 'Sala de Pedra', 'Taverna', 'Pousada', 'Quarto de Pousada', 'Estrada de Terra', 'Praça do Mercado', 'Ferraria', 'Cripta', 'Esgoto', 'Acampamento', 'Biblioteca', 'Cabana na Floresta', 'Capela', 'Beco da Cidade', 'Porão de Armazém', 'Cela de Prisão', 'Salão Nobre'];
$pdo = db();
$rows = $pdo->query('SELECT c.id, c.nome, LENGTH(c.dados) AS foto_bytes, COUNT(g.id) AS grids, GROUP_CONCAT(CONCAT(g.id, ":", g.nome, ":", g.colunas) SEPARATOR " | ") AS grid_nomes FROM cenas c LEFT JOIN cena_grids g ON g.cena_id = c.id GROUP BY c.id ORDER BY c.id')->fetchAll(PDO::FETCH_ASSOC);
foreach ($nomes as $nome) {
    $encontrados = array_values(array_filter($rows, static fn($r) => $r['nome'] === $nome));
    echo json_encode(['nome' => $nome, 'registros' => $encontrados], JSON_UNESCAPED_UNICODE) . "\n";
}
echo 'TOTAL_CENAS=' . count($rows) . "\n";
