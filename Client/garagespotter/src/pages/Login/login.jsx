import React, { useState, useContext } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Eye, EyeOff } from "lucide-react";
import styles from "./login.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import useLogin from "../../hooks/useLogin";
import GoogleSvg from "../../assets/google.svg";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const { loginUser, loading } = useLogin(login);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        loginUser({ ...form, isGoogleLogin: false });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    <div className={styles.passwordInputWrapper}>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className={styles.passwordInput}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className={styles.passwordToggle}
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
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
                    <img
                        src={GoogleSvg}
                        alt="Google Icon"
                        width="30"
                        height="30"
                    />
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
