export interface Client {
    id: string;
    name: string;
    companyName: string;
    email: string;
    phone: string;
    location: string;
    assignedSalesPerson: string; // Name or ID
    productType: 'Virtual Office' | 'Coworking' | 'Meeting Room';
    dealType: 'Monthly' | 'Yearly';
    dealValue: number;
    status: 'Active' | 'In Progress' | 'Closed';
    lastActivity: string; // ISO Date
    dateClosed: string; // ISO Date
}

export interface ClientActivity {
    id: string;
    clientId: string;
    type: 'Portal Login' | 'Page Visit' | 'Booking Attempt' | 'Payment';
    description: string;
    timestamp: string;
}

export interface ClientOrder {
    id: string;
    bookingId: string;
    productType: string;
    plan: string;
    amount: number;
    paymentStatus: 'Paid' | 'Pending' | 'Failed';
    bookingStatus: 'Confirmed' | 'Pending' | 'Cancelled';
    renewalDate: string;
}

export interface ClientQuery {
    id: string;
    clientId: string;
    subject: string;
    category: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    assignedTeam: string;
    lastUpdate: string;
}

export interface ClientNote {
    id: string;
    clientId: string;
    content: string;
    author: string;
    timestamp: string;
}
