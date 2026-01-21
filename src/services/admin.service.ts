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

    async reviewKYC(kycId: string, action: 'approve' | 'reject', rejectionReason?: string) {
        const response = await axiosInstance.put<ApiResponse<any>>(`/api/admin/kyc/${kycId}/review`, {
            action,
            rejectionReason
        });
        return response.data;
    }




    async getAllSpaces(deleted: boolean = false) {
        try {
            const [voRes, coRes] = await Promise.all([
                axiosInstance.get<ApiResponse<any>>(`/api/virtualOffice/getAll?deleted=${deleted}`),
                axiosInstance.get<ApiResponse<any>>(`/api/coworkingSpace/getAll?deleted=${deleted}`)
            ]);

            const voSpaces = (voRes.data.data || []).map((s: any) => ({ ...s, type: 'virtual-office' }));
            const coSpaces = (coRes.data.data || []).map((s: any) => ({ ...s, type: 'coworking-space' }));

            return {
                success: true,
                message: "Spaces fetched successfully",
                data: [...voSpaces, ...coSpaces]
            };
        } catch (error: any) {
            return {
                success: false,
                message: "Failed to fetch spaces",
                error: error.message
            };
        }
    }

    async deleteSpace(id: string, type: string, restore: boolean = false) {
        // Determine endpoint based on type
        const endpoint = type === 'virtual-office'
            ? `/api/virtualOffice/delete/${id}?restore=${restore}`
            : `/api/coworkingSpace/delete/${id}?restore=${restore}`;

        const response = await axiosInstance.delete<ApiResponse<any>>(endpoint);
        return response.data;
    }

    async updateSpace(id: string, type: string, data: any) {
        const endpoint = type === 'virtual-office'
            ? `/api/virtualOffice/update/${id}`
            : `/api/coworkingSpace/update/${id}`;

        const response = await axiosInstance.put<ApiResponse<any>>(endpoint, data);
        return response.data;
    }

    async deleteUser(id: string, restore: boolean = false) {
        try {
            const response = await axiosInstance.delete<ApiResponse<any>>(`/api/admin/users/${id}?restore=${restore}`);
            console.log('deleteUser response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('deleteUser error:', error);
            // Return error in expected format
            return {
                success: false,
                message: error?.response?.data?.message || error?.message || 'Failed to update user',
                error: error?.response?.data?.error || error?.message
            };
        }
    }

    async getAllBookings(params?: any) {
        const response = await axiosInstance.get<ApiResponse<any>>('/api/admin/bookings', { params });
        return response.data;
    }

    async createSpace(type: string, data: any) {
        const endpoint = type === 'virtual-office'
            ? '/api/virtualOffice/create'
            : '/api/coworkingSpace/create';

        const response = await axiosInstance.post<ApiResponse<any>>(endpoint, data);
        return response.data;
    }
}

export const adminService = new AdminService();
