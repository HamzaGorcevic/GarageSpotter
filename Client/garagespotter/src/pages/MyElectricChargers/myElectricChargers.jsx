import React, { useState, useEffect, useContext } from "react";
import styles from "./electricChargers.module.scss";
import { BASE_URL } from "../../config/config";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyElectricChargers = () => {
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
                                <strong>Availble chargers:</strong>{" "}
                                {charger?.availableSpots}
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

export default MyElectricChargers;
