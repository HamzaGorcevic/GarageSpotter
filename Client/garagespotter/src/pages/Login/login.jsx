import React, { useState } from "react";
import styles from "./Login.module.scss";
import { BASE_URL } from "../../config/config";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const { login } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch(`${BASE_URL}/Auth/Login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const res = await response.json();
        login(res.value, { email: form.email });
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
                <p>Forgot password ?</p>
                <button type="submit" className={styles.submitButton}>
                    {" "}
                    {/* Use styles for submit button */}
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
