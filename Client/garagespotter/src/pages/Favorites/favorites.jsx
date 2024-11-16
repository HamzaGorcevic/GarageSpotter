import React, { useState, useEffect, useContext } from "react";
import styles from "./favorites.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
    const { authData } = useContext(AuthContext);
    const [favoriteSpots, setFavoriteSpots] = useState([]);

    // Function to fetch favorite spots
    const getFavoriteSpots = async () => {
        try {
            const response = await fetch(`${BASE_URL}/User/favoriteSpots`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch favorite spots");
            }

            const res = await response.json();
            console.log("Values", res.value);
            setFavoriteSpots(res?.value);
        } catch (error) {
            console.error("Error fetching favorite spots:", error);
        }
    };

    // Function to remove a spot from favorites
    const removeFromFavorites = async (spotId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/User/removeFromFavorites?garageSpotId=${spotId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            const res = await response.json();
            if (res.success) {
                getFavoriteSpots();
            } else {
                alert("Error removing favorite spot: " + res.message);
            }
        } catch (error) {
            console.error("Error removing favorite spot:", error);
            alert("Failed to remove spot from favorites");
        }
    };

    useEffect(() => {
        if (authData?.token) {
            getFavoriteSpots();
        }
    }, [authData]);
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Favorite Spots</h1>
            <div className={styles.favoritesList}>
                {!favoriteSpots || favoriteSpots.length === 0 ? (
                    <p className={styles.noFavorites}>
                        No favorite spots available.
                    </p>
                ) : (
                    favoriteSpots.map((spot) => (
                        <div className={styles.favoriteCard} key={spot.id}>
                            <h2 className={styles.locationName}>
                                {spot.name}, {spot.countryName}
                            </h2>
                            <p>
                                <strong>Description:</strong>{" "}
                                {spot?.description}
                            </p>
                            <p>
                                <strong>Latitude:</strong> {spot.latitude},{" "}
                                <strong>Longitude:</strong> {spot.longitude}
                            </p>
                            <button
                                className={styles.removeButton}
                                onClick={() => removeFromFavorites(spot.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Favorites;
