import React from 'react';
import { motion } from 'framer-motion';
import type { Order } from '../types';

interface OrderCardProps {
    order: Order;
    onComplete: (id: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onComplete }) => {
    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-slate-900/50 rounded-2xl shadow-2xl border border-slate-800 p-6 flex flex-col justify-between h-full hover:border-amber-500/30 transition-all duration-300 group backdrop-blur-sm"
        >
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="inline-block bg-amber-500/10 text-amber-500 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/20 mb-2 tracking-widest uppercase">
                            #{order.id.slice(0, 8)}
                        </span>
                        <p className="text-slate-500 text-xs font-mono">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-white text-xl font-bold block tracking-tighter">${order.total_price.toFixed(2)}</p>
                        <p className="text-slate-200 text-sm font-bold mt-1">{order.customer_name || 'Guest'}</p>
                        <p className="text-slate-500 text-[10px] font-mono mt-0.5">{order.customer_phone}</p>
                    </div>
                </div>

                <div className="border-t border-slate-800/50 pt-5 mb-6">
                    <h3 className="text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">Order Items</h3>
                    <ul className="space-y-2">
                        {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                            <li key={index} className="flex items-center text-slate-300 text-sm font-medium bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-800/50">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button
                onClick={() => onComplete(order.id)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Complete Order
            </button>
        </motion.div>
    );
};
