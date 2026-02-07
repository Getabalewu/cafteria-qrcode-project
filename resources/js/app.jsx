import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CustomerMenu from './pages/Customer/Menu';
import OrderStatus from './pages/Customer/OrderStatus';
import StaffDashboard from './pages/Staff/Dashboard';
import AdminPanel from './pages/Admin/AdminPanel';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';


const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* Customer Routes */}
                <Route path="/" element={<CustomerMenu />} />
                <Route path="/menu" element={<CustomerMenu />} />
                <Route path="/order/:id" element={<OrderStatus />} />

                {/* Unified Dashboard (Admin & Staff) */}
                <Route path="/admin/*" element={
                    <ProtectedRoute allowedRoles={['Admin', 'Staff']}>
                        <AdminPanel />
                    </ProtectedRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<div className="p-10 text-center text-indigo-900 font-bold">404 - Page Not Found</div>} />
            </Routes>
        </Router>
    );
};

console.log("React app.jsx loaded. Attempting to mount...");

const rootElement = document.getElementById('app');
if (rootElement) {
    console.log("Mounting point found!");
    const root = createRoot(rootElement);
    root.render(
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    );

} else {
    console.error("Mounting point NOT found!");
}
