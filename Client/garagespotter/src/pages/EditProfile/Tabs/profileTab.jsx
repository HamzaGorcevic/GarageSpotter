import React, { useContext, useState } from "react";
import { UserCircle, Loader2 } from "lucide-react";
import styles from "../editProfile.module.scss";
import { AuthContext } from "../../../context/AuthContext";

const ProfileTab = () => {
    const { authData, updateUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    console.log("auh", authData.user);
    const [form, setForm] = useState({
        name: authData.user?.name || "",
        email: authData.user?.email || "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await updateProfile(form, authData.token);
            if (res.success) {
                updateUser(res.value);
                toast.success("Profile updated successfully!");
            } else {
                toast.error("Failed to update profile. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h2 className={styles.title}>
                <UserCircle />
                Edit Profile
            </h2>
            <p className={styles.description}>
                Make changes to your profile information here
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
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
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className={styles.loadingSpinner} />
                            Saving...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </button>
            </form>
        </>
    );
};

export default ProfileTab;
