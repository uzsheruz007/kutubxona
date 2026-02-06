import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("token"));

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    }, [user]);

    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        } else {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
                username,
                password
            });
            setUser(response.data.user);
            setToken(response.data.token);
            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: error.response?.data?.non_field_errors?.[0] || "Login xatoligi!"
            };
        }
    };

    const loginWithHemis = async (data) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/accounts/hemis/callback/", data);
            setUser(response.data.user);
            setToken(response.data.token);
            return { success: true };
        } catch (error) {
            console.error("Hemis Login error:", error);
            return {
                success: false,
                error: error.response?.data?.error || "Hemis orqali kirishda xatolik!"
            };
        }
    };

    const getHemisAuthUrl = async (userType = 'student') => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/accounts/hemis/login/?user_type=${userType}`);
            return response.data.auth_url;
        } catch (error) {
            console.error("Error fetching Hemis URL:", error);
            return null;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
    };

    const refreshUser = async () => {
        if (!token) return;
        try {
            // Simplified fetch - we don't have a dedicated /me/ endpoint in views shown, 
            // but we can use UserProfileView GET /api/accounts/profile/
            const response = await axios.get("http://127.0.0.1:8000/api/accounts/profile/");
            setUser(response.data);
            return response.data;
        } catch (error) {
            console.error("Error refreshing user:", error);
            // If token is invalid (401), maybe logout? 
            if (error.response?.status === 401) logout();
        }
    };

    return (
        <UserContext.Provider value={{ user, token, login, loginWithHemis, getHemisAuthUrl, logout, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}