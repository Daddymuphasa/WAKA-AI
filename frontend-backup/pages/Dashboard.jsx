import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await authService.getProfile();
                setUser(profile);
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-pulse text-primary-400 text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="glass rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                    Welcome back, {user?.name || 'User'}! 👋
                </h1>
                <p className="text-gray-400">
                    You're now connected to Africa's premier AI-powered social platform.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Posts</p>
                            <p className="text-3xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-primary-400 text-2xl">📝</span>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Connections</p>
                            <p className="text-3xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-accent-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-accent-400 text-2xl">👥</span>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">AI Insights</p>
                            <p className="text-3xl font-bold text-white mt-1">0</p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-green-400 text-2xl">🤖</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button className="p-4 bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg transition text-left">
                        <p className="font-semibold text-white">Create New Post</p>
                        <p className="text-sm text-gray-400 mt-1">Share your thoughts with the community</p>
                    </button>

                    <button className="p-4 bg-accent-500/10 hover:bg-accent-500/20 border border-accent-500/30 rounded-lg transition text-left">
                        <p className="font-semibold text-white">AI Assistant</p>
                        <p className="text-sm text-gray-400 mt-1">Get personalized content recommendations</p>
                    </button>
                </div>
            </div>

            {/* 0G Integration Status */}
            <div className="glass rounded-2xl p-8 border-2 border-primary-500/30">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-primary-400 text-xl">⛓️</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">0G Integration</h2>
                        <p className="text-sm text-gray-400">Decentralized storage & compute</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <p className="text-gray-300 text-sm">Connected to 0G Network</p>
                </div>
            </div>
        </div>
    );
}
