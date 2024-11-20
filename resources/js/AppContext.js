import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children, ...props }) => {
    const [shouldRefreshTasks, setShouldRefreshTasks] = useState(false);

    const refreshTasks = () => {
        setShouldRefreshTasks(prev => !prev); // Toggle to trigger refresh
    };

    const value = {
        ...props,
        shouldRefreshTasks,
        refreshTasks
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook for using the context
export const useApp = () => useContext(AppContext);
