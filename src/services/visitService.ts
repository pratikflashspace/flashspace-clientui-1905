import axiosInstance from "@/lib/axios";

const API_URL = "/api/visit";

export interface VisitRecord {
  _id: string;
  visitId: string;
  client: string;
  visitor: string;
  visitorEmail?: string;
  visitorNumber?: string;
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
  visitorEmail?: string;
  visitorNumber?: string;
  purpose: string;
  space: string;
  email: string;
  date?: string;
}

export const visitService = {
  getAll: async (page = 1, limit = 10, search = "") => {
    const response = await axiosInstance.get<{
      success: boolean;
      data: VisitRecord[];
      pagination: {
        total: number;
        pending: number;
        page: number;
        limit: number;
        pages: number;
      };
    }>(`${API_URL}?page=${page}&limit=${limit}&search=${search}`);
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
