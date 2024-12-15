import React, { useContext, useState } from "react";
import { KeyRound, Loader2 } from "lucide-react";
import styles from "./editProfile.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { updatePassword } from "../../utils/api/user";
import toast from "react-hot-toast";

const NewUserPassword = () => {
    const { authData, updateUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [newUserPassword, setNewUserPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await updatePassword(newUserPassword, authData.token);
            if (res.success) {
                toast.success("Password set successfully!");
                updateUser({ ...authData.user, passwordVerification: true });
            } else {
                toast.error("Failed to set password.");
            }
        } catch (error) {
            toast.error("An error occurred while setting the password.");
        } finally {
            setLoading(false);
            setNewUserPassword("");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.newPasswordContainer}>
                <h2 className={styles.title}>
                    <KeyRound />
                    Set Your Password
                </h2>
                <p className={styles.description}>
                    Please set a password to secure your account
                </p>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="newUserPassword">New Password</label>
                        <input
                            id="newUserPassword"
                            type="password"
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            placeholder="Enter your new password"
                            required
                            minLength={8}
                        />
                    </div>
                    <button
                        type="submit"
                        className={styles.addBtn}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className={styles.loadingSpinner} />
                                Setting password...
                            </>
                        ) : (
                            "Set Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default NewUserPassword;
