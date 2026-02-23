import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Landing: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-amber-500 selection:text-slate-900">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto w-full">
                <div className="text-2xl font-bold tracking-tighter text-white">
                    Voice<span className="text-amber-500">Chef</span>
                </div>
                <div className="space-x-4 md:space-x-8 text-sm font-medium hidden md:flex items-center">
                    <Link to="/how-it-works" className="text-slate-300 hover:text-amber-500 transition-colors">How it Works</Link>
                    <Link to="/about" className="text-slate-300 hover:text-amber-500 transition-colors">About</Link>
                    <Link to="/login" className="text-slate-300 hover:text-amber-500 transition-colors">Login</Link>
                    <Link to="/signup" className="px-5 py-2.5 bg-amber-500/10 border border-amber-500/50 text-amber-500 rounded-full hover:bg-amber-500 hover:text-slate-900 transition-all font-bold">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="flex flex-col items-center justify-center text-center px-6 mt-20 md:mt-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl"
                >
                    <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-white">
                        The Future of Dining is <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-200">
                            Spoken.
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">

                        AI-powered voice ordering that turns conversation into <br /> seamless automation.
                    </p>

                    <Link to="/agent">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-amber-500 text-slate-900 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] transition-all hover:bg-amber-400"
                        >
                            Get Started Free
                        </motion.button>
                    </Link>
                </motion.div>


                {/* Features / How it Works */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto w-full pb-20">
                    <FeatureCard
                        delay={0.2}
                        icon="🎙️"
                        title="Speak Naturally"
                        desc="Just talk to our AI agent as if it were a real person. No menus needed."
                    />
                    <FeatureCard
                        delay={0.4}
                        icon="⚡"
                        title="Real-time Processing"
                        desc="Watch your order being constructed instantly as you speak."
                    />
                    <FeatureCard
                        delay={0.6}
                        icon="✨"
                        title="Instant Confirmation"
                        desc="Receive immediate feedback on your order status and details."
                    />
                </div>
            </main>

            {/* Footer */}
            <footer className="py-10 text-center text-slate-600 text-sm border-t border-slate-900/50">
                &copy; {new Date().getFullYear()} VoiceChef AI. All rights reserved.
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }: { icon: string, title: string, desc: string, delay: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.6 }}
        className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-amber-500/30 transition-colors backdrop-blur-sm"
    >
        <div className="text-4xl mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-3 text-slate-50">{title}</h3>
        <p className="text-slate-400">{desc}</p>
    </motion.div>
);
