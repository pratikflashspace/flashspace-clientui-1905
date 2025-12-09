import axiosInstance from "@/lib/axios";

interface PartnerInquiryData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  partnershipType: string;
  message?: string;
}

export const submitPartnerInquiry = async (data: PartnerInquiryData) => {
  try {
    const response = await axiosInstance.post('/api/partnerInquiry/submit', data);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting partner inquiry:', error);
    throw new Error(error.response?.data?.message || 'Failed to submit inquiry');
  }
};
