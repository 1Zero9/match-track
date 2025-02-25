<?php
header('Content-Type: application/json');
include 'db-connect.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            matches.id,
            matches.date,
            p1.name as player1,
            p2.name as player2,
            matches.score,
            competitions.name as competition
        FROM matches
        JOIN players p1 ON matches.player1_id = p1.id
        JOIN players p2 ON matches.player2_id = p2.id
        JOIN competitions ON matches.competition_id = competitions.id
        ORDER BY matches.date DESC
        LIMIT 50
    ");
    
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(['success' => true, 'data' => $results]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Database error']);
}
?>
