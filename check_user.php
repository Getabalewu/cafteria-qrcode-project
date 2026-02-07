<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

$email = 'getabalewamtataw11@gmail.com';
$password = 'Admin123#';

$user = User::where('email', $email)->first();

if (!$user) {
    echo "USER_NOT_FOUND\n";
} else {
    echo "USER_FOUND: " . $user->email . "\n";
    echo "ROLE: " . $user->role . "\n";
    if (Hash::check($password, $user->password)) {
        echo "PASSWORD_MATCH: YES\n";
    } else {
        echo "PASSWORD_MATCH: NO\n";
    }
}
