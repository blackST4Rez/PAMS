import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            // Mock notifications
            setNotifications([
                {
                    id: '1',
                    title: 'Asset Approved',
                    body: 'Municipal Office Building has been approved',
                    isRead: false,
                    createdAt: new Date().toISOString(),
                    type: 'approval',
                },
                {
                    id: '2',
                    title: 'Maintenance Due',
                    body: 'School Bus #5 is due for maintenance',
                    isRead: false,
                    createdAt: new Date(Date.now() - 3600000).toISOString(),
                    type: 'maintenance',
                },
                {
                    id: '3',
                    title: 'Disposal Request Approved',
                    body: 'Old Generator Set disposal has been approved',
                    isRead: true,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    type: 'disposal',
                },
            ]);
            setUnreadCount(2);
        }
    }, [isAuthenticated]);

    const markAsRead = async (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};