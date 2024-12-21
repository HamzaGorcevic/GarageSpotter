import React, { useState, useEffect, useContext } from "react";
import styles from "./electricChargers.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Loading } from "../../components/Loader/loader";

const MyElectricChargers = () => {
    const { authData } = useContext(AuthContext);
    const [chargers, setChargers] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    // Fetch chargers
    const getElectricChargers = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${BASE_URL}/ElectricCharger/getOwnerElectricChargers`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            if (response.ok) {
                const res = await response.json();
                setChargers(res?.value);
                setLoading(false);
            } else {
                console.error("Failed to fetch electric chargers");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching electric chargers:", error);
        }
    };

    // Delete a charger
    const handleChargerDelete = async (chargerId) => {
        try {
            const response = await fetch(
                `${BASE_URL}/ElectricCharger/deleteElectricCharger?chargerId=${chargerId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${authData.token}`,
                    },
                }
            );

            if (response.ok) {
                setChargers((prev) =>
                    prev.filter((charger) => charger.id !== chargerId)
                );
                console.log("Electric charger deleted successfully");
            } else {
                console.error("Failed to delete electric charger");
            }
        } catch (error) {
            console.error("Error deleting electric charger:", error);
        }
    };

    useEffect(() => {
        if (authData?.token) {
            getElectricChargers();
        }
    }, [authData]);

    return !loading ? (
        <div className={styles.container}>
            <h1 className={styles.title}>My Electric Chargers</h1>
            <div className={styles.chargerList}>
                {!chargers || chargers?.length === 0 ? (
                    <p className={styles.noChargers}>
                        No electric chargers available.
                    </p>
                ) : (
                    chargers?.map((charger) => (
                        <div className={styles.chargerCard} key={charger.id}>
                            <h2 className={styles.locationName}>
                                {charger.name}, {charger.countryName}
                            </h2>
                            <p>
                                <strong>Price per kWh:</strong> ${charger.price}
                            </p>
                            <p>
                                <strong>Is verified:</strong>{" "}
                                {charger.isVerified ? "Yes" : "Pending ..."}
                            </p>
                            <p>
                                <strong>Description:</strong>{" "}
                                {charger?.description}
                            </p>
                            <p>
                                <strong>Available chargers:</strong>{" "}
                                {charger?.availableSpots}
                            </p>
                            <p>
                                <strong>Latitude:</strong> {charger.latitude},{" "}
                                <strong>Longitude:</strong> {charger.longitude}
                            </p>
                            <button
                                className={styles.addBtn}
                                onClick={() =>
                                    navigate(`/update/charger/${charger.id}`)
                                }
                            >
                                Edit
                            </button>
                            <button
                                className={styles.deleteBtn}
                                onClick={() => handleChargerDelete(charger.id)}
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

export default MyElectricChargers;
