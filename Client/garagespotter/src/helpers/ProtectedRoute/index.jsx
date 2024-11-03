import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { authData } = useContext(AuthContext);
    return allowedRoles.includes(authData?.user?.role) ? (
        <Outlet />
    ) : (
        <Navigate to="/access-denied" />
    );
};

export default ProtectedRoute;
