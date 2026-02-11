import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Check, MessageSquare, Eye } from "lucide-react";
import { toast } from "sonner";

// Mock Data
const MOCK_REQUESTS = [
    {
        id: "REQ001",
        user: {
            name: "Sarah Johnson",
            email: "sarah@techflow.com",
            avatar: "SJ"
        },
        space: "Private Cabin - Suite 101",
        type: "office",
        date: "Oct 24, 2023",
        kycStatus: "verified",
        status: "pending",
    },
    {
        id: "REQ002",
        user: {
            name: "Michael Chen",
            email: "michael@startup.io",
            avatar: "MC"
        },
        space: "Hot Desk - Monthly",
        type: "coworking",
        date: "Oct 25, 2023",
        kycStatus: "pending",
        status: "pending",
    },
    {
        id: "REQ003",
        user: {
            name: "Jessica Williams",
            email: "jessica@freelance.net",
            avatar: "JW"
        },
        space: "Meeting Room B (4 Hours)",
        type: "meeting_room",
        date: "Oct 26, 2023",
        kycStatus: "verified",
        status: "pending",
    },
    {
        id: "REQ004",
        user: {
            name: "David Kim",
            email: "david@innovation.co",
            avatar: "DK"
        },
        space: "Dedicated Desk - Seat 14",
        type: "coworking",
        date: "Oct 26, 2023",
        kycStatus: "rejected",
        status: "pending",
    }
];

export default function ActiveRequests() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);

    const handleAccept = (id: string) => {
        toast.success("Request accepted successfully");
        setRequests(prev => prev.filter(req => req.id !== id));
    };

    const handleInform = (id: string) => {
        toast.info("Notification sent to user for more information");
    };

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-semibold text-slate-900">
                            Pending Requests
                        </h3>
                        <p className="text-sm text-slate-500">
                            Manage incoming booking requests and KYC verifications
                        </p>
                    </div>
                    <Badge variant="secondary" className="bg-white">
                        {requests.length} Pending
                    </Badge>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[250px]">User Details</TableHead>
                            <TableHead>Space Requested</TableHead>
                            <TableHead>Request Date</TableHead>
                            <TableHead>KYC Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {requests.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                                    No pending requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((req) => (
                                <TableRow key={req.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                                                {req.user.avatar}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{req.user.name}</div>
                                                <div className="text-xs text-slate-500">{req.user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700">{req.space}</span>
                                            <span className="text-xs capitalize text-slate-500">{req.type.replace('_', ' ')}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{req.date}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {req.kycStatus === 'verified' && (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Verified</Badge>
                                            )}
                                            {req.kycStatus === 'pending' && (
                                                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">Pending</Badge>
                                            )}
                                            {req.kycStatus === 'rejected' && (
                                                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none">Rejected</Badge>
                                            )}
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600" title="View Documents">
                                                <Eye className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                                                onClick={() => handleInform(req.id)}
                                            >
                                                <MessageSquare className="mr-2 h-3.5 w-3.5" />
                                                Inform
                                            </Button>
                                            <Button
                                                size="sm"
                                                className="h-8 bg-[#3FA69E] hover:bg-[#348b84] text-white"
                                                onClick={() => handleAccept(req.id)}
                                            >
                                                <Check className="mr-2 h-3.5 w-3.5" />
                                                Accept
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
