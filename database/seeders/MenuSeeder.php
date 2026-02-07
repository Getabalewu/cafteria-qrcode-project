<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MenuItem;
use App\Models\Category;

class MenuSeeder extends Seeder
{
    public function run()
    {
        // Ensure Categories Exist
        $categories = [
            'Breakfast' => [
                ['name' => 'Classic Pancakes', 'description' => 'Fluffy stack of 3 pancakes with syrup and butter.', 'price' => 8.50, 'availability' => true],
                ['name' => 'Full English', 'description' => 'Eggs, bacon, sausage, beans, toast, and mushrooms.', 'price' => 12.00, 'availability' => true],
                ['name' => 'Avocado Toast', 'description' => 'Sourdough toast topped with smashed avocado and poached egg.', 'price' => 9.50, 'availability' => true],
                ['name' => 'Fruit Parfait', 'description' => 'Yogurt layered with granola and fresh berries.', 'price' => 6.50, 'availability' => true],
            ],
            'Lunch' => [
                ['name' => 'Cheeseburger Deluxe', 'description' => 'Juicy beef patty with sharp cheddar, lettuce, tomato, and special sauce.', 'price' => 11.50, 'availability' => true],
                ['name' => 'Chicken Caesar Salad', 'description' => 'Crisp romaine, grilled chicken, parmesan, and croutons.', 'price' => 10.00, 'availability' => true],
                ['name' => 'Vegetable Wrap', 'description' => 'Grilled seasonal veggies with hummus in a tortilla.', 'price' => 9.00, 'availability' => true],
                ['name' => 'Spicy Chicken Sandwich', 'description' => 'Fried chicken breast with spicy slaw on brioche.', 'price' => 10.50, 'availability' => true],
            ],
            'Dinner' => [
                ['name' => 'Steak Frites', 'description' => 'Grilled steak served with garlic herb butter and fries.', 'price' => 22.00, 'availability' => true],
                ['name' => 'Grilled Salmon', 'description' => 'Atlantic salmon with asparagus and quinoa.', 'price' => 19.00, 'availability' => true],
                ['name' => 'Mushroom Risotto', 'description' => 'Creamy arborio rice with wild mushrooms and truffle oil.', 'price' => 16.00, 'availability' => true],
                ['name' => 'Pasta Carbonara', 'description' => 'Spaghetti with pancetta, egg, and pecorino cheese.', 'price' => 15.00, 'availability' => true],
            ],
            'Beverages' => [
                ['name' => 'Cappuccino', 'description' => 'Espresso with steamed milk foam.', 'price' => 4.00, 'availability' => true],
                ['name' => 'Fresh Orange Juice', 'description' => 'Squeezed daily.', 'price' => 4.50, 'availability' => true],
                ['name' => 'Iced Matcha Latte', 'description' => 'Premium matcha with oat milk over ice.', 'price' => 5.50, 'availability' => true],
                ['name' => 'Berry Smoothie', 'description' => 'Blend of strawberries, blueberries, and yogurt.', 'price' => 6.00, 'availability' => true],
            ],
            'Desserts' => [
                ['name' => 'Chocolate Lava Cake', 'description' => 'Warm chocolate cake with a molten center.', 'price' => 7.00, 'availability' => true],
                ['name' => 'Cheesecake', 'description' => 'New York style cheesecake with berry coulis.', 'price' => 6.50, 'availability' => true],
                ['name' => 'Ice Cream Trio', 'description' => 'Vanilla, chocolate, and strawberry scoops.', 'price' => 5.00, 'availability' => true],
            ]
        ];

        foreach ($categories as $catName => $items) {
            $category = Category::firstOrCreate(['name' => $catName]);

            foreach ($items as $item) {
                MenuItem::updateOrCreate(
                    ['name' => $item['name']], // Check by name to avoid duplicates
                    [
                        'description' => $item['description'],
                        'price' => $item['price'],
                        'category_id' => $category->id,
                        'availability' => $item['availability'],
                    ]
                );
            }
        }
    }
}
