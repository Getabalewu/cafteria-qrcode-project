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
Route::apiResource('categories', CategoryController::class);
Route::apiResource('menu-items', MenuItemController::class);

// Order & Payment Routes
Route::apiResource('orders', OrderController::class);
Route::post('payments', [PaymentController::class, 'store']);
Route::get('payments/{payment}', [PaymentController::class, 'show']);

// Admin Routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::post('generate-qr', [AdminController::class, 'generateQrCode']);
    Route::get('reports', [AdminController::class, 'reports']);
    
    // Staff Management
    Route::get('staff', [AdminController::class, 'getStaff']);
    Route::post('staff', [AdminController::class, 'storeStaff']);
    Route::put('staff/{user}', [AdminController::class, 'updateStaff']);
    Route::delete('staff/{user}', [AdminController::class, 'destroyStaff']);
});

