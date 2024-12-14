import React, { useContext, useState } from "react";
import { KeyRound, Loader2, AlertTriangle } from "lucide-react";
import styles from "../editProfile.module.scss";
import { AuthContext } from "../../../context/AuthContext";
import { changePassword } from "../../../utils/api/user";
import toast from "react-hot-toast";

const PasswordTab = () => {
    const { authData } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");

    const handleChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPasswordError("");

        if (passwordForm.newPassword.length < 8) {
            setPasswordError(
                "New password must be at least 8 characters long."
            );
            toast.error("New password must be at least 8 characters long.");
            setLoading(false);
            return;
        }

        try {
            console.log(authData.token);
            const res = await changePassword(passwordForm, authData.token);
            if (res.success) {
                toast.success("Password changed successfully!");
                setPasswordForm({ currentPassword: "", newPassword: "" });
            } else {
                setPasswordError(res.message || "Failed to change password.");
                toast.error(res.message || "Failed to change password.");
            }
        } catch (error) {
            toast.error(
                "An error occurred while changing the password." + error
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className={styles.title}>
                <KeyRound />
                Change Password
            </h2>
            <p className={styles.description}>
                Update your password to keep your account secure
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={handleChange}
                        required
                    />
                </div>
                {passwordError && (
                    <div className={styles.errorMessage}>
                        <AlertTriangle />
                        {passwordError}
                    </div>
                )}
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className={styles.loadingSpinner} />
                            Changing password...
                        </>
                    ) : (
                        "Change Password"
                    )}
                </button>
            </form>
        </>
    );
};

export default PasswordTab;
