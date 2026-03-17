
import axiosInstance from '@/lib/axios';
import { Coupon, CreateCouponDTO, ValidateCouponResponse } from '@/types/coupon.types';

// Use /api/coupons (plural) — matches the backend route: mainRoutes.use("/coupons", couponRoutes)
const COUPON_BASE = '/api/coupons';

export const createCoupon = async (data: CreateCouponDTO): Promise<Coupon> => {
    const response = await axiosInstance.post<{ success: boolean, data: Coupon }>(`${COUPON_BASE}/create`, data);
    return response.data.data;
};

export const getAllCoupons = async (clientId?: string, status?: string): Promise<Coupon[]> => {
    const params = new URLSearchParams();
    if (clientId) params.append('clientId', clientId);
    if (status) params.append('status', status);

    const response = await axiosInstance.get<{ success: boolean, data: Coupon[] }>(`${COUPON_BASE}/admin/all?${params.toString()}`);
    return response.data.data;
};

export const deleteCoupon = async (id: string): Promise<void> => {
    await axiosInstance.delete(`${COUPON_BASE}/${id}`);
};

export const validateCoupon = async (code: string): Promise<ValidateCouponResponse> => {
    try {
        const response = await axiosInstance.post<ValidateCouponResponse>(`${COUPON_BASE}/validate`, { code });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data as ValidateCouponResponse;
        }
        throw error;
    }
};

export const markCouponUsed = async (code: string, userId?: string): Promise<void> => {
    await axiosInstance.post(`${COUPON_BASE}/use`, { code, userId });
};
