import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';
import { OrderCard } from './OrderCard';
import { AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
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

        const { error } = await supabase
            .from('orders')
            .update({ status: 'completed' })
            .eq('id', id);

        if (error) {
            console.error('Error completing order:', error);
            // Revert if needed (fetching usually fixes it or we can store prev state)
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10">
            <header className="mb-10 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">VoiceChef AI <span className="text-orange-500">Live</span></h1>
                    <p className="text-gray-500 mt-2">Turning Conversations into Orders</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Status: </span>
                    <span className="text-sm font-bold text-green-500 flex items-center gap-2 inline-flex">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Online
                    </span>
                </div>
            </header>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100 opacity-80">
                    <p className="text-2xl text-gray-400 font-medium">No active orders</p>
                    <p className="text-gray-300 mt-2">Waiting for calls...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
