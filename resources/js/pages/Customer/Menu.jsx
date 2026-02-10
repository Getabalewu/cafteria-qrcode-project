import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Utensils, Info, Plus, Minus, X, CheckCircle2, ChevronRight, Star, Clock, Zap } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Menu = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tableNumber = searchParams.get('table') || '1';

    const [categories, setCategories] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState(null);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderPlacing, setOrderPlacing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, itemRes] = await Promise.all([
                    axios.get('/api/categories'),
                    axios.get('/api/menu-items')
                ]);
                setCategories(catRes.data);
                setMenuItems(itemRes.data);
                if (catRes.data.length > 0) setActiveCategory(catRes.data[0].id);
            } catch (error) {
                console.error("Error fetching menu data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addToCart = (item) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId) => {
        setCart(prev => prev.filter(i => i.id !== itemId));
    };

    const updateQuantity = (itemId, delta) => {
        setCart(prev => prev.map(i => {
            if (i.id === itemId) {
                const newQty = Math.max(1, i.quantity + delta);
                return { ...i, quantity: newQty };
            }
            return i;
        }));
    };

    const cartTotal = cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0).toFixed(2);
    const itemCount = cart.reduce((s, i) => s + i.quantity, 0);

    const placeOrder = async () => {
        setOrderPlacing(true);
        try {
            const orderRes = await axios.post('/api/orders', {
                table_id: tableNumber,
                items: cart.map(i => ({ item_id: i.id, quantity: i.quantity }))
            });

            await axios.post('/api/payments', {
                order_id: orderRes.data.id,
                amount: cartTotal,
                payment_method: 'Digital Wallet'
            });

            setOrderSuccess(orderRes.data.id);
            setCart([]);
            setIsCartOpen(false);
        } catch (error) {
            alert("Failed to place order. Please try again.");
            console.error(error);
        } finally {
            setOrderPlacing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-white">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                >
                    <Utensils className="h-12 w-12 text-indigo-600" />
                </motion.div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 text-indigo-900 font-bold uppercase tracking-widest text-xs"
                >
                    Preparing your menu...
                </motion.p>
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-50 p-6 text-center">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                    <CheckCircle2 className="h-24 w-24 text-green-500 mb-6" />
                </motion.div>
                <h1 className="text-4xl font-black text-indigo-900 mb-2">Order Confirmed!</h1>
                <p className="text-indigo-600 mb-8 text-lg font-medium">Your delicious meal is being prepared. <br /> Table {tableNumber}</p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-8 rounded-3xl shadow-2xl shadow-indigo-200 mb-8 w-full max-w-sm"
                >
                    <p className="text-[10px] text-indigo-400 uppercase tracking-[0.2em] font-black mb-1">Order Tracking ID</p>
                    <p className="text-4xl font-mono font-black text-indigo-900">#{orderSuccess}</p>
                    <div className="h-1 w-full bg-indigo-100 rounded-full mt-4 overflow-hidden">
                        <motion.div
                            className="h-full bg-indigo-600"
                            initial={{ width: "0%" }}
                            animate={{ width: "30%" }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </motion.div>

                <button
                    onClick={() => navigate(`/order-status/${orderSuccess}`)}
                    className="btn-primary w-full max-w-sm mb-4"
                >
                    Track My Order
                </button>
                <button
                    onClick={() => setOrderSuccess(null)}
                    className="text-indigo-500 font-bold hover:text-indigo-700 transition-colors"
                >
                    Order More
                </button>
            </div>
        );
    }

    const filteredItems = activeCategory
        ? menuItems.filter(item => item.category_id == activeCategory)
        : menuItems;

    return (
        <div className="bg-slate-950 min-h-screen pb-32 font-sans overflow-x-hidden relative">
            {/* Background Decorative Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, 60, 0]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-rose-600/10 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, 20, 0],
                        y: [0, -40, 0]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] bg-emerald-600/10 rounded-full blur-[110px]"
                />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <header className="glass-header px-4 py-4">
                    <div className="max-w-5xl mx-auto flex justify-between items-center">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-2"
                        >
                            <div className="bg-indigo-600 p-2 rounded-xl">
                                <Utensils className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-indigo-900 leading-none">ኢትዮ <span className="text-indigo-600">chafe</span></h1>
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-0.5">Table {tableNumber}</p>
                            </div>
                        </motion.div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate('/login')}
                                className="hidden md:flex items-center gap-2 text-xs font-black text-indigo-400 hover:text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl transition-all"
                            >
                                Staff Login
                            </button>
                            <motion.button
                                onClick={() => setIsCartOpen(true)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200"
                            >
                                <ShoppingCart className="h-6 w-6" />
                                <AnimatePresence>
                                    {itemCount > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-4 border-white"
                                        >
                                            {itemCount}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative h-[300px] overflow-hidden">
                    <motion.img
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        src="/storage/menu-items/cafeteria.jpg"
                        className="w-full h-full object-cover"
                        alt="Cafeteria"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent flex flex-col justify-end p-6 pb-12">
                        <div className="max-w-5xl mx-auto w-full">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight"
                            >
                                Delicious Food,<br />
                                <span className="text-indigo-400">ከ ኢትዮ chafe ጋር።</span>
                            </motion.h2>
                        </div>
                    </div>
                </section>

                {/* Category Tabs */}
                <nav className="glass-header sticky top-[73px] z-40">
                    <div className="max-w-5xl mx-auto overflow-x-auto no-scrollbar py-4 px-4 flex gap-3">
                        {categories.map(category => (
                            <motion.button
                                key={category.id}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === category.id
                                    ? category.name.toLowerCase().includes('traditional') ? 'category-active-traditional shadow-lg' :
                                        category.name.toLowerCase().includes('breakfast') ? 'category-active-breakfast shadow-lg' :
                                            category.name.toLowerCase().includes('beverages') ? 'category-active-beverages shadow-lg' :
                                                category.name.toLowerCase().includes('vegetarian') ? 'category-active-vegetarian shadow-lg' :
                                                    category.name.toLowerCase().includes('desserts') ? 'category-active-desserts shadow-lg' :
                                                        'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                                    }`}
                            >
                                {category.name}
                            </motion.button>
                        ))}
                    </div>
                </nav>

                {/* Menu Items */}
                <main className="max-w-5xl mx-auto p-4 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredItems.map(item => (
                            <motion.div
                                layout
                                key={item.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group"
                            >
                                <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
                                    {/* Image */}
                                    <div className="h-64 relative overflow-hidden">
                                        <img
                                            src={item.image ? `/storage/${item.image}` : (item.id % 2 === 0 ? '/storage/menu-items/breakfast.jpg' : '/storage/menu-items/injera.jpg')}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-6 left-6">
                                            <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-lg">
                                                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] font-black text-slate-900">4.9</span>
                                            </div>
                                        </div>
                                        {!item.availability && (
                                            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center">
                                                <span className="bg-white text-rose-600 px-6 py-2 rounded-2xl font-black uppercase tracking-[0.2em] text-xs">Sold Out</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-black text-2xl text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight leading-none">{item.name}</h3>
                                            <div className="text-right">
                                                <span className="text-xs text-indigo-400 font-bold block bg-indigo-50 px-2 py-0.5 rounded-lg mb-1">Price</span>
                                                <span className="text-2xl font-black text-indigo-600">${Number(item.price).toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 line-clamp-2 md:line-clamp-3">
                                            {item.description || "A delectable dish prepared with fresh ingredients and authentic flavors."}
                                        </p>

                                        <div className="flex items-center justify-between gap-6 pt-6 border-t border-slate-100 mt-auto">
                                            <div className="flex items-center gap-4 text-slate-400">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">15 Min</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Zap className="h-4 w-4 text-amber-500" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">Hot</span>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => addToCart(item)}
                                                disabled={!item.availability}
                                                className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all ${item.availability
                                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
                                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Plus className="h-6 w-6" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </main>

                {/* Cart Sidebar/Overlay */}
                <AnimatePresence>
                    {isCartOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md"
                                onClick={() => setIsCartOpen(false)}
                            />
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[70] bg-white shadow-2xl flex flex-col"
                            >
                                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                    <div>
                                        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 lowercase">
                                            /my tray
                                        </h2>
                                        <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em] mt-1">Table {tableNumber} Review</p>
                                    </div>
                                    <button onClick={() => setIsCartOpen(false)} className="p-3 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl transition-all">
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                    {cart.length === 0 ? (
                                        <div className="h-full flex flex-col items-center justify-center text-center">
                                            <div className="bg-slate-50 p-8 rounded-[2.5rem] mb-6">
                                                <ShoppingCart className="h-16 w-16 text-slate-200" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Hungry much?</h3>
                                            <p className="text-slate-400 text-sm font-medium">Your tray is looking a bit lonely. <br />Add some items to get started!</p>
                                        </div>
                                    ) : (
                                        cart.map(item => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ x: 20, opacity: 0 }}
                                                animate={{ x: 0, opacity: 1 }}
                                                className="flex gap-4 items-center bg-slate-50 p-1 pr-6 rounded-3xl"
                                            >
                                                <div className="w-20 h-20 rounded-[1.25rem] overflow-hidden flex-shrink-0">
                                                    <img src={item.image ? `/storage/${item.image}` : '/storage/menu-items/breakfast.jpg'} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="flex-1 py-2">
                                                    <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm mb-1">{item.name}</h4>
                                                    <p className="text-xs text-indigo-500 font-black">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                                                </div>
                                                <div className="flex items-center gap-4 bg-white px-2 py-1.5 rounded-2xl shadow-sm border border-slate-200/50">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-indigo-600 transition-colors"><Minus className="h-4 w-4" /></button>
                                                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-indigo-600 transition-colors"><Plus className="h-4 w-4" /></button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors ml-2"><X className="h-5 w-5" /></button>
                                            </motion.div>
                                        ))
                                    )}
                                </div>

                                <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                                    <div className="flex justify-between items-end mb-8">
                                        <div>
                                            <span className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.2em] mb-1 block">Subtotal</span>
                                            <span className="text-4xl font-black text-slate-900 tracking-tighter">${cartTotal}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1 block">Processing Fee</span>
                                            <span className="text-sm font-black text-slate-900">$0.00</span>
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                                        whileTap={{ y: 0 }}
                                        onClick={placeOrder}
                                        disabled={cart.length === 0 || orderPlacing}
                                        className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-sm transition-all flex items-center justify-center gap-3 ${cart.length === 0 || orderPlacing
                                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white shadow-2xl shadow-indigo-100 hover:bg-indigo-700'
                                            }`}
                                    >
                                        {orderPlacing ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>Checkout Now <ChevronRight className="h-5 w-5" /></>
                                        )}
                                    </motion.button>
                                    <p className="text-center text-[10px] text-slate-400 font-bold mt-6 uppercase tracking-[0.2em]">Secure Checkout • Encrypted</p>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Floating Quick Cart */}
                <AnimatePresence>
                    {!isCartOpen && cart.length > 0 && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="fixed bottom-8 left-4 right-4 z-50 flex justify-center"
                        >
                            <motion.button
                                onClick={() => setIsCartOpen(true)}
                                whileHover={{ y: -4, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full max-w-lg glass-card p-2 pr-2 rounded-[2rem] flex items-center justify-between border-indigo-200/50 shadow-2xl shadow-indigo-200"
                            >
                                <div className="flex items-center gap-4 pl-4">
                                    <div className="bg-indigo-600 p-3 rounded-2xl text-white shadow-lg">
                                        <ShoppingCart className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-indigo-600 font-black text-xs uppercase tracking-widest">{itemCount} Items Ready</p>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Tap to review tray</p>
                                    </div>
                                </div>
                                <div className="bg-indigo-600 text-white flex items-center gap-4 px-8 py-4 rounded-[1.75rem] font-black text-lg">
                                    ${cartTotal}
                                    <ChevronRight className="h-5 w-5 text-indigo-300" />
                                </div>
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Menu;
