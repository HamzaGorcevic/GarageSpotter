import { useState } from "react";
import { BASE_URL } from "../config/config";
import toast from "react-hot-toast";

const useLogin = (login) => {
    const [loading, setLoading] = useState(false);

    const loginUser = async (form) => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/Auth/Login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const res = await response.json();
            setLoading(false);

            if (res.success) {
                login(res.value, { email: form.email });
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch (error) {
            setLoading(false);
            toast.error("An error occurred during login. Please try again.");
            console.error("Login error:", error);
        }
    };

    return { loginUser, loading };
};

export default useLogin;
