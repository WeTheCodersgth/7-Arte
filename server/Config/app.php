require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Definir constantes globais
define('APP_NAME', $_ENV['APP_NAME']);
define('APP_URL', $_ENV['APP_URL']);
define('APP_ENV', $_ENV['APP_ENV']);
define('APP_DEBUG', filter_var($_ENV['APP_DEBUG'], FILTER_VALIDATE_BOOLEAN));


// Pusher
define('PUSHER_APP_ID', $_ENV['PUSHER_APP_ID']);
define('PUSHER_KEY', $_ENV['PUSHER_KEY']);
define('PUSHER_SECRET', $_ENV['PUSHER_SECRET']);
define('PUSHER_CLUSTER', $_ENV['PUSHER_CLUSTER']);

// PHPMailer
define('MAIL_HOST', $_ENV['MAIL_HOST']);
define('MAIL_PORT', $_ENV['MAIL_PORT']);
define('MAIL_USERNAME', $_ENV['MAIL_USERNAME']);
define('MAIL_PASSWORD', $_ENV['MAIL_PASSWORD']);
define('MAIL_ENCRYPTION', $_ENV['MAIL_ENCRYPTION']);
define('MAIL_FROM', $_ENV['MAIL_FROM']);
define('MAIL_FROM_NAME', $_ENV['MAIL_FROM_NAME']);

// JWT
define('JWT_SECRET_KEY', $_ENV['JWT_SECRET_KEY']);
define('JWT_EXPIRATION', (int)$_ENV['JWT_EXPIRATION']);
