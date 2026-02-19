import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const Signup: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/agent');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-slate-50 relative overflow-hidden">
            {/* Background Blob */}
            <div className="absolute top-0 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl filter opacity-50 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
                    <p className="text-slate-400 mt-2">Join the future of dining</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-500 hover:border-slate-600"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-500 hover:border-slate-600"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-amber-500 text-slate-900 rounded-xl font-bold text-lg shadow-lg hover:bg-amber-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-amber-500/20"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-amber-500 hover:text-amber-400 font-medium transition-colors hover:underline">
                        Sign in
                    </Link>
                </p>
                <div className="mt-4 text-center">
                    <Link to="/" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};
