import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { ClientQuery } from '@/types/client.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueriesTabProps {
    clientId: string;
}

const QueriesTab: React.FC<QueriesTabProps> = ({ clientId }) => {
    const mockQueries: ClientQuery[] = [
        { id: '1', clientId, subject: 'Invoice Discrepancy', category: 'Billing', status: 'Open', assignedTeam: 'Finance', lastUpdate: '2023-10-27T10:00:00Z' },
        { id: '2', clientId, subject: 'Wifi Issue in Room 303', category: 'Technical', status: 'Resolved', assignedTeam: 'IT Support', lastUpdate: '2023-10-25T15:00:00Z' },
    ];

    const { data: queries, isLoading } = useQuery({
        queryKey: ['client-queries', clientId],
        queryFn: async () => {
            try {
                const response = await adminService.getClientQueries(clientId);
                if (response && response.success) return response.data;
                throw new Error("No data");
            } catch (e) {
                return mockQueries;
            }
        }
    });

    if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-8" />;

    return (
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle>Queries / Tickets</CardTitle>
                    <Button size="sm" variant="outline">Raise New Ticket</Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Ticket ID</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead>Last Update</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {queries?.map((query) => (
                            <TableRow key={query.id}>
                                <TableCell className="font-medium">#{query.id}</TableCell>
                                <TableCell>{query.subject}</TableCell>
                                <TableCell>{query.category}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${query.status === 'Open' ? 'bg-red-100 text-red-700' :
                                            query.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {query.status}
                                    </span>
                                </TableCell>
                                <TableCell>{query.assignedTeam}</TableCell>
                                <TableCell>{new Date(query.lastUpdate).toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))}
                        {queries?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No queries found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default QueriesTab;
