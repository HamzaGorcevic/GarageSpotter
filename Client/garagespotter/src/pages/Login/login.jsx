import React, { useState, useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import styles from "./login.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const { loginUser, loading } = useLogin(login);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        loginUser({ ...form, isGoogleLogin: false });
    };

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const res = await fetch(`${BASE_URL}/Auth/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: "",
                        password: "",
                        isGoogleLogin: true,
                        googleToken: response.access_token,
                    }),
                });

                const data = await res.json();

                if (data.success) {
                    login(data.value);
                    toast.success("Successfully logged in with Google!");
                } else {
                    toast.error(data.message || "Failed to login with Google");
                }
            } catch (error) {
                toast.error("An error occurred during Google login");
                console.error(error);
            }
        },
        onError: () => {
            toast.error("Google login failed");
        },
    });

    return (
        <div className={styles.loginContainer}>
            <h2 className={styles.title}>Login</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                        "Login"
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => googleLogin()}
                    className={`${styles.submitButton} ${styles.googleButton}`}
                >
                    Sign in with Google
                </button>

                <p>
                    <a href="/register">
                        If you don't have an account register here
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
