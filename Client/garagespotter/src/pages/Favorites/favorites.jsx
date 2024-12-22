import React, { useContext } from "react";
import styles from "./favorites.module.scss";
import { AuthContext } from "../../context/AuthContext";
import { Loading } from "../../components/Loader/loader";
import useFavorites from "../../hooks/useFavorites";

const Favorites = () => {
    const { authData } = useContext(AuthContext);
    const { favoriteSpots, loading, removeFromFavorites } = useFavorites(
        authData.token
    );

    const handleRemoveFromFavorites = async (spotId) => {
        try {
            await removeFromFavorites(spotId);
        } catch (error) {
            alert("Failed to remove spot from favorites: " + error.message);
        }
    };

    if (loading) {
        return <Loading />;
    }

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
                            {spot.garageImages?.length > 0 && (
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
                                onClick={() =>
                                    handleRemoveFromFavorites(spot.id)
                                }
                            >
                                Remove From Favorites
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Favorites;
