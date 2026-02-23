
export enum CouponStatus {
    ACTIVE = "active",
    USED = "used",
    EXPIRED = "expired",
    DISABLED = "disabled"
}

export interface Coupon {
    _id: string;
    code: string;
    discountType: 'percentage';
    discountValue: number;
    assignedClientId: string;
    status: CouponStatus;
    expiryDate: string;
    createdBy: string;
    usedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCouponDTO {
    assignedClientId: string;
    discountValue: number;
    expiryDate: string;
    manualCode?: string;
}

export interface ValidateCouponResponse {
    success?: boolean;
    valid: boolean;
    message: string;
    data?: {
        code: string;
        discountType: string;
        discountValue: number;
        affiliateId?: string; // Present if this is an affiliate coupon
        isAffiliateCoupon?: boolean;
    };
}
