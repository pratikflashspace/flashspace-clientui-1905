import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/services/admin.service';
import { Search, Shield, MoreVertical, Users, UserCheck, UserPlus, Download, Filter, Trash2, RotateCcw, X, Plus, Mail, Lock, ChevronDown, Building2, Headphones } from 'lucide-react';
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

interface User {
    id: string;
    fullName: string;
    email: string;
    role: "user" | "super_admin" | "admin" | "affiliate_manager" | "space_partner_manager" | "support" | "partner" | "sales" | "affiliate";
    isEmailVerified?: boolean;
    createdAt: string;
}

export default function TeamManagement() {
    const { user: currentSessionUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // default to all for Team Management
    const [viewMode, setViewMode] = useState<'active' | 'deleted'>('active');
    const [stats, setStats] = useState({ total: 0, verified: 0, newThisMonth: 0 });

    // Add User Modal State
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'admin' as "user" | "super_admin" | "admin" | "affiliate_manager" | "space_partner_manager" | "support" | "partner" | "sales" | "affiliate"
    });

    useEffect(() => {
        fetchUsers();
    }, [viewMode]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers({ deleted: viewMode === 'deleted' });
            if (response.success && response.data) {
                // Filter users to ONLY include team roles for this dashboard.
                // explicitly isolating space and affiliate partners into their own tables.
                const teamRoles = ['super_admin', 'admin', 'space_partner_manager', 'affiliate_manager', 'sales', 'support'];
                const teamMembers = (response.data.users || []).filter(u => teamRoles.includes(u.role)).map(u => ({ ...u, id: u.id || u._id }));
                setUsers(teamMembers as User[]);
                if (response.data.stats) {
                    setStats(response.data.stats);
                }
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

    const handleUpdateRole = async (user: User, newRole: string) => {
        try {
            // Send commonly required fields for PUT updates
            const payload = {
                fullName: user.fullName,
                email: user.email,
                role: newRole as "user" | "admin" | "support" | "partner" | "sales"
            };
            const response = await adminService.updateUser(user.id, payload);

            if (response.success) {
                toast.success(`User role updated to ${newRole}`);
                fetchUsers();
            } else {
                console.error("Role update failed:", response);
                toast.error(response.message || "Failed to update role: Unknown server error");
            }
        } catch (error: any) {
            console.error("Role update exception:", error);
            toast.error(error?.message || "An error occurred while updating role");
        }
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await adminService.createUser(newUser);
            if (response.success) {
                toast.success("User created successfully");
                setIsAddUserModalOpen(false);
                setNewUser({ fullName: '', email: '', password: '', role: 'user' });
                fetchUsers();
            } else {
                toast.error(response.message || "Failed to create user");
            }
        } catch (error) {
            toast.error("An error occurred while creating user");
        } finally {
            setIsSubmitting(false);
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

    // Stats are now fetched from backend to support server-side pagination
    const displayTotal = viewMode === 'active' ? stats.total : users.length;
    const verifiedUsersCount = stats.verified;
    const newUsersCount = stats.newThisMonth;

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

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'super_admin':
                return { label: 'Super Admin', className: 'bg-red-50 text-red-700 border-red-200 font-bold', icon: <Shield className="w-3 h-3" /> };
            case 'admin':
                return { label: 'Admin', className: 'bg-purple-50 text-purple-700 border-purple-200', icon: <Shield className="w-3 h-3" /> };
            case 'affiliate_manager':
                return { label: 'Affiliate Manager', className: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: <Users className="w-3 h-3" /> };
            case 'space_partner_manager':
                return { label: 'Space Partner Manager', className: 'bg-orange-50 text-orange-700 border-orange-200', icon: <Building2 className="w-3 h-3" /> };
            case 'support':
                return { label: 'Support', className: 'bg-sky-50 text-sky-700 border-sky-200', icon: <Headphones className="w-3 h-3" /> };
            case 'partner':
                return { label: 'Space Partner', className: 'bg-orange-50 text-orange-700 border-orange-200', icon: <Users className="w-3 h-3" /> };
            case 'affiliate':
                return { label: 'Affiliate Partner', className: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: <Users className="w-3 h-3" /> };
            case 'sales':
                return { label: 'Sales Team', className: 'bg-green-50 text-green-700 border-green-200', icon: <Users className="w-3 h-3" /> };
            case 'user':
            default:
                return { label: 'User', className: 'bg-blue-50 text-blue-700 border-blue-200', icon: null };
        }
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
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[Poppins]">Team Management</h1>
                    <p className="text-gray-500 mt-2 text-lg">Oversee, manage, and assign roles to internal team members.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsAddUserModalOpen(true)}
                        className="px-6 py-3 bg-gray-900 text-white border border-transparent rounded-2xl hover:bg-black transition-all shadow-lg shadow-gray-900/20 hover:shadow-xl hover:shadow-gray-900/30 hover:-translate-y-0.5 flex items-center gap-2 font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Add Team Member
                    </button>
                    {/* <button className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-semibold">
                        <Download className="w-5 h-5" />
                        Export
                    </button> */}
                    <div className="flex bg-gray-100/80 p-1.5 rounded-2xl backdrop-blur-sm">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${viewMode === 'active'
                                ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setViewMode('deleted')}
                            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${viewMode === 'deleted'
                                ? 'bg-white text-red-600 shadow-sm ring-1 ring-red-100'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
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
                            <p className="text-sm font-medium text-gray-500">{viewMode === 'active' ? 'Total Team' : 'Deleted Members'}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{displayTotal}</h3>
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
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{verifiedUsersCount}</h3>
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
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{newUsersCount}</h3>
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
                                <option value="all">All Roles</option>
                                <option value="admin">Admins</option>
                                <option value="space_partner_manager">Space Partner Managers</option>
                                <option value="affiliate_manager">Affiliate Managers</option>
                                <option value="sales">Sales Team</option>
                                <option value="support">Support</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-[800px] w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Team Member</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th> */}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => {
                                const roleBadge = getRoleBadge(user.role);
                                return (
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
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roleBadge.className}`}>
                                                {roleBadge.icon}
                                                {roleBadge.label}
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
                                        {/* <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button
                                                            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 bg-white shadow-lg border border-gray-200 z-[60]">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />

                                                        {viewMode === 'active' && (
                                                            <>
                                                                <DropdownMenuLabel className="text-xs font-normal text-gray-500 px-2 py-1.5 ml-1">Change Role To:</DropdownMenuLabel>
                                                                <DropdownMenuItem onClick={() => handleUpdateRole(user, 'admin')}>
                                                                    <Shield className="mr-2 h-4 w-4 text-purple-600" />
                                                                    <span>Admin</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdateRole(user, 'partner')}>
                                                                    <Users className="mr-2 h-4 w-4 text-orange-600" />
                                                                    <span>Partner</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdateRole(user, 'sales')}>
                                                                    <Users className="mr-2 h-4 w-4 text-green-600" />
                                                                    <span>Sales Team</span>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleUpdateRole(user, 'user')}>
                                                                    <Users className="mr-2 h-4 w-4 text-blue-600" />
                                                                    <span>Client (User)</span>
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}

                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteUser(user)}
                                                            className={viewMode === 'deleted' ? "text-blue-600 focus:text-blue-600" : "text-red-600 focus:text-red-600"}
                                                        >
                                                            {viewMode === 'deleted' ? (
                                                                <>
                                                                    <RotateCcw className="mr-2 h-4 w-4" />
                                                                    Restore User
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Move to Trash
                                                                </>
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </td> */}
                                    </tr>
                                )
                            })}

                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                {viewMode === 'deleted' ? <Trash2 className="w-6 h-6 text-gray-400" /> : <Users className="w-6 h-6 text-gray-400" />}
                                            </div>
                                            <p className="text-lg font-medium text-gray-900">
                                                {viewMode === 'deleted' ? 'Recycle bin is empty' : 'No team members found'}
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {viewMode === 'deleted' ? 'Deleted team members will appear here.' : 'Try adjusting your search or filters.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >

            {/* Add User Modal */}
            {/* Add User Modal */}
            {
                isAddUserModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-gray-100">
                            {/* Header */}
                            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Add Team Member</h2>
                                    <p className="text-sm text-gray-500 mt-1">Create a new team account and assign internal permissions.</p>
                                </div>
                                <button
                                    onClick={() => setIsAddUserModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-900 p-2 rounded-full hover:bg-white hover:shadow-md transition-all duration-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddUser} className="p-8 space-y-6">
                                <div className="space-y-4">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <div className="p-1.5 bg-gray-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-colors duration-200">
                                                    <Users className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                                                </div>
                                            </div>
                                            <input
                                                type="text"
                                                required
                                                value={newUser.fullName}
                                                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                                className="w-full pl-14 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <div className="p-1.5 bg-gray-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-colors duration-200">
                                                    <Mail className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                                                </div>
                                            </div>
                                            <input
                                                type="email"
                                                required
                                                value={newUser.email}
                                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                className="w-full pl-14 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <div className="p-1.5 bg-gray-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-colors duration-200">
                                                    <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                                                </div>
                                            </div>
                                            <input
                                                type="password"
                                                required
                                                value={newUser.password}
                                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                className="w-full pl-14 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                                placeholder="••••••••"
                                                minLength={8}
                                            />
                                        </div>
                                    </div>

                                    {/* Role */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-semibold text-gray-700 ml-1">Role & Permissions</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <div className="p-1.5 bg-gray-100 rounded-lg group-focus-within:bg-black group-focus-within:text-white transition-colors duration-200">
                                                    <Shield className="w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                                                </div>
                                            </div>
                                            <select
                                                value={newUser.role}
                                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                                className="w-full pl-14 pr-10 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-black/10 focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium text-gray-900 appearance-none cursor-pointer"
                                            >
                                                <option value="sales">Sales</option>
                                                <option value="support">Support</option>
                                                <option value="space_partner_manager">Space Partner Manager</option>
                                                <option value="affiliate_manager">Affiliate Manager</option>
                                                <option value="admin">Admin</option>
                                                {currentSessionUser?.role === 'super_admin' && (
                                                    <option value="super_admin">Super Admin</option>
                                                )}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 ml-1">Select the access level for this user.</p>
                                    </div>
                                </div>

                                <div className="pt-6 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddUserModalOpen(false)}
                                        className="flex-1 px-6 py-3.5 bg-gray-50 text-gray-700 rounded-2xl hover:bg-gray-100 font-semibold transition-all duration-200 border border-transparent hover:border-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3.5 bg-black text-white rounded-2xl hover:bg-gray-800 font-semibold transition-all duration-200 shadow-lg shadow-black/20 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>Creating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5" />
                                                <span>Create User</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
