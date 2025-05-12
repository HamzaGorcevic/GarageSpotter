import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./resetPassword.module.scss";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config/config";

const ResetPasswordForm = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/Auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to reset password");
            }

            toast.success("Password reset successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to reset password");
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Reset Password</h2>
                <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordForm;
