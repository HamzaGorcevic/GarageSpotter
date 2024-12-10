import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { authData } = useContext(AuthContext);
    const location = useLocation();

    if (!authData?.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.includes(authData.user.role)) {
        return <Outlet />;
    }

    switch (authData.user.role) {
        case "Admin":
            return <Navigate to="/admin" replace />;
        case "User":
        case "Owner":
            return <Navigate to="/home" replace />;
        default:
            return <Navigate to="/access-denied" replace />;
    }
};

export default ProtectedRoute;
