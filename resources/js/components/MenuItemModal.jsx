import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save, DollarSign, Image as ImageIcon } from 'lucide-react';

const MenuItemModal = ({ isOpen, onClose, onRefresh, categories, item = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        image: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                description: item.description || '',
                price: item.price,
                category_id: item.category_id,
                image: null // We don't preload image file, can handle preview later if needed
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                category_id: categories.length > 0 ? categories[0].id : '',
                image: null
            });
        }
    }, [item, isOpen, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category_id', formData.category_id);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (item) {
                // Determine if we need to use _method=PUT for file upload or standard PUT
                // Usually file uploads in Laravel with PUT verify method spoofing
                data.append('_method', 'PUT');
                await axios.post(`/api/menu-items/${item.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await axios.post('/api/menu-items', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            onRefresh();
            onClose();
        } catch (error) {
            console.error("Error saving item", error);
            alert("Failed to save item. " + (error.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black">{item ? 'Edit Item' : 'New Dish'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Item Name</label>
                        <input
                            name="name"
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 ring-indigo-500 outline-none"
                            placeholder="e.g. Classic Burger"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price ($)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    className="w-full p-4 pl-10 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 ring-indigo-500 outline-none"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Category</label>
                            <select
                                name="category_id"
                                className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 ring-indigo-500 outline-none appearance-none"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>Select</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            name="description"
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 ring-indigo-500 outline-none h-24 resize-none"
                            placeholder="Ingredients, details..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Image (Optional)</label>
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label htmlFor="image-upload" className="w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 transition-colors text-gray-400 font-bold text-sm">
                                <ImageIcon className="h-5 w-5" />
                                {formData.image ? formData.image.name : "Choose File..."}
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="h-4 w-4" />
                                Save Item
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MenuItemModal;
