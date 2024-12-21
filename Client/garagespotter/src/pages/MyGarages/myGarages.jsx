import React, { useState, useEffect, useContext } from "react";
import styles from "./myGarages.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loader/loader";

const MyGarages = () => {
    const { authData } = useContext(AuthContext);
    const [garageSpots, setGarageSpots] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // Fetch garage spots
    const getMyGarages = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}/GarageSpot/getOwnerGarageSpots`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );
            if (response.ok) {
                const res = await response.json();
                setGarageSpots(res?.value);
                setLoading(false);
            } else {
                setLoading(false);
                console.error("Failed to fetch garage spots");
            }
        } catch (error) {
            console.error("Error fetching garage spots:", error);
        }
    };

    const handleGarageDelete = async (spotId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/GarageSpot/deleteGarageSpot?spotId=${spotId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            if (response.ok) {
                setGarageSpots((prev) =>
                    prev.filter((garage) => garage.id !== spotId)
                );
                console.log("Garage spot deleted successfully");
            } else {
                console.error("Failed to delete garage spot");
            }
        } catch (error) {
            console.error("Error deleting garage spot:", error);
        }
    };

    useEffect(() => {
        if (authData?.token) {
            getMyGarages();
        }
    }, [authData]);

    return !loading ? (
        <div className={styles.container}>
            <h1 className={styles.title}>My Garages</h1>
            <div className={styles.garageList}>
                {!garageSpots || garageSpots?.length === 0 ? (
                    <p className={styles.noGarages}>
                        No garage spots available.
                    </p>
                ) : (
                    garageSpots?.map((garage) => (
                        <div className={styles.garageCard} key={garage.id}>
                            <h2 className={styles.locationName}>
                                {garage.locationName}, {garage.countryName}
                            </h2>
                            <p>
                                <strong>Price:</strong> ${garage.price}
                            </p>

                            <p>
                                <strong>Is verified:</strong>{" "}
                                {garage.isVerified ? "Yes" : "Pending ..."}
                            </p>
                            <p>
                                <strong>Total Spots:</strong>{" "}
                                {garage.totalSpots.length}
                            </p>
                            <p>
                                <strong>Latitude:</strong> {garage.latitude},{" "}
                                <strong>Longitude:</strong> {garage.longitude}
                            </p>
                            <button
                                className={styles.addBtn}
                                onClick={() => navigate(`/update/${garage.id}`)}
                            >
                                Edit
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleGarageDelete(garage.id)}
                            >
                                Delete
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

export default MyGarages;
