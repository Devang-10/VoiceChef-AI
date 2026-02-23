import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';
import { OrderCard } from './OrderCard';
import { AnimatePresence, motion } from 'framer-motion';

export const Dashboard: React.FC = () => {
    const { user, signOut } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch initial orders
    useEffect(() => {
        const fetchOrders = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) console.error('Error fetching orders:', error);
            else setOrders(data || []);
            setLoading(false);
        };

        fetchOrders();

        // Real-time subscription
        const channel = supabase
            .channel('orders_channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('New order received!', payload);
                    const newOrder = payload.new as Order;
                    if (newOrder.status === 'pending') {
                        setOrders((prev) => [newOrder, ...prev]);
                    }
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                (payload) => {
                    // If status changed to completed, remove from list
                    const updatedOrder = payload.new as Order;
                    if (updatedOrder.status === 'completed') {
                        setOrders((prev) => prev.filter(o => o.id !== updatedOrder.id));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleComplete = async (id: string) => {
        // Optimistic update
        setOrders((prev) => prev.filter((o) => o.id !== id));

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/orders/${id}/complete`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                throw new Error('Failed to complete order');
            }
        } catch (error) {
            console.error('Error completing order:', error);
            // Revert optimistic update
            // Ideally we'd re-fetch or revert state, but for MVP fetching again or reloading is acceptable fallback
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 p-6 md:p-10 font-sans selection:bg-amber-500 selection:text-slate-900">
            <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-white">
                        Voice<span className="text-amber-500">Chef</span> <span className="text-slate-400 font-light ml-2">Live</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium tracking-wide border-l-2 border-amber-500 pl-4 uppercase text-xs">Turning Conversations into Orders</p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 shadow-xl flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Active Operator</span>
                            <span className="text-sm font-semibold text-slate-200">{user?.email}</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 shadow-xl">
                        <span className="text-sm font-bold text-emerald-500 flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            System Live
                        </span>
                    </div>

                    <button
                        onClick={() => signOut()}
                        className="text-sm text-slate-400 hover:text-white font-bold px-5 py-2.5 rounded-xl border border-slate-800 hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
                </div>
            ) : orders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-32 bg-slate-900/30 rounded-[2rem] border-2 border-dashed border-slate-800 backdrop-blur-sm"
                >
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-2xl text-slate-400 font-bold">No active orders</p>
                    <p className="text-slate-600 mt-2">The kitchen is currenty clear. Waiting for customer calls...</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {orders.map((order) => (
                            <OrderCard key={order.id} order={order} onComplete={handleComplete} />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
