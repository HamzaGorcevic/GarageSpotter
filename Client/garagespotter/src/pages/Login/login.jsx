import React, { useState } from "react";
import styles from "./login.module.scss";
import { BASE_URL } from "../../config/config";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import toast from "react-hot-toast";
import useLogin from "../../hooks/useLogin";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const {loginUser,loading} = useLogin(login);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
            loginUser(form)
        
        };

    return (
        <div className={styles.loginContainer}>
            {" "}
            {/* Use the correct class name */}
            <h2 className={styles.title}>Login</h2>{" "}
            {/* Use the correct class name */}
            <form onSubmit={handleSubmit} className={styles.form}>
                {" "}
                {/* Use styles for form */}
                <div className={styles.formGroup}>
                    {" "}
                    {/* Use styles for form group */}
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
                    {" "}
                    {/* Use styles for form group */}
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
                <p><a href="/register">If you dont have account register here</a></p>
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
            </form>
        </div>
    );
};

export default Login;
