import { useState } from "react";
import { BASE_URL } from "../config/config";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

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

    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            setLoading(true);
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
                setLoading(false);
                if (data.success) {
                    login(data.value);
                    toast.success("Successfully logged in with Google!");
                } else {
                    toast.error(data.message || "Failed to login with Google");
                }
            } catch (error) {
                toast.error("An error occurred during Google login");
                console.error(error);
                setLoading(false);
            }
        },
        onError: () => {
            toast.error("Google login failed");
        },
    });
    return { loginUser, googleLogin, loading };
};

export default useLogin;
