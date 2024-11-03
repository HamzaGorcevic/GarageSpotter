import React from "react";
import styles from "./notFound.module.scss";
import { useNavigate } from "react-router-dom";

export const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className={styles.notFoundContainer}>
            <h1 className={styles.notFoundTitle}>404 - Page Not Found</h1>
            <p className={styles.notFoundText}>
                The page you are looking for does not exist.
            </p>
            <button className={styles.goHomeButton} onClick={handleGoHome}>
                Go Home
            </button>
        </div>
    );
};
