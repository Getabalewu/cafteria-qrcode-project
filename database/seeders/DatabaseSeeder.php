<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Admin User
        User::factory()->create([
            'name' => 'System Administrator',
            'email' => 'admin@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'), // explicitly setting password for clarity
            'role' => 'Admin',
        ]);

        // Staff User
        User::factory()->create([
            'name' => 'Staff Member',
            'email' => 'staff@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role' => 'Staff',
        ]);
        // Run seeders
        $this->call([
            MenuSeeder::class,
        ]);
    }
}

