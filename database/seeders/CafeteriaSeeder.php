<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Category;
use App\Models\MenuItem;
use App\Models\CafeteriaTable;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class CafeteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Default Admin
        User::updateOrCreate(
            ['email' => 'getabalewamtataw11@gmail.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('Admin123#'),
                'role' => 'Admin',
            ]
        );

        // Sample Tables
        for ($i = 1; $i <= 10; $i++) {
            CafeteriaTable::updateOrCreate(
                ['table_number' => $i],
                [
                    'location' => $i <= 5 ? 'Indoor' : 'Outdoor',
                    'status' => 'Available',
                ]
            );
        }

        // Sample Categories
        $categories = [
            ['name' => 'Hot Beverages'],
            ['name' => 'Cold Drinks'],
            ['name' => 'Snacks'],
            ['name' => 'Main Course'],
            ['name' => 'Desserts'],
        ];

        foreach ($categories as $cat) {
            $category = Category::updateOrCreate(['name' => $cat['name']], $cat);

            // Sample Items for each category
            if ($cat['name'] === 'Hot Beverages') {
                MenuItem::updateOrCreate(['name' => 'Cappuccino', 'category_id' => $category->id], ['price' => 3.50, 'description' => 'Rich espresso with steamed milk foam.']);
                MenuItem::updateOrCreate(['name' => 'Espresso', 'category_id' => $category->id], ['price' => 2.00, 'description' => 'Strong and pure coffee shot.']);
            } elseif ($cat['name'] === 'Main Course') {
                MenuItem::updateOrCreate(['name' => 'Chicken Burger', 'category_id' => $category->id], ['price' => 8.50, 'description' => 'Grilled chicken patty with fresh lettuce and mayo.']);
                MenuItem::updateOrCreate(['name' => 'Pasta Alfredo', 'category_id' => $category->id], ['price' => 12.00, 'description' => 'Creamy white sauce pasta with mushrooms.']);
                MenuItem::updateOrCreate(['name' => 'Enjera with Firfir', 'category_id' => $category->id], ['price' => 10.00, 'description' => 'Traditional shredded flatbread in spicy sauce.']);
                MenuItem::updateOrCreate(['name' => 'Shiro with Enjera', 'category_id' => $category->id], ['price' => 9.00, 'description' => 'Spiced chickpea flour stew served with Enjera.']);
            } elseif ($cat['name'] === 'Desserts') {
                MenuItem::updateOrCreate(['name' => 'Ergo (Traditional Yogurt)', 'category_id' => $category->id], ['price' => 4.50, 'description' => 'Fresh Ethiopian yogurt, perfect for after meals.']);
                MenuItem::updateOrCreate(['name' => 'Chocolate Cake', 'category_id' => $category->id], ['price' => 6.00, 'description' => 'Rich moist chocolate layers.']);
            } else {
                MenuItem::updateOrCreate(['name' => 'Generic ' . $cat['name'] . ' Item', 'category_id' => $category->id], ['price' => 5.00, 'description' => 'Delicious ' . $cat['name'] . ' option.']);
            }
        }
    }
}
