import React from 'react';
import { Client } from '@/types/client.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, MapPin, Briefcase, Calendar, DollarSign, CheckCircle } from 'lucide-react';

interface OverviewTabProps {
    client: Client;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ client }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-500" />
                        Client Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Name</span>
                        <span className="font-medium">{client.name}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Company</span>
                        <span className="font-medium">{client.companyName}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-2"><Mail className="h-4 w-4" /> Email</span>
                        <span className="font-medium">{client.email}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-2"><Phone className="h-4 w-4" /> Phone</span>
                        <span className="font-medium">{client.phone}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                        <span className="text-gray-500 flex items-center gap-2"><MapPin className="h-4 w-4" /> Location</span>
                        <span className="font-medium">{client.location}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-green-500" />
                        Deal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Product Type</span>
                        <span className="font-medium">{client.productType}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500">Deal Type</span>
                        <span className="font-medium">{client.dealType}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-2"><DollarSign className="h-4 w-4" /> Deal Value</span>
                        <span className="font-medium">${client.dealValue}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-500 flex items-center gap-2"><Calendar className="h-4 w-4" /> Date Closed</span>
                        <span className="font-medium">{new Date(client.dateClosed).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between pb-2">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-medium px-2 py-0.5 rounded-full text-sm ${client.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {client.status}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-purple-500" />
                        Assignment
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-full">
                            <User className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Assigned Sales Person</p>
                            <p className="font-semibold text-lg">{client.assignedSalesPerson}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default OverviewTab;
