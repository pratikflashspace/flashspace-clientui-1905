import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, User, CheckCircle2, Package, Clock, LogIn, Loader2, MapPin, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Button } from "../../components/ui/button";
import axios from 'axios';
import { toast } from 'sonner';
import LogMailModal from '../../components/SpacePartner/LogMailModal';
import LogVisitModal from '../../components/SpacePartner/LogVisitModal';

interface MailRecord {
    _id: string;
    client: string;
    sender: string;
    type: string;
    space: string;
    received: string;
    status: 'Pending Action' | 'Forwarded' | 'Collected';
    createdAt: string;
}

interface VisitRecord {
    _id: string;
    client: string;
    visitor: string;
    purpose: string;
    space: string;
    date: string;
    status: 'Pending' | 'Completed';
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

const MailAndVisits = () => {
    const [activeTab, setActiveTab] = useState<'mail' | 'visits'>('mail');
    const [mailRecords, setMailRecords] = useState<MailRecord[]>([]);
    const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLogMailModalOpen, setIsLogMailModalOpen] = useState(false);
    const [isLogVisitModalOpen, setIsLogVisitModalOpen] = useState(false);

    const fetchMails = async () => {
        try {
            const response = await axios.get<ApiResponse<MailRecord[]>>(`${import.meta.env.VITE_API_URL}/api/mail`);
            if (response.data.success) {
                const sortedData = response.data.data.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setMailRecords(sortedData);
            }
        } catch (error) {
            console.error('Failed to fetch mails', error);
            toast.error('Failed to fetch mail records');
        }
    };

    const fetchVisits = async () => {
        try {
            const response = await axios.get<ApiResponse<VisitRecord[]>>(`${import.meta.env.VITE_API_URL}/api/visit`);
            if (response.data.success) {
                const sortedData = response.data.data.sort((a, b) => {
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                });
                setVisitRecords(sortedData);
            }
        } catch (error) {
            console.error('Failed to fetch visits', error);
            toast.error('Failed to fetch visit records');
        }
    };

