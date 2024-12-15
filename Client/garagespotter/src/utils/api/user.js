import { BASE_URL } from "../../config/config";
export const updateProfile = async (data, token) => {
    const response = await fetch(`${BASE_URL}/User/edit`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return response.json();
};

export const changePassword = async (data, token) => {
    const response = await fetch(`${BASE_URL}/User/changePassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return response.json();
};

export const deleteProfile = async (password, token) => {
    const response = await fetch(`${BASE_URL}/User/deleteProfile`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
    });

    return response.json();
};

export const updatePassword = async (password, token) => {
    const response = await fetch(`${BASE_URL}/User/updatePassword`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(password),
    });

    return response.json();
};
