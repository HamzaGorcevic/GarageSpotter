import React, { useState, useContext } from "react";
import styles from "./editProfile.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";

const EditProfile = () => {
    const { authData, updateUser } = useContext(AuthContext);
    const [form, setForm] = useState({
        name: authData.user?.name,
        email: authData.user?.email,
    });
    const [loading, setLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [activeTab, setActiveTab] = useState("editProfile"); // New state for toggling tabs

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/User/edit`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                const res = await response.json();
                updateUser(res.value);
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to update profile. Please try again.");
                console.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
            console.error("Update profile error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        setPasswordError("");

        if (passwordForm.newPassword.length < 8) {
            setPasswordError(
                "New password must be at least 8 characters long."
            );
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/User/changePassword`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authData.token}`,
                },
                body: JSON.stringify(passwordForm),
            });

            const res = await response.json();
            if (res.success) {
                toast.success(res.message || "Password changed successfully!");
                setPasswordForm({ currentPassword: "", newPassword: "" });
            } else {
                const errorMsg =
                    res.message ||
                    "Failed to change password. Please try again.";
                setPasswordError(errorMsg);
                toast.error(errorMsg);
            }
        } catch (error) {
            setPasswordError("An error occurred while changing password.");
            toast.error("An error occurred while changing password.");
            console.error("Change password error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.containerForm}>
                <div className={styles.header}>
                    <button
                        className={
                            activeTab === "editProfile"
                                ? styles.activeTab
                                : styles.tab
                        }
                        onClick={() => setActiveTab("editProfile")}
                    >
                        Edit Profile
                    </button>
                    <button
                        className={
                            activeTab === "changePassword"
                                ? styles.activeTab
                                : styles.tab
                        }
                        onClick={() => setActiveTab("changePassword")}
                    >
                        Change Password
                    </button>
                </div>

                {activeTab === "editProfile" && (
                    <div className={styles.editProfileContainer}>
                        <h2 className={styles.title}>Edit Profile</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {loading ? (
                                <button
                                    disabled
                                    className={styles.loadingSpinner}
                                >
                                    Loading ...
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                >
                                    {" "}
                                    Save Changes
                                </button>
                            )}
                        </form>
                    </div>
                )}

                {activeTab === "changePassword" && (
                    <div className={styles.editProfileContainer}>
                        <h2 className={styles.title}>Change Password</h2>
                        <form
                            onSubmit={handlePasswordSubmit}
                            className={styles.form}
                        >
                            <div className={styles.formGroup}>
                                <label htmlFor="currentPassword">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    name="currentPassword"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="newPassword">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />
                            </div>
                            {passwordError && (
                                <div className={styles.errorMessage}>
                                    {passwordError}
                                </div>
                            )}

                            {loading ? (
                                <button
                                    disabled
                                    className={styles.loadingSpinner}
                                >
                                    Loading ...
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className={styles.submitButton}
                                >
                                    {" "}
                                    Change Password
                                </button>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProfile;
