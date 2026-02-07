import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Users, UtensilsCrossed, QrCode, TrendingUp, DollarSign, Package, ChevronRight, X, LogOut, Edit2 } from 'lucide-react';
import LogoutButton from '../../components/LogoutButton';
import CategoryModal from '../../components/CategoryModal';
import MenuItemModal from '../../components/MenuItemModal';
import StaffModal from '../../components/StaffModal';

const AdminPanel = () => {
    const [currentTab, setCurrentTab] = useState('dashboard');
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
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
        fetchData();
    }, [currentTab]);

    const renderContent = () => {
        switch (currentTab) {
            case 'dashboard':
                return <DashboardView stats={stats} />;
            case 'menu':
                return <MenuManager />;
            case 'qr':
                return <QrGenerator />;
            case 'staff':
                return <StaffManagement />;
            default:
                return <DashboardView stats={stats} />;
        }
    };

    return (
        <div className="bg-gray-50 h-screen w-full font-sans flex text-gray-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r h-screen sticky top-0 flex flex-col">
                <div className="p-6 overflow-y-auto flex-1">
                    <h1 className="text-2xl font-black text-indigo-900 mb-10 tracking-tighter italic">ADMIN.PRO</h1>
                    <nav className="space-y-2">
                        <button
                            onClick={() => setCurrentTab('dashboard')}
                            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${currentTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </button>
                        <button
                            onClick={() => setCurrentTab('menu')}
                            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${currentTab === 'menu' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <UtensilsCrossed className="h-5 w-5" /> Menu Manager
                        </button>
                        <button
                            onClick={() => setCurrentTab('qr')}
                            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${currentTab === 'qr' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <QrCode className="h-5 w-5" /> QR Generator
                        </button>
                        <button
                            onClick={() => setCurrentTab('staff')}
                            className={`flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm transition-all ${currentTab === 'staff' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Users className="h-5 w-5" /> Staff Management
                        </button>
                    </nav>
                </div>

                <div className="p-6 border-t bg-gray-50 mt-auto">
                    <LogoutButton className="flex items-center gap-3 w-full p-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-50 hover:text-red-600 transition-all">
                        <div className="rotate-180"><X className="h-5 w-5" /></div> Logout System
                    </LogoutButton>
                    <div className="text-center pt-4 font-bold text-xs text-gray-400 uppercase tracking-widest">System v1.0</div>
                </div>
            </aside>

            {/* Main Content */}
            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                <div className="flex-1 p-8 overflow-y-auto">
                    {loading && currentTab === 'dashboard' ? (
                        <div className="flex items-center justify-center h-64 font-black text-indigo-900 animate-pulse uppercase tracking-widest">Loading Analytics...</div>
                    ) : (
                        renderContent()
                    )}
                </div>
            </main>
        </div >
    );
};

// --- Sub-Components ---

const DashboardView = ({ stats }) => {
    if (!stats) return <div className="p-10 text-gray-400 font-bold uppercase tracking-widest">No Intelligence Data Available</div>;
    const downloadCSV = () => {
        if (!stats?.sales_report) return;
        const headers = ["Date", "Total Sales", "Orders"];
        const rows = stats.sales_report.map(r => [r.date, r.total_sales, r.count || 0]); // Assuming count exists or just mapping available fields
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

    const generateReport = () => {
        // In a real app this might call an API. For now, we'll simulate a refresh/generation.
        alert("Generating new analytics report...");
        window.location.reload();
    };

    return (
        <>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Financial Overview</h2>
                    <p className="text-gray-500 font-medium">Analytics and demand insights dashboard.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={downloadCSV} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all">Download CSV</button>
                    <button onClick={generateReport} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Generate Report</button>
                    <div className="w-4"></div>
                    <LogoutButton className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-md shadow-red-200 hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Logout System</span>
                    </LogoutButton>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><DollarSign className="h-6 w-6" /></div>
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg uppercase">+12% vs last week</span>
                    </div>
                    <h4 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Total Sales</h4>
                    <p className="text-3xl font-black mt-1">${(stats.sales_report?.reduce((s, r) => s + Number(r.total_sales), 0) || 0).toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><TrendingUp className="h-6 w-6" /></div>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">High Demand</span>
                    </div>
                    <h4 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Top Selling</h4>
                    <p className="text-xl font-black mt-1">{stats.demand_trends?.[0]?.name || 'No Sales Yet'}</p>
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><Package className="h-6 w-6" /></div>
                    </div>
                    <h4 className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Active Orders</h4>
                    <p className="text-3xl font-black mt-1">Live Tracking</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-xs text-gray-400">Demand Trends</h3>
                    <div className="space-y-6">
                        {stats.demand_trends?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <span className="text-gray-300 font-black text-lg w-6">0{idx + 1}</span>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-gray-800">{item.name}</span>
                                        <span className="text-indigo-600 font-black text-sm">{item.total_quantity} sold</span>
                                    </div>
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${(item.total_quantity / stats.demand_trends[0].total_quantity) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <h3 className="text-lg font-black mb-6 uppercase tracking-widest text-xs text-gray-400">Sales History</h3>
                    <div className="space-y-4">
                        {stats.sales_report?.map((sale, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl group hover:bg-indigo-50 transition-colors">
                                <div>
                                    <p className="font-extrabold text-gray-800">{sale.date}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase">Daily Transaction Batch</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-black text-indigo-900">${Number(sale.total_sales).toFixed(2)}</span>
                                    <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-indigo-400" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

const MenuManager = () => {
    const [items, setItems] = useState([]);
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal States
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
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await axios.delete(`/api/menu-items/${id}`);
            fetchMenu();
        } catch (error) { alert("Failed to delete item"); }
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
        <div>
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Menu Inventory</h2>
                    <p className="text-gray-500 font-medium">Manage your cafeteria offerings and availability.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={handleCreateCategory} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all">Add Category</button>
                    <button onClick={handleCreateItem} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">+ Add Item</button>
                    <div className="w-4"></div>
                    <LogoutButton className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-md shadow-red-200 hover:bg-red-700 hover:shadow-lg transition-all flex items-center gap-2">
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </LogoutButton>
                </div>
            </header>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Item Name</th>
                            <th className="p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Category</th>
                            <th className="p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Price</th>
                            <th className="p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Status</th>
                            <th className="p-6 font-black uppercase tracking-widest text-[10px] text-gray-400">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map(item => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="p-6 font-bold text-gray-800">{item.name}</td>
                                <td className="p-6"><span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase">{item.category?.name}</span></td>
                                <td className="p-6 font-black text-gray-900">${Number(item.price).toFixed(2)}</td>
                                <td className="p-6">
                                    <button
                                        onClick={() => toggleAvailability(item.id, item.availability)}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${item.availability ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                                    >
                                        {item.availability ? 'Available' : 'Out of Stock'}
                                    </button>
                                </td>
                                <td className="p-6">
                                    <div className="flex gap-4">
                                        <button onClick={() => handleEditItem(item)} className="text-indigo-600 font-bold text-xs uppercase cursor-pointer hover:underline flex items-center gap-1">
                                            <Edit2 className="h-3 w-3" /> Edit
                                        </button>
                                        <button onClick={() => handleDeleteItem(item.id)} className="text-red-400 font-bold text-xs uppercase cursor-pointer hover:underline">Delete</button>
                                    </div>
                                </td>
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
