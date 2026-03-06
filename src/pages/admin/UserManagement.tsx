import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Shield, MoreVertical, Users, UserCheck, UserPlus, Download, Filter, Trash2, RotateCcw, X, Plus, Mail, Lock, ChevronDown, RefreshCw, TrendingUp } from 'lucide-react';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { StatsCard } from '@/components/dashboard/StatsCard';

interface User {
    id: string;
    fullName: string;
    email: string;
    role: "user" | "admin" | "support" | "partner" | "sales" | "affiliate" | "super_admin";
    isEmailVerified?: boolean;
    createdAt: string;
}

export default function UserManagement() {
    const { user: currentSessionUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [viewMode, setViewMode] = useState<'active' | 'deleted'>('active');
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [stats, setStats] = useState({ total: 0, verified: 0, newThisMonth: 0 });

    // Add User Modal State
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'user' as "user" | "admin" | "support" | "partner" | "sales" | "super_admin"
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(1);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, filter, viewMode]);

    const fetchUsers = async (page = pagination.page) => {
        setLoading(true);
        try {
            const response = await adminService.getAllUsers({
                deleted: viewMode === 'deleted',
                search: searchTerm,
                role: filter,
                page: page,
                limit: 10
            });
            if (response.success && response.data) {
                const mappedUsers = (response.data.users || []).map(u => ({
                    ...u,
                    id: u.id || u._id
                }));
                setUsers(mappedUsers as User[]);
                setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });
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

                // console.log("Delete user response:", response);

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
                role: newRole as any
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

    const filteredUsers = users; // Server-side filtering now

    // Stats are now fetched from backend to support server-side pagination
    const displayTotal = viewMode === 'active' ? stats.total : pagination.total;
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
            case 'partner':
                return { label: 'Space Partner', className: 'bg-orange-50 text-orange-700 border-orange-200', icon: <Users className="w-3 h-3" /> };
            case 'affiliate':
                return { label: 'Affiliate Partner', className: 'bg-cyan-50 text-cyan-700 border-cyan-200', icon: <Users className="w-3 h-3" /> };
            case 'sales':
                return { label: 'Sales Team', className: 'bg-green-50 text-green-700 border-green-200', icon: <Users className="w-3 h-3" /> };
            case 'user':
            default:
                return { label: 'Client', className: 'bg-blue-50 text-blue-700 border-blue-200', icon: null };
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
        <div className="p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {/* Header Tier */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                        User <span className="text-primary italic">Management</span>
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Control and monitor platform identity verification and authorization levels.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => fetchUsers(pagination.page)} className="rounded-xl h-11">
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={() => setIsAddUserModalOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                    </Button>
                </div>
            </div>

            {/* Stats Tier */}
            <div className="grid gap-6 md:grid-cols-4 mb-8">
                <StatsCard title={viewMode === 'active' ? 'Active Users' : 'Archived Accounts'} value={displayTotal.toLocaleString()} icon={Users} />
                <StatsCard title="Verified Identities" value={verifiedUsersCount.toLocaleString()} icon={UserCheck} />
                <StatsCard title="New This Month" value={newUsersCount.toLocaleString()} icon={UserPlus} />
                <StatsCard title="Context View" value={filter === 'all' ? '100%' : getRoleBadge(filter).label} icon={Shield} />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
                <div className="relative flex-1 max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users by name, email or ID..."
                        className="pl-11 h-12 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex bg-muted/50 p-1 rounded-xl border border-border">
                    <button
                        onClick={() => setViewMode('active')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'active'
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setViewMode('deleted')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'deleted'
                            ? 'bg-background text-destructive shadow-sm'
                            : 'text-muted-foreground hover:text-destructive'
                            }`}
                    >
                        Archived
                    </button>
                </div>
            </div>

            <Tabs value={filter} onValueChange={setFilter} className="space-y-6">
                <TabsList className="bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 gap-8">
                    <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        All Users
                    </TabsTrigger>
                    <TabsTrigger value="user" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        Clients
                    </TabsTrigger>
                    <TabsTrigger value="partner" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        Space Partners
                    </TabsTrigger>
                    <TabsTrigger value="affiliate" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        Affiliates
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 pb-3 font-semibold text-muted-foreground data-[state=active]:text-foreground">
                        Admins
                    </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="mt-0">

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-muted/50 border-b border-border text-xs font-semibold text-foreground uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">User</th>
                                    <th className="p-4">Authorization</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Joined</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredUsers.map((user) => {
                                    const roleBadge = getRoleBadge(user.role);
                                    return (
                                        <tr key={user.id} className="hover:bg-muted/30 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="w-10 h-10 border border-border shadow-sm">
                                                        <AvatarFallback className={`bg-gradient-to-br ${getRandomGradient(user.fullName)} text-white font-bold`}>
                                                            {getInitials(user.fullName)}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-bold text-foreground text-sm leading-tight">{user.fullName}</p>
                                                        <p className="text-xs text-muted-foreground">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {viewMode === 'active' ? (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border transition-all hover:shadow-sm ${roleBadge.className}`}>
                                                                <div className="flex items-center gap-2">
                                                                    {roleBadge.icon}
                                                                    {roleBadge.label}
                                                                </div>
                                                                <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="start" className="w-56 bg-background shadow-2xl border border-border rounded-xl p-2 z-[60]">
                                                            <DropdownMenuLabel className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-3 py-2">Set Authorization</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleUpdateRole(user, 'user')} className="rounded-lg">Client / Customer</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleUpdateRole(user, 'partner')} className="rounded-lg text-orange-600">Space Partner</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleUpdateRole(user, 'affiliate')} className="rounded-lg text-cyan-600">Affiliate Partner</DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleUpdateRole(user, 'admin')} className="rounded-lg text-purple-600">System Admin</DropdownMenuItem>
                                                            {currentSessionUser?.role === 'super_admin' && (
                                                                <DropdownMenuItem onClick={() => handleUpdateRole(user, 'super_admin')} className="rounded-lg text-red-600 font-bold">Super Admin</DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold border ${roleBadge.className}`}>
                                                        {roleBadge.icon}
                                                        {roleBadge.label}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {viewMode === 'deleted' ? (
                                                    <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/10">Terminated</Badge>
                                                ) : user.isEmailVerified ? (
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50">Verified</Badge>
                                                ) : (
                                                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50">Pending</Badge>
                                                )}
                                            </td>
                                            <td className="p-4 text-xs text-muted-foreground font-medium">
                                                {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </td>
                                            <td className="p-4 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="w-8 h-8 p-0 rounded-lg">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="rounded-xl">
                                                        {viewMode === 'deleted' ? (
                                                            <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-emerald-600">Reactivate Account</DropdownMenuItem>
                                                        ) : (
                                                            <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-destructive">Archive User</DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredUsers.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                            <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
                                            <p className="font-medium">No results matched current parameters</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Pagination */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center bg-background p-6 rounded-2xl border border-border shadow-sm gap-6">
                <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
                    <span className="px-3 py-1 bg-muted rounded-lg text-foreground">
                        Page {pagination.page} of {pagination.pages}
                    </span>
                    <span className="hidden sm:inline opacity-30">|</span>
                    <span className="text-primary">
                        {pagination.total.toLocaleString()} Total Users Found
                    </span>
                </div>
                <div className="flex gap-3">
                    <Button
                        disabled={pagination.page <= 1}
                        onClick={() => fetchUsers(pagination.page - 1)}
                        variant="outline"
                        className="rounded-xl px-6 h-11 font-bold border-border hover:bg-muted transition-all active:scale-95 disabled:opacity-30"
                    >
                        Previous
                    </Button>
                    <Button
                        disabled={pagination.page >= pagination.pages}
                        onClick={() => fetchUsers(pagination.page + 1)}
                        className="rounded-xl px-6 h-11 font-bold bg-foreground text-background hover:bg-foreground/90 transition-all active:scale-95 disabled:opacity-30"
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* Add User Modal */}
            {isAddUserModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-background rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 border border-border">
                        {/* Header */}
                        <div className="p-8 border-b border-border flex justify-between items-center bg-muted/20">
                            <div>
                                <h2 className="text-2xl font-black text-foreground tracking-tight">
                                    New Account <span className="text-primary italic">Provisioning</span>
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2 font-medium">Create a new access account and define system permissions.</p>
                            </div>
                            <Button
                                variant="ghost"
                                onClick={() => setIsAddUserModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-all duration-200"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        <form onSubmit={handleAddUser} className="p-8 space-y-6">
                            <div className="space-y-6">
                                {/* Full Name */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-1">Account Holder Full Name</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Users className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={newUser.fullName}
                                            onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground shadow-none placeholder:text-muted-foreground/50 placeholder:font-normal"
                                            placeholder="e.g. Alexander Pierce"
                                        />
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-1">Email Identification</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground shadow-none placeholder:text-muted-foreground/50 placeholder:font-normal"
                                            placeholder="security@flashspace.com"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-1">Secure Passkey</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground shadow-none placeholder:text-muted-foreground/50 placeholder:font-normal"
                                            placeholder="Minimum 8 characters"
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                {/* Role Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground ml-1">Access Authorization Level</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Shield className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                        </div>
                                        <select
                                            required
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                            className="w-full pl-12 pr-10 py-4 bg-muted/30 border border-border rounded-xl focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold text-foreground appearance-none cursor-pointer group-hover:bg-muted/50"
                                        >
                                            <option value="user">Platform Client</option>
                                            <option value="partner">Space Management Partner</option>
                                            <option value="affiliate">Affiliate Marketing Partner</option>
                                            <option value="admin">System Administrator</option>
                                            {currentSessionUser?.role === 'super_admin' && (
                                                <option value="super_admin">Tier 1 Super Admin</option>
                                            )}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsAddUserModalOpen(false)}
                                    className="flex-1 h-14 bg-background border-border text-foreground rounded-xl hover:bg-muted font-bold transition-all"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 h-14 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 font-black transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Provision Account
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
