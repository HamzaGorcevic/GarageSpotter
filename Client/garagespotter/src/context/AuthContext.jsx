import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // Initialize authData from localStorage immediately
    const initialToken = localStorage.getItem("token");
    const initialUser = JSON.parse(localStorage.getItem("user"));
    const [authData, setAuthData] = useState({
        token: initialToken,
        user: initialUser,
    });

    useEffect(() => {
        if (initialToken) {
            const decodedToken = decodeToken(initialToken);
            checkTokenExpiration(initialToken, decodedToken?.exp);
        }
    }, []);

    const login = (token, user) => {
        localStorage.setItem("token", token);
        const decodedToken = decodeToken(token);
        const modifiedUser = {
            ...user,
            role: decodedToken?.role,
            name: decodedToken?.unique_name,
        };
        localStorage.setItem("user", JSON.stringify(modifiedUser));
        setAuthData({ token, user: modifiedUser });
        checkTokenExpiration(token, decodedToken?.exp);
        navigate("/");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setAuthData({ token: null, user: null });
        navigate("/login");
    };

    const decodeToken = (token) => {
        try {
            const payload = token?.split(".")[1];
            if (payload) {
                const decodedPayload = JSON.parse(atob(payload));
                return decodedPayload;
            }
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    };

    const checkTokenExpiration = (token, exp) => {
        const currentTime = Date.now() / 1000;
        if (exp - currentTime < 60) {
            logout();
        } else {
            const timeout = (exp - currentTime - 60) * 1000;
            setTimeout(() => checkTokenExpiration(token), timeout);
        }
    };

    const updateUser = (updatedUser) => {
        let currentUser = JSON.parse(localStorage.getItem("user"))
        let modifiedUser = {...currentUser,"name":updatedUser.name,"email":updatedUser.email}
        localStorage.setItem("user", JSON.stringify(modifiedUser));
        setAuthData(modifiedUser);
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};
