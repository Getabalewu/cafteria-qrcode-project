import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [auth, setAuth] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/api/user');
                setAuth(res.data);
            } catch (err) {
                setAuth(false);
            }
        };
        checkAuth();
    }, []);

    if (auth === null) {
        return <div className="flex items-center justify-center min-h-screen">Verifying Credentials...</div>;
    }

    if (!auth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(auth.role)) {
        return <div className="flex items-center justify-center min-h-screen bg-red-50 text-red-600 font-bold">403 - Forbidden: Access Denied</div>;
    }

    return children;
};

export default ProtectedRoute;
