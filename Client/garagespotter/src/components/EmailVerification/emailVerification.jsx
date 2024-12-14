import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/config";
import toast from "react-hot-toast";
import styles from "./emailVerification.module.scss";

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const [verifying, setVerifying] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get("token");
            if (!token) {
                toast.error("Invalid verification link");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    `${BASE_URL}/Auth/verify-email?token=${token}`
                );
                const data = await response.json();

                if (data.success) {
                    toast.success("Email verified successfully!");
                    navigate("/login");
                } else {
                    toast.error(data.message || "Verification failed");
                    navigate("/login");
                }
            } catch (error) {
                console.error("Verification error:", error);
                toast.error("An error occurred during verification");
                navigate("/login");
            } finally {
                setVerifying(false);
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className={styles.verificationContainer}>
            {verifying ? (
                <div className={styles.verifying}>
                    <div className={styles.spinner}></div>
                    <p>Verifying your email...</p>
                </div>
            ) : null}
        </div>
    );
};

export default EmailVerification;
