import axiosInstance from "@/lib/axios";

const API_URL = "/api/mail";

export interface MailRecord {
  _id: string;
  mailId: string;
  client: string;
  sender: string;
  type: string;
  space: string;
  documentUrl?: string;
  received: string;
  status: "Pending Action" | "Forwarded" | "Collected";
  clientDecision?: "None" | "Forward Requested";
  userCollectedStatus?: "Pending" | "Collected";
  createdAt: string;
  updatedAt: string;
}

export interface CreateMailData {
  client: string;
  sender: string;
  type: string;
  space: string;
  email: string;
}

export const mailService = {
  getAll: async (page = 1, limit = 10, search = "", status = "all") => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: MailRecord[];
      pagination: {
        total: number;
        pending: number;
        collected: number;
        page: number;
        limit: number;
        pages: number;
      };
    }>(`${API_URL}?page=${page}&limit=${limit}&search=${search}&status=${status}`);
    return response.data;
  },

  create: async (data: CreateMailData, file?: File) => {
    const payload = file
      ? (() => {
        const formData = new FormData();
        formData.append("client", data.client);
        formData.append("email", data.email);
        formData.append("sender", data.sender);
        formData.append("type", data.type);
        formData.append("space", data.space);
        formData.append("file", file);
        return formData;
      })()
      : data;

    const response = await axiosInstance.post<{
      success: boolean;
      data: MailRecord;
    }>(API_URL, payload, file ? {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    } : undefined);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch<{
      success: boolean;
      data: MailRecord;
    }>(`${API_URL}/${id}/status`, { status });
    return response.data;
  },
};
