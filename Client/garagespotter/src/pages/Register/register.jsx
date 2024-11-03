import React, { useState } from "react";
import styles from "./Register.module.scss";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/config";
const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const response = await fetch(`${BASE_URL}/Auth/Register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });
        const res = await response.json();
        setIsSubmitting(false);
        navigate("/login");
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
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
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
