<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
class Order extends Model
{
    protected $fillable = [
        'user_id',
        'table_id',
        'order_status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function table()
    {
        return $this->belongsTo(CafeteriaTable::class, 'table_id');
    }

    public function orderDetails()
    {
        return $this->hasMany(OrderDetail::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
