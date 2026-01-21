import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Search, Calendar, User, Building2, CreditCard, DollarSign, Clock, Filter, TrendingUp, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
    bookingNumber: string;
    user: {
        fullName: string;
        email: string;
    };
    type: string;
    spaceSnapshot?: {
        name?: string;
        city?: string;
        address?: string;
    };
    plan: {
        name: string;
        price: number;
        tenure: number;
        tenureUnit?: string;
    };
    status: string;
    createdAt: string;
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllBookings();
            if (response.success && response.data) {
                setBookings(response.data.bookings || []);
            }
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            toast.error('Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.spaceSnapshot?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || booking.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    // Calculate stats
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.plan?.price || 0), 0);
    const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'pending_kyc').length;

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
            active: { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' },
            pending_kyc: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending KYC' },
            pending_payment: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Pending Payment' },
            expired: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Expired' },
            cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' },
        };

        const config = statusConfig[status] || statusConfig.pending_payment;
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
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
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[Poppins]">Bookings & Payments</h1>
                <p className="text-gray-500 mt-2 text-lg">Track all bookings and financial transactions</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{bookings.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Package className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Active Bookings</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">{activeBookings}</h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-2">₹{totalRevenue.toLocaleString()}</h3>
                        </div>
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <DollarSign className="w-6 h-6" />
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
                            placeholder="Search by user, space, or booking number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-black/5 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="pl-10 pr-8 py-2.5 bg-gray-50 border-none rounded-xl text-sm font-medium text-gray-700 focus:ring-2 focus:ring-black/5 cursor-pointer hover:bg-gray-100 transition-colors appearance-none"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="pending_kyc">Pending KYC</option>
                                <option value="pending_payment">Pending Payment</option>
                                <option value="expired">Expired</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-[1000px] w-full text-left">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Booking #</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Space Details</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan & Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredBookings.map((booking) => (
                                <tr key={booking.bookingNumber} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm font-semibold text-gray-900">
                                            #{booking.bookingNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                {booking.user?.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{booking.user?.fullName || 'Unknown'}</p>
                                                <p className="text-sm text-gray-500">{booking.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                                <Building2 className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{booking.spaceSnapshot?.name || 'N/A'}</p>
                                                <p className="text-sm text-gray-500">{booking.spaceSnapshot?.city || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-bold text-gray-900">₹{booking.plan?.price?.toLocaleString() || 0}</p>
                                            <p className="text-sm text-gray-500">
                                                {booking.plan?.name} • {booking.plan?.tenure} {booking.plan?.tenureUnit || 'months'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {new Date(booking.createdAt).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredBookings.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                                <Package className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-900">No bookings found</p>
                                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters.</p>
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
