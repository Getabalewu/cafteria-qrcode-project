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
        // Admin User
        User::updateOrCreate(
            ['email' => 'getabalewamtataw11@gmail.com'],
            [
                'name' => 'System Admin',
                'password' => 'Admin123#',
                'role' => 'Admin',
            ]
        );

        // Staff User
        User::updateOrCreate(
            ['email' => 'amtatawgetabalew32@gmail.com'],
            [
                'name' => 'Staff Member',
                'password' => 'Staff123#',
                'role' => 'Staff',
            ]
        );

        // Run seeders
        $this->call([
            EthiopianFoodSeeder::class,
        ]);
    }
}

