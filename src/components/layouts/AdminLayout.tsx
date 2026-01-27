import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    Building2,
    FileCheck,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    Search
} from 'lucide-react';

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const allNavItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', roles: ['admin', 'partner', 'space_manager', 'sales'] },
        { icon: Users, label: 'User Management', path: '/admin/users', roles: ['admin'] },
        { icon: FileCheck, label: 'KYC Verification', path: '/admin/kyc-requests', roles: ['admin', 'partner', 'space_manager'] },
        // Partner can manage their own spaces, Admin all. Space Manager operates but typically doesn't "Manage listing details" deeply, but let's allow read access or limited edit.
        { icon: Building2, label: 'Space Management', path: '/admin/spaces', roles: ['admin', 'partner', 'space_manager'] },
        { icon: CreditCard, label: 'Bookings & Payments', path: '/admin/bookings', roles: ['admin', 'partner', 'space_manager', 'sales'] },
        { icon: Settings, label: 'Settings', path: '/admin/settings', roles: ['admin', 'partner'] },
    ];

    const navItems = allNavItems.filter(item => user?.role && item.roles.includes(user.role));

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 bg-black text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                    } hidden md:flex flex-col`}
            >
                <div className="h-16 flex items-center px-6 border-b border-white/10">
                    <div className="flex items-center gap-2 text-xl font-bold font-[Poppins]">
                        <span className="text-yellow-400 text-3xl">.</span>
                        {isSidebarOpen && <span>FlashSpace</span>}
                    </div>
                </div>

                <nav className="flex-1 py-6 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5 flex-shrink-0" />
                            {isSidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-3 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors ${!isSidebarOpen ? 'justify-center' : ''
                            }`}
                    >
                        <LogOut className="w-5 h-5" />
                        {isSidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsMobileOpen(false)}
                    />

                    {/* Sidebar Panel */}
                    <aside className="fixed inset-y-0 left-0 w-64 bg-black text-white flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
                        {/* Header */}
                        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                            <div className="flex items-center gap-2 text-xl font-bold font-[Poppins]">
                                <span className="text-yellow-400 text-3xl">.</span>
                                <span>FlashSpace</span>
                            </div>
                            <button onClick={() => setIsMobileOpen(false)} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Nav Links */}
                        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileOpen(false)}
                                    end={item.path === '/admin'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`
                                    }
                                >
                                    <item.icon className="w-5 h-5 flex-shrink-0" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            ))}
                        </nav>

                        {/* Logout */}
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-3 py-3 w-full rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-20'
                }`}>
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hidden md:block"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <button
                            className="md:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                            onClick={() => setIsMobileOpen(true)}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-transparent border-none focus:outline-none text-sm w-48"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-semibold text-gray-900">{user?.fullName}</p>
                                <p className="text-xs text-gray-500 uppercase">{user?.role}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                                {user?.profilePicture ? (
                                    <img src={user.profilePicture} alt={user.fullName} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="font-bold text-yellow-600">{user?.fullName?.charAt(0)}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
