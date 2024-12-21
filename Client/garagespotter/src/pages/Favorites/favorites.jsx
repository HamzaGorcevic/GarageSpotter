import React, { useState, useEffect, useContext } from "react";
import styles from "./favorites.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loader/loader";

const Favorites = () => {
    const { authData } = useContext(AuthContext);
    const [favoriteSpots, setFavoriteSpots] = useState([]);
    const [loading, setLoading] = useState(false);
    // Function to fetch favorite spots
    const getFavoriteSpots = async () => {
        setLoading(true);
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
            setLoading(false);
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

    return !loading ? (
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
                                {spot.locationName}, {spot.countryName}
                            </h2>

                            <p>
                                <strong>Latitude:</strong> {spot.latitude},{" "}
                                <strong>Longitude:</strong> {spot.longitude}
                            </p>
                            <p>
                                <strong>Number of Spots:</strong>{" "}
                                {spot.totalSpots.length}
                            </p>
                            <p>
                                <strong>Price:</strong> ${spot.price}
                            </p>
                            {spot.garageImages &&
                                spot.garageImages.length > 0 && (
                                    <div className={styles.imageGallery}>
                                        <strong>Images:</strong>
                                        <div className={styles.images}>
                                            {spot.garageImages.map(
                                                (image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Garage image ${
                                                            index + 1
                                                        }`}
                                                        className={
                                                            styles.garageImage
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            <button
                                className={styles.removeButton}
                                onClick={() => removeFromFavorites(spot.id)}
                            >
                                Remove From Favorites
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default Favorites;
