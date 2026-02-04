import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { ClientOrder } from '@/types/client.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from 'lucide-react';

interface OrdersTabProps {
    clientId: string;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ clientId }) => {
    const mockOrders: ClientOrder[] = [
        { id: '1', bookingId: 'BK-1001', productType: 'Virtual Office', plan: 'Yearly', amount: 1200, paymentStatus: 'Paid', bookingStatus: 'Confirmed', renewalDate: '2024-10-01' },
        { id: '2', bookingId: 'BK-1002', productType: 'Meeting Room', plan: 'Hourly', amount: 50, paymentStatus: 'Paid', bookingStatus: 'Confirmed', renewalDate: 'N/A' },
        { id: '3', bookingId: 'BK-1003', productType: 'Coworking', plan: 'Monthly', amount: 300, paymentStatus: 'Pending', bookingStatus: 'Pending', renewalDate: '2023-11-15' },
    ];

    const { data: orders, isLoading } = useQuery({
        queryKey: ['client-orders', clientId],
        queryFn: async () => {
            try {
                const response = await adminService.getClientOrders(clientId);
                if (response && response.success) return response.data;
                throw new Error("No data");
            } catch (e) {
                return mockOrders;
            }
        }
    });

    if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-8" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Orders & Bookings</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Renewal</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders?.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.bookingId}</TableCell>
                                <TableCell>{order.productType}</TableCell>
                                <TableCell>{order.plan}</TableCell>
                                <TableCell>${order.amount}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                                            order.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {order.paymentStatus}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${order.bookingStatus === 'Confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {order.bookingStatus}
                                    </span>
                                </TableCell>
                                <TableCell>{order.renewalDate}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default OrdersTab;
