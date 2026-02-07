<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\MenuItem;

class EthiopianFoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Categories
        $categories = [
            'Traditional Dishes',
            'Breakfast',
            'Beverages',
            'Vegetarian',
            'Desserts'
        ];

        $categoryModels = [];
        foreach ($categories as $name) {
            $categoryModels[$name] = Category::firstOrCreate(['name' => $name]);
        }

        // 2. Menu Items
        $items = [
            // Traditional Dishes
            [
                'name' => 'Doro Wat',
                'description' => 'Spicy chicken stew made with berbere, served with a hard-boiled egg and Enjera.',
                'price' => 250.00,
                'category_id' => $categoryModels['Traditional Dishes']->id,
            ],
            [
                'name' => 'Kitfo',
                'description' => 'Minced raw beef marinated in mitmita and niter kibbeh (spiced butter).',
                'price' => 300.00,
                'category_id' => $categoryModels['Traditional Dishes']->id,
            ],
            [
                'name' => 'Tibs',
                'description' => 'Sautéed meat (beef or lamb) with onions, garlic, and green peppers.',
                'price' => 220.00,
                'category_id' => $categoryModels['Traditional Dishes']->id,
            ],
            [
                'name' => 'Zilzil Tibs',
                'description' => 'Strips of beef sautéed with onions and rosemary.',
                'price' => 240.00,
                'category_id' => $categoryModels['Traditional Dishes']->id,
            ],
            [
                'name' => 'Gomen Besiga',
                'description' => 'Collard greens cooked with beef and traditional spices.',
                'price' => 190.00,
                'category_id' => $categoryModels['Traditional Dishes']->id,
            ],

            // Vegetarian
            [
                'name' => 'Beyaynetu',
                'description' => 'A variety of vegetarian stews (lentils, chickpeas, cabbage) served on top of Enjera.',
                'price' => 180.00,
                'category_id' => $categoryModels['Vegetarian']->id,
            ],
            [
                'name' => 'Shiro Wat',
                'description' => 'Chickpea stew prepared with garlic and onions, slow-cooked to perfection.',
                'price' => 100.00,
                'category_id' => $categoryModels['Vegetarian']->id,
            ],
            [
                'name' => 'Miser Wat',
                'description' => 'Spicy red lentil stew cooked with berbere.',
                'price' => 110.00,
                'category_id' => $categoryModels['Vegetarian']->id,
            ],
            [
                'name' => 'Kik Alicha',
                'description' => 'Yellow split pea stew cooked with turmeric and ginger.',
                'price' => 90.00,
                'category_id' => $categoryModels['Vegetarian']->id,
            ],

            // Breakfast
            [
                'name' => 'Chechebsa',
                'description' => 'Shredded flatbread (kitcha) with niter kibbeh and honey or berbere.',
                'price' => 120.00,
                'category_id' => $categoryModels['Breakfast']->id,
            ],
            [
                'name' => 'Firfir',
                'description' => 'Shredded Enjera mixed with spicy berbere sauce.',
                'price' => 130.00,
                'category_id' => $categoryModels['Breakfast']->id,
            ],
            [
                'name' => 'Genfo',
                'description' => 'Thick porridge made from wheat or barley flour, served with niter kibbeh and berbere.',
                'price' => 150.00,
                'category_id' => $categoryModels['Breakfast']->id,
            ],
            [
                'name' => 'Fatira',
                'description' => 'Crispy thin pancake served with honey and eggs.',
                'price' => 110.00,
                'category_id' => $categoryModels['Breakfast']->id,
            ],

            // Beverages
            [
                'name' => 'Ethiopian Coffee',
                'description' => 'Freshly roasted and brewed traditional coffee, served with popcorn.',
                'price' => 50.00,
                'category_id' => $categoryModels['Beverages']->id,
            ],
            [
                'name' => 'Tej (Honey Wine)',
                'description' => 'Traditional homemade honey wine (non-alcoholic version available).',
                'price' => 80.00,
                'category_id' => $categoryModels['Beverages']->id,
            ],
            [
                'name' => 'Birz',
                'description' => 'Sweet and refreshing traditional honey drink.',
                'price' => 60.00,
                'category_id' => $categoryModels['Beverages']->id,
            ],

            // Desserts
            [
                'name' => 'Ergo',
                'description' => 'Fresh Ethiopian yogurt, perfect for after meals.',
                'price' => 70.00,
                'category_id' => $categoryModels['Desserts']->id,
            ],
        ];

        foreach ($items as $item) {
            MenuItem::updateOrCreate(
                ['name' => $item['name']],
                $item
            );
        }
    }
}
