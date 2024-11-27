import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./register.module.scss";
import { BASE_URL } from "../../config/config";
import toast from "react-hot-toast";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setloading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            return;
        }

        setloading(true);

        try {
            const response = await fetch(`${BASE_URL}/Auth/Register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const res = await response.json();
            setloading(false);

            if (response.ok) {
                toast.success(
                    "Registration successful! Redirecting to login..."
                );
                navigate("/login");
            } else {
                const errorMessage =
                    res.message || "Registration failed. Please try again.";
                toast.error(errorMessage);
            }
        } catch (error) {
            setloading(false);
            toast.error(
                "An error occurred during registration. Please try again."
            );
            console.error("Registration error:", error);
        }
    };

    return (
        <div className={styles.registerContainer}>
            <h2 className={styles.title}>Register</h2>
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
                <div className={styles.formGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                >
                    {loading ? (
                        <div className={styles.loadingSpinner}></div>
                    ) : (
                        "Register"
                    )}
                </button>
            </form>
        </div>
    );
};

export default Register;
