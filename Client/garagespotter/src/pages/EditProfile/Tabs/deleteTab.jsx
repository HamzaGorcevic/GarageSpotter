import React, { useContext, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { deleteProfile } from "../../../utils/api/user";
import styles from "../editProfile.module.scss";
import { AuthContext } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const DeleteTab = () => {
    const { authData, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [deletePassword, setDeletePassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await deleteProfile(deletePassword, authData.token);
            if (res.success) {
                toast.success("Profile deleted successfully!");
                logout();
            } else {
                toast.error(res.message || "Failed to delete profile.");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the profile.");
        } finally {
            setLoading(false);
            setDeletePassword("");
        }
    };

    return (
        <>
            <h2 className={styles.title}>
                <AlertTriangle />
                Delete Account
            </h2>
            <p className={styles.description}>
                Warning: This action cannot be undone. Please be certain.
            </p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="deletePassword">Confirm Password</label>
                    <input
                        id="deletePassword"
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={styles.deleteBtn}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader2 className={styles.loadingSpinner} />
                            Deleting account...
                        </>
                    ) : (
                        "Delete Account"
                    )}
                </button>
            </form>
        </>
    );
};

export default DeleteTab;
