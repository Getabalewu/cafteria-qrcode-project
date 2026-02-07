<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;

use App\Models\Order;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
        ]);

        $payment = Payment::create([
            'order_id' => $validated['order_id'],
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'Paid', // Assuming instant success for simulation
            'payment_time' => now(),
        ]);

        // Optionally update order status
        $order = Order::find($validated['order_id']);
        // If system handles automated status change after payment
        // $order->update(['order_status' => 'Preparing']);

        return response()->json($payment, 201);
    }

    public function show(Payment $payment)
    {
        return response()->json($payment->load('order'));
    }
}
