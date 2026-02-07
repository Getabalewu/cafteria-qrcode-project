import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingCart, Utensils, Info, Plus, Minus, X, CheckCircle2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const Menu = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const tableNumber = searchParams.get('table') || '1'; // Default to 1 for demo

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

    const placeOrder = async () => {
        setOrderPlacing(true);
        try {
            // 1. Place Order
            const orderRes = await axios.post('/api/orders', {
                table_id: tableNumber,
                items: cart.map(i => ({ item_id: i.id, quantity: i.quantity }))
            });


            // 2. Process Payment (Simulated)
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
            <div className="flex items-center justify-center min-h-screen bg-white">
                <Utensils className="h-10 w-10 text-indigo-500 animate-bounce" />
            </div>
        );
    }

    if (orderSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-6 text-center">
                <CheckCircle2 className="h-20 w-20 text-green-500 mb-6 animate-pulse" />
                <h1 className="text-3xl font-bold text-green-900 mb-2">Order Confirmed!</h1>
                <p className="text-green-700 mb-8 text-lg">Your delicious meal is being prepared. <br /> Sit back and relax at Table {tableNumber}.</p>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 mb-8 w-full max-w-sm">
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Order ID</p>
                    <p className="text-2xl font-mono font-bold text-gray-800">#{orderSuccess}</p>
                </div>
                <button
                    onClick={() => setOrderSuccess(null)}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all active:scale-95"
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
        <div className="bg-gray-50 min-h-screen pb-24 font-sans text-gray-900">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-20 px-4 py-4 border-b border-gray-100">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-black text-indigo-900 flex items-center gap-2">
                            <Utensils className="h-6 w-6 text-indigo-500" />
                            CAFETERIA
                        </h1>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                            Table {tableNumber} • Items: {menuItems.length} • Cat: {activeCategory}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="text-[10px] font-black text-indigo-400 hover:text-indigo-600 uppercase tracking-widest border border-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                        >
                            Management
                        </button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2.5 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-all active:scale-90"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                    {cart.reduce((s, i) => s + i.quantity, 0)}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Category Tabs */}
            <div className="bg-white shadow-sm overflow-x-auto sticky top-[73px] z-10 no-scrollbar">
                <div className="max-w-4xl mx-auto flex gap-4 px-4 py-3">
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(category.id)}
                            className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all border-2 ${activeCategory === category.id
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105'
                                : 'bg-gray-50 text-gray-400 border-gray-50 hover:border-gray-200'
                                }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menu Items */}
            <main className="max-w-4xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <div key={item.id} className="bg-white rounded-[2rem] shadow-sm overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 group">
                            {/* Image Header */}
                            <div className="h-48 bg-gray-100 relative overflow-hidden">
                                {item.image ? (
                                    <img
                                        src={`/storage/${item.image}`}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
                                        <Utensils className="h-12 w-12 text-indigo-200" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md ${item.availability ? 'bg-white/90 text-green-600' : 'bg-red-500 text-white'
                                        }`}>
                                        {item.availability ? 'Available' : 'Sold Out'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-black text-xl text-gray-800 group-hover:text-indigo-600 transition-colors tracking-tight">{item.name}</h3>
                                    <span className="text-indigo-600 font-extrabold text-xl font-mono">${Number(item.price).toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed min-h-[40px] mb-6 line-clamp-2">{item.description}</p>

                                <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-2 pl-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        Qty: 1
                                    </span>
                                    <button
                                        onClick={() => addToCart(item)}
                                        disabled={!item.availability}
                                        className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${item.availability
                                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-xl shadow-indigo-100'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add to Tray
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center">
                        <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-400">No Items Found in this Category</h3>
                        <p className="text-sm text-gray-400">Please try another category or check back later.</p>
                    </div>
                )}
            </main>

            {/* Floating Cart Panel (Mobile-ready Drawer) */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-indigo-900/20 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
                        <div className="p-6 border-b flex justify-between items-center bg-indigo-50">
                            <h2 className="text-xl font-black text-indigo-900 flex items-center gap-2">
                                <ShoppingCart className="h-6 w-6" /> Your Tray
                            </h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors">
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-20">
                                    <Utensils className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold uppercase text-sm">Your tray is empty</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                                            <p className="text-xs text-indigo-600 font-black">${Number(item.price).toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border shadow-sm">
                                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-indigo-600"><Minus className="h-4 w-4" /></button>
                                            <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-indigo-600"><Plus className="h-4 w-4" /></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-1"><X className="h-5 w-5" /></button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="p-6 border-t bg-gray-50">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-gray-500 font-bold uppercase tracking-wider text-sm">Total Amount</span>
                                <span className="text-3xl font-black text-gray-900">${cartTotal}</span>
                            </div>
                            <button
                                onClick={placeOrder}
                                disabled={cart.length === 0 || orderPlacing}
                                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all flex items-center justify-center gap-3 ${cart.length === 0 || orderPlacing
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
                                    }`}
                            >
                                {orderPlacing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>Verify & Pay Now</>
                                )}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-tighter">Powered by SmartPay • Secure Transaction</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Nav / Cart Trigger */}
            {!isCartOpen && cart.length > 0 && (
                <div className="fixed bottom-6 left-4 right-4 animate-bounce-subtle">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="max-w-4xl mx-auto w-full bg-indigo-600 text-white py-4 rounded-2xl shadow-2xl flex justify-between items-center px-8 font-black uppercase tracking-widest text-sm hover:bg-indigo-700 transition-all border-4 border-white active:scale-95"
                    >
                        <span className="flex items-center gap-3">
                            <ShoppingCart className="h-5 w-5" />
                            View Tray ({cart.reduce((s, i) => s + i.quantity, 0)})
                        </span>
                        <span className="text-lg">${cartTotal}</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default Menu;
