import axiosInstance from "@/lib/axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/visit`;

export interface VisitRecord {
  _id: string;
  visitId: string;
  client: string;
  visitor: string;
  purpose: string;
  space: string;
  date: string;
  status: "Pending" | "Completed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateVisitData {
  client: string;
  visitor: string;
  purpose: string;
  space: string;
  email: string;
  date?: string;
}

export const visitService = {
  getAll: async () => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: VisitRecord[];
    }>(API_URL);
    return response.data;
  },

  create: async (data: CreateVisitData) => {
    const response = await axiosInstance.post<{
      success: boolean;
      data: VisitRecord;
    }>(API_URL, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await axiosInstance.patch<{
      success: boolean;
      data: VisitRecord;
    }>(`${API_URL}/${id}/status`, { status });
    return response.data;
  },
};
