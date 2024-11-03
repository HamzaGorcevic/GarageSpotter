import React, { useState, useContext, useEffect } from "react";
import styles from "./editProfile.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";

const EditProfile = () => {
    const { authData, updateUser } = useContext(AuthContext);
    const [form, setForm] = useState({
        name: authData.user?.name,
        email: authData.user?.email,
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        } else {
            console.error("Failed to update profile");
        }
    };

    return (
        <div className={styles.container}>
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
                    <button type="submit" className={styles.submitButton}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
