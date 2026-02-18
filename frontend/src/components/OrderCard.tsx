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
            className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col justify-between h-full hover:shadow-xl transition-shadow duration-300"
        >
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full mb-1">
                            #{order.id.slice(0, 8)}
                        </span>
                        <p className="text-gray-500 text-xs">
                            {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-900 font-bold block">${order.total_price.toFixed(2)}</p>
                        <p className="text-gray-600 text-sm font-medium">{order.customer_name || 'Guest'}</p>
                        <p className="text-gray-400 text-xs">{order.customer_phone}</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Items</h3>
                    <ul className="space-y-1">
                        {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                            <li key={index} className="flex items-center text-gray-800 text-base font-medium">
                                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <button
                onClick={() => onComplete(order.id)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transform active:scale-95 transition-all duration-200 flex items-center justify-center shadow-md hover:shadow-lg"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Complete Order
            </button>
        </motion.div>
    );
};
