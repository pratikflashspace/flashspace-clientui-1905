import axiosInstance, { handleApiError } from './api.service';

/**
 * Meeting Service
 * Handles API calls for meeting scheduling with the sales team
 */

export interface TimeSlot {
    startTime: string;
    endTime: string;
    displayTime?: string;
}

export interface AvailabilityResponse {
    success: boolean;
    message?: string;
    availability?: {
        [date: string]: TimeSlot[];
    };
    data?: {
        availability: Array<{
            date: string;
            displayDate?: string;
            slots: TimeSlot[];
        }>;
    };
}

export interface BookingRequest {
    fullName: string;
    email: string;
    phoneNumber: string;
    slotTime: string; // ISO string format
    spaceId?: string;
    notes: string;
}

export interface BookingResponse {
    success: boolean;
    message: string;
    booking?: {
        id: string;
        meetLink?: string;
    };
}

/**
 * Fetch available time slots for the next N days
 */
export const getAvailability = async (days: number = 7): Promise<AvailabilityResponse> => {
    try {
        const response = await axiosInstance.get<AvailabilityResponse>(
            `/meetings/availability?days=${days}`
        );
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

/**
 * Book a meeting with the sales team
 */
export const bookMeeting = async (data: BookingRequest): Promise<BookingResponse> => {
    try {
        const response = await axiosInstance.post<BookingResponse>('/meetings/book', data);
        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export default {
    getAvailability,
    bookMeeting,
};
