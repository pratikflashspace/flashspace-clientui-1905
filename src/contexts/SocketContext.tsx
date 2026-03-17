
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const { user } = useAuth(); // Assuming AuthContext provides user info

    useEffect(() => {
        // Only connect if user is authenticated
        if (!user) {
            if (socket) {
                socket.disconnect();
                setSocket(null);
                setIsConnected(false);
            }
            return;
        }

        // Initialize socket connection
        const socketBaseUrl =
            import.meta.env.VITE_API_URL ||
            (import.meta.env.DEV ? 'http://localhost:5000' : window.location.origin);

        const socketInstance = io(socketBaseUrl, {
            withCredentials: true,
            // transports: ['websocket', 'polling'], // Try websocket first - Commented out to allow default negotiation (polling -> websocket)
        });

        socketInstance.on('connect', () => {
            // console.log('Socket connected:', socketInstance.id);
            setIsConnected(true);

            // Join user specific rooms for targeted notifications
            if (user?.id || (user as any)?._id) {
                const userId = user.id || (user as any)._id;
                socketInstance.emit('join_user_feed', userId);
                
                // Also join specific feeds based on role
                if (user.role === 'admin' || user.role === 'super_admin' || user.role === 'support') {
                    socketInstance.emit('join_admin_feed');
                } else if (user.role === 'affiliate') {
                    socketInstance.emit('join_affiliate_feed', userId);
                }
            }
        });

        socketInstance.on('disconnect', () => {
            // console.log('Socket disconnected');
            setIsConnected(false);
        });

        socketInstance.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
            setIsConnected(false);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, [user]); // Re-connect if user changes

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
