<?php
/**
 * Odbiór formularza kontaktowego ze strony Triathlon Lipiany.
 *
 * Wysyła wiadomość na adres organizatora i ustawia Reply-To na adres osoby
 * piszącej, dzięki czemu odpowiada się zwykłym „Odpowiedz” w poczcie.
 *
 * Ochrona przed spamem: ukryte pole-pułapka, minimalny czas wypełniania,
 * limit zgłoszeń z jednego adresu IP i blokada wstrzykiwania nagłówków.
 * Bez usług zewnętrznych, więc nic nie wycieka poza serwer.
 */
declare(strict_types=1);

const TO            = 'info@triathlon-lipiany.pl';
const SITE_NAME     = 'Triathlon Lipiany';
const SENDER        = 'strona@triathlon-lipiany.pl';   // adres z własnej domeny (SPF/DKIM)
const MIN_SECONDS   = 3;                      // szybciej wypełnia tylko bot
const MAX_PER_HOUR  = 10;                     // na jeden adres IP
const MAX_MESSAGE   = 5000;

function input(): array {
    if (!empty($_POST)) return $_POST;
    $raw = file_get_contents('php://input');
    $j = $raw ? json_decode($raw, true) : null;
    return is_array($j) ? $j : [];
}

function field(array $a, string $k, int $max): string {
    $v = isset($a[$k]) ? trim((string)$a[$k]) : '';
    if (mb_strlen($v) > $max) $v = mb_substr($v, 0, $max);
    return $v;
}

/** Nagłówki maila nie mogą zawierać znaków końca wiersza. */
function oneline(string $v): string {
    return trim(str_replace(["\r", "\n", "\0"], ' ', $v));
}

function mime(string $v): string {
    return '=?UTF-8?B?' . base64_encode($v) . '?=';
}

function wantsJson(): bool {
    $a = $_SERVER['HTTP_ACCEPT'] ?? '';
    $x = $_SERVER['HTTP_X_REQUESTED_WITH'] ?? '';
    return str_contains($a, 'application/json') || $x === 'fetch';
}

function finish(bool $ok, string $msg, int $code = 200): void {
    http_response_code($code);
    if (wantsJson()) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
        exit;
    }
    header('Content-Type: text/html; charset=utf-8');
    $m = htmlspecialchars($msg, ENT_QUOTES, 'UTF-8');
    echo "<!doctype html><html lang=\"pl\"><head><meta charset=\"utf-8\">"
       . "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">"
       . "<title>" . ($ok ? 'Wysłano' : 'Błąd') . "</title>"
       . "<style>body{margin:0;min-height:100vh;display:grid;place-items:center;"
       . "font:16px/1.6 system-ui,sans-serif;background:#f2f1f0;color:#46403c;padding:2rem}"
       . "div{max-width:34rem;text-align:center}a{color:#116fb6}</style></head><body><div>"
       . "<p>$m</p><p><a href=\"./\">&larr; Wróć na stronę</a></p></div></body></html>";
    exit;
}

/** Prosty licznik zgłoszeń w katalogu tymczasowym. */
function throttled(): bool {
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $file = sys_get_temp_dir() . '/tl-form-' . sha1($ip) . '.txt';
    $now = time();
    $hits = [];
    if (is_readable($file)) {
        $hits = array_filter(
            array_map('intval', explode(',', (string)file_get_contents($file))),
            static fn(int $t): bool => $t > $now - 3600
        );
    }
    if (count($hits) >= MAX_PER_HOUR) return true;
    $hits[] = $now;
    @file_put_contents($file, implode(',', $hits), LOCK_EX);
    return false;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    finish(false, 'Nieprawidłowe żądanie.', 405);
}

$in = input();

// 1. pułapka na boty — udajemy sukces, żeby bot nie próbował ponownie
if (field($in, '_gotcha', 200) !== '') finish(true, 'Dziękujemy, wiadomość została wysłana.');

// 2. formularz wypełniony w ułamku sekundy to nie człowiek
$ts = (int)field($in, 'ts', 20);
if ($ts > 0 && (int)floor(microtime(true) * 1000) - $ts < MIN_SECONDS * 1000) {
    finish(false, 'Formularz wysłany zbyt szybko. Spróbuj jeszcze raz.', 429);
}

// 3. limit na adres IP
if (throttled()) finish(false, 'Zbyt wiele wiadomości z tego adresu. Spróbuj później.', 429);

$name    = oneline(field($in, 'name', 80));
$email   = oneline(field($in, 'email', 120));
$subject = oneline(field($in, 'subject', 120));
$message = field($in, 'message', MAX_MESSAGE);
$rodo    = field($in, 'rodo', 10);

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    finish(false, 'Uzupełnij wszystkie wymagane pola.', 422);
}
if ($rodo === '') finish(false, 'Wymagana jest zgoda na przetwarzanie danych.', 422);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    finish(false, 'Podaj poprawny adres e-mail.', 422);
}

$body = "Wiadomość z formularza na stronie " . SITE_NAME . "\n"
      . str_repeat('-', 48) . "\n"
      . "Imię:   $name\n"
      . "E-mail: $email\n"
      . "Temat:  $subject\n"
      . str_repeat('-', 48) . "\n\n"
      . $message . "\n\n"
      . str_repeat('-', 48) . "\n"
      . 'Wysłano: ' . date('Y-m-d H:i:s') . "\n"
      . 'Adres IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '-') . "\n";

$headers = [
    'From: ' . mime(SITE_NAME) . ' <' . SENDER . '>',
    'Reply-To: ' . mime($name) . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail(TO, mime('[Strona] ' . $subject), $body, implode("\r\n", $headers), '-f' . SENDER);

if ($sent) {
    finish(true, 'Dziękujemy, wiadomość została wysłana.');
}
finish(false, 'Nie udało się wysłać wiadomości. Napisz bezpośrednio na ' . TO . '.', 500);
