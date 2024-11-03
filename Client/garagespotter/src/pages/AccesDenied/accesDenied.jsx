import React from "react";
import styles from "./accessDenied.module.scss";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate("/");
    };

    return (
        <div className={styles.accessDeniedContainer}>
            <h1 className={styles.accessDeniedTitle}>Access Denied</h1>
            <p className={styles.accessDeniedText}>
                You do not have permission to view this page.
            </p>
            <button className={styles.goBackButton} onClick={handleGoBack}>
                Go Back
            </button>
        </div>
    );
};

export default AccessDenied;
