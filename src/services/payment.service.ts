import axiosInstance from "@/lib/axios";
import { API_ENDPOINTS } from "@/config/api.config";

// Razorpay Key - Public Key (safe to expose)
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

// Extend Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// API Response type
interface APIResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CreateOrderPayload {
  userId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  spaceId?: string;
  spaceName: string;
  planName: string;
  planKey: string;
  tenure: number;
  yearlyPrice: number;
  totalAmount: number;
  discountPercent: number;
  discountAmount: number;
  paymentType?:
  | "virtual_office"
  | "coworking_space"
  | "meeting_room"
  | "seat_booking"
  | "business_setup";
  startDate?: string; // ISO date string for booking start
  holdId?: string;
  couponCode?: string; // Coupon code applied by user (for affiliate attribution)
  affiliateId?: string; // Affiliate user ID (resolved from coupon)
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  paymentId: string;
  keyId: string;
  devMode?: boolean; // Flag to indicate dev mode (no Razorpay checkout)
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  devMode?: boolean; // Skip signature verification in dev mode
}

export interface PaymentVerificationResponse {
  paymentId: string;
  orderId: string;
  status: string;
  spaceName: string;
  planName: string;
  tenure: number;
  totalAmount: number;
}

/**
 * Create a Razorpay order
 */
export const createPaymentOrder = async (
  payload: CreateOrderPayload,
): Promise<CreateOrderResponse> => {
  try {
    const response = await axiosInstance.post<APIResponse<CreateOrderResponse>>(
      API_ENDPOINTS.PAYMENT.CREATE_ORDER,
      payload,
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to create order");
  } catch (error: any) {
    console.error("Error creating payment order:", error);
    // Propagate specific error message if available
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to create order";
    throw new Error(errorMessage);
  }
};

/**
 * Verify payment after Razorpay callback
 */
export const verifyPayment = async (
  payload: VerifyPaymentPayload,
): Promise<PaymentVerificationResponse> => {
  try {
    const response = await axiosInstance.post<
      APIResponse<PaymentVerificationResponse>
    >(API_ENDPOINTS.PAYMENT.VERIFY, payload);

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Payment verification failed");
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Payment verification failed",
    );
  }
};

/**
 * Report payment failure
 */
export const reportPaymentFailure = async (
  orderId: string,
  errorCode: string,
  errorDescription: string,
) => {
  try {
    await axiosInstance.post(API_ENDPOINTS.PAYMENT.FAILED, {
      razorpay_order_id: orderId,
      error_code: errorCode,
      error_description: errorDescription,
    });
  } catch (error) {
    console.error("Error reporting payment failure:", error);
  }
};

/**
 * Simulate payment success (Development Only)
 * Uses the existing /verify endpoint with devMode: true
 */
export const simulatePayment = async (
  orderId: string,
): Promise<PaymentVerificationResponse> => {
  try {
    const response = await axiosInstance.post<
      APIResponse<PaymentVerificationResponse>
    >(API_ENDPOINTS.PAYMENT.VERIFY, {
      razorpay_order_id: orderId,
      razorpay_payment_id: `pay_sim_${Date.now()}`,
      razorpay_signature: "simulated_signature",
      devMode: true,
    });

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Payment simulation failed");
  } catch (error: any) {
    console.error("Error simulating payment:", error);
    throw new Error(
      error.response?.data?.message ||
      error.message ||
      "Payment simulation failed",
    );
  }
};

/**
 * Get payment status
 */
export const getPaymentStatus = async (orderId: string) => {
  try {
    const response = await axiosInstance.get<APIResponse<any>>(
      API_ENDPOINTS.PAYMENT.STATUS(orderId),
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to get payment status");
  } catch (error: any) {
    console.error("Error getting payment status:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Get user's payment history
 */
export const getUserPayments = async (userId: string, page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get<APIResponse<any>>(
      `${API_ENDPOINTS.PAYMENT.USER_HISTORY(userId)}?page=${page}&limit=${limit}`,
    );

    if (response.data.success) {
      return response.data.data;
    }

    throw new Error(response.data.message || "Failed to get payment history");
  } catch (error: any) {
    console.error("Error getting user payments:", error);
    throw new Error(error.response?.data?.message || error.message);
  }
};

/**
 * Load Razorpay SDK dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay checkout modal
 */
export interface RazorpayCheckoutOptions {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  spaceName: string;
  planName: string;
  onSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  onFailure: (error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
  }) => void;
  onDismiss: () => void;
}

export const openRazorpayCheckout = async (
  options: RazorpayCheckoutOptions,
): Promise<void> => {
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    throw new Error(
      "Failed to load Razorpay SDK. Please check your internet connection.",
    );
  }

  const razorpayOptions = {
    key: options.keyId || RAZORPAY_KEY_ID,
    amount: options.amount,
    currency: options.currency,
    name: "FlashSpace",
    description: `${options.planName} - ${options.spaceName}`,
    image: "https://flashspace.ai/Logo/Flashspace%20Logo.png", // Use absolute public URL to avoid PNA issues
    order_id: options.orderId,
    handler: function (response: any) {
      options.onSuccess({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      });
    },
    prefill: {
      name: options.userName,
      email: options.userEmail,
      contact: options.userPhone || "",
    },
    notes: {
      spaceName: options.spaceName,
      planName: options.planName,
    },
    theme: {
      color: "#FFD43B",
    },
    modal: {
      ondismiss: function () {
        options.onDismiss();
      },
      escape: true,
      animation: true,
    },
  };

  const razorpay = new (window as any).Razorpay(razorpayOptions);

  razorpay.on("payment.failed", function (response: any) {
    options.onFailure({
      code: response.error.code,
      description: response.error.description,
      source: response.error.source,
      step: response.error.step,
      reason: response.error.reason,
    });
  });

  razorpay.open();
};
