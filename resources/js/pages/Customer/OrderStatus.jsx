import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, Utensils, ArrowLeft, Loader2, Package, Soup, Bell, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
                </motion.div>
                <p className="mt-6 text-indigo-900 font-black uppercase tracking-[0.2em] text-[10px]">Retrieving Order Details</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-slate-50">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 mb-8">
                    <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-slate-900 uppercase">Order not found</h2>
                    <p className="text-slate-400 mt-2 font-medium">We couldn't locate order #{id}.<br />Please check your receipt.</p>
                </div>
                <button onClick={() => navigate('/')} className="btn-primary w-full max-w-xs">
                    Return to Menu
                </button>
            </div>
        );
    }

    const statuses = ['Pending', 'Preparing', 'Ready', 'Served'];
    const currentStatusIndex = statuses.indexOf(order.order_status);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Pending': return <Bell className="h-5 w-5" />;
            case 'Preparing': return <Soup className="h-5 w-5" />;
            case 'Ready': return <Utensils className="h-5 w-5" />;
            case 'Served': return <CheckCircle2 className="h-5 w-5" />;
            default: return <Clock className="h-5 w-5" />;
        }
    };

    return (
        <div className="bg-slate-950 min-h-screen font-sans pb-12 overflow-x-hidden relative">
            {/* Background Decorative Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[20%] -left-[10%] w-[45%] h-[45%] bg-rose-600/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="glass-header px-4 py-6 border-b-0">
                    <div className="max-w-2xl mx-auto flex items-center gap-6">
                        <motion.button
                            whileHover={{ scale: 1.1, x: -5 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => navigate('/')}
                            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all"
                        >
                            <ArrowLeft className="h-6 w-6 text-white" />
                        </motion.button>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 lowercase tracking-tight leading-none">ኢትዮ <span className="text-indigo-600">chafe</span> <span className="text-slate-300 ml-2">/track</span></h1>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                <span>Order #{id}</span>
                                <span className="w-1 h-1 bg-indigo-200 rounded-full" />
                                <span>Table {order.table?.table_number}</span>
                            </p>
                        </div>
                    </div>
                </header>

                <main className="max-w-2xl mx-auto p-4 py-8">
                    {/* Status Hero Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="glass-card p-10 rounded-[3rem] shadow-2xl shadow-indigo-100 mb-8 overflow-hidden relative"
                    >
                        <div className="absolute top-0 right-0 p-8">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="bg-indigo-600 p-4 rounded-3xl"
                            >
                                {getStatusIcon(order.order_status)}
                            </motion.div>
                        </div>

                        <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Live Status</h2>
                        <h3 className="text-5xl font-black text-white tracking-tighter mb-10">{order.order_status}</h3>

                        {/* Animated Progress Bar */}
                        <div className="relative pt-1">
                            <div className="overflow-hidden h-4 text-xs flex rounded-full bg-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentStatusIndex + 1) / statuses.length) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center rounded-full transition-colors duration-500 ${order.order_status === 'Served' ? 'bg-emerald-500' :
                                        order.order_status === 'Ready' ? 'bg-blue-500' :
                                            order.order_status === 'Preparing' ? 'bg-amber-500' :
                                                'bg-indigo-600'
                                        }`}
                                />
                            </div>
                        </div>

                        <div className="mt-12 space-y-8">
                            {statuses.map((status, index) => (
                                <motion.div
                                    key={status}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-start gap-6 group"
                                >
                                    <div className="relative flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${index <= currentStatusIndex
                                            ? order.order_status === 'Served' ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/20' :
                                                order.order_status === 'Ready' && index <= statuses.indexOf('Ready') ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20' :
                                                    order.order_status === 'Preparing' && index <= statuses.indexOf('Preparing') ? 'bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-500/20' :
                                                        'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                            : 'bg-white/5 border-white/10 text-slate-700'
                                            }`}>
                                            {index < currentStatusIndex ? <CheckCircle2 className="h-5 w-5" /> : <span className="text-xs font-black">{index + 1}</span>}
                                        </div>
                                        {index < statuses.length - 1 && (
                                            <div className={`w-0.5 h-10 mt-1 transition-all duration-700 ${index < currentStatusIndex ? 'bg-indigo-500' : 'bg-slate-100'
                                                }`} />
                                        )}
                                    </div>
                                    <div className="pt-1.5 flex-1">
                                        <div className="flex justify-between items-center">
                                            <h3 className={`font-black uppercase tracking-[0.2em] text-xs ${index <= currentStatusIndex ? 'text-slate-900' : 'text-slate-300'
                                                }`}>{status}</h3>
                                            {status === order.order_status && (
                                                <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                                            )}
                                        </div>
                                        <p className={`text-xs mt-1 font-medium leading-relaxed ${index <= currentStatusIndex ? 'text-slate-500' : 'text-slate-200'
                                            }`}>
                                            {status === 'Pending' && "Order received and queued."}
                                            {status === 'Preparing' && "Our chef is crafting your meal."}
                                            {status === 'Ready' && "Freshly prepared and ready to go!"}
                                            {status === 'Served' && "Meal delivered. Enjoy your feast!"}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Items Summary Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="glass-card p-10 rounded-[3rem] shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-10">
                            <h2 className="font-black text-slate-900 uppercase tracking-widest text-[10px] flex items-center gap-3">
                                <span className="bg-slate-100 p-2 rounded-xl text-slate-600"><Utensils className="h-4 w-4" /></span>
                                Review Summary
                            </h2>
                            <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                                {order.order_details?.length} Items
                            </span>
                        </div>

                        <div className="space-y-4">
                            {order.order_details?.map((detail, idx) => (
                                <motion.div
                                    key={detail.id || idx}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.05) }}
                                    className="flex justify-between items-center bg-slate-50/50 p-5 rounded-3xl group hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm">
                                            {detail.quantity}x
                                        </div>
                                        <span className="font-black text-slate-800 uppercase tracking-tight text-sm">
                                            {detail.menu_item?.name}
                                        </span>
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-xl ${detail.item_status === 'Served' ? 'text-green-500 bg-green-50' : 'text-amber-500 bg-amber-50'
                                        }`}>
                                        {detail.item_status}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 pt-10 border-t border-slate-100">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] mb-1 block">Paid Securely</span>
                                    <span className="text-4xl font-black text-slate-900 tracking-tighter">${Number(order.payment?.amount).toFixed(2)}</span>
                                </div>
                                <div className="bg-indigo-50 p-4 rounded-2xl flex items-center gap-2">
                                    <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-black text-indigo-600 uppercase">Rate Meal</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.button
                        whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate('/')}
                        className="w-full mt-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-4"
                    >
                        Order More Delights <ChevronRight className="h-5 w-5" />
                    </motion.button>
                </main>
            </div>
        </div>
    );
};

export default OrderStatus;
