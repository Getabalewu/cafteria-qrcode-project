<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;

use App\Models\OrderDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::query();

        if ($request->has('status')) {
            $query->where('order_status', $request->status);
        }

        if ($request->has('table_id')) {
            $query->where('table_id', $request->table_id);
        }

        return response()->json($query->with(['user', 'table', 'orderDetails.menuItem'])->latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($request, $validated) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'table_id' => $validated['table_id'],
                'order_status' => 'Pending',
            ]);

            foreach ($validated['items'] as $item) {
                OrderDetail::create([
                    'order_id' => $order->id,
                    'item_id' => $item['item_id'],
                    'quantity' => $item['quantity'],
                    'item_status' => 'Pending',
                ]);
            }

            return response()->json($order->load('orderDetails'), 201);
        });
    }

    public function show(Order $order)
    {
        return response()->json($order->load(['user', 'table', 'orderDetails.menuItem', 'payment']));
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'order_status' => 'required|in:Pending,Preparing,Ready,Served',
        ]);

        $order->update($validated);

        return response()->json($order);
    }
}
