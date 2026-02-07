<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;

use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index(Request $request)
    {
        $query = MenuItem::query();

        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('available')) {
            $query->where('availability', $request->available);
        }

        return response()->json($query->with('category')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'availability' => 'boolean',
            'image' => 'nullable|image|max:2048', // Max 2MB
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu_items', 'public');
            $validated['image'] = $path;
        }

        $menuItem = MenuItem::create($validated);

        return response()->json($menuItem, 201);
    }

    public function show(MenuItem $menuItem)
    {
        return response()->json($menuItem->load('category'));
    }

    public function update(Request $request, MenuItem $menuItem)
    {
        $user = $request->user();

        // Role-based logic
        if ($user->role === 'Staff') {
            // Staff can ONLY update availability
            $validated = $request->validate([
                'availability' => 'required|boolean',
            ]);
            
            // Ensure no other fields are being sneaked in (extra security)
            $menuItem->update(['availability' => $validated['availability']]);
            return response()->json($menuItem);
        }

        // Admin logic (Full Access)
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'category_id' => 'sometimes|required|exists:categories,id',
            'availability' => 'boolean',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($menuItem->image) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($menuItem->image);
            }
            $path = $request->file('image')->store('menu_items', 'public');
            $validated['image'] = $path;
        }

        $menuItem->update($validated);

        return response()->json($menuItem);
    }

    public function destroy(MenuItem $menuItem)
    {
        $menuItem->delete();

        return response()->json(null, 204);
    }
}