    const fetchData = async () => {
        setLoading(true);
        await Promise.all([fetchMails(), fetchVisits()]);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const stats = [
        {
            icon: Package,
            value: mailRecords.filter(m => m.status === 'Pending Action').length,
            label: 'Pending Mail',
            color: 'text-yellow-600',
            bg: 'bg-yellow-50',
        },
        {
            icon: Mail,
            value: mailRecords.filter(m => m.status === 'Forwarded').length,
            label: 'Forwarded Total',
            color: 'text-blue-600',
            bg: 'bg-blue-50',
        },
        {
            icon: User,
            value: visitRecords.length,
            label: 'Visits This Month',
            color: 'text-green-600',
            bg: 'bg-green-50',
        },
        {
            icon: CheckCircle2,
            value: mailRecords.length,
            label: 'Total Handled',
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
        },
    ];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending Action':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Forwarded':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Collected':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getVisitStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Completed':
                return 'bg-green-100 text-green-700 border-green-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const handleUpdate = async (id: string, nextStatus: string) => {
        try {
            const response = await axios.patch<ApiResponse<unknown>>(`${import.meta.env.VITE_API_URL}/api/mail/${id}/status`, {
                status: nextStatus
            });

            if (response.data.success) {
                setMailRecords(prev => {
                    const updatedRecords = prev.map(record =>
                        record._id === id ? { ...record, status: nextStatus as any } : record
                    );
                    // Re-sort the records after updating a status to maintain order
                    return updatedRecords.sort((a, b) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });
                });
                toast.success(`Status updated to ${nextStatus}`);
            }
        } catch (error) {
            console.error('Failed to update status', error);
            toast.error('Failed to update status');
        }
    };

    const handleVisitUpdate = async (id: string, nextStatus: string) => {
        try {
            const response = await axios.patch<ApiResponse<unknown>>(`${import.meta.env.VITE_API_URL}/api/visit/${id}/status`, {
                status: nextStatus
            });

            if (response.data.success) {
                setVisitRecords(prev => {
                    const updatedRecords = prev.map(record =>
                        record._id === id ? { ...record, status: nextStatus as any } : record
                    );
                    return updatedRecords.sort((a, b) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });
                });
                toast.success(`Visit status updated to ${nextStatus}`);
            }
        } catch (error) {
            console.error('Failed to update visit status', error);
            toast.error('Failed to update visit status');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight font-[Poppins]">
                            Mail & <span className="text-teal-600">Visits</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 text-lg">Track mail and visits for all your clients</p>
                </div>
                <button
                    onClick={() => activeTab === 'mail' ? setIsLogMailModalOpen(true) : setIsLogVisitModalOpen(true)}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                    <LogIn className="w-5 h-5" />
                    {activeTab === 'mail' ? 'Log New Mail' : 'Log New Visit'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-4 my-5">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center gap-5"
                    >
                        <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>


            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200 mb-8">
                <button
                    onClick={() => setActiveTab('mail')}
                    className={`pb-4 px-2 text-base font-semibold transition-all relative ${activeTab === 'mail'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Mail Records
                    {activeTab === 'mail' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('visits')}
                    className={`pb-4 px-2 text-base font-semibold transition-all relative ${activeTab === 'visits'
                        ? 'text-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Visit Records
                    {activeTab === 'visits' && (
                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-t-full" />
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
                {activeTab === 'mail' ? (
                    loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                        </div>
                    ) : mailRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <Mail className="w-12 h-12 mb-2 opacity-20" />
                            <p>No mail records found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Client</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Sender</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Type</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Space</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Received</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {mailRecords.map((record, index) => (
                                        <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5 font-semibold text-slate-900 text-sm whitespace-nowrap">
                                                {`#${record._id.slice(-6).toUpperCase()}`}
                                            </td>
                                            <td className="px-6 py-5 text-sm font-medium text-slate-900">{record.client}</td>
                                            <td className="px-6 py-5 text-sm text-slate-600">{record.sender}</td>
                                            <td className="px-6 py-5 text-sm text-slate-600">{record.type}</td>
                                            <td className="px-6 py-5 text-sm text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-slate-400" />
                                                    {record.space}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-sm text-slate-500">{formatDate(record.createdAt)}</td>
                                            <td className="px-6 py-5 text-sm">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${getStatusStyle(record.status)}`}>
                                                    {record.status === 'Pending Action' && <Clock className="w-3 h-3" />}
                                                    {record.status === 'Collected' && <CheckCircle2 className="w-3 h-3" />}
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900">
                                                            <span className="sr-only">Open menu</span>
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-white z-[1000]">
                                                        <DropdownMenuItem
                                                            onClick={() => handleUpdate(record._id, 'Pending Action')}
                                                            disabled={record.status === 'Pending Action'}
                                                        >
                                                            Pending Action
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleUpdate(record._id, 'Forwarded')}
                                                            disabled={record.status === 'Forwarded'}
                                                        >
                                                            Forwarded
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleUpdate(record._id, 'Collected')}
                                                            disabled={record.status === 'Collected'}
                                                        >
                                                            Collected
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    // Visits Table
                    activeTab === 'visits' ? (
                        loading ? (
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
                            </div>
                        ) : visitRecords.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                                <User className="w-12 h-12 mb-2 opacity-20" />
                                <p>No visit records found</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Client</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Visitor</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Purpose</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Space</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date & Time</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {visitRecords.map((record) => (
                                            <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-5 font-semibold text-slate-900 text-sm whitespace-nowrap">
                                                    {`#${record._id.slice(-6).toUpperCase()}`}
                                                </td>
                                                <td className="px-6 py-5 text-sm font-medium text-slate-900">{record.client}</td>
                                                <td className="px-6 py-5 text-sm text-slate-600">{record.visitor}</td>
                                                <td className="px-6 py-5 text-sm text-slate-600">{record.purpose}</td>
                                                <td className="px-6 py-5 text-sm text-slate-500">
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="w-4 h-4 text-slate-400" />
                                                        {record.space}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-sm text-slate-500">{formatDate(record.date)}</td>
                                                <td className="px-6 py-5 text-sm">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 w-fit ${getVisitStatusStyle(record.status)}`}>
                                                        {record.status === 'Pending' && <Clock className="w-3 h-3" />}
                                                        {record.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900">
                                                                <span className="sr-only">Open menu</span>
                                                                <ChevronDown className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="bg-white z-[1000]">
                                                            <DropdownMenuItem
                                                                onClick={() => handleVisitUpdate(record._id, 'Pending')}
                                                                disabled={record.status === 'Pending'}
                                                            >
                                                                Pending
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleVisitUpdate(record._id, 'Completed')}
                                                                disabled={record.status === 'Completed'}
                                                            >
                                                                Completed
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ) : null
                )}
            </div>

            <LogMailModal
                isOpen={isLogMailModalOpen}
                onClose={() => setIsLogMailModalOpen(false)}
                onSuccess={fetchMails}
            />
            <LogVisitModal
                isOpen={isLogVisitModalOpen}
                onClose={() => setIsLogVisitModalOpen(false)}
                onSuccess={fetchVisits}
            />
        </div>
    );
};

export default MailAndVisits;
