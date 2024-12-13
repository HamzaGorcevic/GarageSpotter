import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import styles from "./register.module.scss";
import { BASE_URL } from "../../config/config";
import toast from "react-hot-toast";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!/^[a-zA-Z0-9]{3,}$/.test(form.name)) {
            newErrors.name =
                "Username must be at least 3 characters and alphanumeric.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Please enter a valid email address.";
        }

        if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/Auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...form,
                    isGoogleLogin: false,
                }),
            });

            const res = await response.json();
            setLoading(false);

            if (res.success) {
                toast.success(
                    "Registration successful! Redirecting to login..."
                );
                navigate("/login");
            } else {
                toast.error(
                    res.message || "Registration failed. Please try again."
                );
            }
        } catch (error) {
            setLoading(false);
            toast.error(
                "An error occurred during registration. Please try again."
            );
            console.error("Registration error:", error);
        }
    };

    const googleRegister = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await fetch(`${BASE_URL}/Auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        isGoogleLogin: true,
                        googleToken: response.access_token,
                    }),
                });

                const data = await res.json();

                if (data.success) {
                    toast.success("Successfully registered with Google!");
                    navigate("/login");
                } else {
                    toast.error(
                        data.message || "Failed to register with Google"
                    );
                }
            } catch (error) {
                toast.error("An error occurred during Google registration");
                console.error(error);
            }
        },
        onError: () => {
            toast.error("Google registration failed");
        },
    });

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
                    {errors.name && (
                        <p className={styles.error}>{errors.name}</p>
                    )}
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
                    {errors.email && (
                        <p className={styles.error}>{errors.email}</p>
                    )}
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
                    {errors.password && (
                        <p className={styles.error}>{errors.password}</p>
                    )}
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

                <button
                    type="button"
                    onClick={() => googleRegister()}
                    className={`${styles.submitButton} ${styles.googleButton}`}
                >
                    Register with Google
                </button>
            </form>
        </div>
    );
};

export default Register;
