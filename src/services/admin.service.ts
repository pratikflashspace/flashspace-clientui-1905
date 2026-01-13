import axiosInstance from '@/lib/axios';

export interface AdminDashboardStats {
    totalUsers: number;
    totalBookings: number;
    activeListings: number;
    totalRevenue: number;
    recentActivity: Array<{
        id: string;
        type: string;
        message: string;
        time: string;
    }>;
}


// Define the backend standard response type here if not imported
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}


class AdminService {
    async getDashboardStats() {
        const response = await axiosInstance.get<ApiResponse<AdminDashboardStats>>('/api/admin/dashboard');
        return response.data;
    }

    async getAllUsers(params?: any) {
        const response = await axiosInstance.get<ApiResponse<any>>('/api/admin/users', { params });
        return response.data;
    }

    async getPendingKYC() {
        const response = await axiosInstance.get<ApiResponse<any>>('/api/admin/kyc/pending');
        return response.data;
    }
}

export const adminService = new AdminService();
