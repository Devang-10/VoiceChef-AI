import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
    const steps = [
        {
            number: "01",
            title: "Voice Conversation",
            description: "The customer speaks naturally with our AI Agent. No robotic commands, just a normal ordering conversation.",
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            ),
        },
        {
            number: "02",
            title: "Real-time Recognition",
            description: "Powered by Retell AI, speech is instantly converted to text with high accuracy and low latency.",
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
        {
            number: "03",
            title: "Intelligent Extraction",
            description: "Our LLM extracts items, quantities, and preferences into a structured JSON format automatically.",
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7M4 7a2 2 0 012-2h12a2 2 0 012 2M4 7h16m-5 4h3m-3 4h3" />
                </svg>
            ),
        },
        {
            number: "04",
            title: "Supabase Integration",
            description: "The extracted order is securely stored in Supabase, triggering a real-time broadcast to the kitchen.",
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.2 4.5 4 10 4s10-1.8 10-4V7M4 7c0 2.2 4.5 4 10 4s10-1.8 10-4M4 7c0-2.2 4.5-4 10-4s10 1.8 10 4" />
                </svg>
            ),
        },
        {
            number: "05",
            title: "Live Kitchen Dashboard",
            description: "Orders appear instantly on the kitchen display, organized and ready for preparation without human delay.",
            icon: (
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-amber-500 selection:text-slate-900">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto w-full">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
                    Voice<span className="text-amber-500">Chef</span>
                </Link>
                <div className="space-x-4 md:space-x-8 text-sm font-medium hidden md:flex items-center">
                    <Link to="/how-it-works" className="text-amber-500 transition-colors">How it Works</Link>
                    <Link to="/about" className="text-slate-300 hover:text-amber-500 transition-colors">About</Link>
                    <Link to="/login" className="text-slate-300 hover:text-amber-500 transition-colors">Login</Link>
                    <Link to="/signup" className="px-5 py-2.5 bg-amber-500 text-slate-900 rounded-full hover:bg-yellow-400 transition-all font-bold shadow-lg">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-20">
                <div className="text-center mb-24">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 text-white"
                    >
                        How <span className="text-amber-500">VoiceChef</span> Works
                    </motion.h1>
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
                        A seamless, automated bridge between customer voice and kitchen efficiency.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent transform -translate-x-1/2"></div>

                    <div className="space-y-24 md:space-y-40">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-20`}
                            >
                                <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                    <span className="text-amber-500 font-mono text-xl font-bold mb-4 block">{step.number}</span>
                                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{step.title}</h2>
                                    <p className="text-slate-400 text-lg leading-relaxed">{step.description}</p>
                                </div>

                                <div className="relative">
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.1)] z-10 relative">
                                        {step.icon}
                                    </div>
                                    <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-2xl opacity-10"></div>
                                </div>

                                <div className="flex-1 hidden md:block"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-40 text-center">
                    <Link to="/agent">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-10 py-5 bg-amber-500 text-slate-900 rounded-full font-bold text-xl shadow-2xl hover:bg-yellow-400 transition-all"
                        >
                            Try the Live Demo
                        </motion.button>
                    </Link>
                </div>
            </main>

            <footer className="py-20 text-center text-slate-600 border-t border-slate-900">
                &copy; 2026 VoiceChef AI. All rights reserved.
            </footer>
        </div>
    );
};
