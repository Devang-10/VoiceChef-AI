import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { RetellWebClient } from 'retell-client-js-sdk';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Order } from '../types';

const retellClient = new RetellWebClient();

export const Agent: React.FC = () => {
    const { user, signOut } = useAuth();
    const [isCalling, setIsCalling] = useState(false);
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'active'>('idle');
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

    // Realtime subscription for the current user's latest pending order
    useEffect(() => {
        if (!user) return;

        // Subscribe to orders table for this user
        const channel = supabase
            .channel('agent_order_channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    console.log('New order created via voice:', payload.new);
                    setCurrentOrder(payload.new as Order);
                }
            )
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${currentOrder?.id}` },
                (payload) => {
                    console.log('Order updated:', payload.new);
                    setCurrentOrder(payload.new as Order);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, currentOrder?.id]);


    const handleCallAgent = async () => {
        if (!user) return;
        setIsCalling(true);
        setCallStatus('calling');

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const response = await fetch(`${apiUrl}/retell/create-web-call`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    user_email: user.email,
                    user_name: user.user_metadata?.full_name || 'Guest',
                }),
            });

            if (!response.ok) throw new Error('Failed to get access token');

            const data = await response.json();
            const accessToken = data.access_token;

            await retellClient.startCall({
                accessToken,
                sampleRate: 48000,
            });

            setCallStatus('active');

            retellClient.on('call_started', () => {
                console.log('Call started');
                setCallStatus('active');
            });

            retellClient.on('call_ended', () => {
                console.log('Call ended');
                setCallStatus('idle');
                setIsCalling(false);
            });

            retellClient.on('error', (error) => {
                console.error('Retell error:', error);
                setCallStatus('idle');
                setIsCalling(false);
            });

        } catch (error) {
            console.error('Error starting call:', error);
            setCallStatus('idle');
            setIsCalling(false);
            alert('Failed to start call. Make sure backend is running.');
        }
    };

    const handleEndCall = () => {
        retellClient.stopCall();
        setCallStatus('idle');
        setIsCalling(false);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col md:flex-row font-sans selection:bg-amber-500 selection:text-slate-900">

            {/* Left Panel - Agent Interface */}
            <div className="w-full md:w-1/2 flex flex-col p-6 md:p-12 relative border-r border-slate-800">
                <nav className="flex justify-between items-center mb-12">
                    <Link to="/" className="text-xl font-bold tracking-tighter text-white">
                        Voice<span className="text-amber-500">Chef</span>
                    </Link>
                    <button onClick={signOut} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        Sign Out
                    </button>
                </nav>

                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative mb-12">
                        {/* Pulse Ring */}
                        {callStatus === 'active' && (
                            <motion.div
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-amber-500/30 rounded-full"
                            />
                        )}

                        <motion.div
                            animate={{ scale: callStatus === 'active' ? [1, 1.1, 1] : 1 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className={`w-40 h-40 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-colors duration-500 ${callStatus === 'active' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                        </motion.div>
                    </div>

                    <h2 className="text-3xl font-bold mb-4 text-center">
                        {callStatus === 'idle' ? 'Tap to Order' : callStatus === 'calling' ? 'Connecting...' : 'Listening...'}
                    </h2>

                    <p className="text-slate-500 text-center max-w-sm mb-12 h-6">
                        {callStatus === 'active' && "Speak naturally, I'm listening to your order."}
                    </p>

                    {callStatus === 'idle' ? (
                        <button
                            onClick={handleCallAgent}
                            disabled={isCalling}
                            className="px-10 py-5 bg-amber-500 text-slate-900 rounded-full font-bold text-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.6)] transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-400"
                        >
                            Start Conversation
                        </button>
                    ) : (
                        <button
                            onClick={handleEndCall}
                            className="px-10 py-5 bg-red-500/10 border border-red-500/50 text-red-500 rounded-full font-bold text-xl hover:bg-red-500 hover:text-white transition-all shadow-lg hover:shadow-red-500/20"
                        >
                            End Call
                        </button>
                    )}
                </div>
            </div>

            {/* Right Panel - Live Log */}
            <div className="w-full md:w-1/2 bg-slate-900 p-6 md:p-12 flex flex-col border-l border-slate-800">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold text-slate-300 flex items-center">
                        <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></span>
                        Live Interaction Log
                    </h3>
                    <span className="text-xs font-mono text-slate-500 border border-slate-700 px-2 py-1 rounded">REAL-TIME</span>
                </div>

                <div className="flex-1 bg-slate-950/50 rounded-2xl p-6 border border-slate-800 overflow-y-auto custom-scrollbar relative">
                    {!currentOrder ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p>Waiting for order...</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={currentOrder.id}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                <div>
                                    <p className="text-amber-500 text-sm font-bold">New Order</p>
                                    <p className="text-xs text-slate-500 font-mono">ID: {currentOrder.id.slice(0, 8)}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${currentOrder.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                        currentOrder.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                            currentOrder.status === 'received' ? 'bg-blue-500/20 text-blue-500' :
                                                'bg-slate-500/20 text-slate-400'
                                    }`}>
                                    {currentOrder.status}
                                </span>
                            </div>

                            <div>
                                <h4 className="text-slate-400 text-sm font-bold mb-3 uppercase tracking-wider">Items</h4>
                                <ul className="space-y-2">
                                    {Array.isArray(currentOrder.items) && currentOrder.items.map((item: string, i: number) => (
                                        <motion.li
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            key={i}
                                            className="flex items-center text-slate-200 bg-slate-800/50 px-4 py-3 rounded-xl border border-slate-700/50"
                                        >
                                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3"></span>
                                            {item}
                                        </motion.li>
                                    ))}
                                    {(!currentOrder.items || currentOrder.items.length === 0) && (
                                        <div className="text-slate-600 italic text-sm">Processing items...</div>
                                    )}
                                </ul>
                            </div>

                            <div className="pt-4 border-t border-slate-800">
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-400 text-sm">Total Estimated</span>
                                    <span className="text-2xl font-bold text-white">${currentOrder.total_price}</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};
