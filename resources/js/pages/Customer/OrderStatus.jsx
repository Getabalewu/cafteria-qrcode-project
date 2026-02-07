import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Utensils, ArrowLeft, Loader2 } from 'lucide-react';

const OrderStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrder = async () => {
        try {
            const res = await axios.get(`/api/orders/${id}`);
            setOrder(res.data);
        } catch (error) {
            console.error("Error fetching order", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
        const interval = setInterval(fetchOrder, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-xl font-bold">Order not found</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-bold">Return to Menu</button>
            </div>
        );
    }

    const statuses = ['Pending', 'Preparing', 'Ready', 'Served'];
    const currentStatusIndex = statuses.indexOf(order.order_status);

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <header className="bg-white px-4 py-6 border-b">
                <div className="max-w-xl mx-auto flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft className="h-6 w-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Order Tracking</h1>
                        <p className="text-xs font-bold text-gray-400">Order #{id} • Table {order.table?.table_number}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto p-4 py-8">
                {/* Status Timeline */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-6">
                    <div className="space-y-8">
                        {statuses.map((status, index) => (
                            <div key={status} className="flex items-start gap-4">
                                <div className="relative flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all ${index <= currentStatusIndex
                                        ? 'bg-indigo-600 border-indigo-100 text-white'
                                        : 'bg-white border-gray-100 text-gray-300'
                                        }`}>
                                        {index < currentStatusIndex ? <CheckCircle2 className="h-4 w-4" /> : <span className="text-xs font-black">{index + 1}</span>}
                                    </div>
                                    {index < statuses.length - 1 && (
                                        <div className={`w-1 h-8 mt-1 transition-all ${index < currentStatusIndex ? 'bg-indigo-600' : 'bg-gray-100'
                                            }`} />
                                    )}
                                </div>
                                <div className="pt-0.5">
                                    <h3 className={`font-black uppercase tracking-widest text-sm ${index <= currentStatusIndex ? 'text-gray-900' : 'text-gray-300'
                                        }`}>{status}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        {status === 'Pending' && "We've received your order."}
                                        {status === 'Preparing' && "Chef is working on your meal."}
                                        {status === 'Ready' && "Your meal is ready to be picked up!"}
                                        {status === 'Served' && "Enjoy your meal!"}
                                    </p>
                                </div>
                                {status === order.order_status && status !== 'Served' && (
                                    <div className="ml-auto">
                                        <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter animate-pulse">
                                            Current
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Items Summary */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h2 className="font-black text-gray-900 uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                        <Utensils className="h-4 w-4 text-indigo-500" /> Order Summary
                    </h2>
                    <div className="space-y-4">
                        {order.order_details?.map(detail => (
                            <div key={detail.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                                <span className="font-bold text-gray-700">
                                    <span className="text-indigo-600 mr-2">{detail.quantity}x</span>
                                    {detail.menu_item?.name}
                                </span>
                                <span className="text-sm font-black text-gray-400 uppercase">{detail.item_status}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t flex justify-between items-center px-2">
                        <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Paid</span>
                        <span className="text-2xl font-black text-indigo-900">${Number(order.payment?.amount).toFixed(2)}</span>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="w-full mt-8 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-black transition-all active:scale-95"
                >
                    Order More
                </button>
            </main>
        </div>
    );
};

export default OrderStatus;
