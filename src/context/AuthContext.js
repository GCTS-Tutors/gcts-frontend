// /src/context/AuthContext.js
import React, { createContext, useState, useContext } from "react";
import { loginUser, logoutUser, getUser } from "../api";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component to wrap your app and provide auth state
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Function to login
    const login = async (username, password) => {
        setLoading(true);
        setError(null);

        // API call
        try {
            const response = await loginUser({username: username, password: password});
            await getCurrentUser();
            setSuccess(true);
        } catch (error) {
            setError("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccess(false);
                setError(null);
            }, 3000); 
        }
    };

    // Function to get current user
    const getCurrentUser = async () => {
        const response = await getUser();
        if (response) {
            setUser(response);
            return response;
        }
    };
       
    // Function to logout
    const logout = async () => {
        setLoading(true);
        setError(null);

        // API call
        try {
            await logoutUser();
            setUser(null);
        } catch (error) {
            setError("Logout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthContext.Provider value={{ user, getCurrentUser, login, logout, loading, error, success }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
