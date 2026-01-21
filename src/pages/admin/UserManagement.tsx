import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Search, Shield, MoreVertical, Users, UserCheck, UserPlus, Download, Filter, Trash2, RotateCcw } from 'lucide-react';
import { toast } from "sonner";

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
    createdAt: string;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'active' | 'deleted'>('active');

    useEffect(() => {
        fetchUsers();
    }, [viewMode]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers({ deleted: viewMode === 'deleted' });
            if (response.success && response.data) {
                setUsers(response.data.users || []);
            } else {
                setUsers([]);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (user: User) => {
        const isTrashView = viewMode === 'deleted';
        const action = isTrashView ? "restore" : "move this user to trash";

        if (confirm(`Are you sure you want to ${action} ${user.fullName}?`)) {
            try {
                const response = await adminService.deleteUser(user.id, isTrashView);

                console.log("Delete user response:", response);

                if (response.success) {
                    toast.success(response.message || (isTrashView ? "User restored successfully" : "User moved to trash"));
                    fetchUsers();
                } else {
                    console.error("API returned error:", response);
                    toast.error(response.message || "Failed to update user");
                }
            } catch (error: any) {
                console.error("Caught error:", error);
                toast.error("An unexpected error occurred");
            }
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ? true :
            filter === 'verified' ? user.isEmailVerified :
                filter === 'unverified' ? !user.isEmailVerified :
                    user.role === filter;
        return matchesSearch && matchesFilter;
    });

    const totalUsers = users.length;
    const verifiedUsers = users.filter(u => u.isEmailVerified).length;
    const newUsers = users.filter(u => {
        const date = new Date(u.createdAt);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getRandomGradient = (name: string) => {
        const gradients = [
            'from-pink-500 to-rose-500',
            'from-purple-500 to-indigo-500',
            'from-blue-500 to-cyan-500',
            'from-emerald-500 to-teal-500',
            'from-orange-500 to-amber-500'
        ];
        const index = name.length % gradients.length;
        return gradients[index];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[Poppins]">User Management</h1>
                    <p className="text-gray-500 mt-2 text-lg">Oversee, manage, and analyze user base.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow flex items-center gap-2 font-medium">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'active'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setViewMode('deleted')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${viewMode === 'deleted'
                                ? 'bg-white text-red-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Trash2 className="w-4 h-4" />
                            Bin
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{viewMode === 'active' ? 'Total Users' : 'Deleted Users'}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Verified</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{verifiedUsers}</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <UserCheck className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">New This Month</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{newUsers}</h3>
                        </div>
                        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                            <UserPlus className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">

                {/* Toolbar */}
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="pl-10 pr-8 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-black/5 cursor-pointer hover:bg-gray-100 transition-colors appearance-none"
                            >
                                <option value="all">All Users</option>
                                <option value="verified">Verified</option>
                                <option value="unverified">Unverified</option>
                                <option value="admin">Admins</option>
                                <option value="user">Clients</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-[800px] w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User Profile</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className={`group hover:bg-gray-50 transition-colors duration-200 ${viewMode === 'deleted' ? 'opacity-70 grayscale-[0.3]' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRandomGradient(user.fullName)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                                {getInitials(user.fullName)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{user.fullName}</p>
                                                <p className="text-sm text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                            }`}>
                                            {user.role === 'admin' && <Shield className="w-3 h-3" />}
                                            {user.role === 'user' ? 'Client' : 'Admin'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {viewMode === 'deleted' ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                                <span className="text-sm font-medium text-red-600">Deleted</span>
                                            </div>
                                        ) : user.isEmailVerified ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                <span className="text-sm font-medium text-gray-700">Verified</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                                <span className="text-sm font-medium text-gray-700">Pending</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 font-medium">
                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-right">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${viewMode === 'deleted'
                                                        ? 'text-blue-600 hover:bg-blue-50 bg-blue-50/50'
                                                        : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                        }`}
                                                    title={viewMode === 'deleted' ? "Restore User" : "Move to Trash"}
                                                >
                                                    {viewMode === 'deleted' ? <RotateCcw className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                {viewMode === 'deleted' ? <Trash2 className="w-6 h-6 text-gray-400" /> : <Users className="w-6 h-6 text-gray-400" />}
                                            </div>
                                            <p className="text-lg font-medium text-gray-900">
                                                {viewMode === 'deleted' ? 'Recycle bin is empty' : 'No users found'}
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {viewMode === 'deleted' ? 'Deleted users will appear here.' : 'Try adjusting your search or filters.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
