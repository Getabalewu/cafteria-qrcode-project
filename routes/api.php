<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\MenuItemController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\AdminController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Menu Routes
Route::apiResource('categories', CategoryController::class)->only(['index', 'show']);
Route::apiResource('menu-items', MenuItemController::class)->only(['index', 'show']);

// Operational Routes (Admin & Staff)
Route::middleware(['auth:sanctum'])->group(function () {
    // Menu Availability Toggle (Role check inside Controller)
    Route::put('menu-items/{menuItem}', [MenuItemController::class, 'update']);
    
    // Protected Order & Payment Management
    Route::apiResource('orders', OrderController::class);
    Route::post('payments', [PaymentController::class, 'store']);
    Route::get('payments/{payment}', [PaymentController::class, 'show']);
});

// Admin-Only Structure Management
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('categories', [CategoryController::class, 'store']);
    Route::put('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy']);

    Route::post('menu-items', [MenuItemController::class, 'store']);
    Route::delete('menu-items/{menuItem}', [MenuItemController::class, 'destroy']);
});

// Admin-Only Dashboard & Management
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('generate-qr', [AdminController::class, 'generateQrCode']);
    Route::get('reports', [AdminController::class, 'reports']);
    
    // Staff Management
    Route::get('staff', [AdminController::class, 'getStaff']);
    Route::post('staff', [AdminController::class, 'storeStaff']);
    Route::put('staff/{user}', [AdminController::class, 'updateStaff']);
    Route::delete('staff/{user}', [AdminController::class, 'destroyStaff']);
});

