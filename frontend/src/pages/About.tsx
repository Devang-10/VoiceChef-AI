import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-amber-500 selection:text-slate-900">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-6 py-6 max-w-7xl mx-auto w-full">
                <Link to="/" className="text-2xl font-bold tracking-tighter text-white">
                    Voice<span className="text-amber-500">Chef</span>
                </Link>
                <div className="space-x-4 md:space-x-8 text-sm font-medium hidden md:flex items-center">
                    <Link to="/how-it-works" className="text-slate-300 hover:text-amber-500 transition-colors">How it Works</Link>
                    <Link to="/" className="text-slate-300 hover:text-amber-500 transition-colors">Home</Link>
                    <Link to="/login" className="text-slate-300 hover:text-white transition-colors">Login</Link>
                    <Link to="/signup" className="px-5 py-2.5 bg-amber-500 text-slate-900 rounded-full hover:bg-yellow-400 transition-all font-bold shadow-lg">
                        Get Started
                    </Link>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">About the Project</h1>
                    <p className="text-xl text-slate-400 mb-12 leading-relaxed">
                        VoiceChef AI bridges the gap between natural human interaction and modern kitchen efficiency. By leveraging the power of Retell AI, we turn simple voice conversations into structured, actionable orders.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-amber-500">Impact</h2>
                            <ul className="space-y-4 text-slate-300">
                                <li className="flex items-start">
                                    <span className="text-xl mr-2">🌍</span>
                                    <span><strong>Accessibility:</strong> Empowering those who prefer speaking over typing or navigating complex touch screens.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-xl mr-2">⚡</span>
                                    <span><strong>Efficiency:</strong> Reducing order taking time by 40% in high-pressure kitchen environments.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-xl mr-2">🚀</span>
                                    <span><strong>Automation:</strong> Zero human intervention from customer speech to kitchen display system.</span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-4 text-amber-500">Tech Stack</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <TechItem icon="⚛️" name="React + Vite" />
                                <TechItem icon="🎨" name="Tailwind CSS" />
                                <TechItem icon="⚡" name="Supabase Realtime" />
                                <TechItem icon="🎙️" name="Retell AI" />
                                <TechItem icon="💨" name="Framer Motion" />
                                <TechItem icon="🔙" name="Express / Node" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-20 pt-10 border-t border-slate-800">
                        <h2 className="text-2xl font-bold mb-8 text-white">The Developer</h2>
                        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-900/50 p-8 rounded-2xl border border-slate-800 backdrop-blur-sm">
                            <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center text-4xl font-bold text-slate-900">
                                D
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Devang Jain</h3>
                                <p className="text-amber-500 text-sm mb-4">Full Stack Developer & AI Enthusiast</p>
                                <p className="text-slate-400">
                                    Passionate about building intuitive AI-driven interfaces that solve real-world problems.
                                    Creator of VoiceChef AI, exploring the intersection of Voice AI and user experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

const TechItem = ({ icon, name }: { icon: string, name: string }) => (
    <div className="flex items-center space-x-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800 hover:border-amber-500/30 transition-colors">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium text-slate-300">{name}</span>
    </div>
);
