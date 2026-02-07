import React from 'react';
import axios from 'axios';
import { LogOut } from 'lucide-react';

const LogoutButton = ({ className, children, redirect = '/login' }) => {
    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            window.location.href = redirect;
        } catch (error) {
            console.error('Logout failed', error);
            // Force redirect even if API fails to ensure user isn't stuck
            window.location.href = redirect;
        }
    };

    return (
        <button
            onClick={handleLogout}
            className={`flex items-center gap-2 transition-all ${className}`}
        >
            {children || (
                <>
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </>
            )}
        </button>
    );
};

export default LogoutButton;
