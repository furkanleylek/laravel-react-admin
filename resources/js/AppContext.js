import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children, ...props }) => {
    const [shouldRefreshTasks, setShouldRefreshTasks] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0)

    const refreshTasks = () => {
        setShouldRefreshTasks(prev => !prev);
    };

    const addNotification = (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setNotificationCount(prev => prev + 1)
    };

    const value = {
        ...props,
        notifications,
        shouldRefreshTasks,
        notificationCount,
        setNotificationCount,
        refreshTasks,
        addNotification
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook for using the context
export const useApp = () => useContext(AppContext);
