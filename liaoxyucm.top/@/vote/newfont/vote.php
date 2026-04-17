<?php
// 设置返回内容为JSON
header('Content-Type: application/json');

// 获取参数
$type = isset($_GET['type']) ? $_GET['type'] : '';
$data_file = '/vote/newfont/data.json';

// 验证参数
if (!in_array($type, ['agree', 'reject'])) {
    echo json_encode([
        'success' => false,
        'message' => '参数错误：type 必须是 agree 或 reject'
    ]);
    exit;
}

// 获取客户端IP
function getClientIp() {
    $ip = '';
    if (isset($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } elseif (isset($_SERVER['REMOTE_ADDR'])) {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}

$client_ip = getClientIp();

// 检查IP是否有效
if (empty($client_ip)) {
    echo json_encode([
        'success' => false,
        'message' => '无法获取IP地址'
    ]);
    exit;
}

// 读取现有数据
if (file_exists($data_file)) {
    $json_data = file_get_contents($data_file);
    $data = json_decode($json_data, true);
} else {
    // 如果文件不存在，创建初始数据
    $data = [
        'agree' => 0,
        'reject' => 0,
        'voted_ips' => []
    ];
}

// 检查IP是否已经投票
if (in_array($client_ip, $data['voted_ips'])) {
    echo json_encode([
        'success' => false,
        'message' => '您已经投过票了，每个IP只能投票一次',
        'current_stats' => [
            'agree' => $data['agree'],
            'reject' => $data['reject']
        ]
    ]);
    exit;
}

// 更新投票计数
$data[$type] = intval($data[$type]) + 1;

// 记录IP
$data['voted_ips'][] = $client_ip;

// 保存回文件
$write_result = file_put_contents($data_file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

if ($write_result === false) {
    echo json_encode([
        'success' => false,
        'message' => '保存投票失败'
    ]);
    exit;
}

// 返回成功结果
echo json_encode([
    'success' => true,
    'message' => '投票成功',
    'type' => $type,
    'current_stats' => [
        'agree' => $data['agree'],
        'reject' => $data['reject']
    ]
]);
?>