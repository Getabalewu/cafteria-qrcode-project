import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, onRefresh, category = null }) => {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setName(category.name);
        } else {
            setName('');
        }
    }, [category, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (category) {
                await axios.put(`/api/categories/${category.id}`, { name });
            } else {
                await axios.post('/api/categories', { name });
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error saving category", error);
            alert("Failed to save category. " + (error.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black">{category ? 'Edit Category' : 'New Category'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category Name</label>
                        <input
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 ring-indigo-500 outline-none"
                            placeholder="e.g. Breakfast, Drinks"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Category
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryModal;
