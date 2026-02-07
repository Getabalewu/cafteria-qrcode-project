<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CafeteriaTable extends Model
{
    protected $table = 'tables';

    protected $fillable = [
        'table_number',
        'location',
        'status',
    ];

    public function qrCode()
    {
        return $this->hasOne(QrCode::class, 'table_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'table_id');
    }
}
