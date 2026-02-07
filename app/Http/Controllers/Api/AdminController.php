<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CafeteriaTable;

use App\Models\Order;
use App\Models\QrCode as QrCodeModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function generateQrCode(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
        ]);

        $table = CafeteriaTable::findOrFail($validated['table_id']);
        
        // Simulating QR URL generation
        $qrData = config('app.url') . "/menu?table=" . $table->table_number;

        $qrCode = QrCodeModel::updateOrCreate(
            ['table_id' => $table->id],
            [
                'qr_code_data' => $qrData,
                'generated_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'QR Code data generated',
            'qr_code' => $qrCode,
        ]);
    }

    public function reports(Request $request)
    {
        $sales = Order::where('order_status', 'Served')
            ->with('payment')
            ->join('payments', 'orders.id', '=', 'payments.order_id')
            ->select(DB::raw('DATE(orders.created_at) as date'), DB::raw('SUM(payments.amount) as total_sales'))
            ->groupBy('date')
            ->get();

        $demand = DB::table('order_details')
            ->join('menu_items', 'order_details.item_id', '=', 'menu_items.id')
            ->select('menu_items.name', DB::raw('SUM(order_details.quantity) as total_quantity'))
            ->groupBy('menu_items.name')
            ->orderByDesc('total_quantity')
            ->get();

        return response()->json([
            'sales_report' => $sales,
            'demand_trends' => $demand,
        ]);
    }

    // Staff Management
    public function getStaff()
    {
        // Ensure user is authenticated and is Admin (or Staff can view list?)
        // Assuming Staff can view list based on frontend StaffDashboard showing "Staff Management" not really... 
        // Staff don't see AdminPanel. So this should be Admin only.
        if (auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $staff = \App\Models\User::whereIn('role', ['Staff', 'Admin'])->get();
        return response()->json($staff);
    }

    public function storeStaff(Request $request)
    {
        if (auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:Staff,Admin',
        ]);

        $user = \App\Models\User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => \Illuminate\Support\Facades\Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json($user, 201);
    }

    public function updateStaff(Request $request, \App\Models\User $user)
    {
        if (auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|required|in:Staff,Admin',
            'password' => 'sometimes|nullable|string|min:8',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = \Illuminate\Support\Facades\Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroyStaff(\App\Models\User $user)
    {
        if (auth()->user()->role !== 'Admin') {
            return response()->json(['message' => 'Unauthorized. Only Admins can delete staff.'], 403);
        }
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete yourself'], 403);
        }
        $user->delete();
        return response()->json(null, 204);
    }
}

