<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QrCode extends Model
{
    protected $fillable = [
        'table_id',
        'qr_code_data',
        'generated_at',
    ];

    public function table()
    {
        return $this->belongsTo(CafeteriaTable::class, 'table_id');
    }
}
