import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, UtensilsCrossed, QrCode, TrendingUp, DollarSign, Package, ChevronRight, X, LogOut, Edit2, ChefHat, Clock, MapPin, RefreshCcw, Bell, CheckCircle2 } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import CategoryModal from '../../components/CategoryModal';
import MenuItemModal from '../../components/MenuItemModal';
import StaffModal from '../../components/StaffModal';

const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [currentTab, setCurrentTab] = useState('orders'); // Default to Orders for operational focus
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await axios.get('/api/user');
            setUser(res.data);
            // If they are Admin, maybe default to dashboard? 
            // For Staff, keep it on orders.
            if (res.data.role === 'Admin') setCurrentTab('dashboard');
        } catch (error) {
            console.error("Auth error", error);
        }
    };

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (currentTab === 'dashboard') {
                const res = await axios.get('/api/admin/reports');
                setStats(res.data);
            }
        } catch (error) {
            console.error("Error fetching admin data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        fetchData();
    }, [currentTab, user]);

    const renderContent = () => {
        switch (currentTab) {
            case 'dashboard':
                return <DashboardView stats={stats} user={user} />;
            case 'orders':
                return <OrdersView />;
            case 'menu':
                return <MenuManager user={user} />;
            case 'qr':
                return <QrGenerator />;
            case 'staff':
                return <StaffManagement />;
            default:
                return user?.role === 'Admin' ? <DashboardView stats={stats} user={user} /> : <OrdersView />;
        }
    };

    if (!user) return <div className="h-screen flex items-center justify-center font-black animate-pulse text-indigo-900 tracking-widest uppercase italic">Validating Credentials...</div>;

    const isAdmin = user.role === 'Admin';

    return (
        <div className="bg-gray-50 h-screen w-full font-sans flex text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col shadow-2xl shadow-gray-200/50 z-50">
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="flex items-center gap-3 mb-10 pl-2">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white">
                            <ChefHat className="h-6 w-6" />
                        </div>
                        <h1 className="text-2xl font-black text-indigo-900 tracking-tighter italic">ኢትዮ <span className="text-indigo-600">chafe</span></h1>
                    </div>

                    <nav className="space-y-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-3">Operations</p>
                        <button
                            onClick={() => setCurrentTab('orders')}
                            className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-bold text-sm transition-all ${currentTab === 'orders' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Clock className="h-5 w-5" /> Active Orders
                        </button>

                        <button
                            onClick={() => setCurrentTab('dashboard')}
                            className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-bold text-sm transition-all ${currentTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <LayoutDashboard className="h-5 w-5" /> Performance
                        </button>

                        <button
                            onClick={() => setCurrentTab('menu')}
                            className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-bold text-sm transition-all ${currentTab === 'menu' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <UtensilsCrossed className="h-5 w-5" /> Menu & Stock
                        </button>

                        {isAdmin && (
                            <>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 mt-8 ml-3">Administration</p>
                                <button
                                    onClick={() => setCurrentTab('qr')}
                                    className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-bold text-sm transition-all ${currentTab === 'qr' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <QrCode className="h-5 w-5" /> QR Generator
                                </button>
                                <button
                                    onClick={() => setCurrentTab('staff')}
                                    className={`flex items-center gap-3 w-full p-3.5 rounded-2xl font-bold text-sm transition-all ${currentTab === 'staff' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <Users className="h-5 w-5" /> Team Manager
                                </button>
                            </>
                        )}
                    </nav>
                </div>

                <div className="p-6 border-t bg-gray-50 mt-auto">
                    <LogoutButton className="flex items-center gap-3 w-full p-4 rounded-2xl font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                        <LogOut className="h-4 w-4" /> Exit System
                    </LogoutButton>
                    <div className="text-center pt-4 font-bold text-[9px] text-gray-400 uppercase tracking-widest opacity-50">Session Active: {user.role}</div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 p-8 overflow-y-auto">
                    {loading && currentTab === 'dashboard' ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4">
                            <RefreshCcw className="h-10 w-10 text-indigo-600 animate-spin" />
                            <div className="font-black text-indigo-900 uppercase tracking-widest text-xs">Decrypting Analytics...</div>
                        </div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </main>
        </div >
    );
};

// --- Sub-Components ---

const DashboardView = ({ stats, user }) => {
    if (!stats) return <div className="p-10 text-gray-400 font-bold uppercase tracking-widest">No Intelligence Data Available</div>;
    const isAdmin = user?.role === 'Admin';

    const downloadCSV = () => {
        if (!stats?.sales_report) return;
        const headers = ["Date", "Total Sales", "Orders"];
        const rows = stats.sales_report.map(r => [r.date, r.total_sales, r.count || 0]);
        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sales_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">{isAdmin ? "Financial Overview" : "Operational Performance"}</h2>
                    <p className="text-gray-500 font-medium">Real-time demand and fulfillment analytics.</p>
                </div>
                {isAdmin && (
                    <div className="flex gap-4">
                        <button onClick={downloadCSV} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all">Download CSV</button>
                        <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Refresh Report</button>
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><DollarSign className="h-6 w-6" /></div>
                        {isAdmin && <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase">+12% vs last week</span>}
                    </div>
                    <h4 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Gross Sales</h4>
                    <p className="text-4xl font-black mt-1 text-gray-900">${(stats.sales_report?.reduce((s, r) => s + Number(r.total_sales), 0) || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp className="h-6 w-6" /></div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">High Demand</span>
                    </div>
                    <h4 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Efficiency Rating</h4>
                    <p className="text-2xl font-black mt-1 text-gray-900">{stats.demand_trends?.[0]?.name || 'Live Data Processing'}</p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Package className="h-6 w-6" /></div>
                    </div>
                    <h4 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Shift Activity</h4>
                    <p className="text-4xl font-black mt-1 text-gray-900">Live</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                    <h3 className="text-lg font-black mb-8 uppercase tracking-widest text-xs text-slate-400">Demand Distribution</h3>
                    <div className="space-y-8">
                        {stats.demand_trends?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-6">
                                <span className="text-slate-200 font-black text-2xl w-8">0{idx + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-2">
                                        <span className="font-bold text-gray-700">{item.name}</span>
                                        <span className="text-indigo-600 font-black text-sm">{item.total_quantity} units</span>
                                    </div>
                                    <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                                        <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: `${(item.total_quantity / stats.demand_trends[0].total_quantity) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10">
                    <h3 className="text-lg font-black mb-8 uppercase tracking-widest text-xs text-slate-400">Transaction History</h3>
                    <div className="space-y-4">
                        {stats.sales_report?.map((sale, idx) => (
                            <div key={idx} className="flex justify-between items-center p-5 bg-gray-50/50 rounded-2xl group hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 border border-transparent hover:border-indigo-100 transition-all">
                                <div>
                                    <p className="font-black text-gray-800 tracking-tight">{sale.date}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shift Cycle Finalized</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-black text-indigo-900 tracking-tighter">${Number(sale.total_sales).toFixed(2)}</span>
                                    <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <ChevronRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrdersView = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-10 font-bold text-gray-400 flex items-center gap-3 animate-pulse"><RefreshCcw className="animate-spin h-5 w-5" /> Syncing Kitchen...</div>;

    const pendingOrders = orders.filter(o => o.order_status !== 'Served');

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tight italic">ኢትዮ <span className="text-indigo-600">chafe</span> <span className="text-slate-300 ml-2">/kitchen</span></h2>
                    <p className="text-gray-500 font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Live Order Execution Stream</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="bg-white px-5 py-2.5 border border-gray-100 rounded-2xl shadow-sm font-black text-xs text-indigo-600 uppercase tracking-widest">
                        {pendingOrders.length} Backlog
                    </div>
                    <button onClick={fetchOrders} className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
                        <RefreshCcw className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {pendingOrders.length > 0 ? (
                    pendingOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden flex flex-col group hover:border-indigo-200 transition-all duration-300">
                            <div className={`p-6 flex justify-between items-center ${order.order_status === 'Pending' ? 'bg-amber-50/50' :
                                order.order_status === 'Preparing' ? 'bg-blue-50/50' : 'bg-emerald-50/50'
                                }`}>
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 italic tracking-tighter">#ORD-{order.id}</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                        <MapPin className="h-3 w-3 text-indigo-500" /> Table {order.table?.table_number || 'N/A'}
                                    </p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.order_status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                    order.order_status === 'Preparing' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                                    }`}>
                                    {order.order_status}
                                </div>
                            </div>

                            <div className="p-8 flex-1 space-y-4">
                                {order.order_details?.map(detail => (
                                    <div key={detail.id} className="flex justify-between items-center group/item p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <span className="bg-indigo-900 text-white w-9 h-9 flex items-center justify-center rounded-2xl text-[10px] font-black border-4 border-indigo-100">
                                                {detail.quantity}
                                            </span>
                                            <span className="font-extrabold text-sm text-gray-700 capitalize">
                                                {detail.menu_item?.name}
                                            </span>
                                        </div>
                                        {order.order_status === 'Preparing' && <CheckCircle2 className="h-4 w-4 text-indigo-200 group-hover/item:text-indigo-500 transition-colors" />}
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-gray-50/50 mt-auto grid grid-cols-1 gap-3">
                                {order.order_status === 'Pending' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-indigo-100"
                                    >
                                        Initiate Prep
                                    </button>
                                )}
                                {order.order_status === 'Preparing' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'Ready')}
                                        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-blue-100"
                                    >
                                        Ready for Delivery
                                    </button>
                                )}
                                {order.order_status === 'Ready' && (
                                    <button
                                        onClick={() => updateOrderStatus(order.id, 'Served')}
                                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-[0.2em] transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-emerald-100"
                                    >
                                        <CheckCircle2 className="h-4 w-4" /> Finalize Order
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                        <Bell className="h-16 w-16 text-gray-200 mx-auto mb-6 opacity-50" />
                        <h3 className="text-3xl font-black text-indigo-900/20 italic tracking-tighter">ZERO LIVE ORDERS</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px] mt-2 leading-relaxed max-w-xs mx-auto">All customers have been successfully satisfied. Standby for new incoming transmissions.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const MenuManager = ({ user }) => {
    const isAdmin = user?.role === 'Admin';
    const [items, setItems] = useState([]);
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showItemModal, setShowItemModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchMenu = async () => {
        try {
            const [iRes, cRes] = await Promise.all([axios.get('/api/menu-items'), axios.get('/api/categories')]);
            setItems(iRes.data);
            setCats(cRes.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const toggleAvailability = async (id, current) => {
        try {
            await axios.put(`/api/menu-items/${id}`, { availability: !current });
            fetchMenu();
        } catch (error) { alert("Failed to update availability"); }
    };

    const handleDeleteItem = async (id) => {
        if (!isAdmin) return;
        if (!confirm("Confirm removal of this inventory item?")) return;
        try {
            await axios.delete(`/api/menu-items/${id}`);
            fetchMenu();
        } catch (error) { alert("Action restricted by system policy"); }
    };

    const handleEditItem = (item) => {
        setSelectedItem(item);
        setShowItemModal(true);
    };

    const handleCreateItem = () => {
        setSelectedItem(null);
        setShowItemModal(true);
    };

    const handleCreateCategory = () => {
        setSelectedCategory(null);
        setShowCategoryModal(true);
    };

    if (loading) return <div className="p-10 font-bold text-gray-400">Loading Menu Data...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-5 duration-500">
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">{isAdmin ? "Menu Inventory" : "Stock Control"}</h2>
                    <p className="text-gray-500 font-medium">{isAdmin ? "Manage your cafeteria offerings and availability." : "Real-time stock availability management."}</p>
                </div>
                <div className="flex gap-4">
                    {isAdmin && (
                        <>
                            <button onClick={handleCreateCategory} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all">Add Category</button>
                            <button onClick={handleCreateItem} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">+ Add Item</button>
                        </>
                    )}
                    <button onClick={fetchMenu} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center">
                        <RefreshCcw className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-8 font-black uppercase tracking-widest text-[10px] text-gray-400">Item Name</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[10px] text-gray-400">Category</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[10px] text-gray-400">Price</th>
                            <th className="p-8 font-black uppercase tracking-widest text-[10px] text-gray-400 text-center">Live Status</th>
                            {isAdmin && <th className="p-8 font-black uppercase tracking-widest text-[10px] text-gray-400 text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="p-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden">
                                            {item.image ? (
                                                <img src={`/storage/${item.image}`} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300"><ChefHat className="h-4 w-4" /></div>
                                            )}
                                        </div>
                                        <span className="font-black text-gray-900 tracking-tight">{item.name}</span>
                                    </div>
                                </td>
                                <td className="p-8"><span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{item.category?.name}</span></td>
                                <td className="p-8 font-black text-gray-900 font-mono italic text-lg">${Number(item.price).toFixed(2)}</td>
                                <td className="p-8 text-center">
                                    <button
                                        onClick={() => toggleAvailability(item.id, item.availability)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all active:scale-95 ${item.availability ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm' : 'bg-rose-50 text-rose-600 border border-rose-100 shadow-sm'}`}
                                    >
                                        {item.availability ? 'Available' : 'Out of Stock'}
                                    </button>
                                </td>
                                {isAdmin && (
                                    <td className="p-8 text-right">
                                        <div className="flex gap-4 justify-end">
                                            <button onClick={() => handleEditItem(item)} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:underline flex items-center gap-2">
                                                <Edit2 className="h-4 w-4" /> Edit
                                            </button>
                                            <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 font-black text-[10px] uppercase tracking-widest cursor-pointer hover:underline">Remove</button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CategoryModal
                isOpen={showCategoryModal}
                onClose={() => setShowCategoryModal(false)}
                onRefresh={fetchMenu}
                category={selectedCategory}
            />

            <MenuItemModal
                isOpen={showItemModal}
                onClose={() => setShowItemModal(false)}
                onRefresh={fetchMenu}
                categories={cats}
                item={selectedItem}
            />
        </div>
    );
};

const QrGenerator = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTable, setSelectedTable] = useState(null);
    const [qrResult, setQrResult] = useState(null);

    useEffect(() => {
        const fetchTables = async () => {
            try {
                // In a real app, we'd have a tables endpoint. For now we use the ones we found or assuming list.
                // Simulating fetching tables 1-10
                const tbls = Array.from({ length: 10 }, (_, i) => ({ id: i + 1, table_number: i + 1 }));
                setTables(tbls);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchTables();
    }, []);

    const generateQR = async (tableId) => {
        try {
            const res = await axios.post('/api/admin/generate-qr', { table_id: tableId });
            setQrResult(res.data.qr_code);
            setSelectedTable(tableId);
        } catch (error) { alert("Failed to generate QR"); }
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">QR System</h2>
                    <p className="text-gray-500 font-medium">Generate secure ordering codes for cafeteria tables.</p>
                </div>
                <div className="flex gap-4">
                    <LogoutButton className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-md shadow-red-200 hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </LogoutButton>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
                    {qrResult && (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <div className="p-4 bg-white border-8 border-gray-50 rounded-4xl mb-6 shadow-2xl">
                                {/* Simulating QR Code with Icons since we don't have a library here */}
                                <div className="w-48 h-48 bg-indigo-900 rounded-3xl flex items-center justify-center relative overflow-hidden">
                                    <QrCode className="h-40 w-40 text-white opacity-20 absolute" />
                                    <div className="z-10 text-center">
                                        <p className="text-white font-black text-4xl mb-1">#{qrResult.table_id}</p>
                                        <p className="text-indigo-300 font-bold text-[10px] uppercase tracking-widest">SCAN TO ORDER</p>
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-xl font-black text-indigo-900">Table {qrResult.table_id} Ready</h3>
                            <p className="text-gray-500 text-sm font-medium mb-8 max-w-xs">{qrResult.qr_code_data}</p>
                            <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3">Download PDF</button>
                        </div>
                    )}
                    {!qrResult && (
                        <>
                            <QrCode className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest max-w-xs leading-relaxed">Select a table from the list to generate its unique encrypted access code</p>
                        </>
                    )}
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-xs text-gray-400">Available Tables</h3>
                    <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-2">
                        {tables.map(t => (
                            <button
                                key={t.id}
                                onClick={() => generateQR(t.id)}
                                className={`p-4 rounded-2xl border-2 font-black transition-all text-center ${selectedTable === t.id ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-50 text-indigo-600 hover:border-indigo-100 bg-gray-50/50'}`}
                            >
                                0{t.table_number}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};


const StaffManagement = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showStaffModal, setShowStaffModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const fetchStaff = async () => {
        try {
            const res = await axios.get('/api/admin/staff');
            setStaff(res.data);
        } catch (error) { console.error(error); } finally { setLoading(false); }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const handleHire = () => {
        setSelectedStaff(null);
        setShowStaffModal(true);
    };

    const handleEdit = (member) => {
        setSelectedStaff(member);
        setShowStaffModal(true);
    };

    const deleteStaff = async (id) => {
        if (!confirm("Are you sure?")) return;
        try {
            await axios.delete(`/api/admin/staff/${id}`);
            fetchStaff();
        } catch (error) { alert(error.response?.data?.message || "Failed to delete"); }
    };

    if (loading) return <div className="p-10 font-bold text-gray-400">Loading Personnel...</div>;

    return (
        <div>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Personnel Center</h2>
                    <p className="text-gray-500 font-medium">Manage access and account settings for your team.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={handleHire}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                    >
                        + Hire Staff
                    </button>
                    <div className="w-4"></div>
                    <LogoutButton className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-md shadow-red-200 hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </LogoutButton>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map(member => (
                    <div key={member.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-indigo-900 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                                {member.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-extrabold text-gray-800">{member.name}</h4>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{member.role}</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-6 font-medium">{member.email}</p>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(member)} className="flex-1 py-2 bg-gray-50 rounded-xl text-[10px] font-black uppercase text-gray-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">Credentials</button>
                            <button onClick={() => deleteStaff(member.id)} className="py-2 px-4 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><X className="h-4 w-4" /></button>
                        </div>
                    </div>
                ))}
            </div>

            <StaffModal
                isOpen={showStaffModal}
                onClose={() => setShowStaffModal(false)}
                onRefresh={fetchStaff}
                staff={selectedStaff}
            />
        </div>
    );
};



export default AdminPanel;
