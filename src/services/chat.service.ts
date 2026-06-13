import axiosInstance from "@/lib/axios";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatSession {
  _id?: string;
  id: string; // Used by frontend for local React state mapping
  title: string;
  messages: ChatMessage[];
  date: string;
}

export interface ChatApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

class ChatService {
  /**
   * Fetch all saved chat sessions for the logged-in user
   */
  async getSessions(): Promise<ChatApiResponse<ChatSession[]>> {
    try {
      const response = await axiosInstance.get<ChatApiResponse<ChatSession[]>>('/api/chat');
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch chat sessions";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Save or update an existing chat session to MongoDB
   */
  async saveSession(sessionData: {
    id?: string;
    title: string;
    messages: ChatMessage[];
    date: string;
  }): Promise<ChatApiResponse<ChatSession>> {
    try {
      // Create a clean payload without heavy spacesData
      const cleanSessionData = {
        ...sessionData,
        messages: sessionData.messages.map(({ spacesData, ...rest }) => rest)
      };

      // Pass the local 'id' so backend can find it if it exists or create new
      const response = await axiosInstance.post<ChatApiResponse<ChatSession>>('/api/chat', cleanSessionData);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save chat session";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Delete a chat session
   */
  async deleteSession(sessionId: string): Promise<ChatApiResponse<void>> {
    try {
      const response = await axiosInstance.delete<ChatApiResponse<void>>(`/api/chat/${sessionId}`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete chat session";
      return {
        success: false,
        message: errorMessage,
      };
    }
  }
}

export const chatService = new ChatService();
export default chatService;
