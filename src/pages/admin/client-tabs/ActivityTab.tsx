import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { ClientActivity } from '@/types/client.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Activity, LogIn, MousePointer, CreditCard, Calendar } from 'lucide-react';

interface ActivityTabProps {
    clientId: string;
}

const ActivityTab: React.FC<ActivityTabProps> = ({ clientId }) => {
    // Mock data if API fails
    const mockActivity: ClientActivity[] = [
        { id: '1', clientId, type: 'Portal Login', description: 'Logged in to dashboard', timestamp: '2023-10-27T09:00:00Z' },
        { id: '2', clientId, type: 'Page Visit', description: 'Viewed Meeting Rooms page', timestamp: '2023-10-27T09:15:00Z' },
        { id: '3', clientId, type: 'Booking Attempt', description: 'Attempted to book Room A', timestamp: '2023-10-26T14:00:00Z' },
        { id: '4', clientId, type: 'Payment', description: 'Paid Invoice #INV-1001', timestamp: '2023-10-25T11:00:00Z' },
    ];

    const { data: activities, isLoading } = useQuery({
        queryKey: ['client-activity', clientId],
        queryFn: async () => {
            try {
                const response = await adminService.getClientActivity(clientId);
                if (response && response.success) return response.data;
                throw new Error("No data");
            } catch (e) {
                return mockActivity;
            }
        }
    });

    const getIcon = (type: string) => {
        switch (type) {
            case 'Portal Login': return <LogIn className="h-4 w-4 text-blue-500" />;
            case 'Page Visit': return <MousePointer className="h-4 w-4 text-gray-500" />;
            case 'Booking Attempt': return <Calendar className="h-4 w-4 text-orange-500" />;
            case 'Payment': return <CreditCard className="h-4 w-4 text-green-500" />;
            default: return <Activity className="h-4 w-4 text-gray-500" />;
        }
    };

    if (isLoading) return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-8" />;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {activities?.map((activity) => (
                        <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                {getIcon(activity.type)}
                            </div>

                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow bg-white">
                                <div className="flex items-center justify-between space-x-2 mb-1">
                                    <div className="font-bold text-slate-900">{activity.type}</div>
                                    <time className="font-caveat font-medium text-indigo-500 text-xs">{new Date(activity.timestamp).toLocaleString()}</time>
                                </div>
                                <div className="text-slate-500 max-w-none text-sm">{activity.description}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivityTab;
