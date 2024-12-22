import { useState, useEffect } from "react";
import { BASE_URL } from "../config/config";

const useFavorites = (token) => {
    const [loading, setLoading] = useState(false);
    const [favoriteSpots, setFavoriteSpots] = useState([]);

    const getFavoriteSpots = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/User/favoriteSpots`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch favorite spots");
            }

            const res = await response.json();
            setFavoriteSpots(res?.value || []);
        } catch (error) {
            console.error("Error fetching favorite spots:", error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromFavorites = async (spotId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/User/removeFromFavorites?garageSpotId=${spotId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const res = await response.json();
            if (res.success) {
                // Refresh the favorites list
                getFavoriteSpots();
            } else {
                throw new Error(res.message);
            }
        } catch (error) {
            console.error("Error removing favorite spot:", error);
            throw error;
        }
    };

    useEffect(() => {
        if (token) {
            getFavoriteSpots();
        }
    }, [token]);

    return {
        favoriteSpots,
        loading,
        removeFromFavorites,
        refreshFavorites: getFavoriteSpots,
    };
};

export default useFavorites;
