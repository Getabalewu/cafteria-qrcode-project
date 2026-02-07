import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChefHat, CheckCircle2, Clock, MapPin, RefreshCcw, Bell } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';

const StaffDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/orders');
            // Filter out 'Served' orders or show them at the end
            setOrders(res.data);
        } catch (error) {
            console.error("Error fetching orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, []);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(`/api/orders/${orderId}`, { order_status: newStatus });
            fetchOrders();
        } catch (error) {
            alert("Failed to update status");
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen"><RefreshCcw className="animate-spin h-8 w-8 text-indigo-500" /></div>;
    }

    const pendingOrders = orders.filter(o => o.order_status !== 'Served');

    return (
        <div className="bg-slate-900 min-h-screen text-slate-100 font-sans">
            <header className="bg-slate-800 p-6 border-b border-slate-700 sticky top-0 z-10">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <ChefHat className="h-6 w-6 text-white" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tighter">KITCHEN DISPLAY</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Live Orders</p>
                            <p className="text-2xl font-black text-indigo-400">{pendingOrders.length}</p>
                        </div>
                        <button onClick={fetchOrders} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                            <RefreshCcw className="h-5 w-5 text-slate-400" />
                        </button>
                        <LogoutButton className="bg-red-600/90 text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg hover:shadow-red-500/30">
                            Logout
                        </LogoutButton>

                    </div>
                </div>
            </header>

            <main className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingOrders.map(order => (
                    <div key={order.id} className="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden flex flex-col">
                        {/* Order Header */}
                        <div className={`p-4 flex justify-between items-center ${order.order_status === 'Pending' ? 'bg-amber-900/20' :
                            order.order_status === 'Preparing' ? 'bg-blue-900/20' :
                                'bg-emerald-900/20'
                            }`}>
                            <div>
                                <h3 className="text-xl font-black">#ORD-{order.id}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> Table {order.table?.table_number}
                                </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.order_status === 'Pending' ? 'bg-amber-600/20 text-amber-500' :
                                order.order_status === 'Preparing' ? 'bg-blue-600/20 text-blue-500' :
                                    'bg-emerald-600/20 text-emerald-500'
                                }`}>
                                {order.order_status}
                            </div>
                        </div>

                        {/* Items List */}
                        <div className="p-5 flex-1 space-y-3">
                            {order.order_details?.map(detail => (
                                <div key={detail.id} className="flex justify-between items-center text-sm">
                                    <span className="font-bold flex items-center gap-2">
                                        <span className="bg-slate-700 text-slate-100 w-6 h-6 flex items-center justify-center rounded text-xs font-black">
                                            {detail.quantity}
                                        </span>
                                        {detail.menu_item?.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="p-4 bg-slate-800/50 border-t border-slate-700 mt-auto grid grid-cols-2 gap-2">
                            {order.order_status === 'Pending' && (
                                <button
                                    onClick={() => updateOrderStatus(order.id, 'Preparing')}
                                    className="col-span-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95"
                                >
                                    Start Preparing
                                </button>
                            )}
                            {order.order_status === 'Preparing' && (
                                <button
                                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                                    className="col-span-2 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 text-center"
                                >
                                    Mark as Ready
                                </button>
                            )}
                            {order.order_status === 'Ready' && (
                                <button
                                    onClick={() => updateOrderStatus(order.id, 'Served')}
                                    className="col-span-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="h-4 w-4" /> Finalize Delivery
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </main>
        </div>
    );
};

export default StaffDashboard;
