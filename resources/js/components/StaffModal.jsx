import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Save } from 'lucide-react';

const StaffModal = ({ isOpen, onClose, onRefresh, staff = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Staff'
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (staff) {
            setFormData({
                name: staff.name,
                email: staff.email,
                password: '', // Don't show existing password
                role: staff.role
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'Staff'
            });
        }
    }, [staff, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (staff) {
                // Update
                const payload = { ...formData };
                if (!payload.password) delete payload.password; // Only send password if changed
                await axios.put(`/api/admin/staff/${staff.id}`, payload);
            } else {
                // Create
                await axios.post('/api/admin/staff', formData);
            }
            onRefresh();
            onClose();
        } catch (error) {
            alert("Failed to save staff. " + (error.response?.data?.message || ''));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-4xl shadow-2xl p-8 w-full max-w-md animate-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-black">{staff ? 'Edit Staff' : 'New Team Member'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold placeholder:text-gray-300 focus:ring-2 ring-indigo-500 outline-none"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold placeholder:text-gray-300 focus:ring-2 ring-indigo-500 outline-none"
                            placeholder="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <input
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold placeholder:text-gray-300 focus:ring-2 ring-indigo-500 outline-none"
                            placeholder={staff ? "New Password (Leave blank to keep)" : "Temporary Password"}
                            type="password"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            required={!staff}
                        />
                    </div>
                    <div>
                        <select
                            className="w-full p-4 bg-gray-50 border-none rounded-2xl font-bold text-gray-800 focus:ring-2 ring-indigo-500 outline-none"
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="Staff">Kitchen Staff</option>
                            <option value="Admin">Administrator</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 font-black uppercase text-xs text-gray-400 hover:text-gray-600">Cancel</button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-2 py-4 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (staff ? 'Update Staff' : 'Confirm Hire')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StaffModal;
