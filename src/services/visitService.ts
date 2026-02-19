import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/visit`;

export interface VisitRecord {
    _id: string;
    visitId: string;
    client: string;
    visitor: string;
    purpose: string;
    space: string;
    date: string;
    status: 'Pending' | 'Completed';
    createdAt: string;
    updatedAt: string;
}

export interface CreateVisitData {
    client: string;
    visitor: string;
    purpose: string;
    space: string;
}

export const visitService = {
    getAll: async () => {
        const response = await axios.get<{ success: boolean; data: VisitRecord[] }>(API_URL);
        return response.data;
    },

    create: async (data: CreateVisitData) => {
        const response = await axios.post<{ success: boolean; data: VisitRecord }>(API_URL, data);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await axios.patch<{ success: boolean; data: VisitRecord }>(`${API_URL}/${id}/status`, { status });
        return response.data;
    }
};
