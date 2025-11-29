import { authService } from '../services/auth';

export default function Layout({ children }) {
    const handleLogout = () => {
        authService.logout();
    };

    return (
        <div className="min-h-screen bg-gray-950">
            {/* Navigation */}
            <nav className="glass border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold gradient-text">WAKA AI</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>
        </div>
    );
}
