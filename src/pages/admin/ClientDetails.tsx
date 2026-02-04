import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Client } from '@/types/client.types';
import { ArrowLeft, Loader2 } from 'lucide-react';

import OverviewTab from './client-tabs/OverviewTab';
import ActivityTab from './client-tabs/ActivityTab';
import OrdersTab from './client-tabs/OrdersTab';
import QueriesTab from './client-tabs/QueriesTab';
import NotesTab from './client-tabs/NotesTab';

const ClientDetails = () => {
    const { id: clientId } = useParams();
    const navigate = useNavigate();

    // Mock data for fallback (shared with Clients.tsx)
    const mockClients: Client[] = [
        {
            id: '1',
            name: 'John Doe',
            companyName: 'Tech Innovators',
            email: 'john@techinnovators.com',
            phone: '+1 555-0123',
            location: 'New York',
            assignedSalesPerson: 'Sales User',
            productType: 'Virtual Office',
            dealType: 'Yearly',
            dealValue: 1200,
            status: 'Active',
            lastActivity: '2023-10-25T10:00:00Z',
            dateClosed: '2023-10-01T09:00:00Z'
        },
        {
            id: '2',
            name: 'Jane Smith',
            companyName: 'Creative Solutions',
            email: 'jane@creatives.com',
            phone: '+1 555-0124',
            location: 'London',
            assignedSalesPerson: 'Sales User',
            productType: 'Coworking',
            dealType: 'Monthly',
            dealValue: 300,
            status: 'Closed',
            lastActivity: '2023-10-24T14:30:00Z',
            dateClosed: '2023-09-15T10:00:00Z'
        },
        {
            id: '3',
            name: 'Bob Brown',
            companyName: 'StartUp Inc',
            email: 'bob@startup.com',
            phone: '+1 555-0125',
            location: 'San Francisco',
            assignedSalesPerson: 'Sales User',
            productType: 'Meeting Room',
            dealType: 'Monthly',
            dealValue: 150,
            status: 'In Progress',
            lastActivity: '2023-10-26T09:15:00Z',
            dateClosed: '2023-10-20T11:00:00Z'
        }
    ];

    const { data: response, isLoading, error } = useQuery({
        queryKey: ['client-details', clientId],
        queryFn: async () => {
            try {
                const res = await adminService.getClientDetails(clientId!);
                return res;
            } catch (err) {
                // Fallback to mock data if API fails
                console.warn("Client Details API failed, using mock data", err);
                const mock = mockClients.find(c => c.id === clientId);
                if (mock) {
                    return { success: true, data: mock };
                }
                throw err;
            }
        },
        enabled: !!clientId,
    });

    const client = response?.data;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !response?.success || !client) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Client Not Found</h2>
                <Button onClick={() => navigate('/admin/clients')}>Back to Clients</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/admin/clients')}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
                    <p className="text-gray-500">{client.companyName} • {client.status}</p>
                </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-background">
                    <TabsTrigger
                        value="overview"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background px-4 py-2"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="activity"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background px-4 py-2"
                    >
                        Activity Log
                    </TabsTrigger>
                    <TabsTrigger
                        value="orders"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background px-4 py-2"
                    >
                        Orders & Bookings
                    </TabsTrigger>
                    <TabsTrigger
                        value="queries"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background px-4 py-2"
                    >
                        Queries (Tickets)
                    </TabsTrigger>
                    <TabsTrigger
                        value="notes"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-background px-4 py-2"
                    >
                        Internal Notes
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent value="overview">
                        <OverviewTab client={client} />
                    </TabsContent>
                    <TabsContent value="activity">
                        <ActivityTab clientId={clientId!} />
                    </TabsContent>
                    <TabsContent value="orders">
                        <OrdersTab clientId={clientId!} />
                    </TabsContent>
                    <TabsContent value="queries">
                        <QueriesTab clientId={clientId!} />
                    </TabsContent>
                    <TabsContent value="notes">
                        <NotesTab clientId={clientId!} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
};

export default ClientDetails;
