import React, { useState } from "react";
import styles from "./resetPassword.module.scss";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config/config";
const ResetPassword = () => {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${BASE_URL}/Auth/reset-password-request?email=${encodeURIComponent(
                    email
                )}`,
                {
                    method: "GET",
                }
            );
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send reset link");
            }

            toast.success("Reset link sent to email");
        } catch (err) {
            console.error(err);
            toast.error("Failed to send reset link");
        }
    };

    return (
        <div className={styles.resetContainer}>
            <h2 className={styles.title}>Reset Password</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Send Reset Link
                </button>
                <p>
                    <a href="/login">Back to login</a>
                </p>
            </form>
        </div>
    );
};

export default ResetPassword;
