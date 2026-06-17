import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import chatService from '@/services/chat.service';
import { safeStorageGet, safeStorageRemove, safeStorageSet } from '@/utils/browserStorage';

// Reusing the exact same types from StartChatting.tsx
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  spacesData?: any[];
  serviceType?: string;
}

export interface ChatSession {
  _id?: string;
  id: string;
  title: string;
  messages: ChatMessage[];
  date: string;
}

interface ChatContextType {
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatSessions: ChatSession[];
  setChatSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  startNewChat: (messagesToSave?: ChatMessage[]) => void;
  deleteChatSession: (sessionId: string) => Promise<boolean>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchedFromServer, setIsFetchedFromServer] = useState(false);

  // Keep a ref for isAuthenticated so it's never stale during unmount saves
  const isAuthenticatedRef = useRef(isAuthenticated);
  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // Load from session storage on mount
  useEffect(() => {
    try {
      const savedMessages = safeStorageGet('session', 'flashspace_chatHistory');
      if (savedMessages) {
        setChatMessages(JSON.parse(savedMessages, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        }));
      }

      const savedSessions = safeStorageGet('session', 'flashspace_chatSessions');
      if (savedSessions) {
        setChatSessions(JSON.parse(savedSessions, (key, value) => {
          if (key === 'timestamp') return new Date(value);
          return value;
        }));
      }
    } catch (e) {
      console.error("[ChatContext] Failed to parse chat history from session storage", e);
    }
  }, []);

  // Sync from Server if Authenticated
  useEffect(() => {
    const fetchServerSessions = async () => {
      try {
        console.log("[ChatContext] Fetching chat sessions from server...");
        const response = await chatService.getSessions();
        if (response.success && response.data) {
          console.log(`[ChatContext] Fetched ${response.data.length} sessions from server`);
          setChatSessions(response.data);
          setIsFetchedFromServer(true);
        } else {
          console.warn("[ChatContext] Failed to fetch sessions:", response.message);
        }
      } catch (error) {
        console.error("[ChatContext] Failed to load chat history from server", error);
      }
    };

    if (isAuthenticated && !isFetchedFromServer) {
      fetchServerSessions();
    }
  }, [isAuthenticated, isFetchedFromServer]);

  // Clear state and storage on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setChatMessages([]);
      setChatSessions([]);
      setIsFetchedFromServer(false);
      safeStorageRemove('session', 'flashspace_chatHistory');
      safeStorageRemove('session', 'flashspace_chatSessions');
      safeStorageRemove('session', 'flashspace_activeChatId');
    }
  }, [isAuthenticated]);

  // Keep a ref for chatMessages so startNewChat always reads the latest
  const chatMessagesRef = useRef(chatMessages);
  useEffect(() => {
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

  // Save changes back to session storage
  useEffect(() => {
    safeStorageSet('session', 'flashspace_chatHistory', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    safeStorageSet('session', 'flashspace_chatSessions', JSON.stringify(chatSessions));
  }, [chatSessions]);

  const startNewChat = useCallback((messagesToSave?: ChatMessage[]) => {
    // Note: Backend persistence and inserting into the sidebar `chatSessions` list 
    // is now handled exclusively by StartChatting.tsx to prevent duplicate entries.
    
    console.log(`[ChatContext] startNewChat called. Clearing current messages.`);
    
    setChatMessages([]);
    safeStorageRemove('session', 'chat_session_id');
  }, []); // No deps needed — all values read from refs

  const deleteChatSession = useCallback(async (sessionId: string) => {
    try {
      if (isAuthenticatedRef.current) {
        const response = await chatService.deleteSession(sessionId);
        if (!response.success) {
          console.error('[ChatContext] Failed to delete session on server:', response.message);
          return false;
        }
      }
      // Remove from local state
      setChatSessions(prev => prev.filter(s => (s._id || s.id) !== sessionId));
      return true;
    } catch (err) {
      console.error('[ChatContext] Error deleting session:', err);
      return false;
    }
  }, [setChatSessions]);

  return (
    <ChatContext.Provider value={{
      chatMessages,
      setChatMessages,
      chatSessions,
      setChatSessions,
      startNewChat,
      deleteChatSession,
      isLoading,
      setIsLoading
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
