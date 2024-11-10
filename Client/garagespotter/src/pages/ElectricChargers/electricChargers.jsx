import React, { useState, useEffect, useContext } from "react";
import styles from "./electricChargers.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ElectricChargers = () => {
    const { authData } = useContext(AuthContext);
    const [chargers, setChargers] = useState([]);
    const navigate = useNavigate();

    const getElectricChargers = async () => {
        const response = await fetch(
            `${BASE_URL}/ElectricCharger/getOwnerElectricChargers`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authData.token}`,
                },
            }
        );
        const res = await response.json();
        setChargers(res?.value);
    };

    useEffect(() => {
        if (authData?.token) {
            getElectricChargers();
        }
    }, [authData]);

    return (
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
                                {charger.locationName}, {charger.countryName}
                            </h2>
                            <p>
                                <strong>Price per kWh:</strong> $
                                {charger.pricePerKwh}
                            </p>
                            <p>
                                <strong>Available:</strong>{" "}
                                {charger.isAvailable ? "Yes" : "No"}
                            </p>
                            <p>
                                <strong>Connector Type:</strong>{" "}
                                {charger.connectorType}
                            </p>
                            <p>
                                <strong>Latitude:</strong> {charger.latitude},{" "}
                                <strong>Longitude:</strong> {charger.longitude}
                            </p>
                            <button
                                className={styles.editButton}
                                onClick={() =>
                                    navigate(`/update/charger/${charger.id}`)
                                }
                            >
                                Edit
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ElectricChargers;
