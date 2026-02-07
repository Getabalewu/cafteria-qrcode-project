import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // Get CSRF cookie for Sanctum
            await axios.get('/sanctum/csrf-cookie');

            // Attempt login
            await axios.post('/login', {
                email: email.trim(),
                password: password.trim()
            });

            // Get user info and role
            const userRes = await axios.get('/api/user');
            const role = userRes.data.role;

            // Redirect based on role
            if (role === 'Admin') navigate('/admin');
            else if (role === 'Staff') navigate('/staff');
            else navigate('/');

        } catch (err) {
            console.error("Login Full Error:", err);
            console.error("Login Response:", JSON.stringify(err.response || {}));

            if (err.response?.status === 419) {
                setError('Session expired. Please refresh the page.');
            } else if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors?.email) {
                setError(err.response.data.errors.email[0]);
            } else {
                setError('Login failed. Please check your credentials and try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/20 mb-4">
                        <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">SECURE ACCESS</h1>
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Management Portal</p>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-bold p-3 rounded-xl mb-6 text-center animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-sm py-4 rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            'Authorize Login'
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                        ← Back to Public Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
