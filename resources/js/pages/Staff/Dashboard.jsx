import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChefHat, CheckCircle2, Clock, MapPin, RefreshCcw, Bell } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';

const StaffDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'sales', 'stock'

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/api/orders');
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
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 italic">
                <RefreshCcw className="animate-spin h-12 w-12 text-indigo-500 mb-4" />
                <p className="font-black tracking-[0.2em] uppercase text-xs animate-pulse">Syncing Kitchen Display...</p>
            </div>
        );
    }

    const pendingOrders = orders.filter(o => o.order_status !== 'Served');
    const totalTodaySales = orders
        .filter(o => o.order_status === 'Served')
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    return (
        <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-indigo-500/30">
            {/* Top Navigation */}
            <header className="bg-slate-900/80 backdrop-blur-md p-6 border-b border-white/5 sticky top-0 z-30">
                <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-3 rounded-2xl shadow-xl shadow-indigo-500/20">
                            <ChefHat className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tighter leading-none italic">STAFF.OPS</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Operational Execution Unit</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-800/50 p-1.5 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            <span className="flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Orders ({pendingOrders.length})
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('sales')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'sales' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Daily Sales
                        </button>
                        <button
                            onClick={() => setActiveTab('stock')}
                            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'stock' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-white'}`}
                        >
                            Stock Control
                        </button>
                    </div>

                    <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                        <LogoutButton className="bg-red-500/10 text-red-400 border border-red-500/20 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                            Exit Shift
                        </LogoutButton>
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-8">
                {activeTab === 'orders' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                        {pendingOrders.length > 0 ? (
                            pendingOrders.map(order => (
                                <div key={order.id} className="group bg-slate-900/50 rounded-3xl border border-white/5 shadow-2xl overflow-hidden flex flex-col hover:border-indigo-500/30 transition-all duration-300">
                                    {/* Order Status Bar */}
                                    <div className={`h-1.5 w-full ${order.order_status === 'Pending' ? 'bg-amber-500' :
                                            order.order_status === 'Preparing' ? 'bg-blue-500' : 'bg-emerald-500'
                                        }`} />

                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-black text-white italic tracking-tighter">#ORD-{order.id}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="bg-indigo-500/20 p-1 rounded-md">
                                                        <MapPin className="h-3 w-3 text-indigo-400" />
                                                    </div>
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Table {order.table?.table_number || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Elapsed</p>
                                                <p className="text-xs font-black text-indigo-400">
                                                    {Math.floor((new Date() - new Date(order.created_at)) / 60000)}m ago
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-4 mb-8 bg-slate-950/50 p-5 rounded-2xl border border-white/5">
                                            {order.order_details?.map(detail => (
                                                <div key={detail.id} className="flex justify-between items-center group/item">
                                                    <div className="flex items-center gap-4">
                                                        <span className="bg-slate-800 text-indigo-400 w-8 h-8 flex items-center justify-center rounded-xl text-xs font-black border border-white/5">
                                                            {detail.quantity}
                                                        </span>
                                                        <span className="font-bold text-sm text-slate-300 group-hover/item:text-white transition-colors">
                                                            {detail.menu_item?.name}
                                                        </span>
                                                    </div>
                                                    {order.order_status === 'Preparing' && (
                                                        <CheckCircle2 className="h-4 w-4 text-slate-700 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-auto">
                                            {order.order_status === 'Pending' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'Preparing')}
                                                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                                                >
                                                    Start Preparing
                                                </button>
                                            )}
                                            {order.order_status === 'Preparing' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'Ready')}
                                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                                                >
                                                    Mark as Ready
                                                </button>
                                            )}
                                            {order.order_status === 'Ready' && (
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'Served')}
                                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
                                                >
                                                    <CheckCircle2 className="h-4 w-4" /> Finalize Delivery
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-32 text-center bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-white/5">
                                <Bell className="h-20 w-20 text-slate-800 mx-auto mb-6 opacity-50" />
                                <h3 className="text-3xl font-black text-slate-700 italic tracking-tighter">KITCHEN CLEAR</h3>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">All orders have been successfully fulfilled.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'sales' && (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
                        <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 p-10 overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[100px] rounded-full -mr-20 -mt-20 group-hover:bg-indigo-600/10 transition-colors" />
                            <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Live Performance Monitoring</h2>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-gray-400 font-bold text-sm mb-1">Today's Transactions</p>
                                    <p className="text-6xl font-black text-white italic tracking-tighter">${totalTodaySales.toFixed(2)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">{orders.filter(o => o.order_status === 'Served').length} Orders</p>
                                    <p className="text-[10px] font-bold text-slate-600 mt-1 uppercase">Finalized in current shift</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'stock' && (
                    <div className="max-w-4xl mx-auto text-center py-20 animate-in fade-in zoom-in duration-500">
                        <RefreshCcw className="h-16 w-16 text-slate-800 mx-auto mb-6 opacity-30" />
                        <h3 className="text-2xl font-black text-slate-700 uppercase tracking-[0.2em]">Inventory Sync...</h3>
                        <p className="text-slate-500 font-bold text-sm mt-4 max-w-sm mx-auto italic">Stock monitoring module is receiving real-time data from the supply chain. Functional update incoming.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default StaffDashboard;
