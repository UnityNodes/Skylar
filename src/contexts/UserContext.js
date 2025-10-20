import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    // Load data from localStorage on initialization
    useEffect(() => {
        const savedUsers = localStorage.getItem('skylar_users');
        const savedCurrentUser = localStorage.getItem('skylar_current_user');

        if (savedUsers) {
            setUsers(JSON.parse(savedUsers));
        }

        if (savedCurrentUser) {
            setCurrentUser(JSON.parse(savedCurrentUser));
        }
    }, []);

    // Save users to localStorage with error handling
    const saveUsers = (newUsers) => {
        try {
            setUsers(newUsers);
            localStorage.setItem('skylar_users', JSON.stringify(newUsers));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
                alert('Storage is full! Please clear some data or use smaller images.');
                throw error;
            }
            console.error('Error saving users:', error);
            throw error;
        }
    };

    // Save current user with error handling
    const saveCurrentUser = (user) => {
        try {
            setCurrentUser(user);
            localStorage.setItem('skylar_current_user', JSON.stringify(user));
        } catch (error) {
            if (error.name === 'QuotaExceededError') {
                console.error('localStorage quota exceeded');
                alert('Storage is full! Please clear some data or use smaller images.');
                throw error;
            }
            console.error('Error saving current user:', error);
            throw error;
        }
    };

    // Register new user
    const registerUser = (userData) => {
        const newUser = {
            id: Date.now(),
            name: userData.name,
            email: userData.email,
            avatar: userData.avatar,
            totalEarnings: 0,
            balance: 1000,
            createdAt: new Date().toISOString()
        };

        const updatedUsers = [...users, newUser];
        saveUsers(updatedUsers);
        saveCurrentUser(newUser);
        setIsLoginModalOpen(false);

        return newUser;
    };

    // User login
    const loginUser = (email) => {
        const user = users.find(u => u.email === email);
        if (user) {
            saveCurrentUser(user);
            setIsLoginModalOpen(false);
            return user;
        }
        return null;
    };

    // User logout
    const logoutUser = () => {
        setCurrentUser(null);
        localStorage.removeItem('skylar_current_user');
    };

    // Update user balance
    const updateUserBalance = (amount) => {
        if (!currentUser) return;

        // Use functional updates to ensure we work with the latest state
        setCurrentUser(prevUser => {
            if (!prevUser) return prevUser;
            
            const updatedUser = {
                ...prevUser,
                balance: Math.round((prevUser.balance + amount) * 10) / 10,
                totalEarnings: Math.round((prevUser.totalEarnings + Math.max(0, amount)) * 10) / 10
            };

            // Update in users list
            setUsers(prevUsers => {
                const updatedUsers = prevUsers.map(user =>
                    user.id === prevUser.id ? updatedUser : user
                );
                
                // Save to localStorage
                try {
                    localStorage.setItem('skylar_users', JSON.stringify(updatedUsers));
                } catch (error) {
                    console.error('Error saving users:', error);
                }
                
                return updatedUsers;
            });

            // Save current user to localStorage
            try {
                localStorage.setItem('skylar_current_user', JSON.stringify(updatedUser));
            } catch (error) {
                console.error('Error saving current user:', error);
            }

            return updatedUser;
        });
    };

    // Update user avatar
    const updateUserAvatar = (avatarData) => {
        if (!currentUser) return;

        const updatedUser = {
            ...currentUser,
            avatar: avatarData
        };

        // Update in users list
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        );

        saveUsers(updatedUsers);
        saveCurrentUser(updatedUser);
    };

    // Update user name
    const updateUserName = (newName) => {
        if (!currentUser) return;

        const updatedUser = {
            ...currentUser,
            name: newName
        };

        // Update in users list
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        );

        saveUsers(updatedUsers);
        saveCurrentUser(updatedUser);
    };

    // Update user profile (name and/or avatar simultaneously)
    const updateUserProfile = (updates) => {
        if (!currentUser) return;

        const updatedUser = {
            ...currentUser,
            ...updates
        };

        // Update in users list
        const updatedUsers = users.map(user =>
            user.id === currentUser.id ? updatedUser : user
        );

        saveUsers(updatedUsers);
        saveCurrentUser(updatedUser);
    };

    // Clear all user data (for storage cleanup)
    const clearAllData = () => {
        if (window.confirm('This will delete all user accounts and data. Are you sure?')) {
            localStorage.removeItem('skylar_users');
            localStorage.removeItem('skylar_current_user');
            setUsers([]);
            setCurrentUser(null);
            alert('All data cleared successfully!');
        }
    };

    // Get top users for leaderboard
    const getTopUsers = () => {
        return [...users]
            .sort((a, b) => b.totalEarnings - a.totalEarnings)
            .map((user, index) => ({
                ...user,
                position: index + 1
            }));
    };

    const value = {
        currentUser,
        users,
        isLoginModalOpen,
        setIsLoginModalOpen,
        registerUser,
        loginUser,
        logoutUser,
        updateUserBalance,
        updateUserAvatar,
        updateUserName,
        updateUserProfile,
        clearAllData,
        getTopUsers
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};