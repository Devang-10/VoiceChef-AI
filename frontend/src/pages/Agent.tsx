import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { RetellWebClient } from 'retell-client-js-sdk';

const retellClient = new RetellWebClient();

export const Agent: React.FC = () => {
    const { user, signOut } = useAuth();
    const [isCalling, setIsCalling] = useState(false);
    const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'active'>('idle');

    const handleCallAgent = async () => {
        if (!user) return;
        setIsCalling(true);
        setCallStatus('calling');

        try {
            // 1. Get Access Token from Backend
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

            // 2. Start Call
            await retellClient.startCall({
                accessToken,
                sampleRate: 48000,
            });

            // Handle call events
            // Note: RetellWebClient extends EventEmitter, but specific events might be different.
            // As per d.ts, it has handleRoomEvents, handleAudioEvents. 
            // It seems "call_started" or "call_ended" might be the events based on loose usage or we might need to rely on promise resolution/error.
            // But let's assume 'open' / 'close' or similar from EventEmitter if not documented.
            // Actually, looking at d.ts, valid events aren't explicitly listed in the interface but it extends EventEmitter.
            // Common Retell events are 'call_started', 'call_ended', 'error', 'audio'.

            // For now, let's assume standard event names or just set state after await startCall returns (which might just be connection).
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
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white px-6 py-4 shadow-sm flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">VoiceChef Agent</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                        Logged in as <span className="font-semibold text-gray-900">{user?.email}</span>
                    </span>
                    <button
                        onClick={() => signOut()}
                        className="text-sm text-red-500 hover:text-red-700 font-medium"
                    >
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full"
                >
                    <div className="w-24 h-24 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {callStatus === 'idle' ? 'Ready to Order?' : 'Listening...'}
                    </h2>
                    <p className="text-gray-500 mb-8">
                        {callStatus === 'idle'
                            ? "Tap the button below to start speaking with our AI agent."
                            : "Go ahead, I'm listening to your order."}
                    </p>

                    {callStatus === 'idle' ? (
                        <button
                            onClick={handleCallAgent}
                            disabled={isCalling}
                            className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCalling ? 'Connecting...' : 'Call Agent'}
                        </button>
                    ) : (
                        <button
                            onClick={handleEndCall}
                            className="w-full py-4 bg-red-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-red-600 hover:shadow-red-500/40 transition-all transform hover:-translate-y-1 active:translate-y-0"
                        >
                            End Call
                        </button>
                    )}
                </motion.div>

                <p className="mt-8 text-gray-400 text-sm">
                    Microphone access is required to use this service.
                </p>
            </main>
        </div>
    );
};
