import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/api/mail`;

export interface MailRecord {
    _id: string;
    mailId: string;
    client: string;
    sender: string;
    type: string;
    space: string;
    received: string;
    status: 'Pending Action' | 'Forwarded' | 'Collected';
    createdAt: string;
    updatedAt: string;
}

export interface CreateMailData {
    client: string;
    sender: string;
    type: string;
    space: string;
}

export const mailService = {
    getAll: async () => {
        const response = await axios.get<{ success: boolean; data: MailRecord[] }>(API_URL);
        return response.data;
    },

    create: async (data: CreateMailData) => {
        const response = await axios.post<{ success: boolean; data: MailRecord }>(API_URL, data);
        return response.data;
    },

    updateStatus: async (id: string, status: string) => {
        const response = await axios.patch<{ success: boolean; data: MailRecord }>(`${API_URL}/${id}/status`, { status });
        return response.data;
    }
};
